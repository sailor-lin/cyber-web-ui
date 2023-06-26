<template>
  <div class="g-pagination">
    <div class="g-pagination-left">
      <slot name="left"></slot>
    </div>
    <div class="g-pagination-right">
      <a-pagination
        :current="current"
        :pageSize="pageSize"
        size="small"
        :total="total"
        show-size-changer
        show-quick-jumper
        :show-total="total => `共${total}条`"
        @change="methods.changePage"
        v-bind="$attrs"
      ></a-pagination>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  current: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});
const state = reactive({
  pageNum: computed(() => {
    const { total, pageSize } = props;
    if (total == 0) return 1;
    return Math.ceil(total / pageSize);
  }),
});

const $emit = defineEmits(["update:current", "update:pageSize", "change"]);

const methods = {
  changePage(page, pageSize) {
    $emit("update:current", page);
    $emit("update:pageSize", pageSize);
    $emit("change", page, pageSize);
  },
};
</script>

<style lang="less">
.g-pagination {
  width: 100%;
  height: 56px;
  background-color: #fafbfc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-weight: 400;
  .pagination-left {
    display: flex;
    align-items: center;
  }
  .g-pagination-right {
    display: flex;
    align-items: center;
    .page-count {
      margin: 0 20px;
    }
    .arrow-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
