/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-30 15:36:58
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-28 20:00:16
 */
import axios from 'axios'
// 请求进度条
import store from '@/store/index.js'
import { ElNotification, ElMessage } from 'element-plus'
import { openLoading, closeLoading } from '../assets/js/loading'
const request = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 0 // 不设置前端超时时间,
})

function err(error) {
	closeLoading(null, true)
	if (error.response) {
		const data = error.response.data
		let timeId = null
		if (error.response.status === 401) {
			// 无效凭证 凭证过期 重新登录
			store.dispatch('user/loginOutForResponse')
		} else {
			timeId = setTimeout(() => {
				ElNotification({
					type: 'error',
					title: '错误',
					message: '请求失败，请稍后重试'
				})
			}, 100)
		}
		return Promise.reject(Object.assign({ timeId }, data))
	} else {
		return Promise.reject(error)
	}
}
// 对 data 进行任意转换处理
function fmtData(data) {
	// 对第一层进行深拷贝,只处理第一层
	let _data = Object.assign({}, data) //
	Reflect.ownKeys(_data).forEach(key => {
		// 处理起始时间
		if (key.indexOf('_') > -1 && Array.isArray(_data[key])) {
			let fields = key.split('_')
			_data[fields[0]] = _data[key][0] ? _data[key][0] : ''
			_data[fields[1]] = _data[key][1] ? _data[key][1] + ' 23:59:59' : ''
		}
		//  处理空和null
		if (_data[key] === '' || _data[key] === undefined) _data[key] = null

		if (Object.prototype.toString.call(_data[key]) === '[object Object]') {
			_data[key] = fmtData(_data[key]) // 处理多层数据
		}
	})
	return _data
}
request.interceptors.request.use(config => {
	const token = store.getters.token
	if (token) {
		config.headers['Authorization'] = token
	}
	config.data = fmtData(config.data)
	openLoading(config)
	return config
})

request.interceptors.response.use(response => {
	const { code, message } = response.data
	closeLoading(response.config.url)
	if (code === 200 || code == 301) {
		return Promise.resolve(response.data)
	} else if (code === 10002 || code === 10001) {
		// 无效凭证 凭证过期 重新登录
		store.dispatch('user/loginOutForResponse')
		return Promise.reject(response.data)
	} else {
		// 延时弹框  是为了让页面catch时清除 ,自定义message
		let timeId = setTimeout(() => {
			ElMessage.error(message)
		}, 100)
		return Promise.reject(Object.assign({ timeId }, response.data))
	}
}, err)

export default request
