function register(name, descriptor) {
  var
    desc = {prototype: Object.create(
      (descriptor.constructor ||
       HTMLElement).prototype
    )},
    proto = descriptor.prototype,
    ext = 'extends'
  ;
  if (descriptor.hasOwnProperty(ext)) {
    desc[ext] = descriptor[ext];
  }
  return document.registerElement(name, Object.keys(proto).reduce(
    function (desc, key) {
      desc.prototype[key] = proto[key];
      return desc;
    },
    desc
  ));
}

/* example
register('x-map', {
  constructor: HTMLImageElement,
  prototype: {
    createdCallback: function () {
      // ... 
    },
    srcToGeoData: function () {
      // ...
    }
  }
});
*/