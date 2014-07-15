wru.test(typeof document === 'undefined' ? [] : [
  {
    name: "main",
    test: function () {
      wru.assert('registerElement exists', document.registerElement);
      var XDirect = window.XDirect = document.registerElement(
        'x-direct',
        {
          prototype: Object.create(
            HTMLElement.prototype, {
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
      wru.assert('is instance',
        node instanceof XDirect ||
        // IE < 11 where setPrototypeOf is absent
        Object.getPrototypeOf(XDirect.prototype).isPrototypeOf(node)
      );
    }
  },{
    name: 'as XIndirect constructor',
    test: function () {
      var node = document.body.appendChild(new XIndirect);
      wru.assert('right name', node.nodeName === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      wru.assert('createdInvoked', node._info[0].type === 'created');
      wru.assert('is instance',
        node instanceof XIndirect ||
        // IE < 11 where setPrototypeOf is absent
        Object.getPrototypeOf(XIndirect.prototype).isPrototypeOf(node)
      );
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
    name: 'as &lt;div is="x-indirect"&gt; innerHTML',
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
    name: 'as createElement(x-direct)',
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
    name: 'as createElement(div, x-indirect)',
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
    name: 'nested',
    test: function () {
      var
        args,
        parentNode = document.createElement('div'),
        direct = parentNode.appendChild(
          document.createElement('x-direct')
        ),
        indirect = parentNode.appendChild(
          document.createElement('div', 'x-indirect')
        ),
        indirectNested = direct.appendChild(
          document.createElement('div', 'x-indirect')
        )
      ;
      document.body.appendChild(parentNode);
      setTimeout(wru.async(function () {
        wru.assert('all node created',
          direct._info[0].type === 'created' &&
          indirect._info[0].type === 'created' &&
          indirectNested._info[0].type === 'created'
        );
        wru.assert('all node attached',
          direct._info[1].type === 'attached' &&
          indirect._info[1].type === 'attached' &&
          indirectNested._info[1].type === 'attached'
        );
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
          // the only known device that fails this test is Blackberry 7
          wru.assert('attributeChanged was called', node._info[2].type === 'attributeChanged');
          args = node._info[2].arguments;
          wru.assert('correct arguments with new value', args[0] === 'class' && args[1] == 'a' && args[2] === 'a b');
        }));
      }));
    }
  },{
    name: 'registered after',
    test: function () {
      var
        node = document.body.appendChild(
          document.createElement('div')
        ),
        xd = node.appendChild(document.createElement('x-direct')),
        laterWeirdoElement = node.appendChild(
          document.createElement('later-weirdo')
        ),
        LaterWeirdo
      ;
      wru.assert('_info is not even present', !laterWeirdoElement._info);
      wru.assert('x-direct behaved regularly', xd._info);
      // now it's registered
      LaterWeirdo = document.registerElement(
        'later-weirdo',
        {
          prototype: Object.create(
            HTMLElement.prototype, {
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
      // later on this should be setup
      setTimeout(wru.async(function(){
        wru.assert('_info is now present', laterWeirdoElement._info);
        wru.assert('_info has right info',  laterWeirdoElement._info.length === 2 &&
                                            laterWeirdoElement._info[0].type === 'created' &&
                                            laterWeirdoElement._info[1].type === 'attached');
        
        wru.assert('xd has right info too', xd._info.length === 2 &&
                                            xd._info[0].type === 'created' &&
                                            xd._info[1].type === 'attached');
      }), 100);
    }
  }
]);
