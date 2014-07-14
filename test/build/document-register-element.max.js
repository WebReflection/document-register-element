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

var
  // IE < 11 only + old WebKit for attributes
  EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 10e4 >> 0),

  // shortcuts and costants
  ADD_EVENT_LISTENER = 'addEventListener',
  PROTOTYPE = 'prototype',
  EXTENDS = 'extends',

  DOM_ATTR_MODIFIED = 'DOMAttrModified',
  DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified',
  GET_ATTRIBUTE = 'getAttribute',
  SET_ATTRIBUTE = 'setAttribute',
  REMOVE_ATTRIBUTE = 'removeAttribute',
  TO_LOWER_CASE = 'toLowerCase',
  TO_UPPER_CASE = 'toUpperCase',

  // valid and invalid node names
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

  // registered types and their prototypes
  types = [],
  protos = [],

  // to query subnodes
  query = [],

  // html shortcut used to feature detect
  documentElement = document.documentElement,

  // ES5 inline helpers || basic patches
  indexOf = types.indexOf || function (v) {
    for(var i = this.length; i-- && this[i] !== v;){}
    return i;
  },
  forEach = types.forEach || function (f, c) {
    for (var i = 0, length = this.length; i < length; i++) {
      f.call(c, this[i]);
    }
  },

  // other helpers / shortcuts
  hOP = types.hasOwnProperty,
  iPO = types.isPrototypeOf,

  createElement = document.createElement,
  defineProperty = Object.defineProperty,
  gOPD = Object.getOwnPropertyDescriptor,
  gOPN = Object.getOwnPropertyNames,
  gPO = Object.getPrototypeOf,
  setPrototypeOf = Object.setPrototypeOf,

  MutationObserver = window.MutationObserver ||
                     window.WebKitMutationObserver,

  hasProto = !!Object.__proto__,

  setPrototype = setPrototypeOf || (
    hasProto ?
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

  patchIfNotAlready = setPrototypeOf || hasProto ?
    function (node, proto) {
      if (!iPO.call(proto, node)) {
        setupNode(node, proto);
      }
    } :
    function (node, proto) {
      if (!node[EXPANDO_UID]) {
        node[EXPANDO_UID] = Object(true);
        setupNode(node, proto);
      }
    }
  ,

  HTMLElementPrototype = (
    window.HTMLElement ||
    window.Element ||
    window.Node
  )[PROTOTYPE],

  cloneNode = HTMLElementPrototype.cloneNode,
  setAttribute = HTMLElementPrototype[SET_ATTRIBUTE],

  attributesObserver = MutationObserver && {
    attributes: true,
    characterData: true,
    attributeOldValue: true
  },

  setListener = false,
  doesNotSupportDOMAttrModified = true,

  DOMAttrModified = MutationObserver || function(e) {
    doesNotSupportDOMAttrModified = false;
    documentElement.removeEventListener(
      DOM_ATTR_MODIFIED,
      DOMAttrModified
    );
  },

  onSubtreeModified,
  callDOMAttrModified,
  getAttributesMirror,
  observer
;

if (!MutationObserver) {
  documentElement[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, DOMAttrModified);
  documentElement[SET_ATTRIBUTE](REGISTER_ELEMENT, 1);
  documentElement[REMOVE_ATTRIBUTE](REGISTER_ELEMENT);
  if (doesNotSupportDOMAttrModified) {
    onSubtreeModified = function (e) {
      var
        node = this,
        oldAttributes,
        newAttributes,
        key
      ;
      if (node === e.target) {
        oldAttributes = node[EXPANDO_UID];
        node[EXPANDO_UID] = (newAttributes = getAttributesMirror(node));
        for (key in newAttributes) {
          if (!(key in oldAttributes)) {
            // attribute was added
            return callDOMAttrModified(
              0,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              'ADDITION'
            );
          } else if (newAttributes[key] !== oldAttributes[key]) {
            // attribute was changed
            return callDOMAttrModified(
              1,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              'MODIFICATION'
            );
          }
        }
        // checking if it has been removed
        for (key in oldAttributes) {
          if (!(key in newAttributes)) {
            // attribute removed
            return callDOMAttrModified(
              2,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              'REMOVAL'
            );
          }
        }
      }
    };
    callDOMAttrModified = function (
      attrChange,
      currentTarget,
      attrName,
      prevValue,
      newValue,
      action
    ) {
      var e = {
        attrChange: attrChange,
        currentTarget: currentTarget,
        attrName: attrName,
        prevValue: prevValue,
        newValue: newValue
      };
      e[action] = attrChange;
      onDOMAttrModified(e);
    };
    getAttributesMirror = function (node) {
      for (var
        attr,
        result = {},
        attributes = node.attributes,
        i = 0, length = attributes.length;
        i < length; i++
      ) {
        attr = attributes[i];
        result[attr.name] = attr.value;
      }
      return result;
    };
  }
}

function executeAction(action) {
  function triggerAction(node) {
    verifyAndSetupAndAction(node, action);
  }
  return function (node) {
    if (iPO.call(HTMLElementPrototype, node)) {
      verifyAndSetupAndAction(node, action);
      notifyEach(node, triggerAction);
    }
  };
}

function getTypeIndex(target) {
  var is = target.getAttribute('is');
  return indexOf.call(
    types,
    is ? is[TO_UPPER_CASE]() : target.nodeName
  );
}

function notifyEach(target, callback) {
  forEach.call(
    target.querySelectorAll(
      query.join(',')
    ),
    callback
  );
}

function onDOMAttrModified(e) {
  var
    node = e.currentTarget,
    attrChange = e.attrChange,
    prevValue = e.prevValue,
    newValue = e.newValue
  ;
  if (node.attributeChangedCallback) {
    node.attributeChangedCallback(
      e.attrName,
      attrChange === e.ADDITION ? null : prevValue,
      attrChange === e.REMOVAL ? null : newValue
    );
  }
}

function onDOMNode(action) {
  var executor = executeAction(action);
  return function (e) {
    executor(e.target);
  };
}

function patchedSetAttribute(name, value) {
  var self = this;
  setAttribute.call(self, name, value);
  onSubtreeModified.call(self, {target: self});
}

function setupEachNode(node) {
  setupNode(node, protos[getTypeIndex(node)]);
}

function setupNode(node, proto) {
  setPrototype(node, proto);
  if (observer) {
    observer.observe(node, attributesObserver);
  } else {
    if (doesNotSupportDOMAttrModified) {
      node[SET_ATTRIBUTE] = patchedSetAttribute;
      node[EXPANDO_UID] = getAttributesMirror(node);
      node[ADD_EVENT_LISTENER](DOM_SUBTREE_MODIFIED, onSubtreeModified);
    }
    node[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, onDOMAttrModified);
  }
  if (node.createdCallback) {
    node.createdCallback();
  }
}

function verifyAndSetupAndAction(node, action) {
  var fn, i = getTypeIndex(node);
  if (-1 < i) {
    patchIfNotAlready(node, protos[i]);
    fn = node[action + 'Callback'];
    if (fn) fn.call(node);
  }
}

// set as enumerable, writable and configurable
document[REGISTER_ELEMENT] = function registerElement(type, options) {
  var upperType = type[TO_UPPER_CASE]();
  if (!setListener) {
    // only first time document.registerElement is used
    // we need to set this listener
    // setting it by default might slow down for no reason
    setListener = true;
    if (MutationObserver) {
      observer = (function(executor){
        return new MutationObserver(function (records) {
          for (var
            j, l, current, list, node,
            i = 0, length = records.length; i < length; i++
          ) {
            current = records[i];
            if (current.type === 'childList') {
              for (list = current.addedNodes, j = 0, l = list.length; j < l; j++) {
                if (iPO.call(HTMLElementPrototype, node = list[j])) {
                  verifyAndSetupAndAction(node, 'attached');
                }
              }
              for (list = current.removedNodes, j = 0, l = list.length; j < l; j++) {
                executor(list[j]);
              }
            } else {
              node = current.target;
              if (node.attributeChangedCallback) {
                node.attributeChangedCallback(
                  current.attributeName,
                  current.oldValue,
                  node.getAttribute(current.attributeName)
                );
              }
            }
          }
        });
      }(executeAction('detached')));
      observer.observe(
        document,
        {
          childList: true,
          subtree: true
        }
      );
    } else {
      document[ADD_EVENT_LISTENER]('DOMNodeInserted', onDOMNode('attached'));
      document[ADD_EVENT_LISTENER]('DOMNodeRemoved', onDOMNode('detached'));
    }
    document.createElement = function (localName, typeExtension) {
      var i, node = createElement.apply(document, arguments);
      if (typeExtension) {
        node[SET_ATTRIBUTE]('is', localName = typeExtension[TO_LOWER_CASE]());
      }
      i = indexOf.call(types, localName[TO_UPPER_CASE]());
      if (-1 < i) setupNode(node, protos[i]);
      return node;
    };
    HTMLElementPrototype.cloneNode = function (deep) {
      var
        node = cloneNode.call(this, !!deep),
        i = getTypeIndex(node)
      ;
      if (-1 < i) setupNode(node, protos[i]);
      if (deep) notifyEach(node, setupEachNode);
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
  query.push(extending ? nodeName + '[is="' + type[TO_LOWER_CASE]() + '"]' : nodeName);
  protos[i] = hOP.call(options, PROTOTYPE) ? options[PROTOTYPE] : HTMLElementPrototype;
  return function () {
    return document.createElement(nodeName, extending && upperType);
  };
};


}(window, document, Object, 'registerElement'));