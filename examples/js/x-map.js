(function (g) {'use strict';

  var loadingLeafLet = false;

  document.registerElement('x-map', {
    'extends': 'img',
    prototype: Object.create(
      HTMLImageElement.prototype,
      {
        createdCallback: {
          value: function () {
            var xMap;
            if (!g.L) {
              if (!loadingLeafLet) {
                loadingLeafLet = true;
                loadLeafLet();
              }
              listen(this, true);
            } else {
              listen(this, false);
              xMap = document.createElement('x-map');
              this.replaceWith(xMap);
              renderMap(xMap, this.srcToGeoData());
            }
          }
        },
        srcToGeoData: {
          value: function () {
            var title = (this.title || '').split(/\s*&\s*/);
            return this.src
              .slice(
                this.src.indexOf('?') + 1
              )
              .split('&')
              .reduce(function (data, info) {
                var
                  i = info.indexOf('='),
                  key = info.slice(0, i),
                  value = info.slice(i + 1)
                ;
                switch (key) {
                  case 'center':
                    data[key] = value.split(',').map(parseFloat);
                    break;
                  case 'markers':
                    data[key] = value.split('|').map(function (value, i) {
                      return {
                        center: value.split(',').slice(0, 2).map(parseFloat),
                        title: title[i]
                      };
                    });
                    break;
                  case 'size':
                    data[key] = value.split('x').reduce(function (size, value, i) {
                      size[i ? 'height' : 'width'] = parseInt(value, 10);
                      return size;
                    }, {});
                    break;
                  case 'zoom':
                    data[key] = parseInt(value, 10);
                    break;
                  default:
                    data[key] = value;
                    break;
                }
                return data;
              },
              {}
            );
          }
        }
      }
    )
  });

  function loadLeafLet() {
    var
      head = document.head,
      link = document.createElement('link'),
      script = document.createElement('script'),
      onload = function () {
        script.remove();
        Array.prototype.forEach.call(
          document.querySelectorAll('img[is=x-map]'),
          function (xMap) {
            xMap.dispatchEvent(this);
          },
          new CustomEvent('leaflet:loaded')
        );
      }
    ;
    link.rel = 'stylesheet';
    link.href = '//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css';
    script.type = 'application/javascript';
    script.src = '//cdn.leafletjs.com/leaflet-0.7.3/leaflet.js';
    script.onload = onload;
    oldStyleOnLoad(script, onload);
    head.insertBefore(script, head.firstChild);
    head.insertBefore(link, script);
  }

  function listen(img, add) {
    var sfx = 'EventListener';
    img[(add ? 'add' : 'remove') + sfx](
      'leaflet:loaded',
      img.createdCallback,
      false
    );
  }

  function renderMap(xMap, data) {
    var
      target = xMap.appendChild(
        document.createElement('div')
      ),
      tiles = '//otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',
      attribution = ''.concat(
        'Map Tiles <a href="',
          '//open.mapquest.com/',
        '">&copy; Open MapQuest</a>'
      ),
      map
    ;
    target.style.cssText = ''.concat(
      'width:', data.size.width, 'px;',
      'height:', data.size.height, 'px;'
    );
    map = L.map(target, {
      scrollWheelZoom: false,
      center: data.center,
      zoom: data.zoom
    });
    L.tileLayer(
      tiles,
      {
        attribution: attribution,
        maxZoom: 18,
        minZoom: 3
      }
    ).addTo(map);
    (data.markers || Array.prototype).forEach(
      function (info) {
        var marker = L.marker(info.center).addTo(map);
        if (info.title) {
          marker.bindPopup(info.title);
        }
      }
    );
  }

  function oldStyleOnLoad(script, onload) {
    script.type = 'text/javascript';
    script.onreadystatechange = function () {
      if(/loaded|complete/.test(script.readyState)) {
        script.onreadystatechange = script.onload = Object;
        setTimeout(onload, 10);
      }
    };
  }

}(window));