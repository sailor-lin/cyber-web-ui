import {
  defineComponent,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  watch
} from "vue";
import { maintainStore } from '@/store';
import ControlIcon from '@/components/global/icon/g-control-icon.vue';
import { filterEmpty } from "@/utils/dispose/packaging.js";
import GIcon from '@/components/global/icon/g-icon.jsx';
import "./g-params.less";

export default defineComponent({
  name: "GParams",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    // 搜索控件按钮配置
    controlProps: {
      type: Object,
      default: () => ({
        pattern: 'primary',
      }),
    },
  },
  setup(props, { emit, slots }) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      showMore: false,
      showHidden: false,
    });
    const changeShrink = () => {
      state.showHidden = !state.showHidden;
    };
    const listener = () => {
      nextTick(() => {
        if (proxy.$refs.paramsRef.children) {
          const { offsetTop } = proxy.$refs.paramsRef;
          let list = Array.from(proxy.$refs.paramsRef.querySelectorAll(".g-param-item"));
          state.showMore = list.some((item) => item.offsetTop > offsetTop);
        }
      });
    };
    const $maintainStore = maintainStore();
    const symbolKey = Symbol('g-params');
    onMounted(() => {
      watch(() => proxy.$refs.rightRef, () => {
        listener();
      }, { immediate: true });
      // 监听resize
      $maintainStore.resizeState[symbolKey] = listener;
    });
    onUnmounted(() => {
      // 取消监听resize
      delete $maintainStore.resizeState[symbolKey];
    });

    return () => {
      // 默认插槽
      let defaultSlot = filterEmpty(slots.default?.() || []).map((item) => {
        item.props.width = item.props.width || '168px';
        return (
          <div className="g-param-item">
            {item}
          </div>
        );
      });
      // 右插槽
      let rightSlot = filterEmpty(slots.right?.() || []);
      // 默认控件
      const controls = (() => {
        let pattern = props.controlProps.pattern || 'primary';
        return (
          <div className={["action-box"].join(" ")}>
            <div
              className={["shrink", state.showHidden ? "spread" : "", `${pattern}-color`].join(" ")}
              vShow={state.showMore}
              onClick={changeShrink}
            >
              <span vShow={!state.showHidden}>更多</span>
              <span vShow={state.showHidden}>收起</span>
              <GIcon icon="icon-hei" size="16" pattern={pattern}></GIcon>
            </div>
            <div
              class={["search-button", props.loading ? 'disabled' : '' ].join(' ')}
              onClick={() => {
                if (props.loading) return;
                proxy.$emit("search");
              }}
            >
              <ControlIcon
                disabled={ props.loading }
                {...props.controlProps}
                pattern={pattern}
              ></ControlIcon>
            </div>
          </div>
        );
      })();

      return (
        <div
          className={["g-params", state.showHidden ? "show" : ""].join(" ")}
          ref="paramsRef"
        >
            <div className="g-param-right" ref="rightRef">{rightSlot}</div>
            {controls}
            {defaultSlot}
        </div>
      );
    };
  },
});
