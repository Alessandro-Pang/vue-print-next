<script setup lang="ts">
import { ref } from 'vue';

import { vPrint } from 'vue-print-next';

/**
 * url: 跨域时无法进行打印
 */
const printOps = {
  url: '/#/print-form',
  // preview: true,
  openCallback(){
    console.log('打印之前')
    isPrinting.value = true;
  },
  closeCallback(){
    console.log('打印之后')
    isPrinting.value = false;
  }
}

const isPrinting = ref(false);
</script>

<template>
  <div class="print-container fade-in">
    <h2 class="page-title">URL打印示例</h2>
    <p class="page-description">本示例展示了如何使用vue-print-next直接打印指定URL的内容</p>
    
    <div class="card-container">
      <div class="print-options-card">
        <div class="card-header">
          <span class="card-icon">🌐</span>
          <h3>URL打印选项</h3>
        </div>
        <div class="card-content">
          <div class="help-text">
            <i class="tip-icon">💡</i> 点击下方按钮将打印 <a href="/#/print-form" class="link">/#/print-form</a> 页面的内容
          </div>
          
          <div class="buttons-group">
            <button v-print="printOps" class="print-btn primary" :disabled="isPrinting">
              <span class="btn-icon" :class="{ 'loading': isPrinting }">{{ isPrinting ? '⏳' : '🖨️' }}</span>
              {{ isPrinting ? '打印中...' : 'URL打印' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="print-content">
        <h3 class="content-title">URL打印说明</h3>
        <p>URL打印功能允许您直接打印指定URL的内容，无需先加载到当前页面。</p>
        <p>注意事项：</p>
        <ul>
          <li>跨域URL可能无法正常打印</li>
          <li>URL必须是同源的，或者目标服务器允许跨域访问</li>
          <li>可以通过回调函数监控打印过程</li>
        </ul>
        
        <div class="code-example">
          <h4>示例代码：</h4>
          <pre><code>const printOps = {
  url: '/#/print-form',
  openCallback() {
    console.log('打印开始')
  },
  closeCallback() {
    console.log('打印结束')
  }
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-example {
  background-color: var(--bg-light);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  margin-top: var(--spacing-md);
}

pre {
  margin: 0;
  overflow-x: auto;
}

code {
  font-family: monospace;
  color: var(--text-primary);
}

ul {
  padding-left: var(--spacing-lg);
  color: var(--text-secondary);
}

li {
  margin-bottom: var(--spacing-xs);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-fast);
}

.link:hover {
  text-decoration: underline;
}
</style>
