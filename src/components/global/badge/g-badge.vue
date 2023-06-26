<template>
  <a-badge
    :class="['g-badge']"
    :dot="dot"
    :color="color"
    v-bind="$attrs"
  >
    <slot></slot>
  </a-badge>
</template>

<script setup>
import theme from '@/assets/style/theme.js'
const props = defineProps({
  dot: {
    type: Boolean,
    default: false,
  },
  // 模式 - 按钮颜色
  pattern: {
    type: String,
    default: 'error',
    validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
  },
  size: {
    type: String,
    default: '6px',
  },
});
const color = computed(() => {
  return theme[`${props.pattern}-color`];
});
const size = computed(() => {
  if(typeof props.size == 'number') {
    return props.size + 'px'
  } else if(typeof props.size == 'string') {
    return props.size.replace('px', '') + 'px'
  } else {
    return 
  }
});
</script>

<style lang="less">
.g-badge {
  .ant-scroll-number.ant-badge-dot {
    width: v-bind(size);
    height: v-bind(size);
  }
}
</style>
