import Big from './big.js';

/**
 * @param {string} method 要调用的方法 
 * @param {string|number} num1 第一个参数
 * @param {string|number|string[]|number[]} num2 
 */
const bigjs = (method, num1, num2) => {
  // 没有该方法
  if(!new Big(1)[method]) {
    throw Error(`${method} is not a function`);
  }
  if(!/^plus$|^minus$|^times$|^div$/.test(method)) {
    // 调用自定义方法
    if(bigjs[method]) return bigjs[method](num1, num2);
    // 没有该方法
    else {
      throw Error(`${method} is not a function`);
    }
  }
  // 计算数值
  let sum = new Big(bigjs.disposeValue(num1));
  num2 = bigjs.disposeValue(num2);
  if(Array.isArray(num2)) {
    num2.forEach(item => {
      sum = sum[method](new Big(item));
    });
  } else {
    sum = sum[method](new Big(num2));
  }
  return sum.toNumber();
};
/**
 * @function disposeValue 处理数据
 * @param {any} target 要处理的数据 
 */
bigjs.disposeValue = (target) => {
  if(typeof target == 'number') return target;
  if(Array.isArray(target)) {
    return target.map(item => bigjs.disposeValue(item));
  } else {
    target = Number(target);
    return isNaN(target) ? 0 : target;
  }
}
/**
 * @function plus 加法
 * @param {string|number} num1 第一个参数
 * @param {string|number|string[]|number[]} num2 第二个参数，可以传数组
 */
bigjs.plus = (num1, num2) => {
  return bigjs('plus', num1, num2);
}
/**
 * @function minus 减法
 * @param {string|number} num1 第一个参数
 * @param {string|number|string[]|number[]} num2 第二个参数，可以传数组
 */
bigjs.minus = (num1, num2) => {
  return bigjs('minus', num1, num2);
}
/**
 * @function times 乘法
 * @param {string|number} num1 第一个参数
 * @param {string|number|string[]|number[]} num2 第二个参数，可以传数组
 */
bigjs.times = (num1, num2) => {
  return bigjs('times', num1, num2);
}
/**
 * @function div 除法
 * @param {string|number} num1 第一个参数
 * @param {string|number|string[]|number[]} num2 第二个参数，可以传数组
 */
bigjs.div = (num1, num2) => {
  return bigjs('div', num1, num2);
}
/**
 * @function pow 幂运算
 * @param {string|number} num1 第一个参数
 * @param {number} num2 第二个参数，需要传正整数
 */
bigjs.pow = (num1, num2) => {
  return new Big(bigjs.disposeValue(num1)).pow(num2).toNumber();
}

export default bigjs;