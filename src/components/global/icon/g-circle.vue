<template>
  <span
    :class="['g-circle', className, { 'animation': animation }]"
  >
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
    validator: (value) => ["primary", "dark", "warning", "error", "gray", "classic"].includes(value),
  },
  animation: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '8px',
  },
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
// 按钮颜色
const color = computed(() => {
  return theme[`btn-${props.pattern}`];
})
const className = computed(() => {
  return color.value ? `g-circle-pattern g-circle-${props.pattern}` : '';
});
</script>

<style lang="less" scoped>
@keyframes circle-scale {
  from {
    transform: scale(1) translateY(-50%);
    opacity: 1;
  }
  to {
    transform: scale(0.5) translateY(-50%);
    opacity: 0;
  }
}
.g-circle {
  position: relative;
  white-space: nowrap;
  padding-left: calc(8px + v-bind(size));
  &::before {
    content: "";
    display: block;
    width: v-bind(size);
    height: v-bind(size);
    border-radius: 50%;
    background-color: @btn-primary;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &.g-circle-pattern::before {
    background-color: v-bind(color);
  }
  &.animation::before {
    transform: scale(1) translateY(-50%);
    animation: circle-scale infinite 1s alternate linear;
  }
}
</style>
