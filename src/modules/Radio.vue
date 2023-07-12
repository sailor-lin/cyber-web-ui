<template>
  <Card title="radio">
    <c-radio-group v-model:value="radioState.value">
      <c-radio-button value="1" count="2">全部</c-radio-button>
      <c-radio-button value="2" count="1">正常</c-radio-button>
      <c-radio-button value="3" count="1" dark>停用</c-radio-button>
      <c-radio-button value="4" count="1" disabled>禁用</c-radio-button>
    </c-radio-group>

    <template v-if="radioState.value == '1'">
      <div>1</div>
    </template>
    <template v-if="radioState.value == '2'">
      <div>2</div>
    </template>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted } from 'vue';
import Card from '../components/Card.vue';

const radioState = reactive({
  value: '1',
});

</script>