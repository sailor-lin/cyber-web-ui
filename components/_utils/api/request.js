import axios from 'axios';
import axiosRetry from 'axios-retry';
import { message } from 'ant-design-vue';
import { AUTHORIZATION, getToken } from '../field-access';
import bus from '../bus';
import { PRODUCT_CODE } from '../config';

const whiteRetry = new Set(['ECONNABORTED', undefined]);

class Axios {
	instance
	baseURL
	headers
	timeout
	requestInstance // 请求拦截实例
	responseInstance // 响应拦截实例
	networkTimeout // 网络超时

	constructor(option) {
		this.baseURL = option.baseURL || undefined
		this.headers = option.headers || {
			'Content-Type': 'application/json'
		}
		this.timeout = option.timeout || 90000;
		this.init();
	};

	async init() {
		this.instance = axios.create({
			baseURL: this.baseURL,
			headers: this.headers,
			timeout: this.timeout
		});

		// 请求重试
		axiosRetry(this.instance, {
			retries: 2, // number of retries
			retryDelay: (retryCount) => {
				// console.log(`retry attempt: ${retryCount}`);
				return retryCount * 1000; // time interval between retries
			},
			shouldResetTimeout: true, //  重置超时时间
			retryCondition: (error) => {
				// if retry condition is not specified, by default idempotent requests are retried
				// console.log('error?', error)
				// true为打开自动发送请求，false为关闭自动发送请求
        const {code, message} = error;
        return whiteRetry.has(code) || message.includes('timeout');
			},
		});

		// 请求拦截器
		this.requestInstance = this.instance.interceptors.request.use((config) => {
			// 在发送请求之前做些什么
			if(!config.headers[AUTHORIZATION]) {
				config.headers[AUTHORIZATION] = getToken();
			}
			if(!config.headers['X-Project-Code']) {
				config.headers['X-Project-Code'] = PRODUCT_CODE;
			}
			// 是否清空空字符串参数
			if(config.method == 'get') {
				let clearEmpty = config.clearEmpty;
				if(typeof clearEmpty != 'boolean' || clearEmpty) {
					Object.keys(config.params || {}).forEach(key => {
						if(typeof config.params[key] == 'string' && !config.params[key]) {
							delete config.params[key]
						}
					});
				}
			}
			return config;
		},
		(error) => {
			// 对请求错误做些什么
			return Promise.reject(error?.message);
		});

		// 响应拦截器
		this.responseInstance = this.instance.interceptors.response.use(
			(response) => {
				const { data = {}, config = {} } = response;
				// 重试成功，修改axios-retry状态，直接返回response
				if (config['axios-retry']?.retryCount && !config['axios-retry']?.success) {
					response.config['axios-retry'].success = true;
					return response;
				}
				const code = data.code || response.code;
				if (/401/.test(code)) {
					bus.emit('UNAUTHORIZED')
					return Promise.reject(data.message);
				}
				if(!/^200$|^0$/.test(code)) {
					// 是否拦截报错消息提示
					if(!config?.interceptErrorMessages) {
						if(data?.message) {
							message.error(data.message);
						}
					}
					return Promise.reject(response?.data?.message)
				}
				// 对响应数据做点什么
				return data;
			},
			(error) => {
				const { config = {}, response, code } = error || {};
				try {
					// 重试失败，修改axios-retry状态，直接返回error
					if (config['axios-retry']?.retryCount && !config['axios-retry']?.error) {
						config['axios-retry'].error = true;
						return Promise.reject(error);
					}
					if (/401/.test(response?.status)) {
						bus.emit('UNAUTHORIZED')
						return Promise.reject(error.message);
					}
					// 不拦截报错信息 && code不为取消接口
					if(!config.interceptErrorMessages && code != 'ERR_CANCELED') {
						// 网络超时
						if(error.code === 'ECONNABORTED' && /^timeout/.test(error.message)) {
							// 网络超时提示
							this.networkTimeout && clearTimeout(this.networkTimeout);
							this.networkTimeout = setTimeout(() => {
								message.error('网络超时！')
							}, 200);
							return Promise.reject('网络超时！');
						} else if (response?.data?.message) {
							message.error(response?.data.message);
						}
					}
				} catch {}
				return Promise.reject(response?.data?.message);
			}
		);
	};

	request(config) {
		return this.instance.request(config);
	};
};

export default Axios;
