/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-10-23 10:09:33
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 20:22:14
 */
// 全局遮罩层
import { ElLoading } from 'element-plus'

var loadingInstance, showId, hideId, isTable;
var whiteApiList = ['orders/v1/ivt/orderPackage/orderPackageLogistics','goods/v1/msg/unRead/num',
  'goods/v1/newProducts/psCollection', 'goods/v1/newProducts/plCollection','orders/export/rename',
  'goods/v1/goods/remark/contentBySku', 'users/v1/user/checkPhone', 'users/v1/user/checkWorkNum', 'users/v1/user/check',
  'orders/synch/log', '/basic/progress','basic/progress', 'orders/synch/standard', 'orders/v1/ivt/orderPackage/packageRemarks', 'goods/v1/msg/read/batch',
  'goods/v1/goods/remark/detail', 'orders/v1/ivt/purchase/getRemarks','orders/v1/wareHouseAreaShelfGrid/selectByGridId',
	'orders/v1/purchase/suggest/export','orders/v1/ivt/search/statusNum','orders/v1/ivt/orderPackage/getMergeFlagCnt','goods/v1/shop/domainIsRepeat',
	'/orders/progress','orders/v1/purchase/goods/remark/list','orders/v1/homePage/order/detail','orders/v1/homePage/purchase/detail','orders/v1/homepage/supplier/count','goods/v1/homepage/shopQuery','orders/v1/homePage/logistics/logisticsReconciliation/pageQuery',
  'orders/v1/homepage/finance/querypage','orders/v1/homePage/wareHouse/outStockCount','orders/v1/homePage/wareHouse/inStockCount','orders/v1/homePage/wareHouse/signCount',
  'orders/v1/homePage/wareHouse/arrivalCount','goods/v1/homePage/good/goodCount','goods/v1/homePage/good/goodLayedCount','orders/v1/homePage/wareHouse/stock','orders/v1/homePage/goodManage/outOfCount','orders/v1/ivt/orderPackage/getOrderPayData','orders/v1/ivt/purchase/getStayWarehousesRemarks','orders/v1/purchaseVerify/queryPurchaseVerifyRemarkList'
]

var requestNum = 0  //  记录一段时间内 发送请求的数量
export function openLoading(config) {
	let { data, url } = config
	if (whiteApiList.includes(url)) return
  requestNum++
  if (data?.page?.pageNo) isTable = true
  if (isTable) { // 如果是表格loading  就不打开loading
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
    return
  }
  if (hideId) { // 如果 有新的接口发送，就关闭hideId定时器，使loading 继续打开
    clearTimeout(hideId)
    hideId = null
  }
  if (loadingInstance) return //如果load已经打开 或者正在等待打开，则不进行操作
  loadingInstance = ElLoading.service({ fullscreen: true })
}
export function closeLoading(url,isError) {
	// 接口报错 就关闭
	if(isError) loadingInstance && loadingInstance.close()
  if (requestNum > 0 && !whiteApiList.includes(url)) requestNum--
  if (isTable) {
    isTable = false
    loadingInstance && loadingInstance.close()
    loadingInstance = null
    return
  }
  if (!hideId && requestNum === 0) { // 如果没有关闭，则关闭
    hideId = setTimeout(() => {
      hideId = null
      requestNum = 0
      loadingInstance && loadingInstance.close()
      loadingInstance = null
    }, 50)
  }
}
