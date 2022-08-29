<template>
  <div>
    <div class="header">
      <span>仓库名称：</span>
      <el-select v-model="form.warehouseId"  clearable>
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="choose">
        <el-tabs v-model="status" @tab-click="handleClick">
          <el-tab-pane label="待入库" name="1"> </el-tab-pane>
          <el-tab-pane label="已入库" name="2"> </el-tab-pane>
        </el-tabs>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="搜索内容：">
            <el-input
              
              clearable
              v-model="form.searchText"
              placeholder="请输入采购单号/商品名称/商品SKU"
              maxlength="200"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="onSubmit"
              >查询</el-button
            >
            <el-button  @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tabel">
      <vxe-table
        highlight-hover-row
        border
        auto-resize
        max-height="600"
        align="center"
        ref="xTable1"
        :data="dataList"
        :span-method="colspanMethod"
        :cell-style="cellStyle"
        :scroll-y="{ enabled: false }"
      >
        <vxe-column field="supplierType" width="700" title="商品信息">
          <template #header><span>商品信息</span> </template>
          <template #default="{ row }">
            <div class="cell-header" v-if="row.orderItemsFlag">
              <el-tooltip placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.purchaseOrderNumber">
                    复制
                  </p>
                </template>
                <div class="cell-header--id">{{ row.purchaseOrderNumber }}</div>
              </el-tooltip>
              <div class="cell-header--supplierName">
                <span :title="row.supplierName" class="supplierName">
                  供应商:【{{ partnerType(row) }}】{{ row.supplierName }}</span
                >
                <span style="margin-left: 40px"
                  >最新到货时间：{{
                    row.newArrivalTime ? row.newArrivalTime : '无'
                  }}</span
                >
              </div>
              <div class="cell-header-submitTime">
                下单时间： {{ row.submitTime }}
              </div>
            </div>
            <div v-else class="mainImg">
              <div class="left">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.orderItem.mainImg"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 70px; height: 70px"
                      :src="row.orderItem.mainImg"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="center">
                <el-tooltip placement="top-start">
                  <template #content>
                    <p style="cursor: pointer" v-copy="row.orderItem.goodsName">
                      复制
                    </p>
                  </template>
                  <h3 :title="row.orderItem.goodsName">
                    {{ row.orderItem.goodsName }}
                  </h3>
                </el-tooltip>
                <div
                  class="labelTag"
                  v-for="(item, index) in parseJson(row.orderItem.skuValue)"
                  :key="index"
                >
                  <span>{{ item.spe }}</span
                  >:
                  <span>{{ item.speVal }}</span>
                </div>
                <el-tooltip placement="top-start">
                  <template #content>
                    <p style="cursor: pointer" v-copy="row.orderItem.skuCode">
                      复制
                    </p>
                  </template>
                  <div>
                    {{ row.orderItem.skuCode }}
                  </div>
                </el-tooltip>
              </div>
              <div class="right">
                X
                <span class="purchaseQuantity"
                  >{{ row.orderItem.purchaseQuantity }} </span
                ><span v-if="row.orderItem.returnNum">
                  - {{ row.orderItem.returnNum }}</span
                >
              </div>
            </div>
          </template>
        </vxe-column>

        <vxe-column field="storageTime" title="最新入库时间">
          <template #default="{ row }">
            <p
              v-for="(item, index) in storageTimeList(
                row.orderItem.storageTime
              )"
              :key="index"
            >
              {{ item }}
            </p>
          </template>
        </vxe-column>
        <vxe-column title="入库信息" field="areaNums">
          <template #default="{ row }">
            <div class="areaNums">
              <p>
                <span>拣货区：</span><span>{{ areaNums('拣货区', row) }}</span>
              </p>
              <p>
                <span>次品区：</span
                ><span style="color: #ff0000">{{
                  areaNums('次品区', row)
                }}</span>
              </p>
              <p>
                <span>收货暂存区：</span
                ><span>{{ areaNums('收货暂存区', row) }}</span>
              </p>
              <p>
                <span>未入库：</span
                ><span style="color: #70b603">{{
                  row.orderItem.notWarehousedNum
                }}</span>
              </p>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" class-name="option" width="150">
          <template #default="{ row }">
            <el-button type="text"  @click="openDetail(row)"
              >详情</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <Detail v-if="isshow" :detailsId="detailsId" @dialogClose="dialogClose" />
    <ErpPage @update-data="updateData" :total="total" />
  </div>
</template>
<script setup>
import ErpPage from '@/components/erpPage/index.vue'
import Detail from './detail/index.vue'
import { reactive, toRefs, onMounted, computed } from 'vue'
import { purchaseWarehouses } from './composables/api.js'
const options = [
  {
    label: '万众智谷仓库',
    value: '1'
  }
]

const state = reactive({
  form: {
    warehouseId: '1',
    searchText: '',
    status: 1,
    page: {
      pageNo: 1,
      pageSize: 10
    }
  },
  status: '1',
  isshow: false,
  dataList: [],
  detailsId: '',
  total: 0
})

const onSubmit = () => {
  purchaseWarehouses(state.form).then(res => {
    if (res.code == 200) {
      state.dataList = res.data.dataList
      state.total = res.data.page.totalCount
      getTableList()
    } else {
      ElMessage.error(res.message)
    }
  })
}
function openDetail(row) {
  state.isshow = true
  state.detailsId = row.orderItem.id
}
function dialogClose() {
  state.isshow = false
}
function updateData(v) {
  state.form.page = v
  console.log(v)
  onSubmit()
}
function resetForm() {
  state.form.searchText = ''
  onSubmit()
}
// 合并单元格方法
function colspanMethod(row) {
  const { rowIndex, columnIndex } = row
  if (row.row.orderItemsFlag) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 4 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

//单元格样式
function cellStyle({ row, column }) {
  if (row.orderItemsFlag) return { backgroundColor: '#FAFAFA' }
}
// 生成假数据
function getTableList() {
  let arr = []
  state.dataList.forEach((item, index) => {
    if (item.id) {
      arr.push({ ...item, orderItemsFlag: true })
      item.orderItems?.forEach(v => {
        arr.push({ orderItem: v, orderItemsFlag: false, id: item.id })
      })
    }
  })
  state.dataList = arr
}
function storageTimeList(v) {
  return v?.split(',')
}
const partnerType = computed(() => ({ supplierType }) => {
  //供应商类型 1合作供应商 2 1688 3淘宝 4拼多多
  switch (supplierType) {
    case 1:
      return '合作供应商'
    case 2:
      return '1688'
    case 3:
      return '淘宝'
    case 4:
      return '拼多多'
  }
})
function handleClick() {
  state.form.status = Number(state.status)
  state.form.page.pageNo = 1
  state.form.page.pageSize = 10
  resetForm()
}
function parseJson(v) {
  return JSON.parse(v)
}
function areaNums(val, { orderItem }) {
  if (orderItem.areaNums) {
    const element = orderItem.areaNums.find(item => {
      return item.name == val
    })
    return element?.num || 0
  } else {
    return 0
  }
}
onMounted(() => {
  onSubmit()
})

const { form, isshow, dataList, detailsId, status, total } = toRefs(state)
</script>
<style lang="scss" scoped>
.header {
  background: #fff;
  padding: 24px 30px 0 30px;
}
.choose {
  margin-top: 24px;
  border-top: 1px #eee dotted;
  padding-top: 10px;
}
.tabel {
  margin-top: 24px;
  background: #fff;
  padding: 24px 32px;
  .cell-header {
    display: flex;
    text-align: left;
    .cell-header--id {
      flex-basis: 20%;
    }
    .cell-header--supplierName {
      flex-basis: 60%;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
      }
      .supplierName {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 500px;
      }
    }
    .cell-header-submitTime {
      flex-basis: 20%;
      text-align: right;
    }
  }
  .mainImg {
    display: flex;
    .left {
      width: 70px;
      height: 70px;
      display: flex;
      align-content: center;
      justify-content: center;
      background: #fff;
      flex-basis: 70px;
      margin-right: 10px;
      position: relative;
      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .center {
      width: 450px;
      flex-basis: 450px;
      text-align: left;
      h3 {
        width: 450px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
      }
      div {
        span {
          margin-right: 8px;
          margin-bottom: 6px;
        }
        margin-bottom: 5px;
      }
    }
    .right {
      width: 150px;
      flex-basis: 150px;
      display: flex;
      align-items: center;
      padding-left: 15px;
      span {
        font-size: 18px;
        color: #aaaaaa;
      }
      .purchaseQuantity {
        color: #fd4c60ff;
        padding: 0 5px;
      }
    }
  }
  .areaNums {
    display: flex;
    flex-wrap: wrap;
    p {
      width: 50%;
      flex-basis: 50%;
    }
  }
}
</style>