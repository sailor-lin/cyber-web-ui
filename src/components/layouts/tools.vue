<template>
  <div
    :class="['g-tools', { 'show_tool': toolsState.showTool }]"
    :style="{
      transform: `translateY(${toolsState.translateY}px)`
    }"
    @mouseenter="methods.onMouseenter"
    @mouseleave="methods.onMouseleave"
    @mousedown="methods.onMousedown"
  >
    <div class="g-tools-button" @click="methods.back">
      <g-icon v-if="toolsState.showAction" icon="icon-shangyiyehoutuifanhui-xianxingyuankuang" style="color: #FFFFFF" size="21"></g-icon>
      <g-icon v-else icon="icon-tool" color="#FFFFFF" size="21"></g-icon>
    </div>
    <div
      class="g-tools-modal"
      @mousedown="methods.onMousedown"
    >
      <!-- 头部 -->
      <div class="tools-header">
        <g-icon :icon="toolsState.toolTarget.icon" color="#FFFFFF" size="30"></g-icon>
        <div style="margin-left: 8px;">
          <div class="header-title">{{ toolsState.toolTarget.title }}</div>
          <div class="header-tips">{{ toolsState.toolTarget.tip }}</div>
        </div>
      </div>
      <div :class="['tool-body', { 'show-action': toolsState.showAction }]">
        <!-- 工具菜单 -->
        <div class="tool-menu">
          <div v-show="!toolsState.showAction">
            <template v-for="(item, index) in tools" :key="index">
              <div class="tool_label">{{ item.label }}</div>
              <div
                class="tool_item"
                v-for="(target, cindex) in item.tools"
                :key="cindex"
                @click.stop="methods.handler(target)"
                @mousedown.stop
                @mouseup.stop
              >
                <g-icon :isSvg="target.isSvg" :icon="target.icon" size="24"></g-icon>
                <div style="margin-left: 8px;">
                  <div style="font-weight: 600;">{{ target.title }}</div>
                  <div style="color: #999999;">{{ target.tip }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- 工具操作 -->
        <div
          class="g-tool-action"
          @click.stop
          @mousedown.stop
          @mouseup.stop
        >
          <component :tool="toolsState.toolTarget" :is="toolsState.toolTarget.component"></component>
        </div>
      </div>
    </div>

    <YamlTransitionModal ref="yamlTransitionRef"></YamlTransitionModal>
  </div>
</template>

<script setup>
import YamlTransitionModal from './toolsModules/YamlTransitionModal.vue';
const TimestampToISO = defineAsyncComponent(() => import("./toolsModules/TimestampToISO.vue"));

// 默认工具标题
const defaultTool = {
  icon: 'icon-tool',
  title: '工具箱',
  tip: '提供一些通用的工具。'
}
const yamlTransitionRef = ref();
const toolsState = reactive({
  showTool: false,
  showTimeout: null,
  translateY: -100,
  firstTranslateY: -100,
  moveFlag: false,
  mouseTarget: null,
  showAction: false,
  toolTarget: defaultTool,
  lastTime: undefined,
})
// 工具菜单
const tools = [
  {
    label: '转换工具',
    tools: [
      {
        icon: 'icon-shijian',
        isSvg: false,
        title: '时间转换',
        tip: '时间戳和ISO时间格式互相转换',
        component: TimestampToISO,
      },
      {
        icon: 'icon-shujuzhuanhuang',
        isSvg: true,
        title: 'yaml转换',
        tip: 'json数据和yaml互相转换',
        handler: () => {
          unref(yamlTransitionRef).showModal();
          methods.onMouseleave();
        }
      },
    ]
  }
];

const methods = {
  // 点击工具通用处理方法
  handler(target) {
    if(target.handler) {
      target.handler();
      return;
    }
    toolsState.toolTarget = target;
    toolsState.showAction = true;
    toolsState.toolTarget.component = shallowRef(target.component);
  },
  back() {
    if(toolsState.showAction) {
      toolsState.showAction = false;
      toolsState.toolTarget = defaultTool;
    }
  },
  // 鼠标移入工具箱
  onMouseenter() {
    toolsState.showTimeout && clearTimeout(toolsState.showTimeout);
    toolsState.showTool = true;
  },
  // 鼠标移出工具箱
  onMouseleave() {
    toolsState.showTimeout && clearTimeout(toolsState.showTimeout);
    toolsState.showTimeout = setTimeout(() => {
      toolsState.showTool = false;
    }, 270)
  },
  // 鼠标左键按下
  onMousedown() {
    toolsState.moveFlag = true;
    document.addEventListener('selectstart', methods.onSelectstart);
  },
  // 鼠标左键抬起
  onMouseup() {
    toolsState.moveFlag = false;
    toolsState.mouseTarget = null;
    document.removeEventListener('selectstart', methods.onSelectstart);
  },
  // 鼠标移动
  onMousemove(e) {
    requestAnimationFrame(() => {
      if(!toolsState.moveFlag) return;
      let currentTime = new Date().getTime();
      if(currentTime - toolsState.lastTime < 1) return;
      if(toolsState.mouseTarget) {
        let y = toolsState.mouseTarget.y - e.y;
        toolsState.translateY = toolsState.firstTranslateY - y;
      } else {
        toolsState.firstTranslateY = toolsState.translateY;
        toolsState.mouseTarget = e;
      }
      toolsState.lastTime = new Date().getTime();
    });
  },
  // 阻止鼠标选中功能
  onSelectstart(e) {
    e.preventDefault(); //阻止默认行为
  },
}
// 开启监听
document.addEventListener('mouseup', methods.onMouseup);
document.addEventListener('mousemove', methods.onMousemove)
onUnmounted(() => {
  document.removeEventListener('mouseup', methods.onMouseup);
  document.removeEventListener('mousemove', methods.onMousemove);
})
</script>

<style lang="less" scoped>
.g-tools {
  position: fixed;
  right: -10px;
  z-index: 99999;
  bottom: 0;
  border-radius: 100px 0 0 100px;
  transition: all 0.15s ease;
  &.show_tool {
    right: 0;
    .g-tools-modal {
      right: 0;
      bottom: 40px;
      transition: all 0.15s ease;
    }
  }
  .g-tools-button {
    display: flex;
    align-items: center;
    width: 50px;
    height: 32px;
    background: @primary-color;
    border-radius: 100px 0 0 100px;
    padding: 0 10px;
    cursor: pointer;
  }
  .g-tools-modal {
    width: 420px;
    border-radius: @border-radius-base;
    box-shadow: 0 4px 8px 0 rgb(36 46 66 / 20%);
    background: #FFFFFF;
    padding: 12px;
    position: absolute;
    right: -420px;
    bottom: -100%;
    overflow: hidden;
    
    .tools-header {
      background: @primary-color;
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: @border-radius-base;
      color: #FFFFFF;
      .header-title {
        font-weight: 600;
      }
      .header-tips {
        font-weight: 400;
      }
    }
    .tool-body {
      position: relative;
      left: 0;
      width: 840px;
      display: flex;
      flex-wrap: nowrap;
      transition: all 0.2s linear;
      &.show-action {
        left: -408px;
      }
      .tool-menu {
        width: 396px;
        .tool_label {
          margin: 20px 0 12px;
          font-weight: 500;
        }
        .tool_item {
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: @border-radius-base;
          border: 1px solid #ccd3db;
          cursor: pointer;
          transition: all 0.3s linear;
          margin-top: 12px;
          &:first-child {
            margin-top: 0;
          }
          &:hover {
            border-color: #a7b4a9;
            box-shadow: 0 4px 8px 0 rgba(43, 61, 46, 0.2);
          }
        }
      }
      .g-tool-action {
        width: 396px;
        margin-left: 12px;
      }
    }
  }
}
</style>
