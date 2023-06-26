import Icon from '../icon/index';
import { maintainStore } from '../_utils/store';
import isWindows from '../_utils/is-windows.js';
import { Button as AButton } from 'ant-design-vue';
import { filterEmpty } from "../_utils/index.js";
import { reactive, defineComponent, onMounted, onUnmounted, ref, watch, nextTick } from "vue";

const collapseForm = defineComponent({
  name: "CCollapseForm",
  props: {
    // 加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否使用收缩功能
    shrink: {
      type: Boolean,
      default: false,
    },
    showReload: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const rightRef = ref();
    const collapseRef = ref();
    const collapseFormState = reactive({
      showMore: false,
      showHidden: false,
      resizeSymbol: Symbol('collapse-form'),
    });
    const changeShrink = () => {
      collapseFormState.showHidden = !collapseFormState.showHidden;
    };
    const listener = () => {
      nextTick(() => {
        if (collapseRef.value?.children) {
          const { offsetTop } = collapseRef.value;
          let list = Array.from(collapseRef.value.querySelectorAll(".cyber-collapse-form-item"));
          collapseFormState.showMore = list.some((item) => item.offsetTop > offsetTop);
        }
      });
    };
    onMounted(() => {
      watch(() => rightRef.value, () => {
        listener();
      }, { immediate: true });
      if(isWindows()) {
        // 监听resize
        maintainStore().resizeState[collapseFormState.resizeSymbol] = listener;
      }
    });
    onUnmounted(() => {
      if(isWindows()) {
        // 取消监听resize
        delete maintainStore().resizeState[collapseFormState.resizeSymbol];
      }
    });

    return () => {
      function defaultSlot() {
        return filterEmpty(slots.default?.() || []).map((item) => {
          if(/Select$/.test(item.type.name)) {
            item.props = {
              getPopupContainer: (triggerNode) => {
                return triggerNode.parentNode.parentNode
              },
              ...(item.props || {}),
            }
          }
          return (
            <div class="cyber-collapse-form-item">
              {item}
            </div>
          );
        });
      }
      function rightSlot() {
        let list = filterEmpty(slots.right ? slots.right() : []);
        if(list.length) return <div class="cyber-collapse-form-right" ref={rightRef}>{ list }</div>
      }
      function reloadSlot() {
        if(!props.showReload) return;
        return (
            <AButton
              type="text"
              disabled={ props.loading }
              class="collapse-form-search-button"
              onClick={() => {
                if (props.loading) return;
                emit("search");
              }}
            >
              { slots.reloadIcon ? slots.reloadIcon() : <Icon icon="cyber-shuaxin" size="16"></Icon> }
            </AButton>
        );
      }
      function shrinkSlot() {
        if(!props.shrink) return;
        return (
          <div
            class={["cyber-collapse-shrink",  { spread: collapseFormState.showHidden }]}
            v-show={collapseFormState.showMore}
            onClick={changeShrink}
          >
            <span v-show={!collapseFormState.showHidden}>更多</span>
            <span v-show={collapseFormState.showHidden}>收起</span>
            <Icon icon="cyber-collapse" size="16"></Icon>
          </div>
        );
      }

      return (
        <div
          class={[
            "cyber-collapse-form",
            { 'cyber-collapse-form-shrink': props.shrink },
            { show: collapseFormState.showHidden }
          ]}
          ref={collapseRef}
        >
          { rightSlot() }
          <div class="cyber-collapse-action-box">
            { shrinkSlot() }
            { reloadSlot() }
          </div>
          { defaultSlot() }
        </div>
      );
    };
  },
});

collapseForm.install = (app) => {
  app.component(collapseForm.name, collapseForm);
};

export default collapseForm;
