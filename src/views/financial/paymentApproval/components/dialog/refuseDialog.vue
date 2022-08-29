<!--
* @Descripttion: Vango ERP refuseDialog.vue 拒绝付款弹框
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="拒绝付款"
      v-model="dialogVisible"
      width="30%"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        class="demo-form-inline demo-ruleForm"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="拒绝原因：" prop="refuseInfo">
          <el-input
            v-model="ruleForm.refuseInfo"
            :rows="2"
            autofocus
            type="textarea"
            placeholder="请输入备注"
            
            :maxlength="50"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" 
            >取 消</el-button
          >
          <el-button type="primary" @click="ok" >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { refuseFn } from '../../composables/api'
import { ElMessage } from 'element-plus'
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      ruleForm: {
        refuseInfo: ''
      },
      rules: {
        refuseInfo: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' }
        ]
      },
      formRef: null
    })
    // 取消弹框
    function handleClose() {
      state.dialogVisible = false
      emit('closeBack', false)
    }

    // 确定按钮
    function ok() {
      state.formRef.validate(val => {
        if (val) {
          // 点击确定按钮，且校验通过
          const obj = {
            applyId: props.list,
            reason: state.ruleForm.refuseInfo
          }
          refuseFn(obj)
            .then(res => {
              if (res.code == 200) {
                ElMessage.success({ message: res.message })
                handleClose()
                emit('closeBack', 'success')
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