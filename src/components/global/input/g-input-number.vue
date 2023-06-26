<template>
  <g-input
    :class="['g-input-number', inputNumberState.numberMode]"
    v-model:value="inputNumberState.value"
    :addonBefore="addonBefore"
    :disabled="disabled"
    :inputType="inputType"
    :round="false"
    :search="false"
    :password="false"
    @blur="methods.blurHandler"
  >
    <!-- default mode -->
    <template #addonBefore v-if="inputNumberState.numberMode == 'default'">
      <span
        :class="[
          'g-input-addon-before pointer',
          { disabled: inputNumberState.value == min || disabled }
        ]"
        @click="methods.clickHandler(false)"
      >
        <g-icon icon="icon-Icon_Reduce_24"></g-icon>
      </span>
    </template>
    <template #addonAfter v-if="inputNumberState.numberMode == 'default'">
      <span
        :class="[
          'g-input-addon-after pointer',
          { disabled: inputNumberState.value == max || disabled }
        ]"
        @click="methods.clickHandler(true)"
      >
        <g-icon icon="icon-Icon_Plus_24"></g-icon>
      </span>
    </template>
    <!-- wrap mode -->
    <template #addonAfter v-else>
      <span class="flex">
        <div class="g-input-number-control">
          <div
            :class="[
              'g-input-number-up',
              { disabled: inputNumberState.value == max || disabled }
            ]"
            @click="methods.clickHandler(true)"
          >
            <g-icon icon="icon-a-Icon_Drop-down_161"></g-icon>
          </div>
          <div
            :class="[
              'g-input-number-down',
              { disabled: inputNumberState.value == min || disabled }
            ]"
            @click="methods.clickHandler(false)"
          >
            <g-icon icon="icon-a-Icon_Drop-down_161"></g-icon>
          </div>
        </div>
        <span class="g-input-addon-after" v-if="$slots.addonAfter || addonAfter">
          <slot>{{ addonAfter }}</slot>
        </span>
      </span>
    </template>
  </g-input>
</template>

<script setup>
import bigjs from '@/utils/bigjs';
const props = defineProps({
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
});
const inputNumberState = reactive({
  value: '0',
  numberMode: computed(() => {
    return props.addonAfter || props.addonBefore ? "wrap" : "default";
  })
});
const $emit = defineEmits(['update:value', 'blur']);
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
    }
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
    $emit('update:value', Number(value));
  },
  /**
   * @function 失去焦点处理
   * @param {object} options 
   */
  blurHandler(options) {
    nextTick(() => {
      let value = inputNumberState.value;
      methods.valueHandler(value, /\.$/.test(value));
      $emit('blur', options);
    })
  },
}
watch(() => props.value, (value) => {
  if(value != inputNumberState.value) {
    methods.valueHandler(value);
  }
}, { immediate: true });
</script>

<style lang="less">
.g-input-number.g-input {
  &.default {
    .ant-input-group-addon {
      padding: 0;
      .g-input-addon-before,
      .g-input-addon-after {
        display: table-cell;
        padding: 5.6px 11px;
        background-color: #FFFFFF;
        transition: all 0.2s linear;
        border-radius: @border-radius-base;
        &:hover {
          background-color: #f8fbff;
        }
        &:active {
          background-color: #e5e8ec;
        }
        &.disabled {
          background-color: #F4F6F9;
          cursor: not-allowed;
          .g-icon {
            color: rgba(0, 0, 0, 0.25);
          }
        }
      }
    }
  }
  &.wrap {
    .ant-input-group-addon:last-child {
      padding: 0;
      .g-input-number-control {
        .flex-column();
        background: #FFFFFF;
        line-height: 1;
        border-radius: 0;
        border-right: 1px solid @border-color-base;
        .g-input-number-up,
        .g-input-number-down {
          padding: 0.9px 6px;
          cursor: pointer;
          &:hover {
            background-color: #f8fbff;
          }
          &:active {
            background-color: #e5e8ec;
          }
          &.disabled {
            background-color: #F4F6F9;
            cursor: not-allowed;
            .g-icon {
              color: rgba(0, 0, 0, 0.25);
            }
          }
        }
        .g-input-number-up {
          position: relative;
          transform: rotateX(180deg);
          border-top: 1px solid @border-color-base;
        }
        &:last-child {
          border-radius: 0 @border-radius-base @border-radius-base 0;
          border-right: 0;
        }
      }
      .g-input-addon-after {
        display: table-cell;
        padding: 5.6px 11px;
        background-color: #F4F6F9;
        transition: all 0.2s linear;
        border-radius: @border-radius-base;
      }
    }
  }
  input {
    font-family: @oswald;
  }
}
</style>