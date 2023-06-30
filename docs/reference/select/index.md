# g-select

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| width         | 宽度            | String \| Number      |             |
| options         | 同antd        | v-slot:option="{value, label, [disabled, key, title]}"  |             |
| fieldNames      | 同antd        | object      | \{ label: label, value: value, options: options \}  |
| dictCode         | 字典名称，可自动填充字典列表，dictCode优先于options            | String      |             |
| label         | 选择框前缀文本            | String      |             |
| round         | 下拉选择框否为椭圆形            | Boolean      | false            |
| arrowTurn         | 是否翻转右边的箭头            | Boolean      |  true          |
| default         | 默认插槽，自定义options列表    | v-slot:default      |            |

::: tip 提示

查看更多属性请前往 https://www.antdv.com/components/select-cn#API

:::