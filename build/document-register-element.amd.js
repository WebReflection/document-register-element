/*! (C) Andrea Giammarchi - @WebReflection - ISC Style License */
define(function(e){"use strict";function t(){var e=C.splice(0,C.length);for(We=0;e.length;)e.shift().call(null,e.shift())}function n(e,t){for(var n=0,r=e.length;n<r;n++)h(e[n],t)}function r(e){for(var t,n=0,r=e.length;n<r;n++)t=e[n],S(t,oe[l(t)])}function o(e){return function(t){Ue(t)&&(h(t,e),le.length&&n(t.querySelectorAll(le),e))}}function l(e){var t=Be.call(e,"is"),n=e.nodeName.toUpperCase(),r=ie.call(re,t?ee+t.toUpperCase():J+n);return t&&-1<r&&!a(n,t)?-1:r}function a(e,t){return-1<le.indexOf(e+'[is="'+t+'"]')}function i(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,o=e.target,l=e[X]||2,a=e[$]||3;!rt||o&&o!==t||!t[B]||"style"===r||e.prevValue===e.newValue&&(""!==e.newValue||n!==l&&n!==a)||t[B](r,n===l?null:e.prevValue,n===a?null:e.newValue)}function u(e){var n=o(e);return function(e){C.push(n,e.target),We&&clearTimeout(We),We=setTimeout(t,1)}}function c(e){nt&&(nt=!1,e.currentTarget.removeEventListener(W,c)),le.length&&n((e.target||g).querySelectorAll(le),e.detail===x?x:_),Pe&&f()}function s(e,t){var n=this;Ge.call(n,e,t),A.call(n,{target:n})}function m(e,t,n){var o=t.apply(e,n),a=l(o);return-1<a&&S(o,oe[a]),n.pop()&&le.length&&r(o.querySelectorAll(le)),o}function d(e,t){Ie(e,t),D?D.observe(e,$e):(tt&&(e.setAttribute=s,e[R]=N(e),e[U](Y,A)),e[U](Q,i)),e[z]&&rt&&(e.created=!0,e[z](),e.created=!1)}function f(){for(var e,t=0,n=_e.length;t<n;t++)e=_e[t],ae.contains(e)||(n--,_e.splice(t--,1),h(e,x))}function p(e){throw new Error("A "+e+" type is already registered")}function h(e,t){var n,r,o=l(e);-1<o&&(F(e,oe[o]),o=0,t!==_||e[_]?t!==x||e[x]||(e[_]=!1,e[x]=!0,r="disconnected",o=1):(e[x]=!1,e[_]=!0,r="connected",o=1,Pe&&ie.call(_e,e)<0&&_e.push(e)),o&&(n=e[t+k]||e[r+k])&&n.call(e))}function T(){}function L(e,t,n){var r=n&&n[q]||"",o=t.prototype,l=De(o),a=t.observedAttributes||de,i={prototype:l};Re(l,z,{value:function(){if(ye)ye=!1;else if(!this[Ee]){this[Ee]=!0,new t(this),o[z]&&o[z].call(this);var e=Ce[Oe.get(t)];(!He||e.create.length>1)&&v(this)}}}),Re(l,B,{value:function(e){-1<ie.call(a,e)&&o[B]&&o[B].apply(this,arguments)}}),o[j]&&Re(l,Z,{value:o[j]}),o[G]&&Re(l,K,{value:o[G]}),r&&(i[q]=r),e=e.toUpperCase(),Ce[e]={constructor:t,create:r?[r,Ne(e)]:[e]},Oe.set(t,e),g[P](e.toLowerCase(),i),H(e),Ae[e].r()}function M(e){var t=Ce[e.toUpperCase()];return t&&t.constructor}function E(e){return"string"==typeof e?e:e&&e.is||""}function v(e){for(var t,n=e[B],r=n?e.attributes:de,o=r.length;o--;)t=r[o],n.call(e,t.name||t.nodeName,null,t.value||t.nodeValue)}function H(e){return e=e.toUpperCase(),e in Ae||(Ae[e]={},Ae[e].p=new be(function(t){Ae[e].r=t})),Ae[e].p}function w(){ve&&delete window.customElements,me(window,"customElements",{configurable:!0,value:new T}),me(window,"CustomElementRegistry",{configurable:!0,value:T});for(var e=y.get(/^HTML[A-Z]*[a-z]/),t=e.length;t--;function(e){var t=window[e];if(t){window[e]=function(e){var n,r;return e||(e=this),e[Ee]||(ye=!0,n=Ce[Oe.get(e.constructor)],r=He&&1===n.create.length,e=r?Reflect.construct(t,de,n.constructor):g.createElement.apply(g,n.create),e[Ee]=!0,ye=!1,r||v(e)),e},window[e].prototype=t.prototype;try{t.prototype.constructor=window[e]}catch(n){Me=!0,me(t,Ee,{value:window[e]})}}}(e[t]));g.createElement=function(e,t){var n=E(t);return n?Xe.call(this,e,Ne(n)):Xe.call(this,e)},Ye||(et=!0,g[P](""))}var g=window.document,b=window.Object,y=function(e){var t,n,r,o,l=/^[A-Z]+[a-z]/,a=function(e){var t,n=[];for(t in u)e.test(t)&&n.push(t);return n},i=function(e,t){(t=t.toLowerCase())in u||(u[e]=(u[e]||[]).concat(t),u[t]=u[t.toUpperCase()]=e)},u=(b.create||b)(null),c={};for(n in e)for(o in e[n])for(r=e[n][o],u[o]=r,t=0;t<r.length;t++)u[r[t].toLowerCase()]=u[r[t].toUpperCase()]=o;return c.get=function(e){return"string"==typeof e?u[e]||(l.test(e)?[]:""):a(e)},c.set=function(e,t){return l.test(e)?i(e,t):i(t,e),c},c}({collections:{HTMLAllCollection:["all"],HTMLCollection:["forms"],HTMLFormControlsCollection:["elements"],HTMLOptionsCollection:["options"]},elements:{Element:["element"],HTMLAnchorElement:["a"],HTMLAppletElement:["applet"],HTMLAreaElement:["area"],HTMLAttachmentElement:["attachment"],HTMLAudioElement:["audio"],HTMLBRElement:["br"],HTMLBaseElement:["base"],HTMLBodyElement:["body"],HTMLButtonElement:["button"],HTMLCanvasElement:["canvas"],HTMLContentElement:["content"],HTMLDListElement:["dl"],HTMLDataElement:["data"],HTMLDataListElement:["datalist"],HTMLDetailsElement:["details"],HTMLDialogElement:["dialog"],HTMLDirectoryElement:["dir"],HTMLDivElement:["div"],HTMLDocument:["document"],HTMLElement:["element","abbr","address","article","aside","b","bdi","bdo","cite","code","command","dd","dfn","dt","em","figcaption","figure","footer","header","i","kbd","mark","nav","noscript","rp","rt","ruby","s","samp","section","small","strong","sub","summary","sup","u","var","wbr"],HTMLEmbedElement:["embed"],HTMLFieldSetElement:["fieldset"],HTMLFontElement:["font"],HTMLFormElement:["form"],HTMLFrameElement:["frame"],HTMLFrameSetElement:["frameset"],HTMLHRElement:["hr"],HTMLHeadElement:["head"],HTMLHeadingElement:["h1","h2","h3","h4","h5","h6"],HTMLHtmlElement:["html"],HTMLIFrameElement:["iframe"],HTMLImageElement:["img"],HTMLInputElement:["input"],HTMLKeygenElement:["keygen"],HTMLLIElement:["li"],HTMLLabelElement:["label"],HTMLLegendElement:["legend"],HTMLLinkElement:["link"],HTMLMapElement:["map"],HTMLMarqueeElement:["marquee"],HTMLMediaElement:["media"],HTMLMenuElement:["menu"],HTMLMenuItemElement:["menuitem"],HTMLMetaElement:["meta"],HTMLMeterElement:["meter"],HTMLModElement:["del","ins"],HTMLOListElement:["ol"],HTMLObjectElement:["object"],HTMLOptGroupElement:["optgroup"],HTMLOptionElement:["option"],HTMLOutputElement:["output"],HTMLParagraphElement:["p"],HTMLParamElement:["param"],HTMLPictureElement:["picture"],HTMLPreElement:["pre"],HTMLProgressElement:["progress"],HTMLQuoteElement:["blockquote","q","quote"],HTMLScriptElement:["script"],HTMLSelectElement:["select"],HTMLShadowElement:["shadow"],HTMLSlotElement:["slot"],HTMLSourceElement:["source"],HTMLSpanElement:["span"],HTMLStyleElement:["style"],HTMLTableCaptionElement:["caption"],HTMLTableCellElement:["td","th"],HTMLTableColElement:["col","colgroup"],HTMLTableElement:["table"],HTMLTableRowElement:["tr"],HTMLTableSectionElement:["thead","tbody","tfoot"],HTMLTemplateElement:["template"],HTMLTextAreaElement:["textarea"],HTMLTimeElement:["time"],HTMLTitleElement:["title"],HTMLTrackElement:["track"],HTMLUListElement:["ul"],HTMLUnknownElement:["unknown","vhgroupv","vkeygen"],HTMLVideoElement:["video"]},nodes:{Attr:["node"],Audio:["audio"],CDATASection:["node"],CharacterData:["node"],Comment:["#comment"],Document:["#document"],DocumentFragment:["#document-fragment"],DocumentType:["node"],HTMLDocument:["#document"],Image:["img"],Option:["option"],ProcessingInstruction:["node"],ShadowRoot:["#shadow-root"],Text:["#text"],XMLDocument:["xml"]}});"object"!=typeof e&&(e={type:e||"auto"});var C,A,O,N,D,I,F,S,V,P="registerElement",R="__"+P+(1e5*window.Math.random()>>0),U="addEventListener",_="attached",k="Callback",x="detached",q="extends",B="attributeChanged"+k,Z=_+k,j="connected"+k,G="disconnected"+k,z="created"+k,K=x+k,X="ADDITION",$="REMOVAL",Q="DOMAttrModified",W="DOMContentLoaded",Y="DOMSubtreeModified",J="<",ee="=",te=/^[A-Z][._A-Z0-9]*-[-._A-Z0-9]*$/,ne=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],re=[],oe=[],le="",ae=g.documentElement,ie=re.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},ue=b.prototype,ce=ue.hasOwnProperty,se=ue.isPrototypeOf,me=b.defineProperty,de=[],fe=b.getOwnPropertyDescriptor,pe=b.getOwnPropertyNames,he=b.getPrototypeOf,Te=b.setPrototypeOf,Le=!!b.__proto__,Me=!1,Ee="__dreCEv1",ve=window.customElements,He=!/^force/.test(e.type)&&!!(ve&&ve.define&&ve.get&&ve.whenDefined),we=b.create||b,ge=window.Map||function(){var e,t=[],n=[];return{get:function(e){return n[ie.call(t,e)]},set:function(r,o){e=ie.call(t,r),e<0?n[t.push(r)-1]=o:n[e]=o}}},be=window.Promise||function(e){function t(e){for(r=!0;n.length;)n.shift()(e)}var n=[],r=!1,o={"catch":function(){return o},then:function(e){return n.push(e),r&&setTimeout(t,1),o}};return e(t),o},ye=!1,Ce=we(null),Ae=we(null),Oe=new ge,Ne=function(e){return e.toLowerCase()},De=b.create||function at(e){return e?(at.prototype=e,new at):this},Ie=Te||(Le?function(e,t){return e.__proto__=t,e}:pe&&fe?function(){function e(e,t){for(var n,r=pe(t),o=0,l=r.length;o<l;o++)n=r[o],ce.call(e,n)||me(e,n,fe(t,n))}return function(t,n){do{e(t,n)}while((n=he(n))&&!se.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),Fe=window.MutationObserver||window.WebKitMutationObserver,Se=window.HTMLAnchorElement,Ve=(window.HTMLElement||window.Element||window.Node).prototype,Pe=!se.call(Ve,ae),Re=Pe?function(e,t,n){return e[t]=n.value,e}:me,Ue=Pe?function(e){return 1===e.nodeType}:function(e){return se.call(Ve,e)},_e=Pe&&[],ke=Ve.attachShadow,xe=Ve.cloneNode,qe=Ve.dispatchEvent,Be=Ve.getAttribute,Ze=Ve.hasAttribute,je=Ve.removeAttribute,Ge=Ve.setAttribute,ze=g.createElement,Ke=g.importNode,Xe=ze,$e=Fe&&{attributes:!0,characterData:!0,attributeOldValue:!0},Qe=Fe||function(e){tt=!1,ae.removeEventListener(Q,Qe)},We=0,Ye=P in g&&!/^force-all/.test(e.type),Je=!0,et=!1,tt=!0,nt=!0,rt=!0;if(Fe&&(V=g.createElement("div"),V.innerHTML="<div><div></div></div>",new Fe(function(e,t){if(e[0]&&"childList"==e[0].type&&!e[0].removedNodes[0].childNodes.length){V=fe(Ve,"innerHTML");var n=V&&V.set;n&&me(Ve,"innerHTML",{set:function(e){for(;this.lastChild;)this.removeChild(this.lastChild);n.call(this,e)}})}t.disconnect(),V=null}).observe(V,{childList:!0,subtree:!0}),V.innerHTML=""),Ye||(Te||Le?(F=function(e,t){se.call(t,e)||d(e,t)},S=d):(F=function(e,t){e[R]||(e[R]=b(!0),d(e,t))},S=F),Pe?(tt=!1,function(){var e=fe(Ve,U),t=e.value,n=function(e){var t=new CustomEvent(Q,{bubbles:!0});t.attrName=e,t.prevValue=Be.call(this,e),t.newValue=null,t[$]=t.attrChange=2,je.call(this,e),qe.call(this,t)},r=function(e,t){var n=Ze.call(this,e),r=n&&Be.call(this,e),o=new CustomEvent(Q,{bubbles:!0});Ge.call(this,e,t),o.attrName=e,o.prevValue=n?r:null,o.newValue=t,n?o.MODIFICATION=o.attrChange=1:o[X]=o.attrChange=0,qe.call(this,o)},o=function(e){var t,n=e.currentTarget,r=n[R],o=e.propertyName;r.hasOwnProperty(o)&&(r=r[o],t=new CustomEvent(Q,{bubbles:!0}),t.attrName=r.name,t.prevValue=r.value||null,t.newValue=r.value=n[o]||null,null==t.prevValue?t[X]=t.attrChange=0:t.MODIFICATION=t.attrChange=1,qe.call(n,t))};e.value=function(e,l,a){e===Q&&this[B]&&this.setAttribute!==r&&(this[R]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",o)),t.call(this,e,l,a)},me(Ve,U,e)}()):Fe||(ae[U](Q,Qe),ae.setAttribute(R,1),ae.removeAttribute(R),tt&&(A=function(e){var t,n,r,o=this;if(o===e.target){t=o[R],o[R]=n=N(o);for(r in n){if(!(r in t))return O(0,o,r,t[r],n[r],X);if(n[r]!==t[r])return O(1,o,r,t[r],n[r],"MODIFICATION")}for(r in t)if(!(r in n))return O(2,o,r,t[r],n[r],$)}},O=function(e,t,n,r,o,l){var a={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:o};a[l]=e,i(a)},N=function(e){for(var t,n,r={},o=e.attributes,l=0,a=o.length;l<a;l++)t=o[l],"setAttribute"!==(n=t.name)&&(r[n]=t.value);return r})),g[P]=function(e,t){if(r=e.toUpperCase(),Je&&(Je=!1,Fe?(D=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new Fe(function(r){for(var o,l,a,i=0,u=r.length;i<u;i++)o=r[i],"childList"===o.type?(n(o.addedNodes,e),n(o.removedNodes,t)):(l=o.target,rt&&l[B]&&"style"!==o.attributeName&&(a=Be.call(l,o.attributeName))!==o.oldValue&&l[B](o.attributeName,o.oldValue,a))})}(o(_),o(x)),I=function(e){return D.observe(e,{childList:!0,subtree:!0}),e},I(g),ke&&(Ve.attachShadow=function(){return I(ke.apply(this,arguments))})):(C=[],g[U]("DOMNodeInserted",u(_)),g[U]("DOMNodeRemoved",u(x))),g[U](W,c),g[U]("readystatechange",c),g.importNode=function(e,t){switch(e.nodeType){case 1:return m(g,Ke,[e,!!t]);case 11:for(var n=g.createDocumentFragment(),r=e.childNodes,o=r.length,l=0;l<o;l++)n.appendChild(g.importNode(r[l],!!t));return n;default:return xe.call(e,!!t)}},Ve.cloneNode=function(e){return m(this,xe,[!!e])}),et)return et=!1;if(-2<ie.call(re,ee+r)+ie.call(re,J+r)&&p(e),!te.test(r)||-1<ie.call(ne,r))throw new Error("The type "+e+" is invalid");var r,l,a=function(){return s?g.createElement(d,r):g.createElement(d)},i=t||ue,s=ce.call(i,q),d=s?t[q].toUpperCase():r;return s&&-1<ie.call(re,J+d)&&p(d),l=re.push((s?ee:J)+r)-1,le=le.concat(le.length?",":"",s?d+'[is="'+e.toLowerCase()+'"]':d),a.prototype=oe[l]=ce.call(i,"prototype")?i.prototype:De(Ve),le.length&&n(g.querySelectorAll(le),_),a},g.createElement=Xe=function(e,t){var n=E(t),r=n?ze.call(g,e,Ne(n)):ze.call(g,e),o=""+e,l=ie.call(re,(n?ee:J)+(n||o).toUpperCase()),i=-1<l;return n&&(r.setAttribute("is",n=n.toLowerCase()),i&&(i=a(o.toUpperCase(),n))),rt=!g.createElement.innerHTMLHelper,i&&S(r,oe[l]),r}),T.prototype={constructor:T,define:He?function(e,t,n){if(n)L(e,t,n);else{var r=e.toUpperCase();Ce[r]={constructor:t,create:[r]},Oe.set(t,r),ve.define(e,t)}}:L,get:He?function(e){return ve.get(e)||M(e)}:M,whenDefined:He?function(e){return be.race([ve.whenDefined(e),H(e)])}:H},!ve||/^force/.test(e.type))w();else if(!e.noBuiltIn)try{!function(e,t,n){var r=new RegExp("^<a\\s+is=('|\")"+n+"\\1></a>$");if(t[q]="a",e.prototype=De(Se.prototype),e.prototype.constructor=e,window.customElements.define(n,e,t),!r.test(g.createElement("a",{is:n}).outerHTML)||!r.test((new e).outerHTML))throw t}(function it(){return Reflect.construct(Se,[],it)},{},"document-register-element-a")}catch(ot){w()}if(!e.noBuiltIn)try{if(ze.call(g,"a","a").outerHTML.indexOf("is")<0)throw{}}catch(lt){Ne=function(e){return{is:e.toLowerCase()}}}});
