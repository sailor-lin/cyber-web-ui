import axios from '@/api';
import { changeHistoryState, stringKeyToArray, getTargetBykey, initHistoryParams } from '@/utils/dispose';

export default function () {
  // 默认参数，可更改
  const DEFAULT_PAGENO = 1; // 默认pageNo
  const DEFAULT_PAGESIZE = 10; // 默认pageSize
  const PAGE_NO_KEY = 'page'; // pageNo的key值
  const PAGE_SIZE_KEY = 'pageSize'; // pageSize的key值
  
  const tableState = reactive({
    checkedAll: false,
    selectedRowKeys: [],
    selectedRows: [],
    loading: false, // 表格loading
    dataSource: [], // 表格数据
    rowKey: "id",
    rowSelectionType: "checkbox",
    scroll: { x: 1200 },
    queryParams: {}, // 发送到后端的参数
    sortRecord: { // 排序项
      title: '',
      isAsc: false, // 是否为升序
    },
    isFirstRender: true, // 是否首次渲染
  });

  const paginationState = reactive({
    ...initHistoryParams({
      current: {
        type: 'number',
        defaultValue: DEFAULT_PAGENO,
      },
      pageSize: {
        type: 'number',
        defaultValue: DEFAULT_PAGESIZE
      },
    }),
    total: 0,
    pageSizeOptions: ['10', '20', '30'],
    showQuickJumper: true, // 显示跳转输入框
    showSizeChanger: true, // 设置统一显示pageSize
    showTotal: (total, range) => {
      return " 共" + total + "条"
    },
  });

  const rowSelection = computed(() => {
    let { selectedRowKeys } = tableState
    return {
      selectedRowKeys,
      hideDefaultSelections: true,
      hideSelectAll: true,
      type: computed(() => {
        return tableState.rowSelectionType
      }),
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: `, selectedRowKeys);
        // console.log(`selectedRows: `, selectedRows);
        let rowKey = stringKeyToArray(tableState.rowKey, true);
        tableState.selectedRows = selectedRows;
        tableState.selectedRowKeys = selectedRows.map((item, index) => {
          return rowKey == 'index' ? index : getTargetBykey(item, rowKey);
        });
        tableState.checkedAll = selectedRows.length == tableState.dataSource.length;
      },
      onSelect: (record, selected, selectedRows) => {
        // console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows);
      }
    }
  });

  const tableMethods = {
    /**
     * @function 调用接口获取表格数据
     * @param {number} pageNo 
     * @returns 
     */
    getTable(pageNo) {
      if (pageNo && typeof pageNo == 'number' && !tableState.isFirstRender) {
        paginationState.current = pageNo;
        tableState.isFirstRender = false;
      };
      tableState.loading = true;
      tableState.dataSource = [];
      const paramsKey = tableState.queryParams.method == 'get' ? 'params' : 'data';
      axios.request({
        ...tableState.queryParams,
        [paramsKey]: {
          ...tableState.queryParams[paramsKey] || {},
          [PAGE_NO_KEY]: paginationState.current,
          [PAGE_SIZE_KEY]: paginationState.pageSize,
        }
      }).then(res => {
        let result = res.data || {};
        tableState.total = result.total || 0;
        // 若数据为空，且当前页数大于1 && 接口返回的total不为空
        if ((!result.data?.length && paginationState.pageNo > 1) && result.row !== undefined) {
          // 判断当前页数是否大于最大页数
          let page = tableMethods.isExceedMaximumPage(paginationState.current);
          if(page < paginationState.current) {
            tableMethods.getTable(page);
            return;
          }
        } else {
          tableState.dataSource = result.data || [];
        }
        paginationState.total = result.row || 0;
        tableState.selectedRowKeys = [];
        tableState.selectedRows = [];
      }).finally(() => {
        tableState.loading = false;
      });
    },
    /** 
     * @function 更新表单参数，并获取表格数据
     * @description 判断筛选参数是否有更新，若有则搜索第一页
     * @param {object} params 筛选参数
     */
    searchQuery(params = {}) {
      params = JSON.stringify(params);
      let oldParams = JSON.stringify(tableState.queryParams);
      if (params == oldParams || tableState.isFirstRender) {
        tableState.queryParams = JSON.parse(params)
        tableMethods.getTable(paginationState.current)
      } else {
        tableState.queryParams = JSON.parse(params)
        tableMethods.getTable(DEFAULT_PAGENO)
      }
    },
    /**
     * @function 切换分页
     * @param {number} pageNo
     * @param {number} pageSize 
     */
    paginationChange(pageNo, pageSize) {
      if (pageNo && typeof pageNo == 'number') {
        paginationState.current = pageNo
      }
      if (pageSize && typeof pageSize == 'number') {
        paginationState.pageSize = pageSize
      }
      changeHistoryState({ current: paginationState.current, pageSize: paginationState.pageSize })
			tableMethods.getTable(paginationState.current)
    },
    /**
     * @function 处理空数据
     * @param {any} target 
     * @returns {any}
     */
    disposeParams(target) {
      if (target instanceof Object) {
        Object.keys(target).forEach((key) => {
          if (target[key] instanceof Object) {
            target[key] = tableMethods.disposeParams(target[key]);
          }
          if (typeof target[key] == "string") {
            target[key] =
            target[key] || target[key] == "0" ? target[key].trim() : undefined;
          }
        });
        return target;
      } else if (typeof target == "string") {
        return target.trim();
      }
      return target;
    },
    /**
     * @function 全选/取消全选
     * @param {object}
     */
    checkAllHandler({ target }) {
      if(target.checked) {
        let rowKey = stringKeyToArray(tableState.rowKey, true);
        tableState.selectedRowKeys = tableState.dataSource.map(item => getTargetBykey(item, rowKey));
        tableState.selectedRows = [...tableState.dataSource];
      } else {
        tableState.selectedRowKeys = [];
        tableState.selectedRows = [];
      }
    },
    /**
     * @function 切换排序状态
     * @param {*} record
     * @param {*} isAsc 是否为倒序
     */
    changeSort(record, isAsc) {
      if(tableState.loading) return;
      tableState.sortRecord.title = record.title;
      tableState.sortRecord.isAsc = isAsc;
      tableState.sortRecord.customSort = record.customSort;
    },
    /**
     * @function 是否超出最大页数，是则跳转到最大页数
     * @param {*} current 当前页数
     * @returns {number}
     */
    isExceedMaximumPage(current) {
      let size = Math.ceil(paginationState.total / paginationState.pageSize);
      if(current > size && paginationState.total > 0) {
        return size;
      }
      return current
    },
    /**
     * @function 自定义表格数据
     * @param {array} list 
     */
    setDataSource(list) {
      tableState.dataSource = list || [];
      paginationState.total = tableState.dataSource.length;
      // 判断当前页数是否大于最大页数
      paginationState.current = tableMethods.isExceedMaximumPage(paginationState.current);
    },
    /**
     * @function 设置table组件的rowKey取值
     * @param {object} record 
     * @returns {string}
     */
    rowKey: (record) => {
      let rowKey = stringKeyToArray(tableState.rowKey, true);
      return getTargetBykey(record, rowKey);
    },
  }

  return {
    tableState,
    paginationState,
    rowSelection,
    tableMethods,
  }
}
