<script setup lang="ts">
// 统一布局组件，用于包装所有打印示例页面
import { defineProps } from 'vue';

const props = defineProps({
  // 页面标题
  title: {
    type: String,
    required: true
  },
  // 页面描述
  description: {
    type: String,
    default: ''
  },
  // 是否显示打印选项卡片
  showOptions: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="print-container fade-in">
    <!-- 页面头部区域 -->
    <div class="header-section">
      <h2 class="page-title">{{ title }}</h2>
      <p v-if="description" class="page-description">{{ description }}</p>
    </div>
    
    <!-- 内容区域 -->
    <div class="card-container">
      <!-- 打印选项卡片 -->
      <div v-if="showOptions" class="print-options-card">
        <div class="card-header">
          <span class="card-icon">⚙️</span>
          <h3>打印选项</h3>
        </div>
        <div class="card-content">
          <slot name="card-before""></slot>

          <!-- 提示信息插槽 -->
          <slot name="help-text">
            <div class="help-text">
              <i class="tip-icon">💡</i> 提示：点击下方按钮可以尝试不同的打印方式。
            </div>
          </slot>
          
          <!-- 按钮组插槽 -->
          <div class="buttons-group">
            <slot name="buttons"></slot>
          </div>

          <slot name="card-after"></slot>
        </div>
      </div>
      
      <!-- 打印内容插槽 -->
      <div class="print-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定样式，其他样式由全局CSS提供 */
.header-section {
  margin-bottom: var(--spacing-lg);
  text-align: left;
}

/* 确保打印内容区域样式一致 */
.print-content {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  width: 100%;
}

/* 打印选项卡片样式 */
.print-options-card {
  width: 350px;
  flex-shrink: 0;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  margin-right: var(--spacing-md);
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
  }
  
  .print-options-card {
    width: 100%;
    margin-right: 0;
    margin-bottom: var(--spacing-lg);
  }
}

/* 打印媒体查询 - 确保在打印时隐藏选项卡片 */
@media print {
  .print-options-card {
    display: none !important;
  }
  
  .print-content {
    box-shadow: none !important;
    padding: 0 !important;
  }
}
</style>