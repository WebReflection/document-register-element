function setProto(A, B) {
  A.prototype = Object.create(
    B.prototype,
    {constructor: {
      configurable: true,
      writable: true,
      value: A
    }}
  );
}

wru.test(typeof document === 'undefined' ? [] : [
  {
    name: 'V1: main',
    test: function () {
      wru.assert(typeof customElements === 'object');
    }
  }, {
    name: 'V1: use extended classes to register',
    test: function () {
      function MyButton(self) {
        // needed to upgrade the element
        self = HTMLButtonElement.call(self || this);
        self.setAttribute('cool', 'true');
        return self;
      }
      function method() {}
      setProto(MyButton, HTMLButtonElement);
      MyButton.prototype.method = method;
      customElements.define('my-button', MyButton, {'extends': 'button'});
      var myButton = new MyButton();
      wru.assert('prototype inherited', myButton.method === method);
      setTimeout(wru.async(function () {
        wru.assert('constructor called', myButton.getAttribute('cool') === 'true');
      }), 100);
    }
  }, {
    name: 'V1: use extended to register and DOM to initialize',
    test: function () {
      var onceCreated = wru.async(function (myButton) {
        document.body.removeChild(myButton);
        wru.assert('constructor called', myButton.getAttribute('cool') === 'true');
        wru.assert('prototype inherited', myButton.method === method);
      });
      // no need to reassign self if upgraded via dom
      function MyOtherButton(self) {
        HTMLButtonElement.call(self);
        self.setAttribute('cool', 'true');
        setTimeout(function () {
          onceCreated(self);
        }, 100);
      }
      function method() {}
      setProto(MyOtherButton, HTMLButtonElement);
      MyOtherButton.prototype.method = method;
      customElements.define('my-other-button', MyOtherButton, {'extends': 'button'});
      document.body.appendChild(document.createElement('button', {is: 'my-other-button'}));
    }
  }, {
    name: 'V1: real classes',
    test: function () {
      try {
        Function('wru', [
          'class MyA extends HTMLAnchorElement { constructor(self) { self = super(self); self.setAttribute("ok", "1"); return self; } }',
          'customElements.define("my-a", MyA, {"extends": "a"});',
          'const myA = new MyA();',
          'setTimeout(wru.async(function(){ wru.assert(myA.getAttribute("ok") === "1"); }), 100);'
        ].join('\n')).call(this, wru);

      } catch(meh) {}
    }
  }, {
    name: 'V1: customElements.whenDefined',
    test: function () {
      function HereWeGo() {}
      setProto(HereWeGo, HTMLElement);
      customElements.whenDefined('here-we-go').then(wru.async(function () {
        wru.assert(customElements.get('here-we-go') === HereWeGo);
      }));
      setTimeout(function () {
        customElements.define('here-we-go', HereWeGo);
      }, 100);
    }
  }, {
    name: 'V1: connectedCallback',
    test: function () {
      function OnceAttached(self) {
        return HTMLElement.call(this, self);
      }
      setProto(OnceAttached, HTMLElement);
      OnceAttached.prototype.connectedCallback = wru.async(function () {
        document.body.removeChild(this);
        wru.assert('OK');
      });
      customElements.define('once-attached', OnceAttached);
      var el = new OnceAttached;
      setTimeout(function () {
        document.body.appendChild(el);
      }, 100);
    }
  }, {
    name: 'V1: disconnectedCallback',
    test: function () {
      function OnceDetached() {
        return HTMLElement.call(this);
      }
      setProto(OnceDetached, HTMLElement);
      OnceDetached.prototype.disconnectedCallback = wru.async(function () {
        wru.assert('OK');
      });
      customElements.define('once-detached', OnceDetached);
      var el = document.body.appendChild(new OnceDetached);
      setTimeout(function () {
        document.body.removeChild(el);
      }, 100);
    }
  }, {
    name: 'V1: attributeChangedCallback',
    test: function () {
      var args = [];
      function OnAttrModified() {
        return HTMLElement.call(this);
      }
      OnAttrModified.observedAttributes = ['test'];
      setProto(OnAttrModified, HTMLElement);
      OnAttrModified.prototype.attributeChangedCallback = function () {
        args.push(arguments);
      };
      customElements.define('on-attr-modified', OnAttrModified);
      var el = document.body.appendChild(new OnAttrModified);
      el.setAttribute('nope', 'nope');
      el.setAttribute('test', 'attr');
      setTimeout(wru.async(function () {
        document.body.removeChild(el);
        wru.assert(
          args.length === 1 &&
          args[0][0] === 'test' &&
          args[0][1] == null &&
          args[0][2] === 'attr'
        );
      }), 100);
    }
  }, {
    name: 'V1: preserved instanceof',
    test: function () {
      wru.assert(document.createElement('button') instanceof HTMLButtonElement);
    }
  }, {
    name: 'V1: attributes notified on bootstrap',
    test: function () {
      var notification;
      function AttributesNotified(self) {
        return HTMLElement.call(this, self);
      }
      AttributesNotified.observedAttributes = ['some'];
      setProto(AttributesNotified, HTMLElement);
      AttributesNotified.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        notification = {
          name: name,
          oldValue: oldValue,
          newValue: newValue
        };
      };
      AttributesNotified.prototype.connectedCallback = wru.async(function () {
        this.parentNode.removeChild(this);
        wru.assert(
          notification.name === 'some' &&
          notification.oldValue === null &&
          notification.newValue === 'thing'
        );
      });
      setTimeout(function () {
        var div = document.body.appendChild(document.createElement('div'));
        div.innerHTML = '<attributes-modified some="thing">test</attributes-modified>';
        customElements.define('attributes-modified', AttributesNotified);
      });
    }
  }, {
    name: "V0: attributeChangedCallback with empty values",
    test: function () {
      var done = wru.async(function (condition) {
        wru.assert(condition);
      });
      document.registerElement(
        'attr-changed', {
        prototype: Object.create(
          HTMLElement.prototype, {
            attributeChangedCallback: {value: function(
              name,           // always present
              previousValue,  // if null, it's a new attribute
              value           // if null, it's a removed attribute
            ) {
              done(
                name === 'test' &&
                previousValue === null &&
                value === ''
              );
            }}
          }
        )
      });
      var el = document.createElement('attr-changed');
      document.body.appendChild(el).setAttribute('test', '');
    }
  }, {
    name: "V0: main",
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
  }, {
    name: 'V0: Observe changes when attached to V1 Shadow Root',
    test: function () {
      if(!HTMLElement.prototype.attachShadow) return;
      var
        a = new XDirect(),
        parentNode = document.createElement('div'),
        root = parentNode.attachShadow({ mode: 'open' })
      ;
      root.appendChild(a);
      setTimeout(wru.async(function () {
        wru.assert('node created', a._info[0].type === 'created');
        if (a._info[1]) wru.assert('node attached', a._info[1].type === 'attached');
      }), 100);
    }
  }, {
    name: 'V0: as XDirect constructor',
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
    name: 'V0: as XIndirect constructor',
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
    name: 'V0: as &lt;x-direct&gt; innerHTML',
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
    name: 'V0: as &lt;div is="x-indirect"&gt; innerHTML',
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
    name: 'V0: as createElement(x-direct)',
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
    name: 'V0: as createElement(div, x-indirect)',
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
    name: 'V0: attributes',
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
            wru.assert('correct arguments with old value',
              args[0] === 'what' && args[1] === 'ever' && args[2] === 'else');
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
    name: 'V0: offline',
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
    name: 'V0: nested',
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
    name: 'V0: className',
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
    name: 'V0: registered after',
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
    name: 'V0: constructor',
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
    name: 'V0: simulating a table element',
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
    name: 'V0: if registered one way, cannot be registered another way',
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
    name: 'V0: is="type" is a setup for known extends only',
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
    name: 'V0: nested CustomElement',
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
    name: 'V0: cannot extend a registered element',
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
    name: 'V0: do not invoke if attribute had same value',
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
    name: 'V0: remove more than one CustomElement',
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
  }
]);
