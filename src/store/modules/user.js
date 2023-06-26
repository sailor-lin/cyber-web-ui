import { defineStore } from 'pinia';
const USER_STORE = "USER_STORE";

// 保存用户的操作状态
const userStore = defineStore({
  id: USER_STORE,  // 命名，唯一
  persist: {
    enabled: true,
    key: USER_STORE,
    strategies: [
      { storage: window.localStorage }
    ],
  },
  state: () => {
    return {
      namespace: 'cmp',
      cluster: 'edgeblock1',
    }
  },
  getters: {},
  actions: {}
});

export default userStore;