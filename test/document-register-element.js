wru.test(typeof document === 'undefined' ? [] : [
  {
    name: "main",
    test: function () {
      wru.assert('registerElement exists', document.registerElement);

      var XDirect = window.XDirect = document.registerElement(
        'x-direct',
        {
          prototype: Object.create(
            HTMLDivElement.prototype, {
            createdCallback: {value: function() {
              this._info = [{
                type: 'created',
                arguments: arguments
              }];
            }},
            attachedCallback: {value: function() {
              this._info.push({
                type: 'attached',
                arguments: arguments
              });
            }},
            detachedCallback: {value: function() {
              this._info.push({
                type: 'detached',
                arguments: arguments
              });
            }},
            attributeChangedCallback: {value: function(
              name,           // always present
              previousValue,  // if null, it's a new attribute
              value           // if null, it's a removed attribute
            ) {
              this._info.push({
                type: 'attributeChanged',
                arguments: arguments
              });
            }}
          })
        }
      );

      var XIndirect = window.XIndirect = document.registerElement(
        'x-indirect',
        {
          'extends': 'div',
          prototype: Object.create(
            HTMLDivElement.prototype, {
            createdCallback: {value: function() {
              this._info = [{
                type: 'created',
                arguments: arguments
              }];
            }},
            attachedCallback: {value: function() {
              this._info.push({
                type: 'attached',
                arguments: arguments
              });
            }},
            detachedCallback: {value: function() {
              this._info.push({
                type: 'detached',
                arguments: arguments
              });
            }},
            attributeChangedCallback: {value: function(
              name,           // always present
              previousValue,  // if null, it's a new attribute
              value           // if null, it's a removed attribute
            ) {
              this._info.push({
                type: 'attributeChanged',
                arguments: arguments
              });
            }}
          })
        }
      );

      wru.assert('registerElement returns a function',
        typeof XDirect === 'function' &&
        typeof XIndirect === 'function'
      );

    }
  },{
    name: 'as XDirect constructor',
    test: function () {
      var node = document.body.appendChild(new XDirect);
      wru.assert('right name', node.nodeName === 'X-DIRECT');
      wru.assert('createdInvoked', node._info[0].type === 'created');
    }
  },{
    name: 'as XIndirect constructor',
    test: function () {
      var node = document.body.appendChild(new XIndirect);
      wru.assert('right name', node.nodeName === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      wru.assert('createdInvoked', node._info[0].type === 'created');
    }
  },{
    name: 'as &lt;x-direct&gt; innerHTML',
    test: function () {
      var node = document.body.appendChild(document.createElement('div'));
      node.innerHTML = '<x-direct></x-direct>';
      node = node.firstChild;
      wru.assert('right name', node.nodeName === 'X-DIRECT');
      setTimeout(wru.async(function(){
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function(){
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }));
      }));
    }
  },{
    name: 'as &lt;x-indirect&gt; innerHTML',
    test: function () {
      var node = document.body.appendChild(document.createElement('div'));
      node.innerHTML = '<div is="x-indirect"></div>';
      node = node.firstChild;
      wru.assert('right name', node.nodeName === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }));
      }));
    }
  },{
    name: 'as createElement(x-direct) innerHTML',
    test: function () {
      var node = document.body.appendChild(document.createElement('div')).appendChild(
        document.createElement('x-direct')
      );
      wru.assert('right name', node.nodeName === 'X-DIRECT');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }));
      }));
    }
  },{
    name: 'as createElement(div, x-indirect) innerHTML',
    test: function () {
      var node = document.body.appendChild(document.createElement('div')).appendChild(
        document.createElement('div', 'x-indirect')
      );
      wru.assert('right name', node.nodeName === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }));
      }));
    }
  },{
    name: 'attributes',
    test: function () {
      var args, node = document.body.appendChild(document.createElement('div')).appendChild(
        document.createElement('x-direct')
      );
      node.setAttribute('what', 'ever');
      setTimeout(wru.async(function () {
        wru.assert('attributeChanged was called', node._info[2].type === 'attributeChanged');
        args = node._info[2].arguments;
        wru.assert('correct arguments with new value', args[0] === 'what' && args[1] == null && args[2] === 'ever');
        node.setAttribute('what', 'else');
        setTimeout(wru.async(function () {
          args = node._info[3].arguments;
          wru.assert('correct arguments with old value', args[0] === 'what' && args[1] === 'ever' && args[2] === 'else');
          node.removeAttribute('what');
          setTimeout(wru.async(function () {
            args = node._info[4].arguments;
            wru.assert(
              'correct arguments with removed attribute',
              args[0] === 'what' &&
              args[1] === 'else' &&
              args[2] == null
            );
            document.body.removeChild(node.parentNode);
          }));
        }));
      }));
    }
  },{
    name: 'offline',
    test: function () {
      var args, node = document.createElement('x-direct');
      node.setAttribute('what', 'ever');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attributeChanged was called', node._info[1].type === 'attributeChanged');
        args = node._info[1].arguments;
        wru.assert('correct arguments with new value', args[0] === 'what' && args[1] == null && args[2] === 'ever');
        node.setAttribute('what', 'else');
        setTimeout(wru.async(function () {
          args = node._info[2].arguments;
          wru.assert('correct arguments with old value', args[0] === 'what' && args[1] === 'ever' && args[2] === 'else');
          node.removeAttribute('what');
          setTimeout(wru.async(function () {
            args = node._info[3].arguments;
            wru.assert(
              'correct arguments with removed attribute',
              args[0] === 'what' &&
              args[1] === 'else' &&
              args[2] == null
            );
          }));
        }));
      }));
    }
  },{
    name: 'className',
    test: function () {
      var args, node = document.createElement('x-direct');
      node.className = 'a';
      setTimeout(wru.async(function () {
        wru.assert('attributeChanged was called', node._info[1].type === 'attributeChanged');
        args = node._info[1].arguments;
        wru.assert('correct arguments with new value', args[0] === 'class' && args[1] == null && args[2] === 'a');
        node.className += ' b';
        setTimeout(wru.async(function () {
          wru.assert('attributeChanged was called', node._info[2].type === 'attributeChanged');
          args = node._info[2].arguments;
          wru.assert('correct arguments with new value', args[0] === 'class' && args[1] == 'a' && args[2] === 'a b');
        }));
      }));
    }
  }
]);
