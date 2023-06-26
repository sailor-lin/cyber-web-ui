import { defineComponent, computed } from 'vue';
import Login from './Login';
import { configStore } from '../_utils/store';
import { changeLocation } from '../_utils/history';

export default defineComponent({
  name: 'CLoginPage',
  props: {
    logo: String,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const $configStore = configStore();
    
    const logo = computed(() => {
      return props.logo || $configStore.loginLogo;
    });

    const pageStyle = computed(() => {
      let obj = {};
      if($configStore.loginBackground) obj['background-image'] = `url(${$configStore.loginBackground})`;
      return obj;
    });


    function onFinish() {
      changeLocation($configStore.loginPath);
    }

    return () => {
      return (
        <div class="cyber-login-page" style={pageStyle.value}>
          <Login style="margin: auto;" onFinish={onFinish} logo={ logo.value }></Login>
          <div class="cyber-copyright-footer">{ $configStore.copyright }</div>
        </div>
      )
    }
  }
});
