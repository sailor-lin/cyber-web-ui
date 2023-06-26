import TreeSelect from './TreeSelect';
import axios from '../_utils/api';
import { defineComponent, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CMenuTreeSelect',
  props: {
    // 产品id
    productId: String,
    // 要排除的菜单id
    excludeId: String,
    fieldNames: {
      type: Object,
      default: () => {}
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const deptState = reactive({
      treeData: [],
    });
    async function searchQuery(productId, excludeId) {
      if(!productId) {
        deptState.treeData = [];
        return;
      }
      try {
        let res = await axios.request({
          url: '/system/menu/tree',
          method: 'get',
          params: {
            productId: productId,
            excludeId: excludeId,
            status: '0',
          },
          headers: {
            'X-Project-Code': 'cyber-system'
          },
        });
        deptState.treeData = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    watchEffect(() => {
      searchQuery(props.productId, props.excludeId);
    });
    
    expose({
      searchQuery: searchQuery,
    });
    return () => {
      return (
        <TreeSelect
          placeholder="请选择"
          {...attrs}
          v-slots={slots}
          tree-data={deptState.treeData}
          fieldNames={{
            label: 'name',
            value: 'id',
            children: 'children',
            ...props.fieldNames,
          }}
        ></TreeSelect>
      )
    }
  },
});
