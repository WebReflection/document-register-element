document-register-element
=========================

A stand-alone working lightweight version of the [W3C Custom Elements](http://w3c.github.io/webcomponents/spec/custom/) specification.


[![build status](https://travis-ci.org/WebReflection/document-register-element.svg)](https://travis-ci.org/WebReflection/document-register-element)


### How

`npm install document-register-element` should bring [build/document-register-element.js](build/document-register-element.js) inside the module folder.

Otherwise simply:
```html
<script src="build/document-register-element.js"></script>
```
on your head element and you should be good to go.

#### via CDN
Many thanks to [cdnjs](http://www.cdnjs.com) for hosting this script. Following an example on how to include it.
```html
<script
  src="//cdnjs.cloudflare.com/ajax/libs/document-register-element/0.1.8/document-register-element.js"
>/* W3C Custom Elements */</script>
```

### TL;DR does it work ?
If you [see the first clock ticking](https://webreflection.github.io/custom-element/), the TL;DR answer is yes.


### Usage Example

A basic HTML example page
```html
<!DOCTYPE html>
<html>
<head>
  <title>testing my-element</title>
  <script src="js/document-register-element.js"></script>
  <script src="js/my-element.js"></script>
</head>
<body>
  <my-element>
    some content
  </my-element>
</body>
```

with the following `my-element.js` content
```javascript
var MyElement = document.registerElement(
  'my-element',
  {
    prototype: Object.create(
      HTMLElement.prototype, {
      createdCallback: {value: function() {
        console.log('here I am ^_^ ');
        console.log('with content: ', this.textContent);
      }},
      attachedCallback: {value: function() {
        console.log('live on DOM ;-) ');
      }},
      detachedCallback: {value: function() {
        console.log('leaving the DOM :-( )');
      }},
      attributeChangedCallback: {value: function(
        name, previousValue, value
      ) {
        if (previousValue == null) {
          console.log(
            'got a new attribute ', name,
            ' with value ', value
          );
        } else if (value == null) {
          console.log(
            'somebody removed ', name,
            ' its value was ', previousValue
          );
        } else {
          console.log(
            name,
            ' changed from ', previousValue,
            ' to ', value
          );
        }
      }}
    })
  }
);
```


### Why

The Polymer framework has a [CustomElements](https://github.com/Polymer/CustomElements) under the hood that requires other repositories and a build process that will end up creating 15KB of `custom-elements.min.js` that will most likely not even work due a missing [ES6 WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) that is needed for a big percentage of today browsing users out there.

Adding such polyfill in a reliable way means including [this file](http://code.google.com/p/es-lab/source/browse/trunk/src/ses/WeakMap.js) plus different extra files from SES to make that work and yet you simply wanted to create some reusable DOM element ... so here an alternative!

[document-register-element.js](build/document-register-element.js) is a stand alone polyfill which aim is to support as many browsers as possible, without requiring extra dependencies, without needing a `WeakMap` at all, in about **2KB** minified and gzipped, around 13KB plain as it is ... strawberry on top, feel free to contribute without signing anything :)

Add if you want [dom4](https://github.com/WebReflection/dom4#dom4) normalizer and you'll find yourself in a modern DOM environment that works reliably with today browsers with an eye always open on performance.

- - -

Here also the [dedicate blog post](http://webreflection.blogspot.com/2014/07/a-w3c-custom-elements-alternative.html) to know even more, if interested :-)


### Tested On

The [live test page](http://webreflection.github.io/document-register-element/test/) is here, containing all tests as listed in [the test file](test/document-register-element.js).

The following list of **desktop** browsers has been successfully tested:

  * Chrome
  * Firefox
  * IE 9 or greater
  * Safari
  * Opera

The following list of **mobile** OS has been successfully tested:

  * iOS 5.1 or greater
  * Android 2.2 or greater
  * FirefoxOS 1.1 or greater
  * KindleFire 3 or greater
  * Windows Phone 7 or greater
  * Opera Mobile 12 or greater
  * Blackberry OS 7* and OS 10
  * webOS 2 or LG TV
  * Samsung Bada OS 2 or greater
  * NOKIA Asha with Express Browser

The good old [BB OS 7](http://us.blackberry.com/software/smartphones/blackberry-7-os.html) is the only one failing the test with `className` which is not notified as `attributeChanged` when it's changed. This means BB OS 7 will also fail with `id`, however changing `id` at runtime has never been a common or useful pattern.


### Common Issues + Caveat
Here a list of gotchas you might encounter when developing *CustomElement* components.

#### HTML{TABLE|ROW|INPUT|SELECT|others...}Element
As described in [issue 6](https://github.com/WebReflection/document-register-element/issues/6) it's not possible to fully inherit a table, input, select, or other special element behaviors.
```js
// This will NOT work as expected
document.registerElement(
  'my-input',
  {
    prototype: Object.create(
      HTMLInputElement.prototype
    )
  }
);

var mi = document.createElement('my-input');
```

The correct way to properly implement a custom input that will be also backward compatible is the following one:
```js
// This will NOT work as expected
document.registerElement(
  'my-input',
  {
    extends: 'input', // <== IMPORTANT
    prototype: Object.create(
      HTMLInputElement.prototype
    )
  }
);

// how to create the input
var mi = document.createElement(
  'input',    // the extend
  'my-input'  // the enriched custom definition
);
```

Another approach is to use just a basic `HTMLElement` component and initialize its content at runtime.
```js
document.registerElement(
  'my-input',
  {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        createdCallback: {value: function () {
          // here the input
          this.el = this.appendChild(
            document.createElement('input')
          );
        }}
      }
    )
  }
);

var mi = document.createElement('my-input');
```
In this case every method that wants to interact with the input will refer `this.el` instead of just `this`.


#### Changing the `style` property

If you change the style property via `node.style.cssText` or `node.style.backgroundColor = "red"` this change will most likely reflect through `node.getAttribute("style")`.

In order to prevent footguns inside `attributeChangedCallback` invocations causing potential stack overflows, the `style` property has been filtered starting from version `0.1.1`, also reflecting current native implementation where changing this special property won't invoke the callback.

(yes, even using `node.setAttribute("style", "value")` that you shouldn't ... just use `node.style.cssText = "value"` instead)


#### About IE8

I don't think there's any library out there able to bring IE8 to these levels, but the code used in this project is syntactically compatible with this old pal too ... moreover, if anyone would ever manage to bring the deprecated [Mutation events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) API to IE8, being the `observer` way more complex to shim, this library should work out of the box!