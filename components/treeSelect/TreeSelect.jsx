import Icon from '../icon';
import { TreeSelect } from 'ant-design-vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CTreeSelect',
  props: {
    fieldNames: Object,
    filterTreeNode: Function,
  },
  setup(props, { attrs, slots, emit, expose }) {

    function filterTreeNode(inputValue, treeNode) {
      if(props.filterTreeNode) return props.filterTreeNode(inputValue, treeNode);
      let label = props.fieldNames?.label || 'title';
      return treeNode[label].includes(inputValue);
    };

    return () => {
      const customSlots = {
        ...slots,
        suffixIcon: () => {
          return slots.suffixIcon?.() || (
            <Icon
              isSvg
              icon="cyber-xiajiantou"
              class="arrow_icon"
            ></Icon>
          );
        },
      };
      return (
        <TreeSelect
          placeholder="请选择"
          {...attrs}
          v-slots={customSlots}
          fieldNames={props.fieldNames}
          filterTreeNode={filterTreeNode}
        ></TreeSelect>
      )
    }
  },
});
