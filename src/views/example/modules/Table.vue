<template>
  <Card title="table" style="padding: 24px 0 0;">
    <c-table
      :loading="tableState.loading"
      :columns="tableState.columns"
      :dataSource="tableState.dataSource"
      :current="tableState.page"
      :pageSize="tableState.pageSize"
      :total="tableState.total"
      :action="false"
    ></c-table>
  </Card>
  <Card title="table-wrapper" style="padding: 24px 0 0;">
    <c-table-wrapper
      ref="tableRef"
      rowKey="id"
      v-model:loading="tableState.loading"
      v-model:current="tableState.page"
      :dataSource="tableState.dataSource"
      v-model:pageSize="tableState.pageSize"
      :total="2"
      :columns="tableState.columns"
      :paginationProps="{
        pageSizeOptions: ['1', '2', '3'],
      }"
      showRowSelection
      @search="methods.searchQuery"
      @paginationChange="methods.searchQuery"
      @batchDelete="methods.batchDelete"
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
        <AButton type="primary" @click="methods.showModal">添加</AButton>
      </template>
    </c-table-wrapper>

    <c-modal
      title="添加"
      v-model:visible="modalState.visible"
    >
      <AInput placeholder="请输入"></AInput>
      
      <template #footer>
        <a-button type="primary" ghost @click="modalState.visible = false">取消</a-button>
        <a-button type="primary" ghost>保存</a-button>
        <a-button type="primary" ghost @click="methods.onSubmit">发布</a-button>
      </template>
    </c-modal>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted, watchEffect } from 'vue';
import { Input as AInput, Table as ATable, Button as AButton } from 'ant-design-vue';
import Card from '@/components/Card.vue';
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
  dataSource: [],
});
const modalState = reactive({
  visible: false,
});
const methods = {
  async searchQuery() {
    let { data, total } = await unref(tableRef).searchQuery({
      url: '/auth/dept/search',
      method: 'get',
      params: {},
    });
    tableState.dataSource = data;
    tableState.total = total;
  },
  batchDelete(list) {
    console.log('batchDelete', list)
  },
  showModal() {
    modalState.visible = true;
  },
};

onMounted(() => {
  methods.searchQuery();
});
</script>