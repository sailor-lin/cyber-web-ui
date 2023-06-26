import { defineStore } from 'pinia';
const MAINTAIN_STORE = "MAINTAIN_STORE";

// 维护公共状态
const maintainStore = defineStore({
  id: MAINTAIN_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: MAINTAIN_STORE,
  },
  state: () => {
    return {
      // 统一resize对象，key为Symbol，value为Function
      resizeState: {},
      leaveIntercept: false, // 是否开启beforeRouteLeave拦截
      reloadIntercept: false, // 是否开启reload拦截
    }
  },
  getters: {},
  actions: {}
});

export default maintainStore;