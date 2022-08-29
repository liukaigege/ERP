<template>
	<!--	确认采购单-->
	<div class="container">
		<div v-if="!deleteOrderData">
			<ErpNav title="确认采购单" :goBack="cancel" />
			<div style="margin-top:20px;"><el-button type="primary" @click="batchModification">批量修改</el-button></div>
			<div class="table">
				<vxe-table
					ref="xtableRef"
					border
					keep-source
					max-height="700"
					align="center"
					:data="list"
					:scroll-y="{ gt:60,oSize:50}"
					:span-method="colSpanMethond"
					:checkbox-config="{}"
					:cell-style="cellStyle"
					:edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
					:edit-rules="tableRules"
				>
					<vxe-column field="check" width="52">
						<template #header>
							<el-checkbox v-model='tableCheckdAll'  :indeterminate="tableIndeter" @change="handleCheckedAll"></el-checkbox>
						</template>
						<template #default="{ row }">
							<el-checkbox v-if="row.type === 'fa'" v-model='row.checked' :key='row.id' :indeterminate='row.indeterminate' @change="handleCheckedRowAll(row,val)"></el-checkbox>
							<el-checkbox v-if="row.type === 'item'" v-model='row.checked' :key='row.id'  @change="val=>handleChecked(row,val)"></el-checkbox>
						</template>
					</vxe-column>

					<vxe-column field="goods" title="商品信息" :width="280">
						<template #default="{ row, rowIndex }">
							<div>
								<div class="header" v-if="row.type === 'fa'">
									<p>
										【{{ row.partnerTypeName }}】{{
											row.supplierName?.length > 50
												? row.supplierName.slice(0, 50) + '...'
												: row.supplierName
										}}
									</p>
									<p>{{ row.warehouseName }}</p>
								</div>

								<div class="goods" v-if="row.type === 'item'">
									<div class="goodsImg">
										<el-image
											:src="row.mainImg"
											fit="contain"
											style="width: 70px; height: 70px"
										></el-image>
									</div>
									<div class="goodsInfo" style="width:180px;'">
										<div class="infoName">
											<el-tooltip placement="top">
												<template #content>
													<p style="cursor: pointer" v-copy="row.skuCode">复制</p>
												</template>
												<span :title="row.skuCode">{{
													row.skuCode?.length > 35
														? row.skuCode.slice(0, 35) + '...'
														: row.skuCode
												}}</span>
											</el-tooltip>
										</div>
										<div class="infoName">
											<el-tooltip placement="top">
												<template #content>
													<p style="cursor: pointer" v-copy="row.goodsName">
														复制
													</p>
												</template>
												<span :title="row.goodsName">{{
													row.goodsName?.length > 35
														? row.goodsName.slice(0, 35) + '...'
														: row.goodsName
												}}</span>
											</el-tooltip>
										</div>
										<div class="infoSku" :title="renderSku(row.skuValue)">
											<span
												style="margin-right: 10px"
												v-for="(a, b) in row.skuValue"
												:key="b"
											>
												{{ a.spe ? a.spe + ':' : '' }}{{ a.speVal }}
											</span>
										</div>
										<!-- 国码预留 -->
										<div v-if="row.codeVal" style="color:#2fbba6;font-size:12px">
											国码：{{row.codeVal}}
										</div>
										<!--									<div class="infoSku">万众智谷仓</div>-->
									</div>
								</div>

								<div class="formBox" v-if="row.type === 'frCh'">
									<p class="priceAll">
										总计： <span>￥{{ computedTotal(row) }}</span>
									</p>

									<div class="form">
										<el-form
											:model="row.form"
											:ref="v => (formRef[rowIndex + '0'] = v)"
											:rules="rules"

											:inline="true"
										>
											<el-form-item label="采购类型:">
												<el-select placeholder="全部" v-model="fromType" disabled>
													<el-option label="缺货采购" :value="0"></el-option>
													<el-option label="备货采购" :value="1"></el-option>
												</el-select>
											</el-form-item>

											<el-form-item label="采购员:">
												<el-input v-model="account" disabled></el-input>
											</el-form-item>

											<el-form-item label="税率:">
												<el-input-number
													:controls="false"
													:max="100"
													:min="0"
													v-model="row.form.taxRate"
													:precision="2"
													style="width: 100px"
												></el-input-number>
												%
											</el-form-item>

											<el-form-item label="结算方式:" prop="settlementType">
												<el-select v-model="row.form.settlementType">
													<el-option label="预付" :value="1"></el-option>
													<el-option label="账期" :value="2"></el-option>
													<el-option label="货到付款" :value="3"></el-option>
													<el-option label="款到发货" :value="4"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item
												label="金额："
												prop="settlementValue"
												v-if="row.form.settlementType === 1"
											>
												<el-input-number
													:controls="false"
													:min="0"
													v-model="row.form.settlementValue"
													:precision="2"
													style="width: 130px"
													:max="row.form.settlementUnit === 1 ? 100 : 9999999.99"
												></el-input-number>

												<el-select
													v-model="row.form.settlementUnit"
													style="width: 80px"
													@change="
														() => {
															row.form.settlementValue = undefined
														}
													"
												>
													<el-option label="%" :value="1"></el-option>
													<el-option label="元" :value="2"></el-option>
												</el-select>
											</el-form-item>

											<el-form-item v-if="row.form.settlementType === 2">
												<el-radio-group v-model="row.form.days">
													<el-radio label="30">30天</el-radio>
													<el-radio label="45">45天</el-radio>
													<el-radio label="60">60天</el-radio>
												</el-radio-group>
											</el-form-item>


										</el-form>
									</div>




									<div class="form" v-if="row.partnerType === 2">
										<el-form
											:model="row.form"
											:ref="v => (formRef[rowIndex + '1'] = v)"
											:rules="rules"

											:inline="true"
										>
											<el-form-item label="1688账号:" prop="accountId">
												<el-select
													placeholder="全部"
													v-model="row.form.accountId"
													@change="v => changeAccount(v, row)"
												>
													<el-option
														v-for="(item, index) in accounts"
														:key="index"
														:label="item.accountName"
														:value="item.id"
													>
													</el-option>
												</el-select>
											</el-form-item>

											<el-form-item label="收货地址:" prop="address">
												<el-input
													v-model="row.form.address"
													disabled
													style="width: 800px"
												></el-input>
												<el-button
													type="text"
													:disabled="!row.form.accountId"
													@click="setAdress(row)"
													style="margin-left: 10px"
													>更改地址
												</el-button>
											</el-form-item>
										</el-form>
									</div>

									<div class="form">
										<el-form  :inline="true" :rules="rules" :model="row.form" 	:ref="v => (formRef[rowIndex + '2'] = v)">
											<el-form-item 	label="备货团队："  v-if="fromType == 1" prop="toDeptId">
												<el-cascader
													v-model="row.form.toDeptId"
													:options="oraganziationList"
													:show-all-levels="false"
													clearable
													:props="{
														expandTrigger: 'click',
													label: 'deptName',
													value: 'deptId',
														children: 'children'
													}"
												>

												</el-cascader>

											</el-form-item>
											<el-form-item label="备注类型:">
												<el-select
													v-model="row.form.remarkTypeId"
													clearable
													@change="
														v => {
															if (!v) row.form.remark = null
														}
													"
												>
													<el-option
														v-for="(a, b) in remarkList"
														:key="b"
														:label="a.name"
														:value="a.id"
													>
													</el-option>
												</el-select>
											</el-form-item>

											<el-form-item
												label="备注内容:"
												v-if="row.form.remarkTypeId"
											>
												<el-input
													v-model="row.form.remark"
													type="textarea"
													style="width: 800px"
													resize="none"
													maxlength="100"
												></el-input>
											</el-form-item>
										</el-form>
									</div>
								</div>
							</div>
						</template>
					</vxe-column>



					<vxe-column field="pairInfo" title="供应商商品信息" :width="400">
						<template #default="{ row }">
							<div class='box'>
								<div class="goodsBox" v-if="row.type === 'item'">
									<div class="goods" v-if="row.partnerType !== 2">
										<div class="goodsImg">
											<el-image
												:src="row.mainImg"
												fit="contain"
												style="width: 70px; height: 70px"
											></el-image>
										</div>
										<div class="goodsInfo" style="width:180px;">

											<div class="infoName">
												<span :title="row.goodsName">{{
														row.goodsName?.length > 35
															? row.goodsName.slice(0, 35) + '...'
															: row.goodsName
													}}</span>
											</div>
											<div class="infoSku" :title="renderSku(row.skuValue)">
											<span
												style="margin-right: 10px"
												v-for="(a, b) in row.skuValue"
												:key="b"
											>
												{{ a.spe ? a.spe + ':' : '' }}{{ a.speVal }}
											</span>
											</div>
											<div class="infoSku"></div>
											<!--								<div class="infoSku">万众智谷仓</div>-->
										</div>
									</div>
									<div class="goods" v-else-if="testPairInfo(row)">
										<div class="goodsImg">
											<el-image
												:src="jsonData(row.pairInfo).img"
												fit="contain"
												style="width: 70px; height: 70px"
											></el-image>
										</div>
										<div class="goodsInfo">
											<div class="infoName">
												<el-tooltip placement="top">
													<template #content>
														<p
															style="cursor: pointer"
															v-copy="jsonData(row.pairInfo).name"
														>
															复制
														</p>
													</template>
													<span :title="jsonData(row.pairInfo).name">{{
															jsonData(row.pairInfo).name?.length > 25
																? jsonData(row.pairInfo).name.slice(0, 25) + '...'
																: jsonData(row.pairInfo).name
														}}</span>
												</el-tooltip>
											</div>
											<div class="infoSku" :title="renderSku(jsonData(row.pairInfo).speInfo)">
											<span
												style="margin-right: 10px"
												v-for="(a, b) in jsonData(row.pairInfo).speInfo"
												:key="b"
											>
												{{ a.spe ? a.spe + ':' : '' }}{{ a.speVal }}
											</span>
											</div>

											<div class="changeBtn">
												<el-button type="text"  @click="match(row)"
												>更换</el-button
												>
												<el-button type="text"  @click="cancelMatch(row)"
												>解除配对</el-button
												>
											</div>
										</div>
									</div>
									<div v-else>
										<el-button type="text"  @click="match(row)"
										>配对
										</el-button>
									</div>
								</div>
								<div class='goodsType'>
									<el-select v-model='row.goodAttribute'  placeholder="货品属性" >
										<el-option v-for="item in goodAttribute" :key="item.value" :value="item.value" :label="item.label"></el-option>
									</el-select>
								</div>
							</div>


						</template>
					</vxe-column>
					<vxe-column field="stock" title="采购报价/上次采购价">
						<template #default="{ row }">
							{{ changePrice(row.purchasePrice) }}/
							{{ changePrice(row.lastPurchasePrice) }}
						</template>
					</vxe-column>

					<vxe-column
						field="signlePrice"
						title="主件单价"
						width="120"
						:edit-render="{}"
					>
						<template #edit="{ row }">
							<el-input-number
								style="width:100px;"
								v-model="row.signlePrice"
								:min="0"
								:disabled="!!row.partSwitch"
								:max="createMaxPrice(row)"
								controls-position="right"
								@change="signlePriceChange(row)"
								@blur="signlePriceBlur(row)"
							/>
						</template>
						<template #default="{ row }">
							<p :style="computedSinglePrice(row) ? 'color :red' : ''">
								&yen; {{ (row.signlePrice - 0).toFixed(2) }}
							</p>
						</template>
					</vxe-column>

					<vxe-column field="num" title="主件数量">
						<template #default="{ row }">
							<vxe-input
								v-model="row.quantity"
								type="number"
								disabled
								align="center"
							></vxe-input>
						</template>
					</vxe-column>
					<vxe-column title="配件金额" width="120">
						<template #header>
              <div>
                <span>配件金额</span>
                <el-tooltip class="box-item" effect="dark" raw-content content="<p>开启：前期未知定制商品采购价格，后期需导入采购金额</p><p>关闭：已知定制商品采购价格，根据所填价格生成采购单</p>" placement="top-start">
                  <el-icon style="cursor: pointer;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
						<template #default="{ row }">
							<el-switch v-model="row.partSwitch" @change="partSwitchChanges(row)" :active-value="1" :inactive-value="0" />
						</template>
					</vxe-column>
					<vxe-column field="yprice" title="应付" width="120">
						<template #default="{ row }">
							￥{{ (row.totalAmount - 0).toFixed(2) }}
						</template>
					</vxe-column>
					<vxe-column field="option" title="操作" width="120">
						<template #default="{ row }">
							<el-button type="text"  @click="del(row)"
								>删除
							</el-button>
						</template>
					</vxe-column>

					<vxe-column field="bank" title="" width="0">
						<template #default="{  }"> </template>
					</vxe-column>
				</vxe-table>
			</div>

			<ErpFooter>
				<div class="tab">
					<div class="num">
						<span>供应商数量：{{ totalInfo.supplierNum }}</span>
						<span>商品种类：{{ totalInfo.goodsTypeNum }} 种 </span>
						<span>数量总计：{{ totalInfo.goodsNum }} 件 </span>
						<span> 总计：{{ totalPrice() }} 元</span>
					</div>
					<div class="btn">
						<el-button  @click="cancel">取消</el-button>
						<el-button
							@click="submit(0)"
							:disabled="list?.length == 0"
							>保存草稿</el-button
						>
						<el-button
							type="primary"
							@click="submit(1)"
							:disabled="list?.length == 0"
							>下单并提交审核
						</el-button>
					</div>
				</div>
			</ErpFooter>

			<AddressList
				v-if="dialogVisible"
				:id="setAddressQuery.id"
				@close="() => (dialogVisible = false)"
				@change="getAddress"
			/>

			<MatchGoods
				v-if="matchDialog"
				@cancel="matchDialog = false"
				@ok="comOk"
				:query="comQuery"
			/>

			<Edit v-if="editShow" :selectedList="selectedList" :remarkList="remarkList" :accounts="accounts" :customization="1" @editBack="editBack"/>
			<PartsPrice v-if="!!changePartsPriceData" :changePartsPriceData="changePartsPriceData" @closeBack="changePartsPriceBack" :submitType="submitType"/>
		</div>
		<DeleteOrder v-if="deleteOrderData" :submitType="submitType" :searchData="searchDataS" :deleteOrderData="deleteOrderData" @deleteOrderBack="deleteOrderBack" />
	</div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import ErpNav from '@/components/erpNav/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import MatchGoods from '../components/matchGoods.vue'
