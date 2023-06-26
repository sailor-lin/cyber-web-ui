<template>
  <g-modal
    class="log-modal"
    v-model:visible="logState.visible"
    :width="logState.width"
    large
    :footer="false"
    @ok="methods.onSubmit"
  >
    <template #title>
      <span>日志</span>
      <span class="ml-8px mr-8px">/</span>
      <g-select
        v-model:value="logState.active"
        style="width: 168px;"
        :options="logState.options"
        @change="methods.changeLogTerminal()"
      ></g-select>
    </template>
    <div class="terminal_body" ref="terminalRef" v-if="logState.visible"></div>
  </g-modal>
</template>

<script setup>
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const terminalRef = ref();
const logState = reactive({
  title: '日志',
  visible: false,
  width: '0px',
  active: '',
  options: [],
  url: '',
});
let terminal = undefined; // 命令窗口实例
let socket = undefined; // websocket实例
const methods = {
  /**
   * @function 显示弹窗
   * @param {string} url 
   * @param {array} options 下拉选项
   */
  showModal(url, options) {
    logState.visible = true;
    logState.width = document.documentElement.clientWidth * 0.98 + 'px';
    logState.active = options[0].value;
    logState.options = options || [];
    logState.url = url;
    nextTick(() => {
      methods.initTerminal();
      methods.initLogWebSocket(url, logState.active);
    })
  },
  // 初始化xterm终端
  async initTerminal() {
    const fitAddon = new FitAddon();
    // 实例化xterm
    terminal = new Terminal({
      fontSize: 12,
      lineHeight: 1,
      letterSpacing: 0,
      cursorBlink: false,
      allowProposedApi: true,
      disableStdin: true,
      LogLevel: "info",
    });
    // xterm终端加载插件
    terminal.loadAddon(fitAddon);
    // 开启Xterm终端
    terminal.open(terminalRef.value);
    // 黑窗口适应实际div宽高
    fitAddon.fit();
    // terminal.focus(); //自动聚焦
  },
  /**
   * @function 连接websocket
   * @param {string} url websocket地址
   * @param {string} message 发送消息内容
   */
  initLogWebSocket(url, message) {
    console.log(url, message)
    if(!url || !message) return;
    socket?.close();
    // 创建websocket实例
    socket = new WebSocket(url);
    // 连接成功回调
    socket.onopen = (e) => {
      console.log('连接成功', e);
      // 请求连接日志
      socket.send(message);
    }
    // 返回消息回调
    socket.onmessage = (e) => {
      // 将日志写入xterm终端
      e.data && terminal.writeln(e.data.replace('\n', ''))
    }
    // 连接关闭回调
    socket.onclose = (e) => {
      console.log('关闭连接', e);
    }
  },
  // 切换下拉选项
  changeLogTerminal() {
    if(terminal) {
      terminal?.clear();
    } else {
      methods.initTerminal();
    }
    methods.initLogWebSocket(logState.url, logState.active);
  },
}

watch(() => logState.visible, (value) => {
  if(!value) {
    socket?.close();
  }
})

onUnmounted(() => {
  socket?.close();
})

defineExpose({
  showModal: methods.showModal,
})
</script>

<style lang="less">
.log-modal.ant-modal {
  max-width: 10000px;
  .terminal_body {
    height: 100%;
    background-color: #000000;
    padding: 5px 0 5px 5px;
  }
}
</style>
