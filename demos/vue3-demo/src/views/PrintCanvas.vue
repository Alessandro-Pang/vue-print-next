<script setup lang="ts">
import { nextTick, onMounted } from 'vue';

import * as echarts from 'echarts';
import { vPrint } from 'vue-print-next';

const option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    top: 30
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)'
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 402, 231, 134, 190, 230, 120]
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)'
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 302, 181, 234, 210, 290, 150]
    }
  ]
};

onMounted(()=>{
  nextTick(()=>{
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    myChart.setOption(option);
  })
})
</script>

<template>
  <div class="print-container fade-in">
    <h2 class="page-title">Canvas图表打印示例</h2>
    <p class="page-description">本示例展示了如何使用vue-print-next打印基于Canvas的ECharts图表</p>
    
    <div class="card-container">
      <div class="print-options-card">
        <div class="card-header">
          <span class="card-icon">📊</span>
          <h3>图表打印选项</h3>
        </div>
        <div class="card-content">
          <div class="help-text">
            <i class="tip-icon">💡</i> 点击下方按钮将打印右侧的ECharts图表
          </div>
          
          <div class="buttons-group">
            <button v-print="'#main'" class="print-btn primary">
              <span class="btn-icon">🖨️</span> 打印图表
            </button>
          </div>
          
          <div class="chart-info mt-md">
            <h4>Canvas打印说明</h4>
            <p>vue-print-next支持打印Canvas元素，包括：</p>
            <ul>
              <li>ECharts、Highcharts等基于Canvas的图表库</li>
              <li>自定义Canvas绘图</li>
              <li>WebGL内容</li>
            </ul>
            <p class="note">注意：打印时会自动捕获Canvas当前状态</p>
          </div>
        </div>
      </div>
      
      <div class="chart-container print-content">
        <div id="main" class="chart-canvas"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: var(--spacing-lg);
  background-color: var(--bg-white);
}

.chart-canvas {
  width: 100%;
  height: 500px;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.chart-info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-sm);
}

.chart-info h4 {
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.chart-info p {
  margin: var(--spacing-sm) 0;
  color: var(--text-secondary);
}

.chart-info ul {
  padding-left: var(--spacing-lg);
  margin: var(--spacing-sm) 0;
}

.chart-info li {
  text-align: left;
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}

.note {
  font-style: italic;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}
</style>


