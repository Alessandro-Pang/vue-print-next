<script setup lang="ts">
import { vPrint } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

const printOps = {
  url: 'vue3-print.pdf',
  preview: true
}
</script>

<template>
  <PrintPageLayout
    title="PDF 打印示例"
    description="本示例展示了如何使用 vue-print-next 打印PDF文件内容"
  >
    <template #buttons>
      <button v-print="printOps" class="print-btn primary">
        <span class="btn-icon">🖨️</span> 打印PDF
      </button>
    </template>
    
    <div class="pdf-container">
      <object data="vue3-print.pdf" type="application/pdf" width="100%" height="600"></object>
      <div class="pdf-note">目前仅支持预览后打印 PDF</div>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
.pdf-container {
  width: 100%;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-white);
  padding: var(--spacing-md);
}

.pdf-note {
  margin-top: var(--spacing-md);
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
}

/* 打印样式 */
@media print {
  .pdf-container {
    box-shadow: none;
    padding: 0;
  }
  
  object[type="application/pdf"] {
    width: 100%;
    height: auto;
  }
}
</style>
