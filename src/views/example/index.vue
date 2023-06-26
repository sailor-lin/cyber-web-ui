<template>
  <g-page-label title="示例" icon="icon-rongqi">
    <template #tips></template>
  </g-page-label>

  <!-- radio切换栏 -->
  <g-page-header>
    <g-radio-group defaultValue="0" v-model:value="state.radio" :replaceRoute="false" @change="methods.changeRadio">
      <g-radio-button
        v-for="(item, index) in tabGounp"
        :value="index + ''"
        :count="item.count + ''"
      >{{ item.label }}</g-radio-button>
    </g-radio-group>
  </g-page-header>

  <Module v-if="state.radio == '0'"></Module>
  <Module v-if="state.radio == '1'"></Module>
</template>

<script setup>
import bus from '@/utils/bus';
import { openBeforeRouteLeave } from '@/utils/dispose';
import Module from './modules/Module.vue';

const tabGounp = reactive([
  {
    label: '模块1',
    count: 2,
  },
  {
    label: '模块2',
    count: 2,
  },
])
const state = reactive({
  radio: undefined,
});
const methods = {
  changeRadio() {
    bus.emit("CHANGE_BODY_LOADING", true);
    setTimeout(() => {
      bus.emit("CHANGE_BODY_LOADING", false);
    }, 700);
  }
}
// 打开离开页面拦截
openBeforeRouteLeave();
</script>

<style lang="less" scoped>
</style>
