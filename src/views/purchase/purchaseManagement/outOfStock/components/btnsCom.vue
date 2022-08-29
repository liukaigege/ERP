<template>
	<div class="btns">
		<!--	按钮组件-->
		<div class="btnLeft" v-if="list?.button.left">

      <!-- 备注下拉 -->
      <el-dropdown v-if="list?.remark" style="margin-right: 10px" @command='handleClick' v-permission="'outStock:btn:remark'">
        <el-button type="primary" v-permission="'outStock:btn:remark'">备注<i class="el-icon-arrow-down el-icon--right"></i></el-button>
				<template #dropdown>
					<el-dropdown-menu >
						<el-dropdown-item v-for="item in list?.remark" :key="item.permission" :command="item" >{{ item.label }}</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

			<el-button
				v-for="item in list?.button.left"
				:key="item.permission"
				type="primary"
				@click="clickBtns(selectedList, item.fun, item.confirmTitle)"
				v-permission="item.permission"
				>{{ item.label }}
			</el-button>
			<el-button v-permission="'outStock:btn:remarkNor'"  type="primary" @click="remarkList" v-if="status === '1' && btnType == 'outStockBtnOne'">
				标记普货
			</el-button>
			<!--			v-permission="item.permission"-->
			<el-dropdown
				v-if="list?.batch"
				style="margin-left: 10px"
				@command='handleClick'
			>
				<!-- <el-button
					type="primary"
					v-permission="'outStock:btn:batch'"
				> -->
				<!-- 权限去掉 2022-7-16 -->
				<el-button
					type="primary"
				>
					批量操作<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu >
						<el-dropdown-item
							v-for="item in list?.batch"
							:key="item.permission"
							v-permission="item.permission"
							:command="item"
							>{{ item.label }}</el-dropdown-item
						>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
<!--			validate(selectedList, item.value, item.confirmTitle)-->
		</div>
		<div class="btnRight" v-if="list?.button.right">

			<el-button
				v-for="item in list?.button.right"
				:key="item.permission"
				:class="status==='0'&&item.fun === 'exportCustom'?'hide':''"
				type="primary"
				v-permission="item.permission"
				@click="clickBtns(selectedList, item.fun)"
				>{{ item.label }}
			</el-button>

		</div>
		<ExportCustom v-if="exportCustomShow" :selectedList="selectedList" :dataList="dataList" @closeBack="closeBack"/>
		<ExportModel :btnType="btnType" v-if="exportModelShow" :status="status" :selectedList="selectedList" @closeBack="closeBack" />
	</div>
</template>

<script setup>
import {
	defineProps,
	defineEmits,
	reactive,
	onMounted,
	computed,
	watch,
	toRefs
} from 'vue'
import { ElMessage } from 'element-plus'
import btnList from '../hooks/btnList.js'
import btnFun from '../hooks/btnFun.js'
import ExportCustom from '../dialog/exportCustom.vue'
import ExportModel from '../dialog/exportModel.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const props = defineProps({
	btnType: String,
	selectedList: Array,
	status:{// 0普通商品 1定制商品
		type:String,
		default:'0'
	},
	dataList:{
		type:Array,
		default:[]
	},
})
const state = reactive({
	exportCustomShow:false,
	exportModelShow:false,
})
const emits = defineEmits(['openDialog', 'next', 'refreshList'])

let pageWhiteList = ['outStockBtnOne', 'outStockBtnTwo']

let pageType = pageWhiteList.indexOf(props.btnType) !== -1 ? 0 : 1

const { validate } = btnFun(emits, pageType)

const list = computed(() => {
	return btnList[props.btnType] || {}
})
// 按钮列表 和 批量操作列表

function handleClick(item){
	clickBtns(props.selectedList, item.value, item.confirmTitle)
}

function clickBtns(selectedList, fun,title){
	if(fun != 'supplier') selectedList = selectedList.filter(v=>v.supplierId)
	let idList = []
	if(route.name === 'outOfStock') selectedList.forEach(v=>{
		if(v.supplierId){
			idList = [...idList,...v.idList]
		}
	})
	const validateArr = ['createPurOrder','addPurchasePlan']//需要过滤是否设置供应商的列表
	// tabPosition 是否搁置 （1：正常、0：搁置中）
	if(fun==='exportCustom' && route.name === 'outOfStock'){
		state.exportCustomShow = true
	} else if(fun==='createPurOrder'&&props.status==1 && route.name === 'outOfStock'){
		if (!props.selectedList.length)
        return ElMessage.error({ message: '请勾选SKU!' })
		if(idList.length === 0) return ElMessage.error('请设置供应商!')
		router.push({
      path: '/purchase/purchaseManagement/customOder/index',
      query: {
        id: selectedList.map(v=>v.goodsId).join(','),
				type:3,
				tabPosition:1,
				idList:idList.join(','),
				skuIdList: selectedList.map(v=>v.skuId).join(',')
      }
    })
	}else if(fun==='addPurchasePlan'&&props.status==1 && route.name === 'outOfStock'){
		if (!props.selectedList.length)
        return ElMessage.error({ message: '请勾选SKU!' })
		if(idList.length === 0) return ElMessage.error('请设置供应商!')
		router.push({
      path: '/purchase/purchaseManagement/customOder/index',
      query: {
        id: selectedList.map(v=>v.goodsId).join(','),
				type:2,
				tabPosition:1,
				idList:idList.join(','),
				skuIdList: selectedList.map(v=>v.skuId).join(',')
      }
    })
	}else if((fun==='exportPro' || fun==='ExportOrder') && route.name === 'outOfStock'){
		state.exportModelShow = true
	}else if(route.name === 'stockPurchase'){
		validate(props.selectedList,fun,title ,props.status - 0)
	}else if(validateArr.some(v=>v===fun)){
		if (!props.selectedList.length)
        return ElMessage.error({ message: '请勾选SKU!' })
		if(idList.length === 0) return ElMessage.error('请设置供应商!')
		validate(selectedList,fun,title ,props.status - 0)
	}else{
		validate(props.selectedList,fun,title ,props.status - 0)
	}
}
// goods been marked
    function remarkList() {
      if (!props.selectedList.length)
        return ElMessage.error({ message: '请勾选SKU!' })
			let idList = []
			if(route.name === 'outOfStock') {
				props.selectedList.forEach(v=>{
					idList = [...idList,...v.idList]
					// if(v.supplierName){
					// 	idList = [...idList,...v.idList]
					// }
				})
				// if(idList.length === 0) return ElMessage.error('请设置供应商!')
			}
			const goodsList = props.selectedList.map(v=>v.goodsId)
			router.push({
				path: '/purchase/purchaseManagement/customOder/index',
				query: {
					id: goodsList.join(','),
					type:4,
					tabPosition:1,
					idList:idList.join(','),
					skuIdList: props.selectedList.map(v=>v.skuId).join(',')
				}
			})
    }

function closeBack(val){
	state.exportCustomShow = false
	state.exportModelShow = false
}

onMounted(() => {})
const {
		exportCustomShow,
		exportModelShow
	} = toRefs(state)
</script>

<style scoped>
.btns {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.hide{
	display: none;
}
</style>
