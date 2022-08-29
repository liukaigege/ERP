<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-16 09:35:05
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 16:04:12
-->
<template>
<el-dialog title="修改邮箱" v-model="isEditEmail" width="500px" @close="close" :close-on-click-modal="false">
    <el-form
        :model="formEmail"
        :ref="formRef"
        :rules="rules"
        label-width="90px"
        :inline="false"
        size="normal"
        v-if="isEditEmail">
        <el-form-item label="新邮箱:" prop="newEmail">
            <el-input v-model="formEmail.newEmail" class="input"  clearable></el-input>
            <el-button  class="button" @click="submitCode" :disabled="codeDisabled">{{codeStr}}</el-button>
        </el-form-item>
        <el-form-item label="验证码:" prop="authcode">
            <el-input class="inputW" v-model="formEmail.authcode"  clearable></el-input>
        </el-form-item>
        <el-form-item label="当前密码:" prop="password">
            <el-input  class="inputW" type="password" v-model="formEmail.password"  clearable></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button  @click="close">取消</el-button>
            <el-button type="primary"  @click="submit">确定</el-button>
        </span>
    </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { newEmail, password, submitEmail } from '../composable/index.js'
import { ElMessage } from 'element-plus'
import { checkEmail, sendEmail } from '@/api/user.js'
export default {
    name: 'editEmail',
    props: {
        userData: {}
    },
    emits: ['getUser'],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance()
        const state = reactive({
            ref: '',
            isEditEmail: false,
            isvcCode: false,
            formEmail: {
                newEmail: '',
                authcode: '',
                password: ''
            },
            rules: {
                password: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' },
                    { validator: password, trigger: 'blur' }
                ],
                newEmail: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { validator: newEmail, trigger: 'blur' }
                ],
                authcode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { required: true, message: '请输入6位验证码', trigger: 'blur' }
                ]
            },
            codeStr: '发送验证码',
            codeDisabled: false
        })

        onMounted(() => {
            state.isEditEmail = true
        })

        function formRef(el) {
            state.ref = el
        }

        function close() {
            state.isEditEmail = false
            setTimeout(() => {
                proxy.$parent.isEditEmail = false
            }, 500);
        }

        //  修改邮箱
        function submit() {
            submitEmail(state, props, emit)
        }

        // 获取验证码
        function submitCode() {
            if (!state.formEmail.newEmail.trim()) return ElMessage.error('请输入邮箱')
            const exp = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
            const flag = exp.test(state.formEmail.newEmail)
            if (flag) {
                checkEmail({ email: state.formEmail.newEmail, userId: props.userData.userId }).then(() => {
                    sendEmail({ email: state.formEmail.newEmail, userId: props.userData.userId }).then(res => {
                        state.codeDisabled = true
                        state.codeStr = 60
                        ElMessage.success('验证码发送成功')
                        const one = setInterval(() => {
                            state.codeStr--
                            if (state.codeStr == 0) {
                                clearInterval(one)
                                state.codeStr = '发送验证码'
                                state.codeDisabled = false
                            }
                        }, 1000)
                    })
                })

            } else {
                ElMessage.error('邮箱格式不正确')
            }

        }
        return {
            ...toRefs(state),
            formRef,
            close,
            submit,
            submitCode

        }
    }
}
</script>

<style lang="scss" scoped>
.input{
    width: 258px
}
.button{
    margin-left: 10px;
    width:92px;
}
.inputW{
    width: 360px;
}
</style>
