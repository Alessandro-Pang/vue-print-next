<template>
  <div>
    <div class="printable" id="print">
      <h1>葫芦娃</h1>
      <p>葫芦娃 葫芦娃</p>
      <p>一根藤上七朵花</p>
      <p>风吹雨打都不怕 </p>
      <p>啦啦啦啦</p>
      <p>叮当当咚咚当当 葫芦娃</p>
      <p>叮当当咚咚当当 本领大</p>
      <p>啦啦啦啦</p>
    </div>
    <div>
      <button v-print="{el: '#print'}">打印内容</button>
    </div>
  </div>
</template>

<style scoped>
.printable {
  border: 1px solid #000;
  padding: 20px;
  margin: 20px;
  background-color: antiquewhite;
}

p:nth-child(odd) {
  background-color: #ccc;
}

p:nth-child(even) {
  background-color: #229f99
}
</style>
<script setup lang="ts">
</script>
