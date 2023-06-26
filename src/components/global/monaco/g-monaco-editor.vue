<template>
  <div class="g-monaco-editor">
    <div ref="codeEditBox" style="width: 100%; height: 100%;"></div>
    <div class="g-monaco-control" v-if="showControl" @click.stop>
      <div v-if="showUpload" @click="methods.upload()">
        <g-icon icon="icon-upload" size="22"></g-icon>
      </div>
      <div @click="methods.download()">
        <g-icon icon="icon-download" size="22"></g-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor';
import { downloadYaml, jsonToYaml, yamlToJson } from '@/utils/io/yaml.js';
import { stringKeyToArray, getTargetBykey } from '@/utils/dispose';
import { message } from 'ant-design-vue';
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  // 富文本语言
  language: {
    type: String,
    default: 'yaml'
  },
  // 是否只读
  readOnly: {
    type: Boolean,
    default: false,
  },
  // 是否显示控件
  showControl: {
    type: Boolean,
    default: true,
  },
  // 是否显示上传按钮
  showUpload: {
    type: Boolean,
    default: true,
  },
  // 下载文件名称
  downloadName: {
    type: String,
    default: 'default.yaml',
  },
  // 上传文件类型
  uploadType: {
    type: String,
    default: 'yaml,yml'
  },
  // 自定义高亮配置
  highlight: {
    type: Array,
  },
})
const codeEditBox = ref();
const editor = reactive({
  instance: null,
});
const $emit = defineEmits(['update:value', 'change']);

