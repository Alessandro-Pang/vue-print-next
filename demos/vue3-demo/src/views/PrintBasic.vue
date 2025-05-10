<script setup lang="ts">
import { ref } from 'vue';

import { PrintAreaOption, vPrint, VuePrintNext } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

const count = ref(0);

function handleBasicPrint() {
  new VuePrintNext({ el: '#print-el', preview: true });
}

const printOps: PrintAreaOption = {
  el: '#print-el',
  // 打印忽略 img
  noPrintSelector: ['img'],
};
</script>

<template>
  <PrintPageLayout
    title="基本打印功能示例"
    description="本示例展示了vue-print-next的基本打印功能，包括全屏打印、指令打印和方法打印"
  >
    <template #help-text>
      <div class="help-text">
        <i class="tip-icon">💡</i>
        提示：点击下方按钮可以尝试不同的打印方式，包括忽略图片的打印选项。
      </div>
    </template>

    <template #buttons>
      <button class="print-btn" v-print>
        <span class="btn-icon">🖨️</span> 全屏打印
      </button>
      <button class="print-btn primary" v-print="'#print-el'">
        <span class="btn-icon">📄</span> 指令打印
      </button>
      <button class="print-btn secondary" @click="handleBasicPrint">
        <span class="btn-icon">⚙️</span> 方法打印
      </button>
      <button class="print-btn accent" v-print="printOps">
        <span class="btn-icon">🔍</span> 忽略图片
      </button>
    </template>

    <div id="print-el">
      <div class="logo-container">
        <a target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
          <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>

      <h3 class="content-title">测试基本打印功能</h3>

      <div class="demo-card">
        <button type="button" class="counter-btn" @click="count++">
          count is {{ count }}
        </button>
        <p class="hint-text">
          Edit <code>components/HelloWorld.vue</code> to test HMR
        </p>
      </div>

      <div class="info-section">
        <p>
          Check out <a target="_blank" class="link">create-vue</a>, the official
          Vue + Vite starter
        </p>
        <p>
          Learn more about IDE Support for Vue in the
          <a target="_blank" class="link">Vue Docs Scaling up Guide</a>.
        </p>
        <p class="read-the-docs">
          Click on the Vite and Vue logos to learn more
        </p>
      </div>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
/* 特定页面样式 */
.logo-container {
  display: flex !important;
  justify-content: center;
  flex-direction: row !important;
}

.logo {
  height: 120px;
  padding: 1em;
  will-change: filter;
  transition: var(--transition-normal);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
  transform: scale(1.05);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.content-title {
  text-align: center;
  margin: var(--spacing-md) 0;
  color: var(--text-primary);
  font-weight: 600;
}

.demo-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.counter-btn {
  background-image: var(--primary-gradient);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-normal);
}

.counter-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.hint-text {
  margin-top: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-section {
  text-align: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.read-the-docs {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-top: var(--spacing-md);
  text-align: center;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .logo {
    height: 80px;
  }

  .logo-container {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
}
</style>
