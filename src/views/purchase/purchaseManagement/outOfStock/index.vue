<template>
  <div>
    <div v-show="!customCartShow">
      <div v-if="!showDetail" class="header">
        <!-- <keep-alive> -->
					<div>
						<div class="tab">
							<el-tabs v-model="activeName" @tab-click="activeNameChange">
								<el-tab-pane label="普通商品" name="0"></el-tab-pane>
								<el-tab-pane label="定制商品" name="1"></el-tab-pane>
							</el-tabs>
						</div>
						<!--			头部切换(非标记普货)      -->
						<div class="formOptions" v-show="!remarkFormShow">
							<el-form v-model="form" :inline="true" @keydown.enter="init(false)" :disabled="loading">
								<el-form-item label="仓库:">
									<el-select v-model="form.warehouseId" disabled clearable placeholder="全部" style="width:300px">
										<el-option label="万众智谷仓库" :value="1"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="供应商:">
									<el-cascader v-model="form.supplierIds" :options="supllierList" filterable :props="{
										expandTrigger: 'hover',
										checkStrictly: true,
										children: 'childs',
										value: 'id',
										label: 'name'
									}" clearable placeholder="全部"></el-cascader>
								</el-form-item>

								<el-form-item label="报价人:">
									<el-select v-model="form.purchaseBidder" clearable placeholder="全部" style="width: 200px" multiple collapse-tags>
										<el-option v-for="(item, index) in bidderUserList" :key="index" :label="item.userName" :value="item.userId"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="采购员:">
									<el-select v-model="form.purchaseUserId" clearable placeholder="全部" multiple collapse-tags style="width: 200px">
										<el-option v-for="(item, index) in purchasePeople" :key="index" :label="item.userName" :value="item.userId"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="商品品类:" prop="categoryIdList">
									<el-cascader ref="categoryIdListRef" @change="removeTag" v-model="form.categoryIdList" :options="categoryList" collapse-tags :props="categoryProps" style="width: 200px" clearable></el-cascader>
								</el-form-item>

								<el-form-item label="搜索内容:">
									<div style="display: flex" v-if="activeName == '0'">
										<el-select v-model="searchType" clearable placeholder="全部" @change="changeFormData">
											<el-option v-for="(item, index) in searchTypes" :key="index" :label="item.label" :value="item.value" v-once></el-option>
										</el-select>
										<el-input placeholder="请输入要检索的内容" @change="changeFormData" maxlength="500" style="margin-left: 5px;" v-model="keyWorld" clearable></el-input>
									</div>
									<div style="display: flex" v-else>
										<el-select v-model="searchType" clearable placeholder="全部" @change="changeFormData">
											<el-option v-for="(item, index) in searchTypess" :key="index" :label="item.label" :value="item.value" v-once></el-option>
										</el-select>
										<el-input placeholder="请输入要检索的内容" @change="changeFormData" maxlength="500" style="margin-left: 5px;" v-model="keyWorld" clearable></el-input>
									</div>
								</el-form-item>
								<div>
									<el-form-item label="SKU备注:">
										<el-checkbox v-model="item.checked" :label="item.name" v-for="(item, index) in remakeOptions1" :key="index" @change="changeRemake"></el-checkbox>
									</el-form-item>
									<el-form-item label="SPU备注:">
										<el-checkbox v-model="item.checked" :label="item.name" v-for="(item, index) in remakeOptions2" :key="index" @change="changeRemake2"></el-checkbox>
									</el-form-item>
									<el-form-item style="margin-left:20px">
										<el-button type="primary" @click="init(false)">查询</el-button>
										<el-button type="default" @click="resertFun">重置</el-button>
									</el-form-item>
								</div>

							</el-form>
						</div>
						<!--			头部切换(标记普货)       -->
						<div class="todayRemarkHeader" v-show="remarkFormShow">
							<el-form :inline="true" :model="remarkForm" class="demo-form-inline" @keydown.enter="queryMarksList">
								<el-form-item label="商品品类:">
									<el-cascader ref="remarkCategoryIdListRef" @change="removeRemarkTag" v-model="remarkForm.categoryIdList" :options="categoryList" collapse-tags :props="categoryProps" style="width: 200px" clearable></el-cascader>
								</el-form-item>
								<el-form-item label="团队:">
									<el-cascader v-model="remarkForm.deptId" :options="deptData" :props="deptDataProps" style="width: 200px" clearable></el-cascader>
								</el-form-item>
								<br>
								<el-form-item label="搜索内容:" v-if="remarkSearchTypeList">
									<div style="display: flex">
										<el-select v-model="remarkForm.searchType" clearable placeholder="全部">
											<el-option v-for="item in remarkSearchTypeList" :key="item.key" :label="item.label" :value="item.value" />
										</el-select>
										<el-input placeholder="请输入要检索的内容多于可用逗号或空格隔开" maxlength="500" style="margin-left: 5px;" v-model="remarkForm.searchContent" clearable></el-input>
									</div>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="queryMarksList">查询</el-button>
									<el-button @click="initMarks">重置</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				<!-- </keep-alive> -->
      </div>

      <div class="createPuBtn" @click="openBuyPlan" v-if="!showDetail">
        <i class="vango-icon vango-erp-gouwuchekong"></i>
        <div class="text">采购计划</div>
        <div class="planNum">{{ planCount }}</div>
      </div>

      <div v-show="!showDetail" class="table">
        <TableCom :tabPositions="status" ref="tableRef" :dataList="tableData" :total="total" :page="page" :searchParams="searchParams" :status="activeName" :searchMarks="remarkForm" :loading="loading" @openBuyPlan="openBuyPlan" @refresh="init" @emitSelected="val => (selectedList = val || [])" @detail="goDetail" @refreshList="refreshList()" @remarkType="remarkTypeFn" />
      </div>

      <div v-if="!showDetail" class="buyPlan">
        <el-drawer v-model="drawer" :with-header="false" custom-class="drawerBox" size="25%" :close-on-click-modal="false" :close-on-press-escape="false">
          <BuyPlan :activeName="activeName" v-if="drawer" :data-list="planList" @detail="goDetail" @close="closePlan" />
        </el-drawer>
      </div>

      <PurchaseOrder v-if="showDetail" :dataList="detailList" :submitType="submitType" :from-type="0" :param="renderParam" @refresh="detailToRefresh" @cancel="cancel" />
    </div>
    <CustomCart v-if="customCartShow" :supllierList="supllierList" @closeCart="closeCart" />
  </div>
