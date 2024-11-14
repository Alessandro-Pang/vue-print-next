# 常见问题

## 1. 插件、方法支持 Vue2 吗？

**Q：** 该插件是否兼容 Vue2？

**A：** 是的，`VuePrintNext` 插件对 Vue2 的指令插件机制做了兼容，因此可以在 Vue2 环境下使用。然而，由于插件主要为 Vue3 设计，可能会存在与 Vue2 的兼容性问题，特别是在处理 IE 浏览器时。如果你需要更广泛的兼容性，建议使用 [vue-print-nb](https://github.com/Power-kxLee/vue2-print-nb) 插件。

## 2. `VuePrintNext` 必须传入哪些参数？

**Q:** `VuePrintNext` 类必须传入 `el`、`url`、`asyncUrl` 其中一个参数，但不支持全屏打印？

**A:** `v-print` 指令允许不传入任何参数，此时会打印整个页面。如果使用 `VuePrintNext` 类进行全屏打印，请将 `el` 参数设置为 `'body'`。确保至少传入 `el`、`url` 或 `asyncUrl` 中的一个参数，以便正常使用插件。

## 3. 打印窗口的确认和取消按钮的回调如何处理？

**Q:** 如何监听打印窗口的确认和取消按钮的点击事件？

**A:** 打印窗口的确认和取消按钮是由浏览器提供的，无法直接在 `VuePrintNext` 类中监听。因此，`closeCallback` 回调函数将在打印窗口关闭时触发，不论用户是否确认或取消打印。

## 4. 其他框架或无框架环境下如何使用？

**Q:** `VuePrintNext` 是否可以在其他框架或无框架环境下使用？

**A:** `VuePrintNext` 是一个纯 JavaScript 实现的类，理论上与框架无关，因此可以在其他框架或无框架环境中使用。用户只需通过调用 `VuePrintNext` 类即可。在其他框架中，指令和插件模式不可用，只能通过 API 调用。

## 5. 打印时出现样式问题？

**Q:** 打印出来的内容样式与预期不符，可能是什么原因？

**A:** 样式问题可能由以下几种原因造成：
- **公共样式影响**：
  - 例如 `body` 设置为 `flex` 会影响打印内容的宽度。请确保打印内容的容器具有固定宽度。
  - **`overflow: hidden`**：如果 `html` 或 `body` 设置为 `hidden`，可能会导致打印时无法完全展示内容。
  - `font-size: 0`, `opacity: 0`： 如果全局样式中存在以上类似的样式，可能会导致打印时问题、元素展示不出来。
- **CSS 动画**：如果页面上有 CSS 动画，可能会导致打印内容与实际展示不符。使用 `preview: true` 打开预览窗口，并等待动画完成后再进行打印。

## 6. 如何处理 URL 跨域问题？

**Q:** 打印跨域 URL 内容时遇到问题，该如何处理？

**A:** 由于浏览器的安全策略，`iframe` 无法对跨域站点触发 `print` 方法。可以通过在页面中内嵌一个 `iframe` 加载跨域页面，然后将 `el` 设置为 `'iframe'` 来解决这个问题。请确保 URL 符合同源策略或使用代理服务解决跨域问题。

## 7. 打印内容与实际内容不一致怎么办？

**Q:** 打印内容与预期结果不一致，如何检查？

**A:** 使用 `preview: true` 打开打印预览窗口，检查和调整打印内容。预览窗口中的样式即为实际打印的样式，这可以帮助你在打印前发现和修正问题。

## 8. 打印预览窗口无法正确加载？

**Q:** 打印预览窗口无法正确加载或显示不全？

**A:** 确保传入的 `extraCss` 和 `extraHead` 参数中的路径和内容正确。如果预览窗口仍然无法加载，请检查网络请求是否成功，或尝试在本地调试和修复问题。

## 9. 如何调试打印功能？

**Q:** 在使用 `VuePrintNext` 时遇到调试困难，如何有效调试？

**A:** 使用浏览器的开发者工具检查打印内容的 HTML 和 CSS。通过 `console.log` 输出调试信息，查看回调函数是否正常触发。确保使用的参数正确并且符合预期。

## 10. 为什么打印 地图、Three.js 等 WebGL 时是空白的

**Q:** 在打印 `canvas` 时，`canvas` 采用了 `webgl` 绘制 3D 图形（如 GIS 地图，Three.js 等），会导致打印出来的是空白的。

**A:** 这和 webgl 的一个上下文参数有关：`preserveDrawingBuffer`, 这个值默认为 `false`, 
这个参数是浏览器为了性能和兼容性，当完成绘制后，浏览器默认会清除 WebGL 画布的绘制缓存。
这就导致了打印时调用 `canvas.toDataURL` 获取到的图片是一片空白。

**解决办法：** 在执行初始化 3D 图形之前，重写 `getContext` 方法，使绘制 `webgl` 时 `preserveDrawingBuffer` 参数为 `true`

```js
// 重写 getContext 方法
HTMLCanvasElement.prototype.getContext = (function (origFn) {
  return function (type, attributes) {
    if (type === 'webgl') {
      attributes = Object.assign({}, attributes, {
        preserveDrawingBuffer: true,
      });
    }
    return origFn.call(this, type, attributes);
  };
})(HTMLCanvasElement.prototype.getContext);
```

---

如果有其他问题或需要进一步的支持，请随时在 [GitHub Issues](https://github.com/Alessandro-Pang/vue-print-next/issues) 上提出问题和提交 Pull Request。
