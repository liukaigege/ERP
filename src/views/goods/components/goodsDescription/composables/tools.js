import { deepCopy, sortFn } from '@/utils/tool.js'
import { statusTipsData } from './data.js'
import { ElMessage } from 'element-plus'

function cartesianProductOf(d) {
	//计算笛卡尔积，传入数组
	let total = 1
	for (let i = 0; i < d.length; i++) {
		total *= d[i].speValues.length
	}
	let e = []
	let itemLoopNum = 1
	let loopPerItem = 1
	let now = 1
	for (let i = 0; i < d.length; i++) {
		now *= d[i].speValues.length
		let index = 0
		let currentSize = d[i].speValues.length
		itemLoopNum = total / now
		loopPerItem = total / (itemLoopNum * currentSize)
		let myIndex = 0
		for (let j = 0; j < d[i].speValues.length; j++) {
			for (let z = 0; z < loopPerItem; z++) {
				if (myIndex == d[i].speValues.length) {
					myIndex = 0
				}
				for (let k = 0; k < itemLoopNum; k++) {
					if (d[i].speValues[myIndex].nameCn && d[i].speValues[myIndex].checked) {
						e[index] = (e[index] == null ? "" : e[index] + " ") + d[i].speValues[myIndex].nameCn
					} else if (d[i].speValues[myIndex].checked) {
						e[index] = (e[index] == null ? "" : e[index] + " ") + d[i].speValues[myIndex].nameEn
					}
					index++
				}
				myIndex++
			}
		}
	}
	return e
}
function listFn(data) {
	data.forEach(v => {
		v.speValEn = ''
		v.speValCn = ''
		if (v.speValues) {
			v.speValues.forEach(val => {
				if (val.nameCn) v.speValCn += (val.nameCn + " ")
				if (val.nameEn) v.speValEn += (val.nameEn + " ")
			})
		}
		v.skuSwitch = v.skuSwitch ? true : false
		v.speVal = v.speValEn ? v.speValEn : v.speValCn
	})
	return data
}
function checkedButton(data) {
	data.spes.forEach(v => {
		v.speValues = sortFn(v.speValues, 'speId')
		v.speValues.forEach(val => {
			val.checked = true
		})
	})
	return data
}

function saveData(goodsData, linkData, baseInfoData, spevData, picTxtData, attrImagesBack) {
	const { id, skuType } = goodsData
	const { referenceUrls } = linkData
	const { nameCn, nameEn, labels } = baseInfoData
	const { custAttr, spes } = spevData
	const { descriptionCn, descriptionEn, brief } = picTxtData.ptInfo
	const { videoUrl, videoCover, videoCoverCompress } = picTxtData.videoInfo
	let { goodsImages, attrImages, realImages } = picTxtData
	if (attrImagesBack) attrImages = [...attrImages, ...attrImagesBack]
	let skus = []
	if (spevData.offerSku)
		spevData.offerSku.forEach(v => {
			skus.push({
				id: v.skuId,
				pictureId: v.pictureId,
				isChangeImage: v.isChangeImage
			})
		})
	realImages.forEach(v => v.goodsId = goodsData.id)
	return {
		id,
		skuType,
		referenceUrls,
		nameCn,
		nameEn,
		labels,
		custAttr,
		spes,
		descriptionCn,
		descriptionEn,
		brief,
		videoUrl,
		videoCover,
		videoCoverCompress,
		goodsImages,
		attrImages,
		skus,
		realImages
	}
}

