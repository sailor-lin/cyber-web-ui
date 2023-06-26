import router from './router';
import { permissionStore, configStore, userStore } from './store';
import { changeLocation, getToken, removeToken } from '../components/index';

const modules = import.meta.glob(['./views/**/*.vue', '!./views/**/modules/*.vue']);

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  if(!configStore().isAcquire) {
    await configStore().getProductConfig();
  }
  if(getToken()) {
    let isReplace = false;
    if(!permissionStore().isAcquire) {
      try {
        await userStore().getInfo();
        let routes = await permissionStore().generateRoutes(modules, router, 'Layout');
        let some = routes.some(route => {
          if(!/^:|\/:/.test(route.path)) return route.path == to.path;
          let path = route.path.split('/');
          let toPath = to.path.split('/');
          return path.every((item, index) => {
            if(/^:/.test(item)) return true;
            return item == toPath[index];
          });
        });
        if(some) {
          delete to.params?.catchAll;
          delete to.name;
        }
        isReplace = true;
      } catch(error) {
        removeToken();
        let path = getReplacePath(configStore().loginPath);
        if(!path) return next(false);
        next(path);
        return;
      }
    }
    let path = '';
    if(/\/login|^\/$/.test(to.path)) {
      path = getReplacePath(configStore().homePath);
      if(!path) return next(false);
    }
    if(path) next({ path, replace: true });
    else if(isReplace) next({ ...to, replace: true });
    else next();
   } else {
    if(whiteList.indexOf(to.path) !== -1) {
      next();
    } else if(configStore().loginPath) {
      let path = getReplacePath(configStore().loginPath);
      if(!path) return next(false);
      next(path);
    } else {
      next('/login');
    }
  }
});

function getReplacePath(replacePath) {
  let path = location.origin + location.pathname + (location.hash ? '#' : '');
  if(!replacePath.includes(path)) return changeLocation(replacePath);
  return replacePath.replace(path, '');
}
