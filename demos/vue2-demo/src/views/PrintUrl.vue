<script>
export default {
  data() {
    return {
      /**
       * url: 跨域时无法进行打印
       */
      printOps: {
        url: '/print-basic2',
        preview: true,
        openCallback(){
          console.log('打印之前')
        },
        closeCallback(){
          console.log('打印之后')
        }
      }
    }
  }
}
</script>

<template>
  <div>
    <h3>打印指定 URL 中的内容</h3>
    <p>打印地址： <a href="/print-form">/print-form</a></p>
    <button v-print="printOps">打印</button>
  </div>
</template>

<style>

</style>
