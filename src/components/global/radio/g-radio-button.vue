<template>
  <a-radio-button
    :value="value"
    :class="['g-radio-button', className]"
    v-bind="$attrs"
  >
    <div style="display: flex; align-items: center; justify-content: center;">
      <slot></slot>
      <span v-if="radioState.count || radioState.count == '0'" class="count">{{ radioState.count }}</span>
    </div>
  </a-radio-button>
</template>

<script setup>
import theme from '@/assets/style/theme.js';
const props = defineProps({
  value: {
    type: [String, Number],
    defult: "",
  },
  count: {
    type: String,
    default: '',
  },
  // 模式 - 按钮颜色
  pattern: {
    type: String,
    default: 'primary',
    validator: (value) => ["primary", "dark", "warning", "error", "classic"].includes(value),
  },
});
const radioState = reactive({
  count: computed(() => {
    const { count, warnCount, errorCount } = props;
    return isEmpty(errorCount) || isEmpty(warnCount) || count;
  })
});
const color = computed(() => {
  return theme[`btn-${props.pattern}`] || '';
});
const hoverColor = computed(() => {
  return theme[`btn-${props.pattern}-hover`] || '';
});
const activeColor = computed(() => {
  return theme[`btn-${props.pattern}-active`] || '';
});
const disabledColor = computed(() => {
  return theme[`btn-${props.pattern}-disabled`] || '';
});
const className = computed(() => {
  return `g-radio-button-pattern g-radio-button-${props.pattern}`
})
const isEmpty = (number) => {
  if(/[0-9]+/.test(number)) {
    return number == '0' ? '' : number;
  }
  return number;
}
</script>

<style lang="less">
.g-radio-button {
  height: 100%;
  border-radius: 1920px !important;
  text-align: center;
  overflow: hidden;
  border: none !important;
  background: #F4F6F9;
  // 默认样式
  &.ant-radio-button-wrapper {
    padding: 0 17px 0;
    // 通用统计样式
    .count {
      .flex-center();
      .number();
      .main-body-deepen();
      height: 20px;
      padding: 0 8px;
      margin-left: 10px;
      color: #FFFFFF;
      background: @dark-color;
      border-radius: 16px 16px 16px 16px;
    }
    // 默认未禁用样式
    &:not(.ant-radio-button-wrapper-disabled) {
      // 通用样式
      &.g-radio-button-pattern {
        // 选中通用样式
        &.ant-radio-button-wrapper-checked {
          background-color: v-bind(color);
          &:hover {
            background-color: v-bind(hoverColor);
          }
          &:active {
            background-color: v-bind(activeColor);
          }
          .count {
            background: #FFFFFF;
            color: @main-body-deepen-color;
          }
        }
        // 未选中通用样式
        &:not(.ant-radio-button-wrapper-checked) {
          &:hover {
            color: v-bind(hoverColor);
          }
          .count {
            color: #FFFFFF;
            background-color: v-bind(color);
          }
        }
      }
    }
    // 禁用样式
    &.ant-radio-button-wrapper-disabled {
      // 通用样式
      &.g-radio-button-pattern {
        // 选中通用样式
        &.ant-radio-button-wrapper-checked {
          color: rgba(255, 255, 255, .9);
          background-color: v-bind(disabledColor) !important;
          &:hover {
            background-color: v-bind(disabledColor);
          }
          &:active {
            background-color: v-bind(disabledColor);
          }
          .count {
            background: #FFFFFF;
            color: mix(@main-body-deepen-color, #FFFFFF, 50%);
          }
        }
        // 未选中通用样式
        &:not(.ant-radio-button-wrapper-checked) {
          .count {
            color: rgba(255, 255, 255, .9);
            background-color: v-bind(disabledColor);
          }
        }
      }
    }
  }
}
</style>
