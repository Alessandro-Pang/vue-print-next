<!--
 * @Author: zi.yang
 * @Date: 2024-06-29 20:44:16
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 17:49:31
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/views/PrintBasicTwo.vue
-->
<script setup lang="ts">
import { vPrint } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';
</script>
<template>
  <PrintPageLayout
    title="基础打印示例二"
    description="本示例展示了如何使用vue-print-next打印带有样式的内容"
  >
    <template #help-text>
      <div class="help-text">
        <i class="tip-icon">💡</i>
        点击下方按钮将打印右侧的歌词内容
      </div>
    </template>

    <template #buttons>
      <button class="print-btn primary" v-print="'#print-el'">
        <span class="btn-icon">📄</span> 指令打印
      </button>
    </template>

    <div class="printable" id="print-el">
      <h1 class="song-title">葫芦娃</h1>
      <p>葫芦娃 葫芦娃</p>
      <p>一根藤上七朵花</p>
      <p>风吹雨打都不怕</p>
      <p>啦啦啦啦</p>
      <p>叮当当咚咚当当 葫芦娃</p>
      <p>叮当当咚咚当当 本领大</p>
      <p>啦啦啦啦</p>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
.printable {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: var(--bg-white);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.song-title {
  text-align: center;
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
  font-weight: 600;
}

p {
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  text-align: center;
  font-size: 1.1rem;
  transition: var(--transition-fast);
}

p:nth-child(odd) {
  background-color: var(--bg-light);
  color: var(--text-primary);
}

p:nth-child(even) {
  background-color: rgba(58, 123, 213, 0.1);
  color: var(--primary-color);
}

p:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
</style>
