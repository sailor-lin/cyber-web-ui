<template>
  <div>
    <a-table
      class="g-table"
      ref="tableRef"
      :rowKey="methods.rowKey"
      :loading="tableState.loading"
      :columns="tableState.columns"
      :dataSource="tableState.dataSource"
      :scroll="tableState.scroll"
      :rowSelection="showSelection ? rowSelection : undefined"
      :pagination="false"
      v-bind="$attrs"
    >
      <!-- 表格头 -->
      <template #headerCell="{ title, column }">
        <!-- 单列多个title -->
        <template v-if="Array.isArray(title)">
          <div class="header-sort-control-body">
            <template v-for="(item, index) in title" :key="index">
              <!-- 开启排序 -->
              <g-control-sort
                v-if="item.sort"
                :value="
                  tableState.sortRecord.title == item.title
                    ? tableState.sortRecord.isAsc
                    : undefined
                "
                @change="(isAsc) => methods.changeSort(item, isAsc)"
              >{{ item.title }}</g-control-sort>
              <!-- 未开启排序 -->
              <div v-else class="flex-center">{{ item.title }}</div>
            </template>
          </div>
        </template>
        <!-- 开启排序 -->
        <g-control-sort
          v-else-if="column.sort"
          :value="
            tableState.sortRecord.title == title
              ? tableState.sortRecord.isAsc
              : undefined
          "
          @change="(isAsc) => methods.changeSort(column, isAsc)"
        >{{ title }}</g-control-sort>
      </template>
      <template #bodyCell="{ column, record, index, text, value }">
        <!-- 操作菜单 -->
        <template v-if="column.key == 'action'" && action>
          <g-dropdown placement="bottomRight">
            <g-icon size="15" icon="icon-caozuo" style="cursor: pointer"></g-icon>
            <template #overlay>
              <a-menu class="g-dropdown-menu">
                <a-menu-item
                  v-for="(item, index) in tableState.overlayMenu(record)"
                  :key="index"
                  :icon="item.icon"
                  :disabled="methods.disposeDropdownMent(item?.disabled, record, false)"
                >
                  <template #icon v-if="item.icon">
                    <g-icon :icon="item.icon" style="margin-right: 8px;"></g-icon>
                  </template>
                  <a href="javascript:;" @click="item.handler?.(record)">{{ item.label }}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </g-dropdown>
        </template>
        <!-- 自定义单元格 -->
        <slot
          name="bodyCell"
          :column="column"
          :record="record"
          :index="index"
          :text="text"
          :value="value"
        ></slot>
      </template>
    </a-table>
    <g-pagination
      :current="paginationState.current"
      :pageSize="paginationState.pageSize"
      :total="paginationState.total"
      :show-total="paginationState.showTotal"
      :show-size-changer="paginationState.showSizeChanger"
      :show-quick-jumper="paginationState.showQuickJumper"
      v-bind="paginationProps"
      @change="methods.paginationChange"
    >
      <template #left v-if="showSelection">
        <div style="display: flex; align-items: center">
          <a-checkbox v-model:checked="tableState.checkedAll" @change="methods.checkAllHandler">
            <span style="padding-left: 16px;">全选</span>
          </a-checkbox>
          <g-button style="margin-left: 20px;" @click="methods.batchDelete">删除</g-button>
        </div>
      </template>
    </g-pagination>
  </div>
</template>

<script setup>
import tableMixins from "@/mixins/tableMixins.js";

