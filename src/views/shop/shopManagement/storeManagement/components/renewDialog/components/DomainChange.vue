<template>
<el-form :model="formData" ref="formRef" :rules="rules" label-width="150px" :inline="false" :validate-on-rule-change="false">
  <el-form-item label="主域名:" prop="domain">
    <el-input v-model="formData.domain" class="w360" :disabled="formData.domainStatus == 1" @change="formData.domain =formData.domain.replace(/[ ]|[\r\n]/g,'')"></el-input>
  </el-form-item>
  <el-form-item label="金额:" prop="amount">
    <el-input v-model="formData.amount" class="w243" clearable :disabled="formData.domainStatus == 1"></el-input>
    <el-select v-model="formData.company" class="w109" @change="formData.amount = ''">
      <el-option label="美元" :value="0">
      </el-option>
      <el-option label="元" :value="1">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="域名状态:" prop="domainStatus">
    <el-radio v-model="formData.domainStatus" :label="0">启用</el-radio>
    <el-radio v-model="formData.domainStatus" :label="1" :disabled="domainIdentical" @change="disabledChange">停用</el-radio>
  </el-form-item>
  <el-form-item label="启用时间:" v-if="formData.domainStatus === 0" prop="domainTime">
    <el-date-picker v-model="formData.domainTime" type="date" class="w360" value-format="YYYY-MM-DD 00:00:00" :validate-event="false">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="停用时间:" v-if="formData.domainStatus === 1" prop="domainTime">
    <el-date-picker v-model="formData.domainTime" type="date" class="w360" value-format="YYYY-MM-DD 00:00:00" :validate-event="false">
    </el-date-picker>
  </el-form-item>

</el-form>
<tips :data="tipsData" v-if="tipsShow" />
</template>

<script>
import { onMounted, reactive, toRefs, computed, provide, inject } from 'vue'
import { requiredValue, moneyRules, ruleUrl } from '@/views/shop/shopRules/rules.js'
import { changeCheck, change, domainIsRepeat } from '@/api/goods/shop.js'
import tips from './tips.vue'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {},
    upDataRow: {}
  },
  components: { tips },
  setup(props) {
    const state = reactive({
      formRef: null,
      formData: {
        shopId: '',
        amount: '',
        company: 1,
        domain: props.data.domain.replace(/^(http|https):\/\//, ''),
        domainStatus: '',
        domainTime: ''
      },
      tipsData: [],
      tipsShow: false
    })
    onMounted(() => {
      state.formData.domain = props.data.domain.replace(/^(http|https):\/\//, '')
      state.formData.shopId = props.data.shopId
    })
    // 
    const rules = {
      domain: ruleUrl('请输入主域名'),
      amount: moneyRules(state.formData, '请输入金额'),
      domainStatus: [
        { required: true, message: '请选择域名状态', trigger: 'change' }
      ],
      domainTime: [
        { required: true, message: `请选择${state.formData.domainStatus==0?'启用':'停用'}时间`, trigger: "change" },
        {
          validator: (rule, value, callback) => {
            let domainOpenTime = props.data.domainOpenTime
            let domainEndTime = props.data.domainEndTime
            let nowTime = new Date(state.formData.domainTime).getTime()
            let oldOpenTime = new Date(domainOpenTime).getTime()
            let oldStartTime = new Date(props.data.domainStartTime).getTime()
            let oldEndTime = new Date(domainEndTime).getTime()
            let nowMonthTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-01 00:00:00`).getTime()
            domainIsRepeat({ domain: 'https://' + state.formData.domain }).then(res => {
              if (typeof res.data == 'object') {
                domainOpenTime = res.data.openTime
                domainEndTime = res.data.endTime
                oldOpenTime = new Date(domainOpenTime).getTime()
                oldEndTime = new Date(domainEndTime).getTime()
              }
              if (state.formData.domainStatus == 0) {
                if (nowTime < nowMonthTime) {
                  callback('启用时间不得早于当前月份')
                } else if (nowTime <= oldOpenTime) {
                  callback('启用时间需晚于' + domainOpenTime.split(' ')[0])
                } else if (nowTime > oldEndTime) {
                  callback(`当前域名有效期的到期时间是${domainEndTime.split(' ')[0]}`)
                } else {
                  callback()
                }
              } else {
                // 停用逻辑 不得早于域名的开始时间 不得晚于域名的到期时间
                if (nowTime < oldStartTime || nowTime > oldEndTime) {
                  callback(`停用时间区间${props.data.domainStartTime.split(' ')[0]}~${props.data.domainEndTime.split(' ')[0]}`)
                } else {
                  callback()
                }
              }
            })

          },
          trigger: 'change'
        },
      ]
    }

    const domainIdentical = computed(() => {
      return state.formData.domain != props.data.domain.replace(/^(http|https):\/\//, '')
    })

    function submit(isClose) {
      state.formRef.validate().then(_ => {
        let fd = { ...state.formData }
        fd.domain = 'https://' + fd.domain
        fd.domainTime = fd.domainTime
        const data = {
          changeType: 1,
          shopChangeDTOS: [fd]
        }
        changeCheck(data).then(res => {
          if (typeof res.data == 'string') {
            ElMessage.success('变更成功')
            state.formRef.resetFields()
            props.upDataRow && props.upDataRow()
            search()
            if (isClose) {
              close()
            }
          } else {
            console.log(res.data);
            state.tipsData = res.data
            state.tipsShow = true
          }

        })
      })
    }
    const search = inject('search')
    const close = inject('close')

    function towSubmit(isClose) {
      let fd = { ...state.formData }
      fd.domain = 'https://' + fd.domain
      fd.domainTime = fd.domainTime + ' 00:00:00'
      change({
        changeType: 1,
        isBlock: 0,
        shopChangeDTOS: [fd]
      }).then(res => {
        ElMessage.success('变更成功')
        props.data.domain = state.formData.domain
        search()
        closeTips()
        if (isClose) {
          close()
        }
      })
    }
    provide('towSubmit', towSubmit)
    provide('closeTips', closeTips)

    function closeTips() {
      state.tipsShow = false
    }

    function disabledChange() {
      state.formData.amount = 0
    }
    return {
      ...toRefs(state),
      rules,
      domainIdentical,
      submit,
      towSubmit,
      closeTips,
      disabledChange
    }
  }

}
</script>

<style>

</style>
