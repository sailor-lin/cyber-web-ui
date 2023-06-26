import { defineStore } from 'pinia';
const MAINTAIN_STORE = "MAINTAIN_STORE";

// 维护公共状态
const maintainStore = defineStore({
  id: MAINTAIN_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: MAINTAIN_STORE,
  },
  state: () => ({
    // 统一resize对象，key为Symbol，value为Function
    resizeState: {},
    leaveIntercept: false, // 是否开启beforeRouteLeave拦截
  }),
  getters: {},
  actions: {
    /**
     * @function setResize 添加统一重置
     * @param {Symbol} key 
     * @param {Function} callback 回调函数
     */
    setResize(key, callback) {
      if(key) {
        this.resizeState[key] = callback;
      }
    },
    /**
     * @function removeResize 删除重置属性
     * @param {Symbol} key
     */
    removeResize(key) {
      if(key) {
        delete this.resizeState[key];
      }
    },
  }
});

export default maintainStore;
