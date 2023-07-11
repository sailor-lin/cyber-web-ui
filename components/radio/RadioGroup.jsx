import isWindows from '../_utils/is-windows.js';
import { changeHistoryState, analysisHistory } from "../_utils/history.js";
import { defineComponent, reactive, onMounted, onUnmounted, watchEffect } from "vue";
import { RadioGroup as ARadioGroup } from "ant-design-vue";


export default defineComponent({
  name: 'CRadioGroup',
  props: {
    value: {
      type: String,
      default: undefined,
    },
    // changeHistoryState的保存的参数名称
    groupKey: {
      type: String,
      default: 'radio',
    },
    // changeHistoryState的cover参数
    cover: {
      type: Boolean,
      default: true,
    },
    // 缓存路由
    cacheRoute: {
      type: Boolean,
      default: true,
    },
    // 跳转重置路由
    replaceRoute: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const state = reactive({
      radio: undefined,
      timeout: undefined,
      isRender: false,
    });

    const methods = {
      // 切换tab栏
      changeRadio(e = {}) {
        let target = e?.target || {};
        target.value = target?.value || state.radio;
        // 缓存路由
        if(props.cacheRoute) {
          changeHistoryState({ [props.groupKey]: target.value }, props.cover, props.replaceRoute);
        }
        emit('update:value', target.value);
        emit('change', {
          ...e,
          target: {
            ...(e?.target || {}),
            ...target
          }
        })
      },
      // 监听url变化
      listenerHistory() {
        let { params } = analysisHistory(window.location.href);
        if(params[props.groupKey] != state.radio && params[props.groupKey]) {
          state.radio = params[props.groupKey];
          emit('update:value', state.radio);
        }
      },
    };
    
    methods.listenerHistory();

    watchEffect(() => {
      state.timeout && clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        if(props.value || props.value === 0) {
          state.radio = props.value;
        }
        state.isRender = true;
      });
    })

    if(isWindows()) {
      onMounted(() => {
        window.addEventListener('popstate', methods.listenerHistory);
        window.addEventListener('hashchange', methods.listenerHistory);
        window.addEventListener('pushState', methods.listenerHistory);
        window.addEventListener('replaceState', methods.listenerHistory);
      });
      onUnmounted(() => {
        window.removeEventListener('popstate', methods.listenerHistory);
        window.removeEventListener('hashchange', methods.listenerHistory);
        window.removeEventListener('pushState', methods.listenerHistory);
        window.removeEventListener('replaceState', methods.listenerHistory);
      });
    }

    return () => {
      return (
        <ARadioGroup
          v-model:value={state.radio}
          class="cyber-radio-group"
          onChange={methods.changeRadio}
          v-slots={state.isRender ? slots : {}}
          {...{...attrs, "onUpdate:value": undefined}}
          button-style="solid"
        ></ARadioGroup>
      );
    };
  },
});
