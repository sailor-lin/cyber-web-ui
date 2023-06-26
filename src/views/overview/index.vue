<template>
  <div>
    <c-icon v-permission="['operation-log', 'overview']" icon="cyber-zhengchang" isSvg></c-icon>
    <c-select width="200px" :options="STATUS"></c-select>
    <c-area-tree-select level="3" style="width: 400px;"></c-area-tree-select>
    <AButton type="primary" v-permission="['operation-log', 'overview']" @click="methods.onClick">按钮</AButton>
    <c-icon-select />
    <c-table-wrapper
      rowKey="id"
      ref="tableRef"
      v-model:loading="tableState.loading"
      v-model:dataSource="tableState.dataSource"
      v-model:current="tableState.current"
      v-model:pageSize="tableState.pageSize"
      :columns="tableState.columns"
      :overlayMenu="tableState.overlayMenu"
      :action="false"
      :paginationProps="{ pageSizeOptions: ['1', '2', '3'] }"
      :beforePaginationChange="methods.beforePaginationChange"
      @search="methods.searchQuery"
      @change="handleChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'name'">
          <c-cell
            icon="cyber-bumen2"
            :title="record.name"
            to="/organization/dept"
            tips="提示提示提示提示提示提示提示提示提示提示提示"
            permission="overview"
          ></c-cell>
        </template>
        <template v-if="column.key == 'status'">
          <c-cell-dict :options="STATUS" :value="record.status"></c-cell-dict>
        </template>
      </template>
    </c-table-wrapper>
  </div>
</template>

<script setup>
import { onMounted, ref, unref, reactive, watchEffect, computed } from 'vue';
import { useDict, parseDict, Modal } from '../../../components';
import { Button as AButton } from 'ant-design-vue';
const tableRef = ref();
const { STATUS } = useDict({
  COMMON: ['STATUS'],
});
const { STATUS_PARSE } = parseDict({
  COMMON: ['STATUS'],
});

const filteredInfo = ref();
const sortedInfo = ref();
// 表格信息
const tableState = reactive({
  loading: false,
  columns: computed(() => {
    const filtered = filteredInfo.value || {};
    const sorted = sortedInfo.value || {};
    return [
      {
        title: '部门名称',
        key: "name",
        width: '15%',
        ellipsis: true,
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filtered.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sorted.columnKey === 'name' && sorted.order,
      },
      { title: '所属企业', dataIndex: "enterpriseName", width: '15%', customRender: ({ text }) => text || '-' },
      { title: '上级部门', dataIndex: "parentDeptName", width: '15%', ellipsis: true, customRender: ({ text }) => text || '-' },
      { title: '部门描述', dataIndex: "description", ellipsis: true, customRender: ({ text }) => text || '-' },
      { title: '部门状态', key: "status", width: '15%'  },
      { title: '更新时间', dataIndex: "updateTime", width: '240px' },
    ];
  }),
  dataSource: [],
  current: undefined,
  pageSize: undefined,
});
const methods = {
  // 搜索表格
  async searchQuery() {
    try {
      const { STATUS_PARSE } = await parseDict({
        COMMON: ['STATUS'],
      }, true);
      console.log('STATUS', STATUS_PARSE)
      await methods.beforePaginationChange();
      await unref(tableRef).searchQuery({
        url: '/auth/dept/search',
        method: 'get',
        params: {
          sortBy: 'order_num',
          sortType: 'asc',
        },
      });
    } catch(error) {
      console.log('error', error);
    }
  },
  beforePaginationChange(page, pageSize) {
    // return new Promise(resolve => {
    //   Modal.confirm({
    //     content: '确定操作？',
    //     onOk: () => {
    //       resolve();
    //     }
    //   })
    // })
  },
  onClick() {
    Modal.verify({
      value: '1',
      content: '请输入“1”确定操作！',
      params: {
        url: '/auth/dept/search',
        method: 'get',
      }
    });
  },
};
const handleChange = (pagination, filters, sorter) => {
  console.log('Various parameters', pagination, filters, sorter);
  filteredInfo.value = filters;
  sortedInfo.value = sorter;
};


onMounted(() => {
  methods.searchQuery();
});
</script>

<style lang="less" scoped>
</style>
