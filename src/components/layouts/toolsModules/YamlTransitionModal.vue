<template>
  <g-modal
    title="yaml转换"
    v-model:visible="state.visible"
    class="yaml-transition-modal"
    :zIndex="1008"
    large
  >
    <div :class="['transition-body', { 'reverse': state.reverse }]">
      <!-- yaml -->
      <div class="monaco-body">
        <div class="monaco-label">yaml</div>
        <g-monaco-editor
          v-if="state.visible"
          v-model:value="state.yaml"
          :showUpload="!state.reverse"
          downloadName="yaml.yaml"
        ></g-monaco-editor>
      </div>
      <!-- json -->
      <div class="monaco-body">
        <div class="monaco-label">json</div>
        <g-monaco-editor
          v-if="state.visible"
          v-model:value="state.json"
          :showUpload="state.reverse"
          downloadName="json.js"
          uploadType="js,json,txt"
        ></g-monaco-editor>
      </div>
    </div>
    <template #footer>
      <g-button ghost pattern="primary" @click="methods.switch">切换</g-button>
      <g-button type="primary" @click="methods.transition">转换</g-button>
    </template>
  </g-modal>
</template>

<script setup>
import { jsonToYaml, yamlToJson } from "@/utils/io/yaml.js";
import { message } from "ant-design-vue";
import JsBeautify from 'js-beautify';
const state = reactive({
  visible: false,
  reverse: false,
  yaml: '',
  json: '',
});

const methods = {
  // 显示弹窗
  showModal() {
    state.visible = true;
  },
  // 切换
  switch() {
    state.reverse = !state.reverse;
  },
  // 数据转换
  transition() {
    try {
      if(state.reverse) {
        try {
          state.yaml = jsonToYaml(eval(`(${state.json})`));
        } catch {
          try {
            state.yaml = jsonToYaml(JSON.parse(state.json));
          } catch {
            message.error('请输入正确的json格式！');
          }
        }
      } else {
        state.json = JsBeautify(JSON.stringify(yamlToJson(state.yaml)), {
          "indent_size": 2,
          "indent_char": " ",
          "indent_with_tabs": false,
          "editorconfig": false,
          "eol": "\n",
          "end_with_newline": false,
          "indent_level": 0,
          "preserve_newlines": true,
          "max_preserve_newlines": 10,
          "space_in_paren": false,
          "space_in_empty_paren": false,
          "jslint_happy": false,
          "space_after_anon_function": false,
          "space_after_named_function": false,
          "brace_style": "collapse",
          "unindent_chained_methods": false,
          "break_chained_methods": false,
          "keep_array_indentation": true,
          "unescape_strings": false,
          "wrap_line_length": 0,
          "e4x": false,
          "comma_first": false,
          "operator_position": "before-newline",
          "indent_empty_lines": false,
          "templating": ["auto"]
        })
      }
    } catch {
      message.warning('转换出错！')
    }
  },
}

defineExpose({
  showModal: methods.showModal,
})
</script>

<style lang="less">
.ant-modal.g-modal.yaml-transition-modal {
  .transition-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.reverse {
      flex-direction: column-reverse
    }
    .monaco-body {
      width: 100%;
      height: 48%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .monaco-label {
        margin-bottom: 12px;
      }
      .g-monaco-editor {
        height: 0;
        flex: 1;
      }
    }
  }
}
</style>