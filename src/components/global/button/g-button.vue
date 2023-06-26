<template>
  <a-button
    :class="['g-button', className]"
    :danger="pattern == 'error' || $attrs.danger"
    v-bind="$attrs"
  >
    <slot></slot>
  </a-button>
</template>

<script setup>
import theme from '@/assets/style/theme.js';
const props = defineProps({
  width: {
    type: [String, Number],
    default: undefined,
  },
  // 模式 - 按钮颜色
  pattern: {
    type: String,
    default: '',
    validator: (value) => ["", "primary", "dark", "warning", "error", "gray", "classic"].includes(value),
  },
});

// 默认按钮全局模式
let defaultPattern = inject('defaultPattern', '');
const pattern = computed(() => {
  return props.pattern || defaultPattern?.value;
});
// 按钮最小宽度
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
// 按钮颜色
const color = computed(() => {
  return theme[`btn-${pattern.value}`];
});
// 按钮hover颜色
const hoverColor = computed(() => {
  return theme[`btn-${pattern.value}-hover`];
});
// 按钮active颜色
const activeColor = computed(() => {
  return theme[`btn-${pattern.value}-active`];
});
// 按钮disabled颜色
const disabledColor = computed(() => {
  return theme[`btn-${pattern.value}-disabled`];
});
// 按钮class名字
const className = computed(() => {
  return color.value ? `g-button-pattern g-button-${pattern.value}` : '';
});
</script>

<style lang="less" scoped>
.g-button {
  min-width: v-bind(width);
  &.g-button-pattern {
    // 未禁用模式
    &:not([disabled]) {
      // 填充模式
      &.ant-btn-primary:not(.ant-btn-background-ghost),
      &.ant-btn-dangerous:not(.ant-btn-background-ghost) {
        color: #FFFFFF;
        border-color: v-bind(color);
        background: v-bind(color);
        &:hover {
          color: #FFFFFF;
          border-color: v-bind(hoverColor);
          background: v-bind(hoverColor);
        }
        &:active {
          color: #FFFFFF;
          border-color: v-bind(activeColor);
          background-color: v-bind(activeColor);
        }
      }
      // 幽灵模式，虚线模式
      &.ant-btn-background-ghost,
      &.ant-btn-ghost,
      &.ant-btn-dashed {
        color: v-bind(color);
        border-color: v-bind(color);
        &:hover {
          color: v-bind(hoverColor);
          border-color: v-bind(hoverColor);
        }
        &:active {
          color: v-bind(activeColor);
          border-color: v-bind(activeColor);
        }
      }
      // 文本模式
      &.ant-btn-text {
        color: v-bind(color);
        &:hover {
          color: v-bind(hoverColor);
        }
        &:active {
          color: v-bind(activeColor);
        }
      }
      // 链接模式
      &.ant-btn-link {
        color: v-bind(color);
        border-color: transparent;
        background: transparent;
        box-shadow: none;
        &:hover {
          color: v-bind(hoverColor);
        }
        &:active {
          color: v-bind(activeColor);
        }
      }
    }
    // 禁用模式
    // 填充模式
    &[disabled] {
      &.ant-btn-primary:not(.ant-btn-background-ghost) {
        color: rgba(255, 255, 255, .9);
        background: v-bind(disabledColor);
        &:hover {
          background: v-bind(disabledColor);
        }
        &:active {
          background: v-bind(disabledColor);
        }
      }
      // 填充 - 幽灵属性
      &.ant-btn-background-ghost.ant-btn-primary,
      &.ant-btn-background-ghost.ant-btn-primary:hover,
      &.ant-btn-background-ghost.ant-btn-primary:focus,
      &.ant-btn-background-ghost.ant-btn-primary:active,
      // 幽灵属性
      &.ant-btn-ghost,
      &.ant-btn-ghost:hover,
      &.ant-btn-ghost:focus,
      &.ant-btn-ghost:active,
      // 虚线模式
      &.ant-btn-background-ghost,
      &.ant-btn-dashed,
      &.ant-btn-dashed:hover,
      &.ant-btn-dashed:focus,
      &.ant-btn-dashed:active {
        color: v-bind(disabledColor);
        border-color: v-bind(disabledColor);
        background: transparent;
        text-shadow: none;
        box-shadow: none;
      }
      // 链接模式
      &.ant-btn-link,
      &.ant-btn-link:hover,
      &.ant-btn-link:focus,
      &.ant-btn-link:active,
      // 文本模式
      &.ant-btn-text, 
      &.ant-btn-text:hover,
      &.ant-btn-text:focus,
      &.ant-btn-text:active {
        color: v-bind(disabledColor);
      }
    }
  }
  &:not(.g-button-pattern) {
    &.ant-btn-primary[disabled],
    &.ant-btn-primary[disabled]:hover,
    &.ant-btn-primary[disabled]:focus,
    &.ant-btn-primary[disabled]:active {
      border: none;
      background: #F4F6F9;
      box-shadow: 0px 4px 10px 0px rgba(77, 106, 171, 0.2);
    }
  }
}
</style>
