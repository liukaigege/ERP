import request from '../request.js'

// 开通店铺

export function shopOpenShop(data) { //开通店铺
    return request({
        url: 'goods/v1/shop/openShop',
        method: 'post',
        data
    })
}

export function shopUserList(data) {
    return request({
        url: 'goods/v1/shop/userList',
        method: "post",
        data:data??{keyword:'back'}
    })
}

//消息列表 auth:张志芳
export function getMessageList(data) {
    return request({
        url: 'goods/v1/msg/list',
        method: "post",
        data
    })
}
//消息批量标记已读 auth:张志芳
export function readyAll(data) {
    return request({
        url: 'goods/v1/msg/read/batch',
        method: "post",
        data
    })
}
//消息批量删除 auth:张志芳
export function delALL(data) {
    return request({
        url: 'goods/v1/msg/del/batch',
        method: "post",
        data
    })
}
// 未读消息数字
export function msgNum() {
    return request({
        url: 'goods/v1/msg/unRead/num',
        method: "post",
    })
}

//授权***************

//店铺授权店铺列表 auth:张志芳
export function shopList(data) {
    return request({
        url: 'goods/v1/shop/shopSelect',
        method: "post",
        data
    })
}
//授权 auth:张志芳
export function empower(data) {
    return request({
        url: 'goods/v1/shop/empower',
        method: "post",
        data
    })
}


export function shopManagmentList(data) {
    return request({
        url: 'goods/v1/shop/list',
        method: 'post',
        data
    })
}

export function shopDetail(data) {
    return request({
        url: 'goods/v1/shop/shopMsg',
        method: 'post',
        data
    })
}

export function shopStatus(data) {
    return request({
        url: 'goods/v1/shop/changeShopStatus',
        method: 'post',
        data
    })
}

export function shopsMsg(data) { // 店铺基本信息明细
    return request({
        url: 'goods/v1/shop/shopSMsg',
        method: 'post',
        data
    })
}

export function shopDomainMsg(data) { // 域名开支明细
    return request({
        url: 'goods/v1/shop/shopDomainMsg',
        method: 'post',
        data
    })
}

export function shopPlatterMsg(data) { //平台明细
    return request({
        url: 'goods/v1/shop/shopPlatterMsg',
        method: 'post',
        data
    })
}

export function shopPaymentMsg(data) { // 支付方式明细
    return request({
        url: 'goods/v1/shop/shopPaymentMsg',
        method: 'post',
        data
    })
}

export function shopPluginMsg(data) { // 插件明细
    return request({
        url: 'goods/v1/shop/shopPluginMsg',
        method: 'post',
        data
    })
}

export function changeShopUser(data) { // 编辑店铺使用者
    return request({
        url: 'goods/v1/shop/changeShopUser',
        method: 'post',
        data
    })
}

export function changeShopDomain(data) { // 编辑店铺域名
    return request({
        url: 'goods/v1/shop/changeShopDomain',
        method: 'post',
        data
    })
}

export function changeShopPlatter(data) { // 编辑店铺平台
    return request({
        url: 'goods/v1/shop/changeShopPlatter',
        method: 'post',
        data
    })
}

export function changeShopPlugin(data) { // 编辑店铺插件
    return request({
        url: 'goods/v1/shop/changeShopPlugin',
        method: 'post',
        data
    })
}

export function editShopMsg(data) { // 编辑店铺信息
    return request({
        url: 'goods/v1/shop/editShopMsg',
        method: 'post',
        data
    })
}

export function renew(data) {//续费
    return request({
        url: 'goods/v1/shop/renew',
        method: 'post',
        data
    })
}

export function queryFields(data) { //获取导出字段
    return request({
        url: 'goods/v1/shop/queryFields',
        method: 'post',
        data
    })
}

export function exportShop(data) {
    return request({
        url: 'goods/v1/shop/export',
        method: 'post', 
        data
    })
}

export function removeShop(data){
    return request({
        url: 'goods/v1/shop/remove',
        method: 'post', 
        data
    })
}

export function platterLogDel(data){ // 平台明细删除
    return request({
        url: 'goods/v1/shop/platterLogDel',
        method: 'post', 
        data
    })
}

export function pluginLogDel(data){ // 插件明细删除
    return request({
        url: 'goods/v1/shop/pluginLogDel',
        method: 'post', 
        data
    })
}
export function pluginDel(data){ // 插件删除
    return request({
        url: 'goods/v1/shop/pluginDel',
        method: 'post', 
        data
    })
}
export function ownerLogDel(data){ // 使用人明细删除
    return request({
        url: 'goods/v1/shop/ownerLogDel',
        method: 'post', 
        data
    })
}
export function domainLogDel(data){ // 域名明细删除
    return request({
        url: 'goods/v1/shop/domainLogDel',
        method: 'post', 
        data
    })
}

export function changeShopCreditCard(data){// 更改信用卡
    return request({
        url: 'goods/v1/shop/changeShopCreditCard',
        method: 'post', 
        data
    })
}


export function changeShopPaypal(data){// 更改paypal
    return request({
        url: 'goods/v1/shop/changeShopPaypal',
        method: 'post', 
        data
    })
}



export function changeShopLocation(data){// 更改在地支付
    return request({
        url: 'goods/v1/shop/changeShopLocation',
        method: 'post', 
        data
    })
}

export function paymentSelect(){// 支付方式下拉
    return request({
        url: 'goods/v1/shop/paymentSelect',
        method: 'post', 
    })
}

export function checkDomain(data){// 域名查重
    return request({
        url: 'goods/v1/shop/checkDomain',
        method: 'post', 
        data
    })
}

export function changeCheck(data){ // 变更前校验
    return request({
        url: 'goods/v1/shop/changeCheck',
        method: 'post', 
        data
    })
}
export function change(data){ // 变更
    return request({
        url: 'goods/v1/shop/change',
        method: 'post', 
        data
    })
}

export function checkShopName(data){
    return request({
        url: 'goods/v1/shop/checkShopName',
        method: 'post', 
        data
    })
}

export function domainIsRepeat(data){
    return request({
        url: 'goods/v1/shop/domainIsRepeat',
        method: 'post', 
        data
    })
}


export function queryLeader(data){
    return request({
        url: 'goods/v1/shop/queryLeader',
        method: 'post', 
        data
    })
}