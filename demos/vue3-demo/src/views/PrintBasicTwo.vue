<!--
 * @Author: zi.yang
 * @Date: 2024-06-29 20:44:16
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 11:57:24
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/views/PrintBasicTwo.vue
-->
<script setup lang="ts">
import { vPrint } from 'vue-print-next';
</script>
<template>
  <div class="print-container fade-in">
    <h2 class="page-title">基础打印示例二</h2>
    <p class="page-description">本示例展示了如何使用vue-print-next打印带有样式的内容</p>
    
    <div class="card-container">
      <div class="print-options-card">
        <div class="card-header">
          <span class="card-icon">🖨️</span>
          <h3>打印选项</h3>
        </div>
        <div class="card-content">
          <div class="help-text">
            <i class="tip-icon">💡</i> 点击下方按钮将打印右侧的歌词内容
          </div>
          
          <div class="buttons-group">
            <button v-print="{el: '#print'}" class="print-btn primary">
              <span class="btn-icon">🖨️</span> 打印内容
            </button>
          </div>
        </div>
      </div>
      
      <div class="print-content" style="flex: 1">
        <div class="printable" id="print">
          <h1 class="song-title">葫芦娃</h1>
          <p>葫芦娃 葫芦娃</p>
          <p>一根藤上七朵花</p>
          <p>风吹雨打都不怕 </p>
          <p>啦啦啦啦</p>
          <p>叮当当咚咚当当 葫芦娃</p>
          <p>叮当当咚咚当当 本领大</p>
          <p>啦啦啦啦</p>
        </div>
      </div>
    </div>
  </div>
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
