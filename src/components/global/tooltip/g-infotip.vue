<template>
  <span class="g-infotip">
    <g-tooltip
      class="g-infotip"
      overlayClassName="g-infotip-overlay"
      placement="right"
      v-bind="$attrs"
    >
      <!-- destroyTooltipOnHide -->
      <template #title>
        <div class="g-information-content">
          <slot name="title"></slot>
        </div>
      </template>
      <g-icon icon="icon-information" size="14" :pattern="pattern" v-bind="$attrs"></g-icon>
    </g-tooltip>
    <span :class="['tip_text', className]">
      <slot></slot>
    </span>
  </span>
</template>

<script setup>
import theme from '@/assets/style/theme.js';
const props = defineProps({
  // 模式 - 按钮颜色
  pattern: {
    type: String,
    default: 'warning',
    validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
  },
});
// 按钮颜色
const color = computed(() => {
  return theme[`btn-${props.pattern}`];
});
// 按钮class名字
const className = computed(() => {
  return color.value ? `g-infotip-pattern g-infotip-${props.pattern}` : '';
});
</script>

<style lang="less">
.g-infotip {
  .flex-center-center();
  display: inline-flex;
}
.tip_text {
  margin-left: 4px;
  &.g-infotip-pattern {
    color: v-bind(color);
  }
}
.g-information-content {
  & div,
  & span {
    .text-wrap();
  }
}
.ant-tooltip.g-infotip-overlay {
  max-width: 320px;
  min-width: 200px;
  .ant-tooltip-inner {
    padding: 8px 12px;
  }
}
</style>
