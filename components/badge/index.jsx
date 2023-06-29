import Badge from './Badge.jsx';

Badge.install = function (app) {
  app.component(Badge.name, Badge);
};

export default Badge;