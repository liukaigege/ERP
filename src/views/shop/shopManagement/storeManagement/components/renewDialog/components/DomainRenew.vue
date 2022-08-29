<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false">
  <el-form-item label="域名:">
    <el-input v-model="formData.domain" class="w360" disabled></el-input>
  </el-form-item>
  <el-form-item label="域名到期时间:">
    <el-input v-model="data.domainEndTime" disabled class="w360">
    </el-input>
  </el-form-item>
  <el-form-item label="续费金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243"></el-input>
    <el-select v-model="formData.company" class="w109" @change="formData.amount=''">
      <el-option label="美元" :value="0"></el-option>
      <el-option label="元" :value="1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="续费有效期:" prop="date">
    <el-date-picker v-model="formData.date" unlink-panels type="daterange" value-format="YYYY-MM-DD" range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" class="w360">
    </el-date-picker>
  </el-form-item>
</el-form>
</template>

<script>
import { inject, onMounted, reactive, toRefs } from 'vue'
import { requiredValue, moneyRules } from '@/views/shop/shopRules/rules.js'
import { renew } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {},
    upDataRow:{}
  },
  setup(props) {
    const state = reactive({
      formRef: '',
      formData: {
        domain: props.data.domain,
        shopId: props.data.shopId,
        company: 1,
        amount: '',
        date: '',
        startTime: '',
        endTime: ''
      }
    })

    onMounted(() => {
      console.log(props.data);
      state.formData.domain = props.data.domain
      state.formData.shopId = props.data.shopId
    })

    const rules = {
      amount: moneyRules(props.data, '请输入续费金额'),
      date: [requiredValue('请选择有效期'), {
        validator: (rule, value, callback) => {
          console.log(state.formData.domainTime);
          let oldTime = new Date(props.data.domainEndTime).getTime()
          let newTime = new Date(state.formData.date[0]).getTime()
          if (oldTime >= newTime) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        },
        message: `有效期的开始时间需晚于域名到期时间`
      }],
    }
    const search = inject('search')
    const close = inject('close')

    function submit(isClose) {
      state.formRef.validate().then(_ => {
        state.formData.startTime = state.formData.date[0] + ' 00:00:00'
        state.formData.endTime = state.formData.date[1] + ' 23:59:59'
        const data = {
          renewType: 1,
          shopRenewDTOS: [state.formData]
        }
        renew(data).then(_ => {
          ElMessage.success('续费成功')
          state.formRef.resetFields()
          props.upDataRow && props.upDataRow()
          search()
          props.data.domainTime = state.formData.endTime
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
