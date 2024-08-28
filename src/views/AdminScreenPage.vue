<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <!-- 第一列 -->
      <a-col :span="6">
        <!-- 电力产业 -->
        <a-card title="电力产业" class="card full-height">
          <a-row :gutter="16">
            <a-col :span="12" v-for="(gauge, index) in gauges" :key="index">
              <div class="data-title">{{ gauge.title }}</div>
              <div class="unit-text">{{ gauge.unit }}</div>
              <div :ref="el => { if (el) chartRefs[index] = el }" class="chart"></div>
            </a-col>
          </a-row>
          <a-row :gutter="8" class="mt-8">
            <a-col :span="12" v-for="(item, index) in powerIndustryData" :key="index">
              <div class="data-box small">
                <div class="data-title">{{ item.title }}</div>
                <div class="data-value">{{ item.value }}</div>
              </div>
            </a-col>
          </a-row>
          <div class="table-container mt-8">
            <a-table :columns="tableColumns" :data-source="tableData" :pagination="false" size="small" />
          </div>
        </a-card>
      </a-col>

      <!-- 第二列 -->
      <a-col :span="8">
        <!-- 数据一览 -->
        <a-card title="煤炭产业数据" class="card mb-16">
          <a-row :gutter="[16, 16]" class="data-overview">
            <a-col :span="24" v-for="(box, index) in dataBoxes" :key="index">
              <div class="data-item">
                <span class="data-label">{{ box.title }}</span>
                <span class="data-value">{{ box.value }}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>

        <!-- 产业布局 -->
        <a-card title="产业布局" class="card layout-card">
          <img src="../assets/chanye.png" alt="产业布局" class="layout-image">
        </a-card>
      </a-col>

      <!-- 第三列 -->
      <a-col :span="5">
        <!-- 煤炭产业 -->
        <a-card title="煤炭产业" class="card mb-16">
          <div class="unit">单位：万吨</div>
          <div class="data-boxes">
            <div v-for="(item, index) in coalIndustryData" :key="index" class="data-box">
              <div :class="['value', item.valueClass]">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>
          <div :ref="el => { if (el) chartRefs[2] = el }" class="chart"></div>
        </a-card>

        <!-- 煤化工产业 -->
        <a-card title="煤化工产业" class="card">
          <div class="unit">单位：亿标立方</div>
          <div class="data-boxes">
            <div v-for="(item, index) in chemicalIndustryData" :key="index" class="data-box">
              <div :class="['value', item.valueClass]">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>
          <div :ref="el => { if (el) chartRefs[3] = el }" class="chart"></div>
        </a-card>
      </a-col>

      <!-- 第四列 -->
      <a-col :span="5">
        <!-- 天然气产业 -->
        <a-card title="天然气产业" class="card natural-gas">
          <!-- Gas Supply -->
          <div class="sub-section">
            <h4>天然气供应</h4>
            <div class="unit">单位：亿标立方</div>
            <div :ref="el => { if (el) chartRefs[4] = el }" class="chart"></div>
            <div class="data-boxes">
              <div v-for="(item, index) in gasSupplyData" :key="index" class="data-box">
                <div :class="['value', item.valueClass]">{{ item.value }}</div>
                <div class="label">{{ item.label }}</div>
              </div>
            </div>
          </div>

          <!-- Coal Chemical Industry -->
          <div class="sub-section">
            <h4>煤化工产业</h4>
            <div class="unit">单位：亿标立方</div>
            <div :ref="el => { if (el) chartRefs[5] = el }" class="chart"></div>
            <div class="data-boxes">
              <div v-for="(item, index) in coalChemicalData" :key="index" class="data-box">
                <div :class="['value', item.valueClass]">{{ item.value }}</div>
                <div class="label">{{ item.label }}</div>
              </div>
            </div>
          </div>

          <!-- City Gas Business -->
          <div class="sub-section">
            <h4>城市燃气业务</h4>
            <div class="unit">单位：亿标立方</div>
            <div :ref="el => { if (el) chartRefs[6] = el }" class="chart"></div>
            <div class="data-boxes">
              <div v-for="(item, index) in cityGasData" :key="index" class="data-box">
                <div :class="['value', item.valueClass]">{{ item.value }}</div>
                <div class="label">{{ item.label }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from "echarts";

export default {
  name: "HomePage",
  setup() {
    const chartRefs = ref([]);
    const charts = ref([]);

    const gauges = [
      { title: "发电量", value: 64.34, unit: "单位：亿千瓦时" },
      { title: "供热量", value: 76.32, unit: "单位：万吨" },
    ];

    const dataBoxes = [
      { title: "装机容量", value: "44667 兆瓦" },
      { title: "权益容量", value: "30469 兆瓦" },
      { title: "船舶总运力", value: "153 万吨" },
      { title: "港口吞吐能力", value: "3,000 万吨" },
      { title: "当前库存", value: "613.78 万吨" },
      { title: "昨日耗煤量", value: "26.08 万吨" },
      { title: "城市燃气管网长度", value: "10273 公里" },
      { title: "煤化工产能", value: "20 亿标方" },
    ];

    const powerIndustryData = [
      { title: "年累计发电量", value: "1,270.77" },
      { title: "年计划发电量", value: "1,937.12" },
      { title: "年累计供热量", value: "2,442.14" },
      { title: "年计划供热量", value: "3,200" },
    ];

    const tableColumns = [
      { title: "类型", dataIndex: "type", key: "type" },
      { title: "装机容量(兆瓦)", dataIndex: "capacity", key: "capacity" },
      { title: "年发电量(亿千瓦时)", dataIndex: "generation", key: "generation" },
      { title: "占比", dataIndex: "percentage", key: "percentage" },
    ];

    const tableData = [
      { type: "煤机", capacity: "32025.00", generation: "1119.92", percentage: "88.13%" },
      { type: "燃机", capacity: "4987.33", generation: "41.85", percentage: "3.29%" },
      { type: "光伏", capacity: "3098.96", generation: "23.49", percentage: "1.85%" },
      { type: "风电", capacity: "2489.75", generation: "37.07", percentage: "2.92%" },
      { type: "水电", capacity: "1194.16", generation: "20.79", percentage: "1.64%" },
      { type: "垃圾", capacity: "737.00", generation: "24.71", percentage: "1.94%" },
      { type: "污泥", capacity: "75.00", generation: "0.95", percentage: "0.07%" },
      { type: "生物质", capacity: "60.00", generation: "1.99", percentage: "0.16%" },
    ];

    const coalIndustryData = [
      { value: "57.99%", label: "完成率" },
      { value: "-3.7%", label: "同比增长", valueClass: "negative" },
    ];

    const chemicalIndustryData = [
      { value: "72.26%", label: "完成率" },
      { value: "-5.63%", label: "同比增长", valueClass: "negative" },
    ];

    const gasSupplyData = [
      { value: "67.00%", label: "完成率" },
      { value: "11.92%", label: "同比增长", valueClass: "positive" },
    ];

    const coalChemicalData = [
      { value: "72.00%", label: "完成率" },
      { value: "-5.20%", label: "同比增长", valueClass: "negative" },
    ];

    const cityGasData = [
      { value: "56.00%", label: "完成率" },
      { value: "6.87%", label: "同比增长", valueClass: "positive" },
    ];

    const initCharts = () => {
      const chartTheme = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        textStyle: { color: '#ffffff' },
        title: { textStyle: { color: '#ffffff' } },
        line: {
          itemStyle: { borderWidth: 1 },
          lineStyle: { width: 2 },
          symbolSize: 4,
          symbol: 'circle',
          smooth: false
        },
        radar: {
          itemStyle: { borderWidth: 1 },
          lineStyle: { width: 2 },
          symbolSize: 4,
          symbol: 'circle',
          smooth: false
        },
        bar: { itemStyle: { barBorderWidth: 0, barBorderColor: '#ccc' } },
        pie: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        scatter: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        boxplot: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        parallel: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        sankey: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        funnel: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        gauge: { itemStyle: { borderWidth: 0, borderColor: '#ccc' } },
        candlestick: {
          itemStyle: {
            color: '#fd1050',
            color0: '#0cf49b',
            borderColor: '#fd1050',
            borderColor0: '#0cf49b',
            borderWidth: 1
          }
        },
        graph: {
          itemStyle: { borderWidth: 0, borderColor: '#ccc' },
          lineStyle: { width: 1, color: '#aaa' },
          symbolSize: 4,
          symbol: 'circle',
          smooth: false,
          color: [
            '#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53',
            '#eedd78','#73a373','#73b9bc','#7289ab','#91ca8c','#f49f42'
          ],
          label: { color: '#ffffff' }
        },
        map: {
          itemStyle: {
            normal: { areaColor: '#eee', borderColor: '#444', borderWidth: 0.5 },
            emphasis: { areaColor: 'rgba(255,215,0,0.8)', borderColor: '#444', borderWidth: 1 }
          },
          label: {
            normal: { textStyle: { color: '#000' } },
            emphasis: { textStyle: { color: 'rgb(100,0,0)' } }
          }
        },
        geo: {
          itemStyle: {
            normal: { areaColor: '#eee', borderColor: '#444', borderWidth: 0.5 },
            emphasis: { areaColor: 'rgba(255,215,0,0.8)', borderColor: '#444', borderWidth: 1 }
          },
          label: {
            normal: { textStyle: { color: '#000' } },
            emphasis: { textStyle: { color: 'rgb(100,0,0)' } }
          }
        },
        categoryAxis: {
          axisLine: { show: true, lineStyle: { color: '#6E7079' } },
          axisTick: { show: true, lineStyle: { color: '#6E7079' } },
          axisLabel: { show: true, textStyle: { color: '#ffffff' } },
          splitLine: { show: false, lineStyle: { color: ['#E0E6F1'] } },
          splitArea: { show: false, areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(210,219,238,0.2)'] } }
        },
        valueAxis: {
          axisLine: { show: false, lineStyle: { color: '#6E7079' } },
          axisTick: { show: false, lineStyle: { color: '#6E7079' } },
          axisLabel: { show: true, textStyle: { color: '#ffffff' } },
          splitLine: { show: true, lineStyle: { color: ['#E0E6F1'] } },
          splitArea: { show: false, areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(210,219,238,0.2)'] } }
        },
        timeline: {
          lineStyle: { color: '#DAE1F5', width: 2 },
          itemStyle: {
            normal: { color: '#A4B1D7', borderWidth: 1 },
            emphasis: { color: '#FFF' }
          },
          controlStyle: {
            normal: { color: '#A4B1D7', borderColor: '#A4B1D7', borderWidth: 1 },
            emphasis: { color: '#A4B1D7', borderColor: '#A4B1D7', borderWidth: 1 }
          },
          checkpointStyle: { color: '#316bf3', borderColor: 'fff' },
          label: {
            normal: { textStyle: { color: '#A4B1D7' } },
            emphasis: { textStyle: { color: '#A4B1D7' } }
          }
        },
        visualMap: { color: ['#bf444c', '#d88273', '#f6efa6'] },
        dataZoom: { handleSize: 'undefined%', textStyle: {} },
        markPoint: {
          label: { color: '#ffffff' },
          emphasis: { label: { color: '#ffffff' } }
        }
      };

      echarts.registerTheme('darkBlue', chartTheme);

      charts.value = [
        initGaugeChart(chartRefs.value[0], gauges[0].value),
        initGaugeChart(chartRefs.value[1], gauges[1].value),
        initBarChart(chartRefs.value[2], [
          { name: '年计划供煤量', value: 6600.00 },
          { name: '7月底年累计供煤量', value: 3827.17 }
        ], ['#4da8ff', '#69f0ae']),
        initBarChart(chartRefs.value[3], [
          { name: '年计划产气量', value: 19.20 },
          { name: '年累计产气量', value: 13.87 }
        ], ['#4da8ff', '#69f0ae']),
        initBarChart(chartRefs.value[4], [
          { name: '年计划供气量', value: 110.00 },
          { name: '年累计供气量', value: 73.73 }
        ], ['#4da8ff', '#69f0ae']),
        initBarChart(chartRefs.value[5], [
          { name: '年计划产气量', value: 19.20 },
          { name: '年累计产气量', value: 13.94 }
        ], ['#4da8ff', '#69f0ae']),
        initBarChart(chartRefs.value[6], [
          { name: '年计划售气量', value: 17.20 },
          { name: '年累计售气量', value: 9.64 }
        ], ['#4da8ff', '#69f0ae']),
      ];
    };

    const initGaugeChart = (element, value) => {
  const chart = echarts.init(element, 'darkBlue');
  const option = {
    series: [{
      type: "gauge",
      progress: { 
        show: true, 
        width: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#4da8ff' },
            { offset: 1, color: '#00c6ff' }
          ])
        }
      },
      axisLine: { 
        lineStyle: { 
          width: 18, 
          color: [[1, 'rgba(255,255,255,0.1)']]
        } 
      },
      axisTick: { 
        show: true, 
        lineStyle: {
          color: '#4da8ff',
          width: 1
        },
        length: 8 
      },
      splitLine: { 
        show: false 
      },
      axisLabel: { 
        show: false 
      },
      pointer: { 
        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z', 
        length: '75%', 
        width: 14, 
        offsetCenter: [0, '5%'],
        itemStyle: {
          color: '#00c6ff'
        }
      },
      anchor: { 
        show: true, 
        showAbove: true, 
        size: 12, 
        itemStyle: { 
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: '#4da8ff' },
            { offset: 0.5, color: '#00c6ff' }
          ])
        } 
      },
      detail: {
        fontSize: 14,
        offsetCenter: [0, '70%'],
        valueAnimation: true,
        formatter: function (value) {
          return value.toFixed(2) + '%';
        },
        color: '#00c6ff'
      },
      data: [{ value: value, name: '' }],
      title: { 
        fontSize: 16, 
        color: '#00c6ff',
        offsetCenter: [0, '85%']
      },
      color: '#00c6ff'
    }]
  };
  chart.setOption(option);
  return chart;
};


    const initBarChart = (element, data, color) => {
      const chart = echarts.init(element, 'darkBlue');
      chart.setOption({
        color: color,
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: { interval: 0, rotate: 0 },
        },
        yAxis: { type: 'value' },
        series: [{
          data: data.map(item => item.value),
          type: 'bar',
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#ffffff'
          }
        }],
        grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
      });
      return chart;
    };

    const handleResize = () => {
      charts.value.forEach(chart => chart.resize());
    };

    onMounted(() => {
      nextTick(() => {
        initCharts();
        window.addEventListener('resize', handleResize);
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      charts.value.forEach(chart => chart.dispose());
    });

    return {
      chartRefs,
      gauges,
      dataBoxes,
      powerIndustryData,
      tableColumns,
      tableData,
      coalIndustryData,
      chemicalIndustryData,
      gasSupplyData,
      coalChemicalData,
      cityGasData,
    };
  },
};
</script>

