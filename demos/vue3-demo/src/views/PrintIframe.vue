<script setup lang="ts">
import {vPrint} from "vue-print-next";

const printOps = {
  el: '#iframeBox',
  preview: true
}
</script>

<template>
  <div id="iframeBox">
    <h3>测试打印 iframe</h3>
    <iframe class="a4-page" src="https://juejin.cn/post/7385784332444893195"></iframe>
  </div>
  <button v-print="printOps">打印</button>
</template>

<style>

</style>
