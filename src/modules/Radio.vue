<template>
  <Card title="radio">
    <c-radio-group v-model:value="radioState.value" @change="methods.searchQuery">
      <c-radio-button value="" count="2">全部</c-radio-button>
      <c-radio-button value="0" count="1">正常</c-radio-button>
      <c-radio-button value="1" count="1" dark>停用</c-radio-button>
      <c-radio-button value="2" count="1" disabled>禁用</c-radio-button>
    </c-radio-group>

    <c-radio-group v-model:value="radioState.value" :options="options">
    </c-radio-group>
  </Card>
</template>

<script setup>
import { reactive, ref, unref, onMounted } from 'vue';
import { changeHistoryState } from '../../components/_utils/history';
import Card from '../components/Card.vue';

const radioState = reactive({
  value: '1',
});

const options = [
  { label: '全部', value: '', count: '1' },
  { label: '正常', value: '0', count: '1' },
  { label: '异常', value: '1', count: '1', dark: true },
];

const methods = {
  searchQuery() {
    changeHistoryState(radioState)
  }
}

</script>