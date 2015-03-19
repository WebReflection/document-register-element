(function () {'use strict';

  var
    secret = '_x-bind_' + Math.random() + ':',
    increment = 0,
    handleEvent = {
      configurable: false,
      enumerable: false,
      writable: false,
      value: function (e) {
        var
          detail = e.detail,
          id = detail.id,
          value = detail.value
        ;
        if (value != this[id]) {
          if (value == null) {
            delete this[id];
          } else {
            this[id] = value;
          }
        }
      }
    }
  ;

  document.registerElement('x-bind', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attributeChangedCallback: {
          value: function (id, oldVal, newVal) {
            this.dispatchEvent(
              new CustomEvent(
                secret,
                {detail: {
                  id: id,
                  value: newVal
                }}
              )
            );
          }
        },
        bindTo: {
          value: function (obj) {
            var
              self = this,
              contract = secret.concat(
                ++increment,
                Math.random()
              )
            ;
            Object
              .keys(obj)
              .forEach(
                function (id) {
                  self.setAttribute(id, obj[id]);
                  obj.watch(id, this);
                },
                function (id, oldVal, newVal) {
                  document.dispatchEvent(
                    new CustomEvent(
                      contract,
                      {detail: {
                        id: id,
                        value: newVal == null ?
                          newVal : ('' + newVal)
                      }}
                    )
                  );
                  return '' + newVal;
                }
              )
            ;
            self.addEventListener(
              secret,
              Object.defineProperty(
                obj,
                'handleEvent',
                handleEvent
              )
            );
            document.addEventListener(
              contract,
              self
            );
          }
        },
        handleEvent: {
          value: function (e) {
            var
              detail = e.detail,
              id = detail.id,
              value = detail.value,
              oldVal = this.getAttribute(id)
            ;
            if (oldVal != value) {
              if (value == null) {
                this.removeAttribute(id);
              } else {
                this.setAttribute(id, value);
              }
            }
          }
        }
      }
    )
  });

}());