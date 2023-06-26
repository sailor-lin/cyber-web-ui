import Dayjs from 'dayjs'

const dayjs = Dayjs;
/** 
 * @function getTargetTime: 获取指定时间
 * @param {number} day 单位为天，0为当天，负数为今天之前，正数为今天之后，默认为当天
 * @param {string} format 返回数据格式，不传则返回dayjs数据格式
 * @returns {dayjs | string}
 */
dayjs.getTargetTime = (day = 0, format) => {
  let today = new Date().getTime()
  let interval = today + 1000 * 60 * 60 * 24 * day
  if (format) {
    return dayjs(new Date(interval)).format(format)
  } else {
    return dayjs(new Date(interval))
  }
}
/** 
 * @function 格式化为dayjs时间格式
 * @param {array | string} date 字符串/字符串数组
 * @returns {dayjs}
 */
dayjs.getDayjsTime = (date) => {
  if (Array.isArray(date)) {
    return date.map((item) => {
      return dayjs(item);
    });
  }
  return dayjs(date)
}

// 将时间转为ISO8601格式
// dayjs().toISOString();

/**
 * @function 获取时间差
 * @param {string | number} firstTime 开始时间
 * @param {string | number} lastTime 结束时间
 * @param {string} type 时间类型
 * @returns {string}
 */
dayjs.getTimeDifference = (firstTime, lastTime, type = 'minute') => {
  let firstTimestamp = new Date(firstTime).getTime();
  let lastTimestamp = new Date(lastTime).getTime();
  let timeDifference = lastTimestamp - firstTimestamp;

  let year = Math.floor(timeDifference / 1000 / 60 / 60 / 24 / 365);
  let month = Math.floor(timeDifference / 1000 / 60 / 60 / 24 / 30);
  let day = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
  let hour = Math.floor(timeDifference / 1000 / 60 / 60);
  let minute = Math.floor(timeDifference / 1000 / 60 % 60);

  if(year > 0 || type == 'year') return `${year}年`;
  if(month > 0 || type == 'month') return `${month}月`;
  if(day > 0 || type == 'day') return `${day}天`;
  if(hour > 0 || type == 'hour') return `${hour}小时`;
  return `${minute}分钟`;
}
/**
 * @function 获取耗时
 * @param {string | number} firstTime 开始时间
 * @param {string | number} lastTime 结束时间
 * @returns {string}
 */
dayjs.getTimeConsuming = (firstTime, lastTime) => {
  if(!firstTime || !lastTime) return '';
  let firstTimestamp = new Date(firstTime).getTime();
  let lastTimestamp = new Date(lastTime).getTime();
  let timeConsuming = lastTimestamp - firstTimestamp;

  let year = Math.floor(timeConsuming / 1000 / 60 / 60 / 24 / 365);
  let month = Math.floor(timeConsuming / 1000 / 60 / 60 / 24 / 30 % 12);
  let day = Math.floor(timeConsuming / 1000 / 60 / 60 / 24 % 30);
  let hour = Math.floor(timeConsuming / 1000 / 60 / 60 % 24);
  let minute = Math.floor(timeConsuming / 1000 / 60 % 60);
  let second = Math.floor(timeConsuming / 1000 % 60);

  let string = '';

  if(year > 0) string = `${string}${year}年`;
  if(month > 0) string = `${string}${month}月`;
  if(day > 0) string = `${string}${day}天`;
  if(hour > 0) string = `${string}${hour}小时`;
  if(minute > 0) string = `${string}${minute}分钟`;
  if(second > 0) string = `${string}${second}秒`;
  return string;
}

export default dayjs