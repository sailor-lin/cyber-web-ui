import { defineComponent, reactive, watchEffect } from "vue";
import { RadioGroup as ARadioGroup } from "ant-design-vue";
import RadioButton from './RadioButton';

export default defineComponent({
  name: 'CRadioGroup',
  props: {
    options: Array,
  },
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      const customSlots = {
        ...slots,
        default: () => {
          return Array.isArray(props.options)
            ? props.options.map(item => {
                return (
                  <RadioButton
                    { ...item }
                  >{ item.label }</RadioButton>
                )
              })
            : slots.default?.();
        },
      }
      return (
        <ARadioGroup
          class="cyber-radio-group"
          v-slots={customSlots}
          {...attrs}
          option-type='button'
          button-style="solid"
        ></ARadioGroup>
      );
    };
  },
});
