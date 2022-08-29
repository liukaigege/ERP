<template>
  <div>
    <vxe-table v-bind="tableOptions" :data="props.exceptionTable" :loading="props.loading" ref="tableRef">
      <vxe-column title="异常单号" width="180">
        <template #default="{ row }">
          <el-tooltip placement="top" :offset="10">
            <template #content>
              <a style="color: #fff" v-copy="row.serialNumber">复制</a>
            </template>
            <a>{{row.serialNumber}}</a>
          </el-tooltip>
        </template>
      </vxe-column>
      <vxe-column title="异常商品" width="280">
        <template #default="{ row }">
          <div class="goodsInfo">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="row.skuImage" fit="contain"></el-image>
              <template #reference>
                <el-image style="width: 70px; height: 70px" :src="row.skuImage" fit="contain"></el-image>
              </template>
            </el-popover>
            <div class="right">
              <div class="textOverflow" style="display: block" :title="row.sku">{{row.sku}}</div>
              <div class="speBox textOverflow_2">
                <span v-for="(item, index) in JSON.parse(row.spe)" :title="item.spe+ ':' + item.speVal" :key="index">{{item.spe}}: {{item.speVal}}</span>
              </div>
              <div v-if="row.customization == 1">
                <span style="color:#409EFF;cursor: pointer;" @click="customInfo(row)">定制</span>
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="采购单号" width="150">
        <template #default="{ row }">
          <div :title="row.purchaseOrderNumber">{{row.purchaseOrderNumber}}</div>
        </template>
      </vxe-column>
      <vxe-column field="trackNum" title="运单号" width="140"></vxe-column>
      <vxe-column field="type" title="异常类型">
        <template #default="{ row }">
          <div v-if="row.type == '1'">入库缺货</div>
          <div v-if="row.type == '3'">多收</div>
        </template>
      </vxe-column>
      <vxe-column field="purchaseUserName" title="采购员"></vxe-column>
      <vxe-column field="inputUserName" title="入库员"></vxe-column>
      <vxe-column title="异常数量">
        <template #default="{ row }">
          {{row.quantity}}件
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="时间" width="200"></vxe-column>
      <vxe-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="disposeEvent(row)" :disabled="row.type == 3 && row.examineStatus == 1" v-permission="'purchaseOrder-dispose'">处理</el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <component :is="comptName[url]" :type="type" :id="id" :info="purchaseInfo" :customization="customization" :totalPrice="totalPrice" :serialNumber="serialNumber" @closeEvent="closeEvent" v-if="ifShow" exception/>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { commands } from 'vxe-table'
import Dispose from './dispose.vue'
import CustomInfo from './customInfo.vue'
let emit = defineEmits('refreshEvent')
let props = defineProps({
  exceptionTable: {
    type: Array,
    default: []
  },
  loading: { // 加载状态
    type: Boolean,
    default: false
  },
})
let state = reactive({
  ifShow: false,
  type: null,
  totalPrice: 0,
  id: '',
  serialNumber: null,
  url: null,
  purchaseInfo: {},
  customization: 0
})
let tableOptions = {
  autoResize: true,
  keepSource: true,
  align: 'center',
  highlightHoverRow: true,
  // showOverflow: true,
  rowConfig: { height: 100 },
  // height: 400,
  scrollY: { enabled: false }
}
let comptName = {
  Dispose,
  CustomInfo
}
// 处理
let disposeEvent = ({ type, quantity, price, serialNumber, id, customization }) => {
  state.url = 'Dispose'
  state.customization = customization * 1
  state.type = type
  state.totalPrice = quantity * price
  state.serialNumber = serialNumber
  state.id = id
  state.ifShow = true
}

// 关闭弹窗
let closeEvent = (value) => {
  state.ifShow = false
  if (value) emit('refreshEvent')
}
function customInfo(row) {
  state.url = 'CustomInfo'
  state.purchaseInfo = row
  state.ifShow = true
}
let { ifShow, type, totalPrice, serialNumber,purchaseInfo, id, url,customization } = toRefs(state)
</script>

<style lang="scss" scoped>
.goodsInfo {
  display: flex;
  // padding-left: 40px;
  .right {
    width: 170px;
    margin-left: 16px;
    text-align: left;
    .speBox {
      width: 170px;
      display: block;
      white-space: normal;
      span {
        margin-right: 10px;
      }
      :nth-last-of-type(1) {
        margin-right: 0;
      }
    }
  }
}
.purchaseOrderNumber {
  width: 90px;
}
.blue {
  color: #1890ff;
}
</style>
