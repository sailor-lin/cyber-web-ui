import Icon from '../icon/Icon.jsx';
import { Select, SelectOption, Tag } from 'ant-design-vue';
import { defineComponent, computed, reactive } from 'vue';
import { filterEmpty } from "../_utils/index.js";

export default defineComponent({
  name: "GSelect",
  props: {
    // 选择框宽度
    width: {
      type: [String, Number],
      default: '',
    },
    // 自定义下拉数据
    options: {
      type: Array,
      default: undefined,
    },
    // 自定义回显key
    fieldNames: {
      type: Object,
      default: () => {
        return { label: "label", value: "value" };
      },
    },
    // 选择框前缀文本
    addonBefore: {
      type: String,
      default: '',
    },
    // 最长字数
    maxTagTextLength: {
      type: Number,
    },
    // 选择框形状
    shape: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'round'].includes(value),
    },
    // 箭头翻转
    arrowTurn: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, emit, expose, slots }) {
    const selectState = reactive({
      open: false,
      selectValue: undefined,
      options: computed(() => {
        let list = props.options || [];
        return list;
      }),
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
        console.log('label', label)
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
        default: () => {
          if(filterEmpty(slots.default?.() || []).length) return slots.default();
          const { fieldNames } = props;
          let list = (selectState.options || []).map(item => {
            return (
              <SelectOption
                value={item[fieldNames.value]}
                label={item[fieldNames.label] }
                disabled={item.disabled}
                title={item.title}
                key={item.key}
              ></SelectOption>
            );
          });
          return list;
        },
        tagRender: ({ label, onClose, closable }) => {
          return (
            <Tag closable={closable} onClose={onClose}>
              <span class="mr-2px">{ methods.getTagLabel(label) }</span>
            </Tag>
          );
        },
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
              props.addonBefore ? '' : `g-select`,
              props.shape == 'round' ? 'g-select-round' : '',
            ]
          : []).join(' ');
        return (
          <Select
            placeholder="请输入"
            onGetPopupContainer={methods.getPopupContainer}
            style={`width: ${width.value}`}
            v-slots={customSlots}
            {...{ ...props, ...attrs }}
            class={[className, props.arrowTurn ? 'g-select-arrow-turn' : '']}
            v-model:open={selectState.open}
            onDropdownVisibleChange={methods.dropdownVisibleChange}
          ></Select>
        )
      };
      const labelSelectRef = () => {
        let className = [`g-select g-select-group`];
        return (
          <div class={className} style={{width: width.value ? 'auto' : '100%'}}>
            <div
              class="g-select-label"
              onClick={methods.openSwitch}
            >{ props.addonBefore }</div>
            { selectRef('label') }
          </div>
        )
      };

      return props.addonBefore
        ? labelSelectRef()
        : selectRef();
    };
  },
});
