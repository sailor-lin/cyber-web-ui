<template>
  <a-skeleton
    class="g-skeleton"
    active
    :title="false"
    v-bind="$attrs"
  ></a-skeleton>
</template>

<script setup>
</script>

<style lang="less">
.g-skeleton {
  &.ant-skeleton.ant-skeleton-active {
    .ant-skeleton-content {
      .ant-skeleton-paragraph {
        margin: 0;
        li {
          height: 18px;
          margin: 0 0 20px 0 !important;
        }
      }
    }
  }
}
</style>
