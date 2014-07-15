document-register-element
=========================

A stand-alone working lightweight version of the [W3C Custom Elements](http://w3c.github.io/webcomponents/spec/custom/) specification.


### How

`npm install document-register-element` should bring [build/document-register-element.js](build/document-register-element.js) inside the module folder.

Otherwise simply:
```html
<script src="build/document-register-element.js"></script>
```
on your head element and you should be good to go.


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
  * Android 2.3 or greater
  * FirefoxOS 1.2 or greater
  * KindleFire 3 or greater
  * Windows Phone 7 or greater
  * Opera Mobile 12 or greater
  * Blackberry OS 7* and OS 10
  * webOS 2 or LG TV
  * Samsung Bada OS 2 or greater
  * NOKIA Asha with Express Browser

The good old [BB OS 7](http://us.blackberry.com/software/smartphones/blackberry-7-os.html) is the only one failing the test with `className` which is not notified as `attributeChanged` when it's changed. This means BB OS 7 will also fail with `id`, however changing `id` at runtime has never been a common or useful pattern.


#### About IE8

I don't think there's any library out there able to bring IE8 to these levels, but the code used in this project is syntactically compatible with this old pal too ... moreover, if anyone would ever manage to bring the deprecated [Mutation events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) API to IE8, being the `observer` way more complex to shim, this library should work out of the box!