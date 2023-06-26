<template>
  <a-input
    :class="['g-input', round ? 'g-input-round' : '']"
    autoComplete="off"
    placeholder="请输入"
    :type="inputState.type"
    v-bind="$attrs"
    v-model:value="inputState.value"
    @input="methods.inputHandler"
  >
    <template #suffix v-if="search || password">
      <slot name="suffix">
        <g-icon
          v-if="password"
          :icon="inputState.showPassword ? 'icon-xianshimima' : 'icon-yincangmima'"
          size="16"
          style="cursor: pointer"
          @click="inputState.showPassword = !inputState.showPassword"
        ></g-icon>
        <g-icon v-else-if="search" icon="icon-sousuo1" size="16" @click="methods.searchClickHandler"></g-icon>
      </slot>
    </template>
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-input>
</template>

<script setup>
const props = defineProps({
  value: String,
  width: {
    type: [String, Number],
    default: '100%',
  },
  search: {
    type: Boolean,
    default: false,
  },
  // 输入类型
  inputType: {
    type: String,
    default: 'string',
    validator: (value) => ["string", "number", "integer"].includes(value),
  },
  // 是否为密码输入框
  password: {
    type: Boolean,
    default: false,
  },
  // 圆角
  round: {
    type: Boolean,
    default: false,
  }
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
const inputState = reactive({
  value: undefined,
  showPassword: false,
  type: computed(() => {
    return props.password
      ? inputState.showPassword ? 'text' : 'password'
      : 'text';
  })
});
const $emit = defineEmits(['update:value', 'input']);
const methods = {
  formatter(value) {
    if(!value && /undefined|null/.test(value)) return;
    let type = props.inputType;
    // 字符串
    if(type == 'string') return value;
    // 数字
    else if(type == 'number' && !/^\-?((0|[1-9]\d*)\.)?\d*$/.test(value)) {
      let string = '';
      let isMinus = /^-/.test(value);
      (value + '').replace(/。/g, '.').split('.').forEach((item, index, list) => {
        string += item.replace(/[^\d]/g, '');
        if(index == 0 && list.length > 1) {
          if(!string) string = '0';
          string += '.';
        }
      })
      return (isMinus ? '-' : '') + string;
    }
    // 整数
    else if(type == 'integer' && !/^\-?\d*$/.test(value)) {
      let string = '';
      let isMinus = /^-/.test(value);
      (value + '').split('').forEach((item) => {
        string += item.replace(/[^\d]/g, '');
      })
      return (isMinus ? '-' : '') + string;
    }
    // /^((0|[1-9]\d*)\.)?\d+$/ 判断是否为数字
    return value;
  },
  inputHandler(options) {
    inputState.value = methods.formatter(inputState.value);
    $emit('update:value', inputState.value);
    $emit('input', options);
  },
  async searchClickHandler() {},
}
watch(() => props.value, (value) => {
  if(value != inputState.value) {
    inputState.value = methods.formatter(value);
  }
}, { immediate: true });
</script>

<style lang="less">
.g-input {
  &.ant-input,
  &.ant-input-affix-wrapper,
  &.ant-input-group-wrapper,
  & > .ant-input-wrapper.ant-input-group {
    width: v-bind(width);
    border-radius: @border-radius-base;
  }
  &::placeholder,
  & .ant-input::placeholder {
    .main-body-tip();
  }
  .ant-input-group-addon {
    background-color: #F4F6F9;
  }
  &.ant-input-affix-wrapper {
    .ant-input-group > .ant-input:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .ant-input-group > .ant-input:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  // 圆角
  &.g-input-round {
    border-radius: 100px;
    background-color: #F5F7FA;
    input {
      background-color: #F5F7FA;
    }
  }
}
</style>
