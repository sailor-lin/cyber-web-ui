import Icon from '../icon';
import { defineComponent, computed } from 'vue';
import { historyBack } from '../_utils/history.js';
import { DOCUMENT_ADDRESS } from '../_utils/config.js';

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
    
    const documentLink = computed(() => {
      if(!props.documentLink) return;
      if(/^http(s?):\/\//.test(props.documentLink)) return props.documentLink;
      return DOCUMENT_ADDRESS + props.documentLink
    });

    function backHandler() {
      // 若有自定义返回方法，则调用该方法
      if(props.onBack) {
        props.onBack();
        return;
      }
      // 默认返回方法，若无可返回路径，则跳转到指定返回路径
      historyBack(props.back);
    }

    expose({
      back: backHandler,
    });

    return () => {
      function breadcrumbSlot() {
        return slots.header
          ? slots.header()
          : props.showHeader
            ? <div class="cyber-page-label-header">
                <Icon
                  icon="cyber-fanhui"
                  isSvg
                  size="21"
                  class="cyber-back-icon"
                  onClick={backHandler}
                ></Icon>
                { slots.breadcrumb?.() }
              </div>
            : undefined;
      }
      function iconSlot() {
        return slots.icon
          ? slots.icon?.()
          : <Icon isSvg icon={props.icon} size="64"></Icon>
      }
      function titleSlot() {
        return <div class="cyber-page-label-title">
          {
            slots.title
              ? slots.title?.()
              : props.title
          }
        </div>
      }
      function tipsSlot() {
        return slots.tips || props.tips
          ? <div class="cyber-page-label-tips">
              { slots.tips
                  ? slots.tips()
                  : props.tips
              }
              {
                documentLink.value
                  ? <a href={documentLink.value} target="_blank" class="document_link">{ props.documentText }</a>
                  : undefined
              }
            </div>
          : undefined
      }
      return (
        <div class="cyber-page-label">
          { breadcrumbSlot() }
          <div class="cyber-page-label-body">
            <div class="cyber-page-label-body-left">
              <div class="title-icon">
                { iconSlot() }
              </div>
              <div class="cyber-page-label-content">
                { titleSlot() }
                { tipsSlot() }
              </div>
            </div>
            { slots.right?.() }
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
