/*
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-08-16 10:10:59
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-19 15:06:10
 */

import { checkEmail, updateEmail, updateHead, savePerson, checkPhone, updatePwd } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { checkUserLogs } from '@/api/logs.js'
import { reactive } from 'vue'

// 密码表单数据

export const formPwd = reactive({
    formPwd: {
        password: '',
        newPwd: '',
        surePwd: ''
    }
})
// 校验邮箱
export function newEmail(rule, value, callback) {
    const exp = new RegExp(
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    )
    const flag = exp.test(value)
    if (flag) {
        return callback()
    } else {
        return callback('邮箱格式不正确')
    }
}

// 校验密码
export function password(rule, value, callback) {
    if (value.indexOf(' ') > 0) {
        return callback('密码中不能包含空格')
    } else if (value.length < 6 || value.length > 23) {
        return callback('字符长度应在6-23位之间')
    } else {
        return callback()
    }
}

// 校验新密码
export function newPwd(rule, value, callback) {
    if (value.length < 6 || value.length > 23) {
        return callback(new Error('字符长度应在6-23位之间'))
    } else if (value.indexOf(' ') > 0) {
        return callback('密码中不能包含空格')
    } else if (value == formPwd.formPwd.password) {
        return callback('旧密码和新密码不能重复！')
    } else {
        return callback()
    }
}

// 确认密码
export function surePwd(rule, value, callback) {
    if (value.length < 6 || value.length > 23) {
        console.log(formPwd.formPwd.newPwd)
        return callback('字符长度应在6-23位之间')
    } else if (value.indexOf(' ') > 0) {
        return callback('密码中不能包含空格')
    } else if (value !== formPwd.formPwd.newPwd) {
        return callback('两次密码不一致')
    } else {
        return callback()
    }
}

// 修改邮箱
export function submitEmail(state, props, emit) {
    state.ref
        .validate()
        .then(() => {
            checkEmail({ userId: props.userData.userId, email: state.formEmail.newEmail }).then(res => {
                const data = {
                    userId: props.userData.userId,
                    email: state.formEmail.newEmail,
                    password: state.formEmail.password,
                    yzm:+state.formEmail.authcode
                }
                updateEmail(data).then(res => {
                    ElMessage.success(res.message)
                    state.isEditEmail = false
                    emit('getUser')
                })
            })
        })

}

// 修改密码
export function submitPwd(state, router, store) {
    state.refs.validate().then(() => {
            updatePwd({
                userId: state.userData.userId,
                password: formPwd.formPwd.password,
                newPassword: formPwd.formPwd.surePwd
            }).then(res => {
                ElMessage.success(res.message)
                state.isEditPwd = false
                // 退出登录
                store.dispatch('user/loginOutByActions').then(res => {
                    router.replace({
                        path: '/login'
                    })
                    setTimeout(() => {
                        ElMessage.success('成功退出')
                    }, 500)
                })
            }).catch(err => {
                state.isEditPwd = false
            })
        })
}

// 修改用户头像
export function submitAvatar(value, state, emit) {
    value = value.filter(val => val != undefined)
    state.ref.fileList = []
    const data = {
        userId: state.userData.userId,
        avatar: value[0].fileUrl
    }
    updateHead(data).then(res => {
        ElMessage.success(res.message)
        emit('getUser',true)
    })
}

// 保存用户信息
export function submitUserInfo(data, formR, emit) {
    formR.validate().then(() => {
        //表单校验成功
        // 校验手机号是否重复
        checkPhone(data).then(res => {
            // 发送接口
            savePerson(data).then(val => {
                ElMessage.success('保存成功！')
                emit('getUser')
                return 123
            })
        })
    }).catch(() => {
        // 表单校验失败
        return false
    })
}

// 获取用户日志
export function getLogs(state) {
    checkUserLogs({
        logType: 0,
        page: {
            pageNo: state.currentPage,
            pageSize: state.pageSize
        }
    }).then(res => {
        state.tableData = res.data.dataList
        state.total = res.data.page.totalCount
    })
}
