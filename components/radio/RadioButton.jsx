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
    status: {
      type: String,
      default: 'default',
      validator: (value) => ['', 'default', 'stop'].includes(value),
    },
  },
  setup(props, { attrs, slots, emit, expose }) {

    return () => {
      const customSlots = {
        ...slots,
        default: () => {
          return (
            <div class="cyber-radio-button-content">
              { slots.default?.() }
              {
                props.count || radioState.count == '0'
                  ? <span class="count">{ props.count }</span>
                  : undefined
              }
            </div>
          );
        }
      }

      return (
        <ARadioButton
          class={['cyber-radio-button', `cyber-radio-button-${props.status == 'stop' ? 'stop' : 'default'}`]}
          {...attrs}
          v-slots={customSlots}
        >
          
        </ARadioButton>
      );
    };
  },
});