function otherSaveData(goodsData, linkData, baseInfoData, spevData, picTxtData) {
	const { id, skuType } = goodsData
	const { source, mode } = goodsData
	let skuId = null
	if (goodsData.custSku) skuId = goodsData.custSku.skuId
	const { referenceUrls } = linkData
	const { nameCn, nameEn, labels, categoryId, suggestPrice, costPrice } = baseInfoData
	const { custAttr, spes, notOfferSku } = spevData
	const { descriptionCn, descriptionEn, brief } = picTxtData.ptInfo
	const { videoUrl, videoCover, videoCoverCompress } = picTxtData.videoInfo
	const { goodsImages, attrImages, realImages } = picTxtData
	const commonAttr = {
		spes,
		skus: notOfferSku
	}
	realImages.forEach(v => v.goodsId = goodsData.id)
	return {
		source,
		mode,
		costPrice,
		expectPrice: suggestPrice,
		commonAttr,
		id,
		skuId,
		skuType,
		referenceUrls,
		categoryId,
		nameCn,
		nameEn,
		labels,
		custAttr,
		descriptionCn,
		descriptionEn,
		brief,
		videoUrl,
		videoCover,
		videoCoverCompress,
		goodsImages,
		attrImages,
		realImages
	}
}

function getData(data) {
	const {
		collectionUrl,
		referenceUrls,
		mode,
		nameCn,
		nameEn,
		categoryId,
		labels,
		authType,
		collectWay,
		suggestPrice,
		costPrice,
		spes,
		offerSku,
		notOfferSku,
		goodsImages,
		skuHistory,
		attrImages,
		descriptionCn,
		descriptionEn,
		videoUrl,
		videoCover,
		videoCoverCompress,
		brief,
		custAttr,
		skuType,
		offerStatus,
		expectPrice,
		skus,
		copyStatus,
		realImages
	} = data
	const channelId = data.channelId || null
	const linkData = {
		collectionUrl,
		referenceUrls,
		mode,
		copyStatus
	}
	//基本信息
	const baseInfoData = {
		nameCn,
		nameEn,
		categoryId,
		labels: labels ? labels : [],
		authType,
		collectWay,
		suggestPrice,
		costPrice,
		skuType,
		offerStatus,
		expectPrice,
		skus
	}
	//规格信息
	const spevData = {
		spes: spes || [],
		channelId,
		offerSku: offerSku || [],
		custAttr: custAttr || [],
		goodsInfo: {
			nameCn,
			nameEn,
			goodsImage:
				goodsImages && goodsImages.length ? goodsImages[0].url : ''
		},
		skus,
		skuHistory,
		offerStatus
	}
	//未报价SKU列表
	const unSkuData = notOfferSku
	// 图文信息
	const picTxtData = {
		goodsImages,
		attrImages,
		realImages,
		ptInfo: {
			descriptionCn,
			descriptionEn,
			brief
		},
		videoInfo: {
			videoUrl,
			videoCover,
			videoCoverCompress
		}
	}
	//定制规格信息
	// custAttr.forEach(v => {
	//     if (v.required) {
	//         v.required = true
	//     } else {
	//         v.required = false
	//     }
	// })
	return {
		linkData,
		baseInfoData,
		spevData,
		unSkuData,
		picTxtData,
		custAttr: custAttr || []
	}
}

function linkDataBack(data) {
	let stateData = {}
	const { mode, collectionUrl, referenceUrls, copyStatus } = data
	stateData.mode = mode || null
	stateData.copyStatus = copyStatus || null
	stateData.collectionUrl = collectionUrl
	let list = []
	referenceUrls.forEach(v => list.push(v.val))
	stateData.referenceUrls = list
	return stateData
}

function showRelation(frontId, list) {
	let relation = []
	list.map(item => {
		let obj = new Object()
		let lengthNum = 0
		if (item.normsType == 0) {
			obj = {
				fa: {
					name: item.nameCn || item.nameEn,
					frontId: item.frontId,
					active: false,
				},
				child: []
			}
			item.speValues.map(a => {
				let x = {
					name: a.nameCn || a.nameEn,
					frontId: a.frontId,
					selectedChildId: frontId, // 点击子规格的id（后补参数）
					active: a.childIds.indexOf(frontId) !== - 1,
					// childIds:[] // 准备的空数组
				}
				if (a.childIds.indexOf(frontId) !== - 1)
					lengthNum++
				obj.child.push(x)
			})
			if (lengthNum && lengthNum < item.speValues.length)
				obj.indeterminate = true
			if (item.speValues && item.speValues.length) {
				obj.active = obj.child.filter(v => v.active).length == obj.child.length
			}
			relation.push(obj)
		}

	})
	return relation
}


