<template>
  <a-range-picker
    :format="format"
    v-model:value="rangeState.value"
    v-bind="$attrs"
    @change="methods.changeRangePicker"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-range-picker>
</template>

<script setup>
import dayjs from "@/utils/dayjs";
const props = defineProps({
  start: {
    tyep: String,
    default: undefined,
  },
  end: {
    tyep: String,
    default: undefined,
  },
  format: {
    type: String,
    default: "YYYY-MM-DD",
  },
});

const rangeState = reactive({
  value: [],
});

const $emit = defineEmits(["update:start", "update:end", "change"]);

const methods = {
  init() {
    watch(
      () => props.format,
      () => {
        methods.updateMethod(rangeState.value);
      }
    );
    watch(
      () => [props.start, props.end],
      (list) => {
        if (list[0] && list[1]) {
          rangeState.value = dayjs.getDayjsTime([list[0], list[1]]);
        } else {
          rangeState.value = [];
        }
      },
      { immediate: true }
    );
  },
  updateMethod(value) {
    let list = [];
    if (value && value.length >= 2) {
      list = dayjs(value).format(props.format);
    }
    $emit("update:start", list[0] || undefined);
    $emit("update:end", list[1] || undefined);
  },
  changeRangePicker(value) {
    methods.updateMethod(value);
  }
}

methods.init();
</script>

<style lang="less" scoped>
</style>
