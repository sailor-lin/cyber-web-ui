import * as VueRouter from 'vue-router';
import { LoginPage } from '../../components/index';
import Layout from '../views/layout/index.vue';
import Example from '../views/example/index.vue';
import NotFound from '../components/404.vue';

const routes = [
  {
    path: "/",
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/example',
        name: 'Example',
        component: Example,
        meta: {
          title: '示例',
          icon: 'icon-fenzu',
          hideNav: true,
        },
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: NotFound,
  }
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes: routes
});

export default router
