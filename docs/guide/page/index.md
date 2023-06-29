# g-page-label 页面顶部标题信息

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| title           | 标题文案        | String \| v-slot:title    |  标题       |
| tips           | 提示文案         | String \| v-slot:tips    |         |
| icon           | 图标         | String \| v-slot:icon    |         |
| showNav        | 是否显示返回导航栏（用于详情页） | Boolean    | false     |
| navProps        | 返回导航栏配置参数  | [g-breadcrumb](/guide/page/#g-breadcrumb-页面顶部返回导航栏)    |      |
| documentLink    | “了解更多” 文档跳转地址 | String    |       |

# g-breadcrumb 页面顶部返回导航栏

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| title           | 返回标题        | String      |  标题       |
| back           | 默认返回路径       | String    |         |
| nav           | 面包屑列表         | [Nav[]](/guide/page/#nav)    |         |
| separator       | 面包屑分隔符       | String    |         |
| onBack          | 自定义返回方法       | Function    |         |

### Nav

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| to           | 当前面包屑要跳转的地址（不必填）   | String      |         |
| replace      | 跳转路由是否开启replace          | Boolean      |         |
| title       | 当前面包屑文案                    | String      |         |

# g-page-body 页面主体布局

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| width           | 宽度         | String \| Number      |  100%       |
| showHeader      | 是否显示头部  | Boolean               |  true       |
| padding        | 是否开启头部的内边距样式  | Boolean     |  false       |

# g-card 页面卡片布局

::: tip 提示

1. g-card 建议根据ui添加自定义模式，添加可复用性；

:::