<style scoped>
/* Base styles */
:deep(body) {
  background-color: #001529;
  color: #ffffff;
}

.dashboard {
  padding: 20px;
  background-color: #022b52;
}

/* Card styles */
.card {
  background-color: #0a2a4a;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card :deep(.ant-card-head) {
  background-color: #0d3a5f;
  border-bottom: 1px solid #1e4976;
}

.card :deep(.ant-card-head-title) {
  color: #ffffff;
}

/* Chart styles */
.chart {
  width: 100%;
  height: 180px;
  margin-bottom: 16px;
}

/* Data overview styles */
.data-overview {
  display: flex;
  flex-direction: column;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #1e4976;
}

.data-item:last-child {
  border-bottom: none;
}

.data-label {
  color: #a3c5e9;
  font-size: 14px;
}

.data-value {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
}

/* Layout image styles */
.layout-card {
  padding: 0;
}

.layout-card :deep(.ant-card-body) {
  padding: 0;
}

.layout-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0 0 8px 8px;
  margin-left: auto;
  margin-right: auto;
}

/* Utility classes */
.mt-8 {
  margin-top: 8px;
}

.mb-16 {
  margin-bottom: 16px;
}

/* Unit text styles */
.unit {
  text-align: right;
  color: #a3c5e9;
  font-size: 12px;
  margin-bottom: 8px;
}

.unit-text {
  text-align: center;
  color: #a3c5e9;
  font-size: 12px;
  margin-bottom: 4px;
}

/* Data box styles */
.data-boxes {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.data-box {
  background: #0d3a5f;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}

.data-box.small {
  padding: 8px;
  margin-bottom: 8px;
}

.data-title {
  font-size: 14px;
  color: #a3c5e9;
  margin-bottom: 8px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.value.primary {
  color: #4da8ff;
}

.value.negative {
  color: #ff6b6b;
}

.value.positive {
  color: #69f0ae;
}

.label {
  font-size: 12px;
  color: #a3c5e9;
}

/* Sub-section styles */
.sub-section {
  margin-bottom: 16px;
}

.sub-section h4 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #ffffff;
}

/* Natural gas card styles */
.natural-gas .sub-section:last-child {
  margin-bottom: 0;
}

.natural-gas .chart {
  height: 160px;
}

/* Table styles */
:deep(.ant-table-small) {
  font-size: 12px;
  background-color: #0a2a4a;
  color: #ffffff;
}

:deep(.ant-table-small .ant-table-thead > tr > th) {
  background-color: #0d3a5f;
  color: #ffffff;
  padding: 8px;
  border-bottom: 1px solid #1e4976;
}

:deep(.ant-table-small .ant-table-tbody > tr > td) {
  padding: 8px;
  border-bottom: 1px solid #1e4976;
}

:deep(.ant-table-small .ant-table-tbody > tr:hover > td) {
  background-color: #164b7e;
}

/* Full height card styles */
.full-height :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.full-height .table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.full-height :deep(.ant-table-wrapper) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-height :deep(.ant-spin-nested-loading),
.full-height :deep(.ant-spin-container),
.full-height :deep(.ant-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-height :deep(.ant-table-body) {
  flex: 1;
  overflow-y: visible;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Additional styles for consistency */
:deep(.ant-card-body) {
  background-color: #0a2a4a;
  color: #ffffff;
}

:deep(.ant-table) {
  color: #ffffff;
}

:deep(.ant-table-cell) {
  background-color: #0a2a4a;
}

:deep(.ant-table-row:hover) {
  background-color: #164b7e;
}

:deep(.ant-select-selector) {
  background-color: #0d3a5f !important;
  color: #ffffff !important;
}

:deep(.ant-select-arrow) {
  color: #ffffff;
}

:deep(.ant-pagination-item),
:deep(.ant-pagination-prev),
:deep(.ant-pagination-next) {
  background-color: #0d3a5f;
  border-color: #1e4976;
}

:deep(.ant-pagination-item a),
:deep(.ant-pagination-prev a),
:deep(.ant-pagination-next a) {
  color: #ffffff;
}

:deep(.ant-pagination-item-active) {
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>