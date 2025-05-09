<script setup lang="ts">
import { ref, Ref } from 'vue';

import type { Orientation, PaperSize } from 'vue-print-next';
import { VuePrintNext } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';
import { paperSizes } from '../utils/common';

// 当前选择的打印纸张尺寸
const selectedPaperSize: Ref<PaperSize> = ref('A4');

// 当前选择的预览纸张尺寸
const selectedPreviewSize: Ref<PaperSize> = ref('A4');

// 是否使用自定义预览尺寸
const useCustomPreviewSize = ref(false);

// 纸张方向
const orientation: Ref<Orientation> = ref('portrait');

// 打印尺寸自定义尺寸
const customWidth = ref(210);
const customHeight = ref(297);
const customUnit = ref('mm');

// 预览尺寸自定义尺寸
const previewCustomWidth = ref(210);
const previewCustomHeight = ref(297);
const previewCustomUnit = ref('mm');

// 处理打印预览
function handlePrintPreview() {
  const printOptions = {
    el: '#preview-size-content',
    preview: true,
    paperSize: selectedPaperSize.value,
    orientation: orientation.value,
    previewTitle: `预览尺寸示例 - ${
      useCustomPreviewSize.value ? '自定义预览尺寸' : selectedPreviewSize.value
    }`,
  };

  // 如果是自定义打印尺寸，添加customSize属性
  if (selectedPaperSize.value === 'custom') {
    Object.assign(printOptions, {
      customSize: {
        width: customWidth.value,
        height: customHeight.value,
        unit: customUnit.value,
      },
    });
  }

  // 设置预览尺寸
  if (useCustomPreviewSize.value) {
    // 使用自定义预览尺寸
    Object.assign(printOptions, {
      previewSize: {
        width: previewCustomWidth.value,
        height: previewCustomHeight.value,
        unit: previewCustomUnit.value,
      },
    });
  } else if (selectedPreviewSize.value !== selectedPaperSize.value) {
    // 使用预设预览尺寸（与打印尺寸不同）
    Object.assign(printOptions, {
      previewSize: selectedPreviewSize.value,
    });
  }
  // 如果预览尺寸与打印尺寸相同，则不需要设置previewSize

  new VuePrintNext(printOptions);
}
</script>

