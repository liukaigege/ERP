<!--
* @Descripttion: Vango ERP changePayment 变更支付状态
* @version: 1.2.12.B
* @Author: 王新国
* @Date: 2022-03-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2022-03-02 17:07:46
-->
<template>
  <el-dialog
    title="变更支付状态"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :inline="true"

      class="customerInfo"
      label-width="125px"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="选择支付方式：" prop="paymentMethodValue">
        <el-cascader
          v-model="form.paymentMethodValue"
          :options="options"
          :props="payProps"
          clearable
          style="width: 295px"
          @change="changeFn"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="订单金额(USD):" prop="totalPrice">
        <el-input-number
          v-model="form.totalPrice"
          controls-position="right"
          style="width: 295px"
          :min="0"
          :max="999999.99"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" >保 存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { paymethods, paymentStatus } from '@/api/order/orderManagement'
import { payProps } from '@/views/order/orderManagement/orderDetail/composables/data'
export default {
  props: {
    orderData: Object
  },
  emits: ['changePaymentBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      options: [],
      form: {
        paymentMethodValue: null,
        paymentMethod: props.orderData.packageRels[0].paymentMethod,
        totalPrice: null,
        paymentType: props.orderData.packageRels[0].paymentType
      },
      rules: {
        paymentMethodValue: [
          { required: true, message: '请选择支付方式', trigger: 'change' },
          {
            validator(rule, value, callback) {
              console.log(value)
              !value || !value[value.length - 1]
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '请选择支付方式'
          }
        ],
        totalPrice: [
          { required: true, message: '请输入订单金额(USD)', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              !value || value > 999999.99
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '订单金额(USD)为0-999999.99之间数字'
          }
        ]
      },
      formRef: null
    })
    paymethods().then(res => {
      res.data?.forEach(item => {
        let arr = []
        item.paymentMethods.forEach(it => {
          arr.push({
            paymentType: it
          })
        })
        item.paymentMethods = arr
      })
      state.options = res.data
    })
    function changeFn() {
      if (state.form.paymentMethodValue) {
        state.form.paymentType = state.form.paymentMethodValue[0]
        state.form.paymentMethod =
          state.form.paymentMethodValue[
            state.form.paymentMethodValue.length - 1
          ]
      } else {
        state.form.paymentMethod = null
      }
    }
    function handleClose() {
      emit('changePaymentBack', false)
    }
    function ok() {
      state.formRef.validate(val => {
        if (val) {
          const { packageId } = props.orderData
          const { paymentMethod, paymentType, totalPrice } = state.form
          paymentStatus({
            packageId,
            paymentMethod,
            paymentType,
            totalPrice
          }).then(() => {
            emit('changePaymentBack', true)
          })
        }
      })
    }
    return {
      ...toRefs(state),
      handleClose,
      ok,
      payProps,
      changeFn
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
