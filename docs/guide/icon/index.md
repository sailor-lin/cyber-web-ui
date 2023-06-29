# g-icon 图标

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| icon         | 图标标识           | String           |             |
| size         | 图标尺寸           | String           |             |
| pattern         | 颜色模式，svg图标无效           | "" \| "primary" \| "dark" \| "warning" \| "error" \| "gray" \| "classic"           |             |
| color         | 自定义图标颜色，color优先于pattern，svg图标无效           | String           |             |
| isSvg         | 是否使用svg图标           | Boolean           |  false           |


::: tip 提示

查看图标标识可前往 /src/views/assets/iconfont/demo_index.html查看

:::

# g-control-icon 按钮图标（控件图标）

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| icon         | 图标标识           | String           |                   |
| size         | 图标尺寸           | String           |                   |
| isSvg        | 是否使用svg图标    | Boolean           |  false           |
| disabled     | 是否禁用           | Boolean           |  false           |


::: tip 提示

1. 查看图标标识可前往 /src/views/assets/iconfont/demo_index.html查看
2. 其他参数可参考 [g-button](/guide/button/)

:::

# g-circle 前置圆点图标（状态圆点）

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| size         | 图标尺寸           | String           |                   |
| pattern         | 颜色模式           | "primary" \| "dark" \| "warning" \| "error" \| "gray" \| "classic"           |             |
| animation         | 是否开启动画           | Boolean           |   false                |
