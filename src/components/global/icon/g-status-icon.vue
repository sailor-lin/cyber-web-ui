<template>
  <g-icon isSvg :icon="icon" v-bind="$attrs"></g-icon>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    // validator: (value) => ["True", "False", "Unknown"].includes(value),
  },
})

const icon = computed(() => {
  return props.type == 'True'
   ? 'icon-chenggong'
   : props.type == 'False'
   ? 'icon-shibai1'
   : 'icon-wenhaozhuyi'
})
</script>