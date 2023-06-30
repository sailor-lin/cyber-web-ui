import theme from '../../public/theme.js'
import { defineComponent, computed } from "vue";
import { Badge } from 'ant-design-vue';

export default defineComponent({
  name: "GBadge",
  props: {
    numberStyle: {
      type: Object,
      default: () => {},
    },
    // 模式 - 按钮颜色
    pattern: {
      type: String,
      default: '',
      validator: (value) => ["", "primary", "warning", "error", "dark", "gray", "classic"].includes(value),
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const numberStyle = computed(() => {
      let obj = {};
      if(!props.numberStyle?.backgroundColor) {
        obj.backgroundColor = theme[`${props.pattern}-color`];
      }
      
      return {
        ...props.numberStyle || {},
        ...obj,
      };
    });
    
    return () => {
      return (
        <Badge
          class="g-badge"
          {...{...props, ...attrs}}
          numberStyle={numberStyle.value}
          v-slots={slots}
        ></Badge>
      );
    };
  },
});
