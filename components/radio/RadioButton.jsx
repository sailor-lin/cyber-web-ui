import { defineComponent } from "vue";
import { RadioButton as ARadioButton } from "ant-design-vue";

export default defineComponent({
  name: 'CRadioButton',
  props: {
    // 统计
    count: {
      type: String,
      default: '',
    },
    // 状态
    dark: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {

    return () => {
      const radioButtonSlots = {
        ...slots,
        default: () => {
          return (
            <div class="cyber-radio-button-content">
              { slots.default?.() }
              {
                props.count || props.count == '0'
                  ? <span class="count">{ props.count }</span>
                  : undefined
              }
            </div>
          );
        }
      }

      return (
        <ARadioButton
          class={['cyber-radio-button', { 'cyber-radio-button-dark': props.dark }]}
          {...attrs}
          v-slots={radioButtonSlots}
        ></ARadioButton>
      );
    };
  },
});
