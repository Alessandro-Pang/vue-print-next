<script setup lang="ts">
import { VuePrintNext } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

// 显示所有工具按钮（默认行为）
const printWithAllTools = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '所有工具按钮',
    previewTools: {
      zoom: true,
      theme: true,
      fullscreen: true,
    },
  });
};

// 隐藏缩放控制
const printWithoutZoom = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '无缩放控制',
    previewTools: {
      zoom: false,
      theme: true,
      fullscreen: true,
    },
  });
};

// 隐藏主题切换
const printWithoutTheme = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '无主题切换',
    previewTools: {
      zoom: true,
      theme: false,
      fullscreen: true,
    },
  });
};

// 隐藏全屏切换
const printWithoutFullscreen = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '无全屏切换',
    previewTools: {
      zoom: true,
      theme: true,
      fullscreen: false,
    },
  });
};

// 最小化工具栏（隐藏所有工具按钮 - 方式1：单独设置）
const printWithMinimalTools = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '最小化工具栏（方式1）',
    previewTools: {
      zoom: false,
      theme: false,
      fullscreen: false,
    },
  });
};

// 最小化工具栏（隐藏所有工具按钮 - 方式2：一次性设置）
const printWithNoTools = () => {
  new VuePrintNext({
    el: '#custom-tools-content',
    preview: true,
    previewTitle: '最小化工具栏（方式2）',
    previewTools: false,
  });
};
</script>

<template>
  <PrintPageLayout
    title="自定义预览工具栏"
    description="本示例展示了如何自定义预览工具栏中显示的功能按钮"
  >
    <template #buttons>
      <button @click="printWithAllTools" class="print-btn primary">
        <span class="btn-icon">🖨️</span> 显示所有工具
      </button>
      <button @click="printWithoutZoom" class="print-btn secondary">
        <span class="btn-icon">🖨️</span> 隐藏缩放控制
      </button>
      <button @click="printWithoutTheme" class="print-btn accent">
        <span class="btn-icon">🖨️</span> 隐藏主题切换
      </button>
      <button @click="printWithoutFullscreen" class="print-btn warning">
        <span class="btn-icon">🖨️</span> 隐藏全屏切换
      </button>
      <button @click="printWithMinimalTools" class="print-btn warning">
        <span class="btn-icon">🖨️</span> 最小化工具栏（方式1）
      </button>
      <button @click="printWithNoTools" class="print-btn danger">
        <span class="btn-icon">🖨️</span> 最小化工具栏（方式2）
      </button>
    </template>

    <div id="custom-tools-content" class="demo-content">
      <h3>自定义预览工具栏功能</h3>
      <p>
        VuePrintNext 允许您通过
        <code>previewTools</code> 选项自定义预览工具栏中显示的功能按钮。
      </p>

      <div class="feature-card">
        <h4>可配置的工具按钮</h4>
        <ul>
          <li><strong>缩放控制 (zoom)</strong>: 控制预览内容的缩放比例</li>
          <li>
            <strong>主题切换 (theme)</strong>: 在深色模式和浅色模式之间切换
          </li>
          <li>
            <strong>全屏切换 (fullscreen)</strong>: 在全屏模式和窗口模式之间切换
          </li>
        </ul>
      </div>

      <div class="code-example">
        <h4>配置示例</h4>
        <pre>
// 显示所有工具按钮（默认行为）
previewTools: { 
  zoom: true, 
  theme: true, 
  fullscreen: true 
}

// 隐藏缩放控制
previewTools: { 
  zoom: false, 
  theme: true, 
  fullscreen: true 
}

// 最小化工具栏（方式1：单独设置）
previewTools: { 
  zoom: false, 
  theme: false, 
  fullscreen: false 
}

// 最小化工具栏（方式2：一次性设置）
previewTools: false
        </pre>
      </div>

      <p class="note">
        注意：即使隐藏了所有工具按钮，关闭按钮仍然会显示，以便用户可以关闭预览窗口。
      </p>
    </div>
  </PrintPageLayout>
</template>

<style scoped>
.demo-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-card {
  background-color: #f8f9fa;
  border-left: 4px solid #1890ff;
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
}

.code-example {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
}

.note {
  background-color: #fffbe6;
  border-left: 4px solid #faad14;
  padding: 10px 15px;
  margin: 20px 0;
  border-radius: 4px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}
</style>
