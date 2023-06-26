import { defineComponent,  reactive, onMounted, onUnmounted, watch } from 'vue';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from "ant-design-vue/es/locale/zh_CN";
import isWindows from '../_utils/is-windows';
import { maintainStore } from '../_utils/store';

const ConfigProvider = defineComponent({
  name: 'CConfigProvider',
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    const $maintainStore = maintainStore();
    
    const configState = reactive({
      resizeId: undefined,
      resizeIndex: 0,
      timeoutInstance: [], // timeout实例
    });

    // 监听窗口resize
    function listenerResize() {
      // 公共resize方法
      uniformResize();
    }
    // 统一resize
    function uniformResize() {
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
    }
    // 监听url跳转
    function listerBeforeunload(event) {
      // 阻止默认行为
      event.preventDefault();
      event.returnValue = '';
      // 弹出确认窗口
      if($maintainStore.leaveIntercept) {
        confirm();
      }
    }

    if(isWindows()) {
      onMounted(() => {
        listenerResize();
        window.addEventListener("resize", listenerResize);
        // 拦截url跳转
        watch(() => $maintainStore.leaveIntercept, (value) => {
          if(value) window.addEventListener('beforeunload', listerBeforeunload);
          else window.removeEventListener('beforeunload', listerBeforeunload);
        });
      });
      onUnmounted(() => {
        window.removeEventListener("resize", listenerResize);
      });
    }

    return () => {
      return (
        <AConfigProvider
          locale={zhCN}
          {...attrs}
          v-slots={slots}
        ></AConfigProvider>
      )
    }
  }
});

ConfigProvider.install = (app) => {
  app.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;
