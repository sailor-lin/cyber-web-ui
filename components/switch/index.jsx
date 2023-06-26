import SwitchControl from './SwitchControl';

export { SwitchControl };

export default {
  install: function (app) {
    app.component(SwitchControl.name, SwitchControl);
  }
};