import Yaml from 'yaml';
import jsYaml from 'js-yaml';
import dayjs from '@/utils/dayjs';
import { saveAsBlob } from './index.js';


/** 
 * @function 将数据转为yaml
 * @param {string | object} data 要转化的数据，可传格式：对象或字符串
 * @returns {string}
 */
export const jsonToYaml = (data) => {
  if(!data) return '';
  try {
    if(typeof data == 'string') data = JSON.parse(data);
    else if(typeof data != 'object') return '';
    return jsYaml.dump({
      kind: data?.kind,
      apiVersion: data?.apiVersion,
      metadata: data?.metadata,
      spec: data?.spec,
      status: data?.status,
      ...data
    });
  } catch (err) {
    return ''
  }
}
/** 
 * @function 将yaml转为json串或对象
 * @param {string} yamlStr yaml数据
 * @param {boolean} returnString 是否返回字符串
 * @returns {string | object}
 */
export const yamlToJson = (yamlStr, returnString = false) => {
  try {
    return returnString ? JSON.stringify(Yaml.parse(yamlStr), null, 2) : Yaml.parse(yamlStr)
  } catch (err) {
    return returnString ? '' : {}
  }
}
/**
 * @function 字符串转成yaml格式
 * @param {string} key
 * @param {string | number} value 
 * @param {string} prefix 前缀
 */
export const stringToYaml = (key, value, prefix) => {
  if(!key) return '';
  return prefix + jsYaml.dump({ [key]: value }).replace(/^\n|\n$/gi, '');
}

/** 
 * @function downloadYaml：下载yaml文件
 * @param {string} str 要下载的数据
 * @param {string} fileName 文件名称
 */
export const downloadYaml = (str, fileName) => {
  let blob = new Blob([str], {
    type: "text/plain",
  })
  saveAsBlob(blob, fileName);
}

/**
 * @function 清除空数据（空字符串，空数组，空对象，false）
 * @param {any} target 
 * @returns {any}
 */
export const clearEmptyProperty = (target) => {
  // 字符串
  if(typeof target == 'string') return target || undefined;
  // 布尔值
  if(typeof target == 'boolean') return target;
  // 数组
  if(Array.isArray(target)) {
    target = target.map(item => clearEmptyProperty(item)).filter(item => item);
    return target.length ? target : undefined;
  }
  // 对象
  if(typeof target == 'object') {
    if(target instanceof Object) {
      Object.keys(target).forEach(key => {
        target[key] = clearEmptyProperty(target[key]);
        if(!target[key] && target[key] != '0' && typeof target[key] != 'boolean') delete target[key];
      });
      return Object.keys(target).length ? target : undefined;
    } else {
      return undefined;
    }
  }
  return target
}

/**
 * @function 统一格式化后端返回数据，模板为计算负载-部署详情数据
 * @param {object} result 
 * @returns {object}
 */
export const loadBodyFormat = (result) => {
  const { metadata = {}, spec = {} } = result;
  // 统一处理yaml数据
  return {
    ...result,
    metadata: {
      ...metadata,
      generation: undefined,
      uid: undefined,
      managedFields: undefined, // 不展示managedFields
      creationTimestamp: undefined,
    },
    spec,
    status: undefined
  };
}

/**
 * @function 获取yaml数据的更新时间
 * @param {object} result 
 */
export const getUpdateTime = (result = {}) => {
  const { metadata = {} } = result;
  if(!metadata.managedFields?.length) return '';
  let find = metadata.managedFields.reverse().find(item => item.operation == 'Update');
  if(!find?.time) return '';
  return dayjs(find?.time).format('YYYY-MM-DD HH:mm:ss');
}






// 驱动配置
export const driveConfig = {
  "driver-params": {
    "driver-attribute": [
      {
        displayName: "示例名称",
        name: "demoName",
        description: "示例名称",
        type: "string",
        value: "demo",
      },
    ],
    "slave-attribute": [
      {
        displayName: "产品编码",
        name: "productcode",
        description: "示例产品",
        type: "String",
        value: "demoCode",
      },
    ],
    "master-attributes": [
      {
        "slave-point": 1,
        "slave-attributes": [
          {
            propertyName: "示例属性编码",
            dataHandle: "处理类（开发人员填写）",
            description: "示例属性",
            "point-attribute": [
              {
                displayName: "示例属性配置项",
                name: "functionCode",
                description: "示例属性配置项注释",
                type: "int",
                value: 1,
              },
            ],
          },
        ]
      },
    ],
  },
}

// 驱动定时任务
export const driveScheduledTasks = {
  "driver": { // 驱动定时任务配置
    "name": "示例定时任务", // 驱动名称
    "tenant": "default",
    "type": "驱动类型",
    "project": "所属驱动",
    "description": "驱动说明",
    "schedule": {
      "status": { // 驱动设备状态定时任务
        "enable": false,
        "corn": "* * * * * ? *"
      },
      "online": { // 驱动在线定时任务
        "enable": false,
        "corn": "* * * * * ? *"
      },
      "custom": { // 驱动自定上义定时任务
        "enable": false,
        "corn": "* * * * * ? *"
      },
      "report": { // 驱动设备上报定时任务
        "enable": false,
        "corn": "* * * * * ? *"
      }
    }
  }
}

// 使用示例
export function displayYaml (yamlStr) {
  let obj = JSON.parse(JSON.stringify(driveScheduledTasks))
  let yamlObj = yamlToJson(yamlStr)
  return Object.assign(obj, yamlObj)
}