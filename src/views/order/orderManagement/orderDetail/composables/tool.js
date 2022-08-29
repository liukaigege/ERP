import { ElMessage } from 'element-plus'
import { patternFn } from '@/utils/tool.js'
export function checkData(data) {
	let status = true
	if (!data.firstName) {
		status = false
		ElMessage.warning({ message: '请输入1-50位客户名' })
	} else {
		if (!data.lastName) {
			status = false
			ElMessage.warning({ message: '请输入1-50位客户姓' })
		} else {
			if (!patternFn(data.phone, 'phone')) {
				status = false
				ElMessage.warning({ message: '请输入电话' })
			} else {
				if (!patternFn(data.postcode, 'postCode')) {
					status = false
					ElMessage.warning({ message: '请输入邮编' })
				} else {
					if (!data.street1 && !data.street2) {
						status = false
						ElMessage.warning({ message: '请输入地址' })
					} else {
						for (var i = 0; i < data.packageGoodsDetailsVOs.length; i++) {
							if (!data.packageGoodsDetailsVOs[i].customsInfoCn) {
								status = false
								ElMessage.warning({ message: '请输入中文报关名' })
							} else {
								if (!data.packageGoodsDetailsVOs[i].customsInfoEn) {
									status = false
									ElMessage.warning({ message: '请输入英文报关名' })
								} else {
									if (!data.packageGoodsDetailsVOs[i].customsWeight) {
										status = false
										ElMessage.warning({ message: '请输入报关重量' })
									} else {
										if (!data.packageGoodsDetailsVOs[i].customsAmount) {
											status = false
											ElMessage.warning({ message: '请输入报关价格' })
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return status
}
