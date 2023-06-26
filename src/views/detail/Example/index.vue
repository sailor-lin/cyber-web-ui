<template>
  <g-page-label
    :title="name"
    icon="icon-rongqi"
    showNav
    :navProps="{
      nav: [{ title: name }],
      back: '/overview',
      title: '示例',
    }"
  ></g-page-label>

  <g-module-title>容器</g-module-title>
  <!-- 容器详情 -->
  <g-page-header class="main-body-deepen h-80px">
    <!-- 名称 -->
    <div class="flex-center w-1/5">
      <g-icon isSvg icon="icon-gailan" size="32"></g-icon>
      <div class="ml-15px" style="width: 0; flex: 1;">
        <g-tooltip>
          <span class="ellipsis">{{ '示例' }}</span>
          <template #title>{{ '示例' }}</template>
        </g-tooltip>
        <div class="pod-desc">名称</div>
      </div>
    </div>
    <!-- 状态 -->
    <div class="w-1/10 pl-30px">
      <g-circle pattern="primary">{{ '运行中' }}</g-circle>
      <div class="pod-desc">状态</div>
    </div>
    <!-- 镜像 -->
    <div class="w-1/5 pl-30px">
      <g-tooltip>
        <div class="w-1/1 ellipsis">{{ detail.image || '-' }}</div>
        <template v-if="detail.image" #title>{{ detail.image }}</template>
      </g-tooltip>
      <div class="pod-desc">镜像</div>
    </div>
    <!-- 重启次数 -->
    <div class="w-1/10 pl-30px">
      <div class="number">0</div>
      <div class="pod-desc">重启次数</div>
    </div>
    <!-- 端口 -->
    <div class="w-1/10 pl-30px">
      <g-tooltip>
        <div class="ellipsis number">{{ detail.ports || '-' }}</div>
        <template v-if="detail.ports" #title>{{ detail.ports }}</template>
      </g-tooltip>
      <div class="pod-desc">端口</div>
    </div>
  </g-page-header>
</template>

<script setup>
const props = defineProps({
  cluster: String,
  namespace: String,
  kind: String,
  name: String,
});

const detail = ref({});

</script>

<style lang="less" scoped>
.pod-desc {
  .main-body-tip();
  margin-top: 6px;
}
</style>
