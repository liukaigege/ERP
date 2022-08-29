<template>
<div class="commodityBox">
  <!-- 操作部分start -->
  <div class="operation">
    <div class="left">
      <el-button type="primary" class="btn" @click="changePurchaser" v-permission="'changeUser'">更换采购人员</el-button>
      <el-button type="primary" class="btn" @click="exportGoods" v-permission="'exportGoods'">导出商品</el-button>
    </div>
    <div class="right">
      <el-button type="primary" @click="refreshTable">手动刷新</el-button>
    </div>
  </div>

  <div class="vxetableBox">
    <vxe-table :data="data" v-bind="tableOptions" ref="vxeTable" max-height="650px" :row-style="rowStyle" show-header-overflow @sort-change="sortChange" :loading="page.tableLoading">
      <vxe-table-column field="name16" title="" width="0">
      </vxe-table-column>
      <vxe-table-column field="id" width="322">
        <template #header>
          <div class="headerBox">
            <div class="po">
              <el-checkbox v-model="checkAll" :indeterminate="checkList.length > 0 && !checkAll" @change="checkAllEvent"></el-checkbox>
            </div>
            <div class="title">商品信息</div>
          </div>
        </template>
        <template #default="{ row }">
          <div class="titleBox" v-if="row.rowType!='parent'">

            <div class="checkAndSku">
              <el-checkbox v-model="row.checkAll" :indeterminate="row.indeterminate" @change="checkedChange(row)" style="margin-right:8px;">
                  <el-tooltip placement="top" :offset="10">
                      <template #content>
                        <a style="color: #fff" v-copy="row.purchaseGoodsSkuList? row.goodsId:row.skuCode">复制</a>
                      </template>
                      <p :class="row.purchaseGoodsSkuList?'':'text-row3'" :title="row.purchaseGoodsSkuList? row.goodsId:row.skuCode ">{{row.purchaseGoodsSkuList? row.goodsId:row.skuCode }}</p>
                  </el-tooltip>
                  <div style="margin-top:6px" v-if="!row.purchaseGoodsSkuList" >
                    <el-tooltip placement="top" :offset="10" >
                      <template #content>
                        <a style="color: #fff" v-copy="row.skuId">复制</a>
                      </template>
                        <p >{{row.skuId}}</p>
                    </el-tooltip>
                  </div>
                </el-checkbox>
              <div class="labelRow">
                <div v-if="row.purchaseGoodsSkuList">
                  【{{row.channelName}}】
                </div>
                <span v-for="item in  row.remarkTypeList" :key="item.id" :style="{color:'#FFF',backgroundColor:item.color,display:'block',width:'23px',borderRadius:'3px',marginRight:'5px'}">
                  <el-popover placement="top" trigger="hover" @show="proShow(item,row)" width="850">
                    <template #reference>
                      <span> {{item.word}}</span>
                    </template>
                    <el-table :data="proData" border stripe>
                      <el-table-column prop="content" label="内容" width="400" align="center">
                        <template #default="{row}">
                          <p :title="row.content" class="textOverflow">{{row.content}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="updateTime" label="时间" align="center"></el-table-column>
                      <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
                      <el-table-column prop="createUserName" label="操作人" align="center"></el-table-column>
                    </el-table>
                  </el-popover>
                </span>
              </div>

            </div>
          </div>
          <div class="goodsInfo" v-else>
            <el-image style="width: 80px; height: 80px;margin-right:8px" :src="row.mainImageUrl" fit="contain"></el-image>
            <div class="desc">
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.nameCn">复制</a>
                </template>
                <span class="text-row" :title="row.nameCn"> {{row.nameCn}}</span>
              </el-tooltip>
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.code">复制</a>
                </template>
                <span class="text-row" :title="row.code" style="text-align:left"> {{row.code}}</span>
              </el-tooltip>
              <div class="text-row labels" :title="row.labels">
                <el-tag type="danger" size="small" v-if="row.tortStatus == 2">侵</el-tag>
                <el-tag effect="dark" size="small" v-for="item in row.labels" :key="item">{{item}}</el-tag>
              </div>
            </div>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="skuValue" title="品类" width="140">
        <template #default="{row}">
          <p class="text-two" :title="row.categoryName" v-if="row.rowType"> {{row.categoryName}}</p>
          <p class="text-two" :title="row.skuValue" v-else>{{row.skuValue}}</p>
        </template>
      </vxe-table-column>
      <vxe-table-column field="supplierName" title="默认供应商" width="140">
        <template #default="{row}">
          <div v-if="row.partnerType">
            <p class="text-row3" :title="`【${supList[row.partnerType]}】${row.supplierName}`">【{{supList[row.partnerType]}}】</p>
            <p class="text-row3" :title="`【${supList[row.partnerType]}】${row.supplierName}`"><a :href="row.link||row.webAddress" target="_blank">{{row.supplierName}}</a></p>
          </div>
          <p v-else>-</p>
        </template>
      </vxe-table-column>
      <vxe-table-column field="purchasePrice" title="默认采购价(CNY)" width="100">
        <template #default="{row}">
          {{row.purchasePrice||'-'}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="purchaseUsername" title="采购人员" width="100">
        <template #default="{row}">
          {{row.purchaseUsername||'-'}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="1" title="近7日均销" width="102" sortable>
        <template #default="{row}">
          {{row.sevenAverageSales}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="2" title="当月总销" width="102" sortable>
        <template #default="{row}">
          {{row.monthTotalSales}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="3" a="1" title="在途库存" width="90" sortable>
        <template #default="{row}">
          {{row.stockOnPassage}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="4" title="在仓库存(拣货区库存)" width="100" sortable>
        <template #header>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <span>拣货区库存</span>
            </template>
            <span> 在仓库存 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>

        <template #default="{row}">
          {{row.stockInWarehouse}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="5" title="总库存" width="90" sortable>
        <template #default="{row}">
          {{row.totalStockQuantity}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="6" title="库龄(天)" width="75" sortable>
        <template #default="{row}">
          {{row.newWarehouseAge}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="7" title="缺货数量" width="80" sortable>
        <template #header>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <span>标准订单待处理+运单号申请+待打单(缺货)</span>
            </template>
            <span> 缺货数量 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template #default="{row}">
          {{row.outStockQuantity}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="netStockQuantity" title=" 净库存" width="80" >
      </vxe-table-column>
      <vxe-table-column field="stockTurnoverDays" title="库存周转天数(总库存/近7日均销)" width="80">
        <template #header>
          <el-tooltip effect="dark" placement="top">
            <template #content>
              <span>总库存/近7日均销</span>
            </template>
            <span> 库存周转天数 <i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template #default="{row}">
          {{row.stockTurnoverDays}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="name14" title="操作" width="60" fixed="right">
        <template #default="{row}">
          <span style="color:#1890FF;cursor: pointer;" @click="goodsInfo(row)" v-if="row.rowType=='parent'">详情</span>
        </template>
      </vxe-table-column>

    </vxe-table>
  </div>
  <div class="flex-pagination page-fixed">
    <div>
      <el-checkbox v-model="checkAll" :indeterminate="checkList.length > 0 && !checkAll" @change="checkAllEvent">已选择{{checkList.length}}条</el-checkbox>
    </div>
    <el-pagination @size-change="page.handleSizeChange" @current-change="page.handleCurrentChange" :current-page="page.pagination.currentPage" :page-sizes="page.pagination.pageSizes" :page-size="page.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.pagination.totalCount">
    </el-pagination>
  </div>
  <exportGoods v-if="exportGoodsShow" @closeEvent="exportGoodsShow=false" :skuIds="checkList" :goodsIdList="goodsIdList" :formData="page.formData" />
  <changePurchaser v-if="changePurchaserShow" @closeEvent="changePurchaserShow = false" :skuIds="checkList" @search="search" />
</div>
</template>

<script>
import { reactive, toRefs, onMounted, computed, watch, onActivated } from 'vue'
import { tableOptions, tableHeade, } from '../../js/tableOptions.js'
import { useRouter } from 'vue-router'
import exportGoods from './exportGoods.vue'
import changePurchaser from './changePurchaser.vue'
import { ElMessage } from 'element-plus'
import { getRemarkDetail } from '@/api/goods/quotation.js'
import { refresh } from '@/api/purchase/outOfStock.js'
import { deepCopy } from '@/utils/tool.js'
export default {
  components: { exportGoods, changePurchaser },
  emits: ['search'],
  props: {
    data: {},
    page: {}
  },
  setup(props, ctx) {
    const router = useRouter()
    const state = reactive({
      checkAll: false, // 全选状态
      checkList: [], // 当前选中的列表
      goodsIdList: [],
      vxeTable: null,
      exportGoodsShow: false,
      changePurchaserShow: false,
      proData: [],
      expend: false, // 是否为展开
    })

    let supList = {
      1: '合作供应商',
      2: '1688',
      3: '淘宝',
      4: '拼多多',
    }
    watch(() => props.data, val => {
      state.checkAll = false
      state.checkList = []
      props.data.forEach((item) => {
        item.checkAll = false
      })
    })
    onActivated(() => {
      props.data.forEach((item) => {
        item.checkAll = false
      })
    })
    const checkAllList = computed(() => { // 包含所有选中的skuId
      let list = []
      props.data.filter(item => item.rowType == 'title').forEach(item => {
        item.purchaseGoodsSkuList.forEach(val => {
          list.push(val.skuId)
        })
      })
      return list
    })

    function checkedChange(row) {
      console.log(row);
      let obj = null // 这个作为 父级的变量
      if (row.purchaseGoodsSkuList) { // 自身为父级
        obj = row
        obj.checkList = obj.checkAll ? obj.purchaseGoodsSkuList.map(item => {
          return {
            skuId: item.skuId,
            purchaseUser: item.purchaseUsername
          }
        }) : []
        obj.purchaseGoodsSkuList.forEach(item => item.checkAll = obj.checkAll) // 将子级同步父级状态
      } else { // 自身为子级
        obj = props.data.find(item => item.rowType == 'title' && row.goodsId == item.goodsId) //  获取父级
        row.checkAll ? obj.checkList.push({
          skuId: row.skuId,
          purchaseUser: row.purchaseUsername
        }) : obj.checkList = obj.checkList.filter(item => item.skuId != row.skuId) // 判断状态 为 true 则 新增 否则过滤掉
      }

      let list = [] // 选中的id容器
      let goodsIdList = []
      props.data.filter(item => item.rowType == 'title').forEach(item => {
        if (item.checkList.length) {
          list = [...list, ...item.checkList]
          goodsIdList = [...goodsIdList, item.goodsId]
        }
      })

      state.checkList = list // 获取所有选中的id
      state.goodsIdList = goodsIdList // 所有选中的商品编码
      console.log(state.checkList);
      obj.checkAll = obj.checkList.length == obj.purchaseGoodsSkuList.length // 判断父级是否全选状态
      obj.indeterminate = obj.checkList.length > 0 && obj.checkList.length != obj.purchaseGoodsSkuList.length // 判断父级是否半全选状态
      state.checkAll = state.checkList.length == checkAllList.value.length // 全段全选按钮是否为全选
    }

    function checkAllEvent(status) {
      props.data.filter(item => item.rowType == 'title').forEach((item) => {
        item.checkAll = status
        checkedChange(item)
      })
    }

    function exportGoods() { //导出商品
      state.exportGoodsShow = true

    }

    function changePurchaser() {
      if (!state.checkList.length) return ElMessage.error('请选择商品')
      state.changePurchaserShow = true
    }

    function search() {
      ctx.emit('search')
    }

    function goodsInfo(row) {

      router.push({
        name: 'commodityDetail',
        query: {
          goodsId: row.goodsId,
          skuIdList: row.purchaseGoodsSkuList.map(item => item.skuId),
          warehouseId: 1,
        }
      })
    }

    function proShow(item, row) {
      getRemarkDetail({
        goodsId: row.goodsId,
        typeId: item.remarkTypeId
      }).then(res => {
        state.proData = res.data
      })
      console.log(item, row);
    }

    function rowStyle({ row }) {
      if (!row.purchaseGoodsSkuList) {
        return { backgroundColor: '#f8f8f9' }
      }
    }

    function refreshTable() {
      refresh({
        warehouseId: props.page.warehouseId
      }).then(res => {
        props.page.search()
      })
    }

    function sortChange({ order, property }) {
      props.page.formData.orderField = property
      props.page.formData.orderBy = order
      props.page.search()
    }
    return {
      ...toRefs(state),
      tableOptions,
      checkedChange,
      checkAllEvent,
      tableHeade,
      exportGoods,
      checkAllList,
      changePurchaser,
      search,
      goodsInfo,
      proShow,
      supList,
      rowStyle,
      refreshTable,
      sortChange
    }
  }
}
</script>

<style lang="scss" scoped>
.text-row,
.text-row2,
.text-row3 {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-row {
  max-width: 200px;
}

.text-row3 {
  max-width: 250px;
}

.text-row2 {
  max-width: 150px;
}

.headerBox {
  display: flex;

  .title {
    flex: 1;
    text-align: center;
  }
}

.goodsInfo {
  display: flex;

  .el-tag+.el-tag {
    margin: 4px;
  }

  .desc {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.header-top {
  border: 1px solid #e8eaec;
  display: flex;

  .col+.col {
    border-left: 1px solid #e8eaec;
  }

  .col {
    display: flex;
    align-items: center;
    background-color: rgb(248, 248, 249);
    padding: 10px;
    height: 71px;
    box-sizing: border-box;

    .title {
      flex: 1;
      text-align: center;
      color: #606266;
      font-weight: bold;
    }
  }
}

.width-240 {
  width: 240px;
}

.width-102 {
  width: 102px;
}

.width-110 {
  width: 110px;
}

.width-100 {
  width: 100px;
}

.headerRow {
  color: red !important;
  font-size: 50px !important;
  position: absolute;
}

.switch {
  cursor: pointer;
  margin-left: 16px;

  &:hover {
    font-size: 18px;
    color: #1890FF;
  }
}

.switchcheck {
  font-size: 18px;
  color: #1890FF;
}

.operation {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;

  .left {
    .btn {
      margin-right: 6px;
    }
  }
}

.vxetableBox {
  background-color: #fff;
  padding: 24px;
}

.checkAndSku {
  display: flex;

  .text-row {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
}

::v-deep(.vxe-tree--btn-wrapper) {
  top: 63%
}

.text-two {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.commodityBox {
  ::v-deep(.vxe-body--column.col--ellipsis > .vxe-cell) {
    max-height: 96px;
  }

  ::v-deep(.vxe-header--row) {
    .vxe-cell {
      padding: 8px;
    }

    .vxe-cell--title,
    .vxe-cell {
      max-height: unset !important;
      overflow: unset !important;
      text-overflow: unset !important;
      white-space: unset !important;
    }
  }
}

.headerBox {
  .po {
    position: absolute;
    left: 10px;
  }
}

.labels {
  text-align: left;
}

.labelRow {
  display: flex;
  align-items: center;
}
::v-deep(.vxe-header--row){
  .col--fixed {
    height:82px;
  }
}
</style>
