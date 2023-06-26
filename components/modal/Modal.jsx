import Icon from '../icon/index';
import { Modal as AModal, message, Button as AButton } from 'ant-design-vue';
import { watch, defineComponent, computed, reactive } from 'vue';

// 自定义弹窗
const Modal = defineComponent({
  name: "CModal",
  props: {
    // 标题
    title: String,
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
      type: String,
      default: '确定取消按钮',
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
    icon: String,
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
    const customProps = computed(() => {
      return {
        ...props,
        ...attrs,
        title: undefined,
        footer: modalState.isHiddenFooter ? null : undefined,
      };
    });
    const modalState = reactive({
      visible: false,
      loading: false,
      maskStyle: {
        background: "rgba(0, 13, 22, 0.7200)",
        backdropFilter: "blur(1px)",
      },
      isHiddenFooter: computed(() => {
        return props.footer + '' == 'null';
      }),
    });

    // 确定事件
    function confirm() {
      if (!modalState.visible || modalState.loading) return;
      isClose(props.onOk);
    }
    // 关闭弹窗
    function close() {
      modalState.visible = false;
      emit("update:visible", false);
      changeLoading(false);
    }
    // 是否关闭弹窗
    function isClose(someFunction) {
      if (props.loading) {
        message.warning('正在保存操作中，请稍候...');
        return;
      }
      changeLoading(true);
      if (typeof someFunction == 'function') {
        let fun = someFunction();
        if(fun instanceof Promise) {
          fun.then(() => {
            close();
          }).catch(() => {
            changeLoading(false);
          })
        } else {
          close();
        }
      } else {
        close();
      }
    }
    // 更新loading
    function changeLoading(flag) {
      modalState.loading = flag;
      emit('update:loading', flag);
    }

    watch(() => [props.visible, props.loading], ([visible, loading]) => {
      modalState.visible = visible;
      modalState.loading = loading;
      if (!visible) {
        emit("update:visible", false);
      }
    }, { immediate: true });
    
    expose({
      close: isClose
    })

    return () => {
      const modalSlots = {
        ...slots,
        footer: () => {
          return modalState.isHiddenFooter
          ? undefined
          : (
              <div class="flex-between-center">
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
                                onClick={() => isClose(props.onCancel)}
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
                            onClick={confirm}
                            {...props.okButtonProps}
                          >
                            { slots?.okText || props.okText }
                          </AButton>
                        </>
                      )
                  }
                </div>
              </div>
            )
        },
        closeIcon: () => (
          <>
            { slots?.closeIcon?.() || <Icon isSvg icon="cyber-close" size="14"></Icon> }
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
          ]}
          maskClosable={false}
          maskStyle={modalState.maskStyle}
          v-slots={modalSlots}
          {...customProps}
          onCancel={() => {
            isClose(props.onCancel);
          }}
          v-model:visible={modalState.visible}
        ></AModal>
      )
    };
  },
});

export default Modal;
