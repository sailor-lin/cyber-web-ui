import { Select as ASelect } from 'ant-design-vue';
import Icon from '../icon/index';
import { defineComponent, reactive, computed } from "vue";

const Select = defineComponent({
  name: 'CSelect',
  props: {
    // 选择框宽度
    width: {
      type: [String, Number],
      default: '',
    },
    // 选择框前缀文本
    label: {
      type: String,
      default: '',
    },
    // 最长字数
    maxTagTextLength: {
      type: Number,
    },
    // 圆角
    round: {
      type: Boolean,
      default: false,
    },
    // 箭头翻转
    arrowTurn: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    
    const selectState = reactive({
      open: false,
      selectValue: undefined,
    });

    const width = computed(() => {
      if (typeof props.width == "number") {
        return props.width + "px";
      } else if (typeof props.width == "string") {
        if (props.width.includes("%")) return props.width;
        return props.width.replace("px", "") + "px";
      } else {
        return;
      }
    });

    const methods = {
      getPopupContainer(triggerNode) {
        return triggerNode.parentNode.parentNode.parentNode;
      },
      dropdownVisibleChange(open) {
        selectState.open = open;
      },
      openSwitch() {
        selectState.open = !selectState.open;
      },
      getTagLabel(label) {
        let title = typeof label == 'string' ? label : label?.[0].props?.title || '';
        if(props.maxTagTextLength && title.length > props.maxTagTextLength) {
          title = title.slice(0, props.maxTagTextLength) + '...'
        }
        return title;
      }
    }

    expose({
      openSwitch: methods.openSwitch
    });
    return () => {
      const customSlots = {
        ...slots,
        suffixIcon: () => {
          return slots.suffixIcon?.() || (
            <Icon
              isSvg
              icon="cyber-xiajiantou"
              class="arrow_icon"
            ></Icon>
          );
        }
      }
      const selectRef = (type = 'select') => {
        let className = (type == 'select'
          ? [
              props.label ? '' : `cyber-select`,
              props.round ? 'cyber-select-round' : '',
            ]
          : []).join(' ');
        return (
          <ASelect
            placeholder="请输入"
            onGetPopupContainer={methods.getPopupContainer}
            style={`width: ${width.value}`}
            v-slots={customSlots}
            {...{ ...props, ...attrs }}
            class={[className, props.arrowTurn ? 'cyber-select-arrow-turn' : ''].join(' ')}
            v-model:open={selectState.open}
            onDropdownVisibleChange={methods.dropdownVisibleChange}
          ></ASelect>
        )
      };
      const labelSelectRef = () => {
        let className = [
          `cyber-select cyber-select-group`,
        ].join(" ");
        return (
          <div class={className} style={{width: width.value ? 'auto' : '100%'}}>
            <div
              class="cyber-select-label pointer"
              onClick={methods.openSwitch}
            >{ props.label }</div>
            { selectRef('label') }
          </div>
        )
      };
      
      return props.label
        ? labelSelectRef()
        : selectRef();
    }
  },
});

export default Select;
