<template>
  <c-layout :showSiderbar="layoutState.showSiderbar">
    <template #left>
      <div style="margin-left: 30px;" @click="() => layoutState.showSiderbar = !layoutState.showSiderbar">切换/隐藏菜单</div>
    </template>
  </c-layout>
</template>

<script setup>
import { reactive } from "vue";

const layoutState = reactive({
  showSiderbar: true,
  visible: false,
});

</script>
