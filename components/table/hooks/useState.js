import { watchEffect, getCurrentInstance, reactive, computed, h } from 'vue';
import { changeHistoryState, initHistoryState } from "../../_utils/history.js";

/**
 * @function 表格列配置
 * @param {array} columns 表格列
 * @param {boolean} defautlAction 默认操作列
 * @returns {array}
 */
export const useColumns = (columns, defautlAction) => {
  // 过滤columns
  columns = columns.filter(item => typeof item.show == 'boolean' ? item.show : true)
  // 是否显示默认操作列
  if (defautlAction) {
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
 * @function 分页配置
 * @param {object} paginationProps 分页参数 
 * @returns {object}
 */
export const usePagination = (paginationProps = {}) => {
  return {
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 设置统一显示pageSize
    showTotal: (total, range) => {
      return " 共" + total + "条"
    },
    ...paginationProps,
    pageSizeOptions: paginationProps.pageSizeOptions || ['10', '20', '30'],
  };
};

/**
 * @function 选择功能配置
 * @param {object} rowSelectionProps 选择功能参数
 * @param {object} tableState 表格状态
 * @returns {object|null}
 */
export const useSelection = (rowSelectionProps, tableState) => {
  if(!rowSelectionProps?.show) return null;
  return {
    selectedRowKeys: tableState.selectedRowKeys,
    type: "checkbox",
    hideDefaultSelections: true, // 去掉『全选』『反选』两个默认选项
    onChange: (selectedRowKeys, selectedRows) => {
      tableState.selectedRowKeys = selectedRowKeys;
      tableState.selectedRows = selectedRows;
    },
    // onSelect: (record, selected, selectedRows) => {
    //   console.log(record, selected, selectedRows);
    // },
    // onSelectAll: (selected, selectedRows, changeRows) => {
    //   console.log(selected, selectedRows, changeRows);
    // },
    ...(rowSelectionProps || {}),
    hideSelectAll: true, // 隐藏全选勾选框与自定义选择项
  }
};

/**
 * @function 初始化表格状态
 * @param {object} props 
 * @param {object} context 
 * @returns {object}
 */
export const useTableState = (props, { emit }) => {  

  const { proxy } = getCurrentInstance();

  const tableState = reactive({
    selectedRowKeys: [],
    selectedRows: [],
    loading: false, // 表格loading
    dataSource: [], // 表格数据
    scroll: { x: 1200 },
    /**
     * @function overlayMenu action操作菜单
     * @param {string} label 文本
     * @param {function} handler 点击触发方法
     * @param {boolean} show 是否显示
     * @param {boolean} disabled 是否禁用
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
    checkedAll: false, // 是否全选
    indeterminate: computed(() => {
      return tableState.selectedRowKeys?.length > 0
        && !tableState.checkedAll
        && !!tableState.dataSource?.length;
    }),
  });

  const tableMethods = {
    /**
     * @function 处理操作菜单配置
     * @param {object} target 操作菜单项
     * @param {object} record 当前操作行的表格数据
     * @param {boolean} flag 默认参数
     * @returns {boolean} 
     */
    disposeDropdownMent(target, record, flag = false) {
      if(typeof target == 'boolean') return target;
      if(typeof target == 'function') return target(record);
      return flag;
    },
    /**
     * @function 切换分页
     * @param {number} page 页数
     * @param {number} pageSize 每页条数
     */
    paginationChange(page, pageSize) {
      // 是否自定义切换分页方法
      if(props.paginationChange) {
        props.paginationChange();
        return;
      }
      tableState.current = page;
      tableState.pageSize = pageSize;
      emit('update:current', page);
      emit('update:pageSize', pageSize);
      changeHistoryState({
        page: tableState.current,
        pageSize: tableState.pageSize,
      });
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
     * @param {object} params 筛选参数
     */
    async searchQuery(params = {}) {
      if(!proxy.$axios) {
        throw new Error('axios is not defined!');
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
     * @param {number} pageNo 当前页数 
     * @returns {promise}
     */
    async queryTable(pageNo) {
      tableState.loading = true;
      tableState.dataSource = [];
      tableState.current = pageNo;
      const methodKey = tableState.queryParams.method == 'get' ? 'params' : 'data';
      try {
        let res = await proxy.$axios.request({
          ...tableState.queryParams,
          [methodKey]: {
            ...tableState.queryParams[methodKey] || {},
            page: tableState.current,
            pageSize: tableState.pageSize,
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
        tableState.selectedRowKeys = [];
        tableState.selectedRows = [];
      } catch (error) {
        console.log('error', error);
      }
      tableState.loading = false;
      return {
        data: tableState.dataSource,
        total: tableState.total,
      };
    },
  };

  watchEffect(() => {
    if(!!props.current) {
      tableState.current = props.current || tableState.current;
      tableState.pageSize = props.pageSize || tableState.pageSize;
      tableState.total = props.total;
    }
  });
  watchEffect(() => tableState.dataSource = props.dataSource || []);
  watchEffect(() => {
    tableState.checkedAll = tableState.selectedRowKeys.length == tableState.dataSource?.length;
  });

  return {
    tableState,
    tableMethods,
  }
};
