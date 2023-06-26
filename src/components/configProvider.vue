<template>
  <a-config-provider :locale="zhCN" v-bind="$attrs">
    <slot></slot>
  </a-config-provider>
</template>


<script setup>
import { maintainStore } from '@/store';
import zhCN from "ant-design-vue/es/locale/zh_CN";
const $maintainStore = maintainStore();
const configState = reactive({
  resizeId: undefined,
  resizeIndex: 0,
  timeoutInstance: [], // timeout实例
  isShowScrollBar: false,
});
const methods = {
  // 监听窗口resize
  listenerResize() {
    configState.isShowScrollBar = document.body.scrollWidth > window.innerWidth;
    // 公共resize方法
    methods.uniformResize();
  }, 
  // 统一resize
  uniformResize() {
    if (configState.resizeId) {
      configState.timeoutInstance.forEach(timeout => {
        timeout && clearTimeout(timeout);
      });
      window.cancelAnimationFrame(configState.resizeId);
    }
    configState.resizeId = window.requestAnimationFrame(() => {
      // 更新图表大小
      try {
        let symbolKeys = Object.getOwnPropertySymbols($maintainStore.resizeState);
        symbolKeys = [...symbolKeys.slice(configState.resizeIndex), ...symbolKeys];
        symbolKeys.forEach((key, index, list) => {
          const timeout = setTimeout(() => {
            configState.resizeIndex = list.length - 1 == index ? 0 : index;
            $maintainStore.resizeState[key]();
          }, 1);
          configState.timeoutInstance.push(timeout);
        });
      } catch (e) {
        throw Error(e);
      }
    })
  },
  // 监听url跳转
  listerBeforeunload(event) {
    // 阻止默认行为
    event.preventDefault();
    event.returnValue = '';
    // 弹出确认窗口
    if($maintainStore.leaveIntercept) {
      confirm();
    }
  },
};

onMounted(() => {
  methods.listenerResize();
  window.addEventListener("resize", methods.listenerResize);
  // 拦截url跳转
  if(process.env.NODE_ENV == "production") {
    watch(() => $maintainStore.leaveIntercept, (value) => {
      if(value) window.addEventListener('beforeunload', methods.listerBeforeunload);
      else window.removeEventListener('beforeunload', methods.listerBeforeunload);
    });
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", methods.listenerResize);
});

// 是否显示滚动条
provide("isShowScrollBar", computed(() => configState.isShowScrollBar));
</script>
