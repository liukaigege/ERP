<!--采购计划-->
<template>
	<div class="cotainer">
			<div class="header">
				<div>
					<el-checkbox
						class="check"
						:indeterminate="isIndeterAll()"
						v-model="checkedAll"
						@change="selectedAll"
					></el-checkbox>
					已选 <span>{{ total }}</span
					>条
					<el-button type="text" v-permission="'removePurchasePlan'" class="delete_all" @click="deleteAllSelected">批量删除</el-button>
				</div>

				<div class="close">
					<i class="el-icon-close" @click="close"></i>
				</div>
			</div>

			<div class="itemBox">
				<div class="item" v-for="(item, index) in planList" :key="index">
					<div class="itemHeader">
						<div class="left">
							<el-checkbox
								v-model="item.checked"
								@click="
									v => item.skuList.forEach(v => (v.checked = !item.checked))
								"
								:disabled="!item.supplierId"
								:indeterminate="isIndeterItem(item)"
								@change="() => testCheckedAll()"
							></el-checkbox>
							<span :title="item.supplierName">{{
								item.supplierName?.length > 30
									? item.supplierName.slice(0, 30) + '...'
									: item.supplierName || '暂无供应商'
							}}</span>
						</div>

						<div class="right">
							{{ item.warehouseName }}
						</div>
					</div>

					<div class="itemContent" v-for="a in item.skuList" :key="a.id">
						<div class="itemGoods fls">
							<div class="goodsLeft fls">
								<div>
									<el-checkbox
										v-model="a.checked"
										:disabled="!item.supplierId"
										@change="() => changeSkuItem(index)"
									></el-checkbox>
								</div>
								<div class="info fls">
									<div class="infoImg">
										<el-image
											style="width: 60px; height: 60px"
											:src="a.mainImg"
											fit="contain"
										></el-image>
									</div>
									<div class="infoC">
										<p class="title" :title="a.skuCode">
											{{
												a.skuCode?.length > 30
													? a.skuCode.slice(0, 30) + '...'
													: a.skuCode
											}}
										</p>
										<p class="price">
											[{{ changePrice(a.purchasePrice) }}/{{
												changePrice(a.lastPurchasePrice)
											}}]
										</p>
									</div>
								</div>
							</div>

							<div class="goodsRight">
								<p class="price">
									￥
									{{ (a.quantity * Number(a.price)).toFixed(2) || 0.0 }}
								</p>
								<el-input-number
									:min="1"
									v-model="a.quantity"
									@change="val => addOrReduce(item, a)"
									:disabled="!item.supplierId"
									style="margin: 2px 0 5px 0"
								></el-input-number>
								<el-button v-permission="'removePurchasePlan'" type="text" @click="del(a)">删除</el-button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="bottom">
				<div class="btn">
					<div class="bottomText">
						<div class="textLeft">已选：{{ getAll().totalNum }}件</div>
						<div class="textRight">￥{{ getAll().totalMoney.toFixed(2) }}</div>
					</div>

					<el-button v-permission="'outStock:btn:createPurOrder'" class="button" type="primary" @click="submit"
						>生成采购单
					</el-button>
				</div>
			</div>
	</div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import {
	onMounted,
	reactive,
	toRefs,
	ref,
	defineProps,
	watch,
	computed,
	defineEmits
} from 'vue'
import { renderCat, addOrUpdate } from '@/api/purchase/outOfStock.js'
import { getPlanList, deletePlans, changePrice } from '../hooks/hooks'
import { deepCopy } from '../../../../../utils/tool'
import { useRoute } from 'vue-router'
const route = useRoute()
const props = defineProps({
	dataList: Array,
	activeName:String
})

const emit = defineEmits(['detail', 'close'])
const data = reactive({
	drawer: true,
	planList: [],
	checkedAll: false, //全选
	checkedList: [] // 选中的记录列表
})
const { drawer, planList, checkedAll, checkedList } = toRefs(data)
watch(
	() => props.dataList,
	(a, b) => {
		// data.planList = a
	},
	{ deep: true }
)

const total = computed(() => {
	let total = 0
	data.planList?.map(item => {
		if (item.checked) {
			total += item.skuList?.length || 0
		} else {
			item.skuList.map(v => {
				if (v.checked) total += 1
			})
		}
	})
	return total
})

