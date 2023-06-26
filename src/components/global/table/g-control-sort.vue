<template>
  <div class="g-control-sort">
    <span class="sort_text" @click="methods.clickHandler">
      <slot></slot>
    </span>
    <div class="sort_icon_body">
      <!-- 升序 -->
      <g-icon
        style="transform: rotate(180deg);"
        isSvg
        :icon="
          sortState.value
            ? 'icon-a-lujing1'
            : 'icon-lujing'
        "
        size="12"
        @click="methods.clickHandler(true)"
      ></g-icon>
      <!-- 降序 -->
      <g-icon
        isSvg
        :icon="
          !sortState.value && typeof sortState.value == 'boolean'
            ? 'icon-a-lujing1'
            : 'icon-lujing'
        "
        size="12"
        @click="methods.clickHandler(false)"
      ></g-icon>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: Boolean,
});
const sortState = reactive({
  value: true,
});
const $emit = defineEmits(['change', 'update:value']);
const methods = {
  /**
   * @function 点击处理
   * @param {boolean} isAsc 是否为升序 
   */
  clickHandler(isAsc) {
    let value = sortState.value;
    if(typeof isAsc == 'boolen') {
      value = value == isAsc ? undefined : isAsc;
    } else {
      if(typeof value == 'boolean') {
        value = value ? false : undefined;
      } else {
        value = true;
      }
    }
    sortState.value = value;
    $emit('update:value', value);
    $emit('change', value);
  },
}
watch(() => props.value, (value, oldValue) => {
  sortState.value = value;
}, { immediate: true });
</script>

<style lang="less" scoped>
.g-control-sort {
  display: flex;
  align-items: center;
  position: relative;
  .sort_text {
    cursor: pointer;
    user-select: none;
  }
  .sort_icon_body {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 9px;
    .svg-icon {
      font-weight: normal;
      height: 7px;
      cursor: pointer;
    }
  }
}
</style>