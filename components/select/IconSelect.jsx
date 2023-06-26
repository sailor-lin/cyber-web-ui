import Icon from '../icon';
import { Input as AInput, Popover as APopover, FormItemRest as AFormItemRest } from 'ant-design-vue';
import { defineComponent, reactive, watchEffect, ref, unref, nextTick } from 'vue';
import iconJson from '../style/iconfont/iconfont.json';

export default defineComponent({
  name: 'CIconSelect',
  props: {
    value: String,
    icons: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请点击选择图标'
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const inputRef = ref();

    const iconState = reactive({
      value: undefined,
      visible: false,
      searchValue: undefined,
      iconList: [],
      timeout: undefined,
    });

    function iconClickHandler(icon) {
      iconState.value = icon;
      iconState.visible = false;
    }

    function disposeJson(list, value) {
      iconState.timeout && clearTimeout(iconState.timeout);
      iconState.timeout = setTimeout(() => {
        iconState.iconList = []
        list.forEach(item => {
          let prefix = item.css_prefix_text;
          item.glyphs.forEach(citem => {
            let icon = `${prefix}${citem.font_class}`;
            if(!value || icon.includes(value)) {
              iconState.iconList.push(icon);
            }
          });
        });
      });
    }

    function onFocus(e) {
      nextTick(() => {
        e.target.blur?.();
        setTimeout(() => {
          unref(inputRef)?.focus?.();
        }, 200);
      })
    }

    watchEffect(() => iconState.value = props.value);
    watchEffect(() => emit('update:value', iconState.value));
    watchEffect(() => {
      let list = [iconJson, props.icons].filter(item => item);
      disposeJson(list, iconState.searchValue);
    });

    return () => {
      function defaultSlot() {
        const inputSlots = {
          prefix() {
            return iconState.value
             ? <Icon icon={iconState.value} isSvg={true} size="16"/>
             : undefined
          }
        }
        return (
          <AInput
            v-slots={inputSlots}
            {...{ ...attrs, 'onUpdate:value': undefined }}
            disabled={props.disabled}
            placeholder={props.placeholder}
            v-model:value={iconState.value}
            onFocus={onFocus}
          ></AInput>
        )
      }
      function contentSlot() {
        const inputSlots = {
          suffix() {
            return <Icon icon="cyber-sousuo" size="16" color="#BDBDBD"/>
          }
        }
        return (
          <div style="width: 500px">
            <AFormItemRest>
              <AInput
                ref={inputRef}
                v-model:value={iconState.searchValue}
                allowClear={true}
                placeholder="请输入图标名称"
                v-slots={inputSlots}
              ></AInput>
            </AFormItemRest>
            <div class="icon-select-body">
              <div class="icon-select-container">
                {
                  iconState.iconList.map(item => {
                    return (
                      <div class="icon-select-item" onClick={() => iconClickHandler(item)}>
                        <Icon size="16" icon={item} isSvg={true}></Icon>
                        <span>{ item }</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        )
      }
      return (
        props.disabled
          ? defaultSlot()
          : <APopover
              v-model:visible={iconState.visible}
              trigger="click"
              placement="bottomLeft"
              v-slots={{ default: defaultSlot, content: contentSlot }}
            ></APopover>
      )
    }
  },
});
