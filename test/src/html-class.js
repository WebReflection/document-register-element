var htmlClass = (function (info) {
  // (C) Andrea Giammarchi - @WebReflection - MIT Style
  var
    catchClass = /^[A-Z]+[a-z]/,
    filterBy = function (re) {
      var arr = [], tag;
      for (tag in register) {
        if (re.test(tag)) arr.push(tag);
      }
      return arr;
    },
    add = function (Class, tag) {
      tag = tag.toLowerCase();
      if (!(tag in register)) {
        register[Class] = (register[Class] || []).concat(tag);
        register[tag] = (register[tag.toUpperCase()] = Class);
      }
    },
    register = (Object.create || Object)(null),
    htmlClass = {},
    i, section, tags, Class
  ;
  for (section in info) {
    for (Class in info[section]) {
      tags = info[section][Class];
      register[Class] = tags;
      for (i = 0; i < tags.length; i++) {
        register[tags[i].toLowerCase()] =
        register[tags[i].toUpperCase()] = Class;
      }
    }
  }
  htmlClass.get = function get(tagOrClass) {
    return typeof tagOrClass === 'string' ?
      (register[tagOrClass] || (catchClass.test(tagOrClass) ? [] : '')) :
      filterBy(tagOrClass);
  };
  htmlClass.set = function set(tag, Class) {
    return (catchClass.test(tag) ?
      add(tag, Class) :
      add(Class, tag)
    ), htmlClass;
  };
  return htmlClass;
}({
  "collections": {
    "HTMLAllCollection": [
      "all"
    ],
    "HTMLCollection": [
      "forms"
    ],
    "HTMLFormControlsCollection": [
      "elements"
    ],
    "HTMLOptionsCollection": [
      "options"
    ]
  },
  "elements": {
    "Element": [
      "element"
    ],
    "HTMLAnchorElement": [
      "a"
    ],
    "HTMLAppletElement": [
      "applet"
    ],
    "HTMLAreaElement": [
      "area"
    ],
    "HTMLAttachmentElement": [
      "attachment"
    ],
    "HTMLAudioElement": [
      "audio"
    ],
    "HTMLBRElement": [
      "br"
    ],
    "HTMLBaseElement": [
      "base"
    ],
    "HTMLBodyElement": [
      "body"
    ],
    "HTMLButtonElement": [
      "button"
    ],
    "HTMLCanvasElement": [
      "canvas"
    ],
    "HTMLContentElement": [
      "content"
    ],
    "HTMLDListElement": [
      "dl"
    ],
    "HTMLDataElement": [
      "data"
    ],
    "HTMLDataListElement": [
      "datalist"
    ],
    "HTMLDetailsElement": [
      "details"
    ],
    "HTMLDialogElement": [
      "dialog"
    ],
    "HTMLDirectoryElement": [
      "dir"
    ],
    "HTMLDivElement": [
      "div"
    ],
    "HTMLDocument": [
      "document"
    ],
    "HTMLElement": [
      "element",
      "abbr",
      "address",
      "article",
      "aside",
      "b",
      "bdi",
      "bdo",
      "cite",
      "code",
      "command",
      "dd",
      "dfn",
      "dt",
      "em",
      "figcaption",
      "figure",
      "footer",
      "header",
      "i",
      "kbd",
      "mark",
      "nav",
      "noscript",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "section",
      "small",
      "strong",
      "sub",
      "summary",
      "sup",
      "u",
      "var",
      "wbr"
    ],
    "HTMLEmbedElement": [
      "embed"
    ],
    "HTMLFieldSetElement": [
      "fieldset"
    ],
    "HTMLFontElement": [
      "font"
    ],
    "HTMLFormElement": [
      "form"
    ],
    "HTMLFrameElement": [
      "frame"
    ],
    "HTMLFrameSetElement": [
      "frameset"
    ],
    "HTMLHRElement": [
      "hr"
    ],
    "HTMLHeadElement": [
      "head"
    ],
    "HTMLHeadingElement": [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6"
    ],
    "HTMLHtmlElement": [
      "html"
    ],
    "HTMLIFrameElement": [
      "iframe"
    ],
    "HTMLImageElement": [
      "img"
    ],
    "HTMLInputElement": [
      "input"
    ],
    "HTMLKeygenElement": [
      "keygen"
    ],
    "HTMLLIElement": [
      "li"
    ],
    "HTMLLabelElement": [
      "label"
    ],
    "HTMLLegendElement": [
      "legend"
    ],
    "HTMLLinkElement": [
      "link"
    ],
    "HTMLMapElement": [
      "map"
    ],
    "HTMLMarqueeElement": [
      "marquee"
    ],
    "HTMLMediaElement": [
      "media"
    ],
    "HTMLMenuElement": [
      "menu"
    ],
    "HTMLMenuItemElement": [
      "menuitem"
    ],
    "HTMLMetaElement": [
      "meta"
    ],
    "HTMLMeterElement": [
      "meter"
    ],
    "HTMLModElement": [
      "del",
      "ins"
    ],
    "HTMLOListElement": [
      "ol"
    ],
    "HTMLObjectElement": [
      "object"
    ],
    "HTMLOptGroupElement": [
      "optgroup"
    ],
    "HTMLOptionElement": [
      "option"
    ],
    "HTMLOutputElement": [
      "output"
    ],
    "HTMLParagraphElement": [
      "p"
    ],
    "HTMLParamElement": [
      "param"
    ],
    "HTMLPictureElement": [
      "picture"
    ],
    "HTMLPreElement": [
      "pre"
    ],
    "HTMLProgressElement": [
      "progress"
    ],
    "HTMLQuoteElement": [
      "blockquote",
      "q",
      "quote"
    ],
    "HTMLScriptElement": [
      "script"
    ],
    "HTMLSelectElement": [
      "select"
    ],
    "HTMLShadowElement": [
      "shadow"
    ],
    "HTMLSlotElement": [
      "slot"
    ],
    "HTMLSourceElement": [
      "source"
    ],
    "HTMLSpanElement": [
      "span"
    ],
    "HTMLStyleElement": [
      "style"
    ],
    "HTMLTableCaptionElement": [
      "caption"
    ],
    "HTMLTableCellElement": [
      "td",
      "th"
    ],
    "HTMLTableColElement": [
      "col",
      "colgroup"
    ],
    "HTMLTableElement": [
      "table"
    ],
    "HTMLTableRowElement": [
      "tr"
    ],
    "HTMLTableSectionElement": [
      "thead",
      "tbody",
      "tfoot"
    ],
    "HTMLTemplateElement": [
      "template"
    ],
    "HTMLTextAreaElement": [
      "textarea"
    ],
    "HTMLTimeElement": [
      "time"
    ],
    "HTMLTitleElement": [
      "title"
    ],
    "HTMLTrackElement": [
      "track"
    ],
    "HTMLUListElement": [
      "ul"
    ],
    "HTMLUnknownElement": [
      "unknown",
      "vhgroupv",
      "vkeygen"
    ],
    "HTMLVideoElement": [
      "video"
    ]
  },
  "nodes": {
    "Attr": [
      "node"
    ],
    "Audio": [
      "audio"
    ],
    "CDATASection": [
      "node"
    ],
    "CharacterData": [
      "node"
    ],
    "Comment": [
      "#comment"
    ],
    "Document": [
      "#document"
    ],
    "DocumentFragment": [
      "#document-fragment"
    ],
    "DocumentType": [
      "node"
    ],
    "HTMLDocument": [
      "#document"
    ],
    "Image": [
      "img"
    ],
    "Option": [
      "option"
    ],
    "ProcessingInstruction": [
      "node"
    ],
    "ShadowRoot": [
      "#shadow-root"
    ],
    "Text": [
      "#text"
    ],
    "XMLDocument": [
      "xml"
    ]
  }
}));