const methods = {
  init() {
    watch(() => props.value, (value) => {
      nextTick(() => {
        let editorValue = editor.instance
          && toRaw(editor.instance).getValue
          && toRaw(editor.instance).getValue()
        if(value != editorValue) {
          toRaw(editor.instance)
            && toRaw(editor.instance).setValue
            && toRaw(editor.instance).setValue(value)
        }
      })
    },{ immediate: true })
    methods.initEditor();
  },
  initEditor() {
    // 初始化编辑器，确保dom已经渲染
    editor.instance = monaco.editor.create(unref(codeEditBox), {
      value: props.value, //编辑器初始显示文字
      language: props.language, // 编程语言
      theme: 'vs-dark', //官方自带三种主题vs, hc-black, or vs-dark
      selectOnLineNumbers: true,//显示行号
      roundedSelection: false,
      readOnly: props.readOnly, // 只读
      cursorStyle: 'line', //光标样式
      automaticLayout: true, //自动布局
      glyphMargin: true, //字形边缘
      useTabStops: false,
      fontSize: 15, //字体大小
      autoIndent: true, //自动布局
      quickSuggestionsDelay: 100, //代码提示延时
      // 缩略图
      minimap: {
        autohide: false, // 自动隐藏
        enabled: false, // 是否启动
        side: 'right', // 位置，'left' or 'right'
      },
      padding: {
        top: 15,
      },
      tabSize: 2,
      // fontFamily: "Roboto",
    });
    // 监听值的变化
    editor.instance.onDidChangeModelContent((val) => {
      $emit('update:value', toRaw(editor.instance).getValue());
      $emit('change', toRaw(editor.instance).getValue());
      if(props.highlight?.length) {
        methods.initHighlight(props.highlight);
      }
    });
  },
  /**
   * @function 设置高亮
   * @param {array} highlight 
   */
  initHighlight(highlight = []) {
    console.log('highlight', highlight)
    // highlight = [
    //   { type: 'key', targetKeys: '['spec']['template']['spec']['containers'][1]['env']', color: 'green' },
    //   { type: 'value', targetKeys: '['spec']['template']['spec']['containers'][1]['env']', color: 'yellow' },
    //   { type: 'text', value: 'metdata:', color: 'yellow' },
    // ]
    // 当前编辑器数据
    const json = toRaw(editor.instance).getValue(); // 字符串
    const obj = yamlToJson(json); // 对象
    // 获取高亮数据
    let decoration = [];
    highlight.map(({type, targetKeys, value, color}) => {
      if(type == 'text') {
        let matches = methods.findMatches(`${value}`, value);
        if(!matches.length) return;
        let { startLineNumber, startColumn, endLineNumber, endColumn } = matches[0].range;
        decoration.push({
          range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn), 
          options: { 
            isWholeLine: false, 
            inlineClassName: `lineHighlight-${color}`,
          }
        });
      } else {
        let list = methods.getHighlightInfo(obj, { type, targetKeys });
        let target = list[list.length - 1];
        if(!target) return;
        (Array.isArray(target) ? target : [target]).forEach(item => {
          if(!item?.range) return;
          const { startLineNumber, startColumn, endLineNumber, endColumn } = item.range
          decoration.push({
            type: type,
            range: new monaco.Range(startLineNumber, type == 'key' ? 1 : startColumn, endLineNumber, endColumn), 
            options: { 
              isWholeLine: false, 
              inlineClassName: `lineHighlight-${color}`,
            },
          });
        })
      }
    })
    // console.log('decoration', decoration)
    if(decoration?.length) {
      let index = decoration.findIndex(item => /^text$|^value$/.test(item.type));
      if(index == -1) index = 0;
      methods.deltaDecorations(decoration);
      methods.revealLineInCenter(decoration[index].range.startLineNumber)
    }
  },
  /**
   * @function 将record转成monaco高亮格式数据
   * @param {object} record
   * @param {object} options type: 类型，targetKeys：目标key
   * @returns {array}
   */
  getHighlightInfo(record, { type, targetKeys }) {
    // 将目标key转成数组
    targetKeys = stringKeyToArray(targetKeys || '', false);
    // console.log('targetKeys', targetKeys)
    let preTarget = undefined;
    // 循环遍历每个key，并做数据处理
    let matchesIndex = 0;
    return targetKeys.map((item, index) => {
      // 拿到当前key
      let key = targetKeys[index];
      // 拿到当前的值
      let target = getTargetBykey(record, targetKeys.slice(0, index + 1));
      // 如果找不到相关数据，则返回undefined
      if(!target && index != targetKeys.length - 1) {
        preTarget = undefined;
        return undefined;
      }
      if (type == 'value' && index == targetKeys.length - 1) {
        if(Array.isArray(preTarget?.target)) {
          let preLineNumber = (preTarget?.range?.startLineNumber || 0);
          let range = methods.getJsonLineNumber(preTarget?.target, key, index);
          if(!range) return undefined;
          return {
            range: {
              startLineNumber: range.startLineNumber + preLineNumber,
              startColumn: 1,
              endLineNumber: range.endLineNumber + preLineNumber,
              endColumn: 1,
            }
          }
        } else {
          let value = jsonToYaml({ [key]: target }).split('\n').filter(item => item);
          let length = value.length;
          let keyRange = undefined;
          let matches = methods.findMatches(`${key}:`).filter(item => {
            return item.range.startColumn == index * 2 + 1
              && (!preTarget?.range || preTarget?.range?.startLineNumber < item.range.startLineNumber);
          });
          keyRange = matches?.[matchesIndex]?.range;
          if(!keyRange) return {};
          if(target instanceof Object) {
            length = length - 1;
            return {
              range: {
                startLineNumber: keyRange.startLineNumber + (length ? 1 : 0),
                startColumn: length ? 1 : keyRange.endColumn + 1,
                endLineNumber: length ? keyRange.endLineNumber + length + 1 : keyRange.startLineNumber + 1,
                endColumn: 1,
              }
            }
          } else {
            return {
              range: {
                startLineNumber: keyRange.startLineNumber + (length > 1 ? 1 : 0),
                startColumn: length > 1 ? 1 : keyRange.endColumn + 1,
                endLineNumber: keyRange.endLineNumber + (length > 1 ? length : 1),
                endColumn: 1,
              }
            }
          }
        }
      } else {
        let targetRange = preTarget?.range || {};
        // 若是preTarget.target是数组，则key为下标
        if(Array.isArray(preTarget?.target)) {
          // 计算出当前在数组内的行数
          let range = methods.getJsonLineNumber(preTarget?.target, key, index);
          targetRange.startLineNumber = (targetRange.startLineNumber || 0) + (range?.startLineNumber || 0);
          // 重置下标
          matchesIndex = 0;
        } else {
          // 筛选出正确的位置
          let matches = methods.findMatches(`${key}:`).filter(item => {
            return item.range.startColumn == index * 2 + 1
              && (!preTarget?.range || preTarget?.range?.startLineNumber < item.range.startLineNumber);
          });
          targetRange = matches?.[matchesIndex]?.range;
        }
        // 更新上一个的数据
        preTarget = {
          keys: targetKeys.slice(0, index + 1).join(''),
          target: target,
          range: targetRange,
        }
        // 重置matches下标
        if(Array.isArray(target)) {
          matchesIndex = 0;
        }
        return preTarget;
      }
    });
  },
  getJsonLineNumber(record, index, prefixLength) {
    let startLineNumber = 0;
    let endLineNumber = undefined;
    // 计算出当前在数组内的行数
    for(let i = 0; i <= index; i++) {
      let json = jsonToYaml(record[i]);
      let list = json.split('\n').filter(item => item);
      if(i == index) {
        startLineNumber += 1;
        endLineNumber = startLineNumber + list.length;
      } else {
        startLineNumber += list.length;
      }
      list.forEach(item => {
        let [key, value] = item.split(': ')
        let keyPre = (key || '').match(/ /g)?.length || 0;
        // 若value加上前缀空格大于80，则换行
        if(value && value.length + keyPre + (prefixLength + 2) * 2 > 80) {
          if(i == index) {
            endLineNumber ++;
          } else {
            startLineNumber ++;
          }
        }
      })
    }
    if(isNaN(endLineNumber * 1)) return undefined;
    return {
      startLineNumber,
      endLineNumber,
    };
  },
  // 导入文件
  upload() {
    console.log('upload')
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = props.uploadType.split(',').map(item => `.${item}`).join(',');
    input.addEventListener('change', (e) => {
      if(!e.target.files?.length) {
        message.warning('导入文件失败，请重试尝试！')
        return;
      }
      let file = e.target.files[0];
      let typeReg = props.uploadType
        .split(",")
        .map((item) => `.${item}$`)
        .join("|")
      if(!new RegExp(typeReg).test(file.name)) {
        message.warning(`请上传${props.uploadType}格式的文件！`)
        return;
      }
      const reader = new FileReader();
      reader.onload = (file) => {
        $emit('update:value', reader.result);
        message.success('导入成功')
      };
  
      reader.readAsText(file);
    });
    input.click();
    // const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
  },
  // 下载为yaml文件
  download() {
    downloadYaml(
      toRaw(editor.instance).getValue(), 
      props.downloadName
    );
  },
  /**
   * @function 自定义样式
   * @param {array} decoration 
   */
  deltaDecorations(decoration) {
    const model = monaco.editor.getModels()?.[0];
    if(!model) return;
    // 示例
    // decoration = [{ 
    //   range: new monaco.Range(1, 1, 1, 2), 
    //   options: { 
    //     isWholeLine: false, 
    //     inlineClassName: 'lineHighlight',
    //   }
    // }];
    console.log('decoration', decoration)
    model.deltaDecorations([], decoration)
  },
  /**
   * @function 查找字符位置
   * @param {string} str 要查找的字符串
   * @param {boolean} isRegex 是否为正则表达式
   * @returns {array}
   */
  findMatches(str, isRegex = true) {
    const model = monaco.editor.getModels()?.[0];
    if(!model) return;
    return model.findMatches(str || '', true, isRegex, true, false, true);
  },
  /**
   * @function 跳转到指定行数
   * @param {number} lineNumber 
   */
  revealLineInCenter(lineNumber) {
    toRaw(editor.instance).revealLineInCenter(lineNumber);
  },
}
onMounted(() => {
  methods.init()
});
onUnmounted(() => {
  editor.instance && toRaw(editor.instance).dispose();
});
defineExpose({
  deltaDecorations: methods.deltaDecorations,
  findMatches: methods.findMatches,
});
</script>

<style lang="less">
.lineHighlight-green {
  color: #05C059 !important;
}
.lineHighlight-yellow {
  color: #FFED49 !important;
}
</style>
<style lang="less" scoped>
.g-monaco-editor {
  width: 100%;
  height: 500px;
  position: relative;
  background: #1e1e1e;
  border-radius: @border-radius-base;
  overflow: hidden;
  .g-monaco-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    right: 20px;
    top: 20px;
    border-radius: @border-radius-base;
    padding: 5px 0;
    background: #818386;
    & > div {
      width: 50px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      display: flex;
      position: relative;
      &::after {
        height: 100%;
        position: absolute;
        content: '';
        display: block;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border-right: 2px solid #A6A7AB;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
      &:hover {
        .g-icon {
          color: #FFFFFF;
        }
      }
    }
    .g-icon {
      color: #CDCDCF;
    }
  }
}
</style>