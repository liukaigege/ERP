<template>
  <div class="page">
    <div class="headBox">异常信息</div>
    <div class="contentBox">
      <vxe-table v-bind="state.tableOptions" :data="props.info" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column title="异常单号" width="160">
          <template #default="{ row }">
            <div v-if="!row.flag" class="tdContent blue">
              <div> {{row.serialNumber}}</div>
              <div>{{row.orderId}}</div>
            </div>
            <div v-else class="tdFooter textOverflow" :title="row.remark">{{row.remark}}</div>
          </template>
        </vxe-column>
        <vxe-column title="异常商品" width="300">
          <template #default="{ row }">
            <div class="flex">
              <el-image style="width: 70px; height: 70px" :src="row.mainImage" fit="contain"></el-image>
              <div class="tag1" v-if="row.goodAttribute == 2">相似</div>
              <div class="tag2" v-if="row.goodAttribute == 3">替代</div>
              <div class="right">
                <div class="goodsName textOverflow">{{row.skuCode}}</div>
                <div class="goodsName">
                  <span v-for="(item, index) in JSON.parse(row.spe)" :key="index">{{item.spe}}: {{item.speVal}}</span>
                </div>
                <div class="goodsName textOverflow" v-if="customization == 1"><span style="color:#409EFF;cursor: pointer;" @click="showCustomInfo(row)">定制</span></div>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="purchaseOrderNumber" title="采购单号" width="150">
          <template #default="{ row }">
            <div>{{row.purchaseOrderNumber || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="trackNum" title="运单号" width="150">
          <template #default="{ row }">
            <div>{{row.trackNum || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column title="异常类型" width="80">
          <template #default="{ row }">
            <div v-if="row.type == 1">入库缺货</div>
            <div v-if="row.type == 3">多收</div>
          </template>
        </vxe-column>
        <vxe-column title="采购员" width="80">
          <template #default="{ row }">
            <div>{{row.purchaseUserName || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column title="入库员" width="80">
          <template #default="{ row }">
            <div>{{row.inputUserName || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="异常数量" width="80">
          <template #default="{ row }">
            <div>{{row.quantity}}件</div>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="时间">
          <template #default="{ row }">
            <div>{{row.createTime || '-'}}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <custom-info v-if="state.show" @closeEvent="state.show = false" :info="rowInfo"></custom-info>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import CustomInfo from './abnormalInfo.vue'
import { useRoute } from 'vue-router'
let route = useRoute()
let { customization } = route.query
let props = defineProps({
  info: {
    type: Object,
    default: {}
  }
})
let colspanMethod = ({ row, columnIndex }) => {
  if (row.flag) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 10 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
function showCustomInfo(row) {
  state.show = true
  state.rowInfo = row
}
let state = reactive({
  show: false,
  rowInfo: {},
  tableOptions: {
    spanMethod: colspanMethod,
    border: 'inner',
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true
  }
})
let { rowInfo } = toRefs(state)
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  margin-bottom: 24px;
  border-radius: 2px;
  .headBox {
    padding: 0 24px;
    height: 55px;
    line-height: 55px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    border-bottom: 1px solid #e9e9e9;
  }
  .contentBox {
    padding: 16px 24px;
    .tdFooter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 44px;
      padding: 0 20px;
      text-align: left;
      color: #afada2;
      background-color: rgba(255, 251, 230, 0.7);
    }
    .flex {
      display: flex;
      position: relative;
      .tag1,
      .tag2 {
        position: absolute;
        left: 40px;
        top: -5px;
        border-radius: 4px;
        padding: 0 2px;
        background-color: #fff;
      }
      .tag1 {
        color: #f6a439;
        border: 1px solid #f6a439;
      }
      .tag2 {
        color: #da1931;
        border: 1px solid #da1931;
      }
      .right {
        width: 200px;
        text-align: left;
        margin-left: 10px;
      }
    }
  }
}
:deep(tbody) {
  .vxe-body--row {
    position: relative;
    .vxe-cell {
      min-height: 21px;
    }
  }
}
.blue {
  color: #1890ff;
}
</style>
