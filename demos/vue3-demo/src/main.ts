import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";

// 测试注册全局指令
// import {printPlugin} from "vue-print-next";

const app= createApp(App)

// app.use(printPlugin)
app.use(router);
app.mount('#app')
