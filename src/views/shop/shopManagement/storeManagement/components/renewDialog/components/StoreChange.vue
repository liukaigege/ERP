<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false">
  <el-form-item label="套餐名称:" prop="platterName">
    <el-input v-model="formData.platterName" class="w360" maxlength="10"></el-input>
  </el-form-item>
  <el-form-item label="续费金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243"></el-input>
    <el-select v-model="formData.company" class="w109" @change="formData.fee=''">
      <el-option label="美元" :value="0"></el-option>
      <el-option label="元" :value="1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="付款方式:" prop="type">
    <el-radio v-model="formData.type" :label="0">月付</el-radio>
    <el-radio v-model="formData.type" :label="1">年付</el-radio>
  </el-form-item>
  <el-form-item label="手续费:" prop="fee">
    <el-input v-model="formData.fee" class="w243"></el-input>
    <el-button type="info" plain disabled class="w109">%</el-button>
  </el-form-item>
  <el-form-item label="有效期:" prop="date">
    <el-date-picker class="w360" unlink-panels v-model="formData.date" type="datetimerange" :default-time="[
    new Date(2000,0,0,0,0,0),
    new Date(2000,0,0,23,59,59)
    ]" value-format="YYYY-MM-DD HH:mm:ss" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
  </el-form-item>

</el-form>
</template>

<script>
import { reactive, toRefs, inject, onMounted } from 'vue'
import { requiredValue, moneyRules, fee } from '@/views/shop/shopRules/rules.js'
import { changeCheck } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {},
    upDataRow:{}
  },
  setup(props, context) {
    const state = reactive({
      formRef: '',
      formData: {
        shopId: props.data.shopId,
        platterName: '',
        date: '',
        startTime: '',
        endTime: '',
        fee: '',
        type: 0,
        amount: '',
        company: 0
      }
    })

    onMounted(() => {
      state.formData.shopId = props.data.shopId
    })
    const rules = {
      platterName: requiredValue('请输入套餐名称'),
      amount: moneyRules(state.formData, '请输入套餐金额'),
      fee: fee('请输入手续费'),
      date: [{ required: true, message: '请选择日期', trigger: ['change', 'blur'] },
        {
          validator: (rule, value, callback) => {
            let month = new Date().getMonth() + 1
            let year = new Date().getFullYear()
            let minDate = new Date(`${year}-${month}-1 00:00:00`).getTime()
            if (new Date(value[0]).getTime() < minDate) {
              callback('有效期的开始时间所属月度不得早于当月度')
            } else {
              callback()
            }

          }
        }
      ],
      type: [requiredValue('请选择续费方式')],
    }
    const search = inject('search')
    const close = inject('close')

    function submit(isClose) {
      state.formRef.validate().then(_ => {
        state.formData.startTime = state.formData.date[0]
        state.formData.endTime = state.formData.date[1]
        const data = {
          changeType: 2,
          shopChangeDTOS: [state.formData]
        }
        changeCheck(data).then(_ => {
          ElMessage.success('变更成功')
          state.formRef.resetFields()
          props.upDataRow && props.upDataRow()
          search()
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
