import { defineComponent, computed } from 'vue';
import { Tooltip } from 'ant-design-vue';

export default defineComponent({
  name: "GTooltip",
  props: {
    maxWidth: {
      type: [String, Number],
      default: '800px',
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const overlayStyle = computed(() => {
      let maxWidth = methods.disposeWidth(props.maxWidth);
      let obj = {};
      if(maxWidth) obj['maxWidth'] = maxWidth;
      return obj;
    });
    
    const methods = {
      disposeWidth(value) {
        if (typeof value == "number") {
          return value + "px";
        } else if (typeof value == "string") {
          if (value.includes("%")) return value;
          return value.replace("px", "") + "px";
        } else {
          return "";
        }
      },
    };

    return () => {
      return (
        <Tooltip
          autoAdjustOverflow
          color="#242e42"
          overlayStyle={overlayStyle.value}
          overlayClassName="g-tooltip-overlay"
          arrowPointAtCenter
          {...attrs}
          v-slots={slots}
        ></Tooltip>
      )
    }
  },
});
