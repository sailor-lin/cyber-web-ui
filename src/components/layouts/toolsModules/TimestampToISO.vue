<template>
  <div :class="['timestamp_to_iso']">
    <div :class="['switch_body', { reverse: state.reverse }]">
      <div>
        <div class="label">时间戳（单位秒）</div>
        <g-input v-model:value="state.timestamp"></g-input>
      </div>
      <g-icon icon="icon-zhuanhuan" size="21" class="switch_icon" @click="methods.switch"></g-icon>
      <div>
        <div class="label">ISO时间</div>
        <g-input v-model:value="state.iso"></g-input>
      </div>
    </div>
    <div style="display: flex; flex-direction: row-reverse; margin-top: 12px;">
      <g-button type="primary" @click="methods.conversion">转换</g-button>
    </div>
  </div>
</template>

<script setup>
import dayjs from '@/utils/dayjs';
const props = defineProps({
  tool: {
    type: Object,
    default: () => {},
  },
});
const state = reactive({
  reverse: false,
  timestamp: '',
  iso: '',
});
const methods = {
  switch() {
    state.reverse = !state.reverse;
  },
  conversion() {
    if(state.reverse) {
      state.timestamp = Math.floor(new Date(state.iso).getTime() / 1000);
    } else {
      state.iso = dayjs(state.timestamp * 1000).toISOString();
    }
  }
}
</script>

<style lang="less" scoped>
.timestamp_to_iso {
  margin-top: 20px;
  .switch_body {
    display: flex;
    align-items: center;
    .switch_icon {
      margin: 0 12px;
      cursor: pointer;
    }
    &.reverse {
      flex-direction: row-reverse;
    }
  }
  .conversion_tip {
    color: @error-color;
  }
}
</style>