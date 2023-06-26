import Detail from '@/views/detail/index.vue';
import Example from '@/views/example/index.vue';
import LowCodeTemplate from '@/views/low-code-template/index.vue';

export default [
  // 示例
  {
    path: '/example',
    name: 'Example',
    component: Example,
    meta: {
      title: '示例',
      icon: 'icon-gailan-2',
    },
  },
  // 低代码模板
  {
    path: '/low-code-template',
    name: 'LowCodeTemplate',
    component: LowCodeTemplate,
    meta: {
      title: '低代码模板',
      icon: 'icon-gailan-2',
    },
  },
  // 详情
  {
    /**
     * @deprecated 可自定义参数，根据不同参数跳转到不同详情页
     * @param {string} cluster 集群 
     * @param {string} namespace 命名空间 
     * @param {string} kind 详情类型
     * @param {string} name 名称
     */
    path: '/detail/:cluster/:namespace/:kind/:name',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '详情',
      implicit: true, // 隐式菜单 - 隐藏菜单项
    },
  },
]