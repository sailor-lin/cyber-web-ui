<template>
  <Card title="cell">
    <c-cell icon="cyber-tool" title="工具" tips="工具提示"></c-cell>
    <c-cell-dict :options="options" value="0"></c-cell-dict>
    <c-cell-dict :options="options" value="1"></c-cell-dict>
  </Card>
</template>

<script setup>
import Card from '../components/Card.vue';

const options = [
  { label: '正常', value: '0', icon: 'cyber-yunweiguanli' },
  { label: '异常', value: '1', icon: 'cyber-tool', tips: '异常提示' },
]
</script>