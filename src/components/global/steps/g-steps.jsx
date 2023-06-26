import GIcon from '@/components/global/icon/g-icon.jsx';
import { defineComponent, cloneVNode } from "vue";
import { filterEmpty } from "@/utils/dispose/packaging.js";
import "./g-steps.less";

export default defineComponent({
  name: "GStep",
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
            return child.type.name == "GStep";
          }).map((child, index, list) => {
            return (
              <>
                {
                  cloneVNode(child, {
                    active: props.current >= index,
                    stepText: props.current > index 
                      ? () => h(GIcon, {
                          isSvg: true,
                          icon: "icon-a-Vector6",
                          size: "8",
                        })
                      : child.props.stepText || index + 1 + '',
                  })
                }
                {
                  index < list.length - 1
                    ? <div class="g-step-separate"></div>
                    : undefined
                }
              </>
            )
          });
        }
      }
      return (
        <div class="g-steps">
          { customSlots.default() }
        </div>
      )
    };
  },
});