const props = defineProps({
  // dataSoure唯一值，selection选中值
  rowKey: {
    type: String,
    default: "id",
  },
  // 显示表格选择和全选
  showSelection: {
    type: Boolean,
    default: false,
  },
  // 表格加载
  loading: {
    type: Boolean,
    default: false,
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
  // 分页栏自定义配置
  paginationProps: {
    type: Object,
    default: () => ({
      // 分页列表
      pageSizeOptions: ['10', '20', '30'],
    }),
  },
});
const tableRef = ref();
const { tableState, paginationState, tableMethods, rowSelection } = tableMixins();
tableState.columns = computed(() => {
  let columns = [...props.columns];
  // 是否显示默认操作列
  if (props.action) {
    columns.push({ title: "操作", fixed: "right", key: "action", width: 80 })
  };
  // 过滤columns
  columns = columns.filter(item => typeof item.show == 'boolean' ? item.show : true);
  // 初始化默认排序项
  if(!tableState.sortRecord.title) {
    let record = undefined;
    columns.some(item => {
      if(Array.isArray(item.title)) {
        record = item.title.find(citem => citem.sort);
      } else if (item.sort) {
        record = item;
      }
      return record;
    });
    // 设置默认排序
    tableState.sortRecord = {
      title: record?.title,
      isAsc: true,
      customSort: record?.customSort
    };
  }
  return columns.map(item => {
    // 自定义单元格类名
    if(item.className && !item.key && item.dataIndex) {
      if(item.customRender) {
        item.customRenderFun = item.customRender
      } else {
        item.customRenderFun = ({ text }) => text
      }
      item.customRender = (params) => {
        if(item.className) {
          return h('span', { class: item.className }, item.customRenderFun(params));
        }
        return item.customRenderFun(params);
      }
    }
    return item;
  });
});
/**
 * @function overlayMenu action操作菜单
 * @param {string} label 文本
 * @param {function} handler 点击触发方法
 * @param {boolean} show 是否显示
 * @param {boolean} disabled 是否禁用
 */
tableState.overlayMenu = computed(() => {
  return (record) => {
    return props.overlayMenu.filter(item => methods.disposeDropdownMent(item?.show, record, true));
  }
});
// 初始化分页列表
paginationState.pageSizeOptions = props.paginationProps?.pageSizeOptions?.length
  ? props.paginationProps.pageSizeOptions
  : paginationState.pageSizeOptions;
paginationState.pageSize = Number(paginationState.pageSizeOptions[0]);

const $emit = defineEmits(['update:loading'])
const methods = Object.assign(tableMethods, {
  init() {
    watch(
      () => [props.rowKey, props.loading],
      ([rowKey, loading]) => {
        tableState.rowKey = rowKey;
        tableState.loading = loading
      },
      { immediate: true, deep: true }
    );
    watch(() => tableState.loading, (loading) => {
      $emit('update:loading', loading)
    });
  },
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
  // 批量删除
  batchDelete() {
    console.log('selectedRows', tableState.selectedRows)
    console.log('selectedRowKeys', tableState.selectedRowKeys)
  },
});

methods.init();

defineExpose({
  /*
   * searchQuery 搜索
   * @params: 请求参数
   * @filterFun: 过滤表格数据方法
   */
  searchQuery: methods.searchQuery,
  // 获取表格选中行
  getSelection: () => ({
    selectedRows: tableState.selectedRows,
    selectedRowKeys: tableState.selectedRowKeys,
  }),
  /**
   * @function 自定义表格数据
   * @param {array} list 
   */
  setDataSource: methods.setDataSource,
  // 获取当前表格数据
  getDataSource: () => tableState.dataSource,
});
</script>

<style lang="less">
.g-table.ant-table-wrapper {
  .main-body();
  
  .ant-table {
    line-height: 1.5;
  }
  .ant-table-cell.ant-table-selection-column {
    padding-left: 20px;
  }
  // 修改表格内边距
  .ant-table-thead > tr > th {
    padding: 19px 20px;
  }
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding: 8px 20px;
  }
  .ant-table .ant-table-expanded-row-fixed {
    margin: -16px -20px;
  }
  .ant-table-thead {
    tr {
      .ant-table-cell {
        .small-title();
        &::before {
          display: none;
        }
      }
    }
    .header-sort-control-body {
      .flex-center();
      & > * {
        &::before {
          content: '';
          display: block;
          left: 0;
          height: 20px;
          border-right: 1px solid #D9E2EB;
          margin: 0 10px;
        }
        &:first-child::before {
          display: none;
        }
      }
    }
  }
  // hover样式
  .ant-table-tbody {
    & > tr.ant-table-row:hover {
      & > td {
        background-color: @primary-bg-color;
        .g-cell-router-link {
          color: @primary-color;
        }
      }
    }
  }
  .ant-table-selection-col {
    width: 38px;
  }
}
</style>
