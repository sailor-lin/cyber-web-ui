<template>
  <template v-if="state.hasChildren">
    <a-sub-menu class="editable-menu-item" :key="menuItem.path" v-bind="$attrs">
      <template #icon v-if="state.meta.icon">
        <g-icon isSvg :icon="state.meta.icon" size="16"></g-icon>
      </template>
      <template #expandIcon>
        <g-icon icon="icon-hei-2" size="20" class="expand-icon"></g-icon>
      </template>
      <template #title>
        <div class="menu-title-box">
          <span>{{ state.meta.title }}</span>
        </div>
      </template>
      <div
        class="nav_bar"
        :style="{ left: 30 + (level - 1) * 24 + 'px' }"
        v-if="!menuItem?.meta?.hideNav"
      ></div>
      <sub-menu
        v-for="(item, index) in menuItem.children"
        :key="index"
        :menu-item="item"
        :menu-parent="menuItem"
        :level="level + 1"
        :hideNav="menuItem?.meta?.hideNav || false"
      ></sub-menu>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item class="editable-menu-item" :key="menuItem.path" v-bind="$attrs">
      <template #icon v-if="state.meta.icon">
        <g-icon isSvg :icon="state.meta.icon" size="16"></g-icon>
      </template>
      <div class="action_bar" :style="{ left: 30 + (level - 2) * 24 + 'px' }" v-if="!hideNav"></div>
      <div class="menu-title-box">
        <router-link :to="menuItem.path">
          {{ state.meta.title }}
        </router-link>
      </div>
    </a-menu-item>
  </template>
</template>

<script setup name="sub-menu">
const props = defineProps({
  menuItem: {
    type: Object,
    default: () => {},
  },
  menuParent: {
    type: Object,
    default: () => {},
  },
  level: {
    type: Number,
    default: 1,
  },
  hideNav: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  hasChildren: computed(() => {
    return Array.isArray(props.menuItem.children) && props.menuItem.children.length > 0;
  }),
  meta: computed(() => {
    return props.menuItem.meta || {};
  }),
});
const $emit = defineEmits(["ok", "change"]);

const methods = {
  handleMenuItem(record) {
    $emit("change", record);
  },
};
</script>

<style lang="less">
.ant-menu-item .ant-menu-item-icon {
  max-width: 16px !important;
  font-size: 16px !important;
}
.ant-menu-submenu-open.ant-menu-submenu-inline > .ant-menu-submenu-title > .expand-icon {
  transform: translateY(-2px) rotateX(-180deg);
  transition: all 0.3s;
}
</style>
