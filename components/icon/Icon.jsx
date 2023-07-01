import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "GIcon",
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
            style={{fontSize: size.value}}
          >
            { slots.default?.() }
          </span>
    };
  },
});
