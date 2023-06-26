<template>
  <a-date-picker
    show-time
    placeholder="请选择"
    v-model:value="dateState.value"
    :format="format"
    v-bind="$attrs"
    @change="methods.onChange"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-date-picker>
</template>

<script setup>
import dayjs from '@/utils/dayjs'
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: "YYYY-MM-DD",
  },
})

const dateState = reactive({
  value: undefined,
})

const $emit = defineEmits(['update:value']);

const methods = {
  init() {
    watch(
      () => props.value,
      (value) => {
        try {
          if (value) {
            dateState.value = dayjs.getDayjsTime(value)
          } else {
            dateState.value = undefined
          }
        } catch {
          dateState.value = undefined
        }
      },
      { immediate: true }
    )
  },
  onChange(value) {
    let date = value ? dayjs(value).format(props.format) : undefined
    $emit('update:value', date)
  }
}

methods.init()
</script>

<style lang="less" scoped>
</style>
