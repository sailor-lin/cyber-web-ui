<template>
  <g-page-body>
    <template #header>
      <g-params
        :loading="tableState.loading"
        @search="methods.searchQuery()"
      >
        <!-- 命名空间 -->
        <g-select
          v-model:value="queryParams.namespace"
          width="168"
          placeholder="命名空间"
          label="命名空间"
          allowClear
          dictCode="namespace"
          @change="methods.searchQuery()"
        ></g-select>
        <!-- 名称搜索 -->
        <g-input
          v-model:value="queryParams.name"
          width="168px"
          search
          placeholder="输入名称进行搜索..."
          @keydown.enter="methods.searchQuery()"
        ></g-input>
        <!-- 右插槽 -->
        <template #right>
          <g-button type="primary" @click="methods.showModify({ title: '创建' })">新增</g-button>
        </template>
      </g-params>
    </template>
    
    <g-table
      ref="tableRef"
      url="/list"
      method="get"
      rowKey="namespace"
      v-model:loading="tableState.loading"
      :columns="tableState.columns"
      :overlayMenu="tableState.overlayMenu"
    >
      <template #bodyCell="{ column, record }">
        <!-- 名字 -->
        <template v-if="column.key == 'name'">
          <g-tooltip>
            <g-router-link
              :to="`/detail/cluster/namespace/kind/${record.name}`"
            >{{ record.name }}</g-router-link>
            <template v-if="record?.metadata?.name" #title>{{ record.name }}</template>
          </g-tooltip>
        </template>
        <!-- 状态 -->
        <template v-if="column.key == 'status'">
          <g-circle pattern="primary">{{ '运行中' }}</g-circle>
        </template>
      </template>
    </g-table>

    <YamlModal ref="yamlModalRef"></YamlModal>
  </g-page-body>
</template>

<script setup>
import dayjs from '@/utils/dayjs';
import { stringSort } from '@/utils/dispose/sort.js';
import { changeHistoryState, initHistoryParams, confirmModal } from '@/utils/dispose';
import YamlModal from '@/components/modal/YamlModal.vue';
import { dictStore, userStore } from '@/store';
import GInput from '@/components/global/input/g-input.vue';
import { createVNode } from 'vue';
import { message } from 'ant-design-vue';

const $userStore = userStore();
const $dictStore = dictStore();
const tableRef = ref();
const yamlModalRef = ref();

const tableState = reactive({
  loading: false,
  // 表格列
  columns: [
    {
      title: "名称",
      key: 'name',
      sort: true,
      customSort: (dataSource, isAsc) => stringSort(dataSource, isAsc, 'metadata?.name'),
    },
    {
      title: "命名空间",
      dataIndex: 'namespace',
      sort: true,
      customSort: (dataSource, isAsc) => stringSort(dataSource, isAsc, 'metadata?.namespace'),
    },
    {
      title: "状态",
      key: 'status',
    },
    {
      title: "创建信息",
      dataIndex: 'creationTimestamp',
      customRender: ({ text }) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ],
  // 更多操作
  overlayMenu: [
    {
      label: 'yaml',
      handler: () => methods.showModify({ title: 'yaml' })
    },
    {
      label: '删除',
      handler: (record) => methods.delete(record),
    },
  ],
});
// 请求参数
const queryParams = reactive(initHistoryParams({
  namespace: undefined,
  type: undefined,
  status: undefined,
  name: undefined,
}));
// 更新字典
$dictStore.update('namespace', [{ label: 'cmp', value: 'cmp' }], { label: 'label', value: 'value' });

const methods = {
  // 搜索表格
  searchQuery() {
    console.log('queryParams', queryParams)
    // 保存搜索条件
    changeHistoryState(queryParams);
    // const params = JSON.parse(JSON.stringify(queryParams));
    // 调用表格查询方法
    // unref(tableRef).searchQuery(params);
    // 自定义设置表格数据
    unref(tableRef).setDataSource([
      {
        "name": "example",
        'namespace': 'cmp',
        "creationTimestamp": new Date(),
      }
    ])
  },
  showModify(record) {
    unref(yamlModalRef).showModal(record)
  },
  delete(record) {
    confirmModal({
      title: `是否删除${record.name}`,
      icon: 'icon-shanchu',
      content: [
        `请输入示例名称【`,
        createVNode('span', { class: 'error-color' }, record.name),
        `】以删除该示例名称），删除后将无法恢复！`
      ],
      okButtonProps: {
        pattern: 'error',
      },
      onOk: (value) => {
        return new Promise((resolve, reject) => {
          if(record.name == value) {
            message.success('删除成功！')
            resolve();
          } else {
            message.warning(`请输入正确的示例名称！`)
            reject();
          }
        })
      },
    })    
  },
}
onMounted(() => {
  methods.searchQuery();
})
</script>

<style lang="less">
</style>
