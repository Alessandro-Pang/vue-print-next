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

English | [简体中文](./README.md)

> A Vue printing plugin that is simple, fast, convenient, and lightweight, supporting both Vue 2 and Vue 3.

This plugin is based on [vue3-print-nb](https://github.com/Power-kxLee/vue3-print-nb) and has been completely rewritten using TypeScript to better support Vue 3's setup function and Composition API.

## 📚 Documentation

Online documentation: [https://alexpang.cn/vue-print-next/docs](https://alexpang.cn/vue-print-next/docs)

## ✨ Features

- Supports both Vue 2 and Vue 3 with strong compatibility
- Supports directive calls and manual calls to the `VuePrintNext` method for printing
- Full support for Vue 3's setup function and Composition API
- Supports global and local content printing, as well as print preview functionality
- Supports setting specific class styles to ignore during printing
- Supports partial printing through CSS selectors or manually passed DOM nodes
- Supports custom paper sizes and orientations
- Supports dark mode and window mode
- Supports customizable print toolbar configuration
- Supports responsive design, adapting to different devices
- Provides rich callback functions to meet various printing scenario requirements

## 🔍 Demo

The project provides source code demos for both Vue2 and Vue3, which you can view after cloning the project

- **Vue2:** /demos/vue2-demo
- **Vue3:** /demos/vue3-demo

Online demo: [https://alexpang.cn/vue-print-next/vue3-demo](https://alexpang.cn/vue-print-next/vue3-demo)

## 📦 Installation

You can install the plugin via npm, yarn, or pnpm:

```bash
npm install vue-print-next --save
# or
yarn add vue-print-next
# or 
pnpm add vue-print-next
```

## 🚀 Quick Start

### 1. Using the Plugin Globally

In your `main.ts` or `main.js` file:

```typescript
import {createApp} from 'vue';
import App from './App.vue';
import {printPlugin} from 'vue-print-next';

const app = createApp(App);
app.use(printPlugin);
app.mount('#app');
```

### 2. Using Directives in Vue3 Components

```html
<script setup>
  // Import the directive directly
  import {vPrint} from 'vue-print-next';
</script>

<template>
  <div>
    <button v-print>Print the entire page</button>
    <button v-print="'#printMe'">Print partial content</button>
    <div id="printMe">
      <p>This is the content to be printed</p>
      <p>More content...</p>
    </div>
  </div>
</template>
```

### 3. Using Directives in Vue2 Components

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
    <button v-print>Print the entire page</button>
    <button v-print="'#printMe'">Print partial content</button>
    <div id="printMe">
      <p>This is the content to be printed</p>
      <p>More content...</p>
    </div>
  </div>
</template>
```

### 4. Using the `VuePrintNext` Class

If you need more complex printing logic, you can use the `VuePrintNext` class directly:

```html
<script setup>
  import {VuePrintNext} from 'vue-print-next';

  function handlePrint() {
    new VuePrintNext({el: '#printMe', /** other parameters */});
  }
</script>

<template>
  <div>
    <button @click="handlePrint">Print partial content</button>
    <div id="printMe">
      <p>This is the content to be printed</p>
    </div>
  </div>
</template>
```

## 📋 API Details

### `vPrint` Directive

- **Full-screen printing**: `<button v-print>Print the entire page</button>`
- **Partial printing**: `<button v-print="'#printMe'">Print partial content</button>`, where `#printMe` is the CSS selector for the DOM element to be printed.

### `VuePrintNext` Class

Used for manually calling the print functionality.

#### Parameter Description

| Parameter                   | Type                        | Description                                | Default Value |
|-----------------------------|------------------------------|-------------------------------------------|------------|
| `el`                        | `string` \| `HtmlElement` | Element to print, supports CSS selectors or DOM nodes | - |
| `standard`                  | `string`                  | Document type, default is html5, options: html5, loose, strict | 'html5' |
| `noPrintSelector`           | `string[]` \| `string`    | CSS selectors to ignore during printing | - |
| `popTitle`                  | `string`                  | Header when printing | Default current title |
| `preview`                   | `boolean`                 | Whether to enable print preview | `false` |
| `previewTitle`              | `string`                  | Preview window title | 'Print Preview' |
| `previewPrintBtnLabel`      | `string`                  | Print button label in preview window | 'Print' |
| `extraCss`                  | `string`                  | Additional CSS file path | - |
| `extraHead`                 | `string`                  | Additional `<head>` content | - |
| `url`                       | `string`                  | Print content from specified URL | - |
| `asyncUrl`                  | `function`                | Method for asynchronously loading URL content | - |
| `zIndex`                    | `number`                  | `z-index` value for preview window | 20002 |
| `paperSize`                 | `string`                  | Paper size, options include 'A0' to 'A8', 'Letter', 'Legal', 'Tabloid', 'custom' | 'A4' |
| `orientation`               | `string`                  | Paper orientation, options: 'portrait' or 'landscape' | 'portrait' |
| `customSize`                | `object`                  | Custom paper size, only effective when paperSize is 'custom' | - |
| `darkMode`                  | `boolean`                 | Whether preview window uses dark mode by default | `false` |
| `windowMode`                | `boolean`                 | Whether preview window uses popup mode (non-fullscreen) | `false` |
| `defaultScale`              | `number`                  | Default zoom ratio for preview window | 1 |
| `previewTools`              | `object \| boolean`       | Preview toolbar configuration, controls which tool buttons to display (zoom, theme, fullscreen) | `{ zoom: true, theme: true, fullscreen: true }` |
| `openCallback`              | `function`                | Callback when print window opens | - |
| `closeCallback`             | `function`                | Callback when print window closes | - |
| `beforeOpenCallback`        | `function`                | Callback before print window opens (for print preview) | - |
| `previewBeforeOpenCallback` | `function`                | Callback before preview iframe loads (for preview) | - |
| `previewOpenCallback`       | `function`                | Callback after preview iframe loads (for preview) | - |

## 🌰 Usage Examples

### Printing the Entire Page

```html
<button v-print>Print the entire page</button>
```

### Printing Partial Content

Print partial content by specifying the `id` parameter:

```html
<div id="printMe">
  <p>This is the content to be printed</p>
</div>

<button v-print="'#printMe'">Print partial content</button>
```

### Using ref to Get Print Element

Allows passing a DOM node, as shown below, you can get the print element through `ref`

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
    <p>This is the content to be printed</p>
  </div>

  <button @click="handlePrint">Print partial content</button>
</template>
```

### Passing Object Parameters

```html
<template>
  <div>
    <div id="printMe">
      <p>This is the content to be printed</p>
    </div>
  </div>

  <button v-print="printObj">Print partial content</button>
</template>

<script setup>
  const printObj = {
    el: "#printMe",
    preview: true,
    extraCss: "https://cdn.example.com/extra.css",
    openCallback() {
      console.log('Print executed');
    },
    closeCallback() {
      console.log('Print tool closed');
    }
  }
</script>
```

### Printing a URL

Print by specifying a URL, ensuring your URL complies with the same-origin policy:

```html
<template>
  <button v-print="printObj">Print specified URL</button>
</template>

<script setup>
  const printObj = {
    url: 'https://example.com/print-content'
  }
</script>
```

### Ignoring Elements That Should Not Be Printed

Ignore elements that should not be printed by setting the `noPrintSelector` parameter:

```html
<template>
  <div id="printMe">
    <p>Gourd baby, gourd baby</p>
    <span class="no-print">This <strong>should not be printed</strong></span>
    <p>Seven flowers on one vine</p>
    <span class="no-print">This <strong>should not be printed</strong></span>
    <p>Not afraid of wind and rain</p>
    <span class="no-print">This <strong>should not be printed</strong></span>
  </div>
  <button v-print="printObj">Ignore elements that should not be printed</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    // Allows using CSS selectors, supports passing an array
    noPrintSelector: '.no-print'
  }
</script>
```

### Asynchronously Loading URL Content

If your URL needs to be loaded asynchronously, you can use the following method:

```html
<template>
  <button v-print="printObj">Asynchronously load URL and print</button>
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

### Setting Paper Size and Orientation

You can set the size and orientation of the print paper using the `paperSize` and `orientation` parameters:

```html
<template>
  <div id="printMe">
    <p>This is the content to be printed</p>
  </div>
  <button v-print="printObj">A4 Landscape Print</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    paperSize: 'A4',           // Set paper size to A4
    orientation: 'landscape',   // Set paper orientation to landscape
    preview: true               // Enable preview mode
  }
</script>
```

### Custom Paper Size

When you need to use a non-standard paper size, you can set `paperSize` to `'custom'` and provide the `customSize` parameter:

```html
<template>
  <div id="printMe">
    <p>This is the content to be printed</p>
  </div>
  <button v-print="printObj">Custom Size Print</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    paperSize: 'custom',        // Set to custom size
    customSize: {
      width: '100',             // Width
      height: '150',            // Height
      unit: 'mm'                // Unit: mm, cm, in, px
    },
    preview: true
  }
</script>
```

### Dark Mode and Window Mode

You can set the display mode of the preview interface using the `darkMode` and `windowMode` parameters:

```html
<template>
  <div id="printMe">
    <p>This is the content to be printed</p>
  </div>
  <button v-print="printObj">Dark Mode Preview</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    preview: true,
    darkMode: true,             // Enable dark mode
    windowMode: true,           // Use popup mode (non-fullscreen)
    defaultScale: 0.8           // Set default zoom ratio to 80%
  }
</script>
```

### Custom Preview Toolbar

You can customize the display of the preview toolbar using the `previewTools` parameter:

```html
<template>
  <div id="printMe">
    <p>This is the content to be printed</p>
  </div>
  <button v-print="printObj">Custom Toolbar</button>
</template>

<script setup>
  const printObj = {
    el: '#printMe',
    preview: true,
    // Only show zoom and theme toggle buttons, don't show fullscreen button
    previewTools: {
      zoom: true,
      theme: true,
      fullscreen: false
    }
  }
</script>
```

## 🤝 Contribution Guide

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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

Welcome to discuss and raise issues or submit Pull Requests on [GitHub Issues](https://github.com/Alessandro-Pang/vue-print-next/issues)!
