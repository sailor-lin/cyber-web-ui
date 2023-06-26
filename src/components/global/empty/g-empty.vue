<template>
  <a-empty :image="simpleImage" v-bind="$attrs"></a-empty>
</template>

<script setup>
import { Empty } from 'ant-design-vue';

const simpleImage = computed(() => {
  return Empty.PRESENTED_IMAGE_SIMPLE
});
</script>