</template>



<script>
export default {
  // name: 'outOfStock'
}
</script>



<script setup>
import { reactive, toRefs, onMounted, nextTick, ref, computed, watch, onActivated, onDeactivated } from 'vue'
import { ElMessage } from 'element-plus'
import { list, refresh, taggedList } from '@/api/purchase/outOfStock.js'
import { getCategory } from '@/api/goods/quotedPrice.js'
import CustomCart from './components/customCart.vue'
import TableCom from './components/tableCom.vue'
import BuyPlan from './components/buyPlan.vue'
import PurchaseOrder from '../components/purchaseOrder.vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { purchaseUsers } from '@/api/purchase/purchase.js'
import { deepCopy, resetForm } from '../../../../utils/tool'
import { getRemarkTypes } from '@/api/order/orderManagement.js'
import { useRoute } from 'vue-router'
import { getDepartmentList } from '@/api/user.js'
import { useStore } from 'vuex'
import {
  fmtData,
  getSupplier,
  getPurchasePeople,
  getPlanList
} from './hooks/hooks'
let store = useStore()
// const orderType = computed(() => {
// 	 return store.getters.orderType
// })
let { pageStatus, tabStatus } = store.getters
console.log('tabStatus=>',tabStatus)
let status = tabStatus ?? 1
const route = useRoute()
const { isRefresh, isCustom } = route.params
  // determine whether it is a customized product
	// if (isRefresh) {
	//   status = 1
	// }
