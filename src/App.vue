<template>
  <div style="padding: 24px 24px 0;">
    <c-page-label
      title="标题"
      tips="提示。"
      icon="cyber-xianshimima"
      document-link="javascript:;"
      showHeader
    >
      <template #breadcrumb>
        <a-breadcrumb>
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
          <a-breadcrumb-item>An Application</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
    </c-page-label>
  </div>
  <!-- 步骤条 -->
  <Icon></Icon>
  <!-- 开关 -->
  <Switch></Switch>
  <!-- 输入框 -->
  <Input></Input>
  <!-- 收缩表单 -->
  <CollapseForm></CollapseForm>
  <!-- 表格 -->
  <Table></Table>
  <!-- 选择框 -->
  <Select></Select>
  <!-- 单选框 -->
  <Radio></Radio>
  <Cell></Cell>
</template>

<script setup>
import Icon from './modules/Icon.vue';
import Switch from './modules/Switch.vue';
import Input from './modules/Input.vue';
import CollapseForm from './modules/CollapseForm.vue';
import Table from './modules/Table.vue';
import Select from './modules/Select.vue';
import Radio from './modules/Radio.vue';
import Cell from './modules/Cell.vue';
import { Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';
</script>

<style lang="less" scoped>
</style>
