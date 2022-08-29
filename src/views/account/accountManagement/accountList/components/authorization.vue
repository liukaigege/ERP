<!--
* @Descripttion: Vango ERP authorization
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="账号授权"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="formRef" :model="form" label-width="120px" :rules="rules" @keyup.enter="ok">
        <el-form-item label="贝宝名称："> {{ operationSingle.account }} </el-form-item>
        <el-form-item label="client_id：" prop="clientId">
          <el-input
            v-model="form.clientId"

            placeholder="请输入client_id"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="client_secret：" prop="clientSecret">
          <el-input
            v-model="form.clientSecret"

            placeholder="请输入client_secret"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { authAccount } from '../composables/api'
export default {
  props: {
    operationSingle: Object
  },
  emits: ['authorizationBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      form: {
        id:props.operationSingle.id,
        clientId: '',
        clientSecret: ''
      },
      rules: {
        clientId: [
          { required: true, message: '请输入client_id', trigger: 'blur' },
          { required: false, min: 0, max: 200, message: '最多200个字符' }
        ],
        clientSecret: [
          { required: true, message: '请输入client_secret', trigger: 'blur' },
          { required: false, min: 0, max: 200, message: '最多200个字符' }
        ]
      },
      formRef: null
    })
    function handleClose() {
      emit('authorizationBack', false)
    }
    function ok() {
      state.formRef.validate(val => {
        if (val) {
          authAccount(state.form).then(res => {
            if (res.data) {
              emit('authorizationBack', true)
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        }
      })
    }
    return {
      ...toRefs(state),
      handleClose,
      ok
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
