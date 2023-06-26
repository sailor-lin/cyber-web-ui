import { Select as ASelect } from 'ant-design-vue';
import Icon from '../icon/index';
import { defineComponent, computed } from "vue";

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
    // 下拉框形状
    shape: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'round'].includes(value),
    },
    size: {
      type: String,
      default: 'default',
      validator: (value) => ['large', 'default', 'small'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterOption: Function,
    fieldNames: {
      type: Object,
      default: () => {}
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
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

    function getPopupContainer(triggerNode) {
      return triggerNode.parentNode;
    }
    function filterOption(inputValue, treeNode) {
      if(props.filterOption) return props.filterOption(inputValue, treeNode);
      let label = props.fieldNames?.label || 'label';
      return treeNode[label]?.includes?.(inputValue);
    }

    return () => {
      const selectSlots = {
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
      function selectRef(type = 'select') {
        let className = (type == 'select'
          ? [
              props.label ? '' : `cyber-select`,
              props.shape == 'round' ? 'cyber-select-round' : '',
            ]
          : []);
        return (
          <ASelect
            placeholder="请选择..."
            getPopupContainer={getPopupContainer}
            style={`width: ${width.value}`}
            v-slots={selectSlots}
            {...{ ...props, ...attrs }}
            class={[className]}
            filterOption={filterOption}
          ></ASelect>
        )
      };
      function labelSelectRef() {
        let className = [
          `cyber-select cyber-select-group`,
        ];
        return (
          <div class={className} style={{width: width.value ? 'auto' : '100%'}}>
            <div
              class={[
                'cyber-select-label',
                { 'cyber-select-label-disabled': props?.disabled },
                { 'ant-select-lg': props.size == 'large' },
                { 'ant-select-sm': props.size == 'small' },
              ]}
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
