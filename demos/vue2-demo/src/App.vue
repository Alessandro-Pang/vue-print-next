<template>
  <div>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
    <button v-print>打印</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import {vPrint} from "vue-print-next";

export default {
  name: 'App',
  // directives:{
  //   print: vPrint
  // },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
