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
      wru.assert('right name', node.nodeName.toUpperCase() === 'X-DIRECT');
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
      wru.assert('right name', node.nodeName.toUpperCase() === 'DIV');
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
      wru.assert('right name', node.nodeName.toUpperCase() === 'X-DIRECT');
      setTimeout(wru.async(function(){
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function(){
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }), 20);
      }), 20);
    }
  },{
    name: 'as &lt;div is="x-indirect"&gt; innerHTML',
    test: function () {
      var node = document.body.appendChild(document.createElement('div'));
      node.innerHTML = '<div is="x-indirect"></div>';
      node = node.firstChild;
      wru.assert('right name', node.nodeName.toUpperCase() === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }), 20);
      }), 20);
    }
  },{
    name: 'as createElement(x-direct)',
    test: function () {
      var node = document.body.appendChild(document.createElement('div')).appendChild(
        document.createElement('x-direct')
      );
      wru.assert('right name', node.nodeName.toUpperCase() === 'X-DIRECT');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }), 20);
      }), 20);
    }
  },{
    name: 'as createElement(div, x-indirect)',
    test: function () {
      var node = document.body.appendChild(document.createElement('div')).appendChild(
        document.createElement('div', 'x-indirect')
      );
      wru.assert('right name', node.nodeName.toUpperCase() === 'DIV');
      wru.assert('right type', node.getAttribute('is') === 'x-indirect');
      setTimeout(wru.async(function () {
        wru.assert('created callback triggered', node._info[0].type === 'created');
        wru.assert('attached callback triggered', node._info[1].type === 'attached');
        document.body.removeChild(node.parentNode);
        setTimeout(wru.async(function () {
          wru.assert('detached callback triggered', node._info[2].type === 'detached');
        }), 20);
      }), 20);
    }
  },{
    name: 'attributes',
    test: function () {
      var args, info;
      var node = document.createElement('x-direct');
      document.body.appendChild(document.createElement('div')).appendChild(node);
      setTimeout(wru.async(function () {
        node.setAttribute('what', 'ever');
        wru.assert(node.getAttribute('what') === 'ever');
        setTimeout(wru.async(function () {
          info = node._info.pop();
          wru.assert('attributeChanged was called', info.type === 'attributeChanged');
          args = info.arguments;
          wru.assert('correct arguments with new value', args[0] === 'what' && args[1] == null && args[2] === 'ever');
          node.setAttribute('what', 'else');
          setTimeout(wru.async(function () {
            args = node._info.pop().arguments;
            wru.assert('correct arguments with old value', args[0] === 'what' && args[1] === 'ever' && args[2] === 'else');
            node.removeAttribute('what');
            setTimeout(wru.async(function () {
              args = node._info.pop().arguments;
              wru.assert(
                'correct arguments with removed attribute',
                args[0] === 'what' &&
                args[1] === 'else' &&
                args[2] == null
              );
              document.body.removeChild(node.parentNode);
            }), 20);
          }), 20);
        }), 20);
      }), 20);
    }
  },{
    name: 'offline',
    test: function () {
      var node = document.createElement('x-direct');
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
          }), 20);
        }), 20);
      }), 20);
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
      }), 20);
    }
  },{
    name: 'className',
    test: function () {
      // online for className, needed by IE8
      var args, info, node = document.body.appendChild(document.createElement('x-direct'));
      setTimeout(wru.async(function () {
        node.className = 'a';
        wru.assert(node.className === 'a');
        setTimeout(wru.async(function () {
          info = node._info.pop();
          wru.assert('attributeChanged was called', info.type === 'attributeChanged');
          args = info.arguments;
          wru.assert('correct arguments with new value', args[0] === 'class' && args[1] == null && args[2] === 'a');
          node.className += ' b';
          setTimeout(wru.async(function () {
            info = node._info.pop();
            // the only known device that fails this test is Blackberry 7
            wru.assert('attributeChanged was called', info.type === 'attributeChanged');
            args = info.arguments;
            wru.assert('correct arguments with new value', args[0] === 'class' && args[1] == 'a' && args[2] === 'a b');
          }), 20);
        }), 20);
      }), 20);
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
  },{
    name: 'constructor',
    test: function () {
      var XEL, runtime, xEl = document.body.appendChild(
        document.createElement('x-el-created')
      );
      XEL = document.registerElement(
        'x-el-created',
        {
          prototype: Object.create(
            HTMLElement.prototype, {
            createdCallback: {value: function() {
              runtime = this.constructor;
            }}
          })
        }
      );
      setTimeout(wru.async(function () {
        wru.assert(xEl.constructor === runtime);
        // avoid IE8 problems
        if (!('attachEvent' in xEl)) {
          wru.assert(xEl instanceof XEL ||
            // IE9 and IE10 will use HTMLUnknownElement
            // TODO: features tests/detection and use such prototype instead
            xEl instanceof HTMLUnknownElement);
        }
      }), 100);
    }
  },{
    name: 'simulating a table element',
    test: function () {
      if (window.HTMLTableElement && 'createCaption' in HTMLTableElement.prototype) {
        var HiTable = document.registerElement(
          'hi-table',
          {
            'extends': 'table',
            prototype: Object.create(HTMLTableElement.prototype)
          }
        );
        var ht = document.createElement('table', 'hi-table');
        wru.assert(!!ht.createCaption());
        ht = new HiTable;
        wru.assert(!!ht.createCaption());
      }
    }
  },{
    name: 'if registered one way, cannot be registered another way',
    test: function () {
      var failed = false;
      document.registerElement(
        'no-double-behavior',
        {}
      );
      try {
        document.registerElement(
          'no-double-behavior',
          {
            'extends': 'div'
          }
        );
      } catch(e) {
        failed = true;
      }
      wru.assert('unable to register IS after TAG', failed);
      failed = false;
      document.registerElement(
        'nope-double-behavior',
        {
          'extends': 'div'
        }
      );
      try {
        document.registerElement(
          'nope-double-behavior',
          {}
        );
      } catch(e) {
        failed = true;
      }
      wru.assert('unable to register TAG after IS', failed);
    }
  },{
    name: 'is="type" is a setup for known extends only',
    test: function () {
      var divTriggered = false;
      var spanTriggered = false;
      document.registerElement(
        'did-trigger',
        {
          'extends': 'div',
          prototype: Object.create(
            HTMLDivElement.prototype, {
            createdCallback: {value: function() {
              divTriggered = true;
            }}
          })
        }
      );
      document.registerElement(
        'didnt-trigger',
        {
          'extends': 'div',
          prototype: Object.create(
            HTMLDivElement.prototype, {
            createdCallback: {value: function() {
              spanTriggered = true;
            }}
          })
        }
      );
      var div = document.createElement('div', 'did-trigger');
      var span = document.createElement('span', 'didnt-trigger');
      setTimeout(wru.async(function () {
        wru.assert('it did trigger on div', divTriggered);
        wru.assert('but it did not trigger on span', !spanTriggered);
      }), 100);
    }
  }, {
    name: 'nested CustomElement',
    test: function () {
      var a = new XDirect();
      var b = new XDirect();
      var div = document.createElement('div');
      document.body.appendChild(div);
      b.appendChild(a);
      div.appendChild(b);
      setTimeout(wru.async(function () {
        wru.assert('there were info', a._info.length && b._info.length);
        a._info = [];
        b._info = [];
        a.setAttribute('what', 'ever');
        setTimeout(wru.async(function () {
          wru.assert('attributeChanged triggered on a',
            a._info[0].type === 'attributeChanged'
          );
          wru.assert('but it did not trigger on b', !b._info.length);
        }), 100);
      }), 100);
    }
  }, {
    name: 'cannot extend a registered element',
    test: function () {
      var ok = false, ABC1 = document.registerElement('abc-1', {
        prototype: Object.create(HTMLElement.prototype)
      });
      try {
        document.registerElement('abc-2', {
          'extends': 'abc-1',
          prototype: Object.create(ABC1.prototype)
        });
      } catch(e) {
        ok = true;
      }
      wru.assert('unable to create an element extending a custom one', ok);
    }
  }, {
    name: 'do not invoke if attribute had same value',
    test: function () {
      var
        info = [],
        ChangingValue = document.registerElement('changing-value', {
          prototype: Object.create(HTMLElement.prototype, {
            attributeChangedCallback: {value: function(
              name,           // always present
              previousValue,  // if null, it's a new attribute
              value           // if null, it's a removed attribute
            ) {
              info.push(arguments);
            }}
          })
        }),
        node = document.body.appendChild(new ChangingValue);
      ;
      node.setAttribute('test', 'value');
      setTimeout(wru.async(function(){
        node.setAttribute('test', 'value');
        wru.assert('OK');
        setTimeout(wru.async(function () {
          wru.assert('was not called twice with the same value',
            info.length === 1 &&
            info[0][0] === 'test' &&
            info[0][1] === null &&
            info[0][2] === 'value'
          );
        }), 100);
      }), 100);
    }
  }, {
    name: 'remove more than one CustomElement',
    test: function () {
      var a = new XDirect();
      var b = new XDirect();

      document.body.appendChild(a);
      document.body.appendChild(b);

      setTimeout(wru.async(function () {
        wru.assert('there were info', a._info.length && b._info.length);
        a._info = [];
        b._info = [];

        document.body.removeChild(a);
        document.body.removeChild(b);

        setTimeout(wru.async(function () {
          wru.assert('detachedCallback triggered on a',
            a._info[0].type === 'detached'
          );
          wru.assert('detachedCallback triggered on b',
            b._info[0].type === 'detached'
          );
        }), 100);
      }), 100);
    }
  } //*/
]);
