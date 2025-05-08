<script setup lang="ts">
import { vPrint, VuePrintNext } from 'vue-print-next';

type TableHeadItem = {
  label: string;
  prop: string;
  width: string;
  align: 'center' | 'left' | 'right'
}

const tableHead: TableHeadItem[] = [
  {label: 'id', prop: 'id', width: '100px', align: 'center'},
  {label: '姓名', prop: 'name', width: '100px', align: 'center'},
  {label: '性别', prop: 'sex', width: '100px', align: 'center'},
  {label: '年龄', prop: 'age', width: '100px', align: 'center'},
  {label: '身高', prop: 'height', width: '100px', align: 'center'},
  {label: '体重', prop: 'weight', width: '100px', align: 'center'},
]

type TableDataItem = {
  id: number,
  name: string,
  sex: string,
  age: number,
  height: number,
  weight: number,
  [key: string]: any;
}
const tableData: TableDataItem[] = []

for (let i = 0; i < 1000; i++) {
  tableData.push({
    id: i + 1,
    name: `Alex.${Math.random().toString(32).slice(2, 8)}`,
    sex: Math.random() < 0.5 ? '男' : '女',
    age: Number.parseInt((Math.random() * 100).toString()),
    height: Number.parseInt((Math.random() * 100).toString()),
    weight: Number.parseInt((Math.random() * 100).toString())
  })
}

function handleBasicPrint() {
  new VuePrintNext({el: 'table', defaultScale: 0.8, preview: true })
}
</script>

<template>
  <div id="print-el" style="margin: 0 auto; height: 700px; overflow-y: auto">
    <table border>
      <caption>
        <h3>打印表格示例</h3>
      </caption>
      <thead>
        <tr>
          <th v-for="(item, index) in tableHead" :key="index" :style="{width: item.width, textAlign: item.align}">
            {{ item.label }}
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData" :key="index">
        <td v-for="(head, idx) in tableHead" :key="idx" :style="{'textAlign': head.align}">{{item[head.prop] || '' }}</td>
      </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">总计：{{ tableData.length }} 条</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div style="margin-top: 10px">
    Firefox 打印时 table 边框会显示不完整，需要将边框设置为 2px 就可以了
  </div>

  <div class="mt-m">
    <br/>
    <button class="print-btn" v-print>全屏打印</button>
    <button class="print-btn" v-print="'table'">指令打印</button>
    <button class="print-btn" @click="handleBasicPrint">方法打印</button>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

.print-btn {
  margin: 0 12px
}
</style>
