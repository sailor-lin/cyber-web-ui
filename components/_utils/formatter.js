/**
 * @function 转换input值的格式
 * @param {string|number} value 值
 * @param {'iinteger'|'number'} type 要转换的类型
 * @returns {string}
 */
export const inputFormat = (value, type = 'number') => {
  // 数字（整数）
  if(type == 'integer' && !/^\-?\d*$/.test(value)) {
    let string = '';
    let isMinus = /^-/.test(value);
    (value + '').split('').forEach((item) => {
      string += item.replace(/[^\d]/g, '');
    })
    return (isMinus ? '-' : '') + string;
  }
  // 数字（包含小数）
  if(type == 'number' && !/^\-?((0|[1-9]\d*)\.)?\d*$/.test(value)) {
    let string = '';
    let isMinus = /^-/.test(value);
    (value + '').replace(/。/g, '.').split('.').forEach((item, index, list) => {
      string += item.replace(/[^\d]/g, '');
      if(index == 0 && list.length > 1) {
        if(!string) string = '0';
        string += '.';
      }
    });
    return (isMinus ? '-' : '') + string;
  }
  return value;
}