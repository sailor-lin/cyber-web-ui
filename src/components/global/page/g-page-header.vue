<template>
  <div
    :class="[
      'g-page-body-header',
      { 'g-page-body-header-scroll': scroll },
    ]"
    :style="{ padding: padding ? '0 20px' : '0' }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  scroll: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Boolean,
    default: true,
  }
})
</script>

<style lang="less">
.g-page-body-header {
  .flex-center();
  width: 100%;
  min-height: 56px;
  background: #FFFFFF;
  flex-wrap: wrap;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.06);
  border-radius: @border-radius-base;
  margin-bottom: 20px;
  &.g-page-body-header-scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>