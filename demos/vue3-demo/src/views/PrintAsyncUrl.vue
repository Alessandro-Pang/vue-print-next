<script setup lang="ts">
import {vPrint} from "vue-print-next";
import {ref} from "vue";

const loading = ref(false)
function getAsyncUrl() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('/print-form')
      loading.value = false
    }, 3000)
  })
}


const printOps = {
  el: '1',
  asyncUrl: (callback: () => void) => {
    loading.value = true;
    getAsyncUrl().then(callback)
  },
  preview: true
}
</script>

<template>
  <div>
    <button v-print="printOps">打印</button>
    <div v-if="loading">loading...</div>
  </div>
</template>

<style>

</style>
