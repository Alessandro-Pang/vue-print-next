---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vue Print Next"
  text: "Vue 打印插件"
  tagline: "高效、灵活的打印解决方案，支持 Vue 2 和 Vue 3。"
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/what-is-vue-print-next
    - theme: alt
      text: 在线演示
      link: https://alexpang.cn/vue-print-next/vue3-demo
  image: 
    src: /logo.png
    alt: Vue Print Next

features:
  - icon: 🚀
    title: 简单易用
    details: 提供简单的 API，允许用户快速集成和使用打印功能，无论是全局注册还是局部调用指令都非常方便。
  - icon: 💪
    title: 高效打印
    details: 支持高效的打印操作，能够快速生成和打印文档，提供实时预览功能，以确保打印效果与预期一致。
  - icon: 🎨
    title: 灵活配置
    details: 允许用户通过丰富的参数配置打印选项，包括文档类型、打印预览、忽略特定元素等，满足各种打印需求。
  - icon: 📑
    title: 完善的 TypeScript 支持
    details: 使用 TypeScript 开发，提供全面的类型定义和智能提示，帮助开发者在编码过程中减少错误并提高开发效率。
  - icon: 🔄
    title: Vue2 和 Vue3 兼容
    details: 兼容 Vue2 和 Vue3，支持指令的无缝过渡，使得项目升级或混合使用 Vue 版本时无缝集成。
  - icon: 🌐
    title: URL 打印支持
    details: 支持打印指定 URL 内容，确保用户能够打印在线内容，并处理异步加载问题，支持跨域资源打印。
  - icon: 🖼️
    title: 详细样式控制
    details: 允许用户通过额外的 CSS 和 `&lt;head&gt;` 内容进行详细样式控制，确保打印内容完全符合设计要求。
  - icon: 🔍
    title: 打印内容检查
    details: 提供打印预览功能，让用户在实际打印前可以检查和调整打印内容，确保最终打印效果与设计一致，避免错误和不必要的修改。

---
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
