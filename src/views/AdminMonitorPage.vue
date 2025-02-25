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

      <div class="dashboard-table-container">
        <a-table
          :columns="columns"
          :data-source="paginatedData"
          :loading="loading"
          :pagination="false"
          @change="handleTableChange"
          class="dashboard-table"
        >
        </a-table>
        <div class="dashboard-pagination">
          <a-pagination
            v-model:current="pagination.current"
            :total="pagination.total"
            :pageSize="pagination.pageSize"
            :showSizeChanger="pagination.showSizeChanger"
            :showQuickJumper="pagination.showQuickJumper"
            :showTotal="pagination.showTotal"
            @change="handlePaginationChange"
          />
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useAuthStore } from '../stores/auth'; // 导入认证存储

dayjs.locale('zh-cn');

export default defineComponent({
  setup() {
    const authStore = useAuthStore(); // 使用认证存储

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

    // 从认证存储中获取监控数据
    const data = ref(authStore.getMonitorData());

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

    const handlePaginationChange = (page, pageSize) => {
      pagination.current = page;
      pagination.pageSize = pageSize;
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
      handlePaginationChange,
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
  padding: 30px;
  background-color: #f0f2f5;
}

.dashboard-form {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dashboard-table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dashboard-table {
  margin-bottom: 0;
}

.dashboard-pagination {
  padding: 16px 24px;
  text-align: right;
}

:deep(.dashboard-table .ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

:deep(.dashboard-table .ant-table-tbody > tr:hover > td) {
  background-color: #e6f7ff;
}
</style>