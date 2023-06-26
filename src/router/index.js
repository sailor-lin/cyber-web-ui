import * as VueRouter from 'vue-router';
import defaultRoute from './modules/default.js';
import Login from '@/views/login/index.vue';
import NotFound from '@/components/error/404.vue';

const routes = [
  {
    path: "/",
    redirect: '/login',
    meta: {
      independent: true,
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      // 独立页面，没有layouts
      independent: true,
    },
  },
  ...defaultRoute,
  {
    path: '/404',
    name: '404',
    component: NotFound,
    meta: {
      // 独立页面，没有layouts
      independent: true,
    },
  },
  // 所有未定义路由，全部重定向到404页
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {
      hidden: true, // 隐藏菜单 - 隐藏layouts菜单栏
      implicit: true, // 隐式菜单 - 隐藏菜单项
    }
  }
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes: routes
})

router.beforeEach((to, from, next) => {
  // if (!cookie.get("token") && to.path != '/login') {
  //   next('/login')
  // } else if (cookie.get("token") && to.path == '/login') {
  //   next(store.getters.defaultRoute)
  // }
  // if (to.path == "/login" && cookie.get("token")) {
  //   next(store.state.user.addRoutes[0].path);
  //   return;
  // }
  next();
});

export default router
