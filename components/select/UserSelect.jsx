import Select from './Select';
import axios from '../_utils/api';
import { defineComponent, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CUserSelect',
  props: {
    fieldNames: {
      type: Object,
      default: () => {}
    },
    isPermission: {
      type: Boolean,
      default: false,
    },
    productId: String,
  },
  setup(props, { attrs, slots, emit, expose }) {
    
    const enterpriseState = reactive({
      options: [],
    });

    async function searchQuery(isPermission, productId) {
      try {
        let res = await axios.request({
          url: '/auth/user/select',
          method: 'get',
          params: {
            isPermission: isPermission,
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

    watchEffect(() => {
      searchQuery(props.isPermission, props.productId);
    });
    
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
