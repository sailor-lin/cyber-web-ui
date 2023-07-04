<template>
  <Card title="switch">
    <c-switch-control v-model:checked="state.switchControl"
      checkedValue="1" unCheckedValue="2" @change="methods.changeSwitchControl"
    >开关</c-switch-control>
  </Card>
</template>

<script setup>
import { reactive } from 'vue';
import Card from '../components/Card.vue';
const state = reactive({
  switchControl: '1',
});
const methods = {
  changeSwitchControl(checked) {
    console.log("!!", state.switchControl, checked);
  },
};
</script>