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

// 处理打印预览
function handlePrintPreview() {
  const printOptions = {
    el: '#paper-size-content',
    preview: true,
    paperSize: selectedPaperSize.value,
    orientation: orientation.value,
    darkMode: darkMode.value,
    windowMode: windowMode.value,
    defaultScale: scale.value,
    previewTitle: `${selectedPaperSize.value} ${
      orientation.value === 'portrait' ? '纵向' : '横向'
    } 打印预览`,
  };

  // 如果是自定义尺寸，添加customSize属性
  if (selectedPaperSize.value === 'custom') {
    Object.assign(printOptions, {
      customSize: {
        width: customWidth.value,
        height: customHeight.value,
        unit: customUnit.value,
      },
    });
  }

  new VuePrintNext(printOptions);
}
</script>

<template>
  <PrintPageLayout
    title="纸张尺寸打印示例"
    description="本示例展示了vue-print-next支持的不同纸张尺寸打印功能"
  >
    <template #card-before>
      <div class="card-content">
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
            <label class="radio-label">
              <input type="radio" v-model="orientation" value="portrait" />
              <span>纵向</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="orientation" value="landscape" />
              <span>横向</span>
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>其他选项：</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="darkMode" />
              <span>深色模式</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="windowMode" />
              <span>窗口模式</span>
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>缩放比例：{{ scale }}</label>
          <input
            type="range"
            v-model="scale"
            min="0.5"
            max="2"
            step="0.1"
            class="range-input"
          />
        </div>
      </div>
    </template>

    <template #help-text><span></span></template>

    <template #buttons>
      <button @click="handlePrintPreview" class="print-btn primary">
        <span class="btn-icon">🖨️</span> 打印预览
      </button>
    </template>

    <div id="paper-size-content" class="paper-content">
      <h3 class="content-title">纸张尺寸演示</h3>
      <p>
        当前选择：{{
          paperSizes.find((size) => size.value === selectedPaperSize)?.label
        }}
      </p>
      <p>纸张方向：{{ orientation === 'portrait' ? '纵向' : '横向' }}</p>

      <div class="paper-visualization">
        <div
          class="paper-preview"
          :style="{
            width: orientation === 'portrait' ? '200px' : '280px',
            height: orientation === 'portrait' ? '280px' : '200px',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#333',
          }"
        >
          <div class="paper-label">
            {{
              selectedPaperSize === 'custom'
                ? `自定义 (${customWidth}${customUnit} × ${customHeight}${customUnit})`
                : paperSizes.find((size) => size.value === selectedPaperSize)
                    ?.label
            }}
          </div>
          <div class="paper-orientation">
            {{ orientation === 'portrait' ? '纵向' : '横向' }}
          </div>
        </div>
      </div>

      <div class="paper-info">
        <h4>VuePrintNext 纸张尺寸支持</h4>
        <p>
          VuePrintNext 支持多种标准纸张尺寸，包括 A 系列（A0-A8）、Letter、Legal
          和 Tabloid。
        </p>
        <p>
          您还可以通过 <code>paperSize: 'custom'</code> 和
          <code>customSize</code> 属性设置自定义纸张尺寸。
        </p>
        <p>
          纸张方向可以通过 <code>orientation</code> 属性设置为
          <code>'portrait'</code>（纵向）或 <code>'landscape'</code>（横向）。
        </p>
      </div>

      <div class="paper-sizes-table">
        <h4>标准纸张尺寸参考</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>尺寸 (mm)</th>
              <th>尺寸 (英寸)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A4</td>
              <td>210 × 297</td>
              <td>8.27 × 11.69</td>
            </tr>
            <tr class="row-even">
              <td>A3</td>
              <td>297 × 420</td>
              <td>11.69 × 16.54</td>
            </tr>
            <tr>
              <td>Letter</td>
              <td>215.9 × 279.4</td>
              <td>8.5 × 11</td>
            </tr>
            <tr class="row-even">
              <td>Legal</td>
              <td>215.9 × 355.6</td>
              <td>8.5 × 14</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
/* 使用共享样式，只保留特定于此组件的样式 */
.paper-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.paper-sizes-table {
  margin-top: 20px;
}

.paper-label,
.paper-orientation {
  text-align: center;
  padding: 10px;
}

/* 响应式设计增强 */
@media (max-width: 768px) {
  .paper-visualization {
    margin: 20px 0;
  }

  .paper-preview {
    max-width: 100%;
  }
}
</style>
