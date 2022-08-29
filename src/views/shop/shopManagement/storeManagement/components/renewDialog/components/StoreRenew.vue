<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false">
  <el-form-item label="套餐名称:">
    <el-input v-model="formData.platterName" class="w360" disabled></el-input>
  </el-form-item>
  <el-form-item label="套餐到期时间:">
    <el-input v-model="data.platTime" disabled class="w360"></el-input>
  </el-form-item>
  <el-form-item label="续费金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243"></el-input>
    <el-select v-model="formData.company" class="w109" @change="formData.amount=''">
      <el-option label="美元" :value="0"></el-option>
      <el-option label="元" :value="1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="付款方式:" prop="type">
    <el-radio v-model="formData.type" :label="0">月付</el-radio>
    <el-radio v-model="formData.type" :label="1">年付</el-radio>
  </el-form-item>
  <el-form-item label="有效期:" prop="date">
    <el-date-picker class="w360" unlink-panels v-model="formData.date" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" :default-time="[new Date(2000,0,0,0,0,0),new Date(2000,0,0,23,59,59)]" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
  </el-form-item>

</el-form>
</template>

<script>
import { onMounted, reactive, toRefs, inject } from 'vue'
import { requiredValue, moneyRules } from '@/views/shop/shopRules/rules.js'
import { renew } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: Object,
    upDataRow:{}
  },
  emits: ['clearSubmit', 'submit'],
  setup(props, context) {
    const state = reactive({
      formRef: '',
      formData: {
        platterName: props.data.platterName,
        shopId: props.data.shopId,
        company: 0,
        amount: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    })

    onMounted(()=>{
      state.formData.platterName  = props.data.platterName
      state.formData.shopId = props.data.shopId
    })
    const rules = {
      amount: moneyRules(state.formData, '请输入续费金额'),
      date: [requiredValue('请选择有效期'), {
        validator: (rule, value, callback) => {
          let oldTime = new Date(props.data.platTime).getTime()
          let newTime = new Date(state.formData.date[0]).getTime()
          if (oldTime >= newTime) {
            return callback('有效期的开始时间需晚于' + props.data.platTime)
          } else {
            return callback()
          }
        }
      }],
      type: [requiredValue('请选择续费方式')],
    }
    const search = inject('search')
    const close = inject('close')
    function submit(isClose){
       state.formRef.validate().then(_ => {
        state.formData.startTime = state.formData.date[0] 
        state.formData.endTime = state.formData.date[1]
        const data = {
          renewType: 2,
          shopRenewDTOS: [state.formData]
        }
        renew(data).then(_ => {
          ElMessage.success('续费成功')
           state.formRef.resetFields()
          props.upDataRow && props.upDataRow()
          search()
          props.data.platTime = state.formData.endTime
          if (isClose) {
            close()
          }
        })
      })
    }
    return {
      ...toRefs(state),
      rules,
      submit
    }
  }
}
</script>

<style>

</style>
