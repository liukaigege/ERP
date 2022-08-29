<!--
* @Descripttion: Vango ERP qureyDetail
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="查看"
    v-model="dialogVisible"
    width="700px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div class="dialogContainer">
      <div v-for="(item, index) in detailInfo" :key="index">
        <el-form
          :model="item"
          class="demo-form-inline demo-ruleForm headerForm"
          :inline="true"
        >
          <el-form-item label="包裹号：">
            <div class="twoLine" :title="item?.packageId">{{ item?.packageId || '-' }}</div>
          </el-form-item>
          <el-form-item label="运单号：">
            <div class="twoLine" :title="item?.trackId">{{ item?.trackId || '-' }}</div>
          </el-form-item>
        </el-form>
        <div class="dialogTable">
          <el-table :data="item?.skuList">
            <el-table-column prop="skuName" label="平台SKU" align="center">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="goodName"
              label="商品中文名称"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-form
        :model="detailInfo"
        class="demo-form-inline demo-ruleForm headerForm"
        :inline="false"
      >
        <el-form-item label="备注：">
          <div>{{ detailInfo[0]?.remark || '无' }}</div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { getRefundDetail } from '../composables/api'
export default {
  props: {
    refundId: String
  },
  emits: ['closeBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true,
      detailInfo: null
    })
    getRefundDetail({ refundId: props.refundId }).then(res => {
      if (res.code == 200) {
        state.detailInfo = res.data
      }
    })
    // 取消弹框
    function handleClose() {
      state.dialogVisible = false
      emit('closeBack', false)
    }

    return {
      ...toRefs(state),
      handleClose
    }
  }
}
</script>
<style lang='scss' scoped>
.twoLine {
  width: 210px;
  height: 32px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.dialogTable {
  background-color: wheat;
  max-height: 400px;
  overflow: auto;
  border: 1px solid #ebeef5;
  margin: 0 0 25px;
}
.dialogContainer {
  max-height: 400px;
  overflow: auto;
	box-sizing: border-box;
	padding: 0 10px;
}
</style>
