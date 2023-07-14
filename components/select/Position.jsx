import Select from './Select';
import { defineComponent, getCurrentInstance, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CPosition',
  props: {
    // 企业id
    enterpriseId: String,
    fieldNames: {
      type: Object,
      default: () => {}
    },
    filterOption: Function,
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { proxy } = getCurrentInstance();

    const positionState = reactive({
      options: [],
    });

    async function querySelect(enterpriseId) {
      try {
        let res = await proxy.$axios.request({
          url: '/position/select',
          method: 'get',
          params: {
            enterpriseId: enterpriseId || 0,
          }
        });
        positionState.options = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    function filterOption(inputValue, treeNode) {
      if(props.filterOption) return props.filterOption(inputValue, treeNode);
      let label = props.fieldNames?.label || 'name';
      return treeNode[label].includes(inputValue);
    };

    watchEffect(() => {
      querySelect(props.enterpriseId, props.excludeId);
    });
    
    expose({
      querySelect: querySelect,
    });
    return () => {
      return (
        <Select
          {...attrs}
          options={positionState.options}
          fieldNames={{
            label: 'name',
            value: 'id',
            options: 'options',
            ...props.fieldNames,
          }}
          v-slots={slots}
          filterOption={filterOption}
        ></Select>
      )
    }
  },
});
