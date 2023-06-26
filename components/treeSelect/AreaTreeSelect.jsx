import { defineComponent, reactive, watch, watchEffect, ref, computed } from 'vue';
import TreeSelect from './TreeSelect';
import axios from '../_utils/api';

export default defineComponent({
  name: 'CAreaTreeSelect',
  props: {
    value: String,
    level: {
      type: [String, Number],
      default: '5',
      validator: (value) => /^[1-5]$/.test(value),
    },
    fieldNames: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const treeRef = ref();
    const areaState = reactive({
      value: undefined,
      treeData: [],
      fieldNames: computed(() => {
        return { label: props.disabled ? 'wholeName' : 'name', value: 'id', ...props.fieldNames, children: 'children' };
      }),
      treeExpandedKeys: [],
    });

    async function searchQuery() {
      areaState.treeData = await queryArea();
    }
    function queryArea(level = '1', parentId = '0') {
      return new Promise(async (resolve) => {
        try {
          let res = await axios.request({
            url: '/basedata/area/select',
            method: 'get',
            params: {
              level: level,
              parentId: parentId,
              sortBy: 'per_pin_yin',
              sortType: 'asc',
            },
            headers: {
              'X-Project-Code': 'cyber-basedata',
            }
          });
          let result = (res.data || []).map(item => {
            let isLeaf = props.level == item.level;
            return { ...item, selectable: isLeaf, isLeaf: isLeaf, wholeName: item.wholeName.replaceAll('，', '/') };
          });
          resolve(result);
        } catch(error) {
          resolve([]);
          throw Error(error);
        }
      });
    }
    function onLoadData(treeNode) {
      return new Promise(async (resolve, reject) => {
        if (treeNode?.dataRef?.children) return resolve();
        try {
          let children = await queryArea(treeNode.level + 1, treeNode.id);
          if(treeNode?.dataRef) {
            treeNode.dataRef.children = children;
          } else {
            treeNode.children = children;
          }
          areaState.treeData = [...areaState.treeData];
          resolve();
        } catch(e) {
          reject();
          if(e) throw Error(e);
        }
      });
    }
    function onChange(value, label, extra) {
      emit('update:value', value);
      emit('change', value, label, extra);
    }
    async function reverseLoading(level, value) {
      let reg = new RegExp(`"id":"${value}"`);
      if(!value || reg.test(JSON.stringify(areaState.treeData))) return;
      let treeExpandedKeys = [];
      let children = [];
      while(level > 1) {
        let { data: result = {} } = await axios.request({
          url: '/basedata/area',
          method: 'get',
          params: { id: value },
        });
        if(!result.id) level = 0;
        let list = await queryArea(result.level, result.parentId);
        if(!list.length) level = 0;
        treeExpandedKeys.push(result.id);
        level--;
        value = result.parentId;
        list.some((item, index) => {
          if(item.id == result.id) list[index].children = children;
        });
        children = list;
      }
      if(level = 0) return;
      areaState.treeData.some((item, index) => {
        if(item.id == value) {
          areaState.treeData[index].children = children;
          treeExpandedKeys.push(item.id);
        }
      });
      areaState.treeData = [...areaState.treeData];
      areaState.treeExpandedKeys = [...treeExpandedKeys];
    }

    watch(() => props.level, () => {
      areaState.treeLoadedKeys = [];
      areaState.treeExpandedKeys = [];
      searchQuery();
    }, { immediate: true });
    watch(() => props.value, (value) => {
      areaState.value = value;
    }, { immediate: true });
    watchEffect(() => {
      if((props.value && props.value != '0') && areaState.treeData?.length) {
        reverseLoading(props.level, props.value);
      }
    });

    expose({
      searchQuery: searchQuery,
    });
    return () => {
      const treeSelectSlots = {
        suffixIcon: props.disabled ? () => {} : undefined,
        ...slots,
      }
      return (
        <TreeSelect
          ref={treeRef}
          v-model:value={areaState.value}
          field-names={areaState.fieldNames}
          tree-data={areaState.treeData}
          load-data={onLoadData}
          v-model:treeExpandedKeys={areaState.treeExpandedKeys}
          treeLoadedKeys={areaState.treeLoadedKeys}
          onChange={onChange}
          disabled={props.disabled}
          {...{ ...attrs, "onUpdate:value": undefined }}
          v-slots={treeSelectSlots}
        ></TreeSelect>
      )
    }
  }
});
