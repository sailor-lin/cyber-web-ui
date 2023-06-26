<template>
  <g-modal
    class="terminal_modal"
    v-model:visible="terminalState.visible"
    :width="terminalState.width"
    large
    :footer="false"
    v-bind="$attrs"
  >
    <template #title>
      <div class="flex-center">
        <g-icon icon="icon-zhongduan" isSvg size="16" class="mr-12px"></g-icon>
        <span>{{ title }}</span>
        <template v-if="showSelect">
          <span class="ml-8px mr-8px">/</span>
          <g-select
            v-model:value="terminalState.active"
            width="270"
            :options="terminalState.options"
            @change="methods.changeTerminal()"
          ></g-select>
        </template>
      </div>
    </template>
    <div class="terminal_body" ref="terminalRef" v-if="terminalState.visible"></div>
  </g-modal>
</template>

<script setup>
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
// import { AttachAddon } from 'xterm-addon-attach';
import { maintainStore } from '@/store';
import { encryptToBase64, base64Decrypt } from '@/utils/dispose';
const props = defineProps({
  title: {
    type: String,
    default: '容器终端'
  },
  showSelect: {
    type: Boolean,
    default: true
  },
  isExit: {
    type: Boolean,
    default: false,
  }
});
let pressKeys = []; // 缓存按下的按钮
const terminalRef = ref();
const $maintainStore = maintainStore();
const terminalState = reactive({
  visible: false,
  width: '0',
  active: '', // 当前终端
  options: [], // 终端下拉列表
  isFirstRender: true, // terminal初次渲染，不需要发送clear命令
  defaultMessage: '', // 初次渲染发送消息
  resizeSymbol: undefined,
});
let terminal = undefined; // 终端实例
let socket = undefined; // websocket实例
const methods = {
  /**
   * @function params
   * @param {array} options 下拉选项 
   */
  showModal(options = []) {
    terminalState.visible = true;
    terminalState.isFirstRender = true;
    terminalState.width = document.documentElement.clientWidth * 0.98 + 'px';
    terminalState.options = options;
    terminalState.active = options[0]?.value;
    terminalState.defaultMessage = options[0]?.defaultMessage;
    nextTick(() => {
      methods.bindListerens();
      methods.initTerminal();
      methods.initWebsocket(terminalState.active);
    })
  },
  // 初始化xterm
  async initTerminal() {
    terminalState.fitAddon = new FitAddon();
    terminal = new Terminal({
      rendererType: 'canvas',
      fontSize: 15,
      lineHeight: 1,
      letterSpacing: 0,
      cursorBlink: true,
      allowProposedApi: true,
      disableStdin: false,
      LogLevel: "info",
    });
    terminal.loadAddon(new WebglAddon());
    terminal.loadAddon(terminalState.fitAddon);
    //开启Xterm终端
    terminal.open(terminalRef.value);
    // 监听终端按钮
    terminal.onKey((e) => {
      socket.send('0' + encryptToBase64(e.key));
      // socket.send(e.key);
    });
    //黑窗口适应实际div宽高
    terminalState.fitAddon.fit();

    terminal.focus(); //自动聚焦
    terminal.clear(); //自动清空
  },
  /**
   * @function 初始化websocket
   * @param {string} url websocket地址
   */
  initWebsocket(url) {
    // 关闭websocket
    socket?.close();
    // 创建websocket实例
    socket = new WebSocket(url);

    // 利用插件连接websocket
    // const attachAddon = new AttachAddon(socket);
    // terminal.loadAddon(attachAddon);

    // 连接成功回调
    socket.onopen = (e) => {
      if(!terminalState.isFirstRender) {
        console.log('连接成功', e);
        socket?.send('0' + encryptToBase64('clear\r'));
      } else {
        if (terminalState.defaultMessage) {
          // 默认发送消息
          socket?.send('0' + encryptToBase64(terminalState.defaultMessage));
        }
      }
      terminalState.isFirstRender = false;
    }
    // 返回消息回调
    socket.onmessage = (e) => {
      try {
        let msg = base64Decrypt(e.data.slice(1, ));
        msg && terminal.write(msg)
      } catch {}
    }
    // 连接关闭回调
    socket.onclose = (e) => {
      console.log('onclose', e);
    }
  },
  // 切换下拉选项
  changeTerminal() {
    if(!terminal) {
      methods.initTerminal();
    }
    methods.initWebsocket(terminalState.active);
  },
  // 绑定监听
  bindListerens() {
    document.addEventListener('keydown', methods.listenersKeydown);
    document.addEventListener('keyup', methods.listenersKeyup);
  },
  // 解绑监听
  unbindListerens() {
    pressKeys = [];
    document.removeEventListener('keydown', methods.listenersKeydown);
    document.removeEventListener('keyup', methods.listenersKeyup);
  },
  // 监听按钮按下
  async listenersKeydown(event) {
    // 已聚集terminal
    if(terminal?.textarea == document.activeElement) {
      if(pressKeys.includes(event.key)) return;
      pressKeys.push(event.key);
    }
    // 判断组合键
    if(pressKeys.join('+') == 'Shift+Insert') {
      try {
        let text = await navigator.clipboard.readText();
        socket?.send('0' + encryptToBase64(text));
      } catch (e) {
        throw Error(e)
      }
    }
  },
  // 监听按钮抬起
  listenersKeyup(event) {
    pressKeys = pressKeys.filter(item => item == event.key);
  },
  // resize
  resize() {
    //黑窗口适应实际div宽高
    terminalState.fitAddon.fit();
  },
}

watch(() => terminalState.visible, (value) => {
  if(!value) {
    // 关闭弹窗，自动退出
    if(props.isExit) {
      socket?.send('0' + encryptToBase64('exit\r'));
    }
    methods.unbindListerens();
    nextTick(() => {
      socket?.close();
      terminal?.clear();
    });
    // 移除resize监听
    if(terminalState.resizeSymbol) {
      delete $maintainStore.resizeState[terminalState.resizeSymbol];
    }
  } else {
    // 添加resize监听
    terminalState.resizeSymbol = Symbol('terminal');
    $maintainStore.resizeState[terminalState.resizeSymbol] = methods.resize;
  }
})

onUnmounted(() => {
  socket?.close();
  methods.unbindListerens();
})

defineExpose({
  showModal: methods.showModal,
})
</script>

<style lang="less">
.terminal_modal.ant-modal {
  max-width: 10000px;
  .terminal_body {
    height: 100%;
    background-color: #000000;
  }
}
</style>
