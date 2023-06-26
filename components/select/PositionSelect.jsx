import Select from './Select';
import axios from '../_utils/api';
import { defineComponent, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: 'CPositionSelect',
  props: {
    // 企业id
    enterpriseId: String,
    fieldNames: {
      type: Object,
      default: () => {}
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const positionState = reactive({
      options: [],
    });

    async function searchQuery(enterpriseId) {
      try {
        let res = await axios.request({
          url: '/auth/position/select',
          method: 'get',
          params: {
            enterpriseId: enterpriseId || 0,
            status: '0',
          },
          headers: {
            'X-Project-Code': 'cyber-authing'
          },
        });
        positionState.options = res.data || [];
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
        ></Select>
      )
    }
  },
});
