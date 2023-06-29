import * as components from './components.js';
import packageJson from '../package.json';
const version = packageJson.version;

export * from './components';

import './style/iconfont/iconfont.js';
import './cyber.jsx';

export const install = function (app) {
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
