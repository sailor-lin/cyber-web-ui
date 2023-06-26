import Icon from '../icon';
import { filterEmpty } from '../_utils';
import { defineComponent, reactive, computed } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';
import { permissionStore } from '../_utils/store';

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
      default: ''
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
    // 权限
    permission: {
      type: [String, Array, Boolean],
      default: true
    },
  },
  setup(props, { attrs, slots, emit, expose }) {

    const cellState = reactive({
      hover: false,
    });
    const hasPermission = computed(() => {
      return props.to && permissionStore().hasPermission(props.permission);
    });
    function mouseEnterHandler() {
      if(!hasPermission.value) return;
      cellState.hover = true;
    }
    function mouseLeaveHandler() {
      cellState.hover = false;
    }

    return () => {
      function iconSlot() {
        return slots.icon
          ? slots.icon?.()
          : props.icon
            ? <Icon icon={props.icon} class="cyber-cell-icon" size="16" { ...props.iconProps }></Icon>
            : undefined;
      }
      function titleSlot() {
        let list = filterEmpty(slots.default ? slots.default() : []);
        let title = (children) => {
          return hasPermission.value
            ? <RouterLink
                to={props.to}
                class="cyber-cell-router-link"
                onmouseenter={mouseEnterHandler}
                onmouseleave={mouseLeaveHandler}
              >{ children }</RouterLink>
            : <span>{ children }</span>
        };
        return list?.length
          ? title(list)
          : <ATooltip v-slots={{ title: props.title ? () => props.title : undefined }}>
              { title(props.title) }
            </ATooltip>
      }
      function tipsSlot() {
        let list = filterEmpty(slots.tips ? slots.tips() : []);
        let tips = (children) => <span class="cyber-cell-tip">{ children }</span>;
        if(list.length) return tips(list);
        if(!props.tips) return;
        return (
          <ATooltip placement='bottom' v-slots={{ title: props.tips ? () => props.tips : undefined }}>
            { tips(props.tips) }
          </ATooltip>
        );
      }
      return (
        <div class={['cyber-cell', { 'cyber-cell-link': hasPermission.value }, { 'cyber-cell-hover': cellState.hover }]}>
          { iconSlot() }
          <div class="cyber-cell-body">
            { titleSlot() }
            { tipsSlot() }
          </div>
        </div>
      );
    }
  },
});
