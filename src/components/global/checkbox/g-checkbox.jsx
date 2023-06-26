import { defineComponent } from "vue";
import { Checkbox } from 'ant-design-vue';
import "./g-checkbox.less";

export default defineComponent({
  name: "GCheckbox",
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    return () => {
      return (
        <Checkbox
          class="g-checkbox"
          attrs={{...props, ...attrs}}
          v-slots={slots}
        >
        </Checkbox>
      )
    };
  },
});
