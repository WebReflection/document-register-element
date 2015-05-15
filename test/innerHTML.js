wru.test(typeof document === 'undefined' ? [] : [
  {
    name: 'innerHTML helper',
    test: function () {
      wru.assert(typeof innerHTML === 'function');
    }
  }, {
    name: 'innerHTML invoke createdCallback via type',
    test: function () {
      document.registerElement('inner-html', {
        prototype: Object.create(
          HTMLElement.prototype, {
            createdCallback: {
              value: wru.async(function () {
                wru.assert('invoked');
              })
            }
          }
        )
      });
      var div = innerHTML(
        document.createElement('div'),
        '<p><inner-html></inner-html></p>'
      );
    }
  }, {
    name: 'innerHTML invoke createdCallback via extends',
    test: function () {
      document.registerElement('typed-html', {
        'extends': 'div',
        prototype: Object.create(
          HTMLElement.prototype, {
            createdCallback: {
              value: wru.async(function () {
                wru.assert('invoked');
              })
            }
          }
        )
      });
      var div = innerHTML(
        document.createElement('div'),
        '<p><div is="typed-html"></div></p>'
      );
    }
  }, {
    name: 'innerHTML already registered elements still work',
    test: function () {
      var verify = wru.async(Object);
      var div = document.createElement('div');
      innerHTML(
        div,
        '<div is="typed-html"></div>' +
        '<inner-html></inner-html>'
      );
      wru.assert('correct typed node',
        div.childNodes[0].createdCallback && div.childNodes[0].getAttribute('is') === 'typed-html');
      wru.assert('correct x node',
        div.childNodes[1].createdCallback && div.childNodes[1].nodeName.toLowerCase() === 'inner-html');
    }
  }, {
    name: 'innerHTML with nested elements',
    test: function () {
      var times = 0;
      wru.async(Object);
      document.registerElement('custom-one', {
        prototype: Object.create(
          HTMLElement.prototype, {
            createdCallback: {
              value: function () {
                times++;
                this.setAttribute('created', 'one');
              }
            }
          }
        )
      });
      document.registerElement('custom-two', {
        prototype: Object.create(
          HTMLElement.prototype, {
            createdCallback: {
              value: function () {
                times++;
                this.setAttribute('created', 'two');
              }
            }
          }
        )
      });
      var div = innerHTML(
        document.createElement('div'),
        '<custom-one>' +
          '<custom-two>' +
            '<span></span>' +
          '</custom-two>' +
        '</custom-one>'
      );
      wru.assert('right amount of nodes',
        div.children.length === 1 &&
        div.firstElementChild.children.length === 1 &&
        !!div.querySelector('span')
      );
      setTimeout(wru.async(function () {
        wru.assert('nodes have been notified about creation',
          div.children[0].getAttribute('created') === 'one' &&
          div.children[0].children[0].getAttribute('created') === 'two' &&
          times === 2
        );
      }), 250);
    }
  }
]);