if (isCustom) {
	status = 1
  pageStatus = isCustom - 0 ? '1' : '0'
  store.dispatch('purchaseSearch/setNormalFormActions', null)
	store.dispatch('purchaseSearch/setNormalShelveFormActions', null)
	store.dispatch('purchaseSearch/setCustomFormActions', null)
	store.dispatch('purchaseSearch/setCustomShelveFormActions', null)
	store.dispatch('purchaseSearch/setCustomRemarkFormActions', null)
}
const data = reactive({
  loading: false,
  categoryList: [],
  drawer: false,
  showDetail: false,
  activeName: pageStatus || '0',
  searchType: 0,
  keyWorld: null,
  submitType: 0, // 采购计划提交类型
  tableData: [], // 表格数据
  total: 0,
  planList: [], // 采购计划列表
  supllierList: [], // 供应商列表
  selectedList: [], // 选中的数据
  detailList: [], // 生成采购单的回显数据
  purchasePeople: [], // 采购员
  bidderUserList: [],//报价人
  renderParam: null, // 生成采购订单的请求数据
  planCount: 0,// 采购计划数量
  form: {
    partnerType: null,
    purchaseUserId: null,
    supplierId: null, //供应商id
		supplierIds:null,
    warehouseId: 1, //仓库
    skuCode: null, //商品SKU
    goodsId: null, //商品编码
    goodsName: null, //商品名称
    supplierName: null, //供应商名称
    categoryId: null,
    categoryIdList: [],
    purchaseBidder: null,//报价人
    status,//状态（1:正常、0:搁置中）
    remarkTypeIdList: [],
    skuRemarkTypeIdList: [],
		remakeOptions1:null,
		remakeOptions2:null
  },
  page: {
    pageNo: 1,
    pageSize: 20
  },
  categoryProps: {
    value: 'id',
    label: 'name',
    children: 'child',
    multiple: true,
    emitPath: false,
  },
  remakeOptions1: [],
  remakeOptions2: [],
  scrollTop: 0,
  remarkFormShow: false,
  remarkForm: {
    categoryId: null,//品类ID
    categoryIdList: [],
    searchType: 1,//搜索类型 1 商品SKU 2 订单SKU 3 订单号 4 操作人
    searchContent: null,//搜索内容
    deptId: null,//部门ID
  },
  deptData: [],
  deptDataProps: {
    value: 'deptId',
    label: 'deptName',
    children: 'children',
    emitPath: false,
    checkStrictly: true,
    expandTrigger: 'click',
  },
  customCartShow: false
})



const tableRef = ref(null)
let searchParams = ref({})
const categoryIdListRef = ref(null)
const remarkCategoryIdListRef = ref(null)

// the activeName been changed
function activeNameChange() {
	store.dispatch('purchaseSearch/setPageStatusActions', data.activeName)
	remarkTypeFn(1)
  init(true)
}
remarkTypeFn(status)
// when change search type callback, query today mark modal. 2==>today mark
function remarkTypeFn(val = 1) {
	const { normalForm, normalShelveForm, customForm, customShelveForm, customRemarkForm } = store.getters
	const tempForm = {
    partnerType: null,
    purchaseUserId: null,
    supplierId: null, //供应商id
    warehouseId: 1, //仓库
    skuCode: null, //商品SKU
    goodsId: null, //商品编码
    goodsName: null, //商品名称
    supplierName: null, //供应商名称
    categoryId: null,
    categoryIdList: [],
    purchaseBidder: null,//报价人
    status: val,//状态（1:正常、0:搁置中）
    remarkTypeIdList: [],
    skuRemarkTypeIdList: []
  }
	if(tableRef?.value) tableRef.value.tabPosition = val
	if(data.activeName === '1'){
		if(val === 0){
			if(customShelveForm) data.form = customShelveForm
			else data.form = tempForm
		}else if(val === 2){
			if(customRemarkForm) data.remarkForm = customRemarkForm
			else data.form = {
						categoryId: null,//品类ID
						categoryIdList: [],
						searchType: 1,//搜索类型 1 商品SKU 2 订单SKU 3 订单号 4 操作人
						searchContent: null,//搜索内容
						deptId: null,//部门ID
					}
		}else{
			if(customForm) data.form = customForm
			else data.form = tempForm
		}
	}else if(data.activeName === '0'){
		if(val === 0){
			if(normalShelveForm) data.form = normalShelveForm
			else data.form = tempForm
		}else{
			if(normalForm) data.form = normalForm
			else data.form = tempForm
		}
	}

  data.searchType = data.form?.searchType || 0
  data.keyWorld = data.form?.keyWorld || null
	if(data.form?.remakeOptions1) data.remakeOptions1 = data.form.remakeOptions1
  // else data.remakeOptions1.forEach(v => v.checked = false)
	if(data.form?.remakeOptions2) data.remakeOptions2 = data.form.remakeOptions2
  // else data.remakeOptions2.forEach(v => v.checked = false)
  data.remarkFormShow = val == 2
	if(val == 2) queryMarksList()
	else refreshList()
}

// query today marks list
function queryMarksList() {
  tableRef.value?.getTodayMarkList()
}

// init query form data
function initMarks() {
  data.remarkForm = {
    categoryIdList: [],
    categoryId: null,//品类ID
    searchType: 1,//搜索类型 1 商品SKU 2 订单SKU 3 订单号 4 操作人
    searchContent: null,//搜索内容
    deptId: null,//部门ID
  }
  data.page = {
    pageNo: 1,
    pageSize: 20
  }
  tableRef.value.getTodayMarkList({ ...data.remarkForm, page: data.page })
}

