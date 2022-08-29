<!--
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-08-16 08:57:15
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 16:07:53
-->
<template>
<el-dialog title="修改密码" v-model="isEditPwd" width="500px" @close="close" :close-on-click-modal="false">
    <el-form
        :model="formPwd"
        :rules="rules"
        :ref="formRef"
        :inline="false"
        label-width="90px"
        size="normal"
        id="form"
        v-if="isEditPwd">
        <el-form-item label="旧密码:" prop="password" >
            <el-input type="password" v-model="formPwd.password"  placeholder="请输入旧密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPwd">
            <el-input type="password" v-model="formPwd.newPwd"  placeholder="请输入新密码（6-23位不能使用空格）" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="surePwd" >
            <el-input type="password" v-model="formPwd.surePwd"  placeholder="再次输入密码" clearable></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="close" >取消</el-button>
            <el-button type="primary"  @click="submit">确定</el-button>
        </span>
    </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { password, newPwd, surePwd, formPwd ,submitPwd} from '../composable/index.js'
export default {
    name: 'editPwd',
    props: {
        userData: {}
    },
    setup(props) {
        const { proxy } = getCurrentInstance()
        const state = reactive({
            isEditPwd: false,
            refs: '',
            rules: {
                //旧密码
                password: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' },
                    { validator: password, trigger: 'blur' }
                ],
                //新密码
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: newPwd, trigger: 'blur' }
                ],
                //确认密码
                surePwd: [
                    { required: true, message: '请重复新密码', trigger: 'blur' },
                    { validator: surePwd, trigger: 'blur' }
                ],
            },
            userData: props.userData
        })

        onMounted(() => {
            state.isEditPwd = true
            formPwd.formPwd.password = ''
            formPwd.formPwd.newPwd = ''
            formPwd.formPwd.surePwd = ''
        })

        // 弹框关闭
        function close() {
            state.isEditPwd = false
            setTimeout(() => {
                proxy.$parent.isEditPwd = false
            }, 500);
        }

        // 获取表单元素

        function formRef(el) {
            state.refs = el
        }

        const router = useRouter()
        const store = useStore()

        function submit() {
            submitPwd(state,router,store)
        }

        return {
            ...toRefs(state),
            ...toRefs(formPwd),
            close,
            submit,
            formRef


        }
    }
}
</script>

<style>

</style>
