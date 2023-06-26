<template>
  <g-button class="g-control-icon" type="link" :disabled="disabled" v-bind="$attrs">
    <g-icon
      :size="size"
      :icon="icon"
      :isSvg="isSvg"
      pattern=""
    ></g-icon>
  </g-button>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'icon-shuaxin',
  },
  size: {
    type: String,
    default: '16px',
  },
  isSvg: {
    type: Boolean,
    default: false
  },
})
</script>

<style lang="less" scoped>
.g-control-icon {
  padding: 0;
}
</style>
