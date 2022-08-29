import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import moment from 'moment'
import {
	updateExamine, //审核包裹
	layFlag, //移入搁置
	getWayBillNum, //申请运单号
	returnHandle, //打回待处理
	addPrint,
	moveToPrint, // 移入待打单
	deliveredApplyNum, // 已交运重新获取
	printed,//打单
	outLay,//还原包裹,
	goPending,
	returnWaitPrint
} from '@/api/order/orderManagement.js'
export function orderDetailHooks(orderDetail = {}) {
	const router = useRouter()
	const {
		packageId, //包裹号
		trackNumber, //运单号
		trackType, //
		logistics, //物流方式
	} = orderDetail
	function confirm(text, callback) {
		ElMessageBox.confirm(text, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(res => {
			callback()
		})
	} //封装的提示弹窗
	function examine(cb) {
		confirm(
			'审核通过后，订单将变更为待处理，且不可打回重新匹配，确认审核通过？',
			() => {
				const param = {
					packageIds: packageId
				}
				updateExamine(param).then(res => {
					if (res.code == 200) {
						ElMessage.success(res.message)
						cb()
					}else{
						ElMessage.warning(res.message)
					}
				})
			}
		)
	} // 审核包裹

	function shelveIn(reason, cb) {
		const reqLayDto = {
			packageIds: packageId,
			reason
		}
		layFlag(reqLayDto).then(res => {
			if (res.code == 200) {
				ElMessage.success(res.message)
				cb()
			}else{
				ElMessage.warning(res.message)
			}
		})
	} // 移入搁置

	function isTrackNum() {
		let title = '系统将自动为你申请运单号，确认申请？'
		if (trackNumber) {
			title = '系统将重新为你申请运单号，确认申请？'
			if (trackType === 1) {
				title = '该包裹已设置运单号，将自动匹配库存，确认匹配库存？'
			}
		}
		return title
	} // 检测是否有运单号

	function applyNum(cb) {
		if (!logistics) {
			ElMessage.error('请选择物流方式后再申请!')
			return
		}

		confirm(isTrackNum(), () => {
			const param = {
				packageIds: packageId
			}
			getWayBillNum(param).then(async res => {
				if (res.code == 200) {
					const { code, errorMag } = res.data
					if (code == 0 || code == 2) {
						let orderMessage = ``
						errorMag.map((v, index) => {
							let x = index + 1 == errorMag.length ? '' : ','
							orderMessage += `${v.errorMessage}:${v.packageId}${x}`
						})
						let duration = 3000
						errorMag.length > 8 ? (duration = 5000) : ''
						ElMessage.warning({
							message: orderMessage,
							type: 'warning',
							duration
						})
					} else {
						ElMessage.success(res.message)
					}
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} // 申请运单号

	function applyOrderNum(cb) {
		if (!logistics) {
			ElMessage.error('请选择物流方式后再申请!')
			return
		}
		confirm(isTrackNum(), () => {
			const param = {
				packageIds: packageId
			}
			deliveredApplyNum(param).then(async res => {
				if (res.code == 200) {
					const { code, errorMag } = res.data
					if (code == 0 || code == 2) {
						let orderMessage = `无效包裹号:`
						errorMag.map((v, index) => {
							let x = index + 1 == errorMag.length ? '' : ','
							orderMessage += `${v.packageId}${x}`
						})
						ElMessage.warning(orderMessage)
					} else {
						ElMessage.success(res.message)
						cb()
					}
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} // 已交运申请运单号

	function pending(cb) {
		confirm('打回后，订单将变更为待处理状态，确认打回？', () => {
			returnHandle({ packageIds: packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success('打回成功，订单已移入待处理')
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} // 打回待处理

	function addPrinted(cb) {
		confirm('确认移入待打单？', () => {
			addPrint({ packages: packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} //移入待打单

	function moveToPrinted(cb) {
		confirm('订单将变更为待打单状态，确认变更？', () => {
			moveToPrint({ packageIds: packageId }).then(res => {
				if (res.code == 200) {
					const { code, errorMag } = res.data
					if (code == 0 || code == 2) {
						let orderMessage = ``
						errorMag.map((v, index) => {
							let x = index + 1 == errorMag.length ? '' : ','
							orderMessage += `${v.errorMessage}:${v.packageId}${x}`
						})
						let duration = 3000
						errorMag.length > 8 ? (duration = 5000) : ''
						ElMessage.warning({
							message: orderMessage,
							type: 'warning',
							duration
						})
					} else {
						ElMessage.success(res.message)
					}
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} // 已交运移入待打单

	// 打回待打单
	function returnWaitPrintFn(cb){
		returnWaitPrint({ packageIds: packageId }).then(res => {
			if (res.code == 200) {
				ElMessage.success(res.message)
				cb()
			}else {
				ElMessage.warning(res.message)
			}
		})
	}


	function print(type=1,cb){
		/**
		 * type: 1 打单 2 补打单
		 * */
			confirm(type === 1 ?'确定打单吗?' :'确定补打单吗?',_=>{
				const param = {
					packageIds: packageId,
					source: 0
				}
				printed(param)
					.then(res => {
						if (res.code == 200) {
						// ElMessage.success(res.message)
						window.open(res.data.pdfUrl, '_blank')
						cb(res.data,type)
					}else{
						ElMessage.warning(res.message)
					}
				})
		})
	} // 打单

	function goPend(cb){
		confirm('打回后，订单将变更为待处理状态，确认打回？', () => {
			goPending({ packageIds:packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success('打回成功，订单已移入待处理')
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	}// 已交运打回待处理


	function reduction(cb){
		confirm('订单将移出已搁置，确认移出？', () => {
			outLay({ packageIds: packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					cb()
				}else{
					ElMessage.warning(res.message)
				}
			})
		})
	} // 还原包裹





	return {
		examine, // 审核包裹
		shelveIn, //移入搁置
		applyNum, // 申请运单号
		pending, //打回待处理
		addPrinted, //移入待打单
		moveToPrinted, //已交运移入待打单
		applyOrderNum, //已交运重新获取运单号
		print,//打单/ 补打单
		goPend,//打回待处理
		reduction,//还原包裹
		returnWaitPrintFn,//打回待打单
	}
}
