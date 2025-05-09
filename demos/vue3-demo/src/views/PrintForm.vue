<script setup lang="ts">
import { vPrint } from 'vue-print-next';

import PrintPageLayout from '../components/PrintPageLayout.vue';

const printOps = {
  el: 'form',
};
</script>

<template>
  <PrintPageLayout
    title="表单打印示例"
    description="本示例展示了如何使用 vue-print-next 打印表单内容，支持各种表单元素的打印"
  >
    <template #help-text>
      <div class="help-text">
        <i class="tip-icon">💡</i>
        提示：点击下方按钮可以打印右侧的表单内容，包括所有表单元素。
      </div>
    </template>

    <template #buttons>
      <button v-print="printOps" class="print-btn primary">
        <span class="btn-icon">🖨️</span> 打印表单
      </button>
    </template>

    <form>
      <h3 class="form-title">用户信息表单</h3>

      <div class="form-item">
        <label for="name">姓名:</label>
        <input
          type="text"
          id="name"
          name="user_name"
          class="text-input"
          placeholder="请输入姓名"
        />
      </div>

      <div class="form-item">
        <label for="mail">邮箱:</label>
        <input
          type="email"
          id="mail"
          name="user_email"
          placeholder="请输入邮箱"
        />
      </div>

      <div class="form-item">
        <label for="sex">性别:</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" id="sex-male" name="sex" /> 男
          </label>
          <label class="radio-label">
            <input type="radio" id="sex-female" name="sex" checked /> 女
          </label>
        </div>
      </div>

      <div class="form-item">
        <label for="select">选择:</label>
        <select name="select" id="select">
          <optgroup label="4-legged pets">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster" disabled>Hamster</option>
          </optgroup>
          <optgroup label="Flying pets">
            <option value="parrot">Parrot</option>
            <option value="macaw">Macaw</option>
            <option value="albatross">Albatross</option>
          </optgroup>
        </select>
      </div>

      <div class="form-item">
        <label for="msg">消息:</label>
        <textarea
          id="msg"
          name="user_message"
          placeholder="请输入消息内容"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="print-btn secondary" style="width: 120px">
          提交表单
        </button>
      </div>
    </form>
  </PrintPageLayout>
</template>

<style scoped>
/* 表单特定样式 */
form {
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  transition: var(--transition-normal);
}

form:hover {
  box-shadow: var(--shadow-md);
}

.form-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-bottom: var(--spacing-sm);
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-image: var(--primary-gradient);
  border-radius: 3px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

label {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: var(--spacing-md);
  font-weight: 500;
  color: var(--text-secondary);
}

input[type='text'],
input[type='email'],
select,
textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
  font-size: 0.95rem;
}

input[type='text']:focus,
input[type='email']:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
}

.radio-group {
  display: flex;
  gap: var(--spacing-md);
}

.radio-label {
  width: 100px;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: var(--transition-fast);
}

.radio-label:hover {
  color: var(--primary-color);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

/* 响应式设计增强 */
@media (max-width: 768px) {
  form {
    max-width: 100%;
    padding: var(--spacing-md);
  }

  .form-item {
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    width: 100%;
    text-align: left;
    margin-bottom: var(--spacing-xs);
    margin-right: 0;
  }

  input[type='text'],
  input[type='email'],
  select,
  textarea {
    width: 100%;
  }

  .radio-group {
    width: 100%;
    margin-top: var(--spacing-xs);
  }
}
</style>
