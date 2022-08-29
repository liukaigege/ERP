<!--
* @Descripttion: Vango ERP dissolution 解除匹配关系
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="确认解除商品匹配关系"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose(false)"
    :close-on-click-modal="false"
  >
    <div><i class="el-icon-warning"></i> 确认解除当前发货商品的配对关系？</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { dissolutionGoods } from '@/api/order/orderDetail'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  props: {
    packageStatus: Number,
    packageSkuId: Number,
    packageSkuIdSku: String
  },
  emits: ['dissolutionBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true
    })
    function handleClose(val) {
      emit('dissolutionBack', val)
    }
    function ok() {
      dissolutionGoods({
        packageSkuId: props.packageSkuId,
        sku: props.packageSkuIdSku,
        status: props.packageStatus //（待审核传0  待处理传1）
      }).then(res => {
        if (res.code == 200) {
          //   解除商品匹配关系成功
          ElMessage.warning({ message: '解除商品匹配关系成功' })
          handleClose(true)
        } else {
          ElMessage.warning({ message: res.message })
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
.redColor {
  color: #f56c6c;
}
.el-icon-warning {
  color: #e6a23c;
}
</style>