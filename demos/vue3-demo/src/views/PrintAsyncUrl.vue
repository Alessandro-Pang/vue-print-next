<!--
 * @Author: zi.yang
 * @Date: 2024-11-08 10:03:44
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 17:44:41
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/views/PrintAsyncUrl.vue
-->
<script setup lang="ts">
import { ref } from 'vue';

import { PrintAreaOption, vPrint } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

const loading = ref(false);
function getAsyncUrl(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('/#/print-form');
      loading.value = false;
    }, 1500);
  });
}

const printOps: PrintAreaOption = {
  asyncUrl: (callback: (url: string) => void): void => {
    loading.value = true;
    getAsyncUrl().then(callback);
  },
  preview: true,
};
</script>

<template>
  <PrintPageLayout
    title="异步URL打印示例"
    description="本示例展示了vue-print-next的异步URL打印功能，支持动态加载远程内容"
  >
    <template #buttons>
      <button v-print="printOps" class="print-btn primary" :disabled="loading">
        <span class="btn-icon" :class="{ loading: loading }">{{
          loading ? '⏳' : '🖨️'
        }}</span>
        {{ loading ? '加载中...' : '异步打印' }}
      </button>
    </template>

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
  </PrintPageLayout>
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
