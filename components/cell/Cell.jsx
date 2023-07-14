import Icon from '../icon';
import isWindows from '../_utils/is-windows';
import { analysisHistory } from '../_utils/history.js';
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'CCell',
  props: {
    // 图标
    icon: {
      type: String,
      default: '',
    },
    iconProps: {
      type: Object,
      default: () => {},
    },
    // 标题
    title: {
      type: String,
      default: '标题'
    },
    // 提示文本
    tips: {
      type: String,
      default: ''
    },
    // 跳转路径
    to: {
      type: String,
      default: undefined
    },
  },
  setup(props, { attrs, slots, emit, expose }) {

    const cellState = reactive({
      path: computed(() => {
        if(!isWindows()) return props.to;
        let { url } = analysisHistory(window.location.href);
        let path = props.to.replace(/^#/, '');
        return /^#\//.test(url) ? `#${path}` : path;
      }),
      hover: false,
    });

    const methods = {
      mouseEnterHandler() {
        cellState.hover = true;
      },
      mouseLeaveHandler() {
        cellState.hover = false;
      },
    };

    return () => {
      const customSlots = {
        icon: () => {
          return slots.icon
            ? slots.icon?.()
            : props.icon
              ? <Icon icon={props.icon} class="cyber-cell-icon" size="16" { ...props.iconProps }></Icon>
              : undefined;
        },
        default: () => {
          return slots.default
            ? slots.default?.()
            : props.to
              ? <a href={cellState.path} class="cyber-cell-router-link"
                  onmouseenter={methods.mouseEnterHandler}
                  onmouseleave={methods.mouseLeaveHandler}
                >{ props.title }</a>
              : <span>{ props.title }</span>
            
        },
        tips: () => {
          return slots.tips
            ? slots.tips()
            : props.tips
              ? <span class="cyber-cell-tip">
                  <slot name="tips">{ props.tips }</slot>
                </span>
              : undefined
        }
      };
      return (
        <div class={['cyber-cell', { 'cyber-cell-hover': cellState.hover }]}>
          { customSlots.icon() }
          <div class="cyber-cell-body">
            { customSlots.default() }
            { customSlots.tips() }
          </div>
        </div>
      );
    }
  },
});
