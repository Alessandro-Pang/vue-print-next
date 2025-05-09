<script setup lang="ts">
import { ref } from 'vue';

import { PrintAreaOption, vPrint } from 'vue-print-next';

const loading = ref(false)
function getAsyncUrl(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('/#/print-form')
      loading.value = false
    }, 1500)
  })
}


const printOps: PrintAreaOption = {
  asyncUrl: (callback: (url: string) => void): void => {
    loading.value = true;
    getAsyncUrl().then(callback)
  },
  preview: true,
}
</script>

<template>
  <div class="print-container fade-in">
    <h2 class="page-title">异步URL打印示例</h2>
    <p class="page-description">本示例展示了如何使用异步方式获取URL并打印其内容，适用于需要动态生成打印内容的场景</p>
    
    <div class="card-container">
      <div class="print-options-card">
        <div class="card-header">
          <span class="card-icon">🔄</span>
          <h3>异步URL打印</h3>
        </div>
        <div class="card-content">
          <div class="help-text">
            <i class="tip-icon">💡</i> 点击下方按钮后，系统将在1.5秒后异步加载 <a href="/#/print-form" class="link">/#/print-form</a> 页面内容并打印
          </div>
          
          <div class="buttons-group">
            <button v-print="printOps" class="print-btn primary" :disabled="loading">
              <span class="btn-icon" :class="{ 'loading': loading }">{{ loading ? '⏳' : '🖨️' }}</span>
              {{ loading ? '加载中...' : '异步打印URL' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="print-content">
        <h3 class="content-title">异步URL打印说明</h3>
        <p>异步URL打印功能允许您在打印前动态获取URL，这在以下场景特别有用：</p>
        <ul>
          <li>需要从服务器获取临时URL的场景</li>
          <li>打印前需要生成或处理内容的场景</li>
          <li>基于用户操作动态决定打印内容的场景</li>
        </ul>
        
        <div class="code-example">
          <h4>示例代码：</h4>
          <pre><code>const printOps = {
  asyncUrl: (callback) => {
    // 异步获取URL
    getAsyncUrl().then(callback)
  },
  preview: true
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
