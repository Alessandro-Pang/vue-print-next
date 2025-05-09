<!--
 * @Author: zi.yang
 * @Date: 2025-05-08 21:58:25
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 12:18:59
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/views/PrintTable.vue
-->
<script setup lang="ts">
import { ref } from 'vue';

import { vPrint, VuePrintNext } from 'vue-print-next';

type TableHeadItem = {
  label: string;
  prop: string;
  width: string;
  align: 'center' | 'left' | 'right'
}

const tableHead: TableHeadItem[] = [
  {label: 'id', prop: 'id', width: '100px', align: 'center'},
  {label: '姓名', prop: 'name', width: '100px', align: 'center'},
  {label: '性别', prop: 'sex', width: '100px', align: 'center'},
  {label: '年龄', prop: 'age', width: '100px', align: 'center'},
  {label: '身高', prop: 'height', width: '100px', align: 'center'},
  {label: '体重', prop: 'weight', width: '100px', align: 'center'},
]

type TableDataItem = {
  id: number,
  name: string,
  sex: string,
  age: number,
  height: number,
  weight: number,
  [key: string]: any;
}
const tableData: TableDataItem[] = []

for (let i = 0; i < 1000; i++) {
  tableData.push({
    id: i + 1,
    name: `Alex.${Math.random().toString(32).slice(2, 8)}`,
    sex: Math.random() < 0.5 ? '男' : '女',
    age: Number.parseInt((Math.random() * 100).toString()),
    height: Number.parseInt((Math.random() * 100).toString()),
    weight: Number.parseInt((Math.random() * 100).toString())
  })
}

// 打印状态
const isPrinting = ref(false);

// 打印方法
function handleBasicPrint() {
  isPrinting.value = true;
  
  // 模拟打印准备过程
  setTimeout(() => {
    new VuePrintNext({
      el: 'table', 
      defaultScale: 0.8, 
      preview: true,
      previewTitle: '表格打印预览'
    });
    
    // 打印完成后重置状态
    setTimeout(() => {
      isPrinting.value = false;
    }, 500);
  }, 300);
}
</script>

<template>
  <div class="print-container fade-in">
    <div class="header-section">
      <h2 class="page-title">打印表格示例</h2>
      <p class="page-description">本示例展示了如何使用 vue-print-next 打印表格数据，支持多种打印方式</p>
    </div>
    
    <div class="card-container">
      <div class="print-options-card">
        <div class="card-header">
          <span class="card-icon">⚙️</span>
          <h3>打印选项</h3>
        </div>
        <div class="card-content">
          <div class="help-text">
            <i class="tip-icon">💡</i> 提示：Firefox 打印时 table 边框会显示不完整，需要将边框设置为 2px 就可以解决。
          </div>
          
          <div class="buttons-group">
            <button class="print-btn" v-print :disabled="isPrinting">
              <span class="btn-icon">🖨️</span> 全屏打印
            </button>
            <button class="print-btn primary" v-print="'table'" :disabled="isPrinting">
              <span class="btn-icon">📄</span> 指令打印
            </button>
            <button class="print-btn secondary" @click="handleBasicPrint" :disabled="isPrinting">
              <span class="btn-icon" v-if="!isPrinting">⚙️</span>
              <span class="btn-icon loading" v-else>⏳</span>
              {{ isPrinting ? '准备打印...' : '方法打印' }}
            </button>
          </div>
        </div>
      </div>
      
      <div id="print-el" class="print-content">
        <div class="table-header">
          <h3>数据表格</h3>
          <span class="record-count">共 {{ tableData.length }} 条记录</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="table">
            <thead>
              <tr>
                <th v-for="(item, index) in tableHead" :key="index" :style="{width: item.width, textAlign: item.align}">
                  {{ item.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index" class="table-row" :class="{'row-even': index % 2 === 0}">
                <td v-for="(head, idx) in tableHead" :key="idx" :style="{'textAlign': head.align}">{{item[head.prop] || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="print-status" v-if="isPrinting">
      <div class="status-icon"><span class="loading-icon">⏳</span></div>
      <div class="status-text">正在准备打印...</div>
    </div>
  </div>
</template>

<style scoped>
/* 表格特定样式 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.record-count {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.table-container {
  height: 600px;
  overflow-x: auto;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
}

/* 打印选项卡片 */
.print-options-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  padding: var(--spacing-md);
  transition: var(--transition-normal);
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.card-icon {
  margin-right: var(--spacing-sm);
  font-size: 1.2rem;
}

.card-content {
  padding: var(--spacing-sm) 0;
}

/* 打印状态指示器 */
.print-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.status-icon {
  margin-right: var(--spacing-md);
}

.loading-icon {
  display: inline-block;
  animation: spin 1.5s infinite linear;
  font-size: 1.5rem;
}

.status-text {
  font-weight: 500;
  color: var(--text-primary);
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 响应式布局增强 */
@media (max-width: 768px) {
  .data-table {
    font-size: 0.85rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 4px;
  }
  
  .print-status {
    bottom: 10px;
    right: 10px;
    left: 10px;
    justify-content: center;
  }
}
</style>
