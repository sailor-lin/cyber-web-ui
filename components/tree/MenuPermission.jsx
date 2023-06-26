import axios from '../_utils/api';
import { defineComponent,  reactive, computed, watchEffect } from 'vue';
import { Tree as ATree, Empty as AEmpty } from 'ant-design-vue';

export default defineComponent({
  name: 'CMenuPermission',
  props: {
    // 产品id
    value: Array,
    productId: String,
    fieldNames: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否为用户的菜单列表
    isPersonal: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 220
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const menuState = reactive({
      treeData: [],
      checkedKeys: [],
      fieldNames: computed(() => {
        return { title: 'name', key: 'id', ...(props.fieldNames || {}) };
      }),
    });
    async function searchQuery(isPersonal, productId) {
      try {
        if(!productId) {
          menuState.treeData = [];
          return;
        }
        let url = isPersonal
          ? '/personal/permission/product/menu' // 当前用户在应用中拥有的菜单
          : '/auth/menu/tree'; // 应用下的菜单列表
        let res = await axios.request({
          url: url,
          method: 'get',
          params: {
            productId: productId,
          },
          headers: {
            'X-Project-Code': isPersonal ? 'cyber-personal' : 'cyber-authing',
          },
        });
        menuState.treeData = disposeMenuTree(res.data || []);
        emit('fetch', menuState.treeData);
      } catch(e) {
        throw Error(e)
      }
    }
    function disposeMenuTree(list) {
      return list.map(item => {
        item.treeIcon = item.icon;
        item.icon = undefined;
        if(item.children?.length) {
          item.children = disposeMenuTree(item.children);
        }
        return item;
      });
    };
    function disposeCheckTree(id, node, checkedSet, checked = false) {
      if(node.id == id || checked) {
        checkedSet.add(node.id);
        (node?.children || []).forEach(item => disposeCheckTree(id, item, checkedSet, true));
        return true;
      }
      if(!node.children?.length) return false;
      let some = node.children.some(item => disposeCheckTree(id, item, checkedSet));
      if(some) checkedSet.add(node.id);
      return some;
    }
    function disposeUnCheckTree(id, node, checkedSet, unChecked = false) {
      if(node.id == id || unChecked) {
        checkedSet.delete(node.id);
        (node.children || []).forEach(item => disposeUnCheckTree(id, item, checkedSet, true));
        return true;
      }
      if(!node.children?.length) return false;
      let flag = false;
      let hasChecked = false;
      node.children.some(item => {
        if(!flag) flag = disposeUnCheckTree(id, item, checkedSet);
        if(!hasChecked) hasChecked = checkedSet.has(item.id);
        return flag && hasChecked;
      });
      if(flag && !hasChecked) checkedSet.delete(node.id);
      return flag;
    }
    function onCheck(checkedKeys, {checked, checkedNodes, node, event} = {}) {
      if(props.disabled) {
        menuState.checkedKeys = props.value;
        return;
      }
      // console.log('onCheck', checkedKeys, {checked, checkedNodes, node, event});
      if(!checkedKeys.checked?.length) {
        emit('update:value', checkedKeys.checked || []);
        return;
      }
      let checkedSet = new Set(checkedKeys.checked);
      let parentNode = menuState.treeData.find(item => JSON.stringify(item).includes(`"${menuState.fieldNames.key}":"${node.id}"`));
      if(checked) disposeCheckTree(node.id, parentNode, checkedSet);
      else disposeUnCheckTree(node.id, parentNode, checkedSet)
      menuState.checkedKeys = Array.from(checkedSet);
      emit('update:value', menuState.checkedKeys);
    }

    watchEffect(() => searchQuery(props.isPersonal, props.productId));
    watchEffect(() => menuState.checkedKeys = props.value || []);
    
    expose({
      searchQuery: searchQuery,
    });
    return () => {
      const treeSlots = {
        icon({ treeIcon, selected }) {
          return treeIcon ? <Icon icon={treeIcon} size="14" /> : undefined
        }
      }
      return (
        <div class="cyber-menu-permission">
          {
            menuState.treeData?.length
              ? <ATree
                  block-node
                  height={props.height}
                  v-slots={treeSlots}
                  show-icon
                  checkable
                  checkStrictly
                  defaultExpandAll
                  selectable={false}
                  fieldNames={menuState.fieldNames}
                  v-model:checkedKeys={menuState.checkedKeys}
                  tree-data={menuState.treeData}
                  onCheck={onCheck}
                ></ATree>
              : <AEmpty></AEmpty>
          }
        </div>
      )
    }
  }
});
