var y = Object.defineProperty, b = Object.defineProperties;
var x = Object.getOwnPropertyDescriptors;
var g = Object.getOwnPropertySymbols;
var B = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var v = (a, e, t) => e in a ? y(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, m = (a, e) => {
  for (var t in e || (e = {}))
    B.call(e, t) && v(a, t, e[t]);
  if (g)
    for (var t of g(e))
      C.call(e, t) && v(a, t, e[t]);
  return a;
}, f = (a, e) => b(a, x(e));
var p = (a, e, t) => v(a, typeof e != "symbol" ? e + "" : e, t);
class E {
  constructor(e) {
    // html 文档标准
    p(this, "standards", {
      strict: "strict",
      loose: "loose",
      html5: "html5"
    });
    // 打印窗口的 iframe id;
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
    p(this, "printContentDom", null);
    // 用户设置
    p(this, "settings", {
      standard: "html5",
      zIndex: 20002,
      previewTitle: "打印预览",
      previewPrintBtnLabel: "打印",
      preview: !1
    });
    const t = e.vue;
    this.settings = Object.assign({}, this.settings, e, {
      previewBeforeOpenCallback() {
        var i;
        (i = e.previewBeforeOpenCallback) == null || i.call(e, t);
      },
      previewOpenCallback() {
        var i;
        (i = e.previewOpenCallback) == null || i.call(e, t);
      },
      openCallback() {
        var i;
        (i = e.openCallback) == null || i.call(e, t);
      },
      closeCallback() {
        var i;
        (i = e.closeCallback) == null || i.call(e, t);
      },
      beforeOpenCallback() {
        var i;
        (i = e.beforeOpenCallback) == null || i.call(e, t);
      }
    }), this.init();
  }
  init() {
    this.counter++, this.iframeId = `printArea_${this.counter}`;
    let e = "";
    if (this.settings.url && !this.settings.asyncUrl && (e = this.settings.url), this.settings.asyncUrl) {
      this.settings.asyncUrl((i) => {
        let r = this.getPrintWindow(i);
        this.settings.preview ? this.previewIframeLoad() : this.print(r);
      }, this.settings.vue);
      return;
    }
    const t = this.getPrintWindow(e);
    this.settings.url || this.write(t.doc), this.settings.preview ? this.previewIframeLoad() : this.print(t);
  }
  addEvent(e, t, i) {
    e && (e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent ? e.attachEvent("on" + t, i) : e["on" + t] = i);
  }
  previewIframeLoad() {
    var t, i;
    let e = document.getElementById("vue-pirnt-next-previewBox");
    if (e) {
      let r = e.querySelector("iframe");
      (i = (t = this.settings).previewBeforeOpenCallback) == null || i.call(t), this.addEvent(r, "load", () => {
        var l, s;
        this.previewBoxShow(), this.removeCanvasImg(), (s = (l = this.settings).previewOpenCallback) == null || s.call(l);
      }), this.addEvent(e.querySelector(".previewBodyUtilPrintBtn"), "click", () => {
        var l, s, n, o, d, c, h;
        (s = (l = this.settings).beforeOpenCallback) == null || s.call(l), (o = (n = this.settings).openCallback) == null || o.call(n), (d = r == null ? void 0 : r.contentWindow) == null || d.print(), (h = (c = this.settings).closeCallback) == null || h.call(c);
      });
    }
  }
  // 删除所有 canvas 转换的图片
  removeCanvasImg() {
    try {
      if (this.printContentDom) {
        let e = this.printContentDom.querySelectorAll(".canvasImg");
        for (let t = 0; t < e.length; t++)
          e[t].remove();
      }
    } catch (e) {
      console.log(e);
    }
  }
  print(e) {
    var l, s;
    let t = document.getElementById(this.iframeId) || e.f, i = t == null ? void 0 : t.contentWindow;
    if (!i) return;
    const r = () => {
      var n, o, d, c;
      i.focus(), (o = (n = this.settings).openCallback) == null || o.call(n), i.print(), t.remove(), (c = (d = this.settings).closeCallback) == null || c.call(d), this.removeCanvasImg();
    };
    (s = (l = this.settings).beforeOpenCallback) == null || s.call(l), this.addEvent(t, "load", () => r());
  }
  write(e) {
    e.open(), e.write(`${this.docType()}<html lang="zh">${this.getHead()}${this.getBody()}</html>`), e.close();
  }
  docType() {
    if (this.settings.standard === this.standards.html5)
      return "<!DOCTYPE html>";
    const e = this.settings.standard === this.standards.loose ? " Transitional" : "", t = this.settings.standard === this.standards.loose ? "loose" : "strict";
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${e}//EN" "http://www.w3.org/TR/html4/${t}.dtd">`;
  }
  getHead() {
    var l;
    let e = "", t = "", i = "";
    this.settings.extraHead && (e = this.settings.extraHead.split(",").map((s) => s.trim()).filter((s) => s.length > 0).join("")), t = Array.from(document.querySelectorAll("link")).filter((s) => s.href.includes(".css")).map((s) => `<link type="text/css" rel="stylesheet" href="${s.href}">`).join("");
    let r = document.styleSheets;
    if (r && r.length > 0)
      for (let s = 0; s < r.length; s++)
        try {
          if (r[s].cssRules || r[s].rules) {
            let n = r[s].cssRules || r[s].rules;
            for (let o = 0; o < n.length; o++)
              i += n[o].cssText;
          }
        } catch (n) {
          console.log((((l = r[s]) == null ? void 0 : l.href) || "") + n);
        }
    return this.settings.extraCss && (t += this.settings.extraCss.split(",").filter((s) => s.trim().length > 0).map((s) => `<link type="text/css" rel="stylesheet" href="${s.trim()}">`).join("")), `<head><title>${this.settings.popTitle}</title>${e}${t}<style>${i}</style></head>`;
  }
  getBody() {
    const t = this.settings.id.replace(new RegExp("#", "g"), ""), i = document.getElementById(t);
    if (!i)
      throw new Error("dom is not found！");
    return this.printContentDom = this.beforeHandler(i), "<body>" + this.getFormData(this.printContentDom).outerHTML + "</body>";
  }
  // 处理 canvas 转成图片
  beforeHandler(e) {
    let t = e.querySelectorAll("canvas");
    for (let i = 0; i < t.length; i++)
      if (!t[i].style.display) {
        let r = t[i].parentNode, l = t[i].toDataURL("image/png"), s = new Image();
        s.className = "canvasImg", s.style.display = "none", s.src = l, r == null || r.appendChild(s);
      }
    return e;
  }
  // 根据type去处理form表单
  getFormData(e) {
    let t = e.cloneNode(!0), i = t.querySelectorAll("input,select,textarea"), r = t.querySelectorAll(".canvasImg,canvas"), l = -1;
    for (let s = 0; s < r.length; s++) {
      let n = r[s].parentNode, o = r[s];
      o.tagName.toLowerCase() === "canvas" ? n == null || n.removeChild(o) : o.style.display = "block";
    }
    for (let s = 0; s < i.length; s++) {
      const n = i[s], o = n.value, d = i[s];
      let c = n.getAttribute("type");
      if (c || (c = n.tagName === "SELECT" ? "select" : n.tagName === "TEXTAREA" ? "textarea" : ""), n.tagName === "INPUT")
        c === "radio" || c === "checkbox" ? n.checked && d.setAttribute("checked", String(n.checked)) : (d.value = o, d.setAttribute("value", o));
      else if (c === "select") {
        l++;
        for (let h = 0; h < e.querySelectorAll("select").length; h++) {
          let u = e.querySelectorAll("select")[h];
          if (!u.getAttribute("newbs") && u.setAttribute("newbs", h.toString()), u.getAttribute("newbs") === l.toString()) {
            let w = e.querySelectorAll("select")[l].selectedIndex;
            n.options[w].setAttribute("selected", "true");
          }
        }
      } else
        d.innerHTML = o, d.setAttribute("html", o);
    }
    return t;
  }
  getPrintWindow(e) {
    var r;
    const t = this.Iframe(e), i = t.contentDocument || ((r = t.contentWindow) == null ? void 0 : r.document) || t.document;
    if (!i)
      throw new Error("Cannot find document.");
    return {
      f: t,
      win: t.contentWindow || t,
      doc: i
    };
  }
  previewBoxShow() {
    var t;
    let e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: hidden"), e.style.display = "block");
  }
  previewBoxHide() {
    var t, i;
    let e = document.getElementById("vue-pirnt-next-previewBox");
    e && ((t = document.querySelector("html")) == null || t.setAttribute("style", "overflow: visible;"), (i = e.querySelector("iframe")) == null || i.remove(), e.style.display = "none");
  }
  previewBox() {
    var h, u;
    let e = document.getElementById("vue-pirnt-next-previewBox"), t = "previewBody";
    if (e)
      return (h = e.querySelector("iframe")) == null || h.remove(), {
        close: e.querySelector(".previewClose"),
        previewBody: e.querySelector(`.${t}`)
      };
    let i = document.createElement("div");
    i.setAttribute("id", "vue-pirnt-next-previewBox"), i.setAttribute("style", "position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background: white;display:none"), i.style.zIndex = ((u = this.settings.zIndex) == null ? void 0 : u.toString()) || "1";
    let r = document.createElement("div");
    r.setAttribute("class", "previewHeader"), r.setAttribute("style", "padding: 5px 20px;"), r.innerHTML = this.settings.previewTitle || "", i.appendChild(r), this.close = document.createElement("div");
    let l = this.close;
    l.setAttribute("class", "previewClose"), l.setAttribute("style", "position: absolute;top: 5px;right: 20px;width: 25px;height: 20px;cursor: pointer;");
    let s = document.createElement("div"), n = document.createElement("div");
    s.setAttribute("class", "closeBefore"), s.setAttribute("style", "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(45deg); top: 0px;left: 50%;"), n.setAttribute("class", "closeAfter"), n.setAttribute("style", "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(-45deg); top: 0px;left: 50%;"), l.appendChild(s), l.appendChild(n), r.appendChild(l), this.previewBody = document.createElement("div");
    let o = this.previewBody;
    o.setAttribute("class", t), o.setAttribute("style", "display: flex;flex-direction: column; height: 100%;"), i.appendChild(o);
    let d = document.createElement("div");
    d.setAttribute("class", "previewBodyUtil"), d.setAttribute("style", "height: 32px;background: #474747;position: relative;"), o.appendChild(d), this.previewBodyUtilPrintBtn = document.createElement("div");
    let c = this.previewBodyUtilPrintBtn;
    return c.setAttribute("class", "previewBodyUtilPrintBtn"), c.innerHTML = this.settings.previewPrintBtnLabel || "", c.setAttribute("style", "position: absolute;padding: 2px 10px;margin-top: 3px;left: 24px;font-size: 14px;color: white;cursor: pointer;background-color: rgba(0,0,0,.12);background-image: linear-gradient(hsla(0,0%,100%,.05),hsla(0,0%,100%,0));background-clip: padding-box;border: 1px solid rgba(0,0,0,.35);border-color: rgba(0,0,0,.32) rgba(0,0,0,.38) rgba(0,0,0,.42);box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15), 0 1px 0 hsla(0,0%,100%,.05);"), d.appendChild(c), document.body.appendChild(i), {
      close: this.close,
      previewBody: this.previewBody
    };
  }
  iframeBox(e, t) {
    let i = document.createElement("iframe");
    return i.style.border = "0px", i.style.position = "absolute", i.style.width = "0px", i.style.height = "0px", i.style.right = "0px", i.style.top = "0px", i.setAttribute("id", e), i.setAttribute("src", t), i;
  }
  Iframe(e) {
    e = e || (/* @__PURE__ */ new Date()).getTime().toString();
    let t = this.iframeBox(this.iframeId, e);
    try {
      if (!this.settings.preview)
        document.body.appendChild(t);
      else {
        t.setAttribute("style", "border: 0px;flex: 1;");
        let i = this.previewBox(), r = i.previewBody, l = i.close;
        r == null || r.appendChild(t), this.addEvent(l, "click", () => {
          this.previewBoxHide();
        });
      }
    } catch (i) {
      throw new Error(i + ". iframes may not be supported in this browser.");
    }
    return t;
  }
}
const A = (a, e, t) => {
  a.addEventListener ? a.addEventListener(e, t, !1) : a.attacattachEventhEvent ? a.attachEvent("on" + e, t) : a["on" + e] = t;
}, k = {
  directiveName: "print",
  mounted(a, e) {
    let t = "", i = {};
    A(a, "click", () => {
      if (typeof e.value == "string")
        t = e.value;
      else if (typeof e.value == "object" && e.value.id) {
        t = e.value.id, i = e.value;
        let r = t.replace(new RegExp("#", "g"), "");
        document.getElementById(r) || console.log("id in Error");
      } else {
        window.print();
        return;
      }
      new E(f(m({}, i), { id: t, vue: e.instance }));
    });
  }
}, S = {
  install(a) {
    a.directive("print", k);
  }
};
export {
  E as VuePrintNext,
  S as printPlugin,
  k as vPrint
};
