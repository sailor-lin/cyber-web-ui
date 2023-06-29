import { Badge } from 'ant-design-vue';
import theme from '/public/theme.js'
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "GBadge",
  props: {
    dot: {
      type: Boolean,
      default: false,
    },
    // 模式 - 按钮颜色
    pattern: {
      type: String,
      default: 'error',
      validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
    },
  },
  setup(props, { attrs, emit, expose, slots }) {
    const color = computed(() => {
      return theme[`${props.pattern}-color`];
    });

    return () => {
      return (
        <Badge
          class="g-badge"
          color={color.value}
          {...{...props, ...attrs}}
        >
          { slots.default?.() }
        </Badge>
      )
    }
  }
});
