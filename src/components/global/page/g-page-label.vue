<template>
  <div class="g-page-label">
    <!-- 顶部返回导航栏 -->
    <div class="g-page-label-nav" v-if="showNav">
      <slot name="nav">
        <g-breadcrumb
          ref="breadcrumbRef"
          v-bind="navProps"
        ></g-breadcrumb>
      </slot>
    </div>
    <!-- 通用标题栏 -->
    <div class="g-page-label-body">
      <div class="g-page-label-body-left">
        <div class="title-icon">
          <!-- 图标插槽 -->
          <slot name="icon">
            <g-icon v-if="icon" isSvg :icon="icon" size="64"></g-icon>
          </slot>
        </div>
        <div class="g-page-label-content">
          <div class="g-page-label-title">
            <!-- 标题插槽 -->
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="g-page-label-tips">
            <!-- 提示插槽 -->
            <slot name="tips">{{ tips }}</slot>
            <a :href="documentLink" class="document_link" v-if="documentLink">了解更多</a>
          </div>
        </div>
      </div>
      <!-- 右插槽 -->
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: "标题",
  },
  // 提示
  tips: {
    type: String,
    default: "",
  },
  // 图标
  icon: {
    type: String,
    default: "",
  },
  // 显示返回导航栏
  showNav: {
    type: Boolean,
    default: false,
  },
  // 导航栏配置
  navProps: {
    type: Object,
    default: {},
  },
  // 文档链接
  documentLink: {
    type: String,
  },
});
const breadcrumbRef = ref();
const methods = {
  // 默认返回方法
  back() {
    unref(breadcrumbRef)?.back?.();
  }
}

defineExpose({
  back: methods.back,
});
</script>

<style lang="less">
.g-page-label {
  width: 100%;
  min-height: 103px;
  background: #ffffff;
  border-radius: @border-radius-base;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.14);
  margin-bottom: 20px;
  &-nav {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #eff1f6;
  }
  .g-page-label-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 25px;
    &-left {
      .flex-center();
      width: 0;
      flex: 1;
    }
    .title-icon {
      margin-right: 14px;
    }
    .g-page-label-content {
      width: 0;
      flex: 1;
      .g-page-label-title {
        .big-title();
        font-size: 26px;
        letter-spacing: 1px;
      }
      .g-page-label-tips {
        line-height: 20px;
        margin-top: 12px;
        .document_link {
          color: @classic-color;
        }
      }
    }
  }
}
</style>
