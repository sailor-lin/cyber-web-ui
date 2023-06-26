import { stringKeyToArray, getTargetBykey } from '@/utils/dispose';

/**
 * @function 字符串排序
 * @param {array} dataSource 表格数据
 * @param {boolean} isAsc 是否升序
 * @param {string} key 文本key值
 * @returns {array}
 */
export const stringSort = (dataSource, isAsc, key) => {
  let list = [];
  let sortList = [];
  (dataSource || []).forEach(item => {
    let keys = stringKeyToArray(key, true);
    let text = getTargetBykey(item, keys) || '';
    let code = /^[a-zA-Z].*/.test(text) ? text.charCodeAt() : 0;
    if (code >= 97) code -= 96;
    if (code >= 65) code -= 64;
    if(list[code]) list[code].push(item);
    else list[code] = [item];
  })
  list.forEach(item => {
    if(item) sortList = [...sortList, ...item];
  })
  return isAsc ? sortList : sortList.reverse();
}

/** 
 * @function 数字排序
 * @param {array} dataSource 表格数据
 * @param {boolean} isAsc 是否升序
 * @param {string} key 文本key值
 * @returns {array}
 */
export const numberSort = (dataSource, isAsc, key) => {
  let keys = stringKeyToArray(key, true);
  let list = (dataSource || []).sort((a, b) => {
    let num1 = getTargetBykey(a, keys) || 0;
    let num2 = getTargetBykey(b, keys) || 0;
    return num1 - num2;
  })
  return isAsc ? list : list.reverse();
}

/** 
 * @function 时间排序
 * @param {array} dataSource 表格数据
 * @param {boolean} isAsc 是否升序
 * @param {string} key 文本key值
 * @returns {array}
 */
export const timeSort = (dataSource, isAsc, key) => {
  let keys = stringKeyToArray(key, true);
  let list = (dataSource || []).sort((a, b) => {
    let time1 = new Date(getTargetBykey(a, keys));
    time1 = time1 == 'Invalid Date' ? 0 : time1.getTime();
    let time2 = new Date(getTargetBykey(b, keys));
    time2 = time2 == 'Invalid Date' ? 0 : time2.getTime();
    return time1 - time2;
  })
  return isAsc ? list : list.reverse();
}

/** 
 * @function 资源排序
 * @param {array} dataSource 表格数据，只做相同单位排序，不换算
 * @param {boolean} isAsc 是否升序
 * @param {string} key 文本key值
 * @returns {array}
 */
export const metricsSort = (dataSource, isAsc, key) => {
  let keys = stringKeyToArray(key, true);
  let list = (dataSource || []).sort((a, b) => {
    let num1 = Number((getTargetBykey(a, keys) || '0').replace(/[a-zA-Z]*$/g, ''));
    let num2 = Number((getTargetBykey(b, keys) || '0').replace(/[a-zA-Z]*$/g, ''));
    num1 = isNaN(num1) ? 0 : num1;
    num2 = isNaN(num2) ? 0 : num2;
    return num1 - num2;
  })
  return isAsc ? list : list.reverse();
}
