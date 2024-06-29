var g = Object.defineProperty, b = Object.defineProperties;
var x = Object.getOwnPropertyDescriptors;
var w = Object.getOwnPropertySymbols;
var B = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var y = (o, e, t) => e in o ? g(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, v = (o, e) => {
  for (var t in e || (e = {}))
    B.call(e, t) && y(o, t, e[t]);
  if (w)
    for (var t of w(e))
      C.call(e, t) && y(o, t, e[t]);
  return o;
}, f = (o, e) => b(o, x(e));
var h = (o, e, t) => y(o, typeof e != "symbol" ? e + "" : e, t);
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
      const r = e ? "" : t || "", i = this.getPrintWindow(r);
      e && this.write(i.doc), this.settings.preview ? this.previewIframeLoad() : this.print(i);
      return;
    }
    if (this.settings.asyncUrl) {
      this.settings.asyncUrl((r) => {
        const i = this.getPrintWindow(r);
        this.settings.preview ? this.previewIframeLoad() : this.print(i);
      }, this.settings.vue);
      return;
    }
    throw new Error(`${u}: Either "el"、"url" or "asyncUrl" parameter must be provided in the settings.`);
  }
  addEvent(e, t, r) {
    e && (e.addEventListener ? e.addEventListener(t, r, !1) : e.attachEvent ? e.attachEvent("on" + t, r) : e["on" + t] = r);
  }
  previewIframeLoad() {
    var r, i;
    const e = document.getElementById("vue-pirnt-next-previewBox");
    if (!e) return;
    const t = e.querySelector("iframe");
    (i = (r = this.settings).previewBeforeOpenCallback) == null || i.call(r), this.addEvent(t, "load", () => {
      var n, s;
      this.previewBoxShow(), (s = (n = this.settings).previewOpenCallback) == null || s.call(n);
    }), this.addEvent(e.querySelector(".previewBodyUtilPrintBtn"), "click", () => {
      var n, s, d, l, c, a, p;
      (s = (n = this.settings).beforeOpenCallback) == null || s.call(n), (l = (d = this.settings).openCallback) == null || l.call(d), (c = t == null ? void 0 : t.contentWindow) == null || c.print(), (p = (a = this.settings).closeCallback) == null || p.call(a);
    });
  }
  print(e) {
    var n, s;
    const t = document.getElementById(this.iframeId) || e.f, r = t == null ? void 0 : t.contentWindow;
    if (!r) return;
    const i = () => {
      const d = setTimeout(() => {
        var l, c, a, p;
        r.focus(), (c = (l = this.settings).openCallback) == null || c.call(l), r.print(), t.remove(), (p = (a = this.settings).closeCallback) == null || p.call(a), clearTimeout(d);
      });
    };
    (s = (n = this.settings).beforeOpenCallback) == null || s.call(n), this.addEvent(t, "load", i);
  }
  /**
   * 获取打印需要隐藏的 css
   * @private
   */
  getNoPrintMediaStyle() {
    const e = this.settings.noPrintSelector;
    if (!e) return;
    if (!Array.isArray(e) && !(typeof e == "string")) {
      console.error(new TypeError(`${u}: The "noPrintSelector" must be either a string or an array of strings. Please check your settings.`));
      return;
    }
    return `${(Array.isArray(e) ? e : [e]).filter((s) => s.trim()).join(",")} { display: none; }`;
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
    const e = (this.settings.extraHead || "").split(",").filter((s) => s.length > 0).join(""), t = Array.from(document.querySelectorAll("link")).filter((s) => s.href.includes(".css")).map((s) => `<link type="text/css" rel="stylesheet" href='${s.href}'>`).join(""), r = Array.from(document.styleSheets).reduce((s, d) => {
      const l = d.cssRules || d.rules;
      return l && (s += Array.from(l).reduce((c, a) => c + a.cssText, "")), s;
    }, ""), i = (this.settings.extraCss || "").split(",").filter((s) => s.trim().length > 0).map((s) => `<link type="text/css" rel="stylesheet" href='${s.trim()}'>`).join(""), n = this.getNoPrintMediaStyle();
    return `<head>
							<title>${this.settings.popTitle}</title>
							${e}${t}
							<style type="text/css">${r}${n}</style>
							${i}
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
      const i = r.cloneNode(!0);
      this.canvasToImgHandler(r, i), this.formDataHandler(r, i), t.appendChild(i);
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
    t.querySelectorAll("canvas").forEach((n, s) => {
      const d = r[s], l = n.parentNode, c = d.toDataURL("image/png"), a = new Image();
      a.className = "canvasImg", a.style.display = "block", a.src = c, l == null || l.appendChild(a), n.remove();
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
    let i = -1;
    r.forEach((n) => {
      var l;
      const s = n.value;
      switch ((l = n.getAttribute("type")) != null ? l : n.tagName.toLowerCase()) {
        case "select":
          i++;
          const c = e.querySelectorAll("select")[i];
          if (c) {
            const a = c.selectedIndex;
            n.options[a].setAttribute("selected", "selected");
          }
          break;
        case "textarea":
          n.innerHTML = s, n.setAttribute("html", s);
          break;
        case "radio":
        case "checkbox":
          n.checked && n.setAttribute("checked", "checked");
          break;
        default:
          n.value = s, n.setAttribute("value", s);
          break;
      }
    });
  }
  // 生成并返回打印窗口的 iframe 和文档对象
  getPrintWindow(e) {
    var i;
    const t = this.createIframe(e), r = t.contentDocument || ((i = t.contentWindow) == null ? void 0 : i.document) || t.document;
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
      const { close: r, previewBody: i } = this.previewBox();
      i && i.appendChild(t), this.addEvent(r, "click", this.previewBoxHide.bind(this));
    }
    return t;
  }
  // 创建关闭按钮
  createCloseButton() {
    const e = document.createElement("div");
    e.setAttribute("class", "previewClose"), e.setAttribute("style", "position: absolute; top: 5px; right: 20px; width: 25px; height: 20px; cursor: pointer;");
    const t = document.createElement("div"), r = document.createElement("div"), i = "position: absolute; width: 3px; height: 100%; background: #040404; top: 0px; left: 50%;";
    return t.setAttribute("class", "closeBefore"), t.setAttribute("style", `${i} transform: rotate(45deg);`), r.setAttribute("class", "closeAfter"), r.setAttribute("style", `${i} transform: rotate(-45deg);`), e.appendChild(t), e.appendChild(r), e;
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
const A = (o, e, t) => {
  o.addEventListener ? o.addEventListener(e, t, !1) : o.attachEvent ? o.attachEvent("on" + e, t) : o["on" + e] = t;
}, m = {
  directiveName: "print",
  // vue3 指定挂载
  mounted(o, e) {
    let t, r = {};
    A(o, "click", () => {
      if (!e.value) {
        window.print();
        return;
      }
      typeof e.value == "string" ? t = e.value : typeof e.value == "object" && (t = e.value.el, r = e.value), new E(f(v({}, r), { el: t, vue: e.instance }));
    });
  },
  // 兼容 Vue2 指令挂载
  bind(o, e, t) {
    e.instance = t.context, m.mounted(o, e);
  }
}, S = {
  install(o) {
    o.directive(m.directiveName, m);
  }
};
export {
  E as VuePrintNext,
  S as printPlugin,
  m as vPrint
};
