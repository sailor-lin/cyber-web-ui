<template>
  <a-textarea
    autoComplete="off"
    placeholder="请输入"
    class="g-textarea"
    v-bind="$attrs"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-textarea>
</template>

<script setup>
</script>

<style lang="less" scoped>
.g-textarea {
  word-break: break-all;
  &.ant-input-textarea-show-count::after {
    position: relative;
    top: -29px;
    left: -14px;
  }
}
</style>
