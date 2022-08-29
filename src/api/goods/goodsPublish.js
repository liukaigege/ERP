import request from '@/api/request.js'

// T01: 商品刊登列表
export function list(data) {
  return request({
    url: '/goods/v1/publish/list',
    method: 'post',
    data
  })
}
// 查询带权限品类下拉列表
export function categoryId() {
  return request({
    url: '/goods/v1/category/auth/tree',
    method: 'post',
  })
}

// T02: 商品刊登详情
export function info(data) {
  return request({
    url: '/goods/v1/publish/info',
    method: 'post',
    data
  })
}
// T03: 商品刊登详情 
export function update(data) {
  return request({
    url: '/goods/v1/publish/update',
    method: 'post',
    data
  })
}

// T05:去除搁置商品红点标识  
export function cleanRedPoint(data) {
  return request({
    url: '/goods/v1/publish/cleanRedPoint',
    method: 'post',
    data
  })
}

// T06:单个/批量刊登
export function publishAll(data) {
  return request({
    url: '/goods/v1/publish/publishAll',
    method: 'post',
    data
  })
}

//T07:刊登商品同步
export function synchro(data) {
  return request({
    url: '/goods/v1/publish/synchro',
    method: 'post',
    data
  })
}

// T08:刊登商品删除
export function del(data) {
  return request({
    url: '/goods/v1/publish/del',
    method: 'post',
    data
  })
}

//T09:刊登商品上/下架
export function updateStatus(data) {
  return request({
    url: '/goods/v1/publish/updateStatus',
    method: 'post',
    data
  })
}
//T10:获取更新
export function renewAll(data) {
  return request({
    url: '/goods/v1/publish/renewAll',
    method: 'post',
    data
  })
}

// 选择店铺下拉列表
export function shopSelect(data) {
  return request({
    url: '/goods/v1/shop/shopSelect',
    method: 'post',
    data
  })
}

// 红点标识  
export function redPoint(data) {
  return request({
    url: '/goods/v1/publish/redPoint',
    method: 'post',
    data
  })
}

//刊登店铺下拉
export function publishShopSelect(data) {
  return request({
    url: '/goods/v1/shop/publishShopSelect',
    method: 'post',
    data
  })
}