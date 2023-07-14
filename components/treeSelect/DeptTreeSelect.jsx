import TreeSelect from './TreeSelect';
import { defineComponent, getCurrentInstance, reactive, watchEffect } from 'vue';

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
    const { proxy } = getCurrentInstance();
    const deptState = reactive({
      treeData: [],
    });
    async function querySelect(enterpriseId, excludeId) {
      if(!enterpriseId) {
        deptState.treeData = [];
        return;
      }
      try {
        let res = await proxy.$axios.request({
          url: '/dept/tree',
          method: 'get',
          params: {
            enterpriseId: enterpriseId,
            excludeId: excludeId,
          }
        });
        deptState.treeData = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    watchEffect(() => {
      querySelect(props.enterpriseId, props.excludeId);
    });
    
    expose({
      querySelect: querySelect,
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
