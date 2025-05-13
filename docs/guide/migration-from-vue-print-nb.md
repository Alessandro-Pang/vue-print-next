# 从 vue-print-nb 迁移到 vue-print-next

本文档将帮助您从 `vue-print-nb` / `vue3-print-nb` 迁移到 `vue-print-next`，详细说明两个库之间的参数对应关系、新增功能和使用方法变化。

`vue-print-next` 几乎完全兼容 `vue-print-nb` 的 API，同时在功能和类型支持上进行了全面升级。它提供了更完善的类型定义以及更多实用特性，使得从 `vue-print-nb` 迁移变得简单直接。无论是在使用 Vue 2 还是 Vue 3，都能轻松完成迁移并获得更好的开发体验。

## 为什么要迁移？

`vue-print-next` 是基于 `vue-print-nb` 完全重写的版本，它提供了以下优势：

- **更好的 TypeScript 支持**：完全使用 TypeScript 重写，提供更好的类型提示和代码补全
- **更好的 Vue 3 支持**：全面支持 Vue 3 的 setup 函数和组合式 API
- **更多功能**：优化了打印预览界面，新增了自定义纸张尺寸、暗黑模式等功能

## 参数对照表

下表展示了 `vue-print-nb` 和 `vue-print-next` 之间的参数对应关系：

| vue-print-nb 参数 | vue-print-next 参数 | 说明 | 类型变化 | 默认值变化 |
|-------------------|-------------------|------|---------|----------|
| id | el | 打印区域的选择器或DOM节点 | String → String \| HTMLElement | - |
| standard | standard | 文档类型 | String → 'strict' \| 'loose' \| 'html5' | html5 |
| extraHead | extraHead | 添加到`<head>`的额外节点 | String → String | - |
| extraCss | extraCss | 添加的CSS样式表 | String → String | - |
| popTitle | popTitle | 打印窗口的标题 | String → String | - |
| openCallback | openCallback | 打印工具调用成功的回调函数 | Function → Function | - |
| closeCallback | closeCallback | 关闭打印工具的回调函数 | Function → Function | - |
| beforeOpenCallback | beforeOpenCallback | 调用打印工具前的回调函数 | Function → Function | - |
| url | url | 打印指定URL的内容 | String → String | - |
| asyncUrl | asyncUrl | 通过回调返回URL | Function → Function | - |
| preview | preview | 是否启用预览模式 | Boolean → Boolean | false |
| previewTitle | previewTitle | 预览窗口的标题 | String → String | '打印预览' → '打印预览' |
| previewPrintBtnLabel | previewPrintBtnLabel | 预览窗口中打印按钮的文本 | String → String | '打印' → '打印' |
| zIndex | zIndex | 预览窗口的z-index值 | String,Number → Number | 20002 |
| previewBeforeOpenCallback | previewBeforeOpenCallback | 预览窗口打开前的回调函数 | Function → Function | - |
| previewOpenCallback | previewOpenCallback | 预览窗口完全打开后的回调函数 | Function → Function | - |

## vue-print-next 新增参数

`vue-print-next` 相比 `vue-print-nb` 新增了以下参数：

| 参数名 | 说明 | 类型 | 可选值 | 默认值 |
|-------|------|------|-------|-------|
| noPrintSelector | 忽略打印的元素选择器 | String[] \| String | - | - |
| paperSize | 纸张尺寸 | String | 'A0'到'A8', 'Letter', 'Legal', 'Tabloid', 'custom' | 'A4' |
| orientation | 纸张方向 | String | 'portrait', 'landscape' | 'portrait' |
| customSize | 自定义纸张尺寸 | Object | - | - |
| previewSize | 预览窗口的纸张尺寸 | String \| Object | 同 paperSize | 同 paperSize |
| darkMode | 是否默认使用深色模式 | Boolean | - | false |
| windowMode | 是否使用弹窗模式（非全屏） | Boolean | - | false |
| defaultScale | 默认缩放比例 | Number | - | 1 |
| previewTools | 预览工具配置 | Object \| Boolean | - | `{ zoom: true, theme: true, fullscreen: true }` |

## 使用方式变化

### 1. 安装方式

**vue-print-nb:**

```bash
npm install vue-print-nb --save
```

**vue-print-next:**

```bash
npm install vue-print-next --save
# 或
yarn add vue-print-next
# 或 
pnpm add vue-print-next
```

### 2. 全局注册

