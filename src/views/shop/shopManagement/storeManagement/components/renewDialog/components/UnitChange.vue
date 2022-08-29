<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false" >
  <el-form-item label="插件名称:" prop="pluginName">
    <el-input v-model="formData.pluginName" clearable class="w360" maxlength="10"></el-input>
  </el-form-item>
  <el-form-item label="续费金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243" ></el-input>
    <el-select v-model="formData.company" class="w109"  @change="data.amount=''">
      <el-option label="美元" :value="0"></el-option>
      <el-option label="元" :value="1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="有效期:" prop="date">
    <el-date-picker class="w360" unlink-panels v-model="formData.date" value-format="YYYY-MM-DD" type="daterange" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
  </el-form-item>
</el-form>
</template>

<script>
import { onMounted, reactive, toRefs, inject } from 'vue'
import { requiredValue, moneyRules } from '@/views/shop/shopRules/rules.js'
import { changeCheck } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {},
    upDataRow:{}
  },
  emits: ['clearSubmit', 'submit'],
  setup(props, context) {
    const state = reactive({
      formRef: '',
      formData: {
        shopId: props.data.shopId,
        pluginName: '',
        date: '',
        startTime: '',
        endTime: '',
        amount: '',
        type: 0,
        amount: '',
        company: 0
      }
    })
    onMounted(() => {
        state.formData.shopId = props.data.shopId
    })

    const rules = {
      pluginName:requiredValue('请输入插件名称'),
      amount: moneyRules(props.data, '请输入续费金额'),
      date: [
        requiredValue('请选择有效期'),
        {
          validator: (rule, value, callback) => {
            let month = new Date().getMonth() + 1
            let year = new Date().getFullYear()
            let minDate = new Date(`${year}-${month}-1 00:00:00`).getTime()
            if(new Date(value[0]).getTime()<minDate){
              callback('有效期的开始时间所属月度不得早于当月度')
            }else{
              callback()
            }
          },
          trigger: ['blur','change']
        }
      ],
    }
const search = inject('search')
    const close = inject('close')
    function submit(isClose){
      state.formRef.validate().then(_ => {
        state.formData.startTime = state.formData.date[0] + ' 00:00:00'
        state.formData.endTime = state.formData.date[1] + ' 23:59:59'
        const data = {
          changeType:3,
          shopChangeDTOS:[state.formData]
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
