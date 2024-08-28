<template>
  <a-config-provider :locale="locale">
    <div class="dashboard">
      <a-form
        :model="formState"
        layout="inline"
        class="dashboard-form"
      >
        <a-form-item label="所属企业" name="company">
          <a-select v-model:value="formState.company" style="width: 200px" placeholder="请选择" @change="handleSearch">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="company in companies" :key="company" :value="company">{{ company }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属设备" name="equipment">
          <a-select v-model:value="formState.equipment" style="width: 200px" placeholder="请选择" @change="handleSearch">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="equipment in equipments" :key="equipment" :value="equipment">{{ equipment }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="异常类型" name="exceptionType">
          <a-select v-model:value="formState.exceptionType" style="width: 200px" placeholder="请选择" @change="handleSearch">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="type in exceptionTypes" :key="type" :value="type">{{ type }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="异常时间" name="dateRange">
          <a-range-picker v-model:value="formState.dateRange" @change="handleSearch" />
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :data-source="paginatedData"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        class="dashboard-table"
      >
      </a-table>
    </div>
  </a-config-provider>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const generateRandomData = (count) => {
  const sampleData = [
    {
      name: '嘉华发电八号机CEMS脱硫出口SO2浓度',
      code: '2331.C80HTA50CQ003',
      company: '嘉华发电',
      equipment: '嘉华#8',
    },
    {
      name: '滨海热电三号机CEMS脱硫出口NOx浓度',
      code: '2181.C30HTA50CQ001',
      company: '滨海热电',
      equipment: '滨海#3',
    },
    {
      name: '镇海燃热十一号机CEMS出口NOx浓度',
      code: '2361.AB0HTA50CQ001',
      company: '镇海燃热',
      equipment: '镇燃热#21',
    },
    {
      name: '阿克苏热电二号机CEMS脱硫出口SO2浓度(折算值)',
      code: '2271.C20HTA50CQ003A',
      company: '阿克苏热电',
      equipment: '阿克苏#2',
    },
    {
      name: '乐清发电一号机发电机有功功率选择后',
      code: '2251.C10MKA01FE100',
      company: '乐清发电',
      equipment: '乐清#3',
    },
    {
      name: '凤台发电一号机CEMS脱硫出口粉尘浓度',
      code: '2121.C10HTA50CQ005',
      company: '凤台发电',
      equipment: '凤台#1',
    },
    {
      name: '萧山发电五号机CEMS出口SO2浓度',
      code: '2031.A50HTA50CQ003',
      company: '萧山发电',
      equipment: '萧燃#5',
    },
    {
      name: '萧山发电五号机CEMS出口NOx浓度(折算值)',
      code: '2031.A50HTA50CQ001A',
      company: '萧山发电',
      equipment: '萧燃#5',
    },
    {
      name: '凤台发电三号机CEMS脱硫出口NOx浓度',
      code: '2121.C30HTA50CQ001',
      company: '凤台发电',
      equipment: '凤台#3',
    },
  ];

  const exceptionTypes = ['中断', '超限', '故障'];

  return Array.from({ length: count }, (_, index) => {
    const sampleIndex = Math.floor(Math.random() * sampleData.length);
    const sample = sampleData[sampleIndex];

    const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + Math.random() * (Date.now() - startTime.getTime()));
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);

    return {
      key: (index + 1).toString(),
      name: sample.name,
      code: sample.code,
      company: sample.company,
      equipment: sample.equipment,
      exceptionType: exceptionTypes[Math.floor(Math.random() * exceptionTypes.length)],
      startTime: startTime.toLocaleString('zh-CN', { hour12: false }),
      endTime: endTime.toLocaleString('zh-CN', { hour12: false }),
      duration: durationHours.toFixed(2),
    };
  });
};

export default defineComponent({
  setup() {
    const columns = [
      { title: '测点名称', dataIndex: 'name', key: 'name' },
      { title: '测点编码', dataIndex: 'code', key: 'code' },
      { title: '所属企业', dataIndex: 'company', key: 'company' },
      { title: '所属设备', dataIndex: 'equipment', key: 'equipment' },
      { title: '异常类型', dataIndex: 'exceptionType', key: 'exceptionType' },
      { title: '异常开始时间', dataIndex: 'startTime', key: 'startTime' },
      { title: '异常结束时间', dataIndex: 'endTime', key: 'endTime' },
      { title: '异常小时数', dataIndex: 'duration', key: 'duration' },
    ];

    const randomCount = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    const data = ref(generateRandomData(randomCount));

    const companies = [...new Set(data.value.map(item => item.company))];
    const equipments = [...new Set(data.value.map(item => item.equipment))];
    const exceptionTypes = [...new Set(data.value.map(item => item.exceptionType))];

    const formState = reactive({
      company: '',
      equipment: '',
      exceptionType: '',
      dateRange: [],
    });

    const filteredData = ref([]);
    const loading = ref(false);

    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条数据`,
    });

    const locale = ref(zhCN);

    const paginatedData = computed(() => {
      const start = (pagination.current - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return filteredData.value.slice(start, end);
    });

    const handleSearch = () => {
      loading.value = true;
      filteredData.value = data.value.filter((item) => {
        return (
          (!formState.company || item.company === formState.company) &&
          (!formState.equipment || item.equipment === formState.equipment) &&
          (!formState.exceptionType || item.exceptionType === formState.exceptionType) &&
          (!formState.dateRange.length || 
            (new Date(item.startTime) >= formState.dateRange[0] &&
             new Date(item.endTime) <= formState.dateRange[1]))
        );
      });
      pagination.total = filteredData.value.length;
      pagination.current = 1;
      loading.value = false;
    };

    const handleTableChange = (pag) => {
      pagination.current = pag.current;
      pagination.pageSize = pag.pageSize;
    };

    onMounted(() => {
      handleSearch();
    });

    watch(() => formState, handleSearch, { deep: true });

    return {
      formState,
      columns,
      paginatedData,
      loading,
      pagination,
      handleSearch,
      handleTableChange,
      companies,
      equipments,
      exceptionTypes,
      locale,
    };
  },
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f0f2f5;
}

.dashboard-form {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dashboard-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.dashboard-table .ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

:deep(.dashboard-table .ant-table-tbody > tr:hover > td) {
  background-color: #e6f7ff;
}
</style>