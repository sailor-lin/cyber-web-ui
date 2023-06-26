import Select from './Select';
import EnterpriseSelect from './EnterpriseSelect';
import UserSelect from './UserSelect';
import RoleSelect from './RoleSelect';
import IconSelect from './IconSelect';
import PositionSelect from './PositionSelect';

Select.install = (app) => {
  app.component(Select.name, Select);
  app.component(EnterpriseSelect.name, EnterpriseSelect);
  app.component(UserSelect.name, UserSelect);
  app.component(RoleSelect.name, RoleSelect);
  app.component(IconSelect.name, IconSelect);
  app.component(PositionSelect.name, PositionSelect);
};

export { Select, EnterpriseSelect, UserSelect, RoleSelect, IconSelect, PositionSelect };

export default Select;
