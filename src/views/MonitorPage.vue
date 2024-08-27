<template>
  <div class="monitor-page">

    <a-form layout="inline" @submit.prevent="handleSearch" class="search-form">
      <a-form-item label="所属企业">
        <a-select v-model:value="formState.company" placeholder="请选择" style="width: 200px;">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="嘉华发电">嘉华发电</a-select-option>
          <a-select-option value="滨海热电">滨海热电</a-select-option>
          <a-select-option value="镇海燃热">镇海燃热</a-select-option>
          <a-select-option value="阿克苏热电">阿克苏热电</a-select-option>
          <a-select-option value="乐清发电">乐清发电</a-select-option>
          <a-select-option value="凤台发电">凤台发电</a-select-option>
          <a-select-option value="萧山发电">萧山发电</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属设备">
        <a-select v-model:value="formState.equipment" placeholder="请选择" style="width: 200px;">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="嘉华#8">嘉华#8</a-select-option>
          <a-select-option value="滨海#3">滨海#3</a-select-option>
          <a-select-option value="镇燃热#21">镇燃热#21</a-select-option>
          <a-select-option value="阿克苏#2">阿克苏#2</a-select-option>
          <a-select-option value="乐清#3">乐清#3</a-select-option>
          <a-select-option value="凤台#1">凤台#1</a-select-option>
          <a-select-option value="凤台#3">凤台#3</a-select-option>
          <a-select-option value="萧燃#5">萧燃#5</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="异常类型">
        <a-select v-model:value="formState.exceptionType" placeholder="请选择" style="width: 200px;">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="中断">中断</a-select-option>
          <a-select-option value="超限">超限</a-select-option>
          <a-select-option value="故障">故障</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="异常时间">
        <a-range-picker v-model:value="formState.dateRange" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">查询</a-button>
      </a-form-item>
    </a-form>

    <a-table :columns="columns" :data-source="data" :pagination="false" class="data-table">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.editable">
          <div>
            <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0" />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <span v-if="editableData[record.key]">
            <a-typography-link @click="save(record.key)">保存</a-typography-link>
            <a-typography-link @click="cancel(record.key)" style="margin-left: 8px">取消</a-typography-link>
          </span>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

export default defineComponent({
  name: 'MonitorPage',
  setup() {
    const formState = reactive({
      company: '',
      equipment: '',
      exceptionType: '',
      dateRange: [],
    });

    const columns = [
      { title: '测点名称', dataIndex: 'name', key: 'name', editable: true },
      { title: '测点编码', dataIndex: 'code', key: 'code', editable: true },
      { title: '所属企业', dataIndex: 'company', key: 'company', editable: true },
      { title: '所属设备', dataIndex: 'equipment', key: 'equipment', editable: true },
      { title: '异常类型', dataIndex: 'exceptionType', key: 'exceptionType', editable: true },
      { title: '异常开始时间', dataIndex: 'startTime', key: 'startTime', editable: true },
      { title: '异常结束时间', dataIndex: 'endTime', key: 'endTime', editable: true },
      { title: '异常小时数', dataIndex: 'duration', key: 'duration', editable: true },
      { title: '操作', dataIndex: 'action', key: 'action' },
    ];

    const data = ref([
      {
        key: '1',
        name: '嘉华发电八号机CEMS脱硫出口SO2浓度',
        code: '2331.C80HTA50CQ003',
        company: '嘉华发电',
        equipment: '嘉华#8',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '2',
        name: '滨海热电三号机CEMS脱硫出口NOx浓度',
        code: '2181.C30HTA50CQ001',
        company: '滨海热电',
        equipment: '滨海#3',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '3',
        name: '镇海燃热十一号机CEMS出口NOx浓度',
        code: '2361.AB0HTA50CQ001',
        company: '镇海燃热',
        equipment: '镇燃热#21',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '4',
        name: '阿克苏热电二号机CEMS脱硫出口SO2浓度(折算值)',
        code: '2271.C20HTA50CQ003A',
        company: '阿克苏热电',
        equipment: '阿克苏#2',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '5',
        name: '乐清发电一号机发电机有功功率选择后',
        code: '2251.C10MKA01FE100',
        company: '乐清发电',
        equipment: '乐清#3',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '6',
        name: '凤台发电一号机CEMS脱硫出口粉尘浓度',
        code: '2121.C10HTA50CQ005',
        company: '凤台发电',
        equipment: '凤台#1',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '7',
        name: '萧山发电五号机CEMS出口SO2浓度',
        code: '2031.A50HTA50CQ003',
        company: '萧山发电',
        equipment: '萧燃#5',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '8',
        name: '萧山发电五号机CEMS出口NOx浓度(折算值)',
        code: '2031.A50HTA50CQ001A',
        company: '萧山发电',
        equipment: '萧燃#5',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
      {
        key: '9',
        name: '凤台发电三号机CEMS脱硫出口NOx浓度',
        code: '2121.C30HTA50CQ001',
        company: '凤台发电',
        equipment: '凤台#3',
        exceptionType: '中断',
        startTime: '2023-02-21 13:48:50',
        endTime: '2023-02-21 13:50:50',
        duration: '0.03',
      },
    ]);

    const editableData = reactive({});

    const edit = (key) => {
      editableData[key] = cloneDeep(data.value.find(item => key === item.key));
    };

    const save = (key) => {
      Object.assign(data.value.find(item => key === item.key), editableData[key]);
      delete editableData[key];
    };

    const cancel = (key) => {
      delete editableData[key];
    };

    const handleSearch = () => {
      message.error('查询失败');
    };

    return {
      formState,
      columns,
      data,
      editableData,
      handleSearch,
      edit,
      save,
      cancel,
    };
  },
});
</script>

<style scoped>
.monitor-page {
  padding: 12px;
  background-color: #f0f2f5;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 24px;
}

.search-form {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.data-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f0f7ff;
  font-weight: bold;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #e6f7ff;
}

:deep(.ant-table-tbody > tr > td) {
  transition: all 0.3s;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-btn-primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-btn-primary:hover) {
  background-color: #40a9ff;
  border-color: #40a9ff;
}
</style>