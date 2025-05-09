/*
 * @Author: zi.yang
 * @Date: 2024-06-28 16:57:54
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 09:16:46
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/main.ts
 */
import './style.css';
import './assets/shared-styles.css';
import './assets/styles/common.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

// 测试注册全局指令
// import {printPlugin} from "vue-print-next";

const app= createApp(App)

// app.use(printPlugin)
app.use(router);
app.mount('#app')