function createId() {
	let timestamp = new Date().getTime()
	let num = parseInt(Math.random() * 10000)
	return timestamp + num
} // 生成随机id
function addAttr() {
	let obj = {
		checked: false,
		commonSpeValId: null,
		createBy: null,
		createTime: null,
		frontId: createId(),
		goodsId: null,
		id: null,
		img: null,
		isAdd: 1,
		nameEn: null,
		nameCn: null,
		photoId: null,
		pictureId: null,
		skuCode: null,
		skuId: null,
		sort: null,
		speId: null,
		url: null
	}
	return obj
}
function createSku(x) {
	let list = []
	x.map(item => {
		list.push(item.speValues)
	})
	function calcDescartes(array) {
		if (array.length < 2) {
			return array[0]?.map(item => {
				return [item]
			}) || []
		}
		return array?.reduce((total, currentValue) => {
			let res = [];
			total?.forEach(t => {
				currentValue.forEach(cv => {
					if (t instanceof Array) // 或者使用 Array.isArray(t)
						res.push([...t, cv]);
					else
						res.push([t, cv]);
				})
			})
			return res;
		})
	}
	return calcDescartes(list)
} // 通过笛卡尔积生成sku
function supplementData(arr, key1, key2, child) {
	function sup(arr) {
		arr?.forEach(item => {
			if (item[key1] && !item[key2]) item[key2] = item[key1]
			if (item[key2] && !item[key1]) item[key1] = item[key2]
			if (item[child]?.length > 0) {
				item[child] = sup(item[child])
			}
		})
		return arr
	}
	return sup(arr)
} // 补充规格数据 中英文
// 修改规格后转换数据格式
function resData(list) {
	return { sku: createSku(deepCopy(list)), spes: supplementData(deepCopy(list), 'nameCn', 'nameEn', 'speValues') }
}
function comparisonSkus(newSkus, oldSkus) {
	let arr = [];
	newSkus?.forEach((a) => {
		let x = oldSkus?.find((v) => v.frontId == a.frontId);
		if (x && oldSkus?.length > 0) {
			// 原有值
			x.speValues = a.speValues
			arr.push(x);
		} else {
			// 新值
			arr.push(a);
		}
	});
	return arr;
} // 生成sku时比较新旧sku 保留未修改的旧数据

function cusAttrSort(data, allData) {
	let arr = []
	data.speValues.forEach(v => {
		if (v.childIds.length) {
			// 主规格
			let obj = v
			obj.children = []
			v.childIds.forEach(item => {
				obj.children = [...obj.children, ...allData.filter(ele => ele.frontId == item)]
			})
			arr.push(obj)
		}
	})
	return arr
}

function createSkus(arr) {
	let newA = [];
	arr.map((item) => {
		let obj = {
			frontId: createSKUId(item),
			sku: null, //商品sku编码
			url: null, //图片链接
			originalPrice: null,//原价（USD）
			expectPrice: null, // 期望售价
			costPrice: null, //成本价
			skuSwitch: 1, //是否可用
			puhSwitch: 1, //采购报价开关
			lgtSwitch: 1, // 物流报价开关
			codeVal: null, //错码尺码
			weight: null, //重量
			lwh: null, //长宽高 *隔开
			length: null, //长
			width: null, // 宽
			height: null, // 高
			speValues: item,
		};
		newA.push(obj);
	});
	return newA;
	function createSKUId(x) {
		let id = 0;
		x.map((item) => {
			id += item.frontId;
		});
		return id;
	}
} // 生成多规格sku

function statusTips(status) {
	// 操作状态： 0: 正常  1: 更改品类 2：申请新规格 3：开启并申请报价
	ElMessage.warning({
		message: `商品${statusTipsData[status - 1]}报价中，不可执行此操作!`
	})
}
export {
	cartesianProductOf,
	listFn,
	checkedButton,
	saveData,
	getData,
	linkDataBack,
	showRelation,
	otherSaveData,
	addAttr,
	resData,
	comparisonSkus,
	createSku,
	createSkus,
	cusAttrSort,
	statusTips
}
