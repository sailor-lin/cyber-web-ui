import focus from './modules/focus.js';
import power from './modules/power.js';

// 自定义指令
const install = function(app) {
  app.directive('focus', focus);
  app.directive('power', power);
}

export default install;
