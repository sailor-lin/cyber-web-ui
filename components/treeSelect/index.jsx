import TreeSelect from './TreeSelect';
import DeptTreeSelect from './DeptTreeSelect';
import EnterpriseTreeSelect from './EnterpriseTreeSelect';

TreeSelect.install = (app) => {
  app.component(TreeSelect.name, TreeSelect);
  app.component(DeptTreeSelect.name, DeptTreeSelect);
  app.component(EnterpriseTreeSelect.name, EnterpriseTreeSelect);
};

export default TreeSelect;