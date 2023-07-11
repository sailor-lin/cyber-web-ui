import Icon from '../icon/index';
import Modal from '../modal/index';
import { Table as ATable, Pagination as APagination, Menu as AMenu, MenuItem as AMenuItem, Dropdown as ADropdown, Checkbox as ACheckbox, Button as AButton } from 'ant-design-vue';
import { useColumns, usePagination, useSelection, useTableState } from './hooks/useState.js';
import { defineComponent, computed, reactive, ref, unref, watch, watchEffect } from "vue";

export default defineComponent({
  name: 'CTable',
  props: {
    // dataSoure唯一值，selection选中值
    rowKey: {
      type: [String, Function],
      default: "id",
    },
    // 表格加载
    loading: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    // 表格columns
    columns: {
      type: Array,
      default: () => [],
    },
    // 是否显示默认操作列
    action: {
      type: Boolean,
      default: true,
    },
    // 操作菜单
    overlayMenu: {
      type: Array,
      default: () => [],
    },
    // 选择功能的配置
    rowSelection: {
      type: Object,
      default: () => {},
    },
    // 是否显示选择功能
    showRowSelection: Boolean,
    // 当前页数
    current: Number,
    // 每页条数
    pageSize: Number,
    // 数据总数
    total: {
      type: Number,
      default: 0,
    },
    // 分页栏自定义配置
    paginationProps: {
      type: Object,
      default: () => {},
    },
    // 批量删除回调
    onBatchDelete: Function,
    // 自定义批量删除方法
    batchDelete: Function,
    // 分页切换回调
    onPaginationChange: Function,
    // 自定义分页切换方法
    paginationChange: Function,
  },
  setup(props, context) {
    const { attrs, slots, emit, expose } = context;
    // 表格实例
    const tableRef = ref();

    // 表格列配置
    const columns = computed(() => useColumns(props.columns, props.action));
    // 分页配置
    const paginationProps = computed(() => usePagination(props.paginationProps));
    // 选中状态
    const selectionState = reactive({
      checkedAll: false, // 是否全选
      selectedRows: [],
      selectedRowKeys: [],
    });
    const rowSelection = computed(() => useSelection(props, selectionState));
    // 表格状态
    const { tableState, tableMethods } = useTableState(props, context, rowSelection);

    const methods = Object.assign(tableMethods, {
      /**
       * @function 全选/取消全选
       * @param {object} options
       */
      checkAllHandler({ target }) {
        if(!rowSelection.value || !rowSelection.value?.onChange) {
          selectionState.checkedAll = false;
          return;
        }
        const { onChange, onSelectAll } = rowSelection.value; 
        let selectedRowKeys = [];
        let selectedRows = [];
        if(target.checked) {
          selectedRowKeys = tableState.dataSource.map(item => methods.getRowKey(item));
          selectedRows = [...tableState.dataSource];
        }
        onChange?.(selectedRowKeys, selectedRows);
        // 全选回调
        onSelectAll?.(target.checked, selectedRowKeys, selectedRows);
      },
      // 批量删除
      batchDelete() {
        if(props.batchDelete) {
          props.batchDelete(rowSelection.value?.selectedRowKeys)
          return;
        }
        Modal.confirm({
          title: `批量删除`,
          icon: 'cyber-shanchu',
          content: `确定要批量删除选中的数据吗，删除后将无法恢复！`,
          okButtonProps: {
            pattern: 'error',
          },
          onOk: () => {
            return props.onBatchDelete?.(rowSelection.value?.selectedRowKeys);
          },
        });
      },
    });
    
    watchEffect(() => {
      tableState.loading = props.loading;
    });
    watch(() => tableState.loading, (value, oldValue) => {
      if(value != oldValue) emit('update:loading', tableState.loading);
    });
    watchEffect(() => {
      if(!rowSelection.value) return;
      const { selectedRowKeys = [] } = rowSelection.value;
      if(!selectedRowKeys?.length) {
        selectionState.checkedAll = false;
        return;
      }
      let selectedSet = new Set(selectedRowKeys);
      selectionState.checkedAll = (tableState.dataSource || []).every(item => {
        return selectedSet.has(methods.getRowKey(item));
      });
    });

    expose({
      searchQuery: methods.searchQuery,
      getRowSelection: () => unref(rowSelection)?.selectedRowKeys || [],
    });
    return () => {
      const customSlots = {
        ...slots,
        // 菜单图标
        menuIcon: (icon) => {
          return icon ? <Icon icon={icon} style="margin-right: 8px;"></Icon> : undefined;
        },
        // dropdown的下拉列表
        actionOverlay: ({ record }) => {
          return (
            <AMenu style="min-width: 168px;">
              {
                tableState.overlayMenu(record).map((item) => {
                  return (
                    <AMenuItem
                      disabled={methods.disposeDropdownMent(item?.disabled, record, false)}
                      v-slots={{ icon: customSlots.menuIcon(item.icon) }}
                    >
                      <a href="javascript:;" onClick={() => item.handler?.(record)}>{ item.label }</a>
                    </AMenuItem>
                  )
                })
              }
            </AMenu>
          )
        },
        // 表格单元格
        bodyCell: (options) => {
          const { column, record, index, text, value } = options;
          if(column.key == 'action' && props.action) {
            return (
              <ADropdown
                placement="bottomRight"
                trigger="click"
                v-slots={{ overlay: () => customSlots.actionOverlay(options) }}
              >
                <Icon size="15" icon="cyber-caozuo" style="cursor: pointer"></Icon>
              </ADropdown>
            )
            
          } else {
            return slots.bodyCell?.(options);
          }
        },
        // 全选按钮
        checkAll: () => {
          return ((!props.showRowSelection && !props.rowSelection) || props.rowSelection?.hideSelectAll)
            && unref(rowSelection)?.type != 'checkbox'
              ? <div></div>
              : (
                  <div class="cyber-pagination-left">
                    <ACheckbox
                      v-model:checked={selectionState.checkedAll}
                      indeterminate={tableState.indeterminate}
                      onChange={methods.checkAllHandler}
                    >
                      <span style="padding-left: 12px;">全选</span>
                    </ACheckbox>
                    <AButton
                      style="margin-left: 12px;"
                      disabled={!rowSelection.value?.selectedRowKeys?.length || tableState.loading}
                      onClick={methods.batchDelete}
                    >删除</AButton>
                  </div>
                );
        },
      };

      return (
        <div>
          <ATable
            class="cyber-table"
            ref={tableRef}
            rowKey={props.rowKey}
            loading={tableState.loading}
            columns={columns.value}
            scroll={tableState.scroll}
            dataSource={tableState.dataSource}
            {...attrs}
            pagination={false}
            rowSelection={rowSelection.value}
            v-slots={{ bodyCell: customSlots.bodyCell }}
          ></ATable>
          <div class="cyber-pagination-body">
            { customSlots.checkAll() }
            <APagination
              class="cyber-pagination"
              {...paginationProps.value}
              current={tableState.current}
              pageSize={tableState.pageSize}
              total={tableState.total}
              disabled={tableState.loading || paginationProps.value.disabled}
              onChange={methods.paginationChange}
            ></APagination>
          </div>
        </div>
      );
    }
  }
});
