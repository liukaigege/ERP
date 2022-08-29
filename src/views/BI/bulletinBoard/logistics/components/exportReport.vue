<template>
<el-dialog title="导出报表" v-model="show" width="30%" @close="close" :close-on-click-modal="false">
  <el-radio v-model="type" label="1" >导出统计报表</el-radio>
  <el-radio v-model="type" label="2" >导出明细数据</el-radio>
  
  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="exportDetail({type})">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { inject, reactive, toRefs } from 'vue'
export default {
  setup() {
    const state = reactive({
      show: true,
      type:'1'
    })
    const closeDialog = inject('closeDialog')
    const exportDetail = inject('exportDetail')
    function close() {
      state.show = false
      setTimeout(() => {
        closeDialog('exportReportShow')
      }, 500)
    }
    return {
      ...toRefs(state),
      close,
      exportDetail
    }
  }
}
</script>

<style>

</style>
