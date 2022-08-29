<!--
 * @Descripttion: 'order 补发赠品'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="orderContainer">
    <el-form :model="order" label-width="90px" :inline="true">
      <!-- <el-form-item label="订单号：" :style="widthStyle">
        <el-input
          v-model="order.orderId"
          
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item :style="widthStyle"> </el-form-item>
      <el-form-item label="包裹号：" :style="widthStyle">
        <el-input
          v-model="order.packageId"
          
          :readonly="true"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="店铺：" :style="widthStyle">
        <el-input
          disabled
          v-model="shopName"
          
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item :style="widthStyle"> </el-form-item>
      <el-form-item label="订单类型：" :style="widthStyle">
        <el-input v-model="order.typeName"  disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, toRefs,computed } from 'vue'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    console.log('ww',props.data)
    const state = reactive({
      order: props.data,
      widthStyle: 'width:33.33%;margin-right:0;'
    })
    const shopName = computed(()=>props.data.source+'/'+props.data.tempDomain)
    return {
      ...toRefs(state),
      shopName
    }
  }
}
</script>
<style lang="scss" scoped>
.orderContainer {
  width: 70%;
  margin: 0 15%;
  padding-top: 20px;
}
</style>