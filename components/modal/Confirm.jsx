import { defineComponent, computed, reactive, createVNode, render as vueRender } from 'vue';
import Modal from './Modal';

function renderSomeContent(someContent) {
  if (typeof someContent === 'function') {
    return someContent();
  }
  return someContent;
}

const ConfirmDialog = defineComponent({
  name: 'ConfirmDialog',
  props: [
    'icon',
    'visible',
    'width',
    'mask',
    'title',
    'content',
  ],
  setup(props, { attrs }) {
    return () => {
      const {
        icon = 'cyber-tishi',
        visible,
        width = 500,
        mask = true,
        title = `系统提示`,
        content,
      } = props;
      return (
        <Modal
          visible={visible}
          icon={icon}
          width={width}
          mask={mask}
          title={title}
          {...attrs}
        >
          { renderSomeContent(content) }
        </Modal>
      );
    };
  },
});

// 弹窗确定 - 方法
export default (config) => {
  const container = document.createDocumentFragment();
  let currentConfig = {
    ...config,
    visible: true,
  };
  let confirmDialogInstance = null;

  function destroy() {
    update({ ...currentConfig, visible: false });
  }
  function update(configUpdate) {
    currentConfig = {
      ...currentConfig,
      ...configUpdate,
    };
    if (confirmDialogInstance) {
      Object.assign(confirmDialogInstance.component.props, currentConfig);
      confirmDialogInstance.component.update();
    }
  }

  const Wrapper = (config) => {
    return (
      <ConfirmDialog { ...config }></ConfirmDialog>
    );
  };

  function render(props) {
    const vm = createVNode(Wrapper, { ...props });
    vueRender(vm, container);
    return vm;
  };

  confirmDialogInstance = render(currentConfig);
  return {
    destroy: destroy,
    update,
  }
};
