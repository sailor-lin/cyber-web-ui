<template>
  <div class="g-page-body">
    <g-page-header
      v-if="showHeader"
      :padding="padding"
      :scroll="scroll"
    >
      <slot name="header"></slot>
    </g-page-header>
    <div class="g-page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: {
    type: [String, Number],
    default: "100%",
  },
  scroll: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
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

</script>

<style lang="less">
.g-page-body {
  display: flex;
  flex-direction: column;
  width: v-bind(width);
  border-radius: @border-radius-base;
  box-shadow: 2px 2px 6px #cecece;
  .g-page-body-header {
    border-radius: 4px 4px 0px 0px;
    margin-bottom: 0;
  }
  .g-page-content {
    flex: 1;
    height: 0;
    background: #ffffff;
    &::before {
      content: '';
      display: table;
    }
    &::after {
      content: '';
      display: table;
    }
  }
}
</style>
