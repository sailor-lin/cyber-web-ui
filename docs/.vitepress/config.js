import theme from '../../public/theme.js';
import { defineConfig } from 'vitepress';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
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
        link: '/reference/',
      },
    ],
    sidebar: {
      '/reference': [
        { text: '快速上手', link: '/reference/' },
        {
          text: 'ant二次开发组件',
          items: [
            { text: '按钮', link: '/reference/button/index.md' },
            { text: '徽标数', link: '/reference/badge/index.md' },
            { text: '多选框', link: '/reference/checkbox/index.md' },
            { text: '日期选择框', link: '/reference/date-picker/index.md' },
            { text: '下拉菜单', link: '/reference/dropdown/index.md' },
            { text: '空状态', link: '/reference/empty/index.md' },
            { text: '表单', link: '/reference/form/index.md' },
            { text: '输入框', link: '/reference/input/index.md' },
            { text: '弹窗', link: '/reference/modal/index.md' },
            { text: '单选按钮', link: '/reference/radio-button/index.md' },
            { text: '选择框', link: '/reference/select/index.md' },
            { text: '骨架屏', link: '/reference/skeleton/index.md' },
            { text: '表格', link: '/reference/table/index.md' },
            { text: '分页', link: '/reference/pagination/index.md' },
            { text: '标签', link: '/reference/tag/index.md' },
            { text: '文字提示', link: '/reference/tooltip/index.md' },
          ],
        },
        {
          text: '自定义组件',
          items: [
            { text: '页面布局', link: '/reference/page/index.md' },
            { text: '单元格布局', link: '/reference/cell/index.md' },
            { text: '表格搜索条件布局', link: '/reference/params/index.md' },
            { text: '图标', link: '/reference/icon/index.md' },
            { text: 'vscode编辑器', link: '/reference/monaco-editor/index.md' },
            { text: '标签卡片', link: '/reference/tag-card/index.md' },
            { text: '步骤条', link: '/reference/steps/index.md' },
            { text: '控件开关', link: '/reference/control-switch/index.md' },
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
      Components({
        dts: true,
        extensions: ["vue", "js", "ts", "jsx", "tsx"], // 扩展属性
        resolvers: [AntDesignVueResolver()], // AntDesignVueResolver 按需加载
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: theme, // 全局主题色
          javascriptEnabled: true,
        },
      },
    },
  },
  appearance: false,
  lastUpdated: true,
});
