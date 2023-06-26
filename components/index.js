import * as components from './components.js';
import version from './version/index.js';
import isWindows from './_utils/is-windows.js';
import { initialHistory } from './_utils/history.js';
import { store } from './api.js';
import directive from './_utils/directive/index.js';

if(isWindows()) {
  import('./style/iconfont/iconfont.js');
}

export * from './components';
export * from './api.js';

export { version };

export const install = function (app) {
  initialHistory();
  Object.keys(components).forEach(key => {
    const component = components[key];
    if(component.install) {
      app.use(component);
    }
  });
  app.use(store.instance);
  app.use(directive);
  return app;
};

export default {
  version,
  install,
};
