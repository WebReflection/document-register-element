
var
  PROTOTYPE = 'prototype',
  EXTENDS = 'extends',
  validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,
  invalidNames = [
    'ANNOTATION-XML',
    'COLOR-PROFILE',
    'FONT-FACE',
    'FONT-FACE-SRC',
    'FONT-FACE-URI',
    'FONT-FACE-FORMAT',
    'FONT-FACE-NAME',
    'MISSING-GLYPH'
  ],
  types = [],
  protos = [],
  query = [],
  indexOf = types.indexOf || function (v) {
    for(var i = this.length; i-- && this[i] !== v;){}
    return i;
  },
  forEach = types.forEach || function (f, c) {
    for (var i = 0, length = this.length; i < length; i++) {
      f.call(c, this[i]);
    }
  },
  hOP = types.hasOwnProperty,
  iPO = types.isPrototypeOf,
  createElement = document.createElement,
  defineProperty = Object.defineProperty,
  gOPD = Object.getOwnPropertyDescriptor,
  gOPN = Object.getOwnPropertyNames,
  gPO = Object.getPrototypeOf,
  setListener = false,
  setPrototype = Object.setPrototypeOf || (
    Object.__proto__ ?
      function (o, p) {
        o.__proto__ = p;
        return o;
      } : (
    'getOwnPropertyDescriptor' in Object ?
      (function(){
        function setProperties(o, p) {
          for (var
            key,
            names = gOPN(p),
            i = 0, length = names.length;
            i < length; i++
          ) {
            key = names[i];
            if (!hOP.call(o, key)) {
              defineProperty(o, key, gOPD(p, key));
            }
          }
        }
        return function (o, p) {
          do {
            setProperties(o, p);
          } while (p = gPO(p));
          return o;
        };
      }()) :
      function (o, p) {
        for (var key in p) {
          o[key] = p[key];
        }
        return o;
      }
  )),
  HTMLElementPrototype = (
    window.HTMLElement ||
    window.Element ||
    window.Node
  )[PROTOTYPE],
  cloneNode = HTMLElementPrototype.cloneNode,
  noOp = function(){}
;

function invoke(target, name) {
  (
    target[name] ||
    target[name + 'Callback'] ||
    noOp
  ).call(target);
}

function setupNode(node, proto) {
  setPrototype(node, proto);
  invoke(node, 'created');
}

function setupEachNode(node) {
  setupNode(node, protos[getTypeIndex(node)]);
}

function getTypeIndex(target) {
  return indexOf.call(
    types,
    (target.getAttribute('is') || '').toUpperCase() ||
    target.nodeName
  );
}

function notifyEach(target, callback, context) {
  forEach.call(
    target.querySelectorAll(
      query.join(',')
    ),
    callback,
    context
  );
}

function triggerAction(node) {
  var proto = protos[getTypeIndex(node)];
  if (gPO(node) !== proto) {
    setupNode(node, proto);
  }
  invoke(node, this);
}

function onDOMNode(whatHappened) {
  return function (e) {
    var target = e.target;
    if (-1 < getTypeIndex(target)) {
      invoke(target, whatHappened);
    }
    notifyEach(target, triggerAction, whatHappened);
  };
}

// set as enumerable, writable and configurable
document[REGISTER_ELEMENT] = function registerElement(type, options) {
  var upperType = type.toUpperCase();
  if (!setListener) {
    // only first time document.registerElement is used
    // we need to set this listener
    // setting it by default might slow down for no reason
    setListener = true;
    document.addEventListener('DOMNodeInserted', onDOMNode('attached'));
    document.addEventListener('DOMNodeRemoved', onDOMNode('detached'));
    document.createElement = function (localName, typeExtension) {
      var i, node = createElement.apply(document, arguments);
      if (typeExtension) {
        node.setAttribute('is', localName = typeExtension.toLowerCase());
      }
      i = indexOf.call(types, localName.toUpperCase());
      if (-1 < i) {
        setupNode(node, protos[i]);
      }
      return node;
    };
    HTMLElementPrototype.cloneNode = function (deep) {
      var
        node = cloneNode.call(this, !!deep),
        i = getTypeIndex(node)
      ;
      if (-1 < i) {
        setupNode(node, protos[i]);
      }
      if (deep) {
        notifyEach(node, setupEachNode);
      }
      return node;
    };
  }
  if (-1 < indexOf.call(types, upperType)) {
    throw new Error('A ' + type + ' type is already registered');
  }
  if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
    throw new Error('The type ' + type + ' is invalid');
  }
  var
    extending = hOP.call(options || type, EXTENDS),
    nodeName = extending ? options[EXTENDS] : upperType,
    i = types.push(upperType) - 1
  ;
  query.push(extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);
  protos[i] = hOP.call(options, PROTOTYPE) ? options[PROTOTYPE] : HTMLElementPrototype;
  return function () {
    return document.createElement(nodeName, extending && upperType);
  };
};

