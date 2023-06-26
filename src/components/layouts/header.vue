<template>
  <div class="g-header">
    <div class="header-body">
      <div class="left">
        <slot name="icon">
          <g-icon isSvg icon="icon-liangyiyun-hei" style="width: 150px; height: 70px;"></g-icon>
        </slot>
        <slot name="left"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({});
</script>

<style lang="less">
.g-header {
  width: 100%;
  height: 56px;
  position: relative;
  background: #FFFFFF;
  .header-body {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    position: fixed;
    left: 0;
    top: 0;
    background-color: inherit;
    .left {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
