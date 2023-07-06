<template>
  <Card title="select">
    <c-select v-model:value="selectState.select" :options="options" width="160px"></c-select>
    <c-select v-model:value="selectState.select" label="本来" :options="options" width="160px"></c-select>
    <a-input addon-before="测"></a-input>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted } from 'vue';
import { Input as AInput, Button as AButton } from 'ant-design-vue';
import Card from '../components/Card.vue';

const selectState = reactive({
  select: '1',
});

const options = [
  { label: '示例1', value: '2' },
  { label: '示例2', value: '1' },
];

</script>