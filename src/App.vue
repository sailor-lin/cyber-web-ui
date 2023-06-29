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
    <g-badge dot>
      <g-icon isSvg icon="cyber-shibai" size="32"></g-icon>
    </g-badge>
    <g-badge count="10" pattern="warning">
      <g-icon isSvg icon="cyber-chenggong" size="32"></g-icon>
    </g-badge>
    <g-tooltip max-width="200px">
      1123
      <template #title>123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233123312331233</template>
    </g-tooltip>
  </div>
  <div>
    <g-tag pattern="warning" closable>123</g-tag>
    <g-tag pattern="dark" shape="round">123</g-tag>
    <g-tag pattern="error" closable shape="round">456</g-tag>
    <g-tag pattern="primary">
      <template #icon>
        <g-icon icon="cyber-shibai" size="20" isSvg></g-icon>
      </template>
    </g-tag>
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
.abc {
  color: @primary-color;
}
</style>
