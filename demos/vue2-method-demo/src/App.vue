<template>
  <div>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
    <button @click="handleClickPrint1">调用方法打印1</button>
    <button @click="handleClickPrint2">调用方法打印2</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {VuePrintNext} from "vue-print-next";

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods:{
    handleClickPrint1(){
      new VuePrintNext({id: '#app'})
    },
    handleClickPrint2(){
      new VuePrintNext({
        id: '#app',
        preview: true
      })
    }
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
