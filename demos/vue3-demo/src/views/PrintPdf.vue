<script setup lang="ts">
import {vPrint} from "vue-print-next";

const printOps = {
  url: 'vue3-print.pdf',
  preview: true
}
</script>

<template>
  <div>
    <h3>打印指定 URL 中的内容</h3>
    <object data="vue3-print.pdf" type="application/pdf" width="620" height="600"></object>
    <br>
    目前仅支持预览后打印 PDF
    <br>
    <button v-print="printOps">打印</button>
  </div>
</template>

<style>

</style>
