import permission from './modules/permission.js';

export default {
  install(Vue) {
    Vue.directive(permission.name, permission);
  },
};
