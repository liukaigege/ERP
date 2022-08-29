<!--
* @Descripttion: Vango ERP completePay 确定完成付款
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="确认付款"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="ruleForm"
      class="demo-form-inline demo-ruleForm"
      :rules="rules"
      :label-width="100"
      ref="formRef"
    >
      <el-form-item label="支付时间：" prop="payTime" style="margin-bottom:20px;">
        <el-date-picker
          v-model="ruleForm.payTime"
          type="date"
          style="width:310px"
          placeholder="时间段选择"
          clearable
          :disabledDate="time => time.getTime() > Date.now()"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款账号：" prop="checkedList" >
        <el-cascader
          v-model="ruleForm.checkedList"
          :options="list"
          style="width:310px"
          :props="{
            label: 'accountId',
            value: 'accountId',
            children: 'childSupplierPayDO'
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="备注：">
      <el-input type="textarea" v-model="ruleForm.remark"  show-word-limit maxlength="150" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { listSupplierPaymentAccount } from '../../composables/api'
export default {
  props: {},
  emits: ['closeBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      ruleForm: {
        payTime: '',
        checkedList: '',
        remark:''
      },
      rules: {
        payTime: [
          { required: true, message: '请选择时间段', trigger: 'blur change' }
        ],
        checkedList: [
          { required: true, message: '请选择付款账号', trigger: 'blur change' }
        ]
      },
      formRef: null,
      list: []
    })
    // 查询付款账户列表
    listSupplierPaymentAccount().then(res=>{
      if (res.code == 200) {
        state.list = res.data.childSupplierPayDO || []
      }else{
        ElMessage.warning({ message: res.message })
      }
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
          state.dialogVisible = false
          const { payTime, checkedList ,remark} = state.ruleForm
          const supplierPaymentAccount = checkedList[checkedList.length - 1]
          emit('closeBack', {
            payTime: payTime + ' 00:00:00',
            supplierPaymentAccount,
            remark
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