<template>
  <Card title="steps">
    <c-steps v-model:current="state.current">
      <c-step title="步骤1"></c-step>
      <c-step title="步骤2"></c-step>
      <c-step title="步骤3"></c-step>
      <c-step title="步骤4"></c-step>
      <c-step title="步骤5"></c-step>
    </c-steps>
  </Card>
  <Card title="switch">
    <c-switch-control v-model:checked="state.switchControl"
      checkedValue="1" unCheckedValue="2" @change="methods.changeSwitchControl"
    >开关</c-switch-control>
  </Card>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import Card from './components/Card.vue';
const options = {
  select: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5555', value: '5' },
  ]
};
const state = reactive({
  current: 2,
  switchControl: true,
});
const methods = {
  changeSwitchControl(checked) {
    console.log("!!", state.switchControl, checked);
  },
};
</script>

<style lang="less" scoped>
</style>
