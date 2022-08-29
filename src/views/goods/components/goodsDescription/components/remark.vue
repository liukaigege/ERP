<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="报价备注"
      v-model="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="close"
    >
      <span>{{ purchaseRemark }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="close">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  props: {
    purchaseRemark: String
  },
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true
    })
    function close() {
      state.dialogVisible = false
      emit('close', false)
    }
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>
<style lang='scss' scoped>
</style>