function isIndeterItem(item) {
	if (item.skuList.some(v => v.checked) && item.skuList.some(v => !v.checked)) {
		return true
	}
	return false
} // checkbox 状态

function isIndeterAll() {
	let list = data.planList
	let arr = []
	list.forEach(v => {
		arr = arr.concat(v.skuList)
	})
	let l = arr.filter(v => v.checked)
	if (l?.length === arr.length) {
		return false
	} else if (l.length > 0) {
		return true
	}
}




function changeSkuItem(index) {
	let item = data.planList[index]
	data.planList[index].checked = !item.skuList.some(v => !v.checked)
	testCheckedAll()
}

function testCheckedAll() {
	let arr = []
	data.planList.forEach(v => (arr = arr.concat(v.skuList)))
	let l = arr.filter(v => v.checked)
	if (arr.length === l.length) return (data.checkedAll = true)
	return (data.checkedAll = false)
} // 检查是否全选

function deleteAllSelected(){
	const deleteList = [],
	surplusList = [];
	data.planList.forEach(v=>{
		v.skuList.forEach(item => {
			if(item.checked) deleteList.push({id:item.id,orderId:item.orderId})
		})
		const surplusSkuList = v.skuList.filter(item => !item.checked)
		if(surplusSkuList?.length) {
			const thisData = deepCopy(v)
			thisData.skuList = surplusSkuList
			surplusList.push(thisData)
		}
	})
	if(deleteList.length === 0) return ElMessage.error('请选择商品!')
	const query = {
		type: 1,
		supplierId: null,
		warehouseId: null,
		skuCode: null,
		goodsId: null,
		goodsName: null,
		supplierName: null,
		customizationType:0
	}
	deletePlans({ query, list: deleteList }, res => {
		data.planList = surplusList
		data.checkedAll = false
	})
}


function testSingleCheckedAll(){
	data.planList.forEach(v=>{
		let isbole = v.skuList?.some(v=>!v.checked)
		v.checked = !isbole
	})
} // 检查单个是否全选


function selectedAll(value) {
	data.planList.forEach(v => {
		v.checked = value
		v?.skuList.forEach(i => (i.checked = value))
	})
} //全选

function getPla() {
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
		}
	)
	// 获取采购计划列表
}

function submit() {
	let skuList = getSlectedList().planIdList || []
	if (skuList.length == 0) return ElMessage.error('请勾选采购计划!')
	renderCat({ skuList }).then(res => {
		if (res.code == 200) {
			emit('detail', { data: res.data, type: 1, param: skuList })
		}
	})
	// emit('detail')
} // 生成采购单

function getSlectedList() {
	let planIdList = []
	let selectedList = []
	data.planList.forEach(item => {
		if (!item.supplierId) return
		item?.skuList.forEach(a => {
			if (a.checked) {
				let p = a.lastPurchasePrice != null ? Number(a.lastPurchasePrice) : Number(a.price)
				a.thirdPlatformSupplierId = item.thirdPlatformSupplierId
				selectedList.push(a)
				planIdList.push({
					id: a.id,
					purchasePrice: p + '',
					quantity: a.quantity
				})
			}
		})
	})

	return {
		planIdList,
		selectedList
	}
}

function addOrReduce(item, row) {
	const { supplierId, warehouseId } = item
	const {
		quantity,
		lastQuantity,
		price,
		skuId,
		purchasePrice,
		lastPurchasePrice,
		pairInfo,
		suggestId
	} = row
	let step = 1
	let stepNum = Math.abs(quantity - lastQuantity)

	if (quantity < lastQuantity) step = -1

	const query = {
		type: 1,
		supplierId: null,
		warehouseId: null,
		skuCode: null,
		goodsId: null,
		goodsName: null,
		supplierName: null
	}
	const skuList = [
		{
			type: 1,
			skuId,
			quantity: stepNum > 1 ? quantity : step,
			pairInfo,
			warehouseId,
			supplierId,
			suggestId,
			qtyOperateType: stepNum > 1 ? 2 : 1 // 2 覆盖,1 递增/减
		}
	]

	let planIdList = getSlectedList().planIdList || []

	let q = quantity
	addOrUpdate({ query, skuList })
		.then(res => {
			if (res.code == 200) {
				let list = res.data
				data.planList.forEach((item,index)=>{
					let findItem = list.find(v => item.supplierId === v.supplierId )
					if(findItem){
							item.skuList = findItem.skuList
							item.skuList?.forEach(v => {
								if (planIdList.some(x=>x.id == v.id)) {
									v.checked = true
								} else {
									v.checked = false
								}
								// 保留勾选项
								v.lastQuantity = v.quantity
							})
					}else{
						data.planList.splice(index,1)
					}
				})

			}
		})
		.catch(err => {
			data.planList.forEach(item => {
				item.skuList?.forEach(v => {
					if (v.id === row.id) {
						v.quantity = v.lastQuantity
					}
				})
			})
		})
}

