<template>
  <div>
    <div id="iframeBox">
      <h3>测试打印 iframe</h3>
      <iframe class="a4-page" src="https://juejin.cn/post/7385784332444893195"></iframe>
    </div>
    <button v-print="{el: '#iframeBox', preview: true}">打印</button>
  </div>
</template>

<style>

</style>
<script setup lang="ts">
</script>
