<!--
* @Descripttion: Vango ERP faild.vue 手动出入库错误返回弹框
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      :title="inOut ? '出库失败' : '入库失败'"
      v-model="faildShow"
      width="1000px"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <div class="headerReason">
          <i class="el-icon-error"></i>
          {{
            inOut
              ? '以下出库单号商品出库失败，失败原因：库存数据更新，货架位可用库存不足'
              : '以下入库单号商品入库失败，请设置货架位或调整库存'
          }}
        </div>
        <vxe-table
          highlight-hover-row
          border
          auto-resize
          max-height="500"
          align="center"
          :data="errorList"
          :expand-config="{ showIcon: false }"
        >
          <vxe-column
            field="serialNumber"
            :title="inOut ? '出库单号' : '入库单号'"
            width="10%"
          >
          </vxe-column>
          <vxe-column title="货品名称/SKU" width="30%">
            <template #default="{ row }">
              <div>
                <div>{{ row.goodsName }}</div>
                <div>{{ row.skuId }}</div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="speVal" title="规格值" width="20%"> </vxe-column>
          <vxe-column field="areaName" title="仓库分区" width="20%">
          </vxe-column>
          <vxe-column
            field="shelfGridName"
            v-if="inOut"
            title="货架位"
            width="20%"
          >
          </vxe-column>
          <vxe-column field="reason" v-else title="失败原因" width="20%">
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="faildShow = false">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
export default {
  props: {
    inOut: Number,
    errorList: Array
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      faildShow: true
    })
    function handleClose() {
      state.faildShow = false
      proxy.$parent.faildShow = false
    }
    function ok() {
      handleClose()
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
.headerReason {
  border: 1px solid #ffa39e;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: #fff1f0;
  line-height: 24px;
  margin-bottom: 20px;
  .el-icon-error {
    color: #ff4d4f;
  }
}
</style>