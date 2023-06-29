<template>
  <span :class="['g-tag-card', { 'g-tag-card-annotation': type == 'annotations' }]">
    <div class="g-tag-card-label">{{ label }}</div>
    <div ref="textRef" class="g-tag-card-text">
      <g-tooltip>
        {{ value }}
        <template #title v-if="showTooltip">{{ value }}</template>
      </g-tooltip>
    </div>
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
  // label内容
  label: {
    type: String,
    default: 'label',
  },
  // value内容
  value: {
    type: String,
    default: 'value',
  },
  // 标签类型
  type: {
    type: String,
    default: "label",
    validator: (value) => ["label", "annotations"].includes(value),
  },
});
const textRef = ref();
// 按钮颜色
const color = computed(() => {
  return theme[`btn-${props.pattern}`] || theme[`btn-primary`];
});
const showTooltip = computed(() => {
  let target = textRef.value?.children?.[0];
  return (target?.scrollWidth || 0) > (target?.clientWidth || 0);
})
</script>

<style lang="less" scoped>
.g-tag-card {
  display: inline-flex;
  position: relative;
  max-width: 100%;
  &::before {
    content: "";
    display: block;
    width: 17px;
    height: 34px;
    clip-path: polygon(0% 50%, 100% 0%, 100% 100%);
    background: v-bind(color);
  }
  &::after {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background-color: #FFFFFF;
    position: absolute;
    border-radius: 50%;
    left: calc(17px - 4px);
    top: 50%;
    transform: translateY(-50%);
  }
  &.g-tag-card-annotation {
    &::before {
      clip-path: ellipse(100% 50% at 100% 50%);
    }
  }
  .g-tag-card-label {
    .flex-center();
    color: #FFFFFF;
    white-space: nowrap;
    padding: 8px 14px 8px 15px;
    background-color: v-bind(color);
  }
  .g-tag-card-text {
    .flex-center();
    .ellipsis();
    flex: 1;
    color: v-bind(color);
    white-space: nowrap;
    padding: 8px 14px 8px 12px;
    background-color: #a4b2d480;
    border-radius: 0 @border-radius-base @border-radius-base 0;
  }
}
</style>
