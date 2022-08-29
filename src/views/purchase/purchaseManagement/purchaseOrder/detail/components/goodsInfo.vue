<template>
  <div class="page">
    <div class="headBox">
      <div>商品信息</div>
      <div v-if="customization == 1">
        <el-button type="text" @click="jumpOrderInformation()">查看订单信息</el-button>
      </div>
    </div>
    <div class="contentBox">
      <el-table :data="props.info.skuInfo" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
        <el-table-column label="商品信息" width="400px">
          <template #default="{ row }">
            <div class="flex">
              <el-image style="width: 70px; height: 70px" :src="row.skuImage" fit="contain"></el-image>
              <div class="tag1" v-if="row.goodAttribute == 2">相似</div>
              <div class="tag2" v-if="row.goodAttribute == 3">替代</div>
              <div class="right">
                <div class="goodsName textOverflow" :title="row.sku">{{row.sku}}</div>
                <div class="goodsName textOverflow_2" :title="row.goodsName">{{row.goodsName}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购报价/上次采购价">
          <template #default="{ row }">
            <div>￥{{row.purchasePrice}}/{{row.lastPurchasePrice?'￥':'-'}}{{row.lastPurchasePrice}}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template #default="{ row }">
            <div>￥{{route.query.type == 3 ? 0 : row.price}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="['0', '1', '2'].includes(route.query.status) ? '采购数量/已入库' : '采购数量/已入库/已退数量'">
          <template #default="{ row }">
            <div v-if="['0', '1', '2'].includes(route.query.status)">{{row.purchaseQuantity}}/{{row.storageQuantity}}</div>
            <div v-else>{{row.purchaseQuantity}}/{{row.storageQuantity}}/{{row.returnQuantity}}</div>
          </template>
        </el-table-column>
        <el-table-column label="配件金额" v-if="customization == 1">
          <template #default="{row}">
            <div ><span v-if="row.partSwitch==1">¥</span> {{row.partSwitch==0?'-':row.partsPrice}}</div>
            <el-button type="text"  :disabled="row.partSwitch==0?true:false" @click="lookPartsDetails(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="应付/已付">
          <template #default="{ row }">
            <div>￥{{route.query.type == 3 ? 0 : +row.totalAmount}}/￥<span :style="{ 'color': +row.payAmount > +row.totalAmount && row.payAmount && row.totalAmount ? 'rgb(253, 76, 96)' : '' }">{{row.payAmount || '-'}}</span></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="customization == 1">
          <template #default="{ row }">
            <el-button type="text" @click="jumpOrderInformation(row.id)">查看订单信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <look-parts-detail :partId="partId" v-if="showPartsDetails" @closeEvent="closeEvent" />
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import lookPartsDetail from './lookPartsDetail.vue'
import { useRoute, useRouter } from 'vue-router'
let route = useRoute()
let router = useRouter()
let { customization, purchaseOrderNumber } = route.query
let data = reactive({
  showPartsDetails: false,
  partId: null
})
let props = defineProps({
  info: {
    type: Object,
    default: {
      skuInfo: []
    }
  },
})
function closeEvent() {
  data.showPartsDetails = false
}
function lookPartsDetails(row) {
  data.partId = row.id
  data.showPartsDetails = true
}

function jumpOrderInformation(id) {
  let query = {
    purchaseOrderNumber: purchaseOrderNumber,
    purchaseOrderItemId: id,
    detailBack: '1',
    id: route.query.id,
    customization: route.query.customization,
    status: route.query.status,
    type: route.query.type
  }
  router.push({ name: 'orderInformation', query })
}
const { showPartsDetails, partId } = toRefs(data)
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  margin-bottom: 24px;
  border-radius: 2px;
  .headBox {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    height: 55px;
    line-height: 55px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    border-bottom: 1px solid #e9e9e9;
  }
  .contentBox {
    padding: 18px 24px;
    .flex {
      display: flex;
      position: relative;
      .tag1,
      .tag2 {
        position: absolute;
        left: 35px;
        top: 0px;
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
        width: 270px;
        text-align: left;
        margin-left: 10px;
      }
    }
  }
}
</style>
