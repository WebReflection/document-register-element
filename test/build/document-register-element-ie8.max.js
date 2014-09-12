/*!
Copyright (C) 2014 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function(window, document, Object, REGISTER_ELEMENT){'use strict';

// in case it's there or already patched
if (REGISTER_ELEMENT in document) return;

// THIS IS A WORK IN PROGRESS AND IT WON'T WORK

// DO NOT USE THIS FILE DIRECTLY, IT WON'T WORK
// THIS IS A PROJECT BASED ON A BUILD SYSTEM
// THIS FILE IS JUST WRAPPED UP RESULTING IN
// build/document-register-element-ie8.js
// and its .max.js counter part

var
  EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 10e4 >> 0),
  EXTENDS = 'extends',
  avoidKeys = new RegExp('^(?:' + EXPANDO_UID + '|__proto__|setAttribute)$'),
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
  query = '',
  documentElement = document.documentElement,
  indexOf = function (v) {
    for(var i = this.length; i-- && this[i] !== v;){}
    return i;
  },
  OP = Object.prototype,
  hOP = OP.hasOwnProperty,
  iPO = OP.isPrototypeOf,
  defineProperty = Object.defineProperty,
  gOPD = Object.getOwnPropertyDescriptor,
  setPrototype = function (o, p) {
    do {
      for (var key in p) {
        if (!(key in o) && !avoidKeys.test(key) && hOP.call(p, key)) {
          defineProperty(o, key, gOPD(p, key));
        }
      }
    } while (p = p.__proto__);
    return o;
  },
  patchIfNotAlready = function (node, proto) {
    if (!node[EXPANDO_UID]) {
      node[EXPANDO_UID] = Object(true);
      setupNode(node, proto);
    }
  },
  HTMLElementPrototype = Element.prototype,
  cloneNode = HTMLElementPrototype.cloneNode,
  setAttribute = HTMLElementPrototype.setAttribute,
  createElement = document.createElement,
  setListener = false
;

if (!window.HTMLElement) {
  window.HTMLElement = Element;
}

document[REGISTER_ELEMENT] = function registerElement(type, options) {
  upperType = type.toUpperCase();
  if (!setListener) {
    document.createElement = function (localName, typeExtension) {
      var i, node = createElement.apply(document, arguments);
      if (typeExtension) {
        node.setAttribute('is', localName = typeExtension.toLowerCase());
      }
      i = indexOf.call(types, localName.toUpperCase());
      if (-1 < i) setupNode(node, protos[i]);
      return setupBehavior(node);
    };
    HTMLElementPrototype.cloneNode = function (deep) {
      var
        node = cloneNode.call(this, !!deep),
        i = getTypeIndex(node)
      ;
      if (-1 < i) setupNode(node, protos[i]);
      if (deep) loopAndSetup(node.querySelectorAll(query));
      return setupBehavior(node);
    };
    setupBehavior(documentElement);
  }

  var
    constructor = function () {
      return setupBehavior(
        document.createElement(nodeName, extending && upperType)
      );
    },
    opt = options || OP,
    extending = hOP.call(opt, EXTENDS),
    nodeName = extending ? options[EXTENDS] : upperType,
    i = types.push(upperType) - 1,
    upperType
  ;

  query = query.concat(
    query.length ? ',' : '',
    extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName
  );

  constructor.prototype = (
    protos[i] = hOP.call(opt, 'prototype') ?
      opt.prototype :
      {__proto__: HTMLElementPrototype}
  );

  onreadystatechange();

  return constructor;

};

function getAttributesMirror(node) {
  for (var
    attr, name,
    result = {},
    attributes = node.attributes,
    i = 0, length = attributes.length;
    i < length; i++
  ) {
    attr = attributes[i];
    name = attr.name;
    if (name !== 'setAttribute') {
      result[name] = attr.value;
    }
  }
  return result;
}

function getTypeIndex(target) {
  var is = target.getAttribute('is');
  return indexOf.call(
    types,
    is ?
        is.toUpperCase() :
        target.nodeName
  );
}

function loopAndSetup(list) {
  for (var i = 0, length = list.length, node; i < length; i++) {
    node = list[i];
    setupNode(node, protos[getTypeIndex(node)]);
  }
}

function loopAndVerify(list, action) {
  for (var i = 0, length = list.length; i < length; i++) {
    //verifyAndSetupAndAction(list[i], action);
  }
}

function onreadystatechange() {
  if (query.length) {
    loopAndVerify(
      document.querySelectorAll(query),
      'attached'
    );
  }
}

function onSubtreeModified(e) {
  
}

function patchedSetAttribute(name, value) {
  var self = this;
  setAttribute.call(self, name, value);
  onSubtreeModified.call(self, {target: self});
}

function onpropertychange(e) {
  e || (e = event);
  console.log([
    e.propertyName,
    (e.fromElement || e.srcElement).nodeName
  ]);
}

function setupBehavior(node) {
  node.addBehavior(node.nodeName + '.htc');
  node.attachEvent('onreadystatechange', onreadystatechange);
  node.attachEvent('onpropertychange', onpropertychange);
  // node.onreadystatechange = onreadystatechange;
  // node.onpropertychange = onpropertychange;
  return node;
}

function setupNode(node, proto) {
  setPrototype(node, proto);
  node.setAttribute = patchedSetAttribute;
  node[EXPANDO_UID] = getAttributesMirror(node);
  // node.addEventListener(DOM_SUBTREE_MODIFIED, onSubtreeModified);
  // node.addEventListener(DOM_ATTR_MODIFIED, onDOMAttrModified);
  if (node.createdCallback) {
    node.created = true;
    node.createdCallback();
    node.created = false;
  }
}

function verifyAndSetupAndAction(node, action) {
  var
    fn,
    i = getTypeIndex(node),
    attached = 'attached',
    detached = 'detached'
  ;
  if (-1 < i) {
    patchIfNotAlready(node, protos[i]);
    i = 0;
    if (action === attached && !node[attached]) {
      node[detached] = false;
      node[attached] = true;
      i = 1;
    } else if (action === detached && !node[detached]) {
      node[attached] = false;
      node[detached] = true;
      i = 1;
    }
    if (i && (fn = node[action + 'Callback'])) fn.call(node);
  }
}
}(window, document, Object, 'registerElement'));