import request from '@/api/request.js'

const api = {
	// 已报价
	goodsList: 'goods/v1/goods/list', // S4.获取订单来源数据
	category: 'goods/v1/category/auth/tree', //查询带权限品类下拉列表
	customsInfo: 'goods/v1/goods/query/customs/batch', // Z04.批量查询报关信息
	editCustomsInfo: 'goods/v1/goods/edit/customs/batch', // Z03.批量修改报关信息
	goodsNum: 'goods/v1/goods/list/num', // Z13.已报价/未报价/待报价 列表数字
	categoryAll: 'goods/v1/category/all', // 查询所有品类信息
	getRemarkTypes: 'orders/v1/ivt/remark/getRemarkTypes', // S38.获取所有有效备注类型信息
	addPublish: 'goods/v1/goods/publish/add/batch', // Z10.加入刊登
	goodsMergeList: 'goods/v1/quotation/merge', // Z20.已报价数据列表(合并商品使用)
	batchAddRemark: 'goods/v1/goods/remark/add/batch', // Z16.批量添加备注
	batchAddLay: 'goods/v1/goods/lay/add/batch', // Z02.批量移入搁置
	channelPage: 'goods/v1/channel/page', // 查询货源渠道列表
	batchEditChannel: 'goods/v1/goods/channel/edit/batch', // Z05.批量修改货源渠道
	batchSyncInfo: 'goods/v1/goods/info/sync/batch', // Z08.强制同步商品信息
	batchUpdateSku: 'goods/v1/goods/sku/update/batch', // Z09.批量更新SKU
	setPermission: 'goods/v1/goods/permission/batch', // Z26.已报价列表-批量设置权限
	quotationMerge: 'goods/v1/quotation/merge', // G8.合并商品
	batchEditCategory: 'goods/v1/goods/category/edit/batch', // Z07.批量修改商品品类
	getMaintainman: 'goods/v1/maintainAble/users', // 获取维护人列表
	batchEditMaintain: 'goods/v1/goods/maintain/edit/batch', // Z06.批量修改维护人
	getSpuList: 'goods/v1/record/code/list', // Z12.SPU历史记录列表
	labelList: 'goods/v1/label/page', // 获取标签列表
	batchLabel: 'goods/v1/goods/label/edit/batch', // Z01.批量修改标签
	exportGoods: 'goods/v1/goods/quotation/export', // Z21.已报价列表-导出商品
	remarkDetail: 'goods/v1/goods/remark/detail', // Z27.根据备注类型ID获取备注详情列表
	// 未报价
	applyNoQuotation: 'goods/v1/noQuotation/apply', // G1.申请报价
	deleteGoods: 'goods/v1/noQuotation/delete', // G7.删除商品
	goodsInfo: 'goods/v1/goods/info', // U102.商品信息
	updateDetail: 'goods/v1/goods/detail/update', // U103.编辑商品详情
	goodsDetail: 'goods/v1/goods/detail', // U104.商品详情
	batchModifyGoodsCategory: 'goods/v1/goods/batchModifyGoodsCategory', // 批量修改商品品类
	// 搁置中
	outLay: 'goods/v1/lay/outLay' // G2.移出搁置
}
// S4.获取订单来源数据
export function goodsList(data) {
	return request({
		url: api.goodsList,
		method: 'post',
		data: data
	})
}
//查询带权限品类下拉列表
export function getCategory(data) {
	return request({
		url: api.category,
		method: 'post',
		data: data
	})
}
// Z04.批量查询报关信息
export function customsInfo(data) {
	return request({
		url: api.customsInfo,
		method: 'post',
		data: data
	})
}
// Z03.批量修改报关信息
export function editCustomsInfo(data) {
	return request({
		url: api.editCustomsInfo,
		method: 'post',
		data: data
	})
}
// Z13.已报价/未报价/待报价 列表数字
export function goodsNum(data) {
	return request({
		url: api.goodsNum,
		method: 'post',
		data: data
	})
}
// S38.获取所有有效备注类型信息
export function getRemarkTypes(data) {
	return request({
		url: api.getRemarkTypes,
		method: 'post',
		data: data
	})
}
// Z10.加入刊登
export function addPublish(data) {
	return request({
		url: api.addPublish,
		method: 'post',
		data: data
	})
}
// Z20.已报价数据列表(合并商品使用)
export function goodsMergeList(data) {
	return request({
		url: api.goodsMergeList,
		method: 'post',
		data: data
	})
}
// Z16.批量添加备注
export function batchAddRemark(data) {
	return request({
		url: api.batchAddRemark,
		method: 'post',
		data: data
	})
}

// Z02.批量移入搁置
export function batchAddLay(data) {
	return request({
		url: api.batchAddLay,
		method: 'post',
		data: data
	})
}

// Z05.批量修改货源渠道
export function batchEditChannel(data) {
	return request({
		url: api.batchEditChannel,
		method: 'post',
		data: data
	})
}

// Z08.强制同步商品信息
export function batchSyncInfo(data) {
	return request({
		url: api.batchSyncInfo,
		method: 'post',
		data: data
	})
}

// Z09.批量更新SKU
export function batchUpdateSku(data) {
	return request({
		url: api.batchUpdateSku,
		method: 'post',
		data: data
	})
}

// G1.申请报价
export function applyNoQuotation(data) {
	return request({
		url: api.applyNoQuotation,
		method: 'post',
		data: data
	})
}

// G7.删除商品
export function deleteGoods(data) {
	return request({
		url: api.deleteGoods,
		method: 'post',
		data: data
	})
}

// G2.移出搁置
export function outLay(data) {
	return request({
		url: api.outLay,
		method: 'post',
		data: data
	})
}

// U102.商品信息
export function goodsInfo(data) {
	return request({
		url: api.goodsInfo,
		method: 'post',
		data: data
	})
}

// 激活申请权限
export function setPermission(data) {
	return request({
		url: api.setPermission,
		method: 'post',
		data: data
	})
}

// G8.合并商品
export function quotationMerge(data) {
	return request({
		url: api.quotationMerge,
		method: 'post',
		data: data
	})
}

// Z07.批量修改商品品类
export function batchEditCategory(data) {
	return request({
		url: api.batchEditCategory,
		method: 'post',
		data: data
	})
}

// 获取维护人列表
export function getMaintainman(data) {
	return request({
		url: api.getMaintainman,
		method: 'post',
		data: data
	})
}

// Z06.批量修改维护人
export function batchEditMaintain(data) {
	return request({
		url: api.batchEditMaintain,
		method: 'post',
		data: data
	})
}

// Z12.SPU历史记录列表
export function getSpuList(data) {
	return request({
		url: api.getSpuList,
		method: 'post',
		data: data
	})
}

// U103.编辑商品详情
export function updateDetail(data) {
	return request({
		url: api.updateDetail,
		method: 'post',
		data: data
	})
}

// 获取标签列表
export function labelList(data) {
	return request({
		url: api.labelList,
		method: 'post',
		data: data
	})
}

// Z01.批量修改标签
export function batchLabel(data) {
	return request({
		url: api.batchLabel,
		method: 'post',
		data: data
	})
}

// Z21.已报价列表-导出商品
export function exportGoods(data) {
	return request({
		url: api.exportGoods,
		method: 'post',
		data: data
	})
}

// Z27.根据备注类型ID获取备注详情列表
export function remarkDetail(data) {
	return request({
		url: api.remarkDetail,
		method: 'post',
		data: data
	})
}

// 查询货源渠道列表
export function channelPage(data) {
	return request({
		url: api.channelPage,
		method: 'post',
		data: data
	})
}

// U104.商品详情
export function goodsDetail(data) {
	return request({
		url: api.goodsDetail,
		method: 'post',
		data: data
	})
}

export function exportFields() {
	// 导出商品字段
	return request({
		url: 'goods/v1/goods/quotation/export/sku/info/fields',
		method: 'post'
	})
}

export function exportSkuInfo(data) {
	// 导出商品
	return request({
		url: 'goods/v1/goods/quotation/export/sku/info',
		method: 'post',
		data
	})
}

export function quotationApply(data) {
	// 二次报价
	return request({
		url: '/goods/v1/noQuotation/apply',
		method: 'POST',
		data
	})
}

export function quotationApplyAuth(data) {
	// 二次报价申请权限
	return request({
		url: '/goods/v1/noQuotation/applyAuth',
		method: 'POST',
		data
	})
}

export function quotationApplyCheck(data) {
	// 二次报价继续报价
	return request({
		url: '/goods/v1/noQuotation/applyCheck',
		method: 'POST',
		data
	})
}

export function exportCustomsInfo(data) {
	// 导出报价信息
	return request({
		url: 'goods/v1/goods/customs/export',
		method: 'POST',
		data
	})
}

export function goodsCustomsUpload(data) {
	// 上传文件地址
	return request({
		url: 'goods/v1/goods/customs/upload',
		method: 'POST',
		data
	})
}

export function goodsCustomsSave(data) {
	// 保存文件
	return request({
		url: 'goods/v1/goods/customs/save',
		method: 'POST',
		data
	})
}
export function batchModifyGoodsCategory(data) {
	// 批量修改商品品类
	return request({
		url: api.batchModifyGoodsCategory,
		method: 'POST',
		data
	})
}
