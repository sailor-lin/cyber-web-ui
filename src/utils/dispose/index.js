import CryptoJS from "crypto-js"
import { createVNode } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { maintainStore } from '@/store';
import GInput from '@/components/global/input/g-input.vue';
import GModal from '@/components/global/modal/g-modal.jsx';

/**
* @function base64加密方法
* @param {string} str 明文字符串
* @return {string}
*/
export const encryptToBase64 = (str) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

/**
* @function base64解密方法
* @param {string} str 加密字符串
* @returns {string}
*/
export function base64Decrypt(str) {
  return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8);
}

/**
 * @function 更改路由参数不刷新页面
 * @param {object} query 路由参数
 * @param {boolean} cover 是否覆盖原有参数
 * @param {boolean} replace 是否调用replaceState方法
 */
export function changeHistoryState(query = {}, cover = false, replace = true) {
  let key = 'pushState';
  if(replace) key = 'replaceState';
  let { url, params } = analysisHistory(window.location.href);
  let flag = true;
  let obj = {
    ...query
  };
  // 遍历参数
  Object.keys(obj).forEach(key => {
    // 判断是否为数组，并做处理
    if(Array.isArray(obj[key])) {
      obj[key] = obj[key].join(',');
      if(obj[key] != params[key]) {
        flag = false;
      }
      if(!obj[key]) {
        delete params[key]
        delete obj[key]
      }
    } else if(params[key] != obj[key]) {
      flag = false;
      // 若传入的参数有为空值，则删除路由对应参数
      if(!obj[key]) {
        delete params[key]
        delete obj[key]
      }
    }
  })
  // 重置页数
  if(!obj.pageNo && params.pageNo) {
    params.pageNo = 1;
  }
  // 若为不覆盖，并且参数全相等，则不跳转到新路由
  if(!cover && flag) return;
  url = url + jsonToSearch({
    ...(cover ? {} : params),
    ...obj,
  });
  // 统计返回层数
  let count = history.state?.go || -1;
  if(!replace) --count;
  window.history[key]({
    ...(history.state || {}),
    go: count,
    current: url.replace(/^#/, ''),
    position: (history.state.position || 1) + 1,
    previousPosition: history.state.previousPosition ? history.state.previousPosition : (history.state.position - 1 || 1),
  }, null, url);
}

/**
 * @function 将对象转成路由search参数
 * @param {object} obj 
 * @returns {string}
 */
export function jsonToSearch(obj) {
  let query = [];
  Object.keys(obj).forEach(key => {
    if(obj[key] || obj[key] == '0') query.push(`${key}=${obj[key]}`);
  });
  query = query.join('&');
  return query ? '?' + query : '';
}

/**
 * @function 将路由search参数转成对象
 * @param {string} str 
 * @returns {object}
 */
export function searchToJson(str) {
  let query = {};
  (str || '').replace(/^.*\?/, '').split('&').forEach(item => {
    let [key, value] = (item || '').split('=');
    if(key) query[key] = value;
  })
  return query;
}

/**
 * @function 返回上一个历史记录或指定路径
 * @param {string} url 指定路径
 */
export function historyBack(url) {
  let { back, current, forward, go, previousPosition, position } = history.state || {};
  if(back && back != current) url = back;
  /* 
    1、有history.state.back
    2、当前go次数少于50
    3、history.state.back 不等于当前路径
    4、当前页面的position与上一个页面的position相差少于49
    5、当前的history.length要大于go次数
   */
  if(back && (go && go > -50) && back != current && (position - (previousPosition || 1) <= 49) && history.length >= Math.abs(go)) {
    let count = go || -1;
    window.history.go(count);
  } else if (!go && history.length != 1 && back != current) {
    history.back();
  } else {
    if(new URL(window.location.href)?.hash) {
      url = /^#/.test(url) ? url : `#${url}`;
    } else {
      url = url.replace(/^#/, '');
    }
    window.location.href = url;
  }
}

/**
 * @function 解析指定历史，获取到解析后的数据
 * @param {string} url
 * @returns {object}
 */
export function analysisHistory(url) {
  const href = new URL(url || window.location.href);
  if(href.hash) {
    // hash路由
    // hash: '#/pods?type=1'
    return {
      url: href.hash.replace(/\?.*/, ''),
      params: searchToJson(href.hash),
    }
  } else {
    // history路由
    // search: '?page=2&pageSize=10'
    return {
      url: href.pathname,
      params: searchToJson(href.search),
    }
  }
}

/**
 * @function 初始化参数
 * @param {object} obj 需要初始化的参数
 * @param {string | undefined} url 地址
 * @returns {object}
 */
export function initHistoryParams(obj, url) {
  let { params } = analysisHistory(url || window.location.href);
  Object.keys(obj).forEach(key => {
    // 默认值为数组，对url的params值做转换
    if(Array.isArray(obj[key])) {
      obj[key] = params[key] ? params[key].split(',') : obj[key];
    }
    // 自定义类型配置，对url的params值做转换
    else if(Object.prototype.toString.call(obj[key]) === '[object Object]') {
      const { type = 'string', defaultValue } = obj[key];
      if(type == 'number') {
        obj[key] = /^\-?((0|[1-9]\d*)\.)?\d*$/.test(params[key]) ? Number(params[key]) : defaultValue;
      } else if(type == 'array') {
        obj[key] = params[key] ? params[key].split(',') : defaultValue;
      } else if(type == 'boolean') {
        obj[key] = params[key]
          ? params[key] == 'true' ? true : false
          : defaultValue;
      } else {
        obj[key] = params[key] || defaultValue;
      }
    }
    // 字符串类型
    else {
      obj[key] = params[key] || obj[key] || undefined;
    }
  });
  return obj;
}

/**
 * @function 生成随机数，包含小写字母和数字
 * @param {number} RandomcodeNumber 随机数数量，默认10位数
 * @returns {string}
 */
export function generateRandomCode(RandomcodeNumber = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charCount = chars.length;
  let randomString1 = '';
  for (let i = 0; i < RandomcodeNumber; i++) {
    const randomIndex = Math.floor(Math.random() * charCount);
    randomString1 += chars[randomIndex];
  }
  return randomString1
}

/**
 * @function 将string类型的key转为Array
 * @param {string} keys 
 * @param {boolean} replaceCircle 是否要包含替换点字符
 * @returns {array}
 */
export function stringKeyToArray(keys, replaceCircle = false) {
  if(typeof keys != 'string') return [];
  let target = keys.replace(/\?\.\[|\[/g, '#[');
  if(replaceCircle) target = target.replace(/\?\.|\./g, '#');
  return target.split('#').filter(item => item).map(item => {
    return item.replace(/^\[(\'|\")?|(\'|\")?\]$/g, '');
  });
}

/**
 * @function 获取object里的指定key的value，搭配stringKeyToArray，代替eval()
 * @param {obj | array} record 
 * @param {array} keys 
 * @returns {any}
 */
export function getTargetBykey(record, keys) {
  let target = record;
  keys.every(key => {
    target = target[key];
    return target
  })
  return target || undefined;
}

/**
 * @function 确认操作弹窗
 * @param {any} options 
 */
export function confirmModal(options = {}) {
  let value = '';
  const inputRef = createVNode(GInput, {
    onInput: ({ target }) => {
      value = target.value;
    },
    class: 'warning-input',
  });
  const {
    title,
    icon = 'icon-shanchu',
    content,
    okButtonProps = { pattern: 'error' },
    onOk
  } = options;
  GModal.confirm({
    title: title,
    icon: icon,
    iconProps: {
      isSvg: true,
      class: 'mr-10px',
    },
    content: createVNode('div', {}, [
      createVNode('div', {
        style: "margin-bottom: 12px"
      }, content),
      inputRef
    ]),
    okButtonProps: okButtonProps,
    onOk: () => onOk(value),
  })
}

/**
 * @function 离开页面确认操作弹窗
 */
export function leaveConfirmModal() {
  if(!maintainStore().leaveIntercept) return Promise.resolve();
  return new Promise((resolve, reject) => {
    GModal.confirm({
      title: `操作确认`,
      icon: 'icon-a-lujing5',
      iconProps: {
        isSvg: true,
        class: 'mr-10px',
      },
      content: h('div', {}, `确定离开当前页面吗？确认后系统不会保存您所做的更改!`),
      okButtonProps: {
        pattern: 'error',
      },
      onOk: () => {
        maintainStore().leaveIntercept = false;
        resolve(true);
      },
      onCancel: () => reject(false),
    });
  });
}
/**
 * @function 打开路由离开拦截
 */
export function openBeforeRouteLeave() {
  // 添加离开拦截
  maintainStore().leaveIntercept = true;
  let leaveTimeout = undefined;
  // 离开拦截
  onBeforeRouteLeave(async (to, form, next) => {
    leaveTimeout && clearTimeout(leaveTimeout);
    // 开启reload拦截
    maintainStore().reloadIntercept = true;
    try {
      // 离开页面确认操作弹窗
      await leaveConfirmModal();
      next();
      // 关闭reload拦截
      maintainStore().reloadIntercept = false;
    } catch {
      next(false);
      // 关闭reload拦截
      leaveTimeout = setTimeout(() => {
        maintainStore().reloadIntercept = false;
      }, 200);
    }
  });
}

/**
 * 
 * @param {string} url 
 * @param {string} name
    _blank - URL加载到一个新的窗口。这是默认
    _parent - URL加载到父框架
    _self - URL替换当前页面
    _top - URL替换任何可加载的框架集
    name - 窗口名称 
  * @param {string} specs
  * @param {boolean} replace
 */
export function browserOpen(url, name = "_blank", specs, replace = false) {
  if(new URL(window.location.href)?.hash) {
    url = /^#/.test(url) ? url : `#${url}`;
  } else {
    url = url.replace(/^#/, '');
  }
  window.open(url, name, specs, replace);
}
