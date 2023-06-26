<template>
  <div class="layout-menu">
    <!-- 当前项目信息 -->
    <div class="colony_block">
      <g-icon isSvg icon="icon-xiangmu" size="33"></g-icon>
      <div style="margin-left: 15px;">
        <div class="project_code">项目编码</div>
        <div class="project_name">项目名称</div>
      </div>
    </div>
    <!-- 搜索栏 -->
    <div class="search_block">
      <label class="search_label">
        <g-icon isSvg icon="icon-jiqun" size="16" class="colony_icon" @click="namespaceRef.openSwitch()"></g-icon>
        <g-select
          v-model:value="$userStore.cluster"
          class="menu_search_select"
          showSearch
          :options="$dictStore.cluster"
          ref="namespaceRef"
          :getPopupContainer="methods.getPopupContainer"
        ></g-select>
      </label>
    </div>
    <!-- 菜单列表 -->
    <a-menu
      mode="inline"
      theme="light"
      class="menu_ul"
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
    >
      <!-- @openChange="methods.onOpenChange"
      @select="methods.selectHandler" -->
      <SubMenu
        v-for="(item, index) in state.menuList"
        :key="index"
        :menu-item="item"
        :hide-nav="item?.meta.hideNav"
      ></SubMenu>
    </a-menu>
  </div>
</template>

<script setup>
import SubMenu from "./subMenu.vue";
import { dictStore, userStore } from '@/store';
import routes from '@/router/modules/default.js';

const $useRouter = useRouter();
const $useRoute = useRoute();
// 状态
const $dictStore = dictStore();
const $userStore = userStore();

const namespaceRef = ref();
const state = reactive({
  routes: computed(() => {
    return routes || [];
  }),
  menuList: [],
  selectedKeys: [],
  openKeys: [],
});
const methods = {
  init() {
    state.menuList = methods.initMenuList(state.routes);
  },
  initMenuList(menuList) {
    return menuList
      .map((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          item.children = methods.initMenuList(item.children).filter((item) => item);
        }
        // 隐式菜单 - 隐藏菜单项 || 独立菜单
        if (item.meta?.implicit || item.meta?.independent) return null;
        return item;
      })
      .filter((item) => item);
  },
  selectHandler({ item, key, selectedKeys }) {
    state.selectedKeys = [$useRoute.path];
  },
  // 菜单展开事件
  onOpenChange(openKeys) {
    let lastOpenKey = openKeys[openKeys.length - 1];
    if (state.openKeys.some((item) => openKeys.some((citem) => item == citem))) {
      state.openKeys = methods.getActionKeys(state.menuList, lastOpenKey);
    } else if (state.openKeys.every((item) => openKeys.some((citem) => item == citem))) {
      state.openKeys = [...openKeys];
    } else {
      state.openKeys = [lastOpenKey];
    }
  },
  // 获取菜单展开列表/选中列表
  getActionKeys(list, key, selectedKeys = [], includesChild = false) {
    key = key.toLocaleLowerCase();
    list.find((item) => {
      if (item.children) {
        methods.getActionKeys(item.children, key, selectedKeys, includesChild);
      }
      if (
        item?.path?.toLocaleLowerCase() == key ||
        (item.children && selectedKeys.length > 0)
      ) {
        if ((Array.isArray(item.children) && item.children.length > 0) || includesChild) {
          selectedKeys.push(item.path);
        } else {
          selectedKeys.push(undefined);
        }
        return true;
      }
    });
    return selectedKeys.filter((item) => item);
  },
  getPopupContainer(triggerNode) {
    return triggerNode.parentNode.parentNode;
  },
};

methods.init();
</script>

<style lang="less">
.layout-menu {
  width: 250px;
  height: 100%;
  overflow: hidden;
  padding: 24px 0 16px 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s linear;
  .colony_block {
    width: 100%;
    padding: 12px 12px 16px 20px;
    display: flex;
    align-items: center;
    background: #05C059;
    box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.06);
    border-radius: @border-radius-base;
    color: #FFFFFF;
    margin-bottom: 20px;
    .project_code {
      .second-title();
      color: #FFFFFF;
    }
    .project_name {
      font-weight: 400;
      margin-top: 10px;
    }
  }
  .search_block {
    width: 100%;
    background: #FFFFFF;
    padding: 12px 20px;
    border-radius: @border-radius-base @border-radius-base 0px 0px;
    .search_label {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eff1f6;
      position: relative;
      .g-select {
        border: none;
      }
      .colony_icon {
        position: absolute;
        z-index: 1;
      }
      .menu_search_select {
        width: 100%;
        .ant-select-selector {
          border: none !important;
          box-shadow: none !important;
          padding-left: 22px;
          .ant-select-selection-search-input {
            padding-left: 11px;
          }
        }
      }
    }
  }
  .menu_ul {
    width: 100%;
    height: 0;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    background: #FFFFFF;
    border-radius: 0 0 @border-radius-base @border-radius-base;
    
    .ant-menu-item:hover {
      background-color: @primary-bg-color !important;
    }
    .ant-menu.ant-menu-inline {
      background: transparent;
      position: relative;
      .nav_bar {
        width: 2px;
        height: calc(100% - 8px);
        background: #d9e2eb;
        border-radius: 0px 0px 0px 0px;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        z-index: 1;
      }
      .ant-menu-item {
        .action_bar {
          position: absolute;
          top: 0;
          bottom: 0;
          border-right-width: 2px;
          z-index: 1;
          border-right: 2px solid #05c059;
          transform: scaleY(0.0001);
          opacity: 0;
          transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
            opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        &.ant-menu-item-selected {
          background: transparent;
          &::after {
            display: none;
          }
          .action_bar {
            transform: scaleY(1);
            opacity: 1;
            transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
              opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
      }
    }
  }
}
</style>
