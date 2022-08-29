<template>
<el-card class="box-card" shadow="never">
  <template #header>
    <div class="card-header">
      <span>收款方式</span>
    </div>
  </template>
  <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" :inline="true" >
    <div class="flex-form-item">
      <el-form-item label="信用卡:">
        <el-cascader v-model="creditCard" :options="payData.creditCard" placeholder="请选择信用卡" clearable :props="{label:'name',value:'name'}" @change="creditCardChange" class="w310"></el-cascader>
      </el-form-item>
      <el-form-item label="支付手续费:" v-if="formData.creditCard.creditCard" prop="creditCard.fee" :rules="rules.fee">
        <el-input v-model="formData.creditCard.fee" class="w204" ></el-input>
        <el-button class="w98" type="info" plain  disabled>%</el-button>
      </el-form-item>
    </div>
    <div class="flex-form-item">
      <el-form-item label="PayPal:">
        <el-select v-model="formData.paypal.paypalName" class="w310"  filterable placeholder="请选择PayPal" clearable @clear="formData.paypal.fee=''" @change="formData.paypal.fee=10">
          <el-option :key="item.name" :label="item.name" :value="item.name" v-for="item in payData.payPal"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付手续费:" v-if="formData.paypal.paypalName" prop="paypal.fee" :rules="rules.fee">
        <el-input v-model="formData.paypal.fee" class="w204"  disabled></el-input>
        <el-button class="w98" type="info" plain  disabled>%</el-button>
      </el-form-item>
    </div>
    <div class="flex-form-item">
      <el-form-item label="Alipay:">
        <el-select v-model="formData.locationCopy[0].account" class="w310"  placeholder="请选择Alipay" clearable @clear="()=>formData.locationCopy[0].fee = ''">
          <el-option :key="item.name" :label="item.name" :value="item.name" v-for="item in payData.Alipay"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付手续费:" v-if="formData.locationCopy[0].account" :prop="'locationCopy.'+0+'.fee'" :rules="rules.fee">
        <el-input type="number" v-model="formData.locationCopy[0].fee" class="w204" ></el-input>
        <el-button class="w98" type="info" plain  disabled>%</el-button>
      </el-form-item>
    </div>
    <div class="flex-form-item">
      <el-form-item label="Payssion:">
        <el-select v-model="formData.locationCopy[1].account" class="w310"  placeholder="请选择Payssion" clearable @clear="()=>formData.locationCopy[1].fee=''">
          <el-option :key="item.name" :label="item.name" :value="item.name" v-for="item in payData.Payssion"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付手续费:" v-if="formData.locationCopy[1].account" :prop="'locationCopy.'+1+'.fee'" :rules="rules.fee">
        <el-input type="number" v-model="formData.locationCopy[1].fee" class="w204" ></el-input>
        <el-button class="w98" type="info" plain  disabled>%</el-button>
      </el-form-item>
    </div>
  </el-form>
</el-card>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { paymentSelect } from '@/api/goods/shop.js'
import { fee } from '@/views/shop/shopRules/rules.js'
export default {
  props: {
    is_Submit: {
      type: Boolean,

    },
    isResetShop: Boolean
  },
  emits: ['submitStatus'],
  setup(props, ctx) {
    const state = reactive({
      formData: {
        creditCard: { //信用卡
          creditCard: '', // 卡商
          account: '', //卡号
          fee: ''
        },
        paypal: { //paypal
          paypalName: '',
          fee: ''
        },
        location: [ //在地支付

        ],
        locationCopy: [ //在地支付
          { locationName: 'Alipay', account: '', fee: '' },
          { locationName: 'Payssion', account: '', fee: '' }
        ]

      },
      formRef: '',
      payData: {},
      creditCard: '',

    })
    watch(() => props.isResetShop, val => {
      if (val) {
        state.formData = {
          creditCard: { //信用卡
            creditCard: '', // 卡商
            account: '', //卡号
            fee: ''
          },
          paypal: { //paypal
            paypalName: '',
            fee: ''
          },
          location: [ //在地支付

          ],
          locationCopy: [ //在地支付
            { locationName: 'Alipay', account: '', fee: '' },
            { locationName: 'Payssion', account: '', fee: '' }
          ]

        }
        state.creditCard = ''
        console.log(state.formData);
      }
    })
    onMounted(() => {
      paymentSelect().then(res => {
        res.data.forEach(item => {
          if (item.type) {
            item.children = []
          } else {
            item.type = res.data.filter(val => val.id == item.pid)[0].name
          }
        })
        const payData = {
          creditCard: res.data.filter(item => item.type == 1),
          payPal: res.data.filter(item => item.type == 'paypal'),
          Alipay: res.data.filter(item => item.type == 'Alipay'),
          Payssion: res.data.filter(item => item.type == 'Payssion')
        }
        console.log(payData);
        payData.creditCard.forEach(item => {
          item.children = res.data.filter(val => val.pid == item.id)
        })

        state.payData = payData
      })
    })
    // 监听提交校验事件
    watch(() => props.is_Submit, val => {
      state.formData.location = []
      if (val) {
        let flag = false
        state.formData.creditCard.creditCard != '' ? flag = true : ''
        state.formData.paypal.paypalName != '' ? flag = true : ''
        state.formData.locationCopy[0].account ? flag = true : ''
        state.formData.locationCopy[1].account ? flag = true : ''
        if (!flag) return ElMessage.error('请至少选择一个收款方式')
        state.formData.locationCopy.forEach(item => {
          if (item.account) {
            state.formData.location.push(item)
          }
        })
        state.formRef.validate().then(res => {
          if(!state.formData.creditCard.creditCard){
            state.formData.creditCard = null
          }
          if(!state.formData.paypal.paypalName){
            state.formData.paypal = null
          }
          ctx.emit('submitStatus', 'payment', state.formData)
        }).catch(res => {
          ctx.emit('submitStatus', 'payment', false)
        })
      }
    })

    const rules = {
      fee: fee('请输入手续费')
    }

    function change(e) {
      console.log(e);
    }

    function creditCardChange(e) { // 信用卡变化
      state.formData.creditCard.creditCard = ''
      state.formData.creditCard.account = ''
      if (e) {
        state.formData.creditCard.creditCard = e[0]
        state.formData.creditCard.account = e[1]
      }
    }

    return {
      ...toRefs(state),
      rules,
      change,
      creditCardChange,

    }

  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  width: 100px;
  height: 20px;
  top: 8px;
  z-index: 10;
  cursor: pointer;
}
</style>
