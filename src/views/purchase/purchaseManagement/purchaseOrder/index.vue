<template>
  <div>
    <AffixTab ref="tabSlotRef">
      <template v-slot:tabSlot>
        <div class="tabBox">
          <div class="left">
            <el-button :type="tabStatus == null ? 'primary' : 'default'" class="btn" @click="tabSelectEvent(null)">
              全部订单
            </el-button>
            <el-button :type="tabStatus == '0' ? 'primary' : 'default'" class="btn" @click="tabSelectEvent('0')">
              <div>草稿</div>
              <div class="font-12">(<span :style="{'color': tabStatus !== '0' ? '#f27869' : '#fff'}">{{statusNumList[0]?.statusNum ?? '-'}}</span>)</div>
            </el-button>
            <div class="btnBox">
              <div>审核</div>
              <div class="btnFlex">
                <el-button class="font-12" :type="tabStatus == '1' ? 'primary' : 'default'" @click="tabSelectEvent('1')">待审核(<span :style="{'color': tabStatus !== '1' ? '#f27869' : '#fff'}">{{statusNumList[1]?.statusNum ?? '-'}}</span>)</el-button>
                <el-button class="font-12" :type="tabStatus == '2' ? 'primary' : 'default'" @click="tabSelectEvent('2')">未通过(<span :style="{'color': tabStatus !== '2' ? '#f27869' : '#fff'}">{{statusNumList[2]?.statusNum ?? '-'}}</span>)</el-button>
              </div>
            </div>
            <el-button :type="['5', '6', '5, 6'].includes(tabStatus) ? 'primary' : 'default'" class="btn" @click="tabSelectEvent('5, 6')">
              <div>待到货</div>
              <div class="font-12">(<span :style="{'color': !['5', '6', '5, 6'].includes(tabStatus) ? '#f27869' : '#fff'}">{{statusNumList[5] && statusNumList[6] ? statusNumList[5]?.statusNum + statusNumList[6]?.statusNum : '-'}}</span>)</div>
            </el-button>
            <el-button :type="tabStatus == '7' ? 'primary' : 'default'" class="btn" @click="tabSelectEvent('7')">
              已完成
            </el-button>
            <el-button :type="tabStatus == '8' ? 'primary' : 'default'" class="btn" @click="tabSelectEvent('8')">
              已取消
            </el-button>
          </div>
          <div class="right">
            <el-button type="primary" class="btn" @click="syncOrder('SyncOrder')" v-permission="'purchaseOrder-syncOrder'">同步订单</el-button>
          </div>
        </div>
      </template>
    </AffixTab>
    <div class="pageView">
      <el-form :inline="true" :model="form" ref="formRef" v-show="radioGroupModel == '0'" @keyup.enter="searchExceptionInfo">
        <el-form-item label="时间范围:" prop="timeType" v-if="tabStatus !== '0'">
          <el-select v-model="form.timeType" style="width: 140px" clearable v-if="[null, '5', '6', '5, 6', '7'].includes(tabStatus)">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in timeType" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.timeType" style="width: 140px" clearable v-if="['1', '2'].includes(tabStatus)">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in timeType2" :key="index"></el-option>
          </el-select>
          <el-select v-model="form.timeType" style="width: 140px" clearable v-if="tabStatus == '8'">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in timeType3" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tabStatus == '0' ? '创建时间:' : ''" prop="timeStart_timeEnd">
          <el-date-picker v-model="form.timeStart_timeEnd" type="daterange" value-format="YYYY-MM-DD" unlink-panels range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="仓库:" prop="warehouseId">
          <el-select v-model="form.warehouseId" style="width: 140px" clearable>
            <el-option :label="item.warehouseName" :value="item.warehouseId" v-for="(item, index) in warehouseList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:" prop="supplierModel">
          <el-cascader v-model="form.supplierModel" :options="supplierOptions" :props="defaultProps" filterable @change="changeSupplier" clearable style="width: 140px"></el-cascader>
        </el-form-item>
        <el-form-item label="订单状态:" prop="orderStatus" v-if="tabStatus == null">
          <el-select v-model="orderStatus" multiple collapse-tags style="width: 190px" clearable @change="changeOrderStatus">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in orderStatusOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态:" prop="voidFlag" v-if="tabStatus == '2'">
          <el-select v-model="form.voidFlag" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in orderStatusOptions2" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购状态:" v-if="['5', '6', '5, 6'].includes(tabStatus)">
          <el-select v-model="shippedStatus" style="width: 140px" @change="shippedStatusChange" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in purchaseStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购状态:" v-if="['7'].includes(tabStatus)" prop="storageFlag">
          <el-select v-model="form.storageFlag" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in storageFlagOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购员:" prop="purchaseUserId">
          <el-select v-model="form.purchaseUserId" multiple collapse-tags style="width: 165px" clearable>
            <el-option :label="item.purchaseUserName" :value="item.purchaseUserId" v-for="(item, index) in purchaseUserOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购类型:" prop="type" v-if="['0', '8'].includes(tabStatus)">
          <el-select v-model="form.type" style="width: 135px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in purchaseTypeOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购类型:" prop="type" v-else>
          <el-select v-model="form.type" style="width: 135px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in purchaseTypeOptions2" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型:" prop="customization">
          <el-select v-model="form.customization" style="width: 165px" clearable>
            <el-option label="普货" :value="0"></el-option>
            <el-option label="定制品" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式:" prop="settlementType">
          <el-select v-model="state.settlementCopy" style="width: 165px" clearable @change="settlementChange">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in settlementTypeOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配件导入:" prop="importStatus" v-if="[null,'5, 6'].includes(tabStatus)">
          <el-select v-model="form.importStatus" style="width: 165px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in accessoriesTypeOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <br v-if="[null, '5', '6', '5, 6', '7'].includes(tabStatus)" />
        <el-form-item label="剩余到货:" prop="remainingArrival" v-if="[null, '5', '6', '5, 6'].includes(tabStatus)">
          <el-select v-model="form.remainingArrival" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in remainingArrivalOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流状态:" prop="logisticsType" v-if="[null, '5', '6', '5, 6'].includes(tabStatus)">
          <el-select v-model="form.logisticsType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in logisticsStatusOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <br v-if="['0', '1', '8'].includes(tabStatus)" />
        <el-form-item label="搜索内容:" prop="searchType">
          <el-select v-model="form.searchType" style="width: 140px">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in searchType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="copySearchText" :placeholder="form.searchType == 9  ? '请输入要检索的内容' : `多个${searchType.filter(item => item.value == form.searchType)[0].label}用逗号隔开`" clearable style="width: 318px"></el-input>
        </el-form-item>
        <div class="flex">
          <div class="left">
            <el-form-item label="备注:">
              <el-checkbox v-model="item.checked" :label="item.name"  v-for="(item, index) in remakeOptions" :key="index" @change="changeRemake"></el-checkbox>
            </el-form-item>
          </div>
          <div class="right">
            <el-button type="primary" @click="searchEvent" :loading="btnLoading">查询</el-button>
            <el-button @click="resetForm(true)">重置</el-button>
          </div>
        </div>
      </el-form>
      <!-- 未关闭异常 -->
      <el-form :inline="true" :model="exceptionForm" ref="formRef2" v-show="radioGroupModel == '1'">
        <el-form-item label="搜索内容:" prop="searchType">
          <el-select v-model="exceptionForm.searchType" style="width: 140px">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in searchType2" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchContent">
          <el-input v-model="exceptionForm.searchContent" :placeholder="`多个${searchType2.find(item => item.value == exceptionForm.searchType)?.label}用逗号隔开`" clearable :maxlength="500" style="width: 318px"></el-input>
        </el-form-item>
        <el-form-item label="异常类型:" prop="exceptionType">
          <el-select v-model="exceptionForm.exceptionType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in exceptionTypeOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购员:" prop="purchaseUserId">
          <el-select v-model="exceptionForm.purchaseUserId" multiple :collapseTags="true" style="width: 200px" clearable>
            <el-option :label="item.userName" :value="item.userId" v-for="(item, index) in purchaseExceptionUsers" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库员:" prop="inputUserId">
          <el-select v-model="exceptionForm.inputUserId" style="width: 140px" clearable>
            <el-option :label="item.userName" :value="item.userId" v-for="(item, index) in inputUserOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <div class="btnBox">
          <el-button type="primary" @click="searchExceptionInfo" :loading="btnLoading">查询</el-button>
          <el-button @click="resetExceptionForm(true)">重置</el-button>
        </div>
      </el-form>
    </div>

    <div class="operationView">
      <el-form class="sortForm">
        <erp-sort v-if="radioGroupModel === 0" @sort="sortEvent" :options="defaultSortOptions" :defaultSort="defaultNormalSortOpt"></erp-sort>
        <erp-sort v-else @sort="sortEvent" :options="[{ value: 1, label: '异常创建时间' }, { value: 2, label: '异常数量' }]" :defaultSort="defaultExceptionSortOpt"></erp-sort>
        <el-form-item v-if="radioGroupModel == 0" style="margin-bottom:0;margin-top: -10px;">
          <el-affix :offset="affixOprationTop" style="width:100%;padding:20px 0" class="affix-operation">
            <div class="flex">
              <div class="left">
                <el-button type="primary" v-if="[null, '5, 6', '7', '8'].includes(tabStatus)" @click="remarkEvent('Remark')" v-permission="'purchaseOrder-remark'">备注</el-button>
                <el-button type="primary" v-if="['0', '2'].includes(tabStatus)" :loading="btnLoading" @click="batchPurchaseExamine(1)" v-permission="'purchaseOrder-postExamine'">批量提交审核</el-button>
                <el-button type="primary" v-if="tabStatus == '0'" @click="batchDel()" v-permission="'purchaseOrder-del'">批量删除</el-button>
                <el-button type="primary" v-if="tabStatus == '1'" :loading="btnLoading" @click="batchPurchaseExamine(2)" v-permission="'purchaseOrder-passExamine'">通过审核</el-button>
                <el-button type="primary" @click="batchRejectCheck('RejectCheck')" v-if="tabStatus == '1'" v-permission="'purchaseOrder-unPassExamine'">驳回审核</el-button>
                <el-button type="primary" v-if="tabStatus == '2'" @click="batchPurchaseToVoid()" :loading="btnLoading" v-permission="'purchaseOrder-toVoid'">批量作废</el-button>
                <el-button type="primary" v-if="['5, 6', '7'].includes(tabStatus)" @click="batchPay()" v-permission="'purchase-order_batch-apply-pay:btn'">申请付款</el-button>
                <el-button type="primary" v-if="['5, 6'].includes(tabStatus)" @click="batchaddWaybillNum('BatchaddWaybillNum')" v-permission="'purchaseOrder-addWaybillNum'">添加运单号</el-button>
                <el-button type="primary" v-if="['5, 6', '7'].includes(tabStatus)" :loading="btnLoading" @click="printEvent(1)" v-permission="'purchaseOrder-printPurchaseText'">打印采购单</el-button>
                <el-button type="primary" v-if="['5, 6', '7'].includes(tabStatus)" :loading="btnLoading" @click="printEvent(2)" v-permission="'purchaseOrder-printGoodsQrcode'">打印商品条码</el-button>
                <el-button type="primary" v-if="tabStatus== '5, 6'" :loading="btnLoading" @click="importAccessoryPrice('ImportAccessoryPrice')" v-permission="'purchaseOrder-importAccessoryPrice'">导入配件金额</el-button>
              </div>
              <div class="right">
                <el-button type="primary" @click="exportCustom('ExportCustom')" v-permission="'purchaseOrder-exportCustom'">导出定制信息</el-button>
                <el-button type="primary" @click="exportOrder('ExportOrder')" v-permission="'purchaseOrder-exportOrder'">导出订单</el-button>
              </div>
            </div>
          </el-affix>
        </el-form-item>
      </el-form>
    </div>
    <div class="pageView">
      <el-radio-group v-model="radioGroupModel" style="margin-bottom: 20px;" v-if="['5', '6', '5, 6'].includes(tabStatus)">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="1">未关闭异常({{exceptionTotalCount}})</el-radio-button>
      </el-radio-group>
      <PurchaseTable :status="tabStatus" :loading="loading" :purchaseTable="purchaseTable" :selections="selections" :selectedAll="selectedAll" @selectAll="selectAll" @selectRow="selectRow" @loadInfoEvent="loadInfoEvent" v-if="radioGroupModel == 0" />
      <ExceptionTable :exceptionTable="exceptionTable" :loading="loading" @refreshEvent="searchExceptionInfo" v-else />
    </div>
    <ErpPage :count="selections.length" :total="purchaseTotalCount" :pageSizes="[50,100, 200, 300, 500, 1000]" @updateData="updateDataPurchase" ref="ErpPage_01" v-if="radioGroupModel == 0" />
    <ErpPage :total="exceptionTotalCount" :pageSizes="[50,100, 200, 300, 500, 1000]" @updateData="updateDataException" ref="ErpPage_02" v-else />
    <component :is="compName[url]" v-if="ifShow" :purchaseId="selections" :selectionArr="selectionArr" :status="tabStatus" :searchForm="form" @closeEvent="closeEvent"></component>
  </div>
