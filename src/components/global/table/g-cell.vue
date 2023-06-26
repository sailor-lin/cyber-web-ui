<template>
  <div class="g-cell">
    <slot name="icon">
      <g-icon isSvg :icon="icon" size="24" class="mr-12px" v-if="icon"></g-icon>
    </slot>
    <div class="g-cell-body">
      <!-- 标题 -->
      <g-router-link v-if="to" :to="cellState.path" class="g-cell-router-link">
        <slot>{{ title }}</slot>
      </g-router-link>
      <slot v-else>
        <span>{{ title }}</span>
      </slot>
      <!-- 提示 -->
      <span class="g-cell-tip" v-if="tips || $slots.tips">
        <slot name="tips">{{ tips }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 图标
  icon: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '标题'
  },
  // 提示文本
  tips: {
    type: String,
    default: ''
  },
  // 跳转路径
  to: {
    type: String,
    default: undefined
  },
  // 前缀
  prefix: {
    type: String,
    default: undefined,
  }
});
// 公共路由前缀
const routePrefix = inject("routePrefix", '');
const cellState = reactive({
  // 前缀
  prefix: computed(() => {
    return typeof props.prefix != 'undefined' ? props.prefix : routePrefix.value;
  }),
  // 拼接路径
  path: computed(() => {
    return (cellState.prefix || '') + props.to;
  })
});
</script>

<style lang="less" scoped>
.g-cell {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-height: 40px;
  .g-cell-body {
    .ellipsis();
    .flex-column();
    white-space: nowrap;
    .g-cell-router-link {
      .ellipsis();
      .inline-block();
      color: @dark-color;
      max-width: 100%;
      height: 18px;
    }
    .g-cell-tip {
      .main-body-tip();
      .ellipsis();
      width: 100%;
    }
  }
}
</style>
