<template>
  <g-modal
    v-model:visible="state.visible"
    :title="state.title"
    large
    @ok="methods.onSubmit"
  >
    <g-monaco-editor
      v-if="state.visible"
      v-model:value="state.value"
      :readOnly="state.readOnly"
      :showUpload="!state.readOnly"
      downloadName="下载.yml"
      style="height: 100%;"
    ></g-monaco-editor>
  </g-modal>
</template>

<script setup>
const state = reactive({
  visible: false,
  value: '',
  readOnly: false,
  downloadName: 'default.deployment.yaml',
})

const formState = reactive({
  "cluster": "edgeblock1",
  "name": "createDeployments",
  "namespace": "cmp",
  "params": {
    "namespace": "cmp",
    "name": undefined,
  },
  "body": {}
});
const $emit = defineEmits(['ok']);

const methods = {
  /**
   * @function 显示弹窗
   * @param {object} params 配置参数
   */
  showModal(params) {
    const { record = {}, title, readOnly = false } = params;
    // 显示弹窗
    state.visible = true;
    // 重置数据
    state.value = '';
    // 设置标题
    state.title = title;
    // 是否只允许查看
    state.readOnly = readOnly;
    // 设置参数
    Object.keys(formState).forEach(key => {
      formState[key] = record[key];
    })
  },
  // 提交数据
  onSubmit() {
    state.visible = false;
  },
}
defineExpose({
  showModal: methods.showModal,
})
</script>

<style lang="less">
</style>
