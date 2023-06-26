import { defineStore } from 'pinia';

const DICTIONARIES_STORE = "DICTIONARIES_STORE";
const DEFAULT_LABEL = "name"; // 默认label
const DEFAULT_VALUE = "code"; // 默认value

// 公共的字典状态
const dictStore = defineStore({
  id: DICTIONARIES_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: DICTIONARIES_STORE,
  },
  state: () => ({
    requestInterception: {},
  }),
  getters: {},
  actions: {
    /**
     * @function setDict 设置字典数据
     * @param {String} dictGroupCode 字典组code
     * @param {String} dictTypeCode 字典类型code
     * @param {Array} list 数据列表
     * @param {{ label: String, value: String } | undefined} options 字典配置项：label, value
     */
    setDict(dictGroupCode, dictTypeCode, list, options) {
      let { label = DEFAULT_LABEL, value = DEFAULT_VALUE } = (options || {});
      if(!this[dictGroupCode]) this[dictGroupCode] = {};
      this[dictGroupCode][dictTypeCode] = (list || []).map(item => {
        return {
          ...item,
          label: item[label],
          value: item[value],
        }
      });
    },
  }
});

export default dictStore;