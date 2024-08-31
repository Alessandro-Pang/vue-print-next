<script setup lang="ts">
import {PrintAreaOption, vPrint} from "vue-print-next";
import {ref} from "vue";

const loading = ref(false)
function getAsyncUrl(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('/#/print-form')
      loading.value = false
    }, 1500)
  })
}


const printOps: PrintAreaOption = {
  asyncUrl: (callback: (url: string) => void): void => {
    loading.value = true;
    getAsyncUrl().then(callback)
  },
  preview: true,
}
</script>

<template>
  <div>
    <h3>打印指定 URL 中的内容</h3>
    <p>打印地址： <a href="/#/print-form">/#/print-form</a></p>
    <button v-print="printOps">打印</button>
    <div v-if="loading">loading...</div>
  </div>
</template>

<style>

</style>
