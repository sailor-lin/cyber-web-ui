<template>
  <Card title="tree">
    <CMenuPermission
      v-model:value="treeState.value"
      productId="916ca19f73014766bb365655ad236713"
    ></CMenuPermission>
    <CMenuPermission
      v-model:value="treeState.value"
      isPersonal
      disabled
      productId="916ca19f73014766bb365655ad236713"
    ></CMenuPermission>
    <c-product-tree></c-product-tree>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted } from 'vue';
import Card from '@/components/Card.vue';
const treeState = reactive({
  value: undefined,
})
</script>