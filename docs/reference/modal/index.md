# g-badge 徽标数

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| title            | 弹窗标题           | String           |         |
| icon             | 弹窗标题图标        | String           |         |
| iconProps        | 自定义弹窗标题图标（参照[g-icon](/reference/icon/)）   | Object           |         |
| visible(v-model) | 对话框是否可见      | Boolean          | fakse        |
| loading(v-model) | 加载状态           | Boolean          | fakse        |
| okText           | 确认按钮文本        | String           | 确定        |
| cancelText       | 取消按钮文本        | String           | 取消        |
| onOk            |        | Function           |         |
| onCancel         | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭       | Function           |         |
| okButtonProps    | 确认按钮自定义样式（参照[g-button](/reference/button/)）    | Object           |          |
| cancelButtonProps | 取消按钮自定义样式（参照[g-button](/reference/button/)）    | Object           |          |
| showCancel      | 是否显示取消按钮      | Boolean           | true         |
| footer         | 是否显示底部内容       | Boolean           | true         |
| large         | 是否开启大弹窗模式       | Boolean           | false         |


::: tip 提示

查看更多属性请前往 https://www.antdv.com/components/modal-cn#API

:::
