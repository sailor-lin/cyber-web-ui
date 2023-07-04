<template>
  <Card title="collapse-form">
    <c-collapse-form @search="searchQuery">
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <template #right>
        <a-button type="primary">添加</a-button>
      </template>
    </c-collapse-form>
    <c-collapse-form shrink @search="searchQuery">
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <a-input></a-input>
      <template #right>
        <a-button type="primary">添加</a-button>
      </template>
    </c-collapse-form>
  </Card>
</template>

<script setup>
import Card from '../components/Card.vue';
import { Input as AInput, Button as AButton } from 'ant-design-vue';

const searchQuery = () => {
  console.log('isSearchQuery')
}
</script>