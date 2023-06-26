<template>
  <span :class="['g-label', className]">
    <slot></slot>
  </span>
</template>

<script setup>
import theme from '@/assets/style/theme.js';
const props = defineProps({
  // 模式 - 按钮颜色
  pattern: {
    type: String,
    default: 'primary',
    validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
  },
  color: String,
});
const color = computed(() => {
  if(props.color) return props.color;
  return props.pattern && theme[`${props.pattern}-color`] || '';
});
const className = computed(() => {
  if(color.value) return `g-label-pattern`;
  return '';
});
</script>

<style lang="less" scoped>
.g-label {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 12px;
  line-height: 1.6;
  color: #242E42;
  background-color: transparent;
  border: 1px solid #D9E2EB;
  border-radius: 24px;
  &.g-label-pattern {
    color: #FFFFFF;
    background-color: v-bind(color);
    border-color: v-bind(color);
  }
}
</style>
