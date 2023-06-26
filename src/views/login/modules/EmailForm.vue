<template>
  <a-form
    ref="formRef"
    class="password_form"
    :model="formState"
    :rules="rules"
  >
    <a-form-item label="" name="username" v-bind="formState.errorPlaceholder">
      <g-input
        width="100%"
        v-model:value="formState.username"
        size="large"
        placeholder="请输入手机号/邮箱"
        @keydown.enter="methods.onSubmit"
      >
        <template #addonBefore>
          <a-select v-model:value="formState.countryCode" :options="options" style="width: 90px">
          </a-select>
        </template>
      </g-input>
    </a-form-item>
    <a-form-item label="" name="password" v-bind="formState.errorPlaceholder">
      <g-input
        width="100%"
        v-model:value="formState.password"
        size="large"
        type="password"
        placeholder="请输入密码"
        @keydown.enter="methods.onSubmit"
      ></g-input>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { phoneRegExp, emailRegExp } from '@/utils/rule';
const formState = reactive({
  countryCode: '86',
  username: undefined,
  password: undefined,
});
const options = [
  {
    label: '+86',
    value: '86',
  }
]
const rules = {};
const formRef = ref();

const methods = {
  onSumbit() {
    
  }
}
</script>

<style lang="less">
.password_form {
  width: 100%;
  
}
</style>