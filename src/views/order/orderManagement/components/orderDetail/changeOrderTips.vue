<!--
 * @Descripttion: '已发货订单修改信息提示 changeOrderTips.vue'
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-14 00:00:00
-->
<template>
  <div class="" v-if="tipsShow">
    <el-dialog
      title="提示"
      v-model="tipsShow"
      width="420px"
      :before-close="close"
    >
      <div class="tipsContent">
        <i class="el-icon-warning"></i>
        确认修改？内容修改后必须[更换运单号]才能生效！
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" >取 消</el-button>
          <el-button type="primary"  @click="sure">继 续</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref, toRaw, getCurrentInstance } from 'vue'
export default {
  props: {
    showTips: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const state = reactive({
      tipsShow: props.showTips
    })
    function close() {
      context.emit('closeTips', false)
    }
    function sure() {
      context.emit('sureTips', true)
    }

    return {
      ...toRefs(state),
      close,
      sure
    }
  }
}
</script>
<style lang="scss" scoped>
.tipsContent {
  line-height: 30px;
}
:deep(.el-icon-warning) {
  font-size: 24px;
  margin-right: 10px;
  color: #e6a23c;
  position: relative;
  top: 4px;
}
</style>