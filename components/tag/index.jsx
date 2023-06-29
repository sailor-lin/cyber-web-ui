import Tag from './Tag.jsx';

Tag.install = function (app) {
  app.component(Tag.name, Tag);
};

export default Tag;