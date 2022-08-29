// 规则
import request from '@/api/request.js'

export function ruleComment() { // 查询通用SKU
    return request({
        url: 'goods/v1/sku/rule/comment',
        method: 'post'
    })

}
export function ruleCommentDetail() { // 通用SKU回显
    return request({
        url: 'goods/v1/sku/rule/comment/edit/detail',
        method: 'post'
    })
}

export function ruleCommentEdit(data) { // 通用SKU回显提交
    return request({
        url: 'goods/v1/sku/rule/comment/edit',
        method: 'post',
        data
    })
}

export function rulecClassify() { // 下拉品类查询
    return request({
        url: "goods/v1/sku/rule/classify/list",
        method: 'post',
    })
}

export function categoryAuthTree(){
    return request({
        url: "goods/v1/category/auth/tree",
        method: 'post',
    })
}

export function ruleList(data) { // 规则列表
    return request({
        url: 'goods/v1/sku/rule/list',
        method: 'post',
        data
    })
}

export function ruleDel(data) { // 删除规则
    return request({
        url: 'goods/v1/sku/rule/del',
        method: 'post',
        data
    })
}

export function ruleAdd(data) { // 新增规则
    return request({
        url: 'goods/v1/sku/rule/new',
        method: 'post',
        data
    })
}

export function ruleDetail(data) { //查询sku数据
    return request({
        url: 'goods/v1/sku/rule/edit/detail',
        method: 'post',
        data
    })
}

export function ruleEdit(data) { // 修改sku
    return request({
        url: 'goods/v1/sku/rule/edit',
        method: 'post',
        data
    })
}


//***************货源渠道

//auth:张志芳(查询货源渠道列表)
export function getSourceChanne(data) {
    return request({
        url: 'goods/v1/channel/page',
        method: 'post',
        data
    })
}

//auth:张志芳(删除货源渠道信息)
export function deleteSourceChanne(data) {
    return request({
        url: 'goods/v1/channel/delete',
        method: 'post',
        data
    })
}

//auth:张志芳(新增/修改货源渠道信息)
export function updateSourceChanne(data) {
    return request({
        url: 'goods/v1/channel/addOrUpdate',
        method: 'post',
        data
    })
}

//*****************标签

//auth:张志芳(查询标签列表)
export function getLabel(data) {
    return request({
        url: 'goods/v1/label/page',
        method: 'post',
        data
    })
}
//auth:张志芳(修改标签状态)
export function updateStatus(data) {
    return request({
        url: 'goods/v1/label/modify/status',
        method: 'post',
        data
    })
}
//auth:张志芳(删除标签)
export function deleteLabel(data) {
    return request({
        url: 'goods/v1/label/delete',
        method: 'post',
        data
    })
}
//auth:张志芳(添加/修改标签)
export function updateLabel(data) {
    return request({
        url: 'goods/v1/label/addOrUpdate',
        method: 'post',
        data
    })
}

//*****************侵权设置
//auth:张志芳(查询侵权列表)
export function getTort(data) {
    return request({
        url: 'goods/v1/tort/page',
        method: 'post',
        data
    })
}
//auth:张志芳(查询创建用户列表)
export function getTortUser(data) {
    return request({
        url: 'goods/v1/tort/list/user',
        method: 'post',
        data
    })
}
//auth:张志芳(修改侵权信息状态)
export function getTortStatus(data) {
    return request({
        url: 'goods/v1/tort/modify/status',
        method: 'post',
        data
    })
}
//auth:张志芳(删除侵权信息)
export function deleteTort(data) {
    return request({
        url: 'goods/v1/tort/delete',
        method: 'post',
        data
    })
}
//auth:张志芳(查询侵权信息详情)
export function seleteTortDetails(data) {
    return request({
        url: 'goods/v1/tort/detail',
        method: 'post',
        data
    })
}

//*****************品类管理
//auth:张志芳(查询品类列表)
export function getCategoryList(data) {
    return request({
        url: 'goods/v1/category/query',
        method: 'post',
        data
    })
}

//auth:张志芳(删除品类)
export function deleteCategory(data) {
    return request({
        url: 'goods/v1/category/delete',
        method: 'post',
        data
    })
}
//auth:张志芳(修改品类状态)
export function updateCategoryStatus(data) {
    return request({
        url: 'goods/v1/category/modify/status',
        method: 'post',
        data
    })
}

// 新增/修改常用规格
export function speAddOrUpdate(data) {
    return request({
        url: 'goods/v1/spe/addOrUpdate',
        method: 'post',
        data
    })
}

// 常用规格列表查询
export function speList(data) {
    return request({
        url: 'goods/v1/spe/page',
        method:'post',
        data
    })
}

export function speDetail(data){
    return request({
        url:'goods/v1/spe/detail',
        method:'post',
        data
    })
}

export function speDelete(data){
    return request({
        url:'goods/v1/spe/delete',
        method:'post',
        data
    })
}
//auth:张志芳(新增/修改品类)
export function updateCategoryList(data) {
    return request({
        url: 'goods/v1/category/addOrUpdate',
        method: 'post',
        data
    })
}
//auth:张志芳(品类排序)
export function categorySort(data) {
    return request({
        url: 'goods/v1/category/sort',
        method: 'post',
        data
    })
}
//auth:张志芳(查询所有品类信息)
export function selectCategory(data) {
    return request({
        url: 'goods/v1/category/all',
        method: 'post',
        data
    })
}
//auth:张志芳(查询带权限品类下拉列表)
export function limitCategory(data) {
    return request({
        url: 'goods/v1/category/auth/tree',
        method: 'post',
        data
    })
}
//auth:张志芳(品类设置（采购报价设置/物流报价设置/权限设置)
export function categoryConfig(data) {
    return request({
        url: 'goods/v1/category/config',
        method: 'post',
        data
    })
}
//auth:张志芳(新增侵权信息)
export function addTort(data) {
    return request({
        url: 'goods/v1/tort/addOrUpdate',
        method: 'post',
        data
    })
}
//auth:张志芳(报价设置（采购报价&物流报价）)
export function getPurchase(data) {
    return request({
        url: 'goods/v1/category/config/bid',
        method: 'post',
        data
    })
}
//采购订单/缺货采购 列表,跳转商品详情页校验
export function goodsCheck(data) {
	return request({
		url: 'goods/v1/goods/quotation/goods/check',
		method: 'post',
		data
	})
}
