import axios from './api';
import { dictStore } from './store';
import { ref, toRefs, watchEffect } from 'vue';

/**
 * @function useDict 获取字典数据
 * @param {Object} dicts { [字典组code]: ['字典类型code'] }
 * @param {Boolean} isAsync 是否同步获取字典数据
 * @returns {Object} 返回以 字典类型code 为key的对象
 */
export function useDict(dicts = {}, isAsync = false) {
  const $dictStore = dictStore();
  if(!isAsync) {
    const dictState = ref({});
    return (() => {
      Object.keys(dicts).forEach(dictGroupCode => {
        if(!dicts[dictGroupCode]?.length) return;
        dicts[dictGroupCode].filter(item => item).forEach(dictTypeCode => {
          dictState.value[dictTypeCode] = [];
          if ($dictStore[dictGroupCode]?.[dictTypeCode]?.length) {
            dictState.value[dictTypeCode] = $dictStore[dictGroupCode]?.[dictTypeCode] || [];
          } else if($dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`]) {
            watchEffect(() => {
              if(!$dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`]) {
                dictState.value[dictTypeCode] = $dictStore[dictGroupCode]?.[dictTypeCode] || [];
              }
            });
          } else {
            try {
              $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`] = true;
              axios.request({
                url: `/basedata/open/dict/data/${dictGroupCode}/${dictTypeCode}`,
                method: 'get',
              }).then(res => {
                $dictStore.setDict(dictGroupCode, dictTypeCode, res.data);
                dictState.value[dictTypeCode] = $dictStore[dictGroupCode]?.[dictTypeCode] || [];
                delete $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`];
              }).finally(() => {
                delete $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`];
              });
            } catch(error) {
              console.log('error', error);
            }
          }
        });
      });
      return toRefs(dictState.value);
    })();
  }
  return new Promise(async (resolve) => {
    const dictState = {};
    let promiseList = new Map();
    Object.keys(dicts).forEach(dictGroupCode => {
      if(!dicts[dictGroupCode]?.length) return;
      dicts[dictGroupCode].filter(item => item).forEach(dictTypeCode => {
        if ($dictStore[dictGroupCode]?.[dictTypeCode]?.length) {
          dictState[dictTypeCode] = $dictStore[dictGroupCode][dictTypeCode];
        } else {
          $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`] = true;
          promiseList.set(`${dictGroupCode}:${dictTypeCode}`, axios.request({
            url: `/basedata/open/dict/data/${dictGroupCode}/${dictTypeCode}`,
            method: 'get',
          }));
        }
      });
    });
    let list = await Promise.allSettled(Array.from(promiseList.values()));
    Array.from(promiseList.keys()).forEach((key, index) => {
      let [dictGroupCode, dictTypeCode] = key.split(':');
      let { status, value } = list[index];
      delete $dictStore.requestInterception[key];
      if(status != 'fulfilled') return dictState[dictTypeCode] = [];
      $dictStore.setDict(dictGroupCode, dictTypeCode, value?.data || []);
      dictState[dictTypeCode] = $dictStore[dictGroupCode]?.[dictTypeCode] || [];
    });
    resolve(dictState);
  });
}

/**
 * @function parseDict 解析字典数据
 * @param {Object} dicts { [字典组code]: ['字典类型code'] }
 * @param {Boolean} isAsync 是否同步获取字典数据
 * @param {{ label: String, value: String }} options 解析字典配置项：label,value
 * @returns {Object}  返回以 字典类型code + '_PARSE' 为key的对象
 */
export function parseDict(dicts = {}, isAsync = false, options) {
  const $dictStore = dictStore();
  const { label, value = 'code' } = (options || {});
  if(!isAsync) {
    const dictState = ref({});
    return (() => {
      Object.keys(dicts).forEach(dictGroupCode => {
        if(!dicts[dictGroupCode]?.length) return;
        dicts[dictGroupCode].filter(item => item).forEach(dictTypeCode => {
          dictState.value[`${dictTypeCode}_PARSE`] = {};
          if ($dictStore[dictGroupCode]?.[dictTypeCode]?.length) {
            ($dictStore[dictGroupCode]?.[dictTypeCode] || []).forEach(item => {
              if(!item[value]) return;
              dictState.value[`${dictTypeCode}_PARSE`][item[value]] = label ? item[label] : item;
            });
          } else if($dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`]) {
            watchEffect(() => {
              if(!$dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`]) {
                ($dictStore[dictGroupCode]?.[dictTypeCode] || []).forEach(item => {
                  if(!item[value]) return;
                  dictState.value[`${dictTypeCode}_PARSE`][item[value]] = label ? item[label] : item;
                });
              }
            });
          } else {
            try {
              $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`] = true;
              axios.request({
                url: `/basedata/open/dict/data/${dictGroupCode}/${dictTypeCode}`,
                method: 'get',
              }).then(res => {
                $dictStore.setDict(dictGroupCode, dictTypeCode, res.data);
                ($dictStore[dictGroupCode]?.[dictTypeCode] || []).forEach(item => {
                  if(!item[value]) return;
                  dictState.value[`${dictTypeCode}_PARSE`][item[value]] = label ? item[label] : item;
                });
              }).finally(() => {
                delete $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`];
              });
            } catch(error) {
              console.log('error', error);
            }
          }
        });
      });
      return toRefs(dictState.value);
    })();
  }
  return new Promise(async (resolve) => {
    const dictState = {};
    let promiseList = new Map();
    Object.keys(dicts).forEach(dictGroupCode => {
      if(!dicts[dictGroupCode]?.length) return;
      dicts[dictGroupCode].filter(item => item).forEach(dictTypeCode => {
        dictState[`${dictTypeCode}_PARSE`] = {};
        if ($dictStore[dictGroupCode]?.[dictTypeCode]?.length) {
          ($dictStore[dictGroupCode]?.[dictTypeCode] || []).forEach(item => {
            if(!item[value]) return;
            dictState[`${dictTypeCode}_PARSE`][item[value]] = label ? item[label] : item;
          });
        } else {
          $dictStore.requestInterception[`${dictGroupCode}:${dictTypeCode}`] = true;
          promiseList.set(`${dictGroupCode}:${dictTypeCode}`, axios.request({
            url: `/basedata/open/dict/data/${dictGroupCode}/${dictTypeCode}`,
            method: 'get',
          }));
        }
      });
    });
    let list = await Promise.allSettled(Array.from(promiseList.values()));
    Array.from(promiseList.keys()).forEach((key, index) => {
      let [dictGroupCode, dictTypeCode] = key.split(':');
      let { status, value: result } = list[index];
      delete $dictStore.requestInterception[key];
      if(status != 'fulfilled') return dictState[dictTypeCode] = [];
      $dictStore.setDict(dictGroupCode, dictTypeCode, result?.data || []);
      ($dictStore[dictGroupCode]?.[dictTypeCode] || []).forEach(item => {
        if(!item[value]) return;
        dictState[`${dictTypeCode}_PARSE`][item[value]] = label ? item[label] : item;
      });
    });
    resolve(dictState);
  });
}