import { confirm, deepCopy,_debounce } from '../../../../utils/tool.js'
import {getOrganizationTree} from '@/api/user.js'
import Edit from './edit.vue'
import DeleteOrder from './deleteOrder.vue'
import {
	reactive,
	toRefs,
	onMounted,
	ref,
	defineProps,
	defineEmits,
	computed,
	watch
} from 'vue'
import {
	accountList,
	changePrice, pairMatch,
	testPairInfo
} from '../../purchaseManagement/outOfStock/hooks/hooks'
import {
	submitCar,
	submitDirect,
	direct,
	renderCat
} from '@/api/purchase/outOfStock.js'
import { getRemarkTypes } from '@/api/order/orderManagement.js'
import AddressList from '../../components/AddressList'
import { storage } from '../../../../utils/storage'
import PartsPrice from '@/views/purchase/purchaseManagement/components/partsPrice.vue'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const props = defineProps({
	dataList: Object,
	submitType: 0, // 1. 购物车过来的 ,0 直购过来的
	fromType: 0, // 0 缺货采购, 1备货采购
	param: Object, //请求参数
	status:{
		type:Number,
		default:0 // 0普货 1定制品
	},
	submitData:Object,
	searchData:Object,
	froms:String // 来源：customCart/customOder
})
const emits = defineEmits(['refresh', 'cancel','deleteData'])
let matchInfo = null // 配对的商品信息
const data = reactive({
	paramS:props.param,
	searchDataS:props.searchData,
	deleteOrderData:null,
	pageDataList:props.dataList,
	oraganziationList:[],// 组织架构列表
	remarkList: [], //备注列表
	list: [],
	accounts: [], //采购员
	account: null, // 当前采购员
	dialogVisible: false, // 显示地址弹框
	matchDialog: false,
	comQuery: null,
	formRef: {}, // formRef
	setAddressQuery: {
		id: null,
		setId: null //操作的那项
	}, // 设置地址配置项
	goodAttribute:[
		{
			label:'原品',
			value:1
		},
		{
			label:'相似品',
			value:2
		},
		{
			label:'替代品',
			value:3
		}
	],
	tableCheckdAll:false,
	selectedList:[],
	editShow:false,
	tableIndeter:false,
	changePartsPriceData:null
})
const {
	searchDataS,
	paramS,
	list,
	accounts,
	setAddressQuery,
	dialogVisible,
	remarkList,
	account,
	comQuery,
	matchDialog,
	formRef,
	oraganziationList,
	goodAttribute,
	tableCheckdAll,
	selectedList,
	editShow,
	tableIndeter,
	changePartsPriceData,
	deleteOrderData
} = toRefs(data)
const xtableRef = ref(null)

