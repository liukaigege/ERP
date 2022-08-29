<template>
  <div class="stockInfo">
    <div class="header">
      <div class="typeBox" v-for="item in options" :key="item.nameCn">
        <span>{{item.nameCn}}：</span>
        <span :class="{type:true,check:!item.speValues.some(val=>val.checked)}" @click="check(item,'all')">不限</span>
        <span v-for="val in item.speValues" :key="val" :class="{type:true,check:val.checked}" @click="check(val)" :title="val.nameCn">{{val.nameCn}}</span>
      </div>
    </div>
    <div class="tableBox">
      <vxe-table :data="copyData" border align="center" max-height="540">
        <vxe-column field="skuCode" title="SKU编码" width="150px" fixed="left">
        </vxe-column>
        <vxe-column field="skuValueStr" title="规格" width="120px" fixed="left">
        </vxe-column>
        <vxe-column field="stockOnPassage" title="在途库存" width="100px">
        </vxe-column>
        <vxe-colgroup title="在仓库存">
          <vxe-column field="pickingAreaStock" title="拣货区" width="130px">
            <template #default="{row}">
              <p> {{row.pickingAreaStock}}</p>
              <div class="stock-type">
                <span>普:{{row.commonPickingAreaStock}}</span>
                <span>定:{{row.customizedPickingAreaStock}}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="defectiveAreaStock" title="次品区" width="100px">
          </vxe-column>
          <vxe-column field="stagingAreaStock" title="收货暂存区" width="120px">
          </vxe-column>
          <vxe-column field="amountInWarehouse" title="在仓总计" width="100px">
          </vxe-column>
          <vxe-column field="newWarehouseAge" title="库龄（天）" width="100px">
          </vxe-column>
        </vxe-colgroup>
        <vxe-column field="totalStockQuantity" width="100px">
          <template #header>
            <span>总库存</span>
            <el-tooltip effect="light" content="在途库存+拣货区" placement="top"><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{row}">
            {{row.totalStockQuantity}}
          </template>
        </vxe-column>
        <vxe-column field="occupyStockQuantity" title="占用库存" width="100px">
          <template #header>
            <span>占用库存</span>
            <el-tooltip effect="light" content="订单占用库存" placement="top"><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{row}">
            {{row.occupyStockQuantity}}
          </template>
        </vxe-column>
        <vxe-column field="netStockQuantity" title="净库存" width="100px">
          <template #header>
            <span>净库存</span>
            <el-tooltip effect="light" content="拣货区-占用库存" placement="top"><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{row}">
            {{row.netStockQuantity}}
          </template>
        </vxe-column>
        <vxe-column field="outStockQuantity" title="缺货数量" width="100px">
          <template #header>
            <el-tooltip effect="dark" placement="top">
              <template #content>
                <span>标准订单待处理+运单号申请+待打单(缺货)</span>
              </template>
              <span> 缺货数量 <i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column field="stockTurnoverDays" title="库存周转天数" width="120px">
          <template #header>
            <span>库存周转天数</span>
            <el-tooltip effect="light" content="总库存/近七日均销" placement="top"><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{row}">
            {{row.stockTurnoverDays}}
          </template>
        </vxe-column>
        <vxe-column field="fiveStockInFuture" title="未来5天库存" width="120px">
          <template #header>
            <span>未来5天库存</span>
            <el-tooltip effect="light" content="总库存-今日缺货-（近七日均销）*5" placement="top"><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{row}">
            {{row.fiveStockInFuture}}
          </template>
        </vxe-column>
        <vxe-column field="weight" title="重量（g）" width="100px">
        </vxe-column>
        <vxe-colgroup field="a" title="商品体积">
          <vxe-column field="length" title="长（cm）" width="80px">
          </vxe-column>
          <vxe-column field="width" title="宽（cm）" width="80px">
          </vxe-column>
          <vxe-column field="height" title="高（cm）" width="80px">
          </vxe-column>
        </vxe-colgroup>
        <vxe-column field="size" title="操作" width="100px" fixed="right">
          <template #default="{row}">
            <span @click="infoOpen(row)" style="color:#1890FF;cursor: pointer;">详情</span>
          </template>
        </vxe-column>
      </vxe-table>

    </div>
    <stockInfoDialog v-if="infoShow" :tabsData="tabsData" @closeEvent="infoShow = false" />
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { stockInfo } from '@/api/commodity.js'
import { useRoute } from 'vue-router'
import stockInfoDialog from './components/stockInfoDialog.vue'
export default {
  components: {
    stockInfoDialog
  },
  setup() {
    const route = useRoute()
    const state = reactive({
      options: [],
      data: [],
      copyData: [],
      tabsData: null,
      infoShow: false
    })

    onMounted(() => {

      stockInfo({
        goodsId: route.query.goodsId,
        skuIdList: typeof route.query.skuIdList == 'object' ? route.query.skuIdList : route.query.skuIdList.split(","),
        warehouseId: route.query.warehouseId
      }).then(res => {
        state.data = res.data.purchaseGoodsSkuVOList
        state.copyData = state.data
        state.copyData.forEach(item => {
          item.skuValueStr = ''
          if (item.skuValue && JSON.parse(item.skuValue) && JSON.parse(item.skuValue).length) {
            item.skuValue = JSON.parse(item.skuValue)
            item.skuValueStr = item.skuValue.reduce((a, b) => {
              return typeof a == 'object' ? a.speVal + '-' + b.speVal : a + '-' + b.speVal
            })
            if (typeof item.skuValueStr == 'object') {
              item.skuValueStr = item.skuValueStr.speVal
            }
          }
        })
        state.options = res.data.skuSpeList
      })
    })

    function check(val, status) {
      // 第一个参数为数据，第二个参数为不限
      if (status) {
        val.speValues.map(e => e.checked = false)
      } else {
        val.checked = !val.checked
      }
      state.copyData = []
      state.data.forEach(item => {
        let flag = true
        item.skuValue.forEach(e => {
          console.log(checkItem.value)
          if (checkItem.value[e.speEn].length) {
            if (!checkItem.value[e.speEn].includes(e.speVal)) {
              flag = false
            }
          }
        })
        if (flag) {
          state.copyData.push(item)
        }
      })
    }

    let checkItem = computed(() => {
      let obj = {}
      state.options.forEach(item => {
        console.log(item, '......')
        obj[item.nameEn] = item.speValues.filter(val => val.checked).map(val => val.nameCn)
      })
      return obj
    })

    function infoOpen(row) {
      state.tabsData = row
      state.infoShow = true
    }
    return {
      ...toRefs(state),
      check,
      checkItem,
      infoOpen
    }
  }
}
</script>

<style lang="scss" scoped>
.stockInfo {
  background-color: #fff;
  padding: 24px;
}

.header {
  margin-bottom: 16px;
}

.typeBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .type {
    display: inline-block;
    max-width: 80px;
    min-width: 60px;
    padding: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid #d9d9d9;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
  }

  .check {
    background-color: #1890ff;
    color: #fff;
    border: 1px solid #1890ff;
  }
}

.stock-type {
  display: flex;
	justify-content: space-between;
}
.typeBox + .typeBox {
  margin-top: 8px;
}
</style>
