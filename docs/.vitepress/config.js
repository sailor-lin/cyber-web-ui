import { defineConfig } from 'vitepress';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin';

export default defineConfig({
  title: 'cyber-web-ui',
  description: '',
  lang: 'cn-ZH',
  index: '/cyber-web-ui-document/',
  themeConfig: {
    logo: '/favicon.ico',
    siteTitle: 'cyber-web-ui',
    outline: 3,
    nav: [
      {
        text: '参考',
        link: '/guide/',
      },
    ],
    sidebar: {
      '/guide': [
        { text: '快速上手', link: '/guide/' },
        {
          text: 'ant二次开发组件',
          items: [
            { text: '按钮', link: '/guide/button/index.md' },
            { text: '徽标数', link: '/guide/badge/index.md' },
            { text: '多选框', link: '/guide/checkbox/index.md' },
            { text: '日期选择框', link: '/guide/date-picker/index.md' },
            { text: '下拉菜单', link: '/guide/dropdown/index.md' },
            { text: '空状态', link: '/guide/empty/index.md' },
            { text: '表单', link: '/guide/form/index.md' },
            { text: '输入框', link: '/guide/input/index.md' },
            { text: '弹窗', link: '/guide/modal/index.md' },
            { text: '单选按钮', link: '/guide/radio-button/index.md' },
            { text: '选择框', link: '/guide/select/index.md' },
            { text: '骨架屏', link: '/guide/skeleton/index.md' },
            { text: '表格', link: '/guide/table/index.md' },
            { text: '分页', link: '/guide/pagination/index.md' },
            { text: '标签', link: '/guide/tag/index.md' },
            { text: '文字提示', link: '/guide/tooltip/index.md' },
          ],
        },
        {
          text: '自定义组件',
          items: [
            { text: '页面布局', link: '/guide/page/index.md' },
            { text: '单元格布局', link: '/guide/cell/index.md' },
            { text: '表格搜索条件布局', link: '/guide/params/index.md' },
            { text: '图表', link: '/guide/chart/index.md' },
            { text: '图标', link: '/guide/icon/index.md' },
            { text: 'vscode编辑器', link: '/guide/monaco-editor/index.md' },
            { text: '标签卡片', link: '/guide/tag-card/index.md' },
            { text: '步骤条', link: '/guide/steps/index.md' },
            { text: '控件开关', link: '/guide/control-switch/index.md' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/spring-cyber/cyber-web-ui' },
    ],
    lastUpdatedText: '2023-06-29',
    search: {
      provider: 'local'
    }
  },
  markdown: {
    headers: {
      level: [0, 0],
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config(md) {
      md.use(componentPreview)
      md.use(containerPreview)
    }
  },
  vite: {
    plugins: [
      vueJsx({
        transformOn: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {}, // 全局主题色
          javascriptEnabled: true,
        },
      },
    },
  },
  appearance: false,
  lastUpdated: true,
});
