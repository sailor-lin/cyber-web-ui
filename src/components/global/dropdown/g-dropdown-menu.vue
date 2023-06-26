<template>
  <a-menu class="g-dropdown-menu">
    <a-menu-item
      v-for="(item, index) in overlayMenu"
      :key="index"
      :icon="item.icon"
      :disabled="item.disabled"
    >
      <slot name="record" :dropItem="item">
        <a @click="item.handler(item)">{{ item?.label }}</a>
      </slot>
    </a-menu-item>
  </a-menu>
</template>

<script setup>
const props = defineProps({
  overlayMenu: {
    type: Array,
    default: () => [],
  }
});

const overlayMenu = computed(() => {
  return props.overlayMenu.filter(item => {
    return typeof item.show == 'boolean' ? item.show : true;
  }).map(item => {
    return {
      ...item,
      disabled: typeof item.disabled == 'boolean' ? item.disabled : false,
    };
  });
});
</script>

<style lang="less">
.g-dropdown-menu.ant-dropdown-menu {
  margin: 0;
  padding: 8px 0;
  min-width: 168px;
  border-radius: @border-radius-base;
  background-color: #fff;
}
</style>
