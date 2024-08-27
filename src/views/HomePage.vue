<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <!-- 第一行 -->
      <a-col :span="7">
        <!-- 电力产业 -->
        <a-card title="电力产业" class="card full-height">
          <a-row :gutter="16">
            <a-col :span="12">
              <div class="data-title">发电量</div>
              <div ref="gauge1" class="chart"></div>
            </a-col>
            <a-col :span="12">
              <div class="data-title">供热量</div>
              <div ref="gauge2" class="chart"></div>
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
                  <th>类型</th>
                  <th>装机容量(兆瓦)</th>
                  <th>年发电量(亿千瓦时)</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                  <td>{{ item.type }}</td>
                  <td>{{ item.capacity }}</td>
                  <td>{{ item.generation }}</td>
                  <td>{{ item.percentage }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a-card>
      </a-col>

      <a-col :span="11">
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
            <div class="data-box">
              <div class="value primary">613.78 万吨</div>
              <div class="label">当前库存</div>
            </div>
            <div class="data-box">
              <div class="value">57.99%</div>
              <div class="label">完成率</div>
            </div>
            <div class="data-box">
              <div class="value negative">-3.7%</div>
              <div class="label">同比增长</div>
            </div>
          </div>
          <div ref="coalChart" class="chart"></div>
        </a-card>

        <!-- 煤化工产业 -->
        <a-card title="煤化工产业" class="card">
          <div class="unit">单位：亿标方</div>
          <div class="data-boxes">
            <div class="data-box">
              <div class="value">72.26%</div>
              <div class="label">完成率</div>
            </div>
            <div class="data-box">
              <div class="value negative">-5.63%</div>
              <div class="label">同比增长</div>
            </div>
          </div>
          <div ref="chemicalChart" class="chart"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "HomePage",
  data() {
    return {
      dataBoxes: [
        { title: "装机容量", value: "44667 兆瓦" },
        { title: "权益容量", value: "30469 兆瓦" },
        { title: "船舶总运力", value: "153 万吨" },
        { title: "港口吞吐能力", value: "3000 万吨" },
        { title: "城市燃气管网长度", value: "10273 公里" },
        { title: "煤化工产能", value: "20 亿标方" },
      ],
      powerIndustryData: [
        { title: "年累计发电量", value: "1,270.77" },
        { title: "年计划发电量", value: "1,937.12" },
        { title: "年累计供热量", value: "2,442.14" },
        { title: "年计划供热量", value: "3,200" },
      ],
      tableData: [
        { type: "煤机", capacity: "32025.00", generation: "1119.92", percentage: "88.13%" },
        { type: "燃机", capacity: "4987.33", generation: "41.85", percentage: "3.29%" },
        { type: "光伏", capacity: "3098.96", generation: "23.49", percentage: "1.85%" },
        { type: "风电", capacity: "2489.75", generation: "37.07", percentage: "2.92%" },
        { type: "水电", capacity: "1194.16", generation: "20.79", percentage: "1.64%" },
        { type: "垃圾", capacity: "737.00", generation: "24.71", percentage: "1.94%" },
        { type: "污泥", capacity: "75.00", generation: "0.95", percentage: "0.07%" },
        { type: "生物质", capacity: "60.00", generation: "1.99", percentage: "0.16%" },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initGaugeChart(this.$refs.gauge1, 64.34);
      this.initGaugeChart(this.$refs.gauge2, 76.32);
      this.initCoalChart();
      this.initChemicalChart();
    });
  },
  methods: {
    initGaugeChart(element, value) {
      const chart = echarts.init(element);
      const option = {
        series: [
          {
            type: "gauge",
            progress: {
              show: true,
              width: 12,
            },
            axisLine: {
              lineStyle: {
                width: 12,
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              itemStyle: {
                color: "auto",
              },
            },
            detail: {
              fontSize: 12,
              valueAnimation: true,
              formatter: "{value}%",
            },
            data: [
              {
                value: value,
              },
            ],
          },
        ],
      };
      chart.setOption(option);
    },
    initCoalChart() {
      const chart = echarts.init(this.$refs.coalChart);
      chart.setOption({
        color: ['#1E3F8C', '#4872C2'],
        xAxis: {
          type: 'category',
          data: ['年计划供煤量', '7月底年累计供煤量'],
          axisLabel: { interval: 0, rotate: 0 },
        },
        yAxis: { type: 'value' },
        series: [{
          data: [6600.00, 3827.17],
          type: 'bar',
          barWidth: '40%',
        }],
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      });
    },
    initChemicalChart() {
      const chart = echarts.init(this.$refs.chemicalChart);
      chart.setOption({
        color: ['#1E3F8C', '#4FBBD4'],
        xAxis: {
          type: 'category',
          data: ['年计划产气量', '年累计产气量'],
          axisLabel: { interval: 0, rotate: 0 },
        },
        yAxis: { type: 'value' },
        series: [{
          data: [19.20, 13.87],
          type: 'bar',
          barWidth: '40%',
        }],
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      });
    }
  },
};
</script>

<style scoped>

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}


.chart {
  width: 100%;
  height: 180px;
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
  width: 95%;
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
</style>