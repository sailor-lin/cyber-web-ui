const TRIGGER = ["blur", "change"];

// 手机号码
export const phoneRegExp = new RegExp(/^1[3456789]\d{9}$/);
// 电话号码
export const telephoneRegExp = new RegExp(/^((d{3,4})|d{3,4}-|s)?d{7,14}$/);
// 邮箱
export const emailRegExp = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
// 密码
export const passwordRegExp = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,32}$|^(?=.*[a-zA-Z])(?=.*[~·!@#$%^&*()_+`" + `\-={}\[\]:";'<>?,./]).{8,32}$|^(?=.*[0-9])(?=.*[?=.*[~·!@#$%^&*()_+`" + `\-={}\[\]:";'<>?,./]).{8,32}$|^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~·!@#$%^&*()_+`" + `\-={}\[\]:";'<>?,./]).{8,32}$/
);

// required：必填
export const required = (message = '必填！', trigger = TRIGGER) => {
  return {
    required: true,
    message: message,
    trigger: trigger,
  };
};

// 最大字符数限制
export const maximum = (max = 100, message = '超出可输入最大字符数！', trigger = TRIGGER) => {
  return {
    max: max,
    message,
    trigger,
  };
};

// mustBeNumber：只支持输入数字
export const mustBeNumber = (message = '只能输入数字', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve(); 
      if (!/^-?[0-9]+\.?[0-9]+$|^-?[0-9]$/.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// mustBeNaturalNumber：只支持输入自然数
export const mustBeNaturalNumber = (message = '请输入自然数！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if(!/^0$|^[1-9][0-9]*$/.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// mustBePositiveInt：只支持输入正整数
export const mustBePositiveInt = (message = '请输入正整数！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if(!/^[1-9][0-9]*$/.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// portRule: 端口号规则
export const portRule = (trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if (!/^[0-9]+$/.test(value) || parseInt(value) >= 65535)
        return Promise.reject('端口号的取值范围为0 ~ 65535');
      else
        return Promise.resolve();
    },
    trigger,
  };
};

/*
  * dataTypeValidator: 数据类型，数据字典
  * type: 1、浮点型；2、正整型；3、长整型；4、布尔值
  */
export const dataTypeValidator = (type) => {
  switch (type) {
    case "1":
      return mustBeDoubleNumber();
    case "2":
      return mustBeIntNumber();
    case "3":
      return mustBeLongIntNumber();
    case "4":
      return mustBeBoolean();
    default:
      return (rule, value, callback) => Promise.resolve();
  }
};

// mustBeDoubleNumber：只支持输入浮点型
export const mustBeDoubleNumber = (message = '只支持输入浮点型！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) Promise.resolve();
      if (!/^-?[0-9]+\.?[0-9]+$|^-?[0-9]$/.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// mustBeIntNumber：只支持输入整型
export const mustBeIntNumber = (message = '只支持输入整数！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if (!/^-?[0-9]+$/.test(value))
        return Promise.reject(message);
      else if ((Number(value) < -32768 || Number(value) > 32767))
        return Promise.reject('整型的取值范围为-32768 ~ 32767');
      else
        return Promise.resolve();
    },
    trigger,
  };
};
// mustBeLongIntNumber: 只支持输入长整型
export const mustBeLongIntNumber = (message = '只支持输入长整型', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if (value && !/^-?[0-9]+$/.test(value))
        return Promise.resolve(message);
      else if (value && (Number(value) < -2147483648 || Number(value) > 2147483647))
        return Promise.reject('长整型的取值范围为-2147483648 ~ 2147483647');
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// mustBeBoolean：只支持输入布尔值
export const mustBeBoolean = (message = '只支持输入布尔值！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if (!/^true$|^false$/.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// phoneNumberFun：手机号验证
export const checkPhone = (message = '请输入正确的手机号码！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return Promise.resolve();
      if (!phoneRegExp.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// checkTelephone：电话号码验证
export const checkTelephone = (message = '请输入正确的电话号码！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if (!value) return Promise.resolve();
      if (!telephoneRegExp.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// checkEmidal: 校验邮箱
export const checkEmail = (message = '请输入正确的邮箱地址！', trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if (!value) return Promise.resolve();
      if (!emailRegExp.test(value))
        return Promise.reject(message);
      else
        return Promise.resolve();
    },
    trigger,
  };
};

// checkThePassword: 校验密码
export const checkThePassword = (checkValue, trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if (!value) return Promise.resolve();
      if (value.length < 8 || value.length > 32) {
        return Promise.reject('密码的长度为8 ~ 32位！')
      } else if (!passwordRegExp.test(value)) {
        return Promise.reject('密码应由字母、数字、特殊字符至少两种组成的8 ~ 32位字符串！')
      } else if (checkValue && checkValue != value) {
        return Promise.reject('两次输入的密码不一样！')
      }
      return Promise.resolve()
    },
    trigger
  }
}

// checkIPAddress: 校验ip地址
export const checkIPAddress = (trigger = TRIGGER) => {
  return {
    validator: (rule, value, callback) => {
      if(!value) return  Promise.resolve();
      let list = value.split(".").map(item => Number(item));
      if(list.some(item => isNaN(item)))
        return Promise.reject('ip地址只能为数字！');
      else if (list.some((item) => item < 0 || item > 255))
        return Promise.reject('ip地址取值范围为0 ~ 255');
      else if (list.length != 4)
        return Promise.reject('请输入正确的ip地址！');
      else
        return Promise.resolve();
    },
    trigger,
  };
};
