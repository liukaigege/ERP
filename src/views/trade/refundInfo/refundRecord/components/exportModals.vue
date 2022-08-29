<!--
* @Descripttion: Vango ERP exportModal.vue 导出
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="导出"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div class="exportModal-content">
      <el-radio v-model="exportType" :label="1">按当前勾选导出</el-radio>
      <el-radio v-model="exportType" :label="2">按当前查询导出</el-radio>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { exportList } from '../composables/api'
import { ElMessage } from 'element-plus'
export default {
  props: {
    searchInfos: Object,
    selectData: Array
  },
  emits: ['closeBack'],
  setup(props, { emit }) {
    const {
      timeType,
      queryTimeStart_queryTimeEnd,
      reasonId,
      refundDuty,
      serachType,
      serachValue,
      refundState
    } = props.searchInfos
    const state = reactive({
      dialogVisible: true,
      exportType: 1
    })
    // 取消弹框
    function handleClose() {
      emit('closeBack', false)
    }
    function ok() {
      if (state.exportType == 1 && props.selectData.length == 0)
        return ElMessage.warning({ message: '请选择需要导出的订单' })
      exportList({
        exportType: state.exportType,
        refundIdList: props.selectData,
        timeType,
        queryTimeStart_queryTimeEnd,
        reasonId,
        refundDuty,
        serachType,
        serachValue,
        refundState
      }).then(res => {
        if (res.data.result) {
          handleClose()
					window.open(res.data.msg, '_blank')
        }
      })
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
.exportModal-content {
  text-align: center;
}
</style>
