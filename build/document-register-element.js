/*! (C) Andrea Giammarchi - @WebReflection - Mit Style License */
(function(e){"use strict";function _t(){var e=bt.splice(0,bt.length);wt=0;while(e.length)e.shift().call(null,e.shift())}function Dt(e,t){for(var n=0,r=e.length;n<r;n++)Xt(e[n],t)}function Pt(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],Mt(r,L[Bt(r)])}function Ht(e){return function(t){ot(t)&&(Xt(t,e),Dt(t.querySelectorAll(A),e))}}function Bt(e){var t=ct.call(e,"is"),n=e.nodeName.toUpperCase(),r=M.call(k,t?T+t.toUpperCase():x+n);return t&&-1<r&&!jt(n,t)?-1:r}function jt(e,t){return-1<A.indexOf(e+'[is="'+t+'"]')}function Ft(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target,s=e[g]||2,o=e[b]||3;Tt&&(!i||i===t)&&t[c]&&r!=="style"&&(e.prevValue!==e.newValue||e.newValue===""&&(n===s||n===o))&&t[c](r,n===s?null:e.prevValue,n===o?null:e.newValue)}function It(e){var t=Ht(e);return function(e){bt.push(t,e.target),wt&&clearTimeout(wt),wt=setTimeout(_t,1)}}function qt(e){xt&&(xt=!1,e.currentTarget.removeEventListener(E,qt)),Dt((e.target||t).querySelectorAll(A),e.detail===f?f:u),it&&zt()}function Rt(e,t){var n=this;dt.call(n,e,t),Nt.call(n,{target:n})}function Ut(e,t){tt(e,t),Lt?Lt.observe(e,gt):(St&&(e.setAttribute=Rt,e[s]=kt(e),e[o](S,Nt)),e[o](w,Ft)),e[v]&&Tt&&(e.created=!0,e[v](),e.created=!1)}function zt(){for(var e,t=0,n=ut.length;t<n;t++)e=ut[t],O.contains(e)||(n--,ut.splice(t--,1),Xt(e,f))}function Wt(e){throw new Error("A "+e+" type is already registered")}function Xt(e,t){var n,r=Bt(e);-1<r&&(Ot(e,L[r]),r=0,t===u&&!e[u]?(e[f]=!1,e[u]=!0,r=1,it&&M.call(ut,e)<0&&ut.push(e)):t===f&&!e[f]&&(e[u]=!1,e[f]=!0,r=1),r&&(n=e[t+a])&&n.call(e))}function Vt(){}function $t(e,n,r){var s=r&&r[l]||"",o=n.prototype,u=et(o),a=n.observedAttributes||B,f={prototype:u};st(u,v,{value:function(){if(K)K=!1;else if(!this[z]){this[z]=!0,new n(this),o[v]&&o[v].call(this);var e=Q[Y.get(n)];(!X||e.create.length>1)&&Qt(this)}}}),st(u,c,{value:function(e){-1<M.call(a,e)&&o[c].apply(this,arguments)}}),o[p]&&st(u,h,{value:o[p]}),o[d]&&st(u,m,{value:o[d]}),s&&(f[l]=s),e=e.toUpperCase(),Q[e]={constructor:n,create:s?[s,Z(e)]:[e]},Y.set(n,e),t[i](e.toLowerCase(),f),Gt(e),G[e].r()}function Jt(e){var t=Q[e.toUpperCase()];return t&&t.constructor}function Kt(e){return typeof e=="string"?e:e&&e.is||""}function Qt(e){var t=e[c],n=t?e.attributes:B,r=n.length,i;while(r--)i=n[r],t.call(e,i.name||i.nodeName,null,i.value||i.nodeValue)}function Gt(e){return e=e.toUpperCase(),e in G||(G[e]={},G[e].p=new J(function(t){G[e].r=t})),G[e].p}function Yt(){W&&delete e.customElements,H(e,"customElements",{configurable:!0,value:new Vt}),H(e,"CustomElementRegistry",{configurable:!0,value:Vt});for(var n=function(n){var r=e[n];if(r){e[n]=function(n){var i,s;return n||(n=this),n[z]||(K=!0,i=Q[Y.get(n.constructor)],s=X&&i.create.length===1,n=s?Reflect.construct(r,B,i.constructor):t.createElement.apply(t,i.create),n[z]=!0,K=!1,s||Qt(n)),n},e[n].prototype=r.prototype;try{r.prototype.constructor=e[n]}catch(i){U=!0,H(r,z,{value:e[n]})}}},i=r.get(/^HTML[A-Z]*[a-z]/),s=i.length;s--;n(i[s]));t.createElement=function(e,t){var n=Kt(t);return n?mt.call(this,e,Z(n)):mt.call(this,e)}}var t=e.document,n=e.Object,r=function(e){var t=/^[A-Z]+[a-z]/,r=function(e){var t=[],n;for(n in s)e.test(n)&&t.push(n);return t},i=function(e,t){t=t.toLowerCase(),t in s||(s[e]=(s[e]||[]).concat(t),s[t]=s[t.toUpperCase()]=e)},s=(n.create||n)(null),o={},u,a,f,l;for(a in e)for(l in e[a]){f=e[a][l],s[l]=f;for(u=0;u<f.length;u++)s[f[u].toLowerCase()]=s[f[u].toUpperCase()]=l}return o.get=function(n){return typeof n=="string"?s[n]||(t.test(n)?[]:""):r(n)},o.set=function(n,r){return t.test(n)?i(n,r):i(r,n),o},o}({collections:{HTMLAllCollection:["all"],HTMLCollection:["forms"],HTMLFormControlsCollection:["elements"],HTMLOptionsCollection:["options"]},elements:{Element:["element"],HTMLAnchorElement:["a"],HTMLAppletElement:["applet"],HTMLAreaElement:["area"],HTMLAttachmentElement:["attachment"],HTMLAudioElement:["audio"],HTMLBRElement:["br"],HTMLBaseElement:["base"],HTMLBodyElement:["body"],HTMLButtonElement:["button"],HTMLCanvasElement:["canvas"],HTMLContentElement:["content"],HTMLDListElement:["dl"],HTMLDataElement:["data"],HTMLDataListElement:["datalist"],HTMLDetailsElement:["details"],HTMLDialogElement:["dialog"],HTMLDirectoryElement:["dir"],HTMLDivElement:["div"],HTMLDocument:["document"],HTMLElement:["element","abbr","address","article","aside","b","bdi","bdo","cite","code","command","dd","dfn","dt","em","figcaption","figure","footer","header","i","kbd","mark","nav","noscript","rp","rt","ruby","s","samp","section","small","strong","sub","summary","sup","u","var","wbr"],HTMLEmbedElement:["embed"],HTMLFieldSetElement:["fieldset"],HTMLFontElement:["font"],HTMLFormElement:["form"],HTMLFrameElement:["frame"],HTMLFrameSetElement:["frameset"],HTMLHRElement:["hr"],HTMLHeadElement:["head"],HTMLHeadingElement:["h1","h2","h3","h4","h5","h6"],HTMLHtmlElement:["html"],HTMLIFrameElement:["iframe"],HTMLImageElement:["img"],HTMLInputElement:["input"],HTMLKeygenElement:["keygen"],HTMLLIElement:["li"],HTMLLabelElement:["label"],HTMLLegendElement:["legend"],HTMLLinkElement:["link"],HTMLMapElement:["map"],HTMLMarqueeElement:["marquee"],HTMLMediaElement:["media"],HTMLMenuElement:["menu"],HTMLMenuItemElement:["menuitem"],HTMLMetaElement:["meta"],HTMLMeterElement:["meter"],HTMLModElement:["del","ins"],HTMLOListElement:["ol"],HTMLObjectElement:["object"],HTMLOptGroupElement:["optgroup"],HTMLOptionElement:["option"],HTMLOutputElement:["output"],HTMLParagraphElement:["p"],HTMLParamElement:["param"],HTMLPictureElement:["picture"],HTMLPreElement:["pre"],HTMLProgressElement:["progress"],HTMLQuoteElement:["blockquote","q","quote"],HTMLScriptElement:["script"],HTMLSelectElement:["select"],HTMLShadowElement:["shadow"],HTMLSlotElement:["slot"],HTMLSourceElement:["source"],HTMLSpanElement:["span"],HTMLStyleElement:["style"],HTMLTableCaptionElement:["caption"],HTMLTableCellElement:["td","th"],HTMLTableColElement:["col","colgroup"],HTMLTableElement:["table"],HTMLTableRowElement:["tr"],HTMLTableSectionElement:["thead","tbody","tfoot"],HTMLTemplateElement:["template"],HTMLTextAreaElement:["textarea"],HTMLTimeElement:["time"],HTMLTitleElement:["title"],HTMLTrackElement:["track"],HTMLUListElement:["ul"],HTMLUnknownElement:["unknown","vhgroupv","vkeygen"],HTMLVideoElement:["video"]},nodes:{Attr:["node"],Audio:["audio"],CDATASection:["node"],CharacterData:["node"],Comment:["#comment"],Document:["#document"],DocumentFragment:["#document-fragment"],DocumentType:["node"],HTMLDocument:["#document"],Image:["img"],Option:["option"],ProcessingInstruction:["node"],ShadowRoot:["#shadow-root"],Text:["#text"],XMLDocument:["xml"]}}),i="registerElement",s="__"+i+(e.Math.random()*1e5>>0),o="addEventListener",u="attached",a="Callback",f="detached",l="extends",c="attributeChanged"+a,h=u+a,p="connected"+a,d="disconnected"+a,v="created"+a,m=f+a,g="ADDITION",y="MODIFICATION",b="REMOVAL",w="DOMAttrModified",E="DOMContentLoaded",S="DOMSubtreeModified",x="<",T="=",N=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,C=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],k=[],L=[],A="",O=t.documentElement,M=k.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},_=n.prototype,D=_.hasOwnProperty,P=_.isPrototypeOf,H=n.defineProperty,B=[],j=n.getOwnPropertyDescriptor,F=n.getOwnPropertyNames,I=n.getPrototypeOf,q=n.setPrototypeOf,R=!!n.__proto__,U=!1,z="__dreCEv1",W=e.customElements,X=!!(W&&W.define&&W.get&&W.whenDefined),V=n.create||n,$=e.Map||function(){var t=[],n=[],r;return{get:function(e){return n[M.call(t,e)]},set:function(e,i){r=M.call(t,e),r<0?n[t.push(e)-1]=i:n[r]=i}}},J=e.Promise||function(e){function i(e){n=!0;while(t.length)t.shift()(e)}var t=[],n=!1,r={"catch":function(){return r},then:function(e){return t.push(e),n&&setTimeout(i,1),r}};return e(i),r},K=!1,Q=V(null),G=V(null),Y=new $,Z=String,et=n.create||function tn(e){return e?(tn.prototype=e,new tn):this},tt=q||(R?function(e,t){return e.__proto__=t,e}:F&&j?function(){function e(e,t){for(var n,r=F(t),i=0,s=r.length;i<s;i++)n=r[i],D.call(e,n)||H(e,n,j(t,n))}return function(t,n){do e(t,n);while((n=I(n))&&!P.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),nt=e.MutationObserver||e.WebKitMutationObserver,rt=(e.HTMLElement||e.Element||e.Node).prototype,it=!P.call(rt,O),st=it?function(e,t,n){return e[t]=n.value,e}:H,ot=it?function(e){return e.nodeType===1}:function(e){return P.call(rt,e)},ut=it&&[],at=rt.attachShadow,ft=rt.cloneNode,lt=rt.dispatchEvent,ct=rt.getAttribute,ht=rt.hasAttribute,pt=rt.removeAttribute,dt=rt.setAttribute,vt=t.createElement,mt=vt,gt=nt&&{attributes:!0,characterData:!0,attributeOldValue:!0},yt=nt||function(e){St=!1,O.removeEventListener(w,yt)},bt,wt=0,Et=!1,St=!0,xt=!0,Tt=!0,Nt,Ct,kt,Lt,At,Ot,Mt;i in t||(q||R?(Ot=function(e,t){P.call(t,e)||Ut(e,t)},Mt=Ut):(Ot=function(e,t){e[s]||(e[s]=n(!0),Ut(e,t))},Mt=Ot),it?(St=!1,function(){var e=j(rt,o),t=e.value,n=function(e){var t=new CustomEvent(w,{bubbles:!0});t.attrName=e,t.prevValue=ct.call(this,e),t.newValue=null,t[b]=t.attrChange=2,pt.call(this,e),lt.call(this,t)},r=function(e,t){var n=ht.call(this,e),r=n&&ct.call(this,e),i=new CustomEvent(w,{bubbles:!0});dt.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[y]=i.attrChange=1:i[g]=i.attrChange=0,lt.call(this,i)},i=function(e){var t=e.currentTarget,n=t[s],r=e.propertyName,i;n.hasOwnProperty(r)&&(n=n[r],i=new CustomEvent(w,{bubbles:!0}),i.attrName=n.name,i.prevValue=n.value||null,i.newValue=n.value=t[r]||null,i.prevValue==null?i[g]=i.attrChange=0:i[y]=i.attrChange=1,lt.call(t,i))};e.value=function(e,o,u){e===w&&this[c]&&this.setAttribute!==r&&(this[s]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",i)),t.call(this,e,o,u)},H(rt,o,e)}()):nt||(O[o](w,yt),O.setAttribute(s,1),O.removeAttribute(s),St&&(Nt=function(e){var t=this,n,r,i;if(t===e.target){n=t[s],t[s]=r=kt(t);for(i in r){if(!(i in n))return Ct(0,t,i,n[i],r[i],g);if(r[i]!==n[i])return Ct(1,t,i,n[i],r[i],y)}for(i in n)if(!(i in r))return Ct(2,t,i,n[i],r[i],b)}},Ct=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,Ft(o)},kt=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[i]=function(n,r){p=n.toUpperCase(),Et||(Et=!0,nt?(Lt=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new nt(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Tt&&s[c]&&i.attributeName!=="style"&&(o=ct.call(s,i.attributeName),o!==i.oldValue&&s[c](i.attributeName,i.oldValue,o)))})}(Ht(u),Ht(f)),At=function(e){return Lt.observe(e,{childList:!0,subtree:!0}),e},At(t),at&&(rt.attachShadow=function(){return At(at.apply(this,arguments))})):(bt=[],t[o]("DOMNodeInserted",It(u)),t[o]("DOMNodeRemoved",It(f))),t[o](E,qt),t[o]("readystatechange",qt),rt.cloneNode=function(e){var t=ft.call(this,!!e),n=Bt(t);return-1<n&&Mt(t,L[n]),e&&Pt(t.querySelectorAll(A)),t}),-2<M.call(k,T+p)+M.call(k,x+p)&&Wt(n);if(!N.test(p)||-1<M.call(C,p))throw new Error("The type "+n+" is invalid");var i=function(){return a?t.createElement(h,p):t.createElement(h)},s=r||_,a=D.call(s,l),h=a?r[l].toUpperCase():p,p,d;return a&&-1<M.call(k,x+h)&&Wt(h),d=k.push((a?T:x)+p)-1,A=A.concat(A.length?",":"",a?h+'[is="'+n.toLowerCase()+'"]':h),i.prototype=L[d]=D.call(s,"prototype")?s.prototype:et(rt),Dt(t.querySelectorAll(A),u),i},t.createElement=mt=function(e,n){var r=Kt(n),i=r?vt.call(t,e,Z(r)):vt.call(t,e),s=""+e,o=M.call(k,(r?T:x)+(r||s).toUpperCase()),u=-1<o;return r&&(i.setAttribute("is",r=r.toLowerCase()),u&&(u=jt(s.toUpperCase(),r))),Tt=!t.createElement.innerHTMLHelper,u&&Mt(i,L[o]),i}),Vt.prototype={constructor:Vt,define:X?function(e,t,n){if(n)$t(e,t,n);else{var r=e.toUpperCase();Q[r]={constructor:t,create:[r]},Y.set(t,r),W.define(e,t)}}:$t,get:X?function(e){return W.get(e)||Jt(e)}:Jt,whenDefined:X?function(e){return J.race([W.whenDefined(e),Gt(e)])}:Gt};if(!W)Yt();else try{(function(n,r,i){r[l]="a",n.prototype=et(HTMLAnchorElement.prototype),n.prototype.constructor=n,e.customElements.define(i,n,r);if(ct.call(t.createElement("a",{is:i}),"is")!==i||X&&ct.call(new n,"is")!==i)throw r})(function nn(){return Reflect.construct(HTMLAnchorElement,[],nn)},{},"document-register-element-a")}catch(Zt){Yt()}try{vt.call(t,"a","a")}catch(en){Z=function(e){return{is:e}}}})(this);