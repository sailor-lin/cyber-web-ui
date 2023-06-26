import { Form } from 'ant-design-vue';
import { defineComponent } from 'vue';
import './g-form.less';

export default defineComponent({
  name: 'GForm',
  props: {
    // 前置必填符号
    preRequired: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { attrs, emit, expose, slots }) {
    const { proxy } = getCurrentInstance();

    expose({
      clearValidate: (nameList) => proxy.$refs.formRef?.clearValidate(nameList),
      resetFields: (nameList) => proxy.$refs.formRef?.resetFields(nameList),
      scrollToField: (name, options) => proxy.$refs.formRef?.scrollToField(name, options),
      validate: (nameList) => proxy.$refs.formRef?.validate(nameList),
      validateFields: (nameList) => proxy.$refs.formRef?.validateFields(nameList),
    })

    return () => (
      <Form
        class={['g-form', props.preRequired ? '' : 'g-form-pre-required'].join(" ")}
        ref="formRef"
        {...props}
        {...attrs}
        v-slots={slots}
      ></Form>
    )
  },
});