getDepartmentList()
  .then(res => {
    data.deptData = res.data
  })

const searchTypes = [
  {
    label: '商品SKU',
    value: 0,
    key: 'skuCode'
  },
  {
    label: '商品名称',
    value: 1,
    key: 'goodsName'
  },
  {
    label: '商品编码',
    value: 2,
    key: 'goodsId'
  },
  {
    label: '供应商',
    value: 4,
    key: 'supplierName'
  }
]
const searchTypess = [
  {
    label: '商品SKU',
    value: 0,
    key: 'skuCode'
  },
  {
    label: '商品名称',
    value: 1,
    key: 'goodsName'
  },
  {
    label: '商品编码',
    value: 2,
    key: 'goodsId'
  },
  {
    label: '供应商',
    value: 4,
    key: 'supplierName'
  },
  {
    label: '订单号',
    value: 3,
    key: 'orderId'
  }
]



const remarkSearchTypeList = [{
  label: '商品SKU',
  value: 1,
  key: 'skuCode'
}, {
  label: '订单SKU ',
  value: 2,
  key: 'orderSku'
}, {
  label: '订单号',
  value: 3,
  key: 'orderId'
}, {
  label: '操作人',
  value: 4,
  key: 'users'
}]
const {
  customCartShow,
  activeName,
  form,
  drawer,
  showDetail,
  searchType,
  keyWorld,
  tableData,
  total,
  planList,
  supllierList,
  detailList,
  submitType,
  purchasePeople,
  renderParam,
  categoryList,
  categoryProps,
  planCount,
  bidderUserList,
  loading,
  remakeOptions1,
  remakeOptions2,
  page,
  remarkFormShow,
  remarkForm,
  deptData,
  deptDataProps,
} = toRefs(data)


// 级联选择器 clear 后清除之前选择痕迹 Start
function removeTag(e) {
  if (!e.length) renderClear(categoryIdListRef.value.popperPaneRef)
}
function removeRemarkTag(e) {
  if (!e.length) renderClear(remarkCategoryIdListRef.value.popperPaneRef)
}
function renderClear(DOM_popperPaneRef) {
  if (Array.from(DOM_popperPaneRef?.children).length)
    Array.from(DOM_popperPaneRef?.children).forEach(v => {
      if (typeof (v?.className) === 'string' && ~v.className.indexOf('-active-'))
        nextTick(() => v.className = v.className.replace('-active-', '-'))
      if (v?.children.length) renderClear(v)
    })
}
// 级联选择器 clear 后清除之前选择痕迹 End


const planNum = computed(() => {
  let totalNum = 0
  data.planList.forEach(item => {
    item.skuList.forEach(v => {
      totalNum += v.quantity || 0
    })
  })
  return totalNum
})

function getRemark(callback) {
  let arr = [getRemarkTypes({ useScope: '2' }), getRemarkTypes({ useScope: '3' })]
  Promise.all(arr).then((res) => {
    if (res[0].code == 200 && (!data.remakeOptions1 || !data.remakeOptions1?.length)) data.remakeOptions1 = res[0].data.map(v=>{
			v.checked = false
			return v
		})
		console.log(data.remakeOptions2)
    if (res[1].code == 200 && (!data.remakeOptions2 || !data.remakeOptions2?.length)) data.remakeOptions2 = res[1].data.map(v=>{
			v.checked = false
			return v
		})
  })
} // 获取备注列表

// 勾选备注类型
let changeRemake = () => {
  let arr = []
  data.remakeOptions1.forEach(item => {
    if (item.checked) {
      arr.push(item.id)
    }
  })
  data.form.remarkTypeIdList = arr
}

let changeRemake2 = () => {
  let arr = []
  data.remakeOptions2.forEach(item => {
    if (item.checked) {
      arr.push(item.id)
    }
  })
  data.form.skuRemarkTypeIdList = arr
}

function getPurchaseUsers() {
  purchaseUsers().then(res => {
    if (res.code == 200) {
      data.purchaseUserOptions = recursionEvent(res.data)
      console.log(data.purchaseUserOptions)
    } else {
      ElMessage.error(res.message)
    }
  })
}

