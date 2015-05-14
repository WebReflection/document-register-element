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
  }//*/
]);
