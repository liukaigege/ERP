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
import { ElNotification } from 'element-plus'
import { openLoading, closeLoading } from '../assets/js/loading'
const request = axios.create({
    baseURL: 'http://47.99.122.19:9195/',
    timeout: 0 // 不设置前端超时时间
})

function err(error) {
    if (error.response) {
        const data = error.response.data
        const { message } = error.response.data
        if (error.response.status === 401) {
            // 无效凭证 凭证过期 重新登录
            store.dispatch('user/loginOutForResponse')
        } else {
            ElNotification({
                type: 'error',
                title: '请求失败，请稍后重试',
                message: message
            })
        }
        return Promise.reject(data)
    } else {
        return Promise.reject(error)
    }
}
request.interceptors.request.use(config => {
    const token = store.getters.token
    if (token) {
        config.headers['Authorization'] = token
    }
    openLoading(config)
    return config
})

request.interceptors.response.use(response => {
    const code = response.data.code
    closeLoading()
    if (code === 200 || code == 301) {
        return Promise.resolve(response.data)
    } else if (code === 10002 || code === 10001) {
        // 无效凭证 凭证过期 重新登录
        store.dispatch('user/loginOutForResponse')
        return Promise.reject(response.data)
    } else {
        return Promise.reject(response.data)
    }
}, err)

export default request