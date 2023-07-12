import Icon from '../icon';
import { defineComponent } from 'vue';
import { historyBack } from '../_utils/history.js';

const PageLabel = defineComponent({
  name: 'CPageLabel',
  props: {
    // 标题
    title: {
      type: String,
      default: "标题",
    },
    // 提示
    tips: {
      type: String,
      default: "",
    },
    // 图标
    icon: {
      type: String,
      default: "",
    },
    // 显示顶部导航栏
    showHeader: {
      type: Boolean,
      default: false,
    },
    // 默认返回路径
    back: {
      type: String,
      default: '',
    },
    // 文档链接
    documentLink: String,
    // 文档提示文本
    documentText: {
      type: String,
      default: '了解更多'
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    
    const methods = {
      // 默认返回方法
      backHandler() {
        // 若有自定义返回方法，则调用该方法
        if(props.onBack) {
          props.onBack();
          return;
        }
        // 默认返回方法，若无可返回路径，则跳转到指定返回路径
        historyBack(props.back);
      }
    };

    expose({
      back: methods.back,
    });

    return () => {
      const customSlots = {
        ...slots,
        breadcrumb: () => {
          return slots.header
            ? slots.header()
            : props.showHeader
              ? <div class="cyber-page-label-header">
                  <Icon
                    icon="cyber-fanhui"
                    isSvg
                    size="21"
                    class="cyber-back-icon"
                    onClick={methods.backHandler}
                  ></Icon>
                  { slots.breadcrumb?.() }
                </div>
              : undefined;
        },
        icon: () => {
          return slots.icon
            ? slots.icon?.()
            : <Icon isSvg icon={props.icon} size="64"></Icon>
        },
        title: () => {
          return <div class="cyber-page-label-title">
            {
              slots.title
                ? slots.title?.()
                : props.title
            }
          </div>
        },
        tips: () => {
          return slots.tips || props.tips
            ? <div class="cyber-page-label-tips">
                { slots.tips
                    ? slots.tips()
                    : props.tips
                }
                {
                  props.documentLink
                    ? <a href={props.documentLink} class="document_link">{ props.documentText }</a>
                    : undefined
                }
              </div>
            : undefined
        },
      }
      return (
        <div class="cyber-page-label">
          { customSlots.breadcrumb() }
          <div class="cyber-page-label-body">
            <div class="cyber-page-label-body-left">
              <div class="title-icon">
                { customSlots.icon() }
              </div>
              <div class="cyber-page-label-content">
                { customSlots.title() }
                { customSlots.tips() }
              </div>
            </div>
            { customSlots.right?.() }
          </div>
        </div>
      );
    }
  },
});

PageLabel.install = (app) => {
  app.component(PageLabel.name, PageLabel);
};

export default PageLabel;
