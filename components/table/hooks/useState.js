import axios from '../../_utils/api';
import { reactive, computed, h, watch } from 'vue';
import { changeHistoryState, initHistoryState } from "../../_utils/history.js";

/**
 * @function useColumns 表格列配置
 * @param {Array} columns 表格列
 * @param {Boolean} defautlAction 默认操作列
 * @returns {Array}
 */
export const useColumns = (columns, defautlAction) => {
  let hasAction = columns.some(item => item.key == 'action');
  // 过滤columns
  columns = columns.filter(item => typeof item.show == 'boolean' ? item.show : true)
  // 是否显示默认操作列
  if (defautlAction && !hasAction) {
    columns.push({ title: "操作", fixed: "right", key: "action", width: 80 });
  };
  return columns.map(item => {
    let record = { ...item };
    // 自定义单元格类名
    if(record.className && !record.key && record.dataIndex) {
      if(record.customRender) {
        record.customRenderFun = record.customRender
      } else {
        record.customRenderFun = ({ text }) => text
      }
      record.customRender = (params) => {
        if(record.className) {
          return h('span', { class: record.className }, record.customRenderFun(params));
        }
        return record.customRenderFun(params);
      }
    }
    return record;
  });
};

/**
 * @function usePagination 分页配置
 * @param {Object} paginationProps 分页参数 
 * @returns {Object}
 */
export const usePagination = (paginationProps = {}) => {
  return {
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 设置统一显示pageSize
    showTotal: (total, range) => {
      return " 共" + total + "条"
    },
    pageSizeOptions: ['10', '20', '30'],
    ...paginationProps,
  };
};

/**
 * @function useSelection 选择功能配置
 * @param {Object} props
 * @param {Object} selectionState
 * @returns {Object|null}
 */
export const useSelection = (props, selectionState) => {
  let onChange = (selectedRowKeys, selectedRows) => {
    selectionState.selectedRowKeys = selectedRowKeys;
  }
  if(props.rowSelection) {
    return {
      onChange: props.rowSelection?.selectedRowKeys ? undefined : onChange,
      ...props.rowSelection,
      selectedRowKeys: props.rowSelection?.selectedRowKeys
        ? props.rowSelection?.selectedRowKeys
        : selectionState.selectedRowKeys,
      hideSelectAll: true,
      hideDefaultSelections: true,
      checkedAll: selectionState.checkedAll,
    }
  }
  if(!props?.showRowSelection) return null;
  return { // 去掉『全选』『反选』两个默认选项
    type: "checkbox",
    selectedRowKeys: selectionState.selectedRowKeys,
    onChange,
    hideSelectAll: true, // 隐藏全选勾选框与自定义选择项
    hideDefaultSelections: true,
    checkedAll: selectionState.checkedAll,
  }
};

/**
 * @function useTableState 初始化表格状态
 * @param {Object} props 
 * @param {Object} context 
 * @param {Object|null} rowSelection
 * @returns {Object}
 */
