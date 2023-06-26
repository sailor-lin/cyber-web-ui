import Select from './Select';
import axios from '../_utils/api';
import { defineComponent, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CRoleSelect',
  props: {
    productId: String,
    fieldNames: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { attrs, slots, emit, expose }) {

    const enterpriseState = reactive({
      options: [],
    });

    async function searchQuery(productId) {
      if(!productId) {
        return;
      }
      try {
        let res = await axios.request({
          url: '/auth/role/select',
          method: 'get',
          params: {
            productId: productId,
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

    watchEffect(() => searchQuery(props.productId));
    
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
