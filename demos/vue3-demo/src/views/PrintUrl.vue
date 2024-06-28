<script setup lang="ts">
import {vPrint} from "vue-print-next";

/**
 * bug: 打印 url 时，el 仍然必传
 *
 * url: 跨域时无法进行打印
 */
const printOps = {
  el: '1',
  url: '/print-form',
  preview: true
}
</script>

<template>
  <div>
    <button v-print="printOps">打印</button>
  </div>
</template>

<style>

</style>
