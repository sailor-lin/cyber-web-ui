import Select from './Select';
import axios from '../_utils/api';
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'CEnterpriseSelect',
  props: {
    fieldNames: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const enterpriseState = reactive({
      options: [],
    });

    async function searchQuery() {
      try {
        let res = await axios.request({
          url: '/auth/enterprise/select',
          method: 'get',
          params: {
            status: '0',
          },
          headers: {
            'X-Project-Code': 'cyber-authing'
          },
        });
        enterpriseState.options = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    searchQuery();
    
    expose({
      searchQuery: searchQuery,
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
