<template>
  <Card title="input">
    <div style="display: flex; align-items: center;">
      <span>必填：</span>
      <c-input-number v-model:value="state.value1" required style="width: 160px;"></c-input-number>
      <c-input-number v-model:value="state.value2" addonBefore="前缀" addonAfter="后缀" style="width: 200px;"></c-input-number>
      <c-input-number v-model:value="state.value2" disabled style="width: 200px;"></c-input-number>
      <c-input-number v-model:value="state.value2" disabled addonBefore="前缀" addonAfter="后缀" style="width: 200px;"></c-input-number>
    </div>
  </Card>
</template>

<script setup>
import { reactive } from 'vue';
import Card from '../components/Card.vue';
const state = reactive({
  value1: undefined,
  value2: undefined,
});
</script>