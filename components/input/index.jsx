import Icon from '../icon/index.jsx';
import { Input as AInput } from "ant-design-vue";
import bigjs from '../_utils/big/index.js';
import { inputFormat } from '../_utils/formatter.js';
import { reactive, defineComponent, computed, watch } from "vue";

const InputNumber = defineComponent({
  name: 'CInputNumber',
  props: {
    value: {
      type: [String, Number],
    },
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    addonBefore: {
      type: String,
    },
    addonAfter: {
      type: String,
      default: '',
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputType: {
      type: String,
      default: 'number',
      validator: (value) => ["number", "integer"].includes(value),
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const inputNumberState = reactive({
      value: '0',
      minValue: computed(() => {
        return props.required
          ? props.min == -Infinity ? '0' : props.min + ''
          : undefined;
      }),
      numberMode: computed(() => {
        return props.addonAfter || props.addonBefore ? "wrap" : "default";
      }),
    });
    const methods = {
      /**
       * @function 加/减 运算
       * @param {boolean} isUp 是否为加运算
       */
      clickHandler(isUp = true) {
        if(props.disabled) return;
        let value = inputNumberState.value;
        if(value && !/undefined/.test(value)) {
          value = bigjs.plus(isUp ? 1 : -1, inputNumberState.value);
        } else {
          value = props.min != -Infinity
            ? props.min
            : '0';
        };
        methods.valueHandler(value, /\.$/.test(inputNumberState.value));
      },
      /**
       * @function 处理数值逻辑
       * @param {number|string} value 数值
       * @param {boolean} endCircle 是否以小数点结尾
       */
      valueHandler(value, endCircle = false) {
        // 将value转为Number类型
        if(typeof value == 'string' && value.length > 0) value = Number(value);
        if(!isNaN(value) && (value || /0/.test(value))) {
          // value不能超出最大值和最小值
          if(value >= props.max) value = props.max;
          if(value <= props.min) value = props.min;
        } else {
          // 若value不为Number类型，则设置value为undefined
          value = undefined;
        }
        // 若value为undefined，则不处理
        value = /number|string/.test(typeof value)
          ? value
          // 若为必填，则给予最小值或0
          : props.required
            ? props.min != -Infinity
              ? props.min + ''
              : '0'
            : undefined;
        // 判断是否给结尾添加小数点
        inputNumberState.value = value + (endCircle ? '.' : '');
        emit('update:value', Number(value));
      },
      /**
       * @function change处理器
       * @param {object} options 
       */
      changeHandler(options) {
        console.log('changeHandler', options.target.value)
        let value = inputFormat(options.target.value, props.inputType);
        inputNumberState.value = value || inputNumberState.minValue || '';
        options.target.value = value || inputNumberState.minValue || '';
        emit('update:value', inputNumberState.value || undefined);
        emit('change', options);
      },
    };
    
    watch(() => props.value, (value) => {
      if(value != inputNumberState.value) {
        let formatValue = inputFormat(value, props.inputType);
        if(formatValue) methods.valueHandler(formatValue);
        else {
          emit('update:value', inputNumberState.minValue);
          emit('blur', inputNumberState.minValue)
        }
      }
    }, { immediate: true });

    return () => {
      const customSlots = {
        ...slots,
        addonBefore: () => {
          if(inputNumberState.numberMode != 'default') return;
          return (
            <span
              class={[
                'cyber-input-addon-before pointer',
                { disabled: inputNumberState.value == props.min || props.disabled }
              ]}
              onClick={ () => methods.clickHandler(false) }
            >
              <Icon icon="cyber-reduce"></Icon>
            </span>
          )
        },
        addonAfter: () => {
          return inputNumberState.numberMode == 'default'
            ? (
                <span
                  class={
                    [
                      'cyber-input-addon-after pointer',
                      { disabled: inputNumberState.value == props.max || props.disabled }
                    ]
                  }
                  onClick={ () => methods.clickHandler(true) }
                >
                  <Icon icon="cyber-plus"></Icon>
                </span>
              )
            : (
                <span class="cyber-input-group-addon">
                  <div class="cyber-input-number-control">
                    <div
                      class={
                        [
                          'cyber-input-number-up',
                          { disabled: inputNumberState.value == props.max || props.disabled }
                        ]
                      }
                      onClick={ () => methods.clickHandler(true) }
                    >
                      <Icon icon="cyber-drop-down"></Icon>
                    </div>
                    <div
                      class={
                        [
                          'cyber-input-number-down',
                          { disabled: inputNumberState.value == props.min || props.disabled }
                        ]
                      }
                      onClick={ () => methods.clickHandler(false) }
                    >
                      <Icon icon="cyber-drop-down"></Icon>
                    </div>
                  </div>
                  {
                    slots.addonAfter || props.addonAfter
                      ? (
                          <span class="cyber-input-addon-after">
                            { props.addonAfter }
                          </span>
                        )
                      : undefined
                  }
                  
                </span>
              )
        },
      };

      return (
        <AInput
          class={['cyber-input-number', inputNumberState.numberMode]}
          addonBefore={props.addonBefore}
          onChange={methods.changeHandler}
          v-model:value={inputNumberState.value}
          v-slots={customSlots}
        ></AInput>
      );
    };
  },
});

export default {
  install: function (app) {
    app.component(InputNumber.name, InputNumber);
  }
};