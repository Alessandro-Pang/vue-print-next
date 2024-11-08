<script setup lang="ts">
//@ts-nocheck
import {vPrint} from "vue-print-next";

// 初始化地图资源
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = '//api.map.baidu.com/api?type=webgl&v=1.0&ak=FZdMpaFrnR92K0M4p90cco4PYdMMkkwR&callback=init';
document.body.appendChild(script);

/**
 * init Baidu Map
 *
 * 如果涉及到各类地图，需要重写 canvas.getContext 函数，
 * 设置 webgl 默认 preserveDrawingBuffer 参数为 true
 * 如果不设置，则会导致打印出来的是空白。
 */
window.init = () => {
  // 重写 getContext 方法
  HTMLCanvasElement.prototype.getContext = (function (origFn) {
    return function (type, attributes) {
      if (type === "webgl") {
        attributes = Object.assign({}, attributes, {
          preserveDrawingBuffer: true,
        });
      }
      return origFn.call(this, type, attributes);
    };
  })(HTMLCanvasElement.prototype.getContext);

  // 初始化地图
  const map = new window.BMapGL.Map('container');
  const point = new window.BMapGL.Point(116.404, 39.915);
  map.centerAndZoom(point, 10);
  map.enableScrollWheelZoom();
}
</script>

<template>
  <div style="height: 80vh">
    <div id="container"></div>
    <div class="mt-m">
      <br/>
      <button class="print-btn" v-print="'#container'">指令打印</button>
    </div>
  </div>
</template>

<style scoped>
#container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
