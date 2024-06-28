var m = Object.defineProperty, g = Object.defineProperties;
var x = Object.getOwnPropertyDescriptors;
var w = Object.getOwnPropertySymbols;
var b = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable;
var u = (n, e, t) => e in n ? m(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, h = (n, e) => {
  for (var t in e || (e = {}))
    b.call(e, t) && u(n, t, e[t]);
  if (w)
    for (var t of w(e))
      B.call(e, t) && u(n, t, e[t]);
  return n;
}, v = (n, e) => g(n, x(e));
var p = (n, e, t) => u(n, typeof e != "symbol" ? e + "" : e, t);
class C {
  constructor(e) {
    // html 文档标准
    p(this, "standards", {
      strict: "strict",
      loose: "loose",
      html5: "html5"
    });
    // 打印窗口的 iframe id
    p(this, "iframeId", "");
    // 预览窗口的 body
    p(this, "previewBody", null);
    // 预览窗口的 关闭按钮
    p(this, "close", null);
    // 打印按钮
    p(this, "previewBodyUtilPrintBtn", null);
    // 调用次数，用于生成唯一 Id
    p(this, "counter", 0);
    // 需要打印的 DOM 内容
    // private printContentDom: HTMLElement | null = null;
    // 用户设置
    p(this, "settings", {
      standard: "html5",
      zIndex: 20002,
      previewTitle: "打印预览",
      previewPrintBtnLabel: "打印",
      preview: !1
    });
    const t = e.vue;
    this.settings = v(h(h({}, this.settings), e), {
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
      this.previewBoxShow(), (r = (i = this.settings).previewOpenCallback) == null || r.call(i);
    }), this.addEvent(e.querySelector(".previewBodyUtilPrintBtn"), "click", () => {
      var i, r, a, l, d, c, f;
      (r = (i = this.settings).beforeOpenCallback) == null || r.call(i), (l = (a = this.settings).openCallback) == null || l.call(a), (d = t == null ? void 0 : t.contentWindow) == null || d.print(), (f = (c = this.settings).closeCallback) == null || f.call(c);
    });
  }
  print(e) {
    var i, r;
    const t = document.getElementById(this.iframeId) || e.f, s = t == null ? void 0 : t.contentWindow;
    if (!s) return;
    const o = () => {
      var a, l, d, c;
      s.focus(), (l = (a = this.settings).openCallback) == null || l.call(a), s.print(), t.remove(), (c = (d = this.settings).closeCallback) == null || c.call(d);
    };
    (r = (i = this.settings).beforeOpenCallback) == null || r.call(i), this.addEvent(t, "load", o);
  }
  /**
   * 获取打印需要隐藏的 css
   * @private
   */
  getNoPrintMediaStyle() {
    const e = this.settings.noPrintSelector;
    if (!e) return;
    if (!Array.isArray(e) && !(typeof e == "string")) {
      console.error("noPrintSelector 必须是数组或者字符串");
      return;
    }
    return `${(Array.isArray(e) ? e : [e]).filter((r) => r.trim()).join(",")} { display: none; }`;
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
    const e = (this.settings.extraHead || "").split(",").filter((r) => r.length > 0).join(""), t = Array.from(document.querySelectorAll("link")).filter((r) => r.href.includes(".css")).map((r) => `<link type="text/css" rel="stylesheet" href='${r.href}'>`).join(""), s = Array.from(document.styleSheets).reduce((r, a) => {
      try {
        if (a.cssRules || a.rules) {
          const l = a.cssRules || a.rules;
          r += Array.from(l).reduce((d, c) => d + c.cssText, "");
        }
      } catch (l) {
        console.log((a.href || "") + l);
      }
      return r;
    }, ""), o = (this.settings.extraCss || "").split(",").filter((r) => r.trim().length > 0).map((r) => `<link type="text/css" rel="stylesheet" href='${r.trim()}'>`).join(""), i = this.getNoPrintMediaStyle();
    return `<head>
							<title>${this.settings.popTitle}</title>
							${e}${t}
							<style type="text/css">${s}${i}</style>
							${o}
						</head>`;
  }
  /**
   * 获取打印区的 DOM
   */
  getPrintAreaDom() {
    const e = this.settings.el, t = typeof e == "string";
    if (e instanceof HTMLElement) return [e];
    if (!t)
      throw new Error("el type is not string or HTMLElement, but " + typeof e);
    let s = Array.from(document.querySelectorAll(e));
    if (!(s != null && s.length))
      throw new Error(`Can't find element with selector: ${e}`);
    return s;
  }
  getBody() {
    const e = this.getPrintAreaDom(), t = document.createElement("div");
    return e.forEach((s) => {
      const o = s.cloneNode(!0);
      this.canvasToImgHandler(s, o), this.formDataHandler(s, o), t.appendChild(o);
    }), `<body>${t.innerHTML}</body>`;
  }
  /**
   * 复制 Canvas 内容到新的 Canvas 元素
   * @param originalElement
   * @param clonedElement
   * @private
   */
  canvasToImgHandler(e, t) {
    const s = e.querySelectorAll("canvas");
    t.querySelectorAll("canvas").forEach((i, r) => {
      const a = s[r], l = i.parentNode, d = a.toDataURL("image/png"), c = new Image();
      c.className = "canvasImg", c.style.display = "block", c.src = d, l == null || l.appendChild(c), i.remove();
    });
  }
  /**
   * 根据type去处理form表单
   * @param originalElement
   * @param clonedElement
   * @private
   */
  formDataHandler(e, t) {
    const s = t.querySelectorAll("input,select,textarea");
    let o = -1;
    s.forEach((i) => {
      var l;
      const r = i.value;
      switch ((l = i.getAttribute("type")) != null ? l : i.tagName.toLowerCase()) {
        case "select":
          o++;
          const d = e.querySelectorAll("select")[o];
          if (d) {
            const c = d.selectedIndex;
            i.options[c].setAttribute("selected", "selected");
          }
          break;
        case "textarea":
          i.innerHTML = r, i.setAttribute("html", r);
          break;
        case "radio":
        case "checkbox":
          i.checked && i.setAttribute("checked", "checked");
          break;
        default:
          i.value = r, i.setAttribute("value", r);
          break;
      }
    });
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
    if (t.id = this.iframeId, t.src = e || (/* @__PURE__ */ new Date()).getTime().toString(), t.style.display = "none", !this.settings.preview)
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
const A = (n, e, t) => {
  n.addEventListener ? n.addEventListener(e, t, !1) : n.attachEvent ? n.attachEvent("on" + e, t) : n["on" + e] = t;
}, y = {
  directiveName: "print",
  // vue3 指定挂载
  mounted(n, e) {
    let t = "", s = {};
    A(n, "click", () => {
      if (typeof e.value == "string")
        t = e.value;
      else if (typeof e.value == "object" && e.value.el)
        t = e.value.el, s = e.value;
      else {
        window.print();
        return;
      }
      new C(v(h({}, s), { el: t, vue: e.instance }));
    });
  },
  // 兼容 Vue2 指令挂载
  bind(n, e, t) {
    e.instance = t.context, y.mounted(n, e);
  }
}, k = {
  install(n) {
    n.directive(y.directiveName, y);
  }
};
export {
  C as VuePrintNext,
  k as printPlugin,
  y as vPrint
};
