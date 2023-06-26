<template>
  <a-dropdown
    class="define-dropdown"
    destroyPopupOnHide
    trigger="click"
    overlayClassName="g-dropdown-overlay"
    :placement="placement"
    v-bind="$attrs"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
    
    <template #overlay v-if="overlayMenu.length > 0">
      <slot name="overlay">
        <g-dropdown-menu :overlayMenu="overlayMenu">
          <template #record="{ dropItem }">
            <slot name="record" :dropItem="dropItem"></slot>
          </template>
        </g-dropdown-menu>
      </slot>
    </template>
  </a-dropdown>
</template>

<script setup>
const props = defineProps({
  overlayMenu: {
    type: Array,
    default: () => [],
  },
  placement: {
    type: String,
    default: 'bottomRight',
  },
})
</script>

<style lang="less">
.ant-dropdown {
  .ant-dropdown-menu {
    .ant-dropdown-menu-item:hover,
    .ant-dropdown-menu-submenu-title:hover {
      .main-body-deepen();
      background-color: @primary-bg-color !important;
    }
  }
}
.g-dropdown-overlay {

}
</style>