function partSwitchChanges(row){
	if(!row.partSwitch) row.signlePrice = row.signlePriceText
	else if(row.signlePrice - 0 > 0){
		row.signlePriceText = row.signlePrice
		row.signlePrice = 0
	}
}


const tableRules = {
	signlePrice: [{ validator: valitorSinglePrice, trigger: 'blur' }],
}

const rules = {
	address: [
		{ required: true, trigger: 'change', message: '收货地址不能为空!' }
	],
	accountId: [
		{ required: true, trigger: 'change', message: '1688账号不能为空!' }
	],
	settlementType: [
		{ required: true, trigger: 'change', message: '结算方式不能为空!' }
	],
	toDeptId:[
		{ required: true, trigger: 'change', message: '备货团队不能为空!' }
	], // 备货部门校验
	settlementValue: [
		{ required: true, trigger: 'blur', message: '金额不能为空!' }
	] //结算方式的值
} // 校验

function valitorSinglePrice({ row }) {
	const { type, partnerType, purchasePrice, signlePrice, lastPurchasePrice } =
		row
	if (type === 'item') {
		// let price = lastPurchasePrice || purchasePrice
		if (Number(signlePrice) > Number(purchasePrice) + 3)
			return new Error('单价超出采购报价3元,无法生成采购单!')
	}
}

