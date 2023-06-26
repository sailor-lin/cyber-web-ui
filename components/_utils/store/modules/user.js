import { defineStore } from 'pinia';
import { setToken, removeToken } from '../../field-access';
import axios from '../../api';
import { API_URL, PWD_ENC_KEY } from '../../config';
import { encryption } from '../../crypto';

const USERIONARIES_STORE = "USERIONARIES_STORE";

// 公共的字典状态
const userStore = defineStore({
  id: USERIONARIES_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: USERIONARIES_STORE,
  },
  state: () => ({
    info: {},
  }),
  getters: {
    name: (state) => state.info?.name,
    userName: (state) => state.info?.userName,
    avatar: (state) => {
      if(!state.info?.avatar) return;
      return `${API_URL}personal/open/view/${state.info?.avatar}`
    },
  },
  actions: {
    login(data) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await axios.request({
            url: '/auth/login',
            method: 'post',
            data: encryption({
              data: data,
              param: ['password'],
              key: PWD_ENC_KEY,
            }),
            interceptErrorMessages: true,
            headers: {
              'X-Project-Code': 'cyber-authing'
            },
          });
          setToken(res.data?.access_token);
          resolve();
        } catch(error) {
          reject(error);
        }
      });
    },
    logout() {
      return new Promise(async (resolve) => {
        try {
          await axios.request({
            url: '/auth/logout',
            method: 'delete',
            interceptErrorMessages: true,
            headers: {
              'X-Project-Code': 'cyber-authing'
            },
          });
        } catch {}
        removeToken();
        this.info = {};
        resolve();
      })
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        axios.request({
          url: `/personal/user/profile`,
          method: 'get',
          interceptErrorMessages: true,
          headers: {
            'X-Project-Code': 'cyber-personal'
          },
        }).then(res => {
          this.info = res.data || {};
          resolve(res.data);
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
});

export default userStore;