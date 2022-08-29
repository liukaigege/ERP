import { supplierPartnerTypes } from '@/assets/js/staticData.js'

export function fmtSupplierPartnerTypes(row) {
  let { partnerType, supplierName, thirdId } = row
  if (!partnerType) return ''
  let item = supplierPartnerTypes.find(item => item.value == partnerType)
  return '【' +item.label +'】'+ supplierName
}
export function fmtAddress(info) {
  if (!info) return ''
  let mobilePhone = info.mobilePhone || info.phone
  let address = [info.addressCodeText, info.townName, info.address].filter(item => item).join()
  return `(${info.fullName}) ${mobilePhone} ${address}`
}
