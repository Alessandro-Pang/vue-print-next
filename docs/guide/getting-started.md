# 快速开始

要快速上手使用 `VuePrintNext`，请按照以下步骤进行集成和使用：

## 1. 安装插件

首先，安装 `VuePrintNext` 插件。你可以通过以下命令使用 `npm`、`yarn` 或 `pnpm` 安装：

```bash
npm install vue-print-next --save
# 或者
yarn add vue-print-next
# 或者
pnpm add vue-print-next
```

## 2. Vue 3 项目

1. **全局注册插件**

   在你的 `main.ts` 文件中，导入并使用插件：

   ```typescript
   import { createApp } from 'vue';
   import App from './App.vue';
   import { printPlugin } from 'vue-print-next';

   const app = createApp(App);
   app.use(printPlugin);
   app.mount('#app');
   ```

2. **在组件中使用指令**

   使用 `v-print` 指令进行打印。以下是一个示例：

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
   ```

## 3. Vue 2 项目

1. **全局注册插件**

   在你的 `main.js` 文件中，导入并使用插件：

   ```javascript
   import Vue from 'vue';
   import App from './App.vue';
   import { printPlugin } from 'vue-print-next';

   Vue.use(printPlugin);

   new Vue({
     render: h => h(App),
   }).$mount('#app');
   ```

2. **在组件中使用指令**

   在组件中使用 `v-print` 指令进行打印：

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
   import { vPrint } from 'vue-print-next';

   export default {
     name: 'App',
     directives: {
       print: vPrint
     },
   }
   </script>
   ```

## 4. 使用 `VuePrintNext` 类

如果需要更复杂的打印逻辑，可以直接使用 `VuePrintNext` 类：

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
import { VuePrintNext } from 'vue-print-next';

function handlePrint() {
  new VuePrintNext({ el: '#printMe', /* 其他参数 */ });
}
</script>
```
