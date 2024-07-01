<template>
  <div>
    <div id="print-el" style="margin: 0 auto;">
      <div>
        <a target="_blank">
          <img src="../assets/logo.png" class="logo vue" alt="Vue logo"/>
        </a>
      </div>

      <h1>测试基本打印功能</h1>

      <div class="card">
        <button type="button" @click="count++">count is {{ count }}</button>
        <p>
          Edit
          <code>components/HelloWorld.vue</code> to test HMR
        </p>
      </div>

      <p>
        Check out
        <a target="_blank">create-vue</a>, the official Vue + Vite starter
      </p>
      <p>
        Learn more about IDE Support for Vue in the
        <a target="_blank">Vue Docs Scaling up Guide</a>.
      </p>
      <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
    </div>
    <div class="mt-m">
      <br/>
      <button class="print-btn" v-print>全屏打印</button>
      <button class="print-btn" v-print="'#print-el'">指令打印</button>
      <button class="print-btn" @click="handleBasicPrint">方法打印</button>
      <button class="print-btn" v-print="printOps">打印忽略 img 标签</button>
    </div>
  </div>
</template>
<script>
import {VuePrintNext} from "vue-print-next";

export default {
  data(){
    return {
      count: 0,
      printOps: {
        el: '#print-el',
        // 打印忽略 img
        noPrintSelector: ['img']
      }
    }
  },
  methods:{
    handleBasicPrint() {
      new VuePrintNext({el: '#print-el'})
    }
  }
}
</script>
<style scoped>
.logo {
  height: 180px;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.read-the-docs {
  color: #888;
}

.print-btn {
  margin: 0 12px
}
</style>
