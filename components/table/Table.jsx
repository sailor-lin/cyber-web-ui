import Icon from '../icon/index';
import Modal from '../modal/index';
import { Table as ATable, Pagination as APagination, Menu as AMenu, MenuItem as AMenuItem, Dropdown as ADropdown, Checkbox as ACheckbox, Button as AButton } from 'ant-design-vue';
import { useColumns, usePagination, useSelection, useTableState, useDragState } from './hooks/useState.js';
import { defineComponent, computed, reactive, ref, unref, watch, watchEffect } from "vue";
import { filterEmpty } from "../_utils/index.js";

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
    // 是否显示分页栏
    pagination: {
      type: Boolean,
      default: true,
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
    // 切换分页前的钩子
    beforePaginationChange: Function,
    // 二次确认拖拽
    onRowDragEnd: Function,
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
    // 拖拽状态
    const { dragState, dragMethods } = useDragState(props, context, tableState, tableMethods);

    /**
     * @function 全选/取消全选
     * @param {Object} options
     */
    function checkAllHandler({ target }) {
      if(!rowSelection.value || !rowSelection.value?.onChange) {
        selectionState.checkedAll = false;
        return;
      }
      const { onChange, onSelectAll } = rowSelection.value; 
      let selectedRowKeys = [];
      let selectedRows = [];
      if(target.checked) {
        selectedRowKeys = tableState.dataSource.map(item => tableMethods.getRowKey(item));
        selectedRows = [...tableState.dataSource];
      }
      onChange?.(selectedRowKeys, selectedRows);
      // 全选回调
      onSelectAll?.(target.checked, selectedRowKeys, selectedRows);
    }
    // 批量删除
    function batchDelete() {
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
    }
    
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
        return selectedSet.has(tableMethods.getRowKey(item));
      });
    });

    expose({
      searchQuery: tableMethods.searchQuery,
      getRowSelection: () => unref(rowSelection)?.selectedRowKeys || [],
    });
    return () => {
      // 菜单图标
      function menuIconSlot(icon) {
        return icon ? <Icon icon={icon} style="margin-right: 8px;"></Icon> : undefined;
      };
      // dropdown的下拉列表
      function actionOverlaySlot({ record }) {
        return (
          <AMenu style="min-width: 168px;">
            {
              tableState.overlayMenu(record).map((item) => {
                return (
                  <AMenuItem
                    disabled={tableMethods.disposeDropdownMent(item?.disabled, record, false)}
                    v-slots={{ icon: menuIconSlot(item.icon) }}
                  >
                    <a href="javascript:;" onClick={() => item.handler?.(record)}>{ item.label }</a>
                  </AMenuItem>
                )
              })
            }
          </AMenu>
        )
      };
      // 全选按钮
      function checkAll() {
        return ((!props.showRowSelection && !props.rowSelection) || props.rowSelection?.hideSelectAll)
          && unref(rowSelection)?.type != 'checkbox'
            ? <div></div>
            : (
                <div class="cyber-pagination-left">
                  <ACheckbox
                    v-model:checked={selectionState.checkedAll}
                    indeterminate={tableState.indeterminate}
                    onChange={checkAllHandler}
                  >
                    <span style="padding-left: 12px;">全选</span>
                  </ACheckbox>
                  <AButton
                    style="margin-left: 12px;"
                    disabled={!rowSelection.value?.selectedRowKeys?.length || tableState.loading}
                    onClick={batchDelete}
                  >删除</AButton>
                </div>
              );
      };
      const tableSlots = {
        ...slots,
        // 表格单元格
        bodyCell: (options) => {
          const { column, record, index, text, value } = options;
          let children = filterEmpty(slots.bodyCell?.(options) || []);
          if(column.rowDrag) {
            return (
              <div class="cyber-drag-body">
                <Icon
                  icon="cyber-yidong"
                  size="16"
                  {...(column.dragIconProps || {})}
                  class={['cyber-table-drag-handle', { 'cyber-table-drag-disabled-handle': (typeof column.disabledRowDrag == 'boolean' && column.disabledRowDrag) }]}
                  onMouseenter={(event) => dragMethods.onDragMouseenter(event, options)}
                  onMouseleave={(event) => dragMethods.onDragMouseleave(event, options)}
                ></Icon>
                <div>{ children.length ? children : column.dataIndex ? (column.customRender ? column.customRender(options) : text) : undefined }</div>
              </div>
            )
          }
          if(column.key == 'action' && props.action && !children?.length) {
            return (
              <ADropdown
                placement="bottomRight"
                trigger="click"
                v-slots={{ overlay: () => actionOverlaySlot(options) }}
              >
                <Icon size="15" icon="cyber-caozuo" style="cursor: pointer"></Icon>
              </ADropdown>
            )
            
          } else {
            return slots.bodyCell?.(options);
          }
        },
        footer: props.pagination
          ? () => {
              return (
                <div class="cyber-pagination-body">
                  { checkAll() }
                  <APagination
                    class="cyber-pagination"
                    {...paginationProps.value}
                    current={tableState.current}
                    pageSize={tableState.pageSize}
                    total={tableState.total}
                    disabled={tableState.loading || paginationProps.value.disabled}
                    onChange={tableMethods.paginationChange}
                  ></APagination>
                </div>
              );
            }
          : undefined
      };

      return (
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
          customRow={props.columns.some(item => item.rowDrag) ? dragState.customRow : attrs.customRow}
          v-slots={tableSlots}
        ></ATable>
      );
    }
  }
});
