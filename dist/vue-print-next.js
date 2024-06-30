var g = Object.defineProperty, x = Object.defineProperties;
var b = Object.getOwnPropertyDescriptors;
var w = Object.getOwnPropertySymbols;
var B = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var y = (n, e, t) => e in n ? g(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, v = (n, e) => {
  for (var t in e || (e = {}))
    B.call(e, t) && y(n, t, e[t]);
  if (w)
    for (var t of w(e))
      C.call(e, t) && y(n, t, e[t]);
  return n;
}, f = (n, e) => x(n, b(e));
var h = (n, e, t) => y(n, typeof e != "symbol" ? e + "" : e, t);
const u = "[VuePrintNext]";
class E {
  constructor(e) {
    // html 文档标准
    h(this, "standards", {
      strict: "strict",
      loose: "loose",
      html5: "html5"
    });
    // 打印窗口的 iframe id
    h(this, "iframeId", "");
    // 预览窗口的 body
    h(this, "previewBody", null);
    // 预览窗口的 关闭按钮
    h(this, "close", null);
    // 调用次数，用于生成唯一 Id
    h(this, "counter", 0);
    // 用户设置
    h(this, "settings", {
      standard: "html5",
      zIndex: 20002,
      previewTitle: "打印预览",
      previewPrintBtnLabel: "打印",
      preview: !1
    });
    const t = e.vue;
    this.settings = f(v(v({}, this.settings), e), {
      previewBeforeOpenCallback() {
        var r;
        (r = e.previewBeforeOpenCallback) == null || r.call(e, t);
      },
      previewOpenCallback() {
        var r;
        (r = e.previewOpenCallback) == null || r.call(e, t);
      },
      openCallback() {
        var r;
        (r = e.openCallback) == null || r.call(e, t);
      },
      closeCallback() {
        var r;
        (r = e.closeCallback) == null || r.call(e, t);
      },
      beforeOpenCallback() {
        var r;
        (r = e.beforeOpenCallback) == null || r.call(e, t);
      }
    }), this.init();
  }
  init() {
    this.counter++, this.iframeId = `printArea_${this.counter}`;
    const { el: e, url: t } = this.settings;
    if (e || t) {
      const r = e ? "" : t || "", s = this.getPrintWindow(r);
      e && this.write(s.doc), this.settings.preview ? this.previewIframeLoad() : this.print(s);
      return;
    }
    if (this.settings.asyncUrl) {
      this.settings.asyncUrl((r) => {
        const s = this.getPrintWindow(r);
        this.settings.preview ? this.previewIframeLoad() : this.print(s);
      }, this.settings.vue);
      return;
    }
    throw new Error(`${u}: Either "el"、"url" or "asyncUrl" parameter must be provided in the settings.`);
  }
  addEvent(e, t, r) {
    e && (e.addEventListener ? e.addEventListener(t, r, !1) : e.attachEvent ? e.attachEvent("on" + t, r) : e["on" + t] = r);
  }
  previewIframeLoad() {
    var r, s;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    if (!e) return;
    const t = e.querySelector("iframe");
    (s = (r = this.settings).previewBeforeOpenCallback) == null || s.call(r), this.addEvent(t, "load", () => {
      var i, l;
      this.previewBoxShow(), (l = (i = this.settings).previewOpenCallback) == null || l.call(i);
    }), this.addEvent(e.querySelector(".previewBodyUtilPrintBtn"), "click", () => {
      var i, l, o, a, d, c, p;
      (l = (i = this.settings).beforeOpenCallback) == null || l.call(i), (a = (o = this.settings).openCallback) == null || a.call(o), (d = t == null ? void 0 : t.contentWindow) == null || d.print(), (p = (c = this.settings).closeCallback) == null || p.call(c);
    });
  }
  print(e) {
    var i, l;
    const t = document.getElementById(this.iframeId) || e.f, r = t == null ? void 0 : t.contentWindow;
    if (!r) return;
    const s = () => {
      const o = setTimeout(() => {
        var a, d, c, p;
        r.focus(), (d = (a = this.settings).openCallback) == null || d.call(a), r.print(), t.remove(), (p = (c = this.settings).closeCallback) == null || p.call(c), clearTimeout(o);
      });
    };
    (l = (i = this.settings).beforeOpenCallback) == null || l.call(i), this.addEvent(t, "load", s);
  }
  /**
   * 获取打印需要隐藏的 css
   * @private
   */
  getNoPrintMediaStyle() {
    const e = this.settings.noPrintSelector;
    return e ? !Array.isArray(e) && !(typeof e == "string") ? (console.error(new TypeError(`${u}: The "noPrintSelector" must be either a string or an array of strings. Please check your settings.`)), "") : `${(Array.isArray(e) ? e : [e]).filter((l) => l.trim()).join(",")} { display: none; }` : "";
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
  /**
   * 获取媒体打印独有样式
   * @private
   */
  getPrintMediaStyle() {
    return "body {-webkit-print-color-adjust: exact; -moz-print-color-adjust: exact; -ms-print-color-adjust: exact; print-color-adjust: exact;}";
  }
  getHead() {
    const e = (this.settings.extraHead || "").split(",").filter((o) => o.length > 0).join(""), t = Array.from(document.querySelectorAll("link")).filter((o) => o.href.includes(".css")).map((o) => `<link type="text/css" rel="stylesheet" href='${o.href}'>`).join(""), r = Array.from(document.styleSheets).reduce((o, a) => {
      const d = a.cssRules || a.rules;
      return d && (o += Array.from(d).reduce((c, p) => c + p.cssText, "")), o;
    }, ""), s = (this.settings.extraCss || "").split(",").filter((o) => o.trim().length > 0).map((o) => `<link type="text/css" rel="stylesheet" href='${o.trim()}'>`).join(""), i = this.getPrintMediaStyle(), l = this.getNoPrintMediaStyle();
    return `<head>
							<title>${this.settings.popTitle}</title>
							${e}${t}
							<style type="text/css">${r}${l}${i}</style>
							${s}
						</head>`;
  }
  /**
   * 获取打印区的 DOM
   */
  getPrintAreaDom() {
    const e = this.settings.el, t = typeof e == "string";
    if (e instanceof HTMLElement) return [e];
    if (!t)
      throw new TypeError(`${u}: The "el" property should be either a string (CSS selector) or an HTMLElement, but received type "${typeof e}".`);
    let r = Array.from(document.querySelectorAll(e));
    if (!(r != null && r.length))
      throw new Error(`${u}: No elements found matching the selector: "${e}".`);
    return r;
  }
  getBody() {
    const e = this.getPrintAreaDom(), t = document.createElement("div");
    return e.forEach((r) => {
      const s = r.cloneNode(!0);
      this.canvasToImgHandler(r, s), this.formDataHandler(r, s), t.appendChild(s);
    }), `<body>${t.innerHTML}</body>`;
  }
  /**
   * 复制 Canvas 内容到新的 Canvas 元素
   * @param originalElement
   * @param clonedElement
   * @private
   */
  canvasToImgHandler(e, t) {
    const r = e.querySelectorAll("canvas");
    t.querySelectorAll("canvas").forEach((i, l) => {
      const o = r[l], a = i.parentNode, d = o.toDataURL("image/png"), c = new Image();
      c.className = "canvasImg", c.style.display = "block", c.src = d, a == null || a.appendChild(c), i.remove();
    });
  }
  /**
   * 根据type去处理form表单
   * @param originalElement
   * @param clonedElement
   * @private
   */
  formDataHandler(e, t) {
    const r = t.querySelectorAll("input,select,textarea");
    let s = -1;
    r.forEach((i) => {
      var a;
      const l = i.value;
      switch ((a = i.getAttribute("type")) != null ? a : i.tagName.toLowerCase()) {
        case "select":
          s++;
          const d = e.querySelectorAll("select")[s];
          if (d) {
            const c = d.selectedIndex;
            i.options[c].setAttribute("selected", "selected");
          }
          break;
        case "textarea":
          i.innerHTML = l, i.setAttribute("html", l);
          break;
        case "radio":
        case "checkbox":
          i.checked && i.setAttribute("checked", "checked");
          break;
        default:
          i.value = l, i.setAttribute("value", l);
          break;
      }
    });
  }
  // 生成并返回打印窗口的 iframe 和文档对象
  getPrintWindow(e) {
    var s;
    const t = this.createIframe(e), r = t.contentDocument || ((s = t.contentWindow) == null ? void 0 : s.document) || t.document;
    if (!r)
      throw new Error(`${u}: Unable to find the document object within the created iframe. Please ensure the iframe is correctly created and loaded.`);
    return { f: t, win: t.contentWindow || t, doc: r };
  }
  // 显示预览窗口
  previewBoxShow() {
    var t;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: hidden"), e.style.display = "block");
  }
  // 隐藏预览窗口
  previewBoxHide() {
    var t, r;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: visible;"), (r = e.querySelector("iframe")) == null || r.remove(), e.style.display = "none");
  }
  // 创建或获取打印预览的框架
  previewBox() {
    var r;
    let e = document.getElementById("vue-pirnt-next-previewBox");
    if (e)
      return (r = e.querySelector("iframe")) == null || r.remove(), { close: e.querySelector(".previewClose"), previewBody: e.querySelector(".previewBody") };
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
      const { close: r, previewBody: s } = this.previewBox();
      s && s.appendChild(t), this.addEvent(r, "click", this.previewBoxHide.bind(this));
    }
    return t;
  }
  // 创建关闭按钮
  createCloseButton() {
    const e = document.createElement("div");
    e.setAttribute("class", "previewClose"), e.setAttribute("style", "position: absolute; top: 5px; right: 20px; width: 25px; height: 20px; cursor: pointer;");
    const t = document.createElement("div"), r = document.createElement("div"), s = "position: absolute; width: 3px; height: 100%; background: #040404; top: 0px; left: 50%;";
    return t.setAttribute("class", "closeBefore"), t.setAttribute("style", `${s} transform: rotate(45deg);`), r.setAttribute("class", "closeAfter"), r.setAttribute("style", `${s} transform: rotate(-45deg);`), e.appendChild(t), e.appendChild(r), e;
  }
  // 创建预览主体
  createPreviewBody() {
    const e = document.createElement("div");
    e.className = "previewBody", e.style.cssText = "display: flex; flex-direction: column; height: 100%;";
    const t = document.createElement("div");
    t.className = "previewBodyUtil", t.style.cssText = "height: 32px; background: #474747; position: relative;";
    const r = document.createElement("div");
    return r.className = "previewBodyUtilPrintBtn", r.style.cssText = "position: absolute; padding: 2px 10px; margin-top: 3px; left: 24px; font-size: 14px; color: white; cursor: pointer; background: rgba(0,0,0,.12); border: 1px solid rgba(0,0,0,.35); box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15);", r.innerHTML = this.settings.previewPrintBtnLabel || "", t.appendChild(r), e.appendChild(t), e;
  }
}
const A = (n, e, t) => {
  n.addEventListener ? n.addEventListener(e, t, !1) : n.attachEvent ? n.attachEvent("on" + e, t) : n["on" + e] = t;
}, m = {
  directiveName: "print",
  // vue3 指定挂载
  mounted(n, e) {
    let t, r = {};
    A(n, "click", () => {
      if (!e.value) {
        window.print();
        return;
      }
      typeof e.value == "string" ? t = e.value : typeof e.value == "object" && (t = e.value.el, r = e.value), new E(f(v({}, r), { el: t, vue: e.instance }));
    });
  },
  // 兼容 Vue2 指令挂载
  bind(n, e, t) {
    e.instance = t.context, m.mounted(n, e);
  }
}, S = {
  install(n) {
    n.directive(m.directiveName, m);
  }
};
export {
  E as VuePrintNext,
  S as printPlugin,
  m as vPrint
};
