import { defineComponent } from "vue";
import "./g-step.less";

export default defineComponent({
  name: "GStep",
  props: {
    // 标题
    title: {
      type: String,
      default: '',
    },
    // 步骤文本
    stepText: {
      type: [String, Function],
      default: '',
    },
    // 是否已触发
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      const customSlots = {
        default: () => {
          return props.title || slots.default?.();
        },
        stepText: () => {
          return typeof props.stepText == 'function'
            ? props.stepText?.()
            : props.stepText;
        },
      }
      return (
        <div class={['g-step', props.active ? 'g-step-active' : ''].join(' ')}>
          <div class="g-step-icon">{ customSlots.stepText() }</div>
          <div class="g-step-title">{ customSlots.default() }</div>
        </div>
      )
    };
  },
});