function handleRes(res) {}

function getAll() {
	let { selectedList } = getSlectedList()
	let totalMoney = 0
	let totalNum = 0
	selectedList.map(item => {
		const {pairInfo,purchasePrice,thirdPlatformSupplierId,lastPurchasePrice} = item
		let prices = 0
		if(pairInfo){
			const {price,sellerUserId} = JSON.parse(pairInfo)
			if(sellerUserId === thirdPlatformSupplierId && price){
				prices = Number(price)
			}else{
				prices = Number(lastPurchasePrice || purchasePrice)
			}
		}else{
			prices = Number(lastPurchasePrice || purchasePrice)
		}

		totalMoney += item.quantity * prices
		totalNum += item.quantity
	})
	return {
		totalMoney,
		totalNum
	}
} // 计算当前全部

function del(a) {
	const query = {
		type: 1,
		supplierId: null,
		warehouseId: null,
		skuCode: null,
		goodsId: null,
		goodsName: null,
		supplierName: null,
		customizationType:0
	}
	deletePlans({ query, list: [{id:a.id,orderId:a.orderId}] }, res => {
		console.log(res)
		let planIdList = getSlectedList().planIdList || []
		data.planList.forEach((item,index)=>{
			let findItem = res.find(v => item.supplierId === v.supplierId )
			if(findItem){
				item.skuList = findItem.skuList
				item.skuList?.forEach(v => {
					if (planIdList.some(x=>x.id == v.id)) {
						v.checked = true
					} else {
						v.checked = false
					}
					// 保留勾选项
					v.lastQuantity = v.quantity
				})
			}else{
				data.planList.splice(index,1)
			}

		})
		testCheckedAll()
		testSingleCheckedAll()
		//
		// data.planList = res
	})
} // 删除采购计划



function close() {
	emit('close')
}

onMounted(() => {
	// getPla()
	data.checkedAll = true
	data.planList = props.dataList
})
</script>

<style scoped lang="scss">
.cotainer {
	max-height: 100vh;
	overflow-y: auto;
	padding-bottom: 115px;
}

.fls {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.header {
	position: fixed;
	z-index: 99;
	width: 25%;
	height: 48px;
	background: #f2f2f2;
	display: flex;
	align-items: center;
	padding: 0 10px;
	justify-content: space-between;

	.check {
		margin-right: 10px;
	}

	span {
		color: #1890ff;
	}
}

.itemBox {
	margin-top: 50px;
}
.itemContent {
	padding: 10px;
}
.item {
	background: #ffffff;
	box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
		0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
	margin-bottom: 10px;
	.itemHeader {
		padding: 13px;
		background: #fafafa;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			span {
				margin-left: 10px;
			}
		}
	}
}

.goodsLeft {
	.info {
		margin-left: 10px;
		.infoImg {
			min-width: 60px;
			min-height: 60px;
		}
		.infoC {
			margin-left: 10px;
		}
		.title {
			font-size: 14px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
		}
		.price {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}
.goodsRight {
	margin-left: 20px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: flex-end;
	.price {
		color: #fd4c60;
	}
}

.bottom {
	position: fixed;
	bottom: 0;
	height: 108px;
	width: 25%;
	background: #f2f2f2;
	box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.13);
	z-index: 99;
	.bottomText {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.btn {
		width: 100%;
		padding: 16px 5% 16px 5%;
		.textLeft {
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
		}
		.textRight {
			font-size: 22px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #fd4c60;
		}
		.button {
			width: 100%;
			margin-top: 10px;
		}
	}
}

:deep(.drawerBox) {
	background: red !important;
}
.delete_all{
	color: red;
	margin-left: 15px;
}
.delete_all:hover{
	opacity: .85;
}
</style>
