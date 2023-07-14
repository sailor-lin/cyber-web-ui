<template>
  <Card title="select">
    <div>
      <c-select v-model:value="selectState.select" :options="options" width="160px"></c-select>
      <c-select v-model:value="selectState.select" label="本来" :options="options" width="160px"></c-select>
      <c-select v-model:value="selectState.select" :options="options" width="160px" shape="round"></c-select>
    </div>
    <div>
      <c-enterprise show-search width="180px" v-model:value="selectState.enterprise"></c-enterprise>
      <c-dept-tree-select
        :enterpriseId="selectState.enterprise"
        show-search
        style="width: 180px"
      ></c-dept-tree-select>
      <c-position show-search width="180px" :enterpriseId="selectState.enterprise"></c-position>
      <c-enterprise-tree-select style="width: 200px"></c-enterprise-tree-select>
    </div>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted } from 'vue';
import { Input as AInput, Button as AButton } from 'ant-design-vue';
import Card from '../components/Card.vue';

const selectState = reactive({
  select: '1',
  enterprise: undefined,
});

const options = [
  { label: '示例1', value: '2' },
  { label: '示例2', value: '1' },
];
</script>