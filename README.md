<div align="center">
  <img src="./public/logo.png" alt="logo" style="width: 70px">
  <h1 style="margin: 4px 0 16px 0">Vue Print Next</h1>
  <a href="https://www.npmjs.com/package/vue-print-next">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/vue-print-next?color=orange">
  </a>
  <a href="https://www.npmjs.com/package/vue-print-next">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/vue-print-next">
  </a>
  <a href="https://www.npmjs.com/package/vue-print-next">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/vue-print-next">
  </a>
</div>

![Alt](https://repobeats.axiom.co/api/embed/d78c098d0c6aded6d25e2603961030f7a1a96e64.svg "Repobeats analytics image")

[English](./README.en.md) | 简体中文

> Vue 打印插件，简单、快速、方便、轻巧，支持 Vue 2 和 Vue 3。

本插件基于 [vue3-print-nb](https://github.com/Power-kxLee/vue3-print-nb) 开发，并使用 TypeScript 完全重写，以更好地支持 Vue 3 的 setup 函数和组合式 API。

## 📚 文档

在线文档：[https://alexpang.cn/vue-print-next/docs](https://alexpang.cn/vue-print-next/docs)

## ✨ 特性

- 支持 Vue 2 和 Vue 3，兼容性强
- 支持指令调用和手动调用 `VuePrintNext` 方法进行打印
- 完全支持 Vue 3 的 setup 函数和组合式 API
- 支持全局和局部内容打印，以及打印预览功能
- 支持设置指定 class 样式的元素忽略打印
- 支持通过 css 选择器、手动传入 Dom 节点进行局部打印
- 支持自定义纸张尺寸和方向
- 支持深色模式和窗口模式
- 支持打印工具栏自定义配置
- 支持响应式设计，适配不同设备
- 提供丰富的回调函数，满足各种打印场景需求

## 🔍 Demo

项目中提供了 Vue2 和 Vue3 的 demo 源码，可以 clone 下本项目后进行查看

- **Vue2：** /demos/vue2-demo
- **Vue3：** /demos/vue3-demo

在线 demo：[https://alexpang.cn/vue-print-next/vue3-demo](https://alexpang.cn/vue-print-next/vue3-demo)

## 📦 安装

你可以通过 npm、yarn 或 pnpm 安装该插件：

```bash
npm install vue-print-next --save
# or
yarn add vue-print-next
# or 
pnpm add vue-print-next
```

## 🚀 快速开始

### 1. 全局使用插件

在你的 `main.ts` 或 `main.js` 文件中：

```typescript
import {createApp} from 'vue';
import App from './App.vue';
import {printPlugin} from 'vue-print-next';

const app = createApp(App);
app.use(printPlugin);
app.mount('#app');
```

### 2. Vue3 在组件中使用指令

```html
<script setup>
  // 直接导入指令
  import {vPrint} from 'vue-print-next';
</script>

<template>
  <div>
    <button v-print>打印整个页面</button>
    <button v-print="'#printMe'">打印局部内容</button>
    <div id="printMe">
      <p>这是需要打印的局部内容</p>
      <p>更多内容...</p>
    </div>
  </div>
</template>
```

### 3. Vue2 在组件中使用指令

```html
<script>
  import {vPrint} from "vue-print-next";

  export default {
    name: 'App',
    directives: {
      print: vPrint
    },
  }
</script>

<template>
  <div>
    <button v-print>打印整个页面</button>
    <button v-print="'#printMe'">打印局部内容</button>
    <div id="printMe">
      <p>这是需要打印的局部内容</p>
      <p>更多内容...</p>
    </div>
  </div>
</template>
```

### 4. 使用 `VuePrintNext` 类

如果你需要更复杂的打印逻辑，可以直接使用 `VuePrintNext` 类：

```html
<script setup>
  import {VuePrintNext} from 'vue-print-next';

  function handlePrint() {
    new VuePrintNext({el: '#printMe', /** 其他参数 */});
  }
</script>

<template>
  <div>
    <button @click="handlePrint">打印局部内容</button>
    <div id="printMe">
      <p>这是需要打印的内容</p>
    </div>
  </div>
</template>
```

## 📋 API 详解

### `vPrint` 指令

- **全屏打印**：`<button v-print>打印整个页面</button>`
- **局部打印**：`<button v-print="'#printMe'">打印局部内容</button>`，其中 `#printMe` 是需要打印的 DOM 元素选择器。

### `VuePrintNext` 类

用于手动调用打印功能。

#### 参数说明

| 参数                          | 类型                        | 说明                                  | 默认值        |
|-----------------------------|---------------------------|-------------------------------------|------------|
| `el`                        | `string` \| `HtmlElement` | 需要打印的元素，支持 css 选择器或 dom 节点          | -          |
| `standard`                  | `string`                  | 文档类型，默认是html5，可选 html5，loose，strict | 'html5'    |
| `noPrintSelector`           | `string[]` \| `string`    | 打印时需要忽略的 css 选择器                    | -          |
| `popTitle`                  | `string`                  | 打印时的页眉                              | 默认当前 title |
| `preview`                   | `boolean`                 | 是否启用打印预览功能                          | `false`    |
| `previewTitle`              | `string`                  | 预览窗口的标题                             | '打印预览'     |
| `previewPrintBtnLabel`      | `string`                  | 预览窗口中的打印按钮标签                        | '打印'       |
| `extraCss`                  | `string`                  | 额外的 CSS 文件路径                        | -          |
| `extraHead`                 | `string`                  | 额外的 `<head>` 内容                     | -          |
| `url`                       | `string`                  | 打印指定的网址内容                           | -          |
| `asyncUrl`                  | `function`                | 异步加载 URL 内容的方法                      | -          |
| `zIndex`                    | `number`                  | 预览窗口的 `z-index`值                    | 20002      |
| `paperSize`                 | `string`                  | 纸张尺寸，可选值包括 'A0' 到 'A8'、'Letter'、'Legal'、'Tabloid'、'custom' | 'A4'       |
| `orientation`               | `string`                  | 纸张方向，可选值为 'portrait'（纵向）或 'landscape'（横向） | 'portrait' |
| `customSize`                | `object`                  | 自定义纸张尺寸，仅当 paperSize 为 'custom' 时生效 | -          |
| `darkMode`                  | `boolean`                 | 预览窗口是否默认使用深色模式                          | `false`    |
| `windowMode`                | `boolean`                 | 预览窗口是否默认使用弹窗模式（非全屏）                     | `false`    |
| `defaultScale`              | `number`                  | 预览窗口默认缩放比例                              | 1          |
| `previewTools`              | `object \| boolean`       | 预览工具栏配置，控制显示哪些工具按钮（zoom、theme、fullscreen） | `{ zoom: true, theme: true, fullscreen: true }` |
| `openCallback`              | `function`                | 打印窗口打开时的回调                          | -          |
| `closeCallback`             | `function`                | 打印窗口关闭时的回调                          | -          |
| `beforeOpenCallback`        | `function`                | 打印窗口打开前的回调（打印预览使用）                  | -          |
| `previewBeforeOpenCallback` | `function`                | 预览框架 iframe 加载前的回调（预览使用）            | -          |
| `previewOpenCallback`       | `function`                | 预览框架 iframe 加载完成后的回调（预览使用）          | -          |

## 🌰 使用示例

### 打印整个页面

```html
<button v-print>打印整个页面</button>
```

### 打印局部内容

通过指定 `id` 参数打印局部内容：

```html
<div id="printMe">
  <p>这是需要打印的内容</p>
</div>

<button v-print="'#printMe'">打印局部内容</button>
```

### 使用 ref 获取打印元素

允许传入一个 dom 节点，如下，可以通过 `ref` 获取打印元素

```html
<script setup lang="ts">
  import {ref, type Ref} from 'vue';
  import {VuePrintNext} from "vue-print-next";

  const printEle = ref(null) as Ref<HTMLElement>;
  
  function handlePrint() {
    new VuePrintNext({el: printEle.value})
  }
</script>

<template>
  <div ref="printEle">
    <p>这是需要打印的内容</p>
  </div>

  <button @click="handlePrint">打印局部内容</button>
</template>
```

### 传递对象参数

```html
<template>
  <div>
    <div id="printMe">
      <p>这是需要打印的内容</p>
    </div>
  </div>

  <button v-print="printObj">打印局部内容</button>
</template>

<script setup>
  const printObj = {
    el: "#printMe",
    preview: true,
    extraCss: "https://cdn.example.com/extra.css",
    openCallback() {
      console.log('执行了打印');
    },
    closeCallback() {
      console.log('关闭了打印工具');
    }
  }
</script>
```

### 打印 URL

通过指定 URL 打印，并确保你的 URL 符合同源策略：

```html
<template>
  <button v-print="printObj">打印指定 URL</button>
</template>

<script setup>
  const printObj = {
    url: 'https://example.com/print-content'
  }
</script>
```

### 忽略不需要打印的元素

通过设置 `noPrintSelector` 参数忽略不需要打印的元素：

```html
<template>
  <div id="printMe">
    <p>葫芦娃，葫芦娃</p>
    <span class="no-print">这是<strong>不需要打印</strong></span>
    <p>一根藤上七朵花</p>
    <span class="no-print">这是<strong>不需要打印</strong></span>
    <p>风吹雨打都不怕</p>
    <span class="no-print">这是<strong>不需要打印</strong></span>
  </div>
  <button v-print="printObj">忽略不需要打印的元素</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    // 允许使用 css 选择器，支持传入数组
    noPrintSelector: '.no-print'
  }
</script>
```

### 异步加载 URL 内容

如果你的 URL 需要异步加载，可以使用以下方法：

```html
<template>
  <button v-print="printObj">异步加载 URL 并打印</button>
</template>

<script setup>
  const printObj = {
    asyncUrl(resolve) {
      setTimeout(() => {
        resolve('https://example.com/print-content');
      }, 2000);
    }
  }
</script>
```

### 设置纸张尺寸和方向

可以通过 `paperSize` 和 `orientation` 参数设置打印纸张的尺寸和方向：

```html
<template>
  <div id="printMe">
    <p>这是需要打印的内容</p>
  </div>
  <button v-print="printObj">A4 横向打印</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    paperSize: 'A4',           // 设置纸张尺寸为 A4
    orientation: 'landscape',   // 设置纸张方向为横向
    preview: true               // 启用预览模式
  }
</script>
```

### 自定义纸张尺寸

当需要使用非标准纸张尺寸时，可以设置 `paperSize` 为 `'custom'` 并提供 `customSize` 参数：

```html
<template>
  <div id="printMe">
    <p>这是需要打印的内容</p>
  </div>
  <button v-print="printObj">自定义尺寸打印</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    paperSize: 'custom',        // 设置为自定义尺寸
    customSize: {
      width: '100',             // 宽度
      height: '150',            // 高度
      unit: 'mm'                // 单位：mm、cm、in、px
    },
    preview: true
  }
</script>
```

### 深色模式和窗口模式

可以通过 `darkMode` 和 `windowMode` 参数设置预览界面的显示模式：

```html
<template>
  <div id="printMe">
    <p>这是需要打印的内容</p>
  </div>
  <button v-print="printObj">深色模式预览</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    preview: true,
    darkMode: true,             // 启用深色模式
    windowMode: true,           // 使用弹窗模式（非全屏）
    defaultScale: 0.8           // 设置默认缩放比例为 80%
  }
</script>
```

### 自定义预览工具栏

可以通过 `previewTools` 参数自定义预览工具栏的显示：

```html
<template>
  <div id="printMe">
    <p>这是需要打印的内容</p>
  </div>
  <button v-print="printObj">自定义工具栏</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    preview: true,
    // 只显示缩放和主题切换按钮，不显示全屏按钮
    previewTools: {
      zoom: true,
      theme: true,
      fullscreen: false
    }
  }
</script>
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## ⭐ Star History

<a href="https://star-history.com/#Alessandro-Pang/vue-print-next&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Alessandro-Pang/vue-print-next&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Alessandro-Pang/vue-print-next&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Alessandro-Pang/vue-print-next&type=Date" />
 </picture>
</a>

## 👥 Supporters

<a href="https://github.com/Alessandro-Pang/vue-print-next/stargazers">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://reporoster.com/stars/dark/Alessandro-Pang/vue-print-next" />
   <source media="(prefers-color-scheme: light)" srcset="https://reporoster.com/stars/light/Alessandro-Pang/vue-print-next" />
   <img alt="Star History" src="https://reporoster.com/stars/light/Alessandro-Pang/vue-print-next" />
 </picture>
</a>

<a href="https://github.com/Alessandro-Pang/vue-print-next/network/members">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://reporoster.com/forks/dark/Alessandro-Pang/vue-print-next" />
   <source media="(prefers-color-scheme: light)" srcset="https://reporoster.com/forks/light/Alessandro-Pang/vue-print-next" />
   <img alt="Fork History" src="https://reporoster.com/forks/light/Alessandro-Pang/vue-print-next" />
 </picture>
</a>

## 📄 License

[MIT](http://opensource.org/licenses/MIT)

---

欢迎在 [GitHub Issues](https://github.com/Alessandro-Pang/vue-print-next/issues) 上讨论并提出问题或提交 Pull Request！
