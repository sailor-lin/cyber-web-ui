# g-table 表格

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| rowKey          | 表格行 key 的取值    | String                            |  id       |
| showSelection   | 是否显示选择框       | Boolean                           |  false       |
| loading         | 页面是否加载中       | Boolean                           |  false       |
| columns         | 表格列的配置描述     | [Columns](/reference/table/#columns)  |            |
| action          | 是否显示默认操作列    | Boolean    |  true                |
| overlayMenu     | 操作下拉菜单         | [OverlayMenu](/reference/dropdown/#overlaymenu)    |         |
| paginationProps | 分页栏自定义配置     | [g-pagination](/reference/pagination/)    |           |
| loading         | 页面是否加载中       | Boolean    |  false                   |


### 方法

| 方法名          | 说明                 | 参数                 |
| :-------------- | :------------------- | :------------------- |
| searchQuery      | 搜索列表             | (params) => void        |
| getSelection     | 获取当前表格选中的数据 | () => \{ selectedRows, selectedRowKeys \} |
| setDataSource    | 手动设置表格的数据     | (dataSource) => void    |
| getDataSource    | 获取当前表格的数据     | () => dataSource        |

::: tip 提示

1. 若需自定义操作列，可设置action="false"，在columns添加自定义操作列；

查看更多属性请前往 https://www.antdv.com/components/table-cn#API

:::

### Columns

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| show            | 是否显示当前列      | Boolean     |           |
| sort            | 当前列是否开启排序   | Boolean     |           |
| customSort      | 自定义排序规则      | (dataSource, isAsc) => {} |      |
| className       | 自定义当前列的class名称 | String     |           |

::: tip 提示

1. 当前排序功能为前端排序，若需要后端排序，需要重构代码逻辑；

查看更多属性请前往 https://www.antdv.com/components/table-cn#Column

:::
