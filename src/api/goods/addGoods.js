import requests from '@/api/requestBk.js'
import request from '@/api/request.js'

export function add(data) {
	console.log(data,'==>request goods/v1/newProducts/add')
    return request({
        url: 'goods/v1/newProducts/add',
        method: 'post',
        data
    })
} // 新增商品

export function list(data) {
    return request({
        url: 'goods/v1/newProducts/list',
        method: 'post',
        data
    })
} // 新增商品

export function info(data) {
    return request({
        url: 'goods/v1/goods/info',
        method: 'post',
        data
    })
} // 商品信息

export function update(data) {
    return request({
        url: 'goods/v1/goods/update',
        method: 'post',
        data
    })
} // 编辑商品

export function activate(data) {
    return request({
        url: 'goods/v1/newProducts/activate',
        method: 'post',
        data
    })
} // 单条激活

export function activates(data) {
    return request({
        url: 'goods/v1/newProducts/activates',
        method: 'post',
        data
    })
} // 批量激活


export function copy(data) {
	return request({
		url: 'goods/v1/goods/copy',
		method: 'post',
		data
	})
} // 批量激活

export function setCategory(data){
    return request({
        url: 'goods/v1/newProducts/setCategory',
        method: 'post',
        data
    })
} // 设置品类

export function plCollection(data){
    return request({
        url: 'goods/v1/newProducts/plCollection',
        method: 'post',
        data
    })
} // 平台/独立站列表采集

export function psCollection(data){
    return request({
        url: 'goods/v1/newProducts/psCollection',
        method: 'post',
        data
    })
} // 平台/独立站单条采集




export function remove(data) {
    return request({
        url: 'goods/v1/newProducts/remove',
        method: 'post',
        data
    })
} // 单个/批量删除


export function upload(data) {
    return request({
        url: 'goods/v1/uploads',
        method: 'post',
        data
    })
}
// 新增商品-表格上传


export function importGoods(data) {
  return request({
      url: 'goods/v1/import',
      method: 'post',
      data
  })
}
// 新增商品-表格导入


//商品详情
export function goodsDetail(data) {
    return request({
        url: 'goods/v1/goods/detail',
        method: 'post',
        data
    })
}

// 常用规格列表
export function speList(data) {
    return request({
        url: 'goods/v1/spe/query',
        method: 'post',
        data
    })
}


// 激活侵权申请审核
export function activateCheck(data) {
    return request({
        url: 'goods/v1/newProducts/activateCheck',
        method: 'post',
        data
    })
}

// 激活申请权限
export function setPermission(data) {
    return request({
        url: 'goods/v1/newProducts/setPermission',
        method: 'post',
        data
    })
}


// T02:商品刊登详情(入参回参同---U102.商品信息---接口一致)
export function publishInfo(data) {
    return request({
        url: 'goods/v1/publish/info',
        method: 'post',
        data
    })
}

// T03:编辑刊登商品(入参同---U101.编辑商品---接口一致)
export function publishUpdate(data) {
    return request({
        url: 'goods/v1/publish/update',
        method: 'post',
        data
    })
}

// 激活申请报价
export function applyOffer(data) {
    return request({
        url: 'goods/v1/newProducts/applyOffer',
        method: 'post',
        data
    })
}

// 激活批量申请权限（下一步操作）

export function setPermissionAll(data) {
    return request({
        url: 'goods/v1/newProducts/setPermissionAll',
        method: 'post',
        data
    })
}


export function uploadResource(data) {
    return request({
        url: 'basic/uploadResource',
        method: 'post',
        data
    })
} // 添加在线图片

export function goActivate(data) {
    return request({
        url: 'goods/v1/newProducts/goActivate',
        method: 'post',
        data
    })
} // 存在相似继续激活
