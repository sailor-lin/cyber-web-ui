import TreeBody from './TreeBody';
import ProductTree from './ProductTree';
import MenuPermission from './MenuPermission';

export { TreeBody, ProductTree, MenuPermission }

export default {
  install(app) {
    app.component(TreeBody.name, TreeBody);
    app.component(ProductTree.name, ProductTree);
    app.component(MenuPermission.name, MenuPermission);
  }
};
