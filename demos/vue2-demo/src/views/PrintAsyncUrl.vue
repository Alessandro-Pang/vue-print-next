<script>
export default {
  data(){
    return {
      loading: false,
      printOps: {
        asyncUrl: callback => {
          this.loading = true;
          this.getAsyncUrl().then(callback)
        },
        preview: true,
      }
    }
  },
  methods:{
    getAsyncUrl() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('/print-form')
          this.loading = false
        }, 3000)
      })
    }
  }
}
</script>

<template>
  <div>
    <h3>打印指定 URL 中的内容</h3>
    <p>打印地址： <a href="/print-form">/print-form</a></p>
    <button v-print="printOps">打印</button>
    <div v-if="loading">loading...</div>
  </div>
</template>

<style>

</style>
