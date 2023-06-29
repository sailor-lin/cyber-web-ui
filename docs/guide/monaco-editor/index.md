# g-monaco-editor 徽标数

### 属性

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| value(v-model)     | 编辑器内容      | String           |         |
| language           | 语言           | "yaml" \| "javascript" \| "java" \| python \| "text" 等编程语言          |  "yaml"       |
| readOnly           | 是否只读      | Boolean           | false        |
| showControl        | 是否显示控件  | Boolean     | true        |
| showUpload         | 是否显示上传控件  | Boolean       | true        |
| downloadName       | 下载文件名称     | String        | "default.yaml"        |
| uploadType         | 上传文件类型  | String           | "yaml,yml"        |
| highlight          | 自定义文本高亮文本配置（需先设置language="text"）  | [Highlight[]](/guide/monaco-editor/#highlight)           |         |


### Highlight

| 属性名          | 说明                 | 类型                 | 默认值                 |
| :-------------- | :------------------- | :------------------- | :------------------- |
| type     | 要高亮的类型      | "key" \| "value" \| "text"    |         |
| targetKeys | 要高亮的目标key值（只适用type="key"和type="value"） | String           |         |
| color     | 要高亮颜色      | "green" \| "yellow"    |         |


::: tip 提示

1. 高亮类型为key或value适用于类似yaml格式的数据;
2. 高亮的 targetKeys 属性格式为 "['spec']['template']['spec']";
3. 高亮颜色可自定义添加和修改，具体参照 .lineHighlight-green 样式;

查看更多属性请前往 https://microsoft.github.io/monaco-editor/docs.html

:::
