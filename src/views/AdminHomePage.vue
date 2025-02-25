<template>
  <div class="dashboard">
    <a-row type="flex" justify="center" :gutter="16">
      <!-- 第一行 -->
      <a-col :span="7">
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
            <table class="custom-table">
              <thead>
                <tr>
                  <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                  <td v-for="key in Object.keys(item)" :key="key">{{ item[key] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a-card>
      </a-col>

      <a-col :span="9">
        <!-- 数据一览 -->
        <a-card title="数据一览" class="card mb-16">
          <div class="databoxes-container">
            <div v-for="(box, index) in dataBoxes" :key="index" class="data-box">
              <div class="data-title">{{ box.title }}</div>
              <div class="data-value">{{ box.value }}</div>
            </div>
          </div>
        </a-card>

        <!-- 产业布局 -->
        <a-card title="产业布局" class="card layout-card">
          <img src="../assets/chanye.png" alt="产业布局" class="layout-image">
        </a-card>
      </a-col>

      <a-col :span="6">
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
    </a-row>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue';
import * as echarts from "echarts";
import { useAuthStore } from "../stores/auth";

export default {
  name: "HomePage",
  setup() {
    const chartRefs = ref([]);
    const charts = ref([]);
    const authStore = useAuthStore();
    
    // 获取仪表盘数据
    const dashboardData = reactive(authStore.getDashboardData());
    
    // 表头数据是固定的，不需要随机生成
    const tableHeaders = dashboardData.tableHeaders;

    const initGaugeChart = (element, value) => {
      const chart = echarts.init(element);
      const option = {
        series: [{
          type: "gauge",
          progress: { show: true, width: 12 },
          axisLine: { lineStyle: { width: 12 } },
          axisLabel: { show: false },
          pointer: { itemStyle: { color: "auto" } },
          detail: {
            fontSize: 12,
            valueAnimation: true,
            formatter: function(value) {
              return value.toFixed(2) + '%';
            },
          },
          data: [{ value }],
        }],
      };
      chart.setOption(option);
      return chart;
    };

    const initBarChart = (element, data, color) => {
      const chart = echarts.init(element);
      chart.setOption({
        color,
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
        }],
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      });
      return chart;
    };

    const initCharts = () => {
      charts.value = [
        initGaugeChart(chartRefs.value[0], dashboardData.gauges[0].value),
        initGaugeChart(chartRefs.value[1], dashboardData.gauges[1].value),
        initBarChart(chartRefs.value[2], dashboardData.barChartData.coal, ['#1E3F8C', '#4872C2']),
        initBarChart(chartRefs.value[3], dashboardData.barChartData.gas, ['#1E3F8C', '#4FBBD4']),
      ];
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
      gauges: dashboardData.gauges,
      dataBoxes: dashboardData.dataBoxes,
      powerIndustryData: dashboardData.powerIndustryData,
      tableHeaders,
      tableData: dashboardData.tableData,
      coalIndustryData: dashboardData.coalIndustryData,
      chemicalIndustryData: dashboardData.chemicalIndustryData,
    };
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 180px;
  margin-bottom: 16px;
}

.databoxes-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 14px;
}

.data-box {
  background: #f5f5f5;
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
  color: #888;
  margin-bottom: 8px;
}

.data-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

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

.table-container {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12px;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.custom-table th {
  background: #f4f4f4;
}

.mt-8 {
  margin-top: 8px;
}

.mb-16 {
  margin-bottom: 16px;
}

.unit {
  text-align: right;
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}

.data-boxes {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.value.primary {
  color: #1565C0;
}

.value.negative {
  color: #D32F2F;
}

.label {
  font-size: 12px;
  color: #666;
}

.card.mb-16, 
.card:last-child {
  display: flex;
  flex-direction: column;
}

.card.mb-16 .chart,
.card:last-child .chart {
  flex-grow: 1;
  min-height: 0;
}

.unit-text {
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}
</style>