</template>

<script>
export default {
  name: 'PurchaseOrders'
}
</script>
<script setup>
import { ref, reactive, toRefs, onActivated, provide, watch,computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { warehouseList } from '@/assets/js/staticData'
import {
  timeType, timeType2, timeType3, orderStatusOptions, orderStatusOptions2, logisticsStatusOptions, purchaseTypeOptions, purchaseTypeOptions2, settlementTypeOptions,
  purchaseStatus, remainingArrivalOptions, searchType, searchType2, defaultProps, defaultProps2, exceptionTypeOptions, storageFlagOptions, accessoriesTypeOptions
} from './composables/staticData'
import Handle from './composables/handle'
import AffixTab from '@/components/affixTab/index.vue'
import Remark from './components/remark.vue'
import RejectCheck from './components/rejectCheck.vue'
import PurchaseTable from './components/purchaseTable.vue'
import ExceptionTable from './components/exceptionTable.vue'
import ImportAccessoryPrice from './components/importAccessoryPrice.vue'
import BatchaddWaybillNum from './components/batchAddWaybillNum.vue'
import SyncOrder from './components/syncOrder.vue'
import ExportOrder from './components/exportOrder.vue'
import ExportCustom from './components/exportCustom.vue'
import ErpPage from '@/components/erpPage/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { orderIndexParmas } from '@/utils/tool.js'
let route = useRoute()
const tabSlotRef = ref(null)
let state = reactive({
  tabStatus: null, // tab绑定的状态
  supplierOptions: [], // 供应商
  purchaseUserOptions: [], // 采购员list
  purchaseExceptionUsers: [], // 采购员（异常）list
  signUserOptions: [], // 质检员list
  qaUserOptions: [], // 签收员list
  inputUserOptions: [], // 入库员list
  remakeOptions: [],
  orderStatus: null,
  settlementCopy: null,
  orderOptions: [],//订单类型枚举值，
  copySearchText: '',
  form: {
    status: null,
    noPassStatus: null, // 为1则为未通过里的状态
    timeType: 1, // 时间类型
    timeStart_timeEnd: [], // 时间  start,end拼接
    warehouseId: 1, // 仓库
    supplierModel: null, // 供应商表单绑定字段
    partnerType: null, // 供应商类型
    supplierId: null, // 供应商名称
    logisticsType: null, // 物流状态
    type: null, // 采购类型
    remainingArrival: null, // 剩余到货
    purchaseUserId: null, // 采购员
    searchType: 1, // 搜索类型
    searchText: '', // 内容
    remarkTypeId: '', // 备注id
    sortName: 'o.create_time',
    sortType: 'desc',
    orderType: 1,
    voidFlag: null, // 是否作废
    storageFlag: null, // 已完成采购状态
    settlementType: null,
    settlementValue: null,
    customization: null,
    importStatus: null,
    page: {
      pageNo: 1,
      pageSize: 50
    }
  },
  exceptionForm: {
    searchType: 6,
    searchContent: '',
    exceptionType: null,
    purchaseUserId: null,
    signUserId: null,
    qaUserId: null,
    inputUserId: null,
    orderFieId: 1,
    orderBy: 'asc',
    page: {
      pageNo: 1,
      pageSize: 50
    }
  },
  shippedStatus: null, // 采购状态
  defaultSortOptions: [{ value: 'o.create_time', label: '创建时间' }, { value: 'tr.record_create_time', label: '到货时间' }, { value: 'total_amount', label: '订单金额' }],
  defaultNormalSortOpt: { value: 'o.create_time', type: 'desc' },
  defaultExceptionSortOpt: { value: 1, type: 'asc' },
  purchaseTable: [],
  exceptionTable: [],
  purchaseTotalCount: 0, // 采购订单总数
  exceptionTotalCount: 0, // 未关闭异常数量
  url: '',
  ifShow: false,
  loading: false,
  btnLoading: false,
  selectionArr: [],
  selections: [], // 选中的id集合
  selectedAll: false, // 是否全选
  radioGroupModel: 0, // 0：全部，1：未关闭异常
  statusNumList: {},
  isSupplier: null,
	affixOprationTop:0
})
let formRef = ref(null)
let formRef2 = ref(null)
let selectTreeRef = ref(null)
let ErpPage_01 = ref(null)
let ErpPage_02 = ref(null)
const compName = { // 动态组件的引用
  Remark,
  RejectCheck,
  BatchaddWaybillNum,
  SyncOrder,
  ExportOrder,
  ExportCustom,
  ImportAccessoryPrice
}


onMounted(()=>{
	state.affixOprationTop = tabSlotRef.value.$el.clientHeight +100
})

let loadInfoEvent = () => {
  getPurchaseStatusNum()
  searchEvent()
}

let updateDataPurchase = (page) => {
  state.form.page = page
  getPurchaseStatusNum()
  searchEvent()
}

let updateDataException = (page) => {
  state.exceptionForm.page = page
  searchExceptionInfo()
}

let settlementChange = (value) => {
  if (value.length === 1) {
    state.form.settlementType = value
    state.form.settlementValue = null
  } else {
    state.form.settlementType = value.split(',')[0]
    state.form.settlementValue = value.split(',')[1]
  }
}

//导出
provide('closeDialog', closeDialog)
function closeDialog(val) {
  state.ifShow = false
}
// 重置排序字段
watch(() => state.radioGroupModel, val => {
  val == 0
    ? state.defaultNormalSortOpt = { value: 'o.create_time', type: 'desc' }
    : state.defaultExceptionSortOpt = { value: 1, type: 'asc' }
})

onActivated(() => {
  let { status, supplier, timeType, type, timeStart_timeEnd, isSupplier, isIndex, supplierType, purchaseOrderNumber ,customization} = route.params
  if (route.query.purchaseOrderNumber || purchaseOrderNumber) {
    state.form.searchText = purchaseOrderNumber || route.query.purchaseOrderNumber
    state.copySearchText = purchaseOrderNumber || route.query.purchaseOrderNumber
  }
  if (route.query.status || status) {
    if (route.query.status || status == 'null') {
      state.tabStatus = null
      state.form.status = null
    } else {
      state.tabStatus = status
      state.form.status = status
    }
  }
  if (isIndex == 1) resetForm()
  if (supplier) {
    // supplier 的元素是字符串类型，做个处理回显供应商筛选框
    state.form.supplierModel = supplier.map(id => Number(id))
    state.form.supplierId = state.form.supplierModel[1]
    state.form.partnerType = state.form.supplierModel[0] // 供应商页面跳转过来时需要覆盖供应商类型
  }
  if (supplierType) {
    switch (supplierType) {
      case '合作供应商':
        state.form.supplierModel = [1]
        state.form.partnerType = 1
        break
      case '1688':
        state.form.supplierModel = [2]
        state.form.partnerType = 2
        break
      case '淘宝':
        state.form.supplierModel = [3]
        state.form.partnerType = 3
        break
      case '拼多多':
        state.form.supplierModel = [4]
        state.form.partnerType = 4
        break
    }
  }
  if (timeType) state.form.timeType = parseInt(timeType)
  if (type) state.form.type = parseInt(type)
  if (timeStart_timeEnd) {
    if (timeStart_timeEnd == 7) {
      state.form.timeStart_timeEnd = orderIndexParmas[parseInt(timeStart_timeEnd)]()
    } else {
      state.form.timeStart_timeEnd = orderIndexParmas[parseInt(timeStart_timeEnd)]
    }
  }
  if (isSupplier == 1) {
    state.form.status = '5, 6, 7'
    state.orderStatus = ['5, 6', '7']
  }
  //定制品或者普货
  if(customization){
    state.form.customization = parseInt(customization)
  }
  searchEvent()
  getSupplierGetTree()
  getRemarkTypes()
  getPurchaseUsers()
  getPurchaseStatusNum()
  getPurchaseExceptionUsers()
  getinputUserUsers()
  if (status == '5, 6') {
    searchExceptionInfo()
  }
})
const { tabStatus, loading, btnLoading, orderStatus, form, exceptionForm, shippedStatus, purchaseUserOptions, supplierOptions, purchaseExceptionUsers, inputUserOptions, remakeOptions, url, ifShow, purchaseTable, exceptionTable, radioGroupModel, selections, selectedAll, statusNumList, selectionArr, purchaseTotalCount, exceptionTotalCount, defaultNormalSortOpt, defaultExceptionSortOpt, defaultSortOptions, orderOptions,affixOprationTop,copySearchText } = toRefs(state)
const { tabSelectEvent, syncOrder, changeRemake, searchEvent, resetForm, searchExceptionInfo, resetExceptionForm, sortEvent, closeEvent, remarkEvent, batchRejectCheck, batchaddWaybillNum, batchPay,
  getSupplierGetTree, changeSupplier, getRemarkTypes, getPurchaseUsers, selectAll, selectRow, getPurchaseStatusNum, batchPurchaseExamine, batchPurchaseToVoid, batchDel, printEvent, exportOrder, exportCustom, importAccessoryPrice,
  getPurchaseExceptionUsers, getinputUserUsers, checkedDept, shippedStatusChange, changeStatus, changeOrderStatus } = Handle(state, formRef, formRef2, selectTreeRef, ErpPage_01, ErpPage_02, route)
</script>

<style lang="scss" scoped>
.tabBox {
  width: calc(100% - 50px);
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    display: flex;
  }
  .btn {
    height: 70px;
  }
  .font-12 {
    font-size: 12px !important;
  }
  .btnBox {
    margin: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    padding-bottom: 0;
    div:nth-of-type(1) {
      text-align: center;
      color: #606266;
      margin-bottom: 3px;
    }
    div:nth-of-type(2) {
      .el-button {
        border: none;
        padding: 5px 10px;
        min-height: 19px;
        line-height: 19px;
      }
    }
  }
}
.pageView {
  position: relative;
  .btnBox {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 32px;
  .left {
    .el-button {
      margin-left: 0;
      margin-right: 16px;
    }
  }
}
.operationView {
  margin-top: 16px;
  .unSelectActive {
    color: #909399;
  }
  .sortText {
    font-size: 14px;
  }
}
.affix-operation {
  // width: calc(100% - v-bind(sideBarWidth) - 50) !important;
  :deep(.el-affix--fixed) {
    padding: 20px 0;
    background-color: #f9f9fb;
  }
}
:deep(.el-checkbox) {
  margin-right: 16px;
}
:deep(.sortForm .el-form-item__label) {
  font-size: 14px;
}
</style>
