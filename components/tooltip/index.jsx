import Tooltip from './Tooltip.jsx';

Tooltip.install = function (app) {
  app.component(Tooltip.name, Tooltip);
};

export default Tooltip;