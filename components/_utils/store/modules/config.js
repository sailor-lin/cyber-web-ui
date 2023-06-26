import { defineStore } from 'pinia';
import axios from '../../api';
import { analysisPath } from '../../history';
import isWindows from '../../is-windows';
import { IS_SYSTEM_CONFIG, COPYRIGHT, HOME_PATH, TOOLS, LOGIN_PATH, LOGIN_LOGO, LAYOUT_LOGO, LOGIN_BACKGROUND } from '../../config';
const CONFIG_STORE = "CONFIG_STORE";

/**
 * @function analysisVariate 解析并替换系统配置项中的变量
 * @param {String} str 要替换的系统配置项 
 * @returns {String}
 */
export function analysisVariate(str) {
  const $configStore = configStore();
  if(!str) return str;
  return str.split('$$').map((value, index) => {
    if(index % 2 === 0) return value;
    console.log(value, $configStore.variate[value])
    return $configStore.variate[value] || $configStore.config[value] || `$$${value}$$`
  }).join('');
}

// 维护公共状态
const configStore = defineStore({
  id: CONFIG_STORE,  // 命名，唯一
  persist: {
    enabled: false,
    key: CONFIG_STORE,
  },
  state: () => ({
    config: {},
    variate: {
      'origin': isWindows() ? window.location.origin : '',
    },
    isAcquire: false,
  }),
  getters: {
    copyright: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.COPYRIGHT : COPYRIGHT),
    homePath: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.HOME_PATH : HOME_PATH),
    tools: (state) => {
      try {
        let list = JSON.parse(analysisVariate(IS_SYSTEM_CONFIG ? state.config?.TOOLS : TOOLS));
        if(!list?.length) throw Error;
        return list.map(item => {
          if(typeof item.disabled != 'boolean') item.disabled = false;
          if(typeof item.show != 'boolean') item.show = true;
          if(item.handler) item.handler = new Function(`return (${item.handler})()`);
          if(!item.href) item.href = 'javascript:;';
          else item.href = analysisPath(item.href);
          if(!item.target) item.target = "_self";
          return item;
        }).filter(item => item.show);
      } catch(error) {
        console.log('error', error);
        return [];
      }
    },
    loginLogo: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.LOGIN_LOGO : LOGIN_LOGO),
    layoutLogo: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.LAYOUT_LOGO : LAYOUT_LOGO),
    loginPath: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.LOGIN_PATH : LOGIN_PATH),
    loginBackground: (state) => analysisVariate(IS_SYSTEM_CONFIG ? state.config?.LOGIN_BACKGROUND : LOGIN_BACKGROUND),
  },
  actions: {
    async getProductConfig() {
      try {
        let res = await axios.request({
          url: `/system/open/sysconfig/configKeyValue`,
          method: 'get',
        });
        this.config = res.data || {};
      } catch(error) {
        this.config = {};
      }
      this.isAcquire = true;
    }
  }
});

export default configStore;
