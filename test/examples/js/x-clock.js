var XClock = (function () {'use strict';

  function rotate(deg) {
    return "rotate(" + deg + "deg)";
  }

  var counter = 0;

  return restyle.customElement(
    'x-clock',
    HTMLElement,
    {
      createdCallback: function () {
        // setup unique className
        ++counter;
        this.className = 'number-' + counter;
        this.css = restyle('x-clock.' + this.className, {});

        // inject the template
        this.innerHTML =
          "<div class='container'>" +
            "<div class='hour'></div>" +
            "<div class='minute'></div>" +
            "<div class='second'></div>" +
          "</div>";
      },
      attachedCallback: function () {
        // setup attributes as properties
        this.readAndSetAttributes();
        // update the clock
        this.updateClock();
        // in case there's not listener and no attributes values
        if (!this._i && !this.hour && !this.minute && !this.second) {
          // assumed as dynamic
          this._i = setInterval(function (self) {
            self.updateClock();
          }, 1000, this);
        }
      },
      detachedCallback: function () {
        // clean the F up!
        clearInterval(this._i || 0);
        this._i = 0;
      },
      attributeChangedCallback: function(attrName, oldVal, newVal) {
        if (/^(hour|minute|second)$/.test(attrName)) {
          this.readAndSetAttributes();
          this.updateClock();
        }
      },
      readAndSetAttributes: function() {
        this.hour = this.getAttribute("hour");
        this.minute = this.getAttribute("minute");
        this.second = this.getAttribute("second");
      },
      updateClock: function() {
        var
          now = new Date(),
          hour = this.hour || now.getHours(),
          minute = this.minute || now.getMinutes(),
          second = this.second || now.getSeconds(),
          secondAngle = second * 6,
          minuteAngle = minute * 6 + secondAngle / 60,
          hourAngle = ((hour % 12) / 12) * 360 + 90 + minute / 12
        ;

        // update specific CSS for this component only
        this.css.replace({
          '.hour': {
            transform: rotate(hourAngle)
          },
          '.minute': {
            transform: rotate(minuteAngle)
          },
          '.second': {
            transform: rotate(secondAngle)
          }
        });

      },
      css: {
        'x-clock': {
          display: 'block',
          width: 100,
          height: 100,
          position: 'relative',
          border: '6px solid black',
          'border-radius': '50%'
        },
        '.container::after': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 12,
          height: 12,
          margin: '-6px 0 0 -6px',
          background: 'black',
          'border-radius': 6,
          content: '""',
          display: 'block'
        },
        '.container > div': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          background: 'black'
        },
        '.hour': {
          margin: '-4px 0 -4px -25%',
          padding: '4px 0 4px 25%',
          'transform-origin': '100% 50%',
          'border-radius': '4px 0 0 4px'
        },
        '.minute': {
          margin: '-40% -3px 0',
          padding: '40% 3px 0',
          'transform-origin': '50% 100%',
          'border-radius': '3px 3px 0 0'
        },
        '.second': {
          margin: '-40% -1px 0 0',
          padding: '40% 1px 0',
          'transform-origin': '50% 100%'
        }
      }
    }
  );
}());