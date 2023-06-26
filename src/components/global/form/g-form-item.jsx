import { FormItem } from 'ant-design-vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GFormItem',
  props: {},
  setup(props, { attrs, emit, expose, slots }) {

    return () => (
      <FormItem
        class="g-form-item"
        {...props}
        {...attrs}
        v-slots={slots}
      ></FormItem>
    )
  },
});
