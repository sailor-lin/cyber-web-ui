import axios from 'axios';
import axiosRetry from 'axios-retry';
import cookie from '@/utils/cookie';
import { message } from 'ant-design-vue';
export default class Axios {
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
		this.init()
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
				return 2000; // time interval between retries
			},
			shouldResetTimeout: true, //  重置超时时间
			retryCondition: (error) => {
				// if retry condition is not specified, by default idempotent requests are retried
				// console.log('error', error)
				return true;
			},
		});

		// 请求拦截器
		this.requestInstance = this.instance.interceptors.request.use((config) => {
			// 在发送请求之前做些什么
			let token = cookie.get('token');
			config.headers["Token"] = token;
			return config;
		},
		(error) => {
			// 对请求错误做些什么
			return Promise.reject(error);
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
				if (/1004|401/.test(code)) {
					cookie.delete("token");
					window.location.reload();
					return;
				}
				if(!/^200$|^0$/.test(code)) {
					// 是否拦截报错消息提示
					if(!config?.interceptErrorMessages) {
						if(data?.message) {
							message.error(data.message);
						}
					}
					return Promise.reject(response.data || response)
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
						cookie.delete("token");
						window.location.reload();
						return;
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
							return Promise.reject({
								message: '网络超时！',
							});
						} else if (response?.data?.message) {
							message.error(data.message);
						}
					}
					return Promise.reject(response?.data || response || error || {});
				} catch {
					// 对响应错误做点什么
					return Promise.reject(response || error);
				}
			}
		);
	};

	request(config) {
		return this.instance.request(config);
	};

	resetRequest(callback, errorFun) {
		this.instance.interceptors.request.eject(this.requestInstance);
		this.requestInstance = this.instance.interceptors.request.use(callback, errorFun);
	};

	resetResponse(callback, errorFun) {
		this.instance.interceptors.response.eject(this.responseInstance);
		this.responseInstance = this.instance.interceptors.response.use(callback, errorFun);
	};
};
