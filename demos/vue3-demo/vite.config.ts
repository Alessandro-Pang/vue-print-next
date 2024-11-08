import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((conf) => {
  const isProd = conf.mode === 'production';
  return {
    base: isProd ? '/vue-print-next/vue3-demo' :'/',
    plugins: [vue()],
  }
})
