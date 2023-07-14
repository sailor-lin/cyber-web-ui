import TreeSelect from './TreeSelect';
import { TreeSelect as ATreeSelect } from 'ant-design-vue';
import { defineComponent, getCurrentInstance, reactive, watchEffect, watch } from 'vue';

export default defineComponent({
  name: 'CEnterpriseTreeSelect',
  props: {
    // 企业
    value: [String, Array],
    enterprise: String,
    multiple: {
      type: Boolean,
      default: false,
    },
    fieldNames: {
      type: Object,
      default: () => {}
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { proxy } = getCurrentInstance();
    const enterpriseState = reactive({
      value: undefined,
      enterprise: undefined,
      treeData: [],
    });
    async function querySelect() {
      try {
        let res = await proxy.$axios.request({
          url: '/dept/enterprise/tree',
          method: 'get',
        });
        enterpriseState.treeData = res.data || [];
      } catch(e) {
        throw Error(e)
      }
    };

    function onChange(value, label, extra) {
      enterpriseState.value = value;
      emit('update:value', value);
      emit('change', value, label, extra);
    };

    function getSelectEnterprise (deptId, oldDeptId) {
      if(!enterpriseState.treeData?.length) return;
      let { value = 'id' } = (props.fieldNames || {});
      // 单选
      if(!props.multiple) {
        let find = enterpriseState.treeData.find(item => JSON.stringify(item).includes(`"${value}":"${deptId}"`));
        return find?.[value];
      }
      // 清空多选
      if(!deptId?.length) {
        enterpriseState.treeData.forEach(item => disableHandler(item, false));
        return;
      }
      // 已选择多选
      deptId = deptId[0];
      let enterprise = '';
      let isSelect = false;
      enterpriseState.treeData.forEach(item => {
        if(!isSelect) {
          isSelect = JSON.stringify(item).includes(`"${value}":"${deptId}"`);
          disableHandler(item, !isSelect);
          if(isSelect) {
            enterprise = item[value];
          }
        } else {
          disableHandler(item, true);
        }
      });
      return enterprise;
    };

    function disableHandler(target, disabled) {
      if(Array.isArray(target)) {
        target.forEach(item => disableHandler(item, disabled));
      } else {
        let { children = 'children' } = (props.fieldNames || {});
        target.disabled = disabled;
        if(Array.isArray(target[children])) disableHandler(target[children], disabled);
      }
    };

    querySelect();
    watchEffect(() => {
      enterpriseState.value = props.value;
    });
    watch(() => [enterpriseState.value, enterpriseState.treeData, props.multiple], ([value] = [], [prevValue] = []) => {
      enterpriseState.enterprise = getSelectEnterprise(value, prevValue);
    }, { immediate: true, deep: true });
    watch(() => enterpriseState.enterprise, (value, oldValue) => {
      if(JSON.stringify(value || '') != JSON.stringify(oldValue)) {
        emit('update:enterprise', enterpriseState.enterprise);
        emit('enterpriseChange', enterpriseState.enterprise);
      }
    });
    
    expose({
      querySelect: querySelect,
    });
    return () => {
      return (
        <TreeSelect
          placeholder="请选择"
          {...{ ...attrs, 'onUpdate:value': undefined }}
          multiple={props.multiple}
          v-slots={slots}
          v-model:value={enterpriseState.value}
          tree-data={enterpriseState.treeData}
          fieldNames={{
            label: 'name',
            value: 'id',
            children: 'children',
            ...props.fieldNames,
          }}
          onChange={onChange}
          showCheckedStrategy={ATreeSelect.SHOW_ALL}
        ></TreeSelect>
      )
    }
  },
});
