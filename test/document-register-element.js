wru.test(typeof document === 'undefined' ? [] : [
  {
    name: "main",
    test: function () {
      wru.assert('registerElement exists', document.registerElement);
    }
  }
]);
