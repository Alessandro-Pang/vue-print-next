<script setup lang="ts">
import { ref } from 'vue';

import { VuePrintNext } from 'vue-print-next';

// 日志记录
const logs = ref<string[]>([]);
const clearLogs = () => logs.value = [];

// 添加日志
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push(`${timestamp}: ${message}`);
};

// 基本打印示例 - 使用所有回调函数
function handlePrintWithCallbacks() {
  clearLogs();
  addLog('开始打印流程');
  
  new VuePrintNext({
    el: '#callback-content',
    preview: true,
    previewTitle: '回调函数演示',
    // 预览框架 iframe 加载前的回调
    previewBeforeOpenCallback: () => {
      addLog('previewBeforeOpenCallback: 预览框架 iframe 加载前');
    },
    // 预览框架 iframe 加载完成后的回调
    previewOpenCallback: () => {
      addLog('previewOpenCallback: 预览框架 iframe 加载完成');
    },
    // 打印窗口打开前的回调
    beforeOpenCallback: () => {
      addLog('beforeOpenCallback: 打印窗口打开前');
    },
    // 打印窗口打开时的回调
    openCallback: () => {
      addLog('openCallback: 打印窗口打开');
    },
    // 打印窗口关闭时的回调
    closeCallback: () => {
      addLog('closeCallback: 打印窗口关闭');
    }
  });
}

// 使用回调函数修改打印内容示例
function handlePrintWithContentModification() {
  clearLogs();
  addLog('开始打印流程 - 内容修改示例');
  
  // 获取当前时间
  const currentTime = new Date().toLocaleString();
  
  new VuePrintNext({
    el: '#callback-content',
    preview: true,
    previewTitle: '回调函数内容修改示例',
    // 预览框架 iframe 加载前的回调 - 修改打印内容
    previewBeforeOpenCallback: () => {
      addLog('previewBeforeOpenCallback: 准备修改打印内容');
      
      // 添加打印时间戳
      const timestampElement = document.createElement('div');
      timestampElement.className = 'print-timestamp';
      timestampElement.innerHTML = `<strong>打印时间：${currentTime}</strong>`;
      
      // 将时间戳添加到打印内容中
      const contentElement = document.getElementById('callback-content');
      if (contentElement) {
        contentElement.appendChild(timestampElement);
        addLog('已添加打印时间戳到内容中');
      }
    },
    // 打印完成后的回调 - 清理添加的内容
    closeCallback: () => {
      addLog('closeCallback: 打印完成，清理添加的内容');
      
      // 移除之前添加的时间戳
      const timestampElement = document.querySelector('.print-timestamp');
      if (timestampElement) {
        timestampElement.remove();
        addLog('已移除打印时间戳');
      }
    }
  });
}
</script>

<template>
  <div class="print-callbacks-container">
    <h2>打印回调函数示例</h2>
    
    <div class="content-and-logs">
      <div id="callback-content" class="print-content">
        <h3>VuePrintNext 回调函数演示</h3>
        <p>VuePrintNext 提供了多个回调函数，可以在打印流程的不同阶段执行自定义逻辑。</p>
        
        <div class="callback-info">
          <h4>可用的回调函数</h4>
          <ul>
            <li><code>previewBeforeOpenCallback</code>：预览框架 iframe 加载前的回调</li>
            <li><code>previewOpenCallback</code>：预览框架 iframe 加载完成后的回调</li>
            <li><code>beforeOpenCallback</code>：打印窗口打开前的回调</li>
            <li><code>openCallback</code>：打印窗口打开时的回调</li>
            <li><code>closeCallback</code>：打印窗口关闭时的回调</li>
          </ul>
        </div>
        
        <div class="callback-usage">
          <h4>回调函数的应用场景</h4>
          <ol>
            <li>在打印前动态修改打印内容</li>
            <li>在打印前添加水印或页眉页脚</li>
            <li>在打印完成后恢复页面状态</li>
            <li>记录打印操作的日志</li>
            <li>在打印过程中显示加载状态或提示信息</li>
          </ol>
        </div>
      </div>
      
      <div class="logs-panel">
        <div class="logs-header">
          <h4>回调函数执行日志</h4>
          <button @click="clearLogs" class="clear-logs-btn">清除日志</button>
        </div>
        <div class="logs-content">
          <div v-if="logs.length === 0" class="no-logs">暂无日志记录，请点击下方按钮开始打印</div>
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="button-container">
      <button @click="handlePrintWithCallbacks" class="print-button">
        打印并观察回调函数执行
      </button>
      <button @click="handlePrintWithContentModification" class="print-button content-mod">
        使用回调函数修改打印内容
      </button>
    </div>
  </div>
</template>

<style scoped>
.print-callbacks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background-color: var(--bg-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.content-and-logs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.print-content {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  background-color: var(--bg-white);
  box-shadow: var(--shadow-sm);
}

.callback-info, .callback-usage {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-sm);
}

.logs-panel {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-sm);
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-light);
  border-bottom: 1px solid var(--border-color);
}

.logs-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.clear-logs-btn {
  padding: 4px 8px;
  background-image: var(--danger-gradient);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.logs-content {
  padding: 15px;
  overflow-y: auto;
  flex-grow: 1;
  background-color: #fafafa;
  height: 300px;
}

.no-logs {
  color: #999;
  font-style: italic;
  text-align: center;
  margin-top: 20px;
}

.log-item {
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
  font-family: monospace;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.button-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}

.print-button {
  padding: 12px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.print-button:hover {
  background-color: #40a9ff;
}

.print-button.content-mod {
  background-color: #52c41a;
}

.print-button.content-mod:hover {
  background-color: #73d13d;
}

.print-timestamp {
  margin-top: 20px;
  padding: 10px;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  text-align: center;
}

code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  color: #d56161;
}
</style>