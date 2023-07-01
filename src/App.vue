<template>
  <Card title="steps">
    <g-steps v-model:current="state.current">
      <g-step title="步骤1"></g-step>
      <g-step title="步骤2"></g-step>
      <g-step title="步骤3"></g-step>
      <g-step title="步骤4"></g-step>
      <g-step title="步骤5"></g-step>
    </g-steps>
  </Card>
  <Card title="switch">
    <g-switch-control v-model:checked="state.switchControl"
      checkedValue="1" unCheckedValue="2" @change="methods.changeSwitchControl"
    >开关</g-switch-control>
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
