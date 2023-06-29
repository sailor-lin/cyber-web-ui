# g-params 表格搜索条件布局

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| loading         |  页面是否加载中        | Boolean            |  false               |
| controlProps    |  搜索控件配置          | [g-control-icon](/guide/icon/#g-control-icon-按钮图标-控件图标)    |  { pattern: 'primary' }               |
| default         |  默认插槽            | v-slot:default     |                   |
| right           |  右侧插槽            | v-slot:right     |                   |
| right           |  右侧插槽            | v-slot:right     |                   |


### 事件

| 属性名          | 说明                 | 回调参数                 |
| search          |  点击搜索控件回调事件 | function()               |


::: tip 提示

1. default插槽一般填充 输入框和下拉框等；
2. right插槽一般填充 添加按钮等；

:::
