import Select from './Select';
import Position from './Position';
import Enterprise from './Enterprise';

Select.install = (app) => {
  app.component(Select.name, Select);
  app.component(Position.name, Position);
  app.component(Enterprise.name, Enterprise);
};

export default Select;