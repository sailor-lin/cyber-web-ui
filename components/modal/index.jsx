import Modal from "./Modal";
import confirm from './Confirm';
import { Input as AInput, message } from 'ant-design-vue';
import { createVNode } from 'vue';
import axios from '../_utils/api';

Modal.confirm = (props) => {
  return confirm({
    ...props,
    okButtonProps: {
      danger: true,
      ...(props.okButtonProps || {}),
    },
  });
};

Modal.info = (props) => {
  return confirm({
    showCancel: false,
    ...props,
    okButtonProps: {
      danger: true,
      ...(props.okButtonProps || {}),
    },
  });
};

/**
 * @param {{ value: String, content: String, params: Object }} 其中，value为输入框确认的值，content为内容提示信息，params为接口请求参数
 * @returns {Promise}
 */
Modal.verify = ({ value = '确定', content = '正在进行xx操作，输入“确定”进行确认！', params } = {}, props = {}) => {
  return new Promise((resolve, reject) => {
    let currentValue = '';
    const inputRef = createVNode(AInput, {
      onInput: ({ target }) => {
        currentValue = target.value;
      },
      class: 'warning-input',
    });
    confirm({
      ...props,
      okButtonProps: {
        danger: true,
        ...(props.okButtonProps || {}),
      },
      content: createVNode('div', {}, [
        createVNode('div', {
          style: "margin-bottom: 12px"
        }, content),
        inputRef
      ]),
      onOk: async () => {
        try {
          if(currentValue != value) {
            message.warning(`请输入正确的内容！`);
            return Promise.reject();
          }
          if(!params) throw Error('params 参数不能为空！');
          let res = await axios.request(params);
          message.success(res.message);
          resolve();
          return Promise.resolve();
        } catch(e) {
          console.log('error', e);
          return Promise.reject();
        }
      },
      onCancel: reject,
    });
  });
}

Modal.install = (app) => {
  app.component(Modal.name, Modal);
};

export default Modal;
