/*
 * @Descripttion: 
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-08-06 18:07:36
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 19:59:25
 */
import { ElMessageBox, ElMessage } from 'element-plus';
import {closeMq} from '@/assets/js/ws'
export function userInfo(router) {
    router.push({
        name: 'UserInfo'
    })
}
export function logout(store, router) {
    ElMessageBox.confirm('是否退出当前账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        store.dispatch('user/loginOutByActions').then(res => {
            closeMq() // 关闭mq
            router.replace({
                path: '/login'
            })
            setTimeout(() => {
                ElMessage({
                    type: 'success',
                    message: '成功退出!',
                });
            }, 500)
        })

    })
}