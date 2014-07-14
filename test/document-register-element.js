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
            attributeChanged: {value: function() {
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
            attributeChanged: {value: function() {
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
  }
]);
