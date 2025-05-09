<script setup lang="ts">
import { ref, Ref } from 'vue';

import type { Orientation, PaperSize } from 'vue-print-next';
import { VuePrintNext } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';
import { paperSizes } from '../utils/common';

// 当前选择的纸张尺寸
const selectedPaperSize: Ref<PaperSize> = ref('A4');

// 纸张方向
const orientation: Ref<Orientation> = ref('portrait');

// 自定义尺寸
const customWidth = ref(210);
const customHeight = ref(297);
const customUnit = ref('mm');

// 是否启用深色模式
const darkMode = ref(false);

// 是否启用窗口模式
const windowMode = ref(false);

// 缩放比例
const scale = ref(1);

// 打印不同的部分
function printSection(sectionId: string, title: string) {
  new VuePrintNext({
    el: `#${sectionId}`,
    preview: true,
    paperSize: 'A4',
    orientation: 'portrait',
    darkMode: darkMode.value,
    previewTitle: title,
  });
}

// 组合打印功能
function printCombined() {
  const printOptions = {
    el: '#section1, #section2, #section3',
    preview: true,
    paperSize: selectedPaperSize.value,
    orientation: orientation.value,
    darkMode: darkMode.value,
    windowMode: windowMode.value,
    defaultScale: scale.value,
    previewTitle: '组合打印示例',
  };

  if (selectedPaperSize.value === 'custom') {
    Object.assign(printOptions, {
      customSize: {
        width: customWidth.value + '',
        height: customHeight.value + '',
        unit: customUnit.value,
      },
    });
  }

  new VuePrintNext(printOptions);
}
</script>

<template>
  <PrintPageLayout
    title="VuePrintNext 高级功能示例"
    description="本示例展示了vue-print-next的高级打印功能，包括自定义纸张尺寸、方向和缩放选项"
  >
    <template #card-before>
      <div class="settings-panel">
        <div class="setting-group">
          <label>纸张尺寸：</label>
          <select v-model="selectedPaperSize" class="select-input">
            <option
              v-for="size in paperSizes"
              :key="size.value"
              :value="size.value"
            >
              {{ size.label }}
            </option>
          </select>
        </div>

        <div class="setting-group" v-if="selectedPaperSize === 'custom'">
          <div class="custom-size-inputs">
            <div>
              <label>宽度：</label>
              <input
                type="number"
                v-model="customWidth"
                class="number-input"
                min="1"
              />
            </div>
            <div>
              <label>高度：</label>
              <input
                type="number"
                v-model="customHeight"
                class="number-input"
                min="1"
              />
            </div>
            <div>
              <label>单位：</label>
              <select v-model="customUnit" class="select-input">
                <option value="mm">毫米 (mm)</option>
                <option value="cm">厘米 (cm)</option>
                <option value="in">英寸 (in)</option>
                <option value="pt">点 (pt)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label>纸张方向：</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="orientation" value="portrait" />
              纵向
            </label>
            <label>
              <input type="radio" v-model="orientation" value="landscape" />
              横向
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>显示选项：</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="darkMode" />
              深色模式
            </label>
            <label>
              <input type="checkbox" v-model="windowMode" />
              窗口模式
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>缩放比例：{{ scale }}</label>
          <input
            type="range"
            @change="() => console.log(scale)"
            v-model="scale"
            min="0.5"
            max="2"
            step="0.1"
            class="range-input"
          />
        </div>
      </div>
    </template>

    <template #buttons>
      <button @click="printCombined" class="print-btn secondary">
        打印全部内容
      </button>

      <button
        @click="printSection('section1', '第一部分')"
        class="print-btn accent"
      >
        打印第一部分
      </button>
      <button
        @click="printSection('section2', '第二部分')"
        class="print-btn accent"
      >
        打印第二部分
      </button>
      <button
        @click="printSection('section3', '第三部分')"
        class="print-btn accent"
      >
        打印第三部分
      </button>
    </template>

    <div id="section1" class="print-section">
      <h3>第一部分：VuePrintNext 高级功能</h3>
      <div class="feature-card">
        <h4>自定义纸张尺寸</h4>
        <p>
          VuePrintNext 支持多种标准纸张尺寸，包括 A 系列、Letter、Legal 和
          Tabloid。
        </p>
        <p>
          您还可以通过 <code>paperSize: 'custom'</code> 和
          <code>customSize</code> 属性设置自定义纸张尺寸。
        </p>
        <div class="code-example">
          <pre>
{
  paperSize: 'custom',
  customSize: {
    width: 210,
    height: 297,
    unit: 'mm'
  }
}</pre
          >
        </div>
      </div>
    </div>

    <div id="section2" class="print-section">
      <h3>第二部分：显示选项</h3>
      <div class="feature-card">
        <h4>深色模式与窗口模式</h4>
        <p>
          VuePrintNext 支持深色模式打印预览，通过设置
          <code>darkMode: true</code> 启用。
        </p>
        <p>
          窗口模式允许在新窗口中打印预览，通过设置
          <code>windowMode: true</code> 启用。
        </p>
        <div class="preview-example" :class="{ dark: darkMode }">
          <div class="preview-content">
            <h5>预览示例</h5>
            <p>这是一个{{ darkMode ? '深色' : '浅色' }}模式的预览示例</p>
          </div>
        </div>
      </div>
    </div>

    <div id="section3" class="print-section">
      <h3>第三部分：缩放</h3>
      <div class="feature-card">
        <h4>缩放控制</h4>
        <p>
          通过
          <code>defaultScale</code> 属性可以设置打印预览的初始缩放比例。
        </p>
        <p>当前缩放比例：{{ scale }}</p>

        <h4>组合打印</h4>
        <p>
          VuePrintNext 支持打印多个元素，只需将多个选择器传递给
          <code>el</code> 属性。
        </p>
        <div class="code-example">
          <pre>
{
  el: '#section1, #section2, #section3',
  preview: true
}</pre
          >
        </div>
      </div>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
/* 使用共享样式，只保留特定于此组件的样式 */
.section-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.buttons-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* 响应式设计增强 */
@media (max-width: 768px) {
  .section-buttons {
    flex-direction: column;
  }

  .buttons-group {
    flex-direction: column;
  }
}
</style>
