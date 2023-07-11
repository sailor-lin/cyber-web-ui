import * as components from './components.js';
import version from './version/index.js';
import { initHistory } from './_utils/history.js';
import './style/iconfont/iconfont.js';

export * from './components';
export * from './api.js';

export const install = function (app) {
  initHistory();
  Object.keys(components).forEach(key => {
    const component = components[key];
    if(component.install) {
      app.use(component);
    }
  });
  return app;
};

export { version }

export default {
  version,
  install,
};
