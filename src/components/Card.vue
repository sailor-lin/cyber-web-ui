<template>
  <div class="card">
    <div class="card-title" v-if="$attrs.title">{{ $attrs.title }}</div>
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.card {
  padding: 24px;
  border-radius: 4px;
  border: 1px solid #D9E2EB;
  margin: 24px 0;
  box-sizing: border-box;
  position: relative;
  background: white;
  .card-title {
    position: absolute;
    left: 24px;
    top: 0;
    transform: translateY(-50%);
    color: #2D3D48;
    background: white;
    padding: 0 12px;
    font-size: 18px;
  }
}
</style>
