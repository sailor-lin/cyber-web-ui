import Icon from '../icon/index';
import isWindows from '../_utils/is-windows.js';
import { Button as AButton } from 'ant-design-vue';
import { filterEmpty } from "../_utils/index.js";
import { reactive, defineComponent, onMounted, onUnmounted, getCurrentInstance, watch, nextTick } from "vue";

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
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { proxy } = getCurrentInstance();
    const collapseFormState = reactive({
      showMore: false,
      showHidden: false,
    });
    const changeShrink = () => {
      collapseFormState.showHidden = !collapseFormState.showHidden;
    };
    const listener = () => {
      nextTick(() => {
        if (proxy.$refs.collapseRef.children) {
          const { offsetTop } = proxy.$refs.collapseRef;
          let list = Array.from(proxy.$refs.collapseRef.querySelectorAll(".cyber-collapse-form-item"));
          collapseFormState.showMore = list.some((item) => item.offsetTop > offsetTop);
        }
      });
    };
    onMounted(() => {
      watch(() => proxy.$refs.rightRef, () => {
        listener();
      }, { immediate: true });
      if(isWindows()) {
        // 监听resize
        window.addEventListener('resize', listener);
      }
    });
    onUnmounted(() => {
      if(isWindows()) {
        // 取消监听resize
        window.removeEventListener('resize', listener);
      }
    });

    return () => {
      const customSlots = {
        default: () => {
          return filterEmpty(slots.default?.() || []).map((item) => {
            return (
              <div class="cyber-collapse-form-item">
                {item}
              </div>
            );
          });
        },
        right: () => {
          let list = filterEmpty(slots.right?.() || []);
          if(list.length) return <div class="cyber-collapse-form-right" ref="rightRef">{ list }</div>
          return undefined;
        },
        reloadIcon: () => {
          return slots.reloadIcon || <Icon icon="cyber-shuaxin" size="16"></Icon>;
        },
        controls: () => {
          return (
            <div class="cyber-collapse-action-box">
              {
                props.shrink
                  ? (
                    <div
                        class={["cyber-collapse-shrink",  { spread: collapseFormState.showHidden }]}
                        v-show={collapseFormState.showMore}
                        onClick={changeShrink}
                      >
                        <span v-show={!collapseFormState.showHidden}>更多</span>
                        <span v-show={collapseFormState.showHidden}>收起</span>
                        <Icon icon="cyber-collapse" size="16"></Icon>
                      </div>
                    )
                  : undefined
              }
              <AButton
                type="text"
                disabled={ props.loading }
                class="collapse-form-search-button"
                onClick={() => {
                  if (props.loading) return;
                  emit("search");
                }}
              >
                { customSlots.reloadIcon() }
              </AButton>
            </div>
          );
        }
      };

      return (
        <div
          class={[
            "cyber-collapse-form",
            { 'cyber-collapse-form-shrink': props.shrink },
            { show: collapseFormState.showHidden }
          ]}
          ref="collapseRef"
        >
          { customSlots.right() }
          { customSlots.controls() }
          { customSlots.default() }
        </div>
      );
    };
  },
});

collapseForm.install = (app) => {
  app.component(collapseForm.name, collapseForm);
};

export default collapseForm;
