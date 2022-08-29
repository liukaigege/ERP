<template>
<el-dialog v-model="show" width="540px" @close="close">
  <div class="form-item-flex">
    <p>收件人姓名：{{data.receiverName}}</p>
    <p>手机号：{{data.phoneNum}}</p>
  </div>
  <p> 收货地址:{{data.shippingAddress}}</p>
  <el-table :data="infoData.trackInfo" border stripe v-if="tableShow">
    <el-table-column prop="wayBillNum" label="运单号" align="center" />
    <el-table-column prop="logisticsName" label="物流方式" align="center" />
    <el-table-column prop="freightPrice" label="运费(￥)" align="center" />
  </el-table>
  <div class="remask">
    <p style="width:50px">备注：</p>
    <el-input type="textarea" :placeholder="infoData.remark"  clearable rows="4" readonly></el-input>
  </div>
  <template #footer>
    <el-button  @click="close">关闭</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { exceptionDetail } from '../composables/api.js'
export default {
  props: {
    data: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      infoData: {},
      tableShow: false
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent', 'infoShow')
      }, 500)
    }
    onMounted(() => {
      exceptionDetail({
        serialNumber: props.data.serialNumber
      }).then(res => {
        state.infoData = res.data
        state.tableShow = res.data.trackInfo.length > 0
        console.log(state.infoData.trackInfo);
      })
    })
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-table__cell) {
  padding: 5px 0;
}

.remask {
  display: flex;
  margin-top: 12px;
}

.form-item-flex {
  display: flex;
  p+p {
    margin-left: 24px;
  }
}
p{
  margin-bottom: 6px;
}
</style>
