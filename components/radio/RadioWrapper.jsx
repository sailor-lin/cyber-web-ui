import { defineComponent } from "vue";
import RadioGroup from "./RadioGroup";

export default defineComponent({
  name: 'CRadioWrapper',
  props: {
    onChange: Function,
  },
  setup(props, { attrs, slots, emit, expose }) {
    function onChange(e) {
      if(props.onChange) props.onChange(e);
    }
    return () => {
      return (
        <div class="cyber-radio-warpper">
          <RadioGroup {...attrs} onChange={onChange} v-slots={slots} />
        </div>
      )
    }
  }
})
