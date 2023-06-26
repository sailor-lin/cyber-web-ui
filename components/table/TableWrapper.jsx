import Table from './Table';
import PageWrapper from '../page-wrapper/index';
import CollapseForm from '../collapse-form/index';
import { defineComponent, reactive, ref, unref, watch, watchEffect } from "vue";

export default defineComponent({
  name: 'CTableWrapper',
  props: {
    // 加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否使用收缩功能
    shrink: {
      type: Boolean,
      default: true,
    },
    showReload: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, context) {
    const { attrs, slots, emit, expose } = context;
    
    const tableRef = ref();

    const tableWrapperState = reactive({
      loading: false,
    });

    watchEffect(() => tableWrapperState.loading = props.loading);

    watch(() => tableWrapperState.loading, (value, oldValue) => {
      if(value != oldValue) emit('update:loading', tableWrapperState.loading);
    });

    expose({
      searchQuery: async (params) => {
        return await unref(tableRef)?.searchQuery(params);
      },
    });
    return () => {
      const pageWrapperSlots = {
        header: () => {
          return (
            <CollapseForm
              loading={tableWrapperState.loading}
              shrink={props.shrink}
              onSearch={() => emit('search')}
              showReload={props.showReload}
              v-slots={{
                default: slots.collapse,
                right: slots.right,
                reloadIcon: slots.reloadIcon,
              }}
            ></CollapseForm>
          )
        },
        default: () => {
          return (
            <Table
              ref={tableRef}
              {...attrs}
              v-model:loading={tableWrapperState.loading}
              v-slots={slots}
            ></Table>
          );
        }
      };

      return (
        <PageWrapper v-slots={pageWrapperSlots}></PageWrapper>
      );
    }
  }
});
