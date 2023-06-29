import { Tag } from 'ant-design-vue';
import theme from '/public/theme.js'
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "GTag",
  props: {
    // 模式 - 按钮颜色
    pattern: {
      type: String,
      default: '',
      validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
    },
    // 选择框形状
    shape: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'round'].includes(value),
    },
  },
  setup(props, { attrs, emit, expose, slots }) {

    const color = computed(() => {
      return theme[`${props.pattern}-color`];
    });

    return () => {
      return (
        <Tag
          class={['g-tag', props.shape == 'round' ? 'g-round-tag' : ''].join(' ')}
          color={color.value}
          {...{...props, ...attrs}}
          v-slots={slots}
        ></Tag>
      )
    }
  }
});
