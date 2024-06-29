<!--
 * @Author: lee
 * @Date: 2021-05-10 16:20:49
 * @LastEditors: lee
 * @LastEditTime: 2021-05-11 14:21:22
 * @Description: file content
-->
<template>
  <div id="printMe" ref="printMe">
    <img alt="Vue logo" src="../assets/logo.png"/>
    <h1 class="no-print">{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <p class="no-print">Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
    <p class="no-print">Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  </div>
  <button v-print="printSetting" style="margin-right: 10px;">指令打印</button>
  <button @click="handlePrint">方法打印</button>
  <div v-show="pringLoading"> loading....</div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {VuePrintNext} from "../print";
import {vPrint} from "../print";
import {PrintAreaOption} from "../../types";

defineProps({
  msg: String
})
const pringLoading = ref(false)
const count = ref(0)
const printSetting: PrintAreaOption = {
  el: '#printMe',
  noPrintSelector: '.no-print',
  beforeOpenCallback() {
    pringLoading.value = true
  },
  openCallback() {
  },
  closeCallback() {
    pringLoading.value = false
  }
}

const printMe = ref(null)
function handlePrint() {
  if (!printMe.value) return
  new VuePrintNext({...printSetting, el: 'p'})
}
</script>
