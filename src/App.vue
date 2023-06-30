<template>
  <div>
    <g-select :options="options.select" width="160" allowClear mode="tags"
      :maxTagTextLength="2" :maxTagCount="1"
    ></g-select>
    <g-select :options="options.select" addonBefore="??"></g-select>
    <g-select :options="options.select" shape="round" width="200px"></g-select>
  </div>
  <div>
    <g-steps>
      <g-step title="步骤1"></g-step>
      <g-step title="步骤2"></g-step>
      <g-step title="步骤3"></g-step>
      <g-step title="步骤4"></g-step>
      <g-step title="步骤5"></g-step>
    </g-steps>
  </div>
  <div>
    <g-checkbox>123456</g-checkbox>
    <g-switch-control v-model:checked="state.switchControl"
      checkedValue="1" unCheckedValue="2" @change="methods.changeSwitchControl"
    >开关</g-switch-control>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
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
