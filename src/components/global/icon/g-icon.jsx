import { defineComponent } from "vue";
import theme from '@/assets/style/theme.js';
import "./g-icon.less";

export default defineComponent({
  name: "GStep",
  props: {
    // 图标标识
    icon: {
      type: String,
      default: "",
    },
    // 图标大小
    size: {
      type: String,
      default: '12px',
    },
    // 自定义颜色
    color: {
      type: String,
      default: '',
    },
    // 是否为svg
    isSvg: {
      type: Boolean,
      default: false
    },
    // 模式 - 按钮颜色
    pattern: {
      type: String,
      default: 'dark',
      validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const size = computed(() => {
      if(typeof props.size == 'number') {
        return props.size + 'px'
      } else if(typeof props.size == 'string') {
        return props.size.replace('px', '') + 'px'
      } else {
        return 
      }
    });
    const color = computed(() => {
      if(props.color) return props.color;
      return props.pattern ? theme[`btn-${props.pattern}`] : '';
    });
    return () => {
      return props.isSvg
        // svg图标
        ? <svg
            class="g-svg-icon icon svg-icon"
            style={{ fontSize: size.value, minWidth: size.value }}
          >
            <use xlink:href={`#${props.icon}`}></use>
          </svg>
        // 字体图标
        : <span
            class={['g-icon icon iconfont', props.icon].join(' ')}
            style={{fontSize: size.value, color: color.value}}
          >
            { slots.default?.() }
          </span>
    };
  },
});
