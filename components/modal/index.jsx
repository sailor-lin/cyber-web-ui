import Icon from '../icon/index.jsx';
import { Modal as AModal, message, Button as AButton } from 'ant-design-vue';
import { watch, defineComponent, computed, reactive, createVNode, render as vueRender } from 'vue';

// 自定义弹窗
const Modal = defineComponent({
  name: "CModal",
  props: {
    // 标题
    title: {
      type: String,
      default: '',
    },
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    onCancel: {
      type: Function,
      default: undefined,
    },
    onOk: {
      type: Function,
      default: undefined,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    // 确定按钮配置
    okButtonProps: {
      type: Object,
      default: () => {},
    },
    // 取消按钮配置
    cancelButtonProps: {
      type: Object,
      default: () => {},
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    // 标题icon
    icon: {
      type: String,
      default: '',
    },
    // 标题icon配置
    iconProps: {
      type: Object,
      default: () => ({
        isSvg: true,
        size: '16'
      }),
    },
  },
  setup(props, { attrs, emit, expose, slots }) {
    const modalState = reactive({
      visible: false,
      loading: false,
      maskStyle: {
        background: "rgba(0, 13, 22, 0.7200)",
        backdropFilter: "blur(1px)",
      },
    });
    const methods = {
      // 确定事件
      confirm() {
        if (!modalState.visible || modalState.loading) return;
        methods.isClose(props.onOk);
      },
      // 关闭弹窗
      close() {
        modalState.visible = false;
        emit("update:visible", false);
        methods.changeLoading(false);
      },
      // 是否关闭弹窗
      isClose: (someFunction) => {
        if (props.loading) {
          message.warning('正在保存操作中，请稍候...');
          return;
        }
        methods.changeLoading(true);
        if (typeof someFunction == 'function') {
          let fun = someFunction();
          if(fun instanceof Promise) {
            fun.then(() => {
              methods.close();
            }).catch(() => {
              methods.changeLoading(false);
            })
          } else {
            methods.close();
          }
        } else {
          methods.close();
        }
      },
      // 更新loading
      changeLoading(flag) {
        modalState.loading = flag;
        emit('update:loading', flag);
      },
    };
    watch(() => [props.visible, props.loading], ([visible, loading]) => {
      modalState.visible = visible;
      modalState.loading = loading;
      if (!visible) {
        emit("update:visible", false);
      }
    }, { immediate: true });
    
    expose({
      close: methods.isClose
    })

    return () => {
      const customSlots = {
        ...slots,
        footer: () => (
          <>
            { props.footer
              ? <div class="flex-between-center">
                  <div class="flex-center">
                    { slots?.footerLeft?.() }
                  </div>
                  <div class="footer-button-body">
                    { slots?.footer?.()
                      || (
                          <>
                            {
                              props?.showCancel
                              ? <AButton
                                  type="ghost"
                                  onClick={() => methods.isClose(props.onCancel)}
                                  pattern="primary"
                                  {...props.cancelButtonProps}
                                >
                                  { slots?.cancelText || props.cancelText }
                                </AButton>
                              : ''
                            }
                            <AButton
                              type="primary"
                              loading={!modalState.visible || modalState.loading}
                              onClick={methods.confirm}
                              {...props.okButtonProps}
                            >
                              { slots?.okText || props.okText }
                            </AButton>
                          </>
                        )
                    }
                  </div>
                </div>
              : ''
            }
          </>
        ),
        closeIcon: () => (
          <>
            { slots?.closeIcon?.() || <Icon isSvg icon="icon-guanbi" size="14"></Icon> }
          </>
        ),
        title: () => {
          if(slots?.title) {
            return slots.title();
          } else if(props.icon) {
            return (
              <>
                <Icon icon={props.icon} size="16" style="margin-right: 12px;" {...props.iconProps}></Icon>
                <span>{props.title}</span>
              </>
            );
          } else {
            return props.title;
          }
        }
      };

      return (
        <AModal
          class={[
            'cyber-modal',
            props.large ? 'cyber-large-modal' : '',
            props.footer ? '' : 'hidden-footer'
          ].join(' ')}
          maskClosable={false}
          maskStyle={modalState.maskStyle}
          {...{
            ...props,
            ...attrs,
            title: undefined,
          }}
          v-slots={customSlots}
          onCancel={() => {
            methods.isClose(props.onCancel);
          }}
          v-model:visible={modalState.visible}
        ></AModal>
      )
    };
  },
});

// 弹窗确定 - 方法
Modal.confirm = (config) => {
  const container = document.createDocumentFragment();
  const currentConfig = {
    width: '600px',
    ...config,
    visible: true,
  };

  const children = typeof config.content == 'function'
    ? config.content
    : () => config.content;

  function render(props) {
    const vm = createVNode(GModal, { ...props }, children);
    vueRender(vm, container);
    return vm;
  }

  render(currentConfig);
};

// 提示信息弹窗 - 方法
Modal.info = (config) => {
  GModal.confirm({
    ...config,
    showCancel: false,
    okButtonProps: {
      pattern: 'primary',
      ...(config?.okButtonProps || {})
    },
  })
}

export default Modal;
