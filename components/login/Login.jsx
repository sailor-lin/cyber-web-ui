import { defineComponent,  reactive } from 'vue';
import Icon from '../icon';
import Select from '../select';
import { InputPassword } from '../input';
import {
  Tabs as ATabs, TabPane as ATabPane,
  Button as AButton, Tooltip as ATooltip,
  InputGroup as AInputGroup, Input as AInput,
  Form as AForm, FormItem as AFormItem, FormItemRest as AFormItemRest,
  message
} from 'ant-design-vue';
import { required } from '../_utils/rules';
import { userStore } from '../_utils/store';

export default defineComponent({
  name: 'CLogin',
  props: {
    logo: String,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const $userStore = userStore();
    const loginState = reactive({
      loading: false,
      activeKey: 'account',
      resetGrogress: 0,
      errorTips: '',
    });
    const formState = reactive({
      userName: undefined,
      password: undefined,
      phone: undefined,
      countryCode: '+86',
      authCode: undefined,
    });
    const rules = reactive({
      userName: required('用户名不能为空'),
      password: required('密码不能为空'),
      phone: required('手机号不能为空'),
      authCode: required('验证码不能为空'),
      confirmPassword: required('确认密码不能为空'),
    });
    const options = {
      countryCode: [
        { label: '+86', value: '+86' },
      ]
    }
    
    function changeActiveKey(activeKey) {
      loginState.errorTips = '';
      loginState.resetGrogress = 0;
      loginState.activeKey = activeKey;
      Object.keys(formState).forEach(key => formState[key] = undefined);
      formState.countryCode = '+86';
    }
    function sendAuthCode() {
      loginState.errorTips = '暂不支持该功能！';
    }
    function onFinish() {
      loginState.loading = true;
      loginState.errorTips = '';
      if(loginState.activeKey == 'account') {
        accountLogin();
        return;
      }
      if(/authCode|reset/.test(loginState.activeKey)) loginState.errorTips = '暂不支持该功能！'
      loginState.loading = false;
    }
    function onFinishFailed(error) {
      console.log("onFinishFailed", error)
    }
    async function accountLogin() {
      try {
        await $userStore.login({
          userName: formState.userName,
          password: formState.password,
        });
        loginSuccessfully();
      } catch(error) {
        console.log('error', error)
        loginFailure(error, '登录失败：');
      }
      setTimeout(() => {
        loginState.loading = false;
      }, 1000);
    }
    function loginSuccessfully() {
      message.success('登录成功！');
      emit('finish');
    }
    function loginFailure(error, prefix) {
      if(!error) return;
      loginState.errorTips = prefix + error;
    }

    return () => {
      function logoSlot() {
        return (
          <div class="cyber-loadin-body-logo">
            { slots.logo
                ? slots.logo()
                : props.logo
                  ? <img class="cyber-login-logo" src={props.logo}/>
                  : <span style="font-size: 24px; font-weight: 600;">Logo</span>
            }
          </div>
        )
      }
      function accountLoginSlot() {
        function defaultSlot() {
          if(loginState.activeKey != 'account') return;
          return (
            <>
              <AFormItem name="userName">
                <AInput 
                  size="large"
                  disabled={loginState.loading}
                  placeholder="请输入邮箱/账号名/手机号"
                  v-model:value={formState.userName}
                  v-slots={{ prefix: () => <Icon isSvg size="16" icon="cyber-yonghu" style="margin-right: 10px;" /> }}
                ></AInput>
              </AFormItem>
              <AFormItem name="password">
                <InputPassword
                  size="large"
                  disabled={loginState.loading}
                  v-model:value={formState.password}
                  v-slots={{
                    prefix: () => <Icon isSvg size="16" icon="cyber-suo" style="margin-right: 10px;" />,
                  }}
                ></InputPassword>
              </AFormItem>
            </>
          )
        }
        return (
          <ATabPane key="account" v-slots={{ tab: () => <div class="cyber-login-tab-text">账号密码</div> }}>
            { defaultSlot() }
          </ATabPane>
        )
      }
      function authCodeLoginSlot() {
        function defaultSlot() {
          if(loginState.activeKey != 'authCode') return;
          return (
            <>
              <AFormItem name="phone">
                <AInputGroup compact>
                  <AFormItemRest>
                    <Select
                      size="large"
                      style="width: 80px;"
                      v-model:value={formState.countryCode}
                      options={options.countryCode}
                    ></Select>
                  </AFormItemRest>
                  <AInput
                    size="large"
                    disabled={loginState.loading}
                    placeholder="手机号"
                    v-model:value={formState.phone}
                    style="width: calc(100% - 80px); border-left: none;"
                  ></AInput>
                </AInputGroup>
              </AFormItem>
              <AFormItem name="authCode">
                <AInputGroup compact style="display: flex;">
                  <AInput
                    size="large"
                    disabled={loginState.loading}
                    placeholder="验证码"
                    v-model:value={formState.authCode}
                  ></AInput>
                  <AButton type="primary" size="large" onClick={() => sendAuthCode()}>获取验证码</AButton>
                </AInputGroup>
              </AFormItem>
            </>
          )
        }
        return (
          <ATabPane key="authCode" v-slots={{ tab: () => <div class="cyber-login-tab-text">验证码登录</div> }}>
            { defaultSlot() }
          </ATabPane>
        )
      }
      function moreLoginSlot() {
        return (
          <ATabPane key="more" v-slots={{ tab: () => <div class="cyber-login-tab-text">其他方式</div> }}>
            <div class="cyber-login-more-login">该功能暂未开放，敬请期待！</div>
          </ATabPane>
        )
      }
      function resetSlot() {
        function defaultSlot() {
          if(loginState.activeKey != 'reset') return;
          if(loginState.resetGrogress == '0') {
            return (
              <>
                <AFormItem name="phone">
                  <AInput
                    size="large"
                    disabled={loginState.loading}
                    placeholder="请输入账号关联的邮箱/手机号"
                    v-model:value={formState.phone}
                  ></AInput>
                </AFormItem>
                <AFormItem name="authCode">
                  <AInputGroup compact style="display: flex;">
                    <AInput
                      size="large"
                      disabled={loginState.loading}
                      placeholder="验证码"
                      v-model:value={formState.authCode}
                    ></AInput>
                    <AButton type="primary" size="large" onClick={() => sendAuthCode()}>获取验证码</AButton>
                  </AInputGroup>
                </AFormItem>
              </>
            )
          } else {
            return (
              <>
                <AFormItem name="password">
                  <InputPassword
                    size="large"
                    disabled={loginState.loading}
                    v-model:value={formState.password}
                    v-slots={{
                      prefix: () => <Icon isSvg size="16" icon="cyber-suo" style="margin-right: 10px;" />,
                    }}
                  ></InputPassword>
                </AFormItem>
                <AFormItem name="confirmPassword">
                  <InputPassword
                    size="large"
                    disabled={loginState.loading}
                    v-model:value={formState.confirmPassword}
                    v-slots={{
                      prefix: () => <Icon isSvg size="16" icon="cyber-suo" style="margin-right: 10px;" />,
                    }}
                  ></InputPassword>
                </AFormItem>
              </>
            )
          }
        } 
        return (
          <ATabPane key="reset" v-slots={{ tab: () => <div class="cyber-login-tab-text">重置密码</div> }}>
            { defaultSlot() }
          </ATabPane>
        )
      }
      function loginSlot() {
        if(loginState.activeKey == 'reset') return resetSlot();
        return <>
            { accountLoginSlot() }
            { authCodeLoginSlot() }
            { moreLoginSlot() }
          </>
      }
      function buttonSlot() {
        if(loginState.activeKey == 'more') return;
        return (
          <AFormItem>
            <AButton
              block
              size="large"
              type="primary"
              html-type="submit"
              loading={loginState.loading}
            >{  
                loginState.activeKey == 'reset'
                  ? loginState.resetGrogress == '0'
                      ? loginState.loading ? '验证中' : '下一步' 
                      : loginState.resetGrogress == '1'
                        ? loginState.loading ? '重置中' : '下一步'
                        : '返回'
                  : loginState.loading ? '登录中' : '登录'
            }</AButton>
          </AFormItem>
        )
      }
      function loginExtend() {
        if(loginState.activeKey == 'more') return;
        return (
          <div class="cyber-login-extend">
            <span class={[{ 'cyber-login-tips' : loginState.errorTips }]}>{ loginState.errorTips || '' }</span>
            <div class="cyber-login-extend-action">
              {
                /account|authCode/.test(loginState.activeKey)
                  ? (
                      <ATooltip placement="bottom" overlayStyle={{ maxWidth: '150px' }} trigger="click" arrowPointAtCenter
                        v-slots={{ title: () => <span>不开放注册账号功能，请联系管理员处理。</span> }}
                      >
                        <span>注册账号</span>
                      </ATooltip>
                    )
                  : undefined
              }
              { loginState.activeKey == 'account' ? <span onClick={() => changeActiveKey('reset')}>忘记密码</span> : undefined }
              { loginState.activeKey == 'reset' ? <span onClick={() => changeActiveKey('account')}>返回</span> : undefined }
            </div>
          </div>
        )
      }

      return (
        <div class="cyber-login-body">
          { logoSlot() }
          <AForm
            model={formState}
            name="cyber-login"
            autocomplete="off"
            rules={rules}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <ATabs
              centered
              tabBarGutter={0}
              class="cyber-login-tabs"
              v-model:activeKey={loginState.activeKey}
              onChange={() => loginState.errorTips = ''}
            >
              { loginSlot() }
            </ATabs>
            { buttonSlot() }
          </AForm>
          { loginExtend() }
        </div>
      )
    }
  }
});