**vue-print-nb (Vue 3):**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import print from 'vue-print-nb'

const app = createApp(App)
app.use(print)
app.mount('#app')
```

**vue-print-next (Vue 3):**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { printPlugin } from 'vue-print-next'

const app = createApp(App)
app.use(printPlugin)
app.mount('#app')
```

### 3. 局部注册指令

**vue-print-nb (Vue 3):**

```html
<script>
import { defineComponent } from 'vue'
import print from 'vue-print-nb'

export default defineComponent({
  directives: {
    print
  }
})
</script>
```

**vue-print-next (Vue 3):**

```html
<script setup>
// 直接导入指令
import { vPrint } from 'vue-print-next'
</script>

<template>
  <button v-print>打印整个页面</button>
  <button v-print="'#printMe'">打印部分内容</button>
</template>
```

或者在选项式API中：

```html
<script>
import { vPrint } from 'vue-print-next'

export default {
  directives: {
    print: vPrint
  }
}
</script>
```

### 4. 使用类进行手动调用

**vue-print-nb:**

```txt
不支持
```

**vue-print-next:**

```javascript
import { VuePrintNext } from 'vue-print-next'

function handlePrint() {
  new VuePrintNext({
    el: '#printMe',
    // 其他参数
  })
}
```

## 迁移示例

### 基本打印示例

**vue-print-nb:**

```html
<template>
  <div>
    <button v-print="'#printMe'">打印</button>
    <div id="printMe">
      <p>这是要打印的内容</p>
    </div>
  </div>
</template>
```

**vue-print-next:**

```html
<template>
  <div>
    <button v-print="'#printMe'">打印</button>
    <div id="printMe">
      <p>这是要打印的内容</p>
    </div>
  </div>
</template>
```

### 高级配置示例

**vue-print-nb:**

```html
<template>
  <div>
    <button v-print="printObj">打印</button>
    <div id="printMe">
      <p>这是要打印的内容</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      printObj: {
        id: '#printMe',
        popTitle: '打印文档'
      }
    }
  }
}
</script>
```

**vue-print-next:**

```html
<template>
  <div>
    <button v-print="printObj">打印</button>
    <div id="printMe">
      <p>这是要打印的内容</p>
    </div>
  </div>
</template>

<script setup>
const printObj = {
  el: '#printMe',
  popTitle: '打印文档',
  extraCss: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
  preview: true, // 启用预览模式
  paperSize: 'A4', // 设置纸张大小
  orientation: 'portrait', // 设置纸张方向
  openCallback() {
    console.log('打印窗口已打开')
  }
}
</script>
```

## 常见问题

### 1. `id` 参数变更为 `el`

在 `vue-print-nb` 中，使用 `id` 参数指定打印区域，而在 `vue-print-next` 中，该参数已更改为 `el`，并且支持传入 DOM 节点或 CSS 选择器。

### 2. 如何使用新增的预览功能？

`vue-print-next` 新增了强大的预览功能，可以通过设置 `preview: true` 启用：

```javascript
const printObj = {
  el: '#printMe',
  preview: true,
  previewTitle: '打印预览',
  previewPrintBtnLabel: '打印'
}
```

### 3. 如何设置纸张大小和方向？

`vue-print-next` 新增了纸张大小和方向设置：

```javascript
const printObj = {
  el: '#printMe',
  paperSize: 'A4', // 设置纸张大小
  orientation: 'landscape' // 设置为横向打印
}
```

### 4. 如何使用自定义纸张大小？

```javascript
const printObj = {
  el: '#printMe',
  paperSize: 'custom',
  customSize: {
    width: '100',
    height: '150',
    unit: 'mm' // 单位可以是 mm, cm, in, px
  }
}
```

### 5. 如何忽略不需要打印的元素？

```javascript
const printObj = {
  el: '#printMe',
  noPrintSelector: '.no-print' // 可以是字符串或字符串数组
}
```

## 总结

从 `vue-print-nb` 迁移到 `vue-print-next` 相对简单，主要需要注意的是：

1. 将 `id` 参数更改为 `el`
2. 导入方式变更为 `import { printPlugin, vPrint, VuePrintNext } from 'vue-print-next'`
3. 利用新增的功能如预览模式、纸张设置等增强打印体验

`vue-print-next` 在保持原有功能的基础上，提供了更多的功能和更好的类型支持，使打印功能的实现更加灵活和强大。
