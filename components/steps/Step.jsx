import { defineComponent } from "vue";

export default defineComponent({
  name: "CStep",
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
        <div class={['cyber-step', props.active ? 'cyber-step-active' : ''].join(' ')}>
          <div class="cyber-step-icon">{ customSlots.stepText() }</div>
          <div class="cyber-step-title">{ customSlots.default() }</div>
        </div>
      )
    };
  },
});
