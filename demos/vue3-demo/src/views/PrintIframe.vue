<script setup lang="ts">
import { vPrint } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

const printOps = {
  el: '#iframeBox',
  preview: true,
};
</script>

<template>
  <PrintPageLayout
    title="iframe打印示例"
    description="本示例展示了如何使用 vue-print-next 打印iframe内容"
  >
    <template #buttons>
      <button v-print="printOps" class="print-btn primary">
        <span class="btn-icon">🖨️</span> 打印iframe
      </button>
    </template>

    <div id="iframeBox">
      <iframe
        class="a4-page"
        src="https://juejin.cn/post/7385784332444893195"
      ></iframe>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
.a4-page {
  width: 100%;
  height: 600px;
  border: 1px solid #eee;
  border-radius: var(--border-radius-md);
}
</style>
