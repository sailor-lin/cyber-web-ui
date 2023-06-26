<template>
  <div class="g-breadcrumb">
    <!-- 返回图标 -->
    <g-icon
      icon="icon-fanhui"
      isSvg
      size="21"
      class="mr-10px pointer"
      @click="methods.back"
    ></g-icon>
    <span>{{ title }}</span>
    <!-- 自定义导航栏 -->
    <slot name="nav">
      <template v-for="(item, index) in nav" :key="index">
        <!-- 分隔符 -->
        <span class="separator">{{ separator }}</span>
        <!-- 可跳转 -->
        <g-router-link v-if="item.to" :to="item.to" :replace="item.replace || false">
          {{ item.title }}
        </g-router-link>
        <!-- 不可跳转 -->
        <span v-else>{{ item.title }}</span>
      </template>
    </slot>
  </div>
</template>

<script setup>
import { historyBack } from '@/utils/dispose';
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '标题'
  },
  // 面包屑列表
  nav: {
    type: Array,
    default: () => [],
  },
  // 默认返回路径
  back: {
    type: String,
    default: '',
  },
  separator: {
    type: String,
    default: '/',
  },
  // 自定返回方法
  onBack: Function,
});
const methods = {
  // 默认返回方法
  back() {
    // 若有自定义返回方法，则调用该方法
    if(props.onBack) {
      props.onBack();
      return;
    }
    // 默认返回方法，若无可返回路径，则跳转到指定返回路径
    historyBack(props.back);
  }
};
defineExpose({
  back: methods.back,
})
</script>

<style lang="less" scoped>
.g-breadcrumb {
  .flex-center();
  color: #666666;
  font-size: 14px;
  .separator {
    margin: 0 8px;
    color: @gray-color;
  }
  span,
  a {
    color: #666666;
    &:last-child {
      color: @dark-color;
    }
  }
}
</style>