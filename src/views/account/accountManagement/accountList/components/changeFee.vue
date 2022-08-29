<!--
* @Descripttion: Vango ERP changeFee 修改手续费
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="修改手续费"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="交易手续费：" prop="fee">
        <el-input
          v-model="form.fee"
          
          placeholder="请输入交易手续费"
          type="number"
          clearable
          @keyup.enter="ok"
          ><template #append>%</template></el-input
        >
      </el-form-item>
    </el-form>
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
import { editFee } from '../composables/api'
import { ElMessage } from 'element-plus'
export default {
  props: {
    list: Array
  },
  emits: ['changeFeeBack'],
  setup(props, { emit }) {
    const ids = props.list.map(v => v.id)
    //   最多保留两位小数,值范围在0-100之间（包含0 100）
    const regularText = /^([0-9][0-9]{0,1})(\.\d{1,2})?$/;
    const state = reactive({
      dialogVisible: true,
      form: {
        fee: '',
        ids
      },
      rules: {
        fee: [
          { required: true, message: '请输入交易手续费', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              !regularText.test(value)
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '请输入0-100之间数字(最多保留2位小数)'
          }
        ]
      },
      formRef: null
    })
    function handleClose() {
      emit('changeFeeBack', false)
    }
    function ok() {
      state.formRef.validate(val => {
        if (val) {
          state.form.fee = state.form.fee - 0
          editFee(state.form).then(res => {
            if (res.code == 200) {
              emit('changeFeeBack', true)
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
</style>]
