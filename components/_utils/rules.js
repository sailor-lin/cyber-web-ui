export const TRIGGER = ["blur", "change"];

// 手机号码
export const phoneRegExp = new RegExp(/^1[3456789]\d{9}$/);
// 电话号码
export const telephoneRegExp = new RegExp(/^((d{3,4})|d{3,4}-|s)?d{7,14}$/);
// 邮箱
export const emailRegExp = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
// 密码
export const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{5,32}$|^(?=.*[a-z])(?=.*[A-Z])(?=.*[~·!@#$%^&*()_+`'"\-={}\[\]:;<>?,./\\]).{5,32}$|^(?=.*[a-z])(?=.*[0-9])(?=.*[~·!@#$%^&*()_+`'"\-={}\[\]:;<>?,./\\]).{5,32}$|^(?=.*[A-Z])(?=.*[0-9])(?=.*[~·!@#$%^&*()_+`'"\-={}\[\]:;<>?,./\\]).{5,32}$/;

// required：必填
export const required = (message = '必填', trigger = TRIGGER) => {
  return {
    required: true,
    message: message,
    trigger: trigger,
  };
};


// phoneNumberFun：手机号验证
export const checkPhone = (message = '请输入正确的手机号码', trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if(!value || phoneRegExp.test(value)) return Promise.resolve();
      return Promise.reject(message);
    },
    trigger,
  };
};

// checkTelephone：电话号码验证
export const checkTelephone = (message = '请输入正确的电话号码', trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if (!value || telephoneRegExp.test(value)) return Promise.resolve();
      return Promise.reject(message);
    },
    trigger,
  };
};

// checkEmidal: 校验邮箱
export const checkEmail = (message = '请输入正确的邮箱地址', trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if (!value || emailRegExp.test(value)) return Promise.resolve();
      return Promise.reject(message);
    },
    trigger,
  };
};

// checkPassword: 校验密码
export const checkPassword = (checkValue) => {
  return {
    validator: (rule, value) => {
      if (!value) return Promise.resolve();
      if (value.length > 20) {
        return Promise.reject('密码的长度为5 ~ 20位');
      } else if (!passwordRegExp.test(value)) {
        return Promise.reject('密码长度 ≥ 5位，且至少要包含大小字母、数字与符号中的三种');
      } else if(checkValue && checkValue != value) {
        return Promise.reject('请输入一致的密码');
      }
      return Promise.resolve()
    },
    trigger: TRIGGER,
  }
}

// checkIPAddress: 校验ip地址
export const checkIPAddress = (trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if(!value) return  Promise.resolve();
      let list = value.split(".").map(item => Number(item));
      if(list.some(item => isNaN(item)))
        return Promise.reject('ip地址只能为数字');
      else if (list.some((item) => item < 0 || item > 255))
        return Promise.reject('ip地址取值范围为0 ~ 255');
      else if (list.length != 4)
        return Promise.reject('请输入正确的ip地址');
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// checkPort: 校验端口号
export const checkPort = (message, trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if(!value || /^[0-9]+$/.test(value) || parseInt(value) >= 65535) return Promise.resolve();
      return Promise.reject(message || '端口号的取值范围为：0 ~ 65535');
    },
    trigger,
  };
};

// checkLongitude 校验经度
export const checkLongitude = (message, trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if (!value || /^-?[0-9]+(\.[0-9]+)?$/.test(value) && value >= -180 && value <= 180) return Promise.resolve();
      return Promise.reject(message || '经度的取值范围为：-180 ~ 180');
    },
    trigger,
  };
};

// checkLatitude 校验纬度
export const checkLatitude = (message, trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if (!value || /^-?[0-9]+(\.[0-9]+)?$/.test(value) && value >= -90 && value <= 90) return Promise.resolve();
      return Promise.reject(message || '纬度的取值范围为：-90 ~ 90');
    },
    trigger,
  };
};

// checkCode 校验编码
export const checkCode = (message, trigger = TRIGGER) => {
  return {
    validator: (rule, value) => {
      if (!value) return Promise.resolve();
      if (/^\s|\s$/.test(value)) return Promise.reject('字符首尾不能有空格！');
      if (/^[A-Za-z0-9_-\s]+$/.test(value)) return Promise.resolve();
      return Promise.reject(message || '请输入大小写字母、数字、空格、下划线和横线');
    },
    trigger,
  };
};
