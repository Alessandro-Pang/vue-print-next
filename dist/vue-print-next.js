var y = Object.defineProperty, g = Object.defineProperties;
var x = Object.getOwnPropertyDescriptors;
var f = Object.getOwnPropertySymbols;
var b = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable;
var v = (n, e, t) => e in n ? y(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, u = (n, e) => {
  for (var t in e || (e = {}))
    b.call(e, t) && v(n, t, e[t]);
  if (f)
    for (var t of f(e))
      B.call(e, t) && v(n, t, e[t]);
  return n;
}, m = (n, e) => g(n, x(e));
var c = (n, e, t) => v(n, typeof e != "symbol" ? e + "" : e, t);
class C {
  constructor(e) {
    // html 文档标准
    c(this, "standards", {
      strict: "strict",
      loose: "loose",
      html5: "html5"
    });
    // 打印窗口的 iframe id
    c(this, "iframeId", "");
    // 预览窗口的 body
    c(this, "previewBody", null);
    // 预览窗口的 关闭按钮
    c(this, "close", null);
    // 打印按钮
    c(this, "previewBodyUtilPrintBtn", null);
    // 调用次数，用于生成唯一 Id
    c(this, "counter", 0);
    // 需要打印的 DOM 内容
    c(this, "printContentDom", null);
    // 用户设置
    c(this, "settings", {
      standard: "html5",
      zIndex: 20002,
      previewTitle: "打印预览",
      previewPrintBtnLabel: "打印",
      preview: !1
    });
    const t = e.vue;
    this.settings = m(u(u({}, this.settings), e), {
      previewBeforeOpenCallback() {
        var s;
        (s = e.previewBeforeOpenCallback) == null || s.call(e, t);
      },
      previewOpenCallback() {
        var s;
        (s = e.previewOpenCallback) == null || s.call(e, t);
      },
      openCallback() {
        var s;
        (s = e.openCallback) == null || s.call(e, t);
      },
      closeCallback() {
        var s;
        (s = e.closeCallback) == null || s.call(e, t);
      },
      beforeOpenCallback() {
        var s;
        (s = e.beforeOpenCallback) == null || s.call(e, t);
      }
    }), this.init();
  }
  init() {
    if (this.counter++, this.iframeId = `printArea_${this.counter}`, this.settings.asyncUrl)
      this.settings.asyncUrl((e) => {
        const t = this.getPrintWindow(e);
        this.settings.preview ? this.previewIframeLoad() : this.print(t);
      }, this.settings.vue);
    else {
      const e = this.getPrintWindow(this.settings.url || "");
      this.settings.url || this.write(e.doc), this.settings.preview ? this.previewIframeLoad() : this.print(e);
    }
  }
  addEvent(e, t, s) {
    e && (e.addEventListener ? e.addEventListener(t, s, !1) : e.attachEvent ? e.attachEvent("on" + t, s) : e["on" + t] = s);
  }
  previewIframeLoad() {
    var s, o;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    if (!e) return;
    const t = e.querySelector("iframe");
    (o = (s = this.settings).previewBeforeOpenCallback) == null || o.call(s), this.addEvent(t, "load", () => {
      var i, r;
      this.previewBoxShow(), this.removeCanvasImg(), (r = (i = this.settings).previewOpenCallback) == null || r.call(i);
    }), this.addEvent(e.querySelector(".previewBodyUtilPrintBtn"), "click", () => {
      var i, r, l, d, a, p, h;
      (r = (i = this.settings).beforeOpenCallback) == null || r.call(i), (d = (l = this.settings).openCallback) == null || d.call(l), (a = t == null ? void 0 : t.contentWindow) == null || a.print(), (h = (p = this.settings).closeCallback) == null || h.call(p);
    });
  }
  // 删除所有 canvas 转换的图片
  removeCanvasImg() {
    this.printContentDom && [...this.printContentDom.querySelectorAll(".canvasImg")].forEach((e) => e.remove());
  }
  print(e) {
    var i, r;
    const t = document.getElementById(this.iframeId) || e.f, s = t == null ? void 0 : t.contentWindow;
    if (!s) return;
    const o = () => {
      var l, d, a, p;
      s.focus(), (d = (l = this.settings).openCallback) == null || d.call(l), s.print(), t.remove(), (p = (a = this.settings).closeCallback) == null || p.call(a), this.removeCanvasImg();
    };
    (r = (i = this.settings).beforeOpenCallback) == null || r.call(i), this.addEvent(t, "load", o);
  }
  write(e) {
    e.open(), e.write(
      `${this.docType()}<html lang='zh'>${this.getHead()}${this.getBody()}</html>`
    ), e.close();
  }
  docType() {
    if (this.settings.standard === this.standards.html5)
      return "<!DOCTYPE html>";
    const e = this.settings.standard === this.standards.loose ? " Transitional" : "", t = this.settings.standard === this.standards.loose ? "loose" : "strict";
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${e}//EN" "http://www.w3.org/TR/html4/${t}.dtd">`;
  }
  getHead() {
    const e = (this.settings.extraHead || "").split(",").map((i) => i.trim()).filter((i) => i.length > 0).join(""), t = Array.from(document.querySelectorAll("link")).filter((i) => i.href.includes(".css")).map((i) => `<link type="text/css" rel="stylesheet" href='${i.href}'>`).join(""), s = Array.from(document.styleSheets).reduce((i, r) => {
      try {
        if (r.cssRules || r.rules) {
          const l = r.cssRules || r.rules;
          i += Array.from(l).reduce((d, a) => d + a.cssText, "");
        }
      } catch (l) {
        console.log((r.href || "") + l);
      }
      return i;
    }, ""), o = (this.settings.extraCss || "").split(",").filter((i) => i.trim().length > 0).map((i) => `<link type="text/css" rel="stylesheet" href='${i.trim()}'>`).join("");
    return `<head><title>${this.settings.popTitle}</title>${e}${t}<style>${s}</style>${o}</head>`;
  }
  getBody() {
    const e = this.settings.id.replace(new RegExp("#", "g"), ""), t = document.getElementById(e);
    if (!t)
      throw new Error("dom is not found！");
    return this.printContentDom = this.beforeHandler(t), `<body>${this.getFormData(this.printContentDom).outerHTML}</body>`;
  }
  // 处理 canvas 转成图片
  beforeHandler(e) {
    return e.querySelectorAll("canvas").forEach((t) => {
      const s = t.parentNode, o = t.toDataURL("image/png"), i = new Image();
      i.className = "canvasImg", i.style.display = "none", i.src = o, s == null || s.appendChild(i);
    }), e;
  }
  // 根据type去处理form表单
  getFormData(e) {
    const t = e.cloneNode(!0), s = t.querySelectorAll("input,select,textarea"), o = t.querySelectorAll(".canvasImg, canvas");
    let i = -1;
    return o.forEach((r) => {
      const l = r.parentNode;
      r.tagName.toLowerCase() === "canvas" ? l == null || l.removeChild(r) : r.style.display = "block";
    }), s.forEach((r) => {
      var a;
      const l = r.value;
      switch ((a = r.getAttribute("type")) != null ? a : r.tagName.toLowerCase()) {
        case "select":
          i++;
          const p = e.querySelectorAll("select")[i];
          if (p) {
            const h = p.selectedIndex;
            r.options[h].setAttribute("selected", "true");
          }
          break;
        case "textarea":
          r.innerHTML = l, r.setAttribute("html", l);
          break;
        case "radio":
        case "checkbox":
          r.checked && r.setAttribute("checked", "true");
          break;
        case "input":
          r.value = l, r.setAttribute("value", l);
          break;
      }
    }), t;
  }
  // 生成并返回打印窗口的 iframe 和文档对象
  getPrintWindow(e) {
    var o;
    const t = this.createIframe(e), s = t.contentDocument || ((o = t.contentWindow) == null ? void 0 : o.document) || t.document;
    if (!s)
      throw new Error("Cannot find document.");
    return { f: t, win: t.contentWindow || t, doc: s };
  }
  // 显示预览窗口
  previewBoxShow() {
    var t;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: hidden"), e.style.display = "block");
  }
  // 隐藏预览窗口
  previewBoxHide() {
    var t, s;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: visible;"), (s = e.querySelector("iframe")) == null || s.remove(), e.style.display = "none");
  }
  // 创建或获取打印预览的框架
  previewBox() {
    var s;
    let e = document.getElementById("vue-pirnt-next-previewBox");
    if (e)
      return (s = e.querySelector("iframe")) == null || s.remove(), { close: e.querySelector(".previewClose"), previewBody: e.querySelector(".previewBody") };
    e = document.createElement("div"), e.setAttribute("id", "vue-pirnt-next-previewBox"), e.setAttribute(
      "style",
      "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: white; display: none; z-index: " + this.settings.zIndex
    );
    const t = document.createElement("div");
    return t.setAttribute("class", "previewHeader"), t.setAttribute("style", "padding: 5px 20px;"), t.innerHTML = this.settings.previewTitle || "", this.close = this.createCloseButton(), t.appendChild(this.close), e.appendChild(t), this.previewBody = this.createPreviewBody(), e.appendChild(this.previewBody), document.body.appendChild(e), { close: this.close, previewBody: this.previewBody };
  }
  // 创建iframe元素
  createIframe(e) {
    const t = document.createElement("iframe");
    if (t.id = this.iframeId, t.src = e || (/* @__PURE__ */ new Date()).getTime().toString(), t.style.border = "0px", t.style.position = "absolute", t.style.width = "0px", t.style.height = "0px", t.style.right = "0px", t.style.top = "0px", !this.settings.preview)
      document.body.appendChild(t);
    else {
      t.setAttribute("style", "border: 0px; flex: 1;");
      const { close: s, previewBody: o } = this.previewBox();
      o && o.appendChild(t), this.addEvent(s, "click", this.previewBoxHide.bind(this));
    }
    return t;
  }
  // 创建关闭按钮
  createCloseButton() {
    const e = document.createElement("div");
    e.setAttribute("class", "previewClose"), e.setAttribute("style", "position: absolute; top: 5px; right: 20px; width: 25px; height: 20px; cursor: pointer;");
    const t = document.createElement("div"), s = document.createElement("div"), o = "position: absolute; width: 3px; height: 100%; background: #040404; top: 0px; left: 50%;";
    return t.setAttribute("class", "closeBefore"), t.setAttribute("style", `${o} transform: rotate(45deg);`), s.setAttribute("class", "closeAfter"), s.setAttribute("style", `${o} transform: rotate(-45deg);`), e.appendChild(t), e.appendChild(s), e;
  }
  // 创建预览主体
  createPreviewBody() {
    const e = document.createElement("div");
    e.className = "previewBody", e.style.cssText = "display: flex; flex-direction: column; height: 100%;";
    const t = document.createElement("div");
    return t.className = "previewBodyUtil", t.style.cssText = "height: 32px; background: #474747; position: relative;", this.previewBodyUtilPrintBtn = document.createElement("div"), this.previewBodyUtilPrintBtn.className = "previewBodyUtilPrintBtn", this.previewBodyUtilPrintBtn.style.cssText = "position: absolute; padding: 2px 10px; margin-top: 3px; left: 24px; font-size: 14px; color: white; cursor: pointer; background: rgba(0,0,0,.12); border: 1px solid rgba(0,0,0,.35); box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15);", this.previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel || "", t.appendChild(this.previewBodyUtilPrintBtn), e.appendChild(t), e;
  }
}
const E = (n, e, t) => {
  n.addEventListener ? n.addEventListener(e, t, !1) : n.attachEvent ? n.attachEvent("on" + e, t) : n["on" + e] = t;
}, w = {
  directiveName: "print",
  // vue3 指定挂载
  mounted(n, e) {
    let t = e.value, s = {};
    E(n, "click", () => {
      if (typeof e.value == "string")
        t = e.value;
      else if (typeof e.value == "object" && e.value.id) {
        t = e.value.id, s = e.value;
        const o = t.replace(/#/g, "");
        if (!document.getElementById(o)) {
          console.error("Can't find element with id", t);
          return;
        }
      } else {
        window.print();
        return;
      }
      new C(m(u({}, s), { id: t, vue: e.instance }));
    });
  },
  // 兼容 Vue2 指定挂载
  bind(n, e, t) {
    e.instance = t.context, w.mounted(n, e);
  }
}, I = {
  install(n) {
    n.directive(w.directiveName, w);
  }
};
export {
  C as VuePrintNext,
  I as printPlugin,
  w as vPrint
};