function skuStr(row){
	let str = '';
	jsonData(row.pairInfo).speInfo?.forEach(v=> str += v.spe + ':' + v.speVal);
	return str
}

function renderSku(arr){
	let str = ''
	if(arr){
		arr.forEach(v=>{
			//{{ a.spe ? a.spe + ':' : '' }}{{ a.speVal }}
			str += (v.spe + ':' + v.speVal)
		})
	}
	return str
}

function changePartsPrice(row){
	data.changePartsPriceData = row
}
function changePartsPriceBack(val){
	data.changePartsPriceData = null
	if(val) {
		const { customizationType, skuList } = props.submitData
		const directRender = {
			customizationType,
			skuList:skuList.filter(v=>v.relIdList.length > 0)
		}
		if (props.submitType === 0) {
			direct(directRender).then(res => {
        if (res.code == 200) {
          data.pageDataList.data = res.data
					data.tableCheckdAll = false
					data.tableIndeter = false
					changeList()
					handleCheckedAll()
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
		} else {
			renderCat(directRender).then(res => {
        if (res.code == 200) {
          data.pageDataList.data = res.data
					data.tableCheckdAll = false
					data.tableIndeter = false
					changeList()
					handleCheckedAll()
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
		}
	}
}

function cancelMatch(row){
	const {id,type, signlePrice} = row
	confirm(
		'确定解除该商品的配对关系?',
		_ => {
			row.link = null
			row.pairInfo = null
			// row.signlePrice = row.lastPurchasePrice || row.purchasePrice
		},
		_ => { console.log(_)}
	)

} // 解除配对

function valitorPairInfo({ row }) {
	const { partnerType, pairInfo, type, thirdPlatformSupplierId } = row
	if (
		partnerType === 2 &&
		pairInfo &&
		JSON.parse(pairInfo)?.sellerUserId !== thirdPlatformSupplierId
	)
		return new Error('供应商商品未配对!')
	if (type === 'item' && partnerType === 2 && !pairInfo)
		return new Error('供应商商品未配对!')
}

function getOrganization(){
	getOrganizationTree().then(res=>{
		if(res.code === 200){
			data.oraganziationList = deleteChildren(res.data)
		}
	})

	function deleteChildren(arr){
		arr.forEach(v=>{
			if(v?.children?.length > 0){
				v.children = deleteChildren(v.children)
			}else{
				v.children = null
			}
		})
		return arr
	}

}


function computedSinglePrice(row) {
	const { type, partnerType, purchasePrice, signlePrice, lastPurchasePrice } =
		row
	// let price = lastPurchasePrice || purchasePrice
	if (type === 'item') {
		return Number(signlePrice) > Number(purchasePrice) + 3
	} else {
		return false
	}
}

function changeList() {
	const { productList } = data.pageDataList.data
	data.list = clearTree(productList || [])
}

function jsonData(info) {
	if (info) return JSON.parse(info)
	return Object
} // 格式化pairInfo

const totalInfo = computed(() => {
	let supplierList = data.list.filter(v => v.type === 'fa') // 供应商列表
	let goodsTypeList = [] // 商品列表
	supplierList.forEach(v => {
		goodsTypeList = goodsTypeList.concat(...v.skuList)
	})
	let goodsNum = 0
	goodsTypeList.forEach(v => (goodsNum += v.quantity))

	let totalPrice = 0
	goodsTypeList.forEach(v => {
		const { signlePrice, quantity } = v
		let total = Number(signlePrice) * quantity || 0
		totalPrice += total
	})
	return {
		supplierNum: supplierList.length || 0,
		goodsTypeNum: goodsTypeList.length || 0,
		goodsNum,
		totalPrice
	}
}) // 计算供应商数量,商品种类,数量计件,总价

function clearTree(list) {
	let arr = []
	list.forEach(item => {
		if (item.skuList) {
			item.type = 'fa'
			item.id = item.supplierId + item.warehouseId
			arr.push(item)
			if (item.skuList.length > 0) {
				item.skuList.forEach(a => {
					a.type = 'item'
					a.parentId = item.id
					a.partnerType = item.partnerType
					a.partnerTypeName = item.partnerTypeName
					a.thirdPlatformSupplierId = item.thirdPlatformSupplierId
					a.goodAttribute = 1
					let itemCh = {
						type: 'itemCh'
					}
					if (
						a.pairInfo &&
						a.pairInfo.sellerUserId === item.thirdPlatformSupplierId &&
						JSON.parse(a.pairInfo).price &&
						item.partnerType === 2
					) {
						a.signlePrice = JSON.parse(a.pairInfo).price
					} else {
						a.signlePrice =
							a.price  || a.purchasePrice || a.lastPurchasePrice || 0
					}
					a.partsPrice = a.partsPrice || 0
					if(a.signlePrice - 0 === 0){
						a.signlePriceText = a.purchasePrice - 0
					}else{
						a.signlePriceText = a.signlePrice
					}
					partSwitchChanges(a)
					arr.push(...[a, itemCh, itemCh])
				})
			}
			let frCh = {
				id: item.supplierId + item.warehouseId,
				type: 'frCh',
				partnerType: item.partnerType,
				form: {
					taxRate: 0,
					settlementType: item.settlementType || null,
					settlementValue: null, // 预付
					days: item.settlementType === 2 ? String(item.settlementValue) : '30', //账期天数
					settlementUnit: 1,
					remarkTypeId: null,
					remark: null,
					accountId: null,
					addressId: null,
					address: null,
					partnerType: item.partnerType,
					supplierId: item.supplierId,
					toDeptId:null,// 备货部门id
				}
			}
			let ch = {
				type: 'ch'
			}
			arr.push(...[frCh, ch, ch, ch])
		}
	})
	return arr
}

function colSpanMethond({ row, rowIndex, columnIndex }) {
	if (row?.type === 'fa' && columnIndex === 1) {
			return { rowspan: 1, colspan: 9 }
		} else if (row?.type === 'fa' && columnIndex > 1) {
			return { rowspan: 0, colspan: 0 }
		}

		if (row.type == 'item') {
			if (columnIndex === 10) {
				return { rowspan: 0, colspan: 0 }
			} else {
				return { rowspan: 3, colspan: 1 }
			}
		}

		if (row.type === 'itemCh' && columnIndex !== 10) {
			return { rowspan: 1, colspan: 0 }
		}
		if (row.type === 'frCh') {
			if (columnIndex === 1) {
				return { rowspan: 4, colspan: 10 }
			} else {
				return { rowspan: 0, colspan: 0 }
			}
		}
		if (row.type === 'ch' && columnIndex !== 10) {
			return { rowspan: 0, colspan: 0 }
		}
}

function match(row) {
	matchInfo = row
	const { mainImg, skuCode, link, pairInfo, thirdPlatformSupplierId } = row
	let speInfo
	if (pairInfo) speInfo = JSON.parse(pairInfo).speInfo
	data.comQuery = {
		pairInfo: {
			img: mainImg,
			name: skuCode,
			speInfo:testPairInfo(row)  ? speInfo :null
		},
		url: testPairInfo(row) ? link : null,
		thirdPlatformSupplierId
	}
	data.matchDialog = true
} // 配对

function comOk(val) {
	const { sku, spe, url } = val
	const { purchasePrice, quantity, id, supplierId } = matchInfo
	let price = ''
	if (val.data.orderParam.skuParam.skuPriceType == 'skuPrice') {
		price = sku.price || sku.discountPrice
	} else {
		//根据采购数量 确定单价
		val.data.orderParam.skuParam.skuRangePrices.some(item => {
			price = item.price
			return true
		})
	}

	let pairInfo = {
		img: sku?.imageUrl || val.data.goodsSpu.mainImg,
		name: val.data.goodsSpu.goodsName,
		offerId: val.data.goodsSpu.goodsNum,
		specId: sku?.specId || null,
		price: price,
		sellerUserId: val.data.shopInfo.sellerUserId,
		speInfo: spe.map(item => {
			return {
				spe: item.key,
				speVal: item.value.name
			}
		})
	}

	data.list.forEach(v => {
		if (v.id === id && v.type === 'item') {
			v.link = url
			v.pairInfo = JSON.stringify(pairInfo)
			if(v.partSwitch != 1) v.signlePrice = price
		}
	})
}

function init() {
	if (props.submitType === 0) {
		direct({ renderOrderList: props.param }).then(res => {})
	} else {
		renderCat({ planIdList: props.param }).then(res => {})
	}
}

function goBack() {
	if(props.froms === 'customCart') emits('refresh')
	else router.push({ name: 'outOfStock', })
}

function createMaxPrice(row) {
	const a = deepCopy(row)
	return row.purchasePrice ? row.purchasePrice - 0 + 3 : row.lastPurchasePrice - 0 + 3
} // 最大单价

function cellStyle({ row, column }) {
	if (row.type === 'fa') return { backgroundColor: '#FAFAFA' }
	if (row.type === 'frCh') return { backgroundColor: '#FFFBE6' }
} //单元格样式

function computedTotal(row) {
	let total = 0
	let fa = data.list.find(v => v.id === row.id && v.type === 'fa')
	const { taxRate } = row.form
	fa.skuList?.map(a => {
		const { totalAmount} = a
		let price = totalAmount -0
		total += price || 0
	})
	let taxPrice = 0
	if (taxRate) taxPrice = (taxRate / 100) * total //  税费
	return (total + taxPrice).toFixed(2)
} // 计算单个总计

function totalPrice() {
	let renderTotalAmount = 0
	let frChList = data.list.filter(v => v.type === 'frCh')
	frChList.map(item => {
		let fa = data.list.find(v => v.id === item.id && v.type === 'fa')
		const { taxRate } = item.form
		if (fa) {
			const { skuList } = fa
			skuList.map(v => {
				const { totalAmount } = v
				let total = totalAmount - 0 || 0
				if (taxRate) total = (taxRate / 100) * total + total //  税费
				renderTotalAmount += total
			})
		}
	})

	return renderTotalAmount.toFixed(2)
} // 总价

function setAdress(row) {
	const { form, id } = row
	data.setAddressQuery.id = form.accountId
	data.setAddressQuery.setId = id
	data.dialogVisible = true
} // 打开设置地址弹框

function changeAccount(v, row) {
	const { form, id } = row
	data.list.forEach(item => {
		if (item.id === id && item.type === 'frCh') {
			item.form.address = null
		}
	})
}

function getAddress(val) {
	const { id, address } = val
	data.list.forEach(item => {
		if (item.id === data.setAddressQuery.setId && item.type === 'frCh') {
			item.form.addressId = id
			item.form.address = address
		}
	})
} // 获取选取的地址

function getRemark() {
	getRemarkTypes({ useScope: '2' }).then(res => {
		if (res.code == 200) {
			data.remarkList = res.data
		}
	})
} // 获取备注

function deleteOrderBack(val){
	data.deleteOrderData = null
	if(val) {
		data.pageDataList = val.setOrderData
		props.param = val.setOrderData.param
		data.searchDataS = val.searchData
		data.tableCheckdAll = false
		data.tableIndeter = false
		changeList()
	}
}

function del(row) {
	data.deleteOrderData = deepCopy(row)
} // 删除单个


const submit =  _debounce(async (status)=>{
	const errMap = await xtableRef.value.validate(true)
	if (errMap) {
		setTimeout(() => {
			xtableRef.value.clearValidate()
		}, 2000)
		return ElMessage.error('商品校验不通过!')
	}
	let promise = []
	for (let i in data.formRef) {
		data.formRef[i]?.validate((res, object) => {
			promise.push(res)
		})
	}
	let validateReson = await Promise.all(promise)
	if (validateReson.some(v=> !v)) return ElMessage.error('请补全订单信息!')
	let frChList = data.list.filter(v => v.type === 'frCh')
	let renderTotalAmount = 0
	let productList = []
	for (let i = 0; i < frChList.length; i++) {
		let item = frChList[i]
		let a = deepCopy(item.form)
		if (item.partnerType === 2) {
			if (!a.accountId) return ElMessage.error('1688账号不能为空!')
			if (!a.address) return ElMessage.error('收货地址不能为空!')
		}
	if(a.toDeptId && a.toDeptId?.length>0){
		a.toDeptId = a.toDeptId[a.toDeptId.length-1]
	}
		if (a.taxRate) {
			a.taxRate = String(a.taxRate)
		} else {
			a.taxRate = '0'
		}
		if (a.settlementType === 2) {
			a.settlementValue = a.days
			a.settlementUnit = null
		} else if (a.settlementType === 1) {
			a.settlementValue = String(a.settlementValue)
		} else {
			a.settlementValue = null
			a.settlementUnit = null
		}

		delete a.days // 这是备用的账期的字段,提交时删除
		let fa = data.list.find(v => v.id === item.id && v.type === 'fa')
		let sl = []
		if (fa) {
			const { skuList } = fa
			skuList.forEach(v => {
				renderTotalAmount += Number(v.partsPrice)
				v.orderInfoList.forEach(it => {
					let relIdList = []
					relIdList.push(it.relId)
					const { id, skuId, signlePrice, quantity, pairInfo, link,thirdPlatformSupplierId,goodAttribute,productId, price } = it
					let sellerUserId
					if(pairInfo) sellerUserId = JSON.parse(pairInfo).sellerUserId
					let b = {
						id,
						skuId,
						purchasePrice: String(v.signlePrice),
						quantity,
						pairInfo :thirdPlatformSupplierId === sellerUserId ? v.pairInfo :null,
						// pairInfo,
						link:v.link,
						goodAttribute:v.goodAttribute,
						productId,
						relIdList,
						partSwitch:v.partSwitch
					}
					let total = Number(v.signlePrice) * quantity || 0
					let taxPrice = Number(a.taxRate) ? (Number(a.taxRate) * total) / 100 : 0
					renderTotalAmount += total + taxPrice
						sl.push(b)
					})
			})
			a.skuList = sl || []
			productList.push(a)
		}
	}
// props.status

	const param = {
		status,
		renderTotalAmount: String(renderTotalAmount),
		productList,
		customizationType:props.status - 0,
	}
	if (props.submitType === 0) {
		submitDirect(param)
			.then(res => {
				// 操作成功
				if(res.code == 200){
					setTimeout(()=>back(res),500)
				}
			})
	} else {
		submitCar(param)
			.then(res => {
				if(res.code == 200){
					setTimeout(()=>back(res),500)
				}
			})

	}

	function back(res) {
		if (res.code === 200) {
			if (res.data.productList?.length > 0) {
				// ElMessage.error('请填写正确信息!')

				handleRes(res.data.productList, deepCopy(data.list))
			} else {
				ElMessage.success('操作成功')
				if(props.froms === 'customCart') emits('refresh')
				else router.push({ name: 'outOfStock', })
			}
		}
	}

	function handleRes(list, daList) {

		let newItem = daList.filter(v => v.type === 'item')
		let skuList = []
		let errorMessage = []
		list.forEach(item => {
			let msg = `<p>${
				item.errorMsg || '商品信息错误'
			} </p>`
			errorMessage.push(msg)
			skuList = skuList.concat(item.skuList || [])
		})


		newItem.forEach(v=>{
			if(!skuList.some(y=>y.id == v.id)) del(v)
		})
		ElMessage({
			type: 'error',
			dangerouslyUseHTMLString: true,
			message: errorMessage.join('')
		})
	} // 处理返回的list


})

function cancel() {
	if(props.froms === 'customCart') emits('cancel')
	else router.push({ name: 'outOfStock', })
} // 取消


// 批量编辑
function batchModification(){
	if(!data.selectedList.length) return ElMessage.warning({ message: '请选择商品' })
	data.editShow = true
}

function signlePriceChange(row){
		if(row.signlePrice > row.purchasePrice - 0 + 3){
			row.signlePrice = (row.purchasePrice - 0 + 3).toFixed(2)
		}
	row.totalAmount = (row.signlePrice - 0) * (row.quantity - 0) + (row.partsPrice - 0)
}
function signlePriceBlur(row){
	if(row.signlePrice === null || row.signlePrice === '') row.signlePrice = 0
}

function editBack(val){
	data.editShow = false
	if(!val) return false
	data.list.forEach(v=>{
		if(v.type === 'item' && data.selectedList.some(ele=>ele.id === v.id)){
				if(val.goodAttributeChange) v.goodAttribute = val.goodAttribute
				if(val.signlePriceChange) {
					if(val.partSwitchChange){
						if(val.signlePrice == 0){
							v.signlePrice = val.signlePrice
							v.partSwitch = 1
						}else{
							v.partSwitch = val.partSwitch
							if(v.partSwitch) v.signlePrice = 0
							else v.signlePrice = val.signlePrice
							// else v.signlePrice = v.signlePriceText //11136
						}
					}else{
						if(val.signlePrice == 0){
							v.signlePrice = val.signlePrice
							v.partSwitch = 1
						}else{
							if(v.partSwitch != 1){
								if(val.signlePrice - 3 > v.purchasePrice){
									v.signlePrice = (v.purchasePrice - 0 + 3).toFixed(2)
								}else{
									v.signlePrice = (val.signlePrice - 0).toFixed(2)
								}
								v.totalAmount = (v.signlePrice - 0) * (v.quantity - 0) + (v.partsPrice - 0)
							}
						}
					}
				}else{
					if(val.partSwitchChange && v.partSwitch != val.partSwitch ){
						v.partSwitch = val.partSwitch
						if(v.partSwitch) {
							if(v.signlePrice) v.signlePriceText = v.signlePrice
							v.signlePrice = 0
						}
						else v.signlePrice = v.signlePriceText
					}
				}
		}else if(v.type === 'frCh'&& data.selectedList.some(val=>val.parentId === v.id)){
			if(val.accountIdChange){
				v.form.accountId = val.accountId
				v.form.addressId = val.addressId
				v.form.address = val.address
			}
			if(val.remarkTypeIdChange){
				v.form.remarkTypeId = val.remarkTypeId
				v.form.remark = val.remark
			}
		}
	})
	data.tableCheckdAll = false
	handleCheckedAll()
}

function handleChecked(row,val){
	data.selectedList = data.list.filter(v=>v.checked && v.type === 'item')
	const thisComonData = data.list.filter(v=>v.parentId === row.parentId)
	if(thisComonData.every(v=>v.checked)){
		data.list.forEach(v=>{
			if(v.id == row.parentId) {
				v.indeterminate = false
				v.checked = true
			}
		})
	}else if(thisComonData.every(v=>!v.checked)){
		data.list.forEach(v=>{
			if(v.id == row.parentId) {
				v.indeterminate = false
				v.checked = false
			}
		})
	}else{
		data.list.forEach(v=>{
			if(v.id == row.parentId) {
				v.indeterminate = true
				v.checked = false
			}
		})
	}
	const thirdList  = data.list.filter(v=> v.type === 'item')
	if(data.selectedList.length === 0){
		data.tableCheckdAll = false
		data.tableIndeter = false
	}else if(thirdList.length === data.selectedList.length){
		data.tableCheckdAll = true
		data.tableIndeter = false
	}else{
		data.tableCheckdAll = false
		data.tableIndeter = true
	}
} // 选中当前数据


function handleCheckedAll(val){
	data.tableIndeter = false
	data.list.forEach(v=>{
		if(v.type === 'fa' || v.type === 'item'){
			v.checked = data.tableCheckdAll
			if(v.type === 'fa') v.indeterminate = false
		}
	})
	data.selectedList = data.tableCheckdAll ? data.list.filter(v=>v.type === 'item') : []
}// 是否全选当前数据

//点击二级
function handleCheckedRowAll(row,val){
	let checkedNum = 0
	data.list.forEach(v=>{
		if(v.parentId == row.id && v.type === 'item'){
			v.checked = row.checked
		}
		if(v.type === 'fa' && v.checked) checkedNum++
	})
	row.indeterminate = false
	if(checkedNum === data.list.filter(v=>v.type === 'fa').length){
		data.tableCheckdAll = true
		data.tableIndeter = false
	}else if(checkedNum === 0){
		data.tableCheckdAll = false
		data.tableIndeter = false
	}else{
		data.tableCheckdAll = false
		data.tableIndeter = true
	}
	data.selectedList = data.list.filter(v=>v.checked && v.type === 'item')
}

watch(() => data.list,(pre,cur)=>{
	cur.forEach(v=>{
		if(v.type === 'item') {
			v.totalAmount = v.signlePrice * v.quantity
			if(v.signlePrice == 0) {
				v.partSwitch = 1
			}
		}
	})
}, { deep: true })


onMounted(() => {
	accountList(res => {
		data.accounts = res || []
	})
	getRemark()
	changeList()
	getOrganization()
	data.account = storage.get('ERP_USERINFO').fullName
})
</script>

<style scoped lang="scss">
.table {
	margin-top: 24px;
	background: white;
	padding: 24px;
}
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.goods {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;

	.goodsImg {
		width: 70px;
		height: 70px;
	}
	.goodsInfo {
		margin-left: 15px;
		text-align: left;
		width: 200px;
		.infoName {
			font-size: 12px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			line-height: 22px;
			max-height: 22px;
			overflow: hidden; /**隐藏超出的内容**/
			white-space: nowrap;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
		}
		.tag {
			margin-left: 10px;
		}
		.infoSku {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
			line-height: 22px;
			max-height: 22px;
			overflow: hidden; /**隐藏超出的内容**/
			white-space: nowrap;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
			flex-wrap: wrap;
		}
	}
} // 商品

.priceAll {
	text-align: center;
	margin: 10px 0;
	span {
		font-size: 22px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #fd4c60;
	}
}

.formBox {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	justify-content: center;
}

.tab {
	display: flex;
	align-items: center;
	justify-content: flex-end;

	.num {
		margin-right: 50px;
		font-size: 14px;

		span {
			margin-right: 15px;
		}
	}

	.btn {
		margin-right: 30px;
	}
}

.box{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.goodsBox{
		width: 78%;
	}
	.goodsType{
		width: 22%;

	}
}

:deep(.vxe-table--render-default .vxe-body--column.col--ellipsis > .vxe-cell) {
	max-height: 300px;
}
// :deep(.vxe-body--y-space){
// 	height: auto!important;
// }
:deep(.el-form-item__content) {
	margin: 0 15px;
}
:deep(.el-radio.el-radio--small) {
	height: 24px !important;
}
:deep(.table .el-radio-group) {
	height: 24px;
}

:deep(.vxeSelect .vxe-table--ignore-clear){
	z-index: 99999 !important;
}
:deep(.vxe-table--render-default .vxe-body--column.col--dirty:before){
	border-color: transparent;
}
</style>
