import axios from '../_utils/api';
import { useDict } from '../_utils/dict';
import { changeHistoryState, initHistoryState } from '../_utils/history';
import { defineComponent, reactive, computed, watchEffect } from 'vue';
import Icon from '../icon';
import TreeBody from './TreeBody';
import { Tree as ATree, Empty as AEmpty } from 'ant-design-vue';

export default defineComponent({
  name: 'CProductTree',
  props: {
    value: String,
    fieldNames: Object,
    // 是否为用户的权限应用列表
    isPersonal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { PRODUCT_TYPE } = useDict({ COMMON: ['PRODUCT_TYPE'] })
    const productState = reactive({
      treeData: [],
      parentId: undefined,
      selectedKeys: [],
      expandedKeys: [],
      fieldNames: computed(() => {
        return { title: 'name', key: 'id', ...(props.fieldNames || {}) };
      }),
    });

    async function searchQuery() {
      productState.treeData = (PRODUCT_TYPE.value || []).map(item => {
        return { id: item.value, name: item.label, type: 'productType', selectable: false };
      });

      // 当前选中
      let target = undefined;
      let productId = undefined;
      if(props.value && productState.parentId) {
        productId = props.value;
        target = productState.treeData.find(item => {
          return item.id == productState.parentId;
        });
      } else {
        productState.parentId = '0';
      }
      if(!target) {
        productId = undefined;
        target = productState.treeData.find(item => {
          return item.id == '0';
        });
      }

      await onLoadData(target);
      productState.expandedKeys = [target.id];
      let findChild = (target.children || []).find(item => {
        if(productId) return item.id == productId;
        else return item.code == 'cyber-personal';
      });
      if(findChild) {
        productState.selectedKeys = [findChild.id];
        emit('update:value', findChild.id);
        emit('change', findChild, target);
        return;
      }
      
      productState.selectedKeys = [];
      emit('update:value', undefined);
      productState.parentId = undefined;
    }
    function onSelect(selectedKeys, {selected, selectedNodes, node, event}) {
      // console.log('onSelect', selectedKeys, {selected, selectedNodes, node, event})
      emit('update:value', node.id);
      productState.parentId = node.parentId;
      changeHistoryState({ type: productState.parentId });
      if(selected) {
        emit('change', node, node.parent.node);
      } else {
        productState.selectedKeys = [props.value];
      }
    }
    function onExpand(expandedKeys, {expanded: bool, node}) {
      productState.expandedKeys = expandedKeys;
    }
    function onLoadData(treeNode) {
      // console.log('onLoadData', treeNode)
      return new Promise(async (resolve, reject) => {
        if (treeNode?.dataRef?.children) {
          resolve();
          return;
        }
        try {
          let res = await axios.request({
            url: props.isPersonal ? '/personal/permission/product' : '/system/product/tree',
            method: 'get',
            params: {
              type: treeNode.id,
            },
            headers: {
              'X-Project-Code': props.isPersonal ? 'cyber-personal' : 'cyber-system',
            },
          });
          // console.log('res', res, treeNode);
          let children = (res.data || []).map(item => {
            return { ...item, isLeaf: true, type: 'product', icon: undefined, treeIcon: item.icon }
          });
          if(treeNode?.dataRef?.children) {
            treeNode.dataRef.children = children
          } else {
            let index = productState.treeData.findIndex(item => {
              return item.id == treeNode.id;
            });
            productState.treeData[index].children = children;
          }
          productState.treeData = [...productState.treeData];
          resolve();
        } catch(e) {
          reject();
          if(e) throw Error(e);
        }
      });
    }

    productState.parentId = initHistoryState({ type: undefined }).type;
    watchEffect(() => {
      productState.selectedKeys = [props.value];
    });
    watchEffect(() => {
      if(PRODUCT_TYPE.value?.length) setTimeout(searchQuery);
    });
    return () => {
      const treeBodySlots = {
        ...slots,
        header: () => {
          return slots.header?.() || '应用列表'
        },
        default: () => {
          const treeSlots = {
            icon({ treeIcon, selected }) {
              return treeIcon ? <Icon icon={treeIcon} size="14" /> : undefined
            }
          }
          return <>
            {
              productState.treeData?.length
                ? <ATree
                    block-node
                    height={650}
                    v-slots={treeSlots}
                    show-icon
                    fieldNames={productState.fieldNames}
                    v-model:selectedKeys={productState.selectedKeys}
                    v-model:expandedKeys={productState.expandedKeys}
                    tree-data={productState.treeData}
                    onSelect={onSelect}
                    onExpand={onExpand}
                    load-data={onLoadData}
                  ></ATree>
                : <AEmpty></AEmpty>
            }
          </>
        }
      }

      return (
        <TreeBody v-slots={treeBodySlots}></TreeBody>
      )
    }
  }
});
