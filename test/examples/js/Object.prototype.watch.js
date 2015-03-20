(function(Object){

  /*! (C) Andrea Giammarchi - Mit Style License */

  /////////////////////////////////////////////////////////////////
  //
  // compatibility
  //    native:     Firefox Desktop and Mobile
  //    partial:    IE8 works with DOM nodes only
  //    simulated:  all other browsers except IE < 8
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  //
  // caveat:  if you delete obj.prop; or you configure
  //          a watched property via Object.defineProperty
  //          watcher getter/setter will be inevitably removed.
  //
  /////////////////////////////////////////////////////////////////

  var
    ObjectPrototype = Object.prototype,
    defineProperty = Object.defineProperty,
    gOPD = Object.getOwnPropertyDescriptor,
    defaultDescriptor = {
      enumerable: true,
      configurable: true,
      writable: true
    },
    setValue = function (self, prop, value) {
      defaultDescriptor.value = value;
      defineProperty(self, prop, defaultDescriptor);
      delete defaultDescriptor.value;
    }
  ;

  if ('watch' in ObjectPrototype) return;

  defineProperty(
    ObjectPrototype,
    'watch',
    {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function watch(prop, handler) {
        var
          self = this,
          // if already watched, clean up
          undef = self.unwatch(prop),
          // grab the descriptor, if any
          desc = gOPD(self, prop) || defaultDescriptor,
          // previously defined getters or setters
          get = desc.get,
          set = desc.set,
          // current value
          oldValue = get ? get.call(self) : desc.value,
          // the method that will be used per each property set
          updateValue = function (newValue) {
            oldValue = handler.call(self, prop, oldValue, newValue);
            return oldValue;
          },
          // the new descriptor
          descriptor = {
            // by default it's enumerable
            // (the least surprise with the pattern)
            enumerable: desc.enumerable,
            // must be deletable to be able to unwatch
            configurable: true,
            // if there was a getter
            get: get ?
              function () {
                // use it
                var newValue = get.call(this);
                // but change oldValue only
                // if no inheritance is involved
                if (this === self) {
                  oldValue = newValue;
                }
                // return newValue in any case
                return newValue;
              } :
              // return inherited value
              // if no getters where in place
              function () {
                return oldValue;
              },
            // if there was a setter
            set: set ?
              function (newValue) {
                // invoke it ...
                set.call(this, this === self ?
                  // after updating the value
                  // in case no inheritance is involved
                  updateValue(newValue) : newValue);
              } :
              (
                // if this was writable
                desc.writable ?
                  function (newValue) {
                    // if no inheritance involved
                    if (this === self) {
                      // update the value
                      updateValue(newValue);
                    } else {
                      // set the property as regular one
                      setValue(this, prop, newValue);
                    }
                  } :
                  // if not writable ...
                  function (newValue) {
                    // and no inheritance is involved
                    if (this === self) {
                      // notify the method but ...
                      var value = oldValue;
                      updateValue(newValue);
                      // ... do not update the get value
                      oldValue = value;
                    } else {
                      // with inheritance, simply set the property
                      // as if it was a regular assignment operation
                      setValue(this, prop, newValue);
                    }
                  }
              )
          }
        ;
        // all this of course only if the descriptor was configurable
        if (desc.configurable) {
          // store possible old values to put them back
          // through object.unwatch(property) operation
          descriptor.get.value = get;
          descriptor.set.value = set;
          // recognize the descriptor setter
          descriptor.set.watched = true;
          // and remember if it was writable
          descriptor.set.writable = desc.writable;
          // we are watching from now on \o/
          defineProperty(self, prop, descriptor);
        }
      }
    }
  );

  // reverts all watch operations
  defineProperty(
    ObjectPrototype,
    'unwatch',
    {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function unwatch(prop) {
        var
          // grab the property descriptor, if any
          desc = gOPD(this, prop),
          // its getters and setters, if any
          get = desc && desc.get,
          set = desc && desc.set,
          descriptor
        ;
        // if it was watched and it's still configurable
        if (set && set.watched && desc.configurable) {
          // create basic new descriptor structure
          descriptor = {
            enumerable: desc.enumerable,
            configurable: true
          };
          // if there were getters or setters
          if (get.value || set.value) {
            // put them back
            descriptor.get = get.value;
            descriptor.set = set.value;
          } else {
            // otherwise set the writable info
            descriptor.writable = set.writable;
            // and retireve the current value
            descriptor.value = this[prop];
          }
          // redefine it and free it from watch trap
          defineProperty(this, prop, descriptor);
        }
      }
    }
  );

}(Object));