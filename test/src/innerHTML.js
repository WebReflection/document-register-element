// see https://github.com/WebReflection/document-register-element/issues/21#issuecomment-102020311
var innerHTML = (function (document) {

  var
    register = document.registerElement,
    div = document.createElement('div'),
    dre = 'document-register-element',
    innerHTML = register.innerHTML,
    initialize,
    registered
  ;

  // avoid duplicated wrappers
  if (innerHTML) return innerHTML;

  // feature detect the problem
  register.call(
    document,
    dre,
    {prototype: Object.create(
      HTMLElement.prototype,
      {createdCallback: {value: Object}}
    )}
  );

  div.innerHTML = '<' + dre + '></' + dre + '>';

  // if natively supported, nothing to do
  if ('createdCallback' in div.querySelector(dre)) {
    // return just an innerHTML wrap
    return (register.innerHTML = function (el, html) {
      el.innerHTML = html;
      return el;
    });
  }

  // in other cases
  registered = [];
  initialize = function (el) {
    if (
      'createdCallback' in el         ||
      'attachedCallback' in el        ||
      'detachedCallback' in el        ||
      'attributeChangedCallback' in el
    ) return;
    for (var
      type = el.getAttribute('is'),
      name = el.nodeName,
      node = document.createElement.apply(
        document,
        type ? [name, type] : [name]
      ),
      attributes = el.attributes,
      i = 0,
      length = attributes.length,
      attr;
      i < length; i++
    ) {
      attr = attributes[i];
      node.setAttribute(attr.name, attr.value);
    }
    el.replaceWith(node);
  };
  // augment the document.registerElement method
  return ((document.registerElement = function registerElement(type, options) {
    var name = (options.extends ?
      (options.extends + '[is="' + type + '"]') : type
    ).toLowerCase();
    if (registered.indexOf(name) < 0) registered.push(name);
    return register.apply(document, arguments);
  }).innerHTML = function (el, html) {
    el.innerHTML = html;
    registered.forEach.call(
      el.querySelectorAll(
          registered.join(',')
      ),
      initialize
    );
    return el;
  });
}(document));