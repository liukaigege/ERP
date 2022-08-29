<!--
 * @Descripttion: 'custom.vue'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="customContainer">
    <el-form :model="order" :rules="orderRules" label-width="100px" :inline="true">
      <el-form-item label="客户姓名：" prop="name" :style="widthStyle">
        <el-input v-model="order.name"  :maxlength="60"></el-input>
      </el-form-item>
      <el-form-item :style="widthStyle"> </el-form-item>
      <el-form-item label="邮箱：" :style="widthStyle">
        <el-input v-model="order.email"  disabled :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone" :style="widthStyle">
        <el-input v-model="order.phone"  :maxlength="60"></el-input>
      </el-form-item>
      <el-form-item :style="widthStyle"> </el-form-item>
      <el-form-item label="邮编：" prop="postcode" :style="widthStyle">
        <el-input v-model="order.postcode"  :maxlength="40"></el-input>
      </el-form-item>
      <el-form-item label="国家：" prop="countryEn" :style="widthStyle">
        <el-select
          v-model="order.countryEn"
          style="width: 100%"
          placeholder="请选择国家"
          
          filterable
        >
          <el-option
            v-for="item in countryList"
            :key="item.countryEnName"
            :label="item.countryName"
            :value="item.countryEnName"
          >
          </el-option>
          <el-option
            v-for="item in countryList"
            :key="item.countryEnName"
            :label="item.countryEnName"
            :value="item.countryEnName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="州/省：" :style="widthStyle">
        <el-input v-model="order.state"  :maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="城市：" :style="widthStyle">
        <el-input v-model="order.city"  :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="公司：" :style="widthStyle">
        <el-input v-model="order.company"  :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item :style="widthStyle"> </el-form-item>
      <el-form-item label="税号：" :style="widthStyle">
        <el-input v-model="order.taxNum"  :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="地址1：" :style="longWidthStyle">
        <el-input v-model="order.street1"  :maxlength="300"></el-input>
      </el-form-item>
      <el-form-item label="地址2：" :style="longWidthStyle">
        <el-input v-model="order.street2"  :maxlength="300"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, toRefs, watch } from 'vue'
import { getCountries } from '@/api/order/orderDetail.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    const state = reactive({
      order: props.data,
      widthStyle: 'width:33.33%;margin-right:0;',
      longWidthStyle: 'width:67%;',
      countryList: [],
      orderRules: {
        name: [{ required: true, message: '请输入客户姓名' }, { min: 1, max: 60, message: '最多60个字符' }],
        email: [{ required: true, message: '请输入客户邮箱' }, { min: 1, max: 100, message: '最多100个字符' }],
        phone: [{ required: true, message: '请输入联系电话' }, { min: 1, max: 60, message: '最多60个字符' }],
        postcode: [{ required: true, message: '请输入邮编' }, { min: 1, max: 40, message: '最多40个字符' }],
        state: [{ required: false, min: 0, max: 60, message: '最多60个字符' }],
        taxNum: [{ required: false, min: 0, max: 30, message: '最多30个字符' }],
        city: [{ required: false, min: 0, max: 200, message: '最多200个字符' }],
        countryEn: [{ required: true, message: '请选择国家' }],
        street1: [{
            validator: (rule, value, callback) => {
                data.formRef.clearValidate('order.street2')
                if ((state.order.street2 && !value) || value) {
                    callback()
                } else {
                    callback(new Error('请输入收货地址'))
                }
            }
        }],
        street2: [{
            validator: (rule, value, callback) => {
                data.formRef.clearValidate('order.street1')
                if ((state.order.street1 && !value) || value) {
                    callback()
                } else {
                    callback(new Error('请输入收货地址'))
                }
            }
        }]
      }
    })
    //获取国家列表country
    getCountries()
      .then(res => {
        if (res.code == 200) {
          state.countryList = res.data
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
      
    
    watch(() => state.order, () => context.emit('changeOrder', state.order))

    return {
      ...toRefs(state)
    }
  }
}
</script>
<style lang="scss" scoped>
.customContainer {
  width: 70%;
  margin: 0 15%;
  padding-top: 20px;
}
</style>