export const useTableState = (props, { emit }, rowSelection) => { 

  const tableState = reactive({
    loading: false, // 表格loading
    dataSource: [], // 表格数据
    scroll: { x: 1200 },
    /**
     * @function overlayMenu action操作菜单
     * @param {String} label 文本
     * @param {Function} handler 点击触发方法
     * @param {Boolean} show 是否显示
     * @param {Boolean} disabled 是否禁用
     */
    overlayMenu: computed(() => {
      return (record) => {
        return props.overlayMenu.filter(item => tableMethods.disposeDropdownMent(item?.show, record, true));
      }
    }),
    ...initHistoryState({
      current: {
        type: 'number',
        defaultValue: 1,
      },
      pageSize: {
        type: 'number',
        defaultValue: props.paginationProps?.pageSizeOptions?.[0] || 10,
      },
    }),
    total: 0,
    queryParams: {}, // 发送到后端的参数
    isFirstRender: true, // 是否首次渲染
    indeterminate: computed(() => {
      if(!rowSelection.value) return;
      let { selectedRowKeys } = rowSelection.value;
      return selectedRowKeys?.length > 0
        && !rowSelection.value?.checkedAll
        && !!tableState.dataSource?.length;
    }),
  });

  const tableMethods = {
    /**
     * @function 处理操作菜单配置
     * @param {Object} target 操作菜单项
     * @param {Object} record 当前操作行的表格数据
     * @param {Boolean} flag 默认参数
     * @returns {Boolean} 
     */
    disposeDropdownMent(target, record, flag = false) {
      if(typeof target == 'boolean') return target;
      if(typeof target == 'function') return target(record);
      return flag;
    },
    /**
     * @function 切换分页
     * @param {Number} page 页数
     * @param {Number} pageSize 每页条数
     */
    async paginationChange(page, pageSize) {
      // 是否自定义切换分页方法
      if(props.beforePaginationChange) {
        try {
          let flag = await props.beforePaginationChange(page, pageSize);
          if(typeof flag == 'boolean' && !flag) return;
        } catch(error) {
          throw Error(error);
        }
      }
      tableState.current = page;
      tableState.pageSize = pageSize;
      emit('update:current', page);
      emit('update:pageSize', pageSize);
      // 是否自定义切换分页回调
      if(props.onPaginationChange) {
        props.onPaginationChange(page, pageSize);
      }
      // 没有自定义则默认刷新表格
      else {
        tableMethods.queryTable(tableState.current);
      }
    },
    /** 
     * @function 更新表单参数，并获取表格数据
     * @description 判断筛选参数是否有更新，若有则搜索第一页
     * @param {Object} params 筛选参数
     */
    async searchQuery(params = {}) {
      if(!axios) {
        throw new Error('axios is not defined!');
      }
      if(!params?.url) {
        throw Error('The request parameter is missing a url address!');
      }
      params = JSON.stringify(params);
      let oldParams = JSON.stringify(tableState.queryParams);
      let pageNo = 1;
      if (params == oldParams || tableState.isFirstRender) {
        tableState.queryParams = JSON.parse(params);
        pageNo = tableState.current;
        tableState.isFirstRender = false;
      } else {
        tableState.queryParams = JSON.parse(params);
      }
      return await tableMethods.queryTable(pageNo);
    },
    /**
     * @function 调用接口获取表格数据
     * @param {Number} pageNo 当前页数 
     * @returns {Promise}
     */
    async queryTable(pageNo) {
      tableState.loading = true;
      tableState.dataSource = [];
      tableState.current = pageNo;
      tableState.pageSize = tableState.pageSize;
      changeHistoryState({
        current: tableState.current,
        pageSize: tableState.pageSize,
      });
      const methodKey = tableState.queryParams.method == 'get' ? 'params' : 'data';
      try {
        let res = await axios.request({
          ...tableState.queryParams,
          [methodKey]: {
            page: tableState.current,
            pageSize: tableState.pageSize,
            ...tableState.queryParams[methodKey] || {},
          }
        });
        let { data = [], row = 0 } = res.data || {};
        tableState.total = row;
        // 若数据为空，且当前页数大于1，且数据总数大于0
        if ((!data?.length && tableState.current > 1) && !!row) {
          return await tableMethods.queryTable(Math.ceil(tableState.total / tableState.pageSize));
        } else {
          tableState.dataSource = data || [];
        }
        rowSelection.value?.onChange?.([], []);
      } catch (error) {
        tableState.loading = false;
        let msg = typeof error == 'string'
          ? error
          : error?.message || error?.error;
        if(msg) {
          throw new Error(msg);
        }
      }
      emit('update:dataSource', tableState.dataSource);
      tableState.loading = false;
      return {
        data: tableState.dataSource,
        total: tableState.total,
      };
    },
    /**
     * @function 获取指定key的值
     * @returns {any}
     */
    getRowKey(record) {
      if (typeof props.rowKey === 'function') {
        return props.rowKey(record);
      }
      return record?.[props.rowKey];
    },
  };

  watch(() => [props.total, props.current, props.pageSize], ([total, current, pageSize]) => {
    tableState.total = typeof total == 'number' ? total : tableState.total || 0;
    tableState.current = current || tableState.current;
    tableState.pageSize = pageSize || tableState.pageSize;
    emit('update:current', tableState.current);
    emit('update:pageSize', tableState.pageSize);
  }, { immediate: true });
  watch(() => props.dataSource, (value) => {
    tableState.dataSource = value;
  }, { immediate: true });

  return {
    tableState,
    tableMethods,
  }
};

