<template>
  <div class="login_page">
    <Header>
      <template #right>
        <div class="extended_function">
          <div>首页</div>
          <div>文档</div>
          <div>社区</div>
          <div>简体中文</div>
        </div>
      </template>
    </Header>
    <div class="login_page_main">
      <div class="login_content">
        <div class="login_intro">
          <div class="title">两仪-原生超融合</div>
          <div class="tips">两仪云原生超融合一体机，完全符合信创要求。底层基于 OpenEuler 操作系统，上层基于先进的 Kubernetes 与 KubeVirt 开源项目，自主研发实现容器与虚拟机统一管理，是目前云计算领域混排技术最好的方案</div>
        </div>
        <div class="login_body">
          <div class="scan_code_body">
            <span class="scan_title">扫码登录</span>
            <img class="wechant_code" src="~@/assets/img/wechat_code.png" alt="">
            <span class="scan_code_tip">
              <span>请使用 微信 扫一扫登录&nbsp;&nbsp;</span>
              <label class="scan_code_refresh">
                <span>刷新 </span>
                <g-icon icon="icon-shuaxin"></g-icon>
              </label>
            </span>
          </div>
          <div class="login_form_body">
            <div class="login_method_tab">
              <div
                :class="[{ 'active': state.loginMethod == 1 }]"
                @click="methods.changeLoginMethod(1)"
              >密码登录</div>
              <div
                :class="[{ 'active': state.loginMethod == 2 }]"
                @click="methods.changeLoginMethod(2)"
              >短信登录</div>
            </div>
            <PasswordForm v-if="state.loginMethod == 1"></PasswordForm>
            <EmailForm v-else-if="state.loginMethod == 2"></EmailForm>
            <g-button
              size="large"
              type="primary"
              pattern="primary"
              width="100%"
              @click="methods.onSubmit"
            >登录</g-button>
            <div class="more_account_operations">
              <div>注册账号</div>
              <div>忘记密码</div>
            </div>
            <div class="login_problem">登录遇到问题？</div>
            <div class="login_tip">
              <span>原登录方式不可用、密码无法找回、账号管理员变动，前往进行 </span>
              <a href="javascript:;">自助申诉</a>
              <span> 其他 登录异常，请参考 </span>
              <a href="javascript:;">登录异常帮助文档</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      Copyright © 2023-{{ new Date().getFullYear() }} Twins Cloud. All Rights Reserved. 元启智数 版权所有
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/layouts/header.vue';
import PasswordForm from './modules/PasswordForm.vue';
import EmailForm from './modules/EmailForm.vue';
const $useRouter = useRouter();

const state = reactive({
  loginMethod: 1,
})
const methods = {
  changeLoginMethod(method) {
    state.loginMethod = method;
  },
  onSubmit() {
    $useRouter.push({
      name: 'Example'
    })
  },
};
</script>

<style lang="less">
.login_page {
  width: 100%;
  height: 100vh;
  min-height: 740px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #1E3346;
  .extended_function {
    display: grid;
    grid: auto / auto auto auto auto;
    gap: 0 20px !important;
    & > * {
      .main-body-deepen();
      cursor: pointer;
    }
  }

  .login_page_main {
    width: 100%;
    height: 0;
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    .login_content {
      display: flex;
      width: 84%;
      height: 62%;
      min-height: 520px;
      margin: auto 0;
      .login_intro {
        width: 0;
        flex: 1;
        margin-right: 9%;
        .title {
          font-size: 36px;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 50px;
          margin: 97px 0 36px;
        }
        .tips {
          font-weight: 400;
          color: #FFFFFF;
          line-height: 22px;
        }
      }
      .login_body {
        width: 54%;
        min-width: 725px;
        background: #FFFFFF;
        border-radius: @border-radius-base;
        padding: 4% 2.5% 0 5%;
        display: flex;
        .scan_code_body {
          width: 34.207%;
          padding: 7% 5.6% 4% 0;
          margin-bottom: 10%;
          border-right: 1px solid #D9E2EB;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin-right: 41px;
          .scan_title {
            .big-title();
            font-weight: 600;
            line-height: 34px;
          }
          .wechant_code {
            width: 100%;
          }
          .scan_code_tip {
            .main-body-deepen();
            line-height: 20px;
            .scan_code_refresh {
              color: #2D4C92;
              cursor: pointer;
            }
          }
        }
        .login_form_body {
          width: 0;
          flex: 1;
          .login_method_tab {
            display: flex;
            align-items: center;
            margin-bottom: 60px;
            & > div {
              .big-title();
              color: #666666;
              line-height: 34px;
              padding: 9px 0 4px;
              border-bottom: 1px solid transparent;
              margin-right: 30px;
              cursor: pointer;
              &.active {
                color: @primary-color;
                border-color: @primary-color;
              }
            }
          }

          .more_account_operations {
            .main-body-tip();
            display: flex;
            justify-content: flex-end;
            line-height: 20px;
            margin-top: 20px;
            & > div {
              margin-left: 20px; 
              cursor: pointer;
            }
          }
          .login_problem {
            .main-body-deepen();
            line-height: 20px;
            margin-top: 10px;
          }
          .login_tip {
            .main-body-tip();
            line-height: 20px;
            margin-top: 10px;
          }
        }
      }
    }
  }
  
  .copyright {
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    z-index: 2;
    text-align: center;
    padding-bottom: 20px;
  }
}
</style>
