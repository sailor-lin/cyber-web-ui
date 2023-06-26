import TreeSelect from './TreeSelect';
import DeptTreeSelect from './DeptTreeSelect';
import MenuTreeSelect from './MenuTreeSelect';
import EnterpriseTreeSelect from './EnterpriseTreeSelect';
import AreaTreeSelect from './AreaTreeSelect';

TreeSelect.install = (app) => {
  app.component(TreeSelect.name, TreeSelect);
  app.component(DeptTreeSelect.name, DeptTreeSelect);
  app.component(MenuTreeSelect.name, MenuTreeSelect);
  app.component(EnterpriseTreeSelect.name, EnterpriseTreeSelect);
  app.component(AreaTreeSelect.name, AreaTreeSelect);
};

export { DeptTreeSelect, EnterpriseTreeSelect, MenuTreeSelect, AreaTreeSelect };

export default TreeSelect;