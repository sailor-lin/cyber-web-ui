 <template>
  <div class="layout">
    <Header class="layout-header">
      <template #icon>
        <img src="~@/assets/img/logo/twins_white.svg">
      </template>
      <template #left>
        <div style="margin-left: 31px; display: flex; align-items: center; color: #FFFFFF;">
          <div style="cursor: pointer;">
            <g-icon isSvg icon="icon-lv2" size="16"></g-icon>
            <span style="margin-left: 8px;">工作台</span>
          </div>
        </div>
      </template>
      <template #right>
        <!-- 操作菜单 -->
        <g-dropdown :overlayMenu="layoutState.overlayMenu">
          <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <g-icon isSvg icon="icon-yonghu" size="16"></g-icon>
            <span style="margin: 0 8px;">管理员</span>
            <g-icon icon="icon-hei-2" color="#FFFFF" size="16"></g-icon>
          </div>
        </g-dropdown>
      </template>
    </Header>
    <div class="layout-content">
      <Menu v-if="!$useRoute.meta.hidden"></Menu>
      <div class="layout-scroll">
        <div class="layout-body" ref="layoutBody">
          <slot></slot>
        </div>
        <div class="copyright">Copyright © 2023-{{ new Date().getFullYear() }} Twins Cloud. All Rights Reserved. 元启智数 版权所有</div>
      </div>
    </div>
    <Tools></Tools>
    <!-- 全局loading -->
    <div class="layout-body-loading" v-if="layoutState.loading">
      <a-spin size="large" tip="Loading..." />
    </div>
  </div>
</template>

<script setup>
import bus from '@/utils/bus';
import Menu from "./menu.vue";
import Tools from './tools.vue';
import Header from "./header.vue";
// import cookie from "@/utils/cookie/index.js";
const layoutBody = ref();
const $useRoute = useRoute();
const $useRouter = useRouter();

const layoutState = reactive({
  overlayMenu: [
    {
      label: '退出登录',
      handler: () => methods.logout(),
    }
  ],
  loading: false,
});
const isShowScrollBar = inject("isShowScrollBar", false);
const layoutHeight = computed(() => {
  return isShowScrollBar.value ? `calc(100% - 17px)` : `100%`;
});
const methods = {
  logout() {
    // $useStore.commit("token", "");
    // cookie.delete("token");
    // window.location.reload();
    console.log('??')
    $useRouter.push('/login')
  },
};

// 全局loading
bus.on("CHANGE_BODY_LOADING", (loading) => layoutState.loading = loading);
onUnmounted(() => {
  bus.off("CHANGE_BODY_LOADING")
});
</script>

<style lang="less">
.layout {
  width: 100%;
  height: v-bind(layoutHeight);
  display: flex;
  flex-direction: column;
  &::before {
    display: table;
    content: '';
  }
  &::after {
    display: table;
    content: '';
  }
  .layout-header {
    background: @dark-color;
    color: #FFFFFF;
    position: relative;
    z-index: 1009;
    .extended_function {
      display: grid;
      grid: auto / auto auto auto auto;
      gap: 0 20px !important;
      & > * {
        cursor: pointer;
      }
    }
  }
  .layout-content {
    width: 100%;
    height: 0;
    flex: 1;
    display: flex;
    position: relative;
    .layout-scroll {
      width: 0;
      flex: 1;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .layout-body {
        width: 100%;
        min-height: calc(100% - 43px);
        padding: 24px 30px 16px 30px;
        position: relative;
      }
      .copyright {
        padding-bottom: 18px;
        text-align: center;
      }
    }
  }
  .layout-body-loading {
    .flex-center-center();
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #FFFFFF8D;
    z-index: 9999;
  }
}
</style>
