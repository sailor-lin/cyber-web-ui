<template>
  <Card title="input">
    <div style="display: flex; flex-wrap: wrap; align-items: center;">
      <c-input-number v-model:value="state.value1" required width="160"></c-input-number>
      <c-input-number v-model:value="state.value2" addonBefore="前缀" addonAfter="后缀" width="200"></c-input-number>
      <c-input-number v-model:value="state.value2" disabled width="200"></c-input-number>
      <c-input-number v-model:value="state.value2" disabled addonBefore="前缀" addonAfter="后缀" width="200"></c-input-number>
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