/**
 * @function useDragState 初始化拖拽状态
 * @param {Object} props 
 * @param {Object} context 
 * @param {Object} tableState 
 * @returns {Object}
 */
export const useDragState = (props, { emit }, tableState, tableMethods) => {
  
  const dragState = reactive({
    index: undefined,
    record: undefined,
    targetArr: [],
    isDrag: false,
    tr: undefined,
    customRow: (record, index) => {
      return {
        onDragstart: (event) => {
          // 阻止冒泡
          event && event.stopPropagation();
          dragState.isDrag = true;
          dragState.tr = event;
        },
        onDragover: (event) => {
          // 阻止默认行为*/
          event && event.preventDefault();
          // 拖拽在自己身上不需要做操作
          if (index == dragState.index) {
            return;
          }
          // 在经过的元素的上面或者下面添加一条线
          var nowLine = event?.target.closest("tr.ant-table-row ");
          if (!dragState.targetArr.includes(nowLine)) {
            dragState.targetArr.push(nowLine);
          }
          if (index > dragState.index) {
            if (!nowLine.classList.contains("afterLine")) {
              dragState.targetArr.forEach((item) => {
                item.classList.remove("beforLine");
                item.classList.remove("afterLine");
              });
              nowLine.classList.add("afterLine");
            }
          } else {
            if (!nowLine.classList.contains("beforLine")) {
              dragState.targetArr.forEach((item) => {
                item.classList.remove("beforLine");
                item.classList.remove("afterLine");
              });
              nowLine.classList.add("beforLine");
            }
          }
        },
        onDrop: async (event) => {
          // 阻止冒泡
          event && event.stopPropagation();
          let targetData = tableState.dataSource.filter((item) => tableMethods.getRowKey(item) === tableMethods.getRowKey(dragState.record));
          let dragData = tableState.dataSource.filter((item) => tableMethods.getRowKey(item) !== tableMethods.getRowKey(dragState.record));
          dragData.splice(index, 0, ...targetData);
          
          dragState.targetArr.forEach((item) => {
            item.classList.remove("beforLine");
            item.classList.remove("afterLine");
          });
          dragState.targetArr = [];
          dragState.isDrag = false;
          if(props.onRowDragEnd && typeof props.onRowDragEnd == 'function') {
            try {
              await props.onRowDragEnd({
                record: dragState.record,
                preTargetInfo: index < dragState.index ? record: undefined,
                nextTargetInfo: index > dragState.index ? record: undefined,
              });
            } catch(error) {
              console.log('error', error)
              return;
            }
          }
          emit('update:dataSource', dragData);
        },
        onDragend: (event) => {
          if(dragState.tr && dragState.isDrag) {
            dragState.targetArr.forEach((item) => {
              item.classList.remove("beforLine");
              item.classList.remove("afterLine");
            });
            dragState.targetArr = [];
            dragState.tr.target.draggable = false;
            dragState.tr = undefined;
            dragState.isDrag = false;
          }
        }
      }
    }
  });

  const dragMethods = {
    onDragMouseenter(event, options) {
      let { column } = options;
      if(!event?.target || (typeof column.disabledRowDrag == 'boolean' && column.disabledRowDrag) || dragState.isDrag) return;
      event.preventDefault();
      event.stopPropagation();
      let tr =  event.target.parentNode.parentNode.parentNode;
      tr.draggable = true;
      dragState.index = options.index;
      dragState.record = options.record;
    },
    onDragMouseleave(event, options) {
      let { column } = options;
      if(!event?.target || (typeof column.disabledRowDrag == 'boolean' && column.disabledRowDrag) || dragState.isDrag) return;
      let tr =  event.target.parentNode.parentNode.parentNode;
      tr.draggable = false;
      dragState.index = undefined;
      dragState.record = undefined;
    }
  }

  return {
    dragState,
    dragMethods,
  }
}
