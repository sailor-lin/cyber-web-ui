import { defineComponent, reactive, computed, watch } from 'vue';
import Icon from '../icon';
import { Menu as AMenu, SubMenu as ASubMenu, MenuItem as AMenuItem, Input as AInput } from 'ant-design-vue';
import { RouterLink, useRoute } from 'vue-router';
import { maintainStore, permissionStore } from '../_utils/store';
import { PRODUCT_CODE } from '../_utils/config';

const SubMenu = defineComponent({
  name: 'SubMenu',
  props: {
    menuItem: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { attrs, slots, emit, expose }) {

    const isSubMenu = computed(() => {
      return !props.menuItem?.component
        || (props.menuItem?.children?.length > 0 && (props.menuItem?.children || []).some(item => item.visible === 0));
    });

    return () => {
      if(props.menuItem.visible === 1) return;
      function iconSlot() {
        if(!props.menuItem?.icon) return;
        return <Icon icon={props.menuItem?.icon} size="16" />
      }
      function subMenuSlot() {
        const subMenuSlot = {
          icon: iconSlot,
          expandIcon() {
            return <Icon icon="cyber-drop-down" size="20" class="expand-icon" />
          },
          title() {
            return <span>{ props.menuItem?.name }</span>
          },
          default() {
            return (props.menuItem?.children || []).map(item => {
              return (
                <SubMenu menu-item={item} />
              )
            })
          }
        }
        return (
          <ASubMenu key={props.menuItem?.id} v-slots={subMenuSlot} />
        )
      }
      function menuItemSlot() {
        const itemSlots = {
          icon: iconSlot,
          default() {
            let name = props.menuItem?.name;
            // 外链地址
            if(props.menuItem.isFrame == '0') {
              return <a href={props.menuItem.path} target='_blank'>{ name }</a>
            }
            let product = props.menuItem?.productInfo || {};
            let path = props.menuItem?.path || '';
            const isCurrentProduct = PRODUCT_CODE == product.code;
            if(!isCurrentProduct) {
              path = `${(product.portalAdd || '').replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
            }
            return isCurrentProduct
              ? <RouterLink to={ path }>{ name }</RouterLink>
              : <a href={ path } target="_self">{ name }</a>
          }
        }
        return (
          <AMenuItem key={props.menuItem?.id} v-slots={itemSlots} />
        )
      }
      return isSubMenu.value ? subMenuSlot() : menuItemSlot();
    }
  }
});

// 转换路径，将自定义变量转为值
const transformSidebar = (target) => {
  if(Array.isArray(target)) return target.map(item => transformSidebar(item));
  if(Array.isArray(target.children)) target.children = transformSidebar(target.children);
  if(/\$\$.+\$\$/.test(target.path)) {
    target.path = target.path.split('$$').map((value, index) => {
     if(index % 2 === 0) return value;
     return maintainStore()[value] || `$$${value}$$`;
   }).join('');
  }
  return target;
};

const LayoutSiderbar = defineComponent({
  name: 'CLayoutSiderbar',
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    const $useRoute = useRoute();
    const $permissionStore = permissionStore();
    const sidebarState = reactive({
      search: undefined,
      openKeys: [],
      selectedKeys: [],
      highlight: [],
    });
    const sidebarRoutes = computed(() => {
      return JSON.parse(JSON.stringify($permissionStore.sidebarRoutes || []))
        .filter(item => item.type != 'product' || item.isFavorite)
        .map(item => {
          if(item.code !== PRODUCT_CODE) return item;
          return transformSidebar(item);
        });
    });
    // 菜单展开事件
    function onOpenChange(openKeys) {
      if(openKeys.length > sidebarState.openKeys?.length) {
        let lastOpenKey = openKeys[openKeys.length - 1];
        let reg = new RegExp(`"id":"${lastOpenKey}"`);
        let route = sidebarRoutes.value.find(item => {
          return reg.test(JSON.stringify(item));
        });
        if(route) {
          let select = [];
          getSelect(route, 'id', lastOpenKey, select);
          sidebarState.openKeys = select;
        }
      } else {
        sidebarState.openKeys = openKeys;
      }
    }
    // 更新选择
    function updateSelected(path) {
      let route = sidebarRoutes.value.find(item => PRODUCT_CODE == item.code);
      if(route) {
        let select = [];
        getSelect(route, 'path', path, select);
        sidebarState.selectedKeys = select.slice(0, 1);
        sidebarState.openKeys = select;
      }
    }
    // 获取选择
    function getSelect(route, key = 'path', value, list = []) {
      if(route[key]) {
        let reg = key == 'path'
          ? new RegExp(`^\/?${route[key].replace(/^\//, '').replace(/:[^\/]+|\$\$[^\/]+\$\$/g, '[^\/]+')}$`)
          : new RegExp(`^${route[key]}$`);
        if(reg.test(value)) {
          if(route.visible === 0 || route.type == 'product') list.push(route.id);
          return true;
        }
      }
      if(route.children?.length) {
        let find = route.children.find(item => getSelect(item, key, value, list));
        if(!find) return false;
        list.push(route.id);
        return true;
      }
    }
    // 显示收藏
    function showCollections(event) {
      event.stopPropagation();
      event.preventDefault();
      emit('showCollections');
    }
    function searchProduct(event) {
      let value = event.target.value;
      sidebarState.highlight = [];
      sidebarState.openKeys = [];
      if(!value) return;
      let reg = new RegExp(value);
      sidebarRoutes.value.forEach(item => {
        if(reg.test(item.name)) sidebarState.highlight.push(item.id);
      });
      sidebarState.openKeys = [...sidebarState.highlight];
    }
    
    watch(() => $useRoute.path, (path) => {
      updateSelected(path);
    }, { immediate: true, deep: true });
    return () => {
      function searchSlot() {
        return (
          <div class="cyber-layout-sidebar-search-block">
            <AInput
              v-model:value={sidebarState.search}
              placeholder="输入应用名称搜索..."
              class="cyber-layout-menu-search"
              onChange={searchProduct}
              v-slots={{
                prefix: () => <Icon isSvg icon="cyber-sousuo" size="16" class="cyber-layout-menu-search-icon"></Icon>,
                suffix: () => <Icon isSvg size="16" icon="cyber-peizhixiang1" style="cursor: pointer" onClick={showCollections}/>,
              }}
            ></AInput>
          </div>
        )
      }
      function menuSlot() {
        return (
          <AMenu
            mode="inline"
            theme="light"
            class="cyber-layout-menu-ul"
            multiple
            openKeys={sidebarState.openKeys}
            selectedKeys={sidebarState.selectedKeys}
            onOpenChange={onOpenChange}
          >
            {
              sidebarRoutes.value.map(item => (
                <SubMenu
                  menu-item={item}
                  class={{ 'cyber-menu-submenu-selected': sidebarState.highlight.some(citem => citem == item.id) }}
                />
              ))
            }
          </AMenu>
        )
      }
      return (
        <div class="cyber-layout-sidebar">
          <div class="cyber-layout-sidebar-container">
            { searchSlot() }
            { menuSlot() }
          </div>
        </div>
      );
    };
  },
});

export default LayoutSiderbar;
