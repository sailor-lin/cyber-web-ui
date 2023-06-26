import Icon from '../icon';
import { Input as AInput } from 'ant-design-vue';
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'CInputPassword',
  props: {
    showEye: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const inputState = reactive({
      type: 'password',
    });

    function typeChange() {
      inputState.type = inputState.type == 'password' ? 'text' : 'password';
    }

    return () => {
      const inputSlots = {
        ...slots,
        suffix() {
          if(!props.showEye) return;
          return (
            <Icon
              isSvg
              size="16"
              style="cursor: pointer;"
              icon={inputState.type == 'password' ? 'cyber-yincang' : 'cyber-xianshi'}
              onClick={typeChange}
            ></Icon>
          )
        }
      }
      return (
        <AInput
          placeholder="请输入密码"
          {...attrs}
          v-slots={inputSlots}
          type={inputState.type}
        ></AInput>
      )
    }
  }
});
