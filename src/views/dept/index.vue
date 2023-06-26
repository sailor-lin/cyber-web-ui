<template>
  <div>
    <c-radio-wrapper v-model:value="queryState.radio" @change="onChange">
      <c-radio-button value="1">123</c-radio-button>
      <c-radio-button value="2">456</c-radio-button>
    </c-radio-wrapper>
    
    <c-table-wrapper
      v-model:dataSource="tableState.dataSource"
      :columns="tableState.column"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'name'">{{ record.name }}</template>
        <template v-if="column.key == 'sex'">33</template>
      </template>
    </c-table-wrapper>
    <c-table
      v-model:dataSource="tableState.dataSource"
      :columns="tableState.column"
      :pagination="false"
      @row-drag-end="onRowDragEnd"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'name'">{{ record.name }}</template>
        <template v-if="column.key == 'sex'">33</template>
      </template>
    </c-table>

    <div>
      <c-icon-select
        allowClear
        style="width: 400px;"
        v-model:value="queryState.icon"
      ></c-icon-select>
      <RangePicker
        v-model:value="queryState.time"
        format="YYYY-MM-DD HH:mm:ss"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        @change="() => changeHistoryState(queryState)"
      ></RangePicker>
      <Input v-model:value="queryState.a" @keydown.enter="changeHistoryState(queryState)"></Input>
      <div style="display: flex; margin-top: 20px;">
        <c-product-tree v-model:value="queryState.productId"></c-product-tree>
        <c-menu-permission :productId="queryState.productId" :height="600" style="width: 0; flex: 1; margin-left: 20px;"></c-menu-permission>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watchEffect } from 'vue';
import { RangePicker, Input, Tree as ATree } from 'ant-design-vue';
import { changeHistoryState, initHistoryState, Modal } from '../../../components';

const queryState = reactive({
  ...initHistoryState({
    time: [],
    a: undefined,
    productId: undefined,
    radio: '1',
  }),
  icon: '',
});

const tableState = reactive({
  column: [
    { title: 'name', key: 'name', rowDrag: true },
    { title: 'sex', dataIndex: 'sex', key: 'sex', rowDrag: true, disabledRowDrag: true },
    { title: '操作', key: 'action', fixed: 'right', rowDrag: true, width: 180 },
  ],
  dataSource: [{ id: '1', name: '4566', sex: '1' }, { id: '2', name: '789', six: '0' }],
})

function onRowDragEnd({ record, preTargetInfo, nextTargetInfo }) {
  return new Promise((resolve, reject) => {
    let value = (preTargetInfo || nextTargetInfo)?.name;
    Modal.confirm({
      title: '操作确认',
      content: `是否将${record.name}拖至${value}的${preTargetInfo ? '上方' : '下方'}`,
      onOk: resolve,
      onCancel: reject,
    })
  })
}

function onChange(value) {
  console.log("onChange??", value)
}
</script>