<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false">
  <el-form-item label="插件名称:" prop="pId">
    <el-select v-model="formData.pId" filterable class="w360" @change="pluginChange">
      <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="插件到期时间:">
    <el-input v-model="pluginEndTime" disabled class="w360"></el-input>
  </el-form-item>
  <el-form-item label="续费金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243"></el-input>
    <el-select v-model="formData.company" class="w109" @change="data.amount=''">
      <el-option label="美元" :value="0"></el-option>
      <el-option label="元" :value="1"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="有效期:" prop="date">
    <el-date-picker class="w360" unlink-panels v-model="formData.date" type="daterange" value-format="YYYY-MM-DD" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间">
    </el-date-picker>
  </el-form-item>
</el-form>
</template>

<script>
import { onMounted, reactive, toRefs, inject } from 'vue'
import { shopDetail, renew } from '@/api/goods/shop.js'
import { requiredValue, moneyRules } from '@/views/shop/shopRules/rules.js'
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
      unitList: [],
      pluginEndTime: '',
      formData: {
        pId: "",
        shopId: props.data.shopId,
        pluginName: "",
        company: 0,
        amount: "",
        type: 0,
        startTime: "",
        endTime: ""
      }
    })
    onMounted(() => {
      shopDetail({ shopId: props.data.shopId }).then(res => {
        state.unitList = res.data.shopPlugin
      })
      state.formData.shopId = props.data.shopId
    })

    const rules = {
      amount: moneyRules(state.formData, '请输入续费金额'),
      date: [
        requiredValue('请选择有效期'),
        {
          validator: (rule, value, callback) => {

            let oldTime = new Date(state.pluginEndTime).getTime()
            let newTime = new Date(state.formData.date[0]).getTime()
            if (oldTime >= newTime) {
              return callback('有效期的开始时间需晚于' + state.pluginEndTime)
            } else {
              return callback()
            }
          },
          trigger: ['blur', 'change']
        }
      ],
      pId: [requiredValue('请选择续费插件')]
    }

    function pluginChange() {
      state.unitList.forEach(item => {
        if (item.id == state.formData.pId) {
          state.pluginEndTime = item.endTime
          state.formData.pluginName = item.name
        }
      })
    }
    const search = inject('search')
    const close = inject('close')

    function submit(isClose) {
      state.formRef.validate().then(_ => {
        state.formData.startTime = state.formData.date[0] + ' 00:00:00'
        state.formData.endTime = state.formData.date[1] + ' 23:59:59'
        const data = {
          renewType: 3,
          shopRenewDTOS: [state.formData]
        }
        renew(data).then(_ => {
          ElMessage.success('续费成功')
          props.upDataRow && props.upDataRow()
          state.formRef.resetFields()
          search()
          state.pluginEndTime = ''
          
          if (isClose) {
            close()
          } else {
            shopDetail({ shopId: props.data.shopId }).then(res => {
              state.unitList = res.data.shopPlugin
            })
          }
        })
      })
    }
    return {
      ...toRefs(state),
      rules,
      pluginChange,
      submit
    }
  }
}
</script>

<style>
</style>
