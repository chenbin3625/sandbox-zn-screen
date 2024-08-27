<template>
  <a-row :gutter="16">
    <a-col :span="8">
      <a-card title="电力产业">
        <a-typography-title :level="4">装机容量: {{ totalCapacity }} 兆瓦</a-typography-title>
        <a-table :dataSource="electricPowerData" :columns="columns" :pagination="false" size="small" />
        <a-row :gutter="16">
          <a-col :span="12">
            <v-chart class="chart" :option="generationGaugeOption" />
            <a-typography-title :level="5" style="text-align: center">
              {{ cumulativeGeneration }} 年累计发电量
            </a-typography-title>
          </a-col>
          <a-col :span="12">
            <v-chart class="chart" :option="heatingGaugeOption" />
            <a-typography-title :level="5" style="text-align: center">
              {{ cumulativeHeating }} 年累计供热量
            </a-typography-title>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card title="产业布局" :bodyStyle="{ padding: 0 }">
        <img src="../assets/chanye.png" alt="产业布局" style="width: 100%; height: 100%; object-fit: cover;" />
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-card title="煤炭产业" size="small">
            <p>煤炭产业内容</p>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="天然气产业" size="small">
            <p>天然气产业内容</p>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small">
            <a-statistic title="港口吞吐能力" :value="3000" suffix="万吨" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small">
            <a-statistic title="船舶总运力" :value="153" suffix="万吨" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small">
            <a-statistic title="当前库存" :value="26.08" suffix="万吨" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small">
            <a-statistic title="昨日耗煤量" :value="613.78" suffix="万吨" />
          </a-card>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import { TitleComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent
]);

export default defineComponent({
  name: 'PowerIndustryDashboard',
  components: {
    VChart,
  },
  setup() {
    const totalCapacity = ref(44667);
    const cumulativeGeneration = ref(1270.77);
    const cumulativeHeating = ref(2442.14);

    const electricPowerData = ref([
      { type: '煤机', capacity: 32025.00, ratio: '71.70%', annualOutput: 1119.92 },
      { type: '燃机', capacity: 4987.33, ratio: '11.17%', annualOutput: 41.85 },
      { type: '光伏', capacity: 3098.96, ratio: '6.94%', annualOutput: 23.49 },
      { type: '风电', capacity: 2489.75, ratio: '5.57%', annualOutput: 37.07 },
      { type: '水电', capacity: 1194.16, ratio: '2.67%', annualOutput: 20.80 },
      { type: '垃圾', capacity: 737.00, ratio: '1.65%', annualOutput: 24.71 },
      { type: '污泥', capacity: 75.00, ratio: '0.17%', annualOutput: 0.95 },
      { type: '生物质', capacity: 60.00, ratio: '0.13%', annualOutput: 1.99 },
    ]);

    const columns = [
      { title: '电力类型', dataIndex: 'type', key: 'type' },
      { title: '装机容量(兆瓦)', dataIndex: 'capacity', key: 'capacity' },
      { title: '装机占比', dataIndex: 'ratio', key: 'ratio' },
      { title: '年发电量(亿千瓦时)', dataIndex: 'annualOutput', key: 'annualOutput' },
    ];

    const gaugeOption = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          show: false
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 15
        },
        detail: {
          fontSize: 15,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value) + '%';
          },
          color: 'auto'
        },
        data: [{ value: 64.34, name: '计划完成率' }]
      }]
    };

    const generationGaugeOption = { ...gaugeOption };
    const heatingGaugeOption = {
      ...gaugeOption,
      series: [{
        ...gaugeOption.series[0],
        data: [{ value: 76.32, name: '计划完成率' }]
      }]
    };

    return {
      totalCapacity,
      cumulativeGeneration,
      cumulativeHeating,
      electricPowerData,
      columns,
      generationGaugeOption,
      heatingGaugeOption,
    };
  },
});
</script>

<style scoped>
.chart {
  height: 200px;
}
</style>