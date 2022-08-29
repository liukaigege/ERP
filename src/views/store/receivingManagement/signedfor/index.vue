<template>
  <div class="signedforBox">
    <el-affix :offset="110" target=".signedforBox">
      <div class="tabs">
        <el-button :class="{active:form.timeControl=='1'}" @click="tabsChange('1')">
          <span>今日待签</span><br />
          <span>({{dataNum.oneDay || 0}})</span>
        </el-button>
        <el-button :class="{active:form.timeControl=='4'}" @click="tabsChange('4')">
          <span>明日待签</span><br />
          <span>({{dataNum.todayDay || 0}})</span>
        </el-button>
        <el-button :class="{active:form.timeControl=='2'}" @click="tabsChange('2')">
          <span>近3日待签</span><br />
          <span>({{dataNum.threeDay || 0}})</span>
        </el-button>
        <el-button :class="{active:form.timeControl=='3'}" @click="tabsChange('3')">
          <span>全部待签</span><br />
          <span>({{dataNum.allDay || 0}})</span>
        </el-button>
      </div>
    </el-affix>
    <div class="operation">
      <div>
        仓库名称： <el-select v-model="form.warehouseId">
          <el-option label="万众智谷仓库" value="1">
          </el-option>
        </el-select>
        物流方式：
        <el-select v-model="form.name" clearable>
          <el-option :label="item.nameCn" :value="item.nameCn" :key="item.id" v-for="item in logisticList"> </el-option>
        </el-select>
        <el-button style="margin-left:20px" type="primary" @click="search">查询</el-button>
        <el-button style="margin-left:20px" type="primary" @click="exportSign">导出</el-button>
      </div>
      <div>
        <span @click="vxeTable.setAllRowExpand(true),expend=true" :class="{switch:true,switchcheck:expend}">展开<i class="el-icon-arrow-down"></i></span>
        <span @click="vxeTable.clearRowExpand(),expend=false" :class="{switch:true,switchcheck:!expend}">收起<i class="el-icon-arrow-up"></i></span>
      </div>
    </div>
    <div>
      <vxe-table :data="tableData" align="center" :expand-config="{labelField: 'expand',iconOpen:'el-icon-arrow-down',iconClose:'el-icon-arrow-left'}" ref="vxeTable">
        <vxe-column field="trackNum" title="运单号" width="">
          <template #default="{row}">
            <el-tooltip placement="top" :offset="10">
              <template #content>
                <a style="color: #fff" v-copy="row.trackNum">复制</a>
              </template>
              <span :title="row.trackNum"> {{row.trackNum}}</span>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column field="name" title="物流方式" width=""> </vxe-column>
        <vxe-column field="ordersLogisticses" title="物流轨迹" width="400" v-if="['1','4'].includes(form.timeControl)" align="center">
          <template #default="{row}">
            <div v-for="item in row.ordersLogisticses" :key="item.trackNum" style="font-size:12px">
              <div>
                <span>{{item.name}}：</span>
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="item.trackNum">复制</a>
                  </template>
                  <span style="margin-right:8px;color:#409EFF">{{item.trackNum}}</span>
                </el-tooltip>
                <span v-if="item.trackStatus == 1">已签收</span>
                <span v-if="item.trackStatus == 0">未签收 <span style="margin-right:8px;color:#409EFF">预计{{item.estimateArrivalTime?.split(' ')[0]}}送达</span></span>
              </div>
              <div v-if="item.trackInfo" class="logist-info">
                <div class="context textOverflow" @click="()=>{trackNum = item.trackNum;showIframe = true}">{{item.trackInfo[0].context}}</div>
                <span>》</span>
              </div>
            </div>

          </template>
        </vxe-column>
        <vxe-column field="purchaseUser" title="采购员" width="120"> </vxe-column>
        <vxe-column field="supplierType" title="供货商" width="">
          <template #default="{row}">
            <div class="textOverflow_2 " :title="row.supplierName">{{row.supplierName}}</div>
          </template>
        </vxe-column>
        <vxe-column field="purchaseOrderNumber" title="采购单号" width="">
          <template #default="{row}">
            <el-tooltip placement="top" :offset="10">
              <template #content>
                <a style="color: #fff" v-copy="row.purchaseOrderNumber">复制</a>
              </template>
              <div class="order-number" :title="row.purchaseOrderNumber"> {{row.purchaseOrderNumber}}</div>
            </el-tooltip>
            <div class="order-remark">
              <el-popover placement="top" :width="800" trigger="hover" v-for="(item, index) in row.packageRemarkTypes" :key="index" @after-enter="getRemarkDetail(row.id, item.id)">
                <template #reference>
                  <div class="remark-label" :style="{ backgroundColor: item.color }">
                    {{ item.word }}
                  </div>
                </template>
                <el-table :data="remarkList" :header-cell-style="{ background: '#F5F7FA', color: '#000', 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" fit>
                  <el-table-column min-width="300" property="remark" label="内容"></el-table-column>
                  <el-table-column width="170" property="createTime" label="时间"></el-table-column>
                  <el-table-column width="90" property="remarkTypeName" label="类型"></el-table-column>
                  <el-table-column width="90" property="createByName" label="操作人"></el-table-column>
                </el-table>
              </el-popover>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="boxesNum" title="箱数" width="60"> </vxe-column>
        <vxe-column field="skuType" title="包裹SKU种类" width="150"> </vxe-column>
        <vxe-column field="totalNum" width="200">
          <template #header>
            <p>采购总数量</p>
            <p>（{{purchaseTotal}}）</p>
          </template>
          <template #default="{row}">
            <p>{{row.totalNum}}</p>
          </template>
        </vxe-column>
        <vxe-column field="" title="" width="30" type="expand">
          <template #content="{row}">
            <div class="goods-card-box">
              <div class="goods" v-for="item in row.Skulist" :key="item.sku">
                <el-popover placement="right-start" trigger="hover" width="auto" class="imgBox">
                  <el-image style="width: 200px; height: 200px" :src="item.mainIng" fit="contain"></el-image>
                  <template #reference>
                    <div style="width:100px;display:flex;justify-content: center;">
                      <el-image style="width: 100px; height: 100px;" :src="item.mainIng" fit="contain">
                      </el-image>
                    </div>
                  </template>
                </el-popover>
                <div class="goods-info">
                  <div class="left">
                    <p class="textOverflow" :title="item.goodsName">{{item.goodsName}}</p>
                    <p>{{item.skuValue}}</p>
                    <p>{{item.sku}}</p>
                    <p>{{item.skuCode}}</p>
                  </div>

                  <div class="right">
                    <span>X {{item.goodsCount}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="flex-pagination page-fixed">
      <div>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="[10,20,30,40,100]" :page-size="page.pageSize" small layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount">
      </el-pagination>
    </div>
    <logisticsIframe v-if="showIframe" @closeEvent="showIframe = false" :trackNum="trackNum" />
  </div>
</template>

<script>
import { nextTick, onActivated, onMounted, reactive, toRefs, watch } from 'vue'
import {
  waitSignList,
  waitSignListCount,
  queryPurchaseTotal,
  exportAll//导出待签收
} from '@/api/store.js'
import { remarkDetail } from '@/api/purchase/purchase.js'
import { useRoute } from 'vue-router'
import { ivtLogisticses } from '@/api/purchase/purchase'
import logisticsIframe from '@/views/purchase/purchaseManagement/purchaseOrder/components/iframe.vue'
export default {
  name: 'signedfor',
  components: { logisticsIframe },
  setup() {
    const route = useRoute()
    const state = reactive({
      form: {
        timeControl: '1',
        warehouseId: '1', // 仓库
        name: ''
      },
      dataNum: {},
      expend: false,
      vxeTable: null,
      tableData: [],
      logisticList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      showIframe: false,
      trackNum: null,
      purchaseTotal: null,
      remarkList: []
    })

    ivtLogisticses().then(res => {
      state.logisticList = res.data
    })
    onActivated(() => {
      if (route.params.timeControl) {
        state.form.timeControl = route.params.timeControl
      }
      search()
    })

    function tabsChange(val) {
      state.form.timeControl = val
      state.page.pageNo = 1
      state.page.pageSize = 10
      state.expend = false
      nextTick(() => {
        search()
      })
    }

    function search() {
      let data = {
        page: state.page,
        ...state.form
      }
      waitSignList(data).then(res => {
        state.tableData = res.data.dataList
        state.tableData.forEach(item => {
          item.supplierName = `【${{ 1: '合作供应商', 2: '1688', 3: '淘宝', 4: '拼多多' }[item.supplierType]}】${item.supplierName}`
          item.Skulist.forEach(v => {
            if (v.skuValue) {
              v.skuValue = JSON.parse(v.skuValue).map(c => c.speVal).join('-')
            }
          })
          item.ordersLogisticses?.forEach(v => {
            if (v.trackInfo) v.trackInfo = JSON.parse(v.trackInfo)
          })
          item.packageRemarkTypes = !item.packageRemarkTypes ? [] : item.packageRemarkTypes
        })
        state.page = Object.assign(state.page, res.data.page)
        nextTick(() => {
          state.vxeTable.setAllRowExpand(state.expend)
        })
      })
      waitSignListCount().then(res => {
        state.dataNum = res.data
      })
      let query = {
        ...state.form
      }
      queryPurchaseTotal(query).then(res => {
        state.purchaseTotal = res.data
      })
    }

    function handleSizeChange(e) {
      state.page.pageSize = e

      search()
    }

    function handleCurrentChange(e) {
      state.page.pageNo = e
      search()
    }
    //新增导出
    function exportSign() {
      exportAll({ timeControl: state.form.timeControl }).then(res => {
        window.open(res.data)
      })
    }
    //备注详情
    function getRemarkDetail(id, remarkTypeId) {
      remarkDetail({ id, remarkTypeId }).then(res => {
        const { code = 0, data = [] } = res
        state.remarkList = code == 200 ? data : []
      }).catch(error => {
        state.remarkList = []
      })
    }

    return {
      ...toRefs(state),
      tabsChange,
      handleSizeChange,
      handleCurrentChange,
      exportSign,
      search,
      getRemarkDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.signedforBox {
  background-color: #fff;
  padding: 15px;
  padding-bottom: 40px;
}

.operation {
  margin: 10px 0 26px;
  display: flex;
  justify-content: space-between;
}

.tabs {
  padding: 15px 0;
  background-color: #fff;

  .el-button {
    height: 80px;
  }

  .active {
    color: #fff;
    background-color: #409eff;
  }
}

.switch {
  cursor: pointer;
  margin-left: 16px;

  &:hover {
    font-size: 18px;
    color: #1890ff;
  }
}

.switchcheck {
  font-size: 18px;
  color: #1890ff;
}

.order-number {
  line-height: 1;
}
.order-remark {
  display: flex;
  flex-wrap: wrap;
}

.remark-label {
  padding: 0px 5px;
  border-radius: 4px;
  margin: 10px 0 0 10px;
  color: #fff;
  min-width: 24px;
  text-align: center;
}

.goods-card-box {
  background-color: #f8f8f9;
  padding: 15px;
  padding-bottom: 7px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 4px;
  // flex-wrap: wrap;
  // justify-content: space-between;
}

.goods {
  width: 24.5%;
  min-width: 390px;
  margin-bottom: 8px;
  display: flex;
  border: 1px solid #d2d2d2;
  padding: 8px;
  background-color: #fff;

  .goods-info {
    flex: 1;
    display: flex;
  }

  .left {
    width: 220px;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.logist-info {
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.45);
  .context {
    flex: 1;
    cursor: pointer;
  }
}
</style>
