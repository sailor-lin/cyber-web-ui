import Select from './Select';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'CEnterprise',
  props: {
    fieldNames: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { proxy } = getCurrentInstance();

    const enterpriseState = reactive({
      options: [],
    });

    async function querySelect() {
      try {
        let res = await proxy.$axios.request({
          url: '/enterprise/select',
          method: 'get',
        });
        enterpriseState.options = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    querySelect();
    
    expose({
      querySelect: querySelect,
    });
    return () => {
      return (
        <Select
          {...attrs}
          options={enterpriseState.options}
          fieldNames={{
            label: 'name',
            value: 'id',
            options: 'options',
            ...props.fieldNames,
          }}
          v-slots={slots}
        ></Select>
      )
    }
  },
});
