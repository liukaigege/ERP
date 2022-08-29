import request from '@/api/request.js'

export function labelList() {
    return request({
        url: 'goods/v1/label/page',
        method: 'post',
        data: {
            page:{
                pageNo:1,
                pageSize:100
            }
        }
    })
}

export function goodsDetail(data) {
    return request({
        url: 'goods/v1/goods/detail',
        method: 'post',
        data
    })
}


export function channelList(data) {
    return request({
        url: 'goods/v1/channel/page',
        method: 'post',
        data
    })
}

export function getSkuMatchList(data) {
    return request({
        url: 'orders/v1/ivt/sku/getSkuMatchList',
        method: 'post',
        data
    })
}

export function apply(data) {
    return request({
        url: 'goods/v1/goods/offer/apply',
        method: 'post',
        data
    })
}

export function goodsInfo(data) {
    return request({
        url: 'goods/v1/goods/info',
        method: 'post',
        data
    })
}

//编辑商品详情(已报价)
export function saveGoodsInfo(data) {
    return request({
        url: 'goods/v1/goods/detail/update',
        method: 'post',
        data
    })
}
// 编辑商品详情(已报价之外)
export function saveOtherGoodsInfo(data) {
    return request({
        url: 'goods/v1/goods/update',
        method: 'post',
        data
    })
}

export function statusUpdate(data) {
    return request({
        url: 'goods/v1/goods/sku/status/update',
        method: 'post',
        data
    })
}

// 查询常用规格列表
export function speList() {
    return request({
        url: 'goods/v1/spe/page',
        method: 'post',
        data:{
            status:1,
            page:{
                pageNo:1,
                pageSize:1000
            }
        }
    })
}

// U118. 申请新规格值
export function applyNewSku(data) {
    return request({
        url: 'goods/v1/goods/spe/val/add',
        method: 'post',
        data
    })
}

// U117.更新商品规格 修改品类
export function changeNewSku(data) {
    return request({
        url: 'goods/v1/goods/spe/update',
        method: 'post',
        data
    })
}

// U120. 修改品类
export function changeCategory(data) {
    return request({
        url: 'goods/v1/goods/category/update',
        method: 'post',
        data
    })
}

// U120. 修改品类校验
export function categoryValidate(data) {
    return request({
        url: 'goods/v1/goods/category/validate',
        method: 'post',
        data
    })
}

export function getInfo(data) {
    return request({
        url: 'goods/v1/goods/info',
        method: 'post',
        data
    })
}


// 查询常用规格列表
export function getSpe(data) {
    return request({
        url: 'goods/v1/spe/query',
        method: 'post',
        data
    })
}

// 查询常用规格详情
export function categorydetail(data) {
    return request({
        url: 'goods/v1/spe/detail',
        method: 'post',
        data
    })
}

// U225.更改类型
export function updateType(data) {
	return request({
			url: 'goods/v1/goods/custom/update',
			method: 'post',
			data
	})
}
