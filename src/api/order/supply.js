import request from '@/api/request.js'

export function getSupplyInfo (data) {
  return request({
    url: 'orders/v1/ivt/orderPackage/reissuePackageDetails',
    method: 'post',
    data
  })
}

export function saveSupplyInfo (data) {
  return request({
    url: 'orders/v1/ivt/orderPackage/saveReissuePackage',
    method: 'post',
    data
  })
}