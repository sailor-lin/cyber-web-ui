import { defineComponent, computed } from "vue";

const Icon = defineComponent({
  name: "CIcon",
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
            class="cyber-iconfont icon cyber-svg-icon"
            style={{ fontSize: size.value, minWidth: size.value }}
          >
            <use xlink:href={`#${props.icon}`}></use>
          </svg>
        // 字体图标
        : <span
            class={['cyber-iconfont', /^cyber\-/.test(props.icon) ? 'cyber-icon' : 'iconfont', props.icon]}
            style={{ fontSize: size.value, color: props.color || undefined }}
          >
            { slots.default?.() }
          </span>
    };
  },
});

Icon.install = function (app) {
  app.component(Icon.name, Icon);
};

export default Icon;
