import {deepCopy} from "../../../../../utils/tool";
import {
	getTree,
	planList,
	addRemark,
	modify,
	getPurchaseUsers,
	queryAccountList,
	platformAddress,
	deletePlan,
	pairModify,
	pairModifyPlan,
	setShelve
} from '../../../../../api/purchase/outOfStock.js'
import {ElMessageBox, ElMessage} from "element-plus";
export function fmtData(list) {
  if(list?.length == 0) return []
  let arr = []
  list.forEach(item=>{
		if(item.skuList ){
			item.parentId = null
			item.id = item.goodsId
			item.type = 'fa'
			arr.push(item)
			if(item.skuList.length >0){
				item.skuList.forEach((child,i)=> {
					child.checked = false
					child.parentId = item.id
					child.indeterminate = false
					child.offerPurchaseUserName = item.offerPurchaseUserName // 报价人
					child.editPurNum = child.suggestQuantity || 0
					//goodsID 当做合并单元格的判断信息
					child.type = "ch"
					child.price = child.price ? Number(child.price) : null
					//备货采购使用,存储上次点击数量
					child.partnerType =child.partnerType ?child.partnerType : item.partnerType
					// child.mainImg = child.mainImg+'?x-oss-process=image/resize,w_120,h_120,m_lfit/format,jpg'
					if (!child.supplierId) child.supplierId = item.supplierId
					if (!child.thirdPlatformSupplierId)child.thirdPlatformSupplierId = item.thirdPlatformSupplierId // 第三方平台的sellerId
					//备货采购skuList插入供应商id
				})
				// item.skuList = y
			}
		}
	})
  return arr
}
export function changeTableData(list =[]){
	if(list?.length == 0) return []
	let arr = []
	list.forEach(item=>{
		if(item.skuList ){
			// let x = deepCopy(item)
			item.parentId = null
			item.id = item.goodsId || createId()
			item.type = 'fa'
			item.checked = false
			item.indeterminate = false
			arr.push(item)
			if(item.skuList.length >0){
				let y = deepCopy(item.skuList)
				item.skuList.forEach((a,i)=> {
					let ind = y.findIndex(v => v.id === a.id)
					let child = deepCopy(a)
					child.checked = false
					child.parentId = item.id
					child.indeterminate = false
					child.offerPurchaseUserName = item.offerPurchaseUserName // 报价人
					child.editPurNum = a.suggestQuantity || 0
					if (!child.goodsId) child.goodsId = createId()
					//goodsID 当做合并单元格的判断信息
					child.type = "ch"
					child.editPrice = createEditPrice(Number(a.lastPurchasePrice), Number(a.purchasePrice), a.pairInfo,item.thirdPlatformSupplierId)  // 备货使用的单价
					child.price = Number(a.price)
					child.lastEditPrice = a.editPrice
					child.lastQuantity = a.quantity
					//备货采购使用,存储上次点击数量
					child.partnerType =child.partnerType ?child.partnerType : item.partnerType
					// child.mainImg = child.mainImg+'?x-oss-process=image/resize,w_120,h_120,m_lfit/format,jpg'
					if (!child.supplierId) child.supplierId = item.supplierId
					if (!child.thirdPlatformSupplierId)child.thirdPlatformSupplierId = item.thirdPlatformSupplierId // 第三方平台的sellerId
					//备货采购skuList插入供应商id
					arr.push(...[child,{parentId: item.id, skuId: a.skuId, id: a.id, type: 'chBank'}])
					// y.splice(ind + 1, 0, {parentId: item.id, skuId: a.skuId, id: a.id, type: 'chBank'})
				})
				// item.skuList = y
			}
		}
	})

	function createEditPrice(lPrice, price, pairInfo,thirdId) {
		if (pairInfo && thirdId===JSON.parse(pairInfo)?.sellerUserId && JSON.parse(pairInfo)?.price) return Number(JSON.parse(pairInfo)?.price)
		// 备货有配对商品的时候用配对的单价
		let p = lPrice || price
		if (lPrice > price + 3) p = price + 3
		return p
	}

	// console.log(list, '==>list')
	return arr
} // 生成tableData


export function getOutOfList(list=[]){


} // 生成缺货采购的列表







function confirm(text, callback) {
	ElMessageBox.confirm(text, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		'distinguish-cancel-and-close':true,
		'close-on-click-modal':false,
		'close-on-press-escape':false
	})
		.then(res => {
			callback()
		})

} //封装的提示弹窗


function createId() {
	let timestamp = new Date().getTime()
	let num = parseInt((Math.random() * 9 + 1) * 10000)
	//console.log(timestamp+String(num))
	return timestamp + num
} // 生成随机id

export function getSupplier(callBack) {
	getTree().then(res => {
		if (res.code === 200) callBack(res.data)
	})
} // 获取供应商


export function getPurchasePeople(callback) {
	getPurchaseUsers().then(res => {
			if(res.code == 200) callback(res.data)
	})
} // 获取采购员

export function accountList(callback){
	queryAccountList({accountType:1}).then(res=>{
		if(res.code == 200) callback(res.data)
	})
} // 获取1688账号

export function getAddressList(accountId,callback){
	platformAddress({accountId}).then(res=>{
		if(res.code == 200) callback(res.data)
	})
} // 获取地址信息



export function getPlanList(param={},callBack){
	planList(param).then(res=>{
		if(res.code == 200){
			if(res.data?.length > 0){
				res.data.forEach(item=>{
					item.checked = true
					if(item?.skuList?.length>0){
						item.skuList.forEach(item=> item.checked = true)
					}
				})
			}
			callBack(res.data)
		}
	})
} // 获取采购计划列表


export function setReamrkList(param,callBack){
	addRemark(param).then(res=>{
		if(res.code === 200) callBack(res.data)
	})
}

export function setSuplier(param, callBack) {
	modify(param).then(res => {
		if (res.code === 200) callBack(res.data)
	})
}


export function deletePlans(param, callBack) {
	confirm('是否删除当前内容', () => {
		deletePlan(param).then(res => {
			if (res.code === 200) callBack(res.data)
		})
	})
} // 删除采购计划


export function pairMatch(param, callBack, type = 1) {
	if (type == 0) {
		pairModify(param).then(res => {
			if (res.code === 200) callBack(res.data)
		})
	} else {
		pairModifyPlan(param).then(res => {
			if (res.code === 200) callBack(res.data)
		})

	}

} //修改采购计划配对信息

export function removeShelve(param, callBack) {
	confirm('确定还原该SKU?', () => {
		setShelve(param).then(res => {
			 callBack(res)
		})
	})

} // 移出搁置


export function changePrice(price) {
	return price != null ? `￥${price}` : '-'
}

export function testPairInfo(row){
	const {pairInfo,partnerType,thirdPlatformSupplierId} = row
	if(partnerType !==2 || !pairInfo) return false
	const {sellerUserId} = JSON.parse(pairInfo)
	return sellerUserId == thirdPlatformSupplierId
} // 判断配对商品信息能否显示



