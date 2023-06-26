import axios from '../_utils/api';
import TreeSelect from './TreeSelect';
import { defineComponent, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CDeptTreeSelect',
  props: {
    // 企业id
    enterpriseId: String,
    // 排除部门id
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
    async function searchQuery(enterpriseId, excludeId) {
      if(!enterpriseId) {
        deptState.treeData = [];
        return;
      }
      try {
        let res = await axios.request({
          url: '/auth/dept/tree',
          method: 'get',
          params: {
            enterpriseId: enterpriseId,
            excludeId: excludeId,
            status: '0',
          },
          headers: {
            'X-Project-Code': 'cyber-authing'
          },
        });
        deptState.treeData = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    watchEffect(() => {
      searchQuery(props.enterpriseId, props.excludeId);
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