function getCategoryEvent() {
  getCategory().then(res => {
    if (res.code == 200) {
      data.categoryList = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

function checkedDept(value) {
  data.form.purchaseUserId = value
}

let recursionEvent = data => {
  data.forEach(item => {
    if (item.children?.length) {
      item.children.forEach(it => {
        it.disabled = true
      })
      recursionEvent(item.children)
    } else {
      item.children = item.userVos || []
      item.children.forEach(it => {
        it.deptName = it.fullName
        it.deptId = it.userId
        it.disabled = false
      })
    }
  })
  return data
}

function getParams(status = false) {
  let form = deepCopy(data.form)
  form.customizationType = data.activeName - 0
  if (data.activeName == '0') searchTypes.map(item => {
    if (data.searchType === item.value) {
      form[item.key] = data.keyWorld
    } else {
      form[item.key] = null
    }
  })
  else searchTypess.map(item => {
    if (data.searchType === item.value) {
      form[item.key] = data.keyWorld
    } else {
      form[item.key] = null
    }
  })
  if (form.supplierIds) {
    if (form.supplierIds[0] === -1) {
      form.partnerType = null
      form.supplierId = -1
    } else {
      form.partnerType = form.supplierIds[0]
      form.supplierId = form.supplierIds?.length > 1 ? form.supplierIds[1] : null
    }
  }
  //	根据搜索类型赋值
  if (!status) form.status = tableRef.value.tabPosition
  return form
}
let scrollTop = 0
function changeTypeFn(type,param){
	// type 1.普货正常， 2.普货搁置， 3.定制正常， 4.定制今日标记， 5.定制搁置
	switch(type){
		case 1:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setNormalFormActions', param)
				break;
		case 2:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 0)
			store.dispatch('purchaseSearch/setNormalShelveFormActions', param)
				break;
		case 3:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setCustomFormActions', param)
				break;
		case 4:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 2)
			store.dispatch('purchaseSearch/setCustomRemarkFormActions', param)
				break;
		case 5:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 0)
			store.dispatch('purchaseSearch/setCustomShelveFormActions', param)
				break;
		default:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setNormalFormActions', param)
				break;
	}
}
function init(status = false) {
  let form = getParams(status)
  searchParams.value = form
  data.loading = true

  scrollTop = document.documentElement.scrollTop
  if (data.activeName == '0' && tableRef.value.tabPosition == 2) {
    tableRef.value.tabPosition = 1
    data.remarkFormShow = false
    return resertFun()
  }
  list(Object.assign({ page: data.page }, form)).then(res => {
    if (res.code !== 200) return data.loading = false
    data.loading = false
    if (res.data) {

			const obj = {
				searchType: data.searchType || null,
				keyWorld: data.keyWorld || null,
				remakeOptions1: data.remakeOptions1 || null,
				remakeOptions2: data.remakeOptions2 || null
			}
			if(data.activeName === '1'){
				if(tableRef.value.tabPosition == 0){
					changeTypeFn(5,{...form,...obj})
				}else if(tableRef.value.tabPosition == 2){
					changeTypeFn(4,{...form,...obj})
					// 今日标记
				}else{
					changeTypeFn(3,{...form,...obj})
				}
			}else if(data.activeName === '0'){
				if(tableRef.value.tabPosition == 0){
					changeTypeFn(2,{...form,...obj})
				}else{
					changeTypeFn(1,{...form,...obj})
				}
			}



      const { purchaseUserList, suggestPageInfo, planCount, bidderUserList } = res.data
      data.tableData = fmtData(suggestPageInfo.dataList)
      data.total = res.data.suggestPageInfo.page.totalCount
			data.purchasePeople = [{ userName: '无采购员', userId: -1 }]
      data.purchasePeople = data.purchasePeople.concat(purchaseUserList)
      data.bidderUserList = bidderUserList
      data.planCount = planCount
    }
    setTimeout(() => {
      document.documentElement.scrollTop = scrollTop
    })
    tableRef.value.clearSelected()
  })
}

function getPeople(list) {
  let arr = []
  list.forEach(item => {
    let v = item.skuList.forEach(v => {
      if (v.purchaseBy) {
        if (!arr.find(x => x.id === v.purchaseBy))
          arr.push({
            name: v.purchaseUserName,
            id: v.purchaseBy
          })
      }
    })
  })
  arr.unshift({ name: '无采购员', id: -1 })
  return arr
} // 收集列表中的采购员

function refreshList() {
  const param = { warehouseId: data.form.warehouseId || 1 }
  refresh(param).then(res => {
    if (res.code == 200) {
      init()
    }
  })
}

function closePlan() {
  data.drawer = false
  init()
} // 关闭采购计划

function goDetail(v) {
  data.drawer = false
  data.showDetail = true
  data.detailList = v
  data.submitType = v.type
  data.renderParam = v.param
  data.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
} // 前往生成采购单页面

function cancel() {
  data.showDetail = false
  nextTick(() => {
    document.documentElement.scrollTop = data.scrollTop
  })
}

function closeCart(val) {
  data.customCartShow = val
	data.purchasePeople = [{ userName: '无采购员', userId: -1 }]
  data.form.customizationType = data.activeName - 0
  list(Object.assign({ page: data.page }, data.form)).then(res => {
    if (res.code !== 200) return data.loading = false
    if (res.data) {
      const { purchaseUserList, suggestPageInfo, planCount, bidderUserList } = res.data
      data.tableData = fmtData(suggestPageInfo.dataList)
      data.total = res.data.suggestPageInfo.page.totalCount
      data.purchasePeople = data.purchasePeople.concat(purchaseUserList)
      data.bidderUserList = bidderUserList
      data.planCount = planCount
    }
    tableRef.value.clearSelected()
  })
}

function openBuyPlan() {
  if (data.activeName == 1) {
    data.customCartShow = true
  } else {
    getPla(() => {
      data.drawer = true
    })
  }
} // 打开采购佳话

function detailToRefresh(status = true) {
  if (status) init()
  data.showDetail = false
  tableRef.value.xTable1.clearCheckboxRow()
  tableRef.value.selectedList = []
} // 生成订单回来刷新

function resertFun() {
  data.form = resetForm(data.form, { warehouseId: 1 })
  data.form.remarkTypeIdList = []
  data.form.skuRemarkTypeIdList = []
  data.remakeOptions1.forEach(item => item.checked = false)
  data.remakeOptions2.forEach(item => item.checked = false)
  data.page.pageNo = 1
  data.page.pageSize = 20
  data.searchType = null
  data.keyWorld = null
  data.searchType = 0
  tableRef.value.refresh()
} // 重置

function getPla(callBack) {
  getPlanList(
    {
      type: 1,
      supplierId: null,
      warehouseId: null,
      skuCode: null,
      goodsId: null,
      goodsName: null,
      supplierName: null
    },
    res => {
      res.forEach(item => {
        item.skuList?.forEach(v => {
          v.lastQuantity = v.quantity
        })
      })
      data.planList = res

      callBack()
    }
  )
} // 获取采购计划

function changeFormData() {
  searchParams.value = getParams()
  sessionStorage.setItem('searchParams', JSON.stringify(searchParams))
}

// onActivated(() => {
//   const { isRefresh, isCustom } = route.params
//   if (isRefresh) {
//     data.form.status = 1
//     if (isCustom) data.activeName = isCustom - 0 ? '1' : '0'
//     resertFun()
//   } else if (isCustom) {
//     data.activeName = isCustom - 0 ? '1' : '0'
//     resertFun()
//   }
// })
getRemark()
onMounted(() => {
  if(tabStatus!=2) init()
	else queryMarksList()
  getCategoryEvent()
  // getRemark()
  getSupplier(val => {
    let obj = {
      childs: null,
      name: '无供应商',
      id: -1,
      parentId: 0,
      thirdPlatformSupplierId: null
    }
    val.unshift(obj)
    data.supllierList = val
  })
  watch(() => data.form, (v) => {
    changeFormData()
    // if(!data.form.categoryIdList.length)
    // 	console.log(data.form,categoryIdListRef)
  }, { deep: true })



  // onActivated(() => {
  //   if (route.params.selectList)
  //     console.log('route.params.selectList===>', JSON.parse(route.params.selectList))
  // })

})
</script>

<style scoped lang="scss">
.header {
  background: white;
  padding: 5px 10px;
}

.createPuBtn {
  position: fixed;
  top: 10vh;
  right: 0;
  width: 45px;
  height: 175px;
  background: #ffffff;
  box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.25);
  z-index: 99;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .text {
    margin-top: 10px;
    writing-mode: vertical-lr;
    letter-spacing: 5px;
  }

  i {
    color: #f7b500;
    font-size: 22px;
  }
}

.planNum {
  width: 20px;
  height: 20px;
  background: #f7b500;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}

:deep(.drawerBox .el-drawer__body) {
  padding: 0 !important;
}
:deep(.el-select .el-select__tags) {
  max-width: 168px !important;
}
:deep(.el-checkbox) {
  margin-right: 16px;
}
</style>
