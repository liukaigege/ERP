import { ElMessageBox, ElMessage } from 'element-plus'
import {
	direct,
	deletePlan,
	renderCat,
	addOrUpdate
} from '@/api/purchase/outOfStock.js'
import { removeShelve, testPairInfo } from './hooks'

export default function (emits, pageType = 0) {
	// const emit = defineEmits(['openDialog'])

	function confirm(text, callback) {
		ElMessageBox.confirm(text, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			"close-on-click-modal":false,
			"close-on-press-escape":false
		}).then(res => {
			callback()
		})
	} //封装的提示弹窗

	function validate(dataList = [] , funName, confirmTitle = '提示',customization = 0 ) {
		/**
		 * dataList 选中的数据
		 * funName 操作方法名
		 * confirmTitle 二次弹窗提示语
		 * */
		// console.log(funName,'==>触发方法名')
		let funCom = {
			skuRemark,
      spuRemark,
			addGoods,
			supplier,
			exportPro,
			shelve,
			addPurchasePlan,
			reductionAll,
			ExportOrder,
			deletes,
			createPurOrder,
			refresh,
		}
		let confirmWhiteList = ['addPurchasePlan', 'deletes'] // 需要二次提示的操作
		let confirmFilter = ['addPurchasePlan'] // 需要过滤
		let noSelected = ['addGoods', 'exportPro', 'ExportOrder', 'refresh'] // 不需要选中数据的操作
		if (dataList?.length !== 0 && confirmFilter.indexOf(funName) !== -1) {
			if (dataList.filter(v => v.supplierId).length == 0)
				return ElMessage.error('请设置供应商!')
		}
		if (dataList?.length === 0 && noSelected.indexOf(funName) === -1) {
			ElMessage.error('请勾选SKU')
			return
		}
		dataList.forEach(v=>v.customization = customization)
		// 需要二次弹窗确认的操作白名单
		if (confirmWhiteList.indexOf(funName) !== -1) {
			confirm(confirmTitle, () => {
				funCom[funName](dataList,customization)
			})
		} else if (funName) {
			funCom[funName](dataList,customization)
		}
	}

	function skuRemark(list,customization) {
		// let newList = list.filter(v => v.supplierId)
		// // if (newList?.length == 0) return ElMessage.error('请设置供应商')
		//过滤供应商存在的数据
		emits('openDialog', { type: 'Remark', list,customization })
	} // 备注

  function spuRemark(list,customization) {
		emits('openDialog', { type: 'SpuRemark', list,customization })
	} // 备注

	function refresh() {
		emits('refreshList')
	} // 手动刷新列表

	function supplier(list,customization) {
		emits('openDialog', { type: 'SetSuplier', list,customization })
	} //  设置供应商

	function exportPro(list,customization) {
		emits('openDialog', { type: 'ExportOrder', list,customization })
	} // 导出采购建议

	function shelve(list,customization) {
		emits('openDialog', { type: 'Shelve', list,customization })
	} // 移入搁置

	function addPurchasePlan(list) {
		let newList = list.filter(v => v.supplierId)
		if (newList.length == 0) return ElMessage.error('请设置供应商!')
		const query = {
			type: 1,
			supplierId: null,
			warehouseId: null,
			skuCode: null,
			goodsId: null,
			goodsName: null,
			supplierName: null
		}

		let skuList = newList.map(v => {
			const {
				editPurNum,
				skuId,
				parentId,
				pairInfo,
				price,
				warehouseId,
				supplierId,
				id,
				link,
				partnerType,
				thirdPlatformSupplierId,
				purchasePrice,
				lastPurchasePrice
			} = v
			let prices = null
			if(pairInfo){
				const {price,sellerUserId} = JSON.parse(pairInfo)
				if(sellerUserId === thirdPlatformSupplierId && price){
					prices = String(price)
				}else{
					prices = String(lastPurchasePrice || purchasePrice)
				}
			}else{
				prices = String(lastPurchasePrice || purchasePrice)
			}
			return {
				link: partnerType === 2 ? link : null,
				type: 1,
				skuId,
				quantity: Number(editPurNum),
				price: prices,
				pairInfo: testPairInfo(v) ? pairInfo : null,
				warehouseId,
				supplierId,
				suggestId: id
			}
		})
		addOrUpdate({ query, skuList }).then(res => {
			if (res.code == 200) {
				emits('next', { type: 'addPurchasePlan' })
			}
		})
	} // 加入采购计划

	function addGoods(list,customization) {
		emits('openDialog', { type: 'AddGoods', list,customization })
	} // 添加商品

	function reductionAll(list,customization = 0) {
		let idList = []
		let skuIdList = []
		list.forEach(v => {
			if(v.idList&&v.idList.length){
				idList = [...idList,...v.idList]
			}else{
				idList.push(v.id)
			}
			skuIdList.push(v.skuId)
		})
		let param = {
			idList: idList,
			status: 1,
			statusDesc: null,
			customization,
			skuIdList
		}
		removeShelve(param, res => {
			ElMessage.success(res.message)
			emits('next')
		})
	} // 批量还原

	function ExportOrder(list,customization) {
		emits('openDialog', { type: 'ExportOrder', list,customization })
	} // 导出订单

	function deletes(list) {
		let idList = list.map(v => {
			return {id:v.id,orderId:v.orderId}
		})
		const param = {
			list:idList,
			query: {
				type: 2,
				supplierId: null,
				warehouseId: null,
				skuCode: null,
				goodsId: null,
				goodsName: null,
				supplierName: null,
				customizationType:0
			}
		}
		deletePlan(param).then(res => {
			if (res.code === 200) {
				emits('next', { type: 'deletes' })
			}
		})
	} // 删除

	function createPurOrder(list) {
		let newList = list.filter(v => v.supplierId)
		if (newList?.length == 0) return ElMessage.error('请设置供应商')
		let renderOrderList = newList.map(v => {
			return {
				suggestId: v.id,
				quantity: v.editPurNum || v.quantity // 备货采购是quantity ,采购建议和购物车是editNum
			}
		})
		let skuList = newList.map(v => {
			let p = v.price != null ? Number(v.price) : Number(v.lastPurchasePrice)
			return {
				id: v.id,
				quantity: v.editPurNum || v.quantity,
				purchasePrice: String(p)
			}
		})
		// 备货采购数量

		if (pageType === 0) {
			direct({ skuList }).then(res => {
				back(res)
			})
		} else {
			renderCat({ skuList }).then(res => {
				back(res)
			})
		}

		function back(res) {
			if (res.code == 200) {
				emits('next', { type: 'createPurOrder', data: res.data })
			}
		}
	} //生成采购单

	return {
		validate
	}
}
