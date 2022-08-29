<!--
* @Descripttion: Vango ERP toShelve 移入搁置
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div id="toShelve">
    <el-dialog
      title="请选择搁置原因"
      v-model="dialogVisible"
      width="600px"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <el-radio-group v-model="shelveReson.default">
        <el-radio
          v-for="item in shelveReson.list"
          :key="item.id"
          :label="item.label"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" 
            >取 消</el-button
          >
          <el-button type="primary" @click="ok" >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { shelveReson } from '@/assets/js/staticData'
import { orderDetailHooks } from '@/views/order/orderManagement/util/orderHooks.js'
export default {
  props: {
    orderData: Object
  },
  emits:['toShelveBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      shelveReson
    })
    // 获取按钮操作数据
    function getHookData() {
      const { packageId } = props.orderData
      if (props.orderData.packageLogistics) {
        const { trackNumber, trackType, logistics } =
          props.orderData.packageLogistics
        return {
          packageId,
          trackNumber,
          trackType,
          logistics
        }
      } else {
        return {
          packageId,
          trackNumber: null,
          trackType: null,
          logistics: null
        }
      }
    }
    const hookData = getHookData()
    function handleClose() {
      emit('toShelveBack', false)
    }
    function handleOk(){
        emit('toShelveBack', true)
    }
    function ok() {
      orderDetailHooks(hookData).shelveIn(
        state.shelveReson.default,
        handleOk
      )
    }
    return {
      ...toRefs(state),
      handleClose,
      ok
    }
  }
}
</script>
<style lang='scss' scoped>
#toShelve {
  :deep(.el-dialog__body) {
    width: 80%;
    margin: 0 auto;
  }
  :deep(.el-radio__label) {
    width: 165px;
  }
}
</style>