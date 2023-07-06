<template>
  <Card title="table" style="padding: 24px 0 0;">
    <c-table
      :loading="tableState.loading"
      :columns="tableState.columns"
      :dataSource="tableState.dataSource"
      :current="tableState.page"
      :pageSize="tableState.pageSize"
      :total="tableState.total"
    ></c-table>
  </Card>
  <Card title="table-wrapper" style="padding: 24px 0 0;">
    <c-table-wrapper
      ref="tableRef"
      v-model:loading="tableState.loading"
      v-model:current="tableState.page"
      :dataSource="tableState.dataSource"
      v-model:pageSize="tableState.pageSize"
      :total="tableState.total"
      :columns="tableState.columns"
      :paginationProps="{
        pageSizeOptions: ['1', '2', '3'],
      }"
      @search="methods.searchQuery"
      @paginationChange="methods.searchQuery"
    >
      <template #collapse>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
        <AInput></AInput>
      </template>
      <template #right>
        <AButton type="primary">添加</AButton>
      </template>
    </c-table-wrapper>
  </Card>
</template>

<script setup>
import axios from '../api';
import { reactive, ref, unref, onMounted } from 'vue';
import { Input as AInput, Button as AButton } from 'ant-design-vue';
import Card from '../components/Card.vue';
const tableRef = ref();
const tableState = reactive({
  page: 1,
  pageSize: 1,
  total: 0,
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      className: 'number',
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
  ],
  dataSource: []
});
const methods = {
  async searchQuery() {
    // let { data, total } = await unref(tableRef).searchQuery({
    //   url: '/activitylog/search',
    //   method: 'get',
    //   params: {},
    // });
    // tableState.dataSource = data;
    // tableState.total = total;
    // console.log("??", tableState.dataSource)

    try {
      tableState.loading = true;
      tableState.dataSource = [];
      let res = await axios.request({
        url: '/activitylog/search',
        method: 'get',
        params: {
          page: tableState.page,
          pageSize: tableState.pageSize,
        },
      });
      console.log('res', res);
      tableState.dataSource = res.data?.data || [];
      tableState.total = res.data?.row || 0;
    } catch {
      tableState.total = 0;
    };
    tableState.loading = false;
  },
};

onMounted(() => {
  methods.searchQuery();
});
</script>