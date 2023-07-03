import Icon from '../icon/Icon.jsx';
import { defineComponent, cloneVNode, h } from "vue";
import { filterEmpty } from "../_utils/index.js";

export default defineComponent({
  name: "CSteps",
  props: {
    // 当前active项
    current: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      const customSlots = {
        ...slots,
        default: () => {
          return filterEmpty(slots.default?.() || []).filter(child => {
            return child.type.name == "CStep";
          }).map((child, index, list) => {
            return (
              <>
                {
                  cloneVNode(child, {
                    active: props.current >= index,
                    stepText: props.current > index 
                      ? () => h(Icon, {
                          isSvg: true,
                          icon: "cyber-vector",
                          size: "8",
                        })
                      : child.props?.stepText || index + 1 + '',
                  })
                }
                {
                  index < list.length - 1
                    ? <div class="cyber-step-separate"></div>
                    : undefined
                }
              </>
            )
          });
        }
      }
      return (
        <div class="cyber-steps">
          { customSlots.default() }
        </div>
      )
    };
  },
});
