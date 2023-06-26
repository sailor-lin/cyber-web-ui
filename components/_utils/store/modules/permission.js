import { defineStore } from 'pinia';
import axios from '../../api';
import { h } from 'vue';
import { PRODUCT_CODE } from '../../config';
import { NotFound } from '../../../index';

const PERMISSIONIONARIES_STORE = "PERMISSIONIONARIES_STORE";

// 权限节点元素
export const permissionNodes = {};

// 权限状态
const permissionStore = defineStore({
  id: PERMISSIONIONARIES_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: PERMISSIONIONARIES_STORE,
  },
  state: () => ({
    modules: [],
    parentName: undefined,
    removeRoutes: {},
    addRoutes: [],
    sidebarRoutes: [],
    isAcquire: false,
  }),
  getters: {
    permission() {
      return getApplicationRouteCode(this.sidebarRoutes);
    },
    hasPermission() {
      return (value = []) => {
        if(typeof value == 'boolean') return value;
        let target = transformValue(value);
        return target.every(item => (this.permission || []).some(code => item == code));
      };
    },
  },
  actions: {
    /**
     * @function 生成当前应用动态路由和菜单
     * @param {File[]} modules 应用动态加载文件路径
     * @param {router} router router实例对象
     * @param {String} parentName 父菜单的name属性
     * @returns {routes[]}
     */
    generateRoutes(modules, router, parentName) {
      this.modules = modules;
      this.parentName = parentName;
      return new Promise(async (resolve, reject) => {
        try {
          let res = await axios.request({
            url: '/personal/permission/product/menus',
            method: 'get',
            headers: {
              'X-Project-Code': 'cyber-personal'
            },
          });
          // 获取旧动态菜单
          this.removeRoutes = {};
          (this.addRoutes || []).forEach(item => this.removeRoutes[item.name] = item);
          // 处理新路由
          const sdata = JSON.parse(JSON.stringify(res.data || '[]'));
          this.sidebarRoutes = filterAsyncRouter(sdata);
          const rdata = JSON.parse(JSON.stringify(res.data || '[]'));
          this.addRoutes = filterAddRouter(rdata, modules);
          if(router) {
            // 动态加载菜单
            this.addRoutes.forEach(route => {
              if(this.removeRoutes[route.name]) delete this.removeRoutes[route.name];
              if(parentName) router.addRoute(parentName, route);
              else router.addRoute(route);
            });
            // 删除没有权限的动态菜单
            Object.keys(this.removeRoutes).forEach(key => router.removeRoute(key));
          }
          rerenderPermissionNodes();
          resolve(this.addRoutes);
        } catch(error) {
          console.log('error', error);
          reject(error);
        }
        this.isAcquire = true;
      })
    },
  },
});

function transformValue(value) {
  if(typeof value == 'string') value = value.replace(/,\s?/g, ',').split(',');
  return Array.isArray(value) ? value.filter(item => item) : value;
}

// 重新渲染权限元素
export function rerenderPermissionNodes() {
  Object.keys(permissionNodes).forEach(key => {
    let { el, value } = permissionNodes[key];
    permissionProcessing(el, value, key);
  });
}

// 权限处理
export function permissionProcessing(el, value = '', key) {
  let $permissionStore = permissionStore();
  let curShow = $permissionStore.hasPermission(value);
  let target = permissionNodes[key];
  let comment = target?.comment || document.createComment('');
  let replace = target?.replace || false;
  if(!target) {
    if(!curShow) {
      replace = true;
      el?.parentNode && el?.parentNode.replaceChild(comment, el);
    }
    permissionNodes[key] = { el, value, comment, replace };
  }
  if(replace && curShow) {
    let { comment } = permissionNodes[key];
    comment.parentNode.replaceChild(el, comment);
    permissionNodes[key].replace = false;
  } else if(!replace && !curShow) {
    el.parentNode && el.parentNode.replaceChild(comment, el);
    permissionNodes[key].replace = true;
  }
}

// 获取当前应用权限编码
function getApplicationRouteCode(routes, list = []) {
  routes.forEach(({  type, code, children = [] }) => {
    if(type == 'product' && code != PRODUCT_CODE) return;
    if(type != 'product') list.push(code);
    getApplicationRouteCode(children, list);
  });
  return list;
}

// 遍历菜单列表
function filterAsyncRouter(routes, product) {
  return routes.map(route => {

    route = Object.assign(route, route.menu);

    if(route.type != 'product') {
      route.productInfo = {
        ...product,
        children: undefined
      };
    }
    
    route.children = filterAsyncRouter(route.children || [], route.type == 'product' ? route : product);

    return route
  })
}

// 过滤动态路由
function filterAddRouter(routes, modules, list = []) {
  routes.forEach(route => {
    if(route.type == 'product' && PRODUCT_CODE != route.code) return;

    route = Object.assign(route, route.menu);

    if(route?.component) {
      route.component = loadView(route.component, modules);
    }

    if (route.children && route.children.length) {
      filterAddRouter(route.children, modules, list);
    }
    
    if(!route.component && !route.redirect) {
      route.component = h(NotFound, {});
    }

    if(route.component && route.path) {
      delete route.children;
      route.path = transformPath(route.path);
      route.meta = {
        name: route.name,
        query: route.query,
        visible: route.visible == '0',
        isFrame: route.isFrame == '0',
      }
      route.name = route.code;
      list.push(route);
    }
  });
  return list;
}

// 转换路径，将自定义变量转为router变量
export const transformPath = (path) => {
  if(!/\$\$.+\$\$/.test(path)) return path;
  return path.split('$$').map((value, index) => {
    if(index % 2 === 0) return value;
    return `:${value}`;
  }).join('');
}

export const loadView = (view, modules) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view.replace(/^\//, '')) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default permissionStore;
