import { defineStore } from 'pinia';
import { stringKeyToArray, getTargetBykey } from '@/utils/dispose';

const DICTIONARIES_STORE = "DICTIONARIES_STORE";
const DEFAULT_LABEL = "label"; // 默认label
const DEFAULT_value = "value"; // 默认value
const dictKey = {
  namespace: {
    label: `label`,
    value: `value`
  }
}
// $patch
// storeToRefs
// 公共的字典状态
const dictStore = defineStore({
  id: DICTIONARIES_STORE,  // 命名，唯一
  persist: {
    enabled: true,
    key: DICTIONARIES_STORE,
    strategies: [
      { storage: window.localStorage }
    ],
  },
  state: () => {
    return {
      // 命名空间
      namespace: [],
      // 集群
      cluster: [
        { label: 'edgeblock1', value: 'edgeblock1' }
      ],
    }
  },
  getters: {},
  actions: {
    /**
     * @function 更新数据
     * @param {string} name 字典名称
     * @param {array} list 数据列表
     * @param {object | undefined} options 要保存的label和value
     */
    update(name, list, options) {
      let { label = DEFAULT_LABEL, value = DEFAULT_value } = (options || dictKey[name] || {});
      label = stringKeyToArray(label, true);
      value = stringKeyToArray(value, true);
      this[name] = (list || []).map(item => {
        return {
          ...item,
          label: getTargetBykey(item, label),
          value: getTargetBykey(item, value),
        }
      });
    },
    /**
     * @function 获取解析字典数据
     * @param {string | array} target 要解析的字典，可传数组或字符串，字符串用逗号隔开
     * @param {string} targetKey object的key值，默认为vlaue
     * @returns {object}
     */
    parse(target, targetKey = 'value') {
      let obj = {};
      if(typeof target == 'string' && target) {
        target = target.split(',').map(item => (item || '').trim()).filter(item => item);
      }
      if(Array.isArray(target) && target.length) {
        target.forEach(key => {
          obj[key] = {};
          this[key]?.forEach((item) => {
            obj[key][item[targetKey]] = {
              ...item
            };
          })
        })
      }
      return obj;
    },
  }
});

export default dictStore;