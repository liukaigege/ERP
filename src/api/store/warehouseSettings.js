// 仓库设置
import request from '@/api/request.js'

//auth:张志芳(仓库分区）)
export function getStoreArea(data) {
	return request({
		url: 'orders/v1/wareHouseArea/list',
		method: 'post',
		data
	})
}

/*************************货架管理 */

//Z201.模糊查询货架或者货架位 auth:张志芳
export function getWareHouseShelf(data) {
	return request({
		url: 'orders/v1/wareHouseShelf/query',
		method: 'post',
		data
	})
}
//Z202.新增货架 auth:张志芳
export function getAddShelf(data) {
	return request({
		url: 'orders/v1/wareHouseShelf/add',
		method: 'post',
		data
	})
}
//Z204.编辑货架 auth:张志芳
export function editAddShelf(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelf/edit',
		method: 'post',
		data
	})
}
//Z207.批量删除货架位/单个删除货架位 auth:张志芳
export function deleteShelfSpace(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/delete',
		method: 'post',
		data
	})
}
//Z206.批量删除/单个删除货架 auth:张志芳
export function deleteShelf(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelf/delete',
		method: 'post',
		data
	})
}
//Z209.开启/停止操作 auth:张志芳
export function getAStatus(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/operation',
		method: 'post',
		data
	})
}
//Z205.编辑货架位 auth:张志芳
export function editShelfSpace(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/edit',
		method: 'post',
		data
	})
}
//Z203.新增/批量新增货架位 auth:张志芳
export function addShelfSpace(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/add',
		method: 'post',
		data
	})
}
//Z211.货架位编辑回显 auth:张志芳
export function editShelfSpaceEcho(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/selectByGridId',
		method: 'post',
		data
	})
}
//批量绑定品类】功能auth:张志芳
export function batchUpdateCategory(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/batchUpdateCategory',
		method: 'post',
		data
	})
}
//新增【批量修改分配上限】功能auth:张志芳
export function batchUpdateSkuCount(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelfGrid/batchUpdateSkuCount',
		method: 'post',
		data
	})
}
//Z210.根据仓库和分区id查询货架
export function queryShelf(data) {
	return request({
		url: 'orders/v1/wareHouseAreaShelf/queryShelf',
		method: 'post',
		data
	})
}
