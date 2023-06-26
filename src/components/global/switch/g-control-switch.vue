<template>
  <div
    :class="['g-control-switch', { 'active': checked }]"
    @click="methods.clickHandler"
  >
    <slot></slot>
    <div class="circle"></div>
    <div v-if="animationFlag" class="control-switch-click-animating"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
})

const animationFlag = ref(false);
const timeout = ref();

const $emit = defineEmits(['update:checked', 'change']);

const methods = {
  clickHandler() {
    animationFlag.value = false;
    setTimeout(() => {
      animationFlag.value = true;
      timeout.value && clearTimeout(timeout.value)
      timeout.value = setTimeout(() => {
        animationFlag.value = false;
      }, 3000)
    })
    let flag = props.checked;
    $emit('update:checked', !flag);
    $emit('change', !flag);
  }
}
</script>

<style lang="less">
.g-control-switch {
  .main-body-tip();
  .flex-center();
  padding: 4px 4px 4px 16px;
  background: #F4F6F9;
  border-radius: 1920px;
  cursor: pointer;
  user-select: none;
  transition: all .2s;
  position: relative;
  .circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: @dark-color;
    margin-left: 8px;
  }
  .control-switch-click-animating {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    border-radius: inherit;
    box-shadow: 0 0 0 0 #05c059;
    box-shadow: 0 0 0 0 rgb(45, 61, 72);
    opacity: 0.2;
    animation: fadeEffect 2s cubic-bezier(0.08, 0.82, 0.17, 1), waveEffect 0.4s cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-fill-mode: forwards;
    content: '';
    pointer-events: none;
  }
  &.active {
    .main-body-deepen();
    background: @primary-color;
    .circle {
      background: #FFFFFF;
    }
  }
}

@keyframes waveEffect {
  100% {
    box-shadow: 0 0 0 @primary-color;
    box-shadow: 0 0 0 6px rgb(45, 61, 72);
  }
}
@keyframes fadeEffect {
  100% {
    opacity: 0;
  }
}
</style>