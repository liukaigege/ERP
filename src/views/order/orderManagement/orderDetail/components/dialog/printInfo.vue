<!--
* @Descripttion: Vango ERP printInfo
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="面单打印信息确认"
      v-model="dialogVisible"
      width="30%"
      @close="close"
      :show-close="false"
    >
      <div style="text-align: center">
        面单生成信息:(成功生成面单
        <span style="color: #1890ff">{{ printInfoData.successCount }}</span> 个,
        失败<span style="color: red">{{ printInfoData.errorCount }}</span>
        个)
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="dialogHandFailed" class="submitBtn"
            >打印失败</el-button
          >
          <el-button
            type="primary"
            @click="dialogHandOk"
            class="submitBtn"
            @click.enter="dialogHandOk"
            :disabled="btnDisabled"
            autofocus
            >打印完成</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import {
  printComplate,
  printComplateDeliverys
} from '@/api/order/orderManagement.js'
import { printFail, debounce } from '@/utils/tool'
export default {
  props: {
    printInfoData: Object,
    orderData: Object,
    isChangeLogist: String
  },
  emits: ['printInfoBack'],
  setup(props, { emit }) {
		console.log(props.printInfoData)
    const state = reactive({
      dialogVisible: true,
      btnDisabled: props.printInfoData.pdfUrl ? false : true
    })
    function close() {
      emit('printInfoBack', false)
    }
    const dialogHandOk = debounce(() => {
      const { uuid } = props.printInfoData
      if (props.isChangeLogist === 'true') {
        printComplateDeliverys({ uuid }).then(res => {
          if (res.code == 200) {
            emit('printInfoBack', true)
          }
        })
        return
      } // 如果是已交运待打单则走这个
      printComplate({ uuid, source: 0 }).then(res => {
        if (res.code == 200) {
          emit('printInfoBack', true)
        }
      })
    })
    function dialogHandFailed() {
      printFail(() => close())
    }
    return {
      ...toRefs(state),
      dialogHandFailed,
      dialogHandOk,
      close
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
