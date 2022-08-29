<template>
  <div class="order-information-block">
    <ErpNav title="订单信息" :goBack="goback" />
    <div class="form-class">
      <el-form :inline="true" :model="form" ref="formRef">
        <el-form-item label="搜索内容:">
          <el-select v-model="form.searchType" style="width:130px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in searchTypeOptions" :key="index"></el-option>
          </el-select>
          <el-input :placeholder="form.searchType == 4  ? '请输入要检索的内容' : `多个${searchTypeOptions.filter(item => item.value == form.searchType)[0].label}用逗号隔开`" style="width:320px;margin-left:10px" v-model="copySearchText" />
        </el-form-item>
        <el-form-item label="入库状态:">
          <el-select v-model="form.purchaseStatus" style="width:150px" clearable>
            <el-option label="未入库" :value="1" />
            <el-option label="部分入库" :value="2" />
            <el-option label="全部入库" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间:">
          <el-date-picker v-model="form.deliveryTimeStart_deliveryTimeEnd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels clearable>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="付款状态:">
          <el-select v-model="form.payStatus" style="width:150px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in payStatusOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队:" style="margin-left:16px">
          <elSelectTree :data="deptList" :treeProps="{value: 'deptId', label: 'deptName',children: 'children'}" :width="200" filterable @ok="getDeptId" ref="ElSelectTreeRef" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-class">
      <el-table :data="data" @selection-change="handleSelectionChange" ref="tableRef">
        <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
        <el-table-column label="商品信息" width="320px">
          <template #default="{ row }">
            <div class="goods-info">
              <div class="goods-images-container">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row?.mainImg" fit="contain"></el-image>
                  <template #reference>
                    <el-image class="ml-10" style="width: 80px; height: 80px" :src="row?.mainImg" fit="contain"></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="goods-content" style="width: 80%">
                <el-tooltip placement="top">
                  <template #content>
                    <p style="cursor: pointer" v-copy="row?.skuCode">
                      复制
                    </p>
                  </template>
                  <p :title="row?.skuCode" class="text-row">
                    {{ row?.skuCode }}
                  </p>
                </el-tooltip>
                <p>￥{{Number(row?.goodsPrice).toFixed(2)}}</p>
                <p v-if="row?.skuValue">
                  {{JSON.parse(row?.skuValue).map(v => v.spe +'：'+ v.speVal).join(' ')}}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" prop="orderId" width="200">
          <template #default="{row}">
            <el-tooltip effect="dark" placement="top-start">
              <template #content>
                <p style="cursor: pointer" v-copy="row.orderId">复制</p>
              </template>
              <p>{{ row.orderId }} </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="goodsQuantity" width="60"></el-table-column>
        <el-table-column label="到货数量" align="center" prop="arrivalQuantity" width="80"></el-table-column>
        <el-table-column label="配件金额" align="center" prop="partTotalPrice" width="100">
          <template #default="{row}">
            <p v-if="row.partSwitch==0">-</p>
            <p v-if="row.importStatus==1 && row.partSwitch">未导入</p>
            <p v-if="row.importStatus==3 && row.partSwitch">￥{{row.partTotalPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="入库时间" align="center" width="110">
          <template #default="{row}">
            {{row.deliveryTime || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" align="center" width="100">
          <template #default="{row}">
            {{payStatusOptions[row.payStatus].label}}
          </template>
        </el-table-column>

        <el-table-column prop="customValue" label="定制属性" align="center" :min-width="300">
          <template #default="{row}">
            <el-popover placement="left-end" trigger="hover" width="auto" v-if="row.customValue && row.customValue.length">
              <div>
                <div class="customValueList" v-for="(v,i) in row?.customValue" :key="i">
                  <p v-if="isImgString(v.value)">
                    {{v.field}}：
                    <el-popover placement="right-start" trigger="hover" width="auto">
                      <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                      <template #reference>
                        <el-icon style="font-size: 20px;position: relative;top: 3px;">
                          <PictureFilled />
                        </el-icon>
                      </template>
                    </el-popover>
                  </p>
                  <p v-else>{{v.field}}：{{v.value}}</p>
                </div>
              </div>
              <template #reference>
                <div class="customValueContainer" v-if="row.customValue && row.customValue.length">
                  <div class="customValueList" v-for="(v,i) in row?.customValue" :key="i">
                    <p v-if="isImgString(v.value)">
                      {{v.field}}：
                      <el-popover placement="right-start" trigger="hover" width="auto">
                        <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                        <template #reference>
                          <el-icon style="font-size: 20px;position: relative;top: 3px;">
                            <PictureFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </p>
                    <p v-else>{{v.field}}：{{v.value}}</p>
                  </div>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="orderRelId" label="二维码ID" align="center" width="140">
          <template #default="{row}">
            <el-tooltip effect="dark" placement="top-start">
              <template #content>
                <p style="cursor: pointer" v-copy="row.orderRelId">复制</p>
              </template>
              <p>{{ row.orderRelId }} </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="130">
          <template #default="{row}">
            <el-button type="text" @click="openCustomInfo(row)">查看定制信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex-pagination page-fixed">
      <div style="position: relative;">
        <el-button @click="goback">取消</el-button>
        <el-button type="primary" @click="batchSelect">确认选择</el-button>
      </div>
      <div>
        <el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
        </el-pagination>
      </div>
    </div>
    <customInfo @closeEvent="isShow = false" v-if="isShow" :info="purchaseInfo" />
  </div>
</template>

<script>
import { PictureFilled } from '@element-plus/icons-vue'
import customInfo from './components/customInfo'
import elSelectTree from "@/components/elSelectTree/index.vue"
import ErpNav from '@/components/erpNav/index.vue'
import { onMounted, reactive, ref, toRefs, nextTick, watch } from 'vue'
import { purchaseOfOrders } from '@/api/purchase/order'
import { getDepartmentList } from '@/api/user'
import { ElMessage } from 'element-plus'
import { renderCustomInfo, isImgString } from '@/utils/tool.js'

export default {
  components: {
    ErpNav,
    elSelectTree,
    customInfo,
    PictureFilled,
  },
  emits: ['closeEvent', 'fillPrice'],
  props: ["params"],
  setup(props, ctx) {
    const ElSelectTreeRef = ref(null)
    const tableRef = ref(null)
    const state = reactive({
      form: {
        searchType: 1,
        deptId: null,
        searchText: null,
        deliveryTimeStart: null,
        deliveryTimeEnd: null,
        payStatus: null, // 付款状态
        purchaseStatus: null,// 入库状态
        deliveryTimeStart_deliveryTimeEnd: [],
        isClose: 0
      },
      copySearchText: "",
      data: [],
      deptList: [],
      selectList: [],
      page: {
        pageSize: 100, //分页
        pageNo: 1 //分页
      },
      deleteFlag: false,
      purchaseInfo: {},
      isShow: false,
      paginationTotal: 0, //分页总数据条数
      paginationArr: [100, 200, 300, 400, 500], //分页每页选择条数默认数据
      searchTypeOptions: [{
        label: '商品SKU',
        value: 1
      },
      {
        label: '订单SKU',
        value: 2
      }, {
        label: '订单号',
        value: 3
      },
      {
        label: '二维码ID',
        value: 4
      }],
      payStatusOptions: [{
        label: '未申请',
        value: 0
      }, {
        label: '申请中',
        value: 1
      }, {
        label: '已付款',
        value: 2
      }]
    })

    const { purchaseOrderNumber, purchaseOrderItemId, checkedList, purchaseOrderItemIds, paymentItemIdList, isBatch } = props.params
    onMounted(() => {
      getDepartmentList().then(res => {
        state.deptList = res.data
      })
      if (purchaseOrderItemIds?.length && paymentItemIdList?.length) query()
    })

    function query() {
      let data = {
        page: state.page,
        purchaseOrderItemId,
        purchaseOrderNumber,
        purchaseOrderItemIds,
        paymentItemIdList
      }
      Object.assign(state.form, data)
      state.form.searchText = state.copySearchText
      if (state.form.searchType == 4) {
        let result
        try {
          result = JSON.parse(state.copySearchText)
        } catch {
          result = state.copySearchText
        }
        if (result.ivtPurchaseDetailId) {
          state.form.searchText = result.ivtPurchaseDetailId.toString()
        } else {
          const resultStr = result.toString()
          const symbolList = [',', '，', '[', ']', '。', '.', '?', '!', '%', '}{', '}"', '"{']
          if (symbolList.some(item => resultStr.indexOf(item) > -1)) return ElMessage.error('二维码ID格式不正确')
          state.form.searchText = resultStr
        }
      }
      purchaseOfOrders(state.form).then(res => {
        state.data = res.data.dataList
        state.data.forEach(item => {
          if (item.customValue) {
            const copyCustomValue = JSON.parse(item.customValue)
            item.customValue = renderCustomInfo(copyCustomValue, 2)
          } else {
            item.customValue = []
          }
          nextTick(() => {
            if (checkedList.length) {
              checkedList.forEach(it => {
                if (item.id == it) tableRef.value.toggleRowSelection(item, true)
              })
            }
          })

        })
        state.paginationTotal = res.data.page.totalCount
      })
    }

    function reset() {
      ElSelectTreeRef.value.init(false)
      state.page.pageSize = 100
      state.page.pageNo = 1
      state.form.searchType = 1
      state.form.searchText = ''
      state.form.deptId = null
      state.copySearchText = ''
      state.form.deliveryTimeStart_deliveryTimeEnd = []
      state.form.deliveryTimeStart = null
      state.form.deliveryTimeEnd = null
      state.form.payStatus = null // 付款状态
      state.form.purchaseStatus = null// 入库状态

      query()
    }
    function handleSelectionChange(rows) {
      state.selectList = rows
    }
    //分页
    const handleSizeChange = val => {
      state.page.pageSize = val
      state.page.pageNo = 1
      query()
    }
    const handleCurrentChange = val => {
      state.page.pageNo = val
      query()
    }
    function goback() {
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    function getDeptId(v) {
      state.form.deptId = v
    }
    function openCustomInfo(row) {
      state.isShow = true
      state.purchaseInfo = row
    }

    //复选框禁用
    function selectable(row) {
      // 付款状态payStatus 0未申请 1申请中 2已付款    row.importStatus == 1 && row.partSwitch情况下为未导入配件金额状态
      return !(row.payStatus || (row.importStatus == 1 && row.partSwitch))
    }

    // 确定选择
    function batchSelect() {
      if (!state.selectList.length) return ElMessage.warning('请勾选列表数据')
      // let sum = 0
      // state.selectList.forEach(item => {
      //   item.partsPrice = item.importStatus == 3 && item.partSwitch ? item.partTotalPrice : 0
      //   sum += item.goodsPrice * item.goodsQuantity + item.partsPrice
      // })
      // const ids = state.selectList.map(_item => _item.id)
      const { purchaseOrderItemIds } = props.params
      let selectArr = []
      purchaseOrderItemIds.forEach(v => {
        if (state.selectList.some(val => val.itemId == v)) {
          const arr = state.selectList.filter(val => val.itemId == v)
          let sum = 0
          arr.forEach(item => {
            item.partsPrice = item.importStatus == 3 && item.partSwitch ? item.partTotalPrice : 0
            sum += item.goodsPrice * item.goodsQuantity + item.partsPrice
          })
          let ids = arr.map(_item => _item.id)
          selectArr.push({ sum, ids, id: v })
        }
      })
      ctx.emit('fillPrice', { selectArr, isBatch })
    }

    return {
      ...toRefs(state),
      reset,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      goback,
      getDeptId,
      ElSelectTreeRef,
      tableRef,
      openCustomInfo,
      batchSelect,
      query,
      selectable,
      isImgString,
    }
  }

}
</script>

<style lang="scss" scoped>
.order-information-block {
  .form-class {
    margin: 24px 0;
    background: #fff;
    padding: 16px;
    padding-bottom: 0;
  }

  .customValueContainer {
    text-align: center;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    width: max-content;
    margin: 0 auto;
  }
  .table-class {
    background: #fff;
    padding: 16px;
    ::v-deep(.el-button + .el-button) {
      margin: 0;
    }
    .text-row {
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 225px;
      cursor: pointer;
    }
    .goods-info {
      display: flex;
      .goods-images-container {
        display: flex;
        align-items: center;
      }
      .goods-content {
        text-align: left;
        box-sizing: border-box;
        padding: 0 15px;
      }
    }
  }
}
</style>
