# Vue Print Next

Vue 打印插件，简单、快速、方便、轻巧，支持 Vue 2 和 Vue 3。

本插件基于 [vue3-print-nb](https://github.com/Power-kxLee/vue3-print-nb) 开发，并使用 TypeScript 完全重写，以更好地支持
Vue 3 的 setup 函数。

## 特性

- 支持指令调用和手动调用 `VuePrintNext` 方法进行打印。
- 更好地支持 Vue 3 的 setup 函数。
- 支持全局和局部内容打印，以及打印预览功能。
- 支持设置指定 class 样式的元素忽略打印
- 支持通过 css 选择器、手动传入 Dom 节点进行局部打印。

## 安装

你可以通过 npm、 yarn 或 pnpm 安装该插件：

```bash
npm install vue-print-next --save
# or
yarn add vue-print-next
# or 
pnpm add vue-print-next
```

## 快速开始

### 1. 全局使用插件

在你的 `main.ts` 文件中：

```typescript
import {createApp} from 'vue';
import App from './App.vue';
import {printPlugin} from 'vue-print-next';

const app = createApp(App);
app.use(printPlugin);
app.mount('#app');
```

### 2. Vue3 在组件中使用指令

```vue

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

<script setup>
  // 直接导入指令
  import {vPrint} from 'vue-print-next';
</script>
```

### 2. Vue2 在组件中使用指令

```vue

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

<script>
  import {vPrint} from "vue-print-next";

  export default {
    name: 'App',
    directives: {
      print: vPrint
    },
  }
</script>
```

### 4. 使用 `VuePrintNext` 类

如果你需要更复杂的打印逻辑，可以直接使用 `VuePrintNext` 类：

```vue
<template>
  <div>
    <button @click="handlePrint">打印局部内容</button>
    <div id="printMe">
      <p>这是需要打印的内容</p>
    </div>
  </div>
</template>

<script setup>
  import {VuePrintNext} from 'vue-print-next';

  function handlePrint() {
    new VuePrintNext({el: '#printMe', /** 其他参数 */});
  }
</script>
```

## API 详解

### `vPrint` 指令

- **全屏打印**：`<button v-print>打印整个页面</button>`
- **局部打印**：`<button v-print="'#printMe'">打印局部内容</button>`，其中 `#printMe` 是需要打印的 DOM 元素选择器。

### `VuePrintNext` 类

用于手动调用打印功能。

#### 参数说明

| 参数                          | 类型                        | 说明                         | 默认值     |
|-----------------------------|---------------------------|----------------------------|---------|
| `el`                        | `string` \| `HtmlElement` | 需要打印的元素，支持 css 选择器或 dom 节点 | -       |
| `preview`                   | `boolean`                 | 是否启用打印预览功能                 | `false` |
| `previewTitle`              | `string`                  | 预览窗口的标题                    | '打印预览'  |
| `previewPrintBtnLabel`      | `string`                  | 预览窗口中的打印按钮标签               | '打印'    |
| `extraCss`                  | `string`                  | 额外的 CSS 文件路径               | -       |
| `extraHead`                 | `string`                  | 额外的 `<head>` 内容            | -       |
| `asyncUrl`                  | `function`                | 异步加载 URL 内容的方法             | -       |
| `zIndex`                    | `number`                  | 预览窗口的 `z-index`值           | 20002   |
| `openCallback`              | `function`                | 打印窗口打开时的回调                 | -       |
| `closeCallback`             | `function`                | 打印窗口关闭时的回调                 | -       |
| `beforeOpenCallback`        | `function`                | 打印窗口打开前的回调（打印预览使用）         | -       |
| `previewBeforeOpenCallback` | `function`                | 预览框架 iframe 加载前的回调（预览使用）   | -       |
| `previewOpenCallback`       | `function`                | 预览框架 iframe 加载完成后的回调（预览使用） | -       |

## 使用示例

### 打印整个页面

```vue

<button v-print>打印整个页面</button>
```

### 打印局部内容

```vue
<div id="printMe">
  <p>这是需要打印的内容</p>
  <button v-print="'#printMe'">打印局部内容</button>
</div>
```

### 传递对象参数

```vue
<template>
  <div>
    <button v-print="printObj">打印局部内容</button>
    <div id="printMe">
      <p>这是需要打印的内容</p>
    </div>
  </div>
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

```vue
<template>
  <button v-print="printObj">打印指定 URL</button>
</template>

<script setup>
  const printObj = {
    url: 'https://example.com/print-content'
  }
</script>
```

### 异步加载 URL 内容

如果你的 URL 需要异步加载，可以使用以下方法：

```vue
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

## FAQ

### 1. 插件、方法支持 Vue2 吗？

该插件对 Vue2 的指令插件机制做了兼容，是可以在 Vue2 环境下使用的，但由于本身是为了 Vue3 而设计的，所以在没有处理 IE
浏览器的兼容，如果想考虑兼容的情况下还是使用 [vue-print-nb](https://github.com/Power-kxLee/vue2-print-nb) 插件。

### 2. `VuePrintNext` 必传参数 `id`, 不支持全屏打印?

`v-print` 指令允许不传入 `id` 参数，此时会打印整个页面，
但 `VuePrintNext` 类必须传入 `id` 参数，这是因为考虑到当需要手动调用全屏打印时，
用户完全可以直接使用 `window.print()` 方法进行打印，而不需要使用 `VuePrintNext` 类。

### 3. 不支持打印窗口的确认和取消按钮的回调？

因为打印窗口的确认和取消按钮是由浏览器提供的，所以无法直接在 `VuePrintNext`
类中监听点击事件进行回调，所以只提供了 `closeCallback` 回调函数无论在确认还是取消时都会触发 `closeCallback`。

### 4. 其他框架下（原生JS）下能否调用？

`VuePrintNext` 是一个纯 JS 实现的类，原则上与框架无关，所以可以在任何框架、或无框架下使用，用户只需要通过调用 `VuePrintNext`
即可，区别是其他框架下无法继承指令、插件模式，只能通过 API 调用。

## License

[MIT](http://opensource.org/licenses/MIT)

---

欢迎在 [GitHub Issues](https://github.com/Alessandro-Pang/vue-print-next/issues) 上讨论并提出问题或提交 Pull Request！
