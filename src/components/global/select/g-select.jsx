import GIcon from '@/components/global/icon/g-icon.jsx';
import { Select, SelectOption, Tag } from 'ant-design-vue';
import { dictStore } from '@/store';
import { defineComponent, computed, reactive } from 'vue';
import { filterEmpty } from "@/utils/dispose/packaging.js";
import './g-select.less';

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
    // 字典key值
    dictCode: {
      type: String,
      default: "",
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
  setup(props, { attrs, emit, expose, slots }) {
    const $dictStore = dictStore();
    const selectState = reactive({
      open: false,
      selectValue: undefined,
      options: computed(() => {
        let list = props.options || [];
        if (props.dictCode) {
          const { fieldNames } = props;
          list = $dictStore[props.dictCode] || [];
        }
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
            <Tag closable={closable} class="ant-select-selection-item flex-center" onClose={onClose}>
              <span class="mr-2px">{ methods.getTagLabel(label) }</span>
            </Tag>
          );
        },
        suffixIcon: () => {
          return slots.suffixIcon?.() || (
            <GIcon
              isSvg
              icon="icon-lujing"
              class="arrow_icon"
            ></GIcon>
          );
        }
      }
      const selectRef = (type = 'select') => {
        let className = (type == 'select'
          ? [
              props.label ? '' : `g-select`,
              props.round ? 'g-select-round' : '',
            ]
          : []).join(' ');
        return (
          <Select
            placeholder="请输入"
            onGetPopupContainer={methods.getPopupContainer}
            style={`width: ${width.value}`}
            v-slots={customSlots}
            {...{ ...props, ...attrs }}
            class={[className, props.arrowTurn ? 'g-select-arrow-turn' : ''].join(' ')}
            v-model:open={selectState.open}
            onDropdownVisibleChange={methods.dropdownVisibleChange}
          ></Select>
        )
      };
      const labelSelectRef = () => {
        let className = [
          `g-select g-select-group`,
        ].join(" ");
        return (
          <div class={className}>
            <div
              class="g-select-label pointer"
              onClick={methods.openSwitch}
            >{ props.label }</div>
            { selectRef('label') }
          </div>
        )
      };

      return props.label
        ? labelSelectRef()
        : selectRef();
    };
  },
});