<template>
  <PrintPageLayout
    title="预览尺寸设置示例"
    description="本示例展示了vue-print-next支持单独设置预览尺寸的功能"
  >
    <template #card-before>
      <div class="card-content">
        <div class="setting-group">
          <label>打印纸张尺寸：</label>
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
                <option value="px">像素 (px)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label>预览尺寸设置：</label>
          <div class="preview-size-options">
            <div class="radio-group">
              <input
                type="radio"
                id="useDefaultPreview"
                name="previewSizeType"
                :value="false"
                v-model="useCustomPreviewSize"
              />
              <label for="useDefaultPreview">预设尺寸</label>
            </div>
            <div class="radio-group">
              <input
                type="radio"
                id="useCustomPreview"
                name="previewSizeType"
                :value="true"
                v-model="useCustomPreviewSize"
              />
              <label for="useCustomPreview">自定义尺寸</label>
            </div>
          </div>
        </div>

        <div class="setting-group" v-if="!useCustomPreviewSize">
          <label>预览纸张尺寸：</label>
          <select v-model="selectedPreviewSize" class="select-input">
            <option
              v-for="size in paperSizes.filter((s) => s.value !== 'custom')"
              :key="size.value"
              :value="size.value"
            >
              {{ size.label }}
            </option>
          </select>
        </div>

        <div class="setting-group" v-if="useCustomPreviewSize">
          <div class="custom-size-inputs">
            <div>
              <label>预览宽度：</label>
              <input
                type="number"
                v-model="previewCustomWidth"
                class="number-input"
                min="1"
              />
            </div>
            <div>
              <label>预览高度：</label>
              <input
                type="number"
                v-model="previewCustomHeight"
                class="number-input"
                min="1"
              />
            </div>
            <div>
              <label>预览单位：</label>
              <select v-model="previewCustomUnit" class="select-input">
                <option value="mm">毫米 (mm)</option>
                <option value="cm">厘米 (cm)</option>
                <option value="in">英寸 (in)</option>
                <option value="px">像素 (px)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <label>纸张方向：</label>
          <div class="radio-group">
            <input
              type="radio"
              id="portrait"
              value="portrait"
              v-model="orientation"
            />
            <label for="portrait">纵向</label>
          </div>
          <div class="radio-group">
            <input
              type="radio"
              id="landscape"
              value="landscape"
              v-model="orientation"
            />
            <label for="landscape">横向</label>
          </div>
        </div>
      </div>
    </template>

    <template #buttons>
      <button @click="handlePrintPreview" class="print-btn primary">
        打印预览
      </button>
    </template>

    <div id="preview-size-content" class="print-content">
      <div class="preview-size-demo">
        <h2>预览尺寸设置示例</h2>
        <div class="size-comparison">
          <div class="size-box">
            <h3>打印尺寸</h3>
            <div class="paper-info">
              <p>
                {{
                  selectedPaperSize === 'custom'
                    ? `自定义 (${customWidth}${customUnit} × ${customHeight}${customUnit})`
                    : paperSizes.find(
                        (size) => size.value === selectedPaperSize
                      )?.label
                }}
              </p>
              <p>{{ orientation === 'portrait' ? '纵向' : '横向' }}</p>
            </div>
          </div>

          <div class="size-box">
            <h3>预览尺寸</h3>
            <div class="paper-info">
              <p>
                {{
                  useCustomPreviewSize
                    ? `自定义 (${previewCustomWidth}${previewCustomUnit} × ${previewCustomHeight}${previewCustomUnit})`
                    : paperSizes.find(
                        (size) => size.value === selectedPreviewSize
                      )?.label
                }}
              </p>
              <p>{{ orientation === 'portrait' ? '纵向' : '横向' }}</p>
            </div>
          </div>
        </div>

        <div class="feature-description">
          <h3>预览尺寸功能说明</h3>
          <p>
            VuePrintNext
            支持单独设置预览尺寸，使预览窗口的纸张大小可以与实际打印的纸张大小不同。
          </p>
          <p>这个功能在以下场景特别有用：</p>
          <ul>
            <li>当打印内容较小，但希望在预览时有更大的视图</li>
            <li>当打印使用特殊尺寸，但希望在预览时使用标准尺寸</li>
            <li>当需要在不同设备上提供更好的预览体验</li>
          </ul>
          <p>使用方法：</p>
          <pre>
{
  // 打印尺寸设置
  paperSize: 'A4',
  customSize: { width: '210', height: '297', unit: 'mm' },
  
  // 预览尺寸设置（两种方式）
  // 1. 使用预设尺寸
  previewSize: 'A3',
  
  // 2. 使用自定义尺寸
  previewSize: { width: '420', height: '594', unit: 'mm' }
}
          </pre>
        </div>
      </div>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
.print-content {
  padding: 20px;
  background-color: white;
}

.preview-size-demo {
  max-width: 800px;
  margin: 0 auto;
}

.size-comparison {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.size-box {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

.size-box h3 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  color: #333;
}

.paper-info {
  font-size: 14px;
}

.feature-description {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.feature-description h3 {
  margin-top: 0;
  color: #333;
}

.feature-description pre {
  background-color: #f1f1f1;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}

.preview-size-options {
  display: flex;
  gap: 20px;
}

.custom-size-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.custom-size-inputs > div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.number-input {
  width: 70px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.select-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.toggle-switch label:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #2196f3;
}

.toggle-switch input:checked + label:before {
  transform: translateX(20px);
}

.range-input {
  width: 100%;
  margin-top: 5px;
}

.setting-group {
  margin-bottom: 15px;
}

.setting-group label {
  display: block;
  font-weight: 500;
  line-height: 30px;
}
</style>
