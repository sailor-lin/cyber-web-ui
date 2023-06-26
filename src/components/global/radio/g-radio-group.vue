<template>
  <a-radio-group
    button-style="solid"
    class="g-radio-group"
    v-model:value="state.radio"
    @change="methods.changeRadio"
    v-bind="$attrs"
  >
    <slot v-if="!state.isFirstRender"></slot>
  </a-radio-group>
</template>

<script setup>
import { changeHistoryState } from '@/utils/dispose';
const props = defineProps({
  value: {
    type: String,
    default: undefined,
  },
  // 默认值，推荐使用
  defaultValue: {
    type: String,
    default: undefined,
  },
  // changeHistoryState的保存的参数名称
  groupKey: {
    type: String,
    default: 'radio',
  },
  // changeHistoryState的cover参数
  cover: {
    type: Boolean,
    default: true,
  },
  // 缓存路由
  cacheRoute: {
    type: Boolean,
    default: true,
  },
  // 跳转重置路由
  replaceRoute: {
    type: Boolean,
    default: true,
  }
})
const $useRoute = useRoute();
const state = reactive({
  radio: undefined,
  isFirstRender: true, // 第一次渲染
  timeout: undefined,
})

const $emit = defineEmits(['update:value', 'change']);

const methods = {
  init() {
    watch(() => [$useRoute, props.value], ([route, value]) => {
      state.timeout && clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        if(state.isFirstRender) {
          state.radio = route.query?.radio || props.defaultValue || value;
          $emit('update:value', state.radio);
        } else {
          state.radio = value;
        }
        state.isFirstRender = false;
      })
    }, { immediate: true, deep: true })
  },
  // 切换tab栏
  changeRadio(e = {}) {
    let target = e?.target || {};
    target.value = target?.value || state.radio;
    // 缓存路由
    if(props.cacheRoute) {
      changeHistoryState({ [props.groupKey]: target.value }, props.cover, props.replaceRoute);
    }
    $emit('update:value', target.value);
    $emit('change', {
      ...e,
      target: {
        ...(e?.target || {}),
        ...target
      }
    })
  },
}

methods.init();
</script>

<style lang="less">
.g-radio-group {
  width: auto;
  border-radius: 1920px;
  background: #F4F6F9;
  border: 1px solid #F4F6F9;
  .ant-radio-button-wrapper {
    background: #F4F6F9;
  }
}
</style>