<template>
  <a-tooltip
    autoAdjustOverflow
    color="#242e42"
    class="ellipsis inline-block max-w-1/1"
    :overlayStyle="overlayStyle"
    overlayClassName="g-tooltip-overlay"
    arrowPointAtCenter
    v-bind="$attrs"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-tooltip>
</template>

<script setup>
const props = defineProps({
  maxWidth: {
    type: [String, Number],
    default: '800px',
  },
});
const overlayStyle = computed(() => {
  let maxWidth = methods.disposeWidth(props.maxWidth);
  let obj = {};
  if(maxWidth) obj['maxWidth'] = maxWidth;
  return obj;
});
const methods = {
  disposeWidth(value) {
    if (typeof value == "number") {
      return value + "px";
    } else if (typeof value == "string") {
      if (value.includes("%")) return value;
      return value.replace("px", "") + "px";
    } else {
      return "";
    }
  },
}
</script>

<style lang="less">
</style>
