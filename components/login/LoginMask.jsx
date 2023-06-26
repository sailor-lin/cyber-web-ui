import { defineComponent,  reactive, Teleport, watch, watchEffect, createVNode, onUnmounted, Transition } from 'vue';
import { changeLocation } from '../_utils/history';
import Login from './Login';
import Icon from '../icon/index';
import Modal from '../modal/index';
import { useRouter, useRoute } from 'vue-router';
import { permissionStore, userStore, configStore } from '../_utils/store';
import bus from '../_utils/bus';

export default defineComponent({
  name: 'CLoginMask',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    logo: String,
    onFinish: Function,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const $useRoute = useRoute();
    const $useRouter = useRouter();
    const $permissionStore = permissionStore();
    
    const loginState = reactive({
      visible: false,
      hidden: true,
    });
    
    async function onFinish() {
      try {
        configStore().getProductConfig();
        await userStore().getInfo();
        await $permissionStore.generateRoutes($permissionStore.modules, $useRouter, $permissionStore.parentName);
        close();
        let name = $useRoute.name;
        if($permissionStore.removeRoutes?.[name]) {
          let countdown = 10;
          let interval = setInterval(() => {
            if(countdown > 0) update({ okText: `确定（${--countdown}）` });
            if(countdown == 0) closeCountdown();
          }, 1000);
          function closeCountdown() {
            interval && clearInterval(interval);
            changeLocation(configStore().homePath);
            props.onFinish && props.onFinish(true);
            setTimeout(() => {
              destroy();
            }, 200)
          }
          // 当前页面已无权限访问
          let { update, destroy } = Modal.info({
            content: createVNode('div', {}, '您已无当前页面访问权限，即将跳转至默认页面！'),
            okText: `确定（${countdown}）`,
            onOk: closeCountdown,
            onCancel: closeCountdown,
          });
        } else {
          props.onFinish && props.onFinish(false)
        }
      } catch(e) {
        console.log('error', e);
      }
    }
    function close() {
      loginState.visible = false;
      emit('update:visible', false);
    }

    watch(() => props.visible, (value) => {
      loginState.visible = value;
    }, { immediate: true });

    watchEffect(() => {
      if(loginState.visible) {
        document.body.classList.add('cyber-scrolling-effect');
        loginState.hidden = false;
      } else {
        setTimeout(() => {
          document.body.classList.remove('cyber-scrolling-effect');
          loginState.hidden = true;
        }, 200);
      }
    });
    
    bus.on('UNAUTHORIZED', () => {
      loginState.visible = true;
      emit('update:visible', true);
    });
    onUnmounted(() => {
      bus.off('UNAUTHORIZED');
    });
    return () => {
      if(loginState.hidden) return;
      return (
        <Teleport to=".cyber-scrolling-effect">
          <div class={['cyber-login-mask', { 'cyber-login-mask-hidden': !loginState.visible }]}>
            <Transition name="cyber-login-fade" mode="out-in" appear>
              {
                loginState.visible
                  ? <div style="position: relative;">
                      <div class="cyber-close-mask" onClick={close}>
                        <Icon icon="cyber-close" size="16px" isSvg />
                      </div>
                      <Login onFinish={onFinish} logo={props.logo}></Login>
                    </div> 
                  : undefined
              }
            </Transition>
          </div>
        </Teleport>
      );
    }
  }
});
