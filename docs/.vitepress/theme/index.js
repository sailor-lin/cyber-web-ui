import theme from 'vitepress/dist/client/theme-default/index';
import { AntDesignContainer } from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css';
import CyberWeb from '../../../components/index.js';

export default {
  ...theme,
  enhanceApp: ({app}) => {
    app.use(CyberWeb);
    app.component('demo-preview', AntDesignContainer);
    theme.enhanceApp({ app });
  },
};
