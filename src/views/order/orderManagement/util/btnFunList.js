/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-30 15:21:50
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-15 15:18:49
 */

import { reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage ,ElMessageBox} from 'element-plus'
import store from '@/store/index.js'
import { storage } from '@/utils/storage.js'
import {
	returnHandle,
	updateDeductFlag,
	cancelDeductFlag,
	updateForbidFlag,
	cancelForbidFlag,
	outLay,
	layFlag,
	cancelPriorityFlag,
	updatePriorityFlag,
	printed,
	returnWaitPrint,
	getWayBillNum,
	deliveredApplyNum,
	cancelSplitPackages,
	updateExamine,
	isPrint,
	moveToPrint,
	goPending,
	goPrint,
	addPrint,
	dianxiaomi,
	deliveryBatch,
	cancelChange
} from '@/api/order/orderManagement.js'

export default function btnList(orderTable = null, formOptions=null) {
	/*
	 * orderTable : 必传 :表单的ref
	 * formOptions : 必传 : form 的ref
	 */

	const data = reactive({})
	const { proxy } = getCurrentInstance()

	function isInit(){
		formOptions?.value.init()
	}


	function confirm(text, callback) {
		ElMessageBox.confirm(text, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(res => {
			callback()
		})
	} //封装的提示弹窗

	const examine = packageIds => {
		confirm(
			'审核通过后，订单将变更为待处理，且不可打回重新匹配，确认审核通过？',
			() => {
				const param = { packageIds }
				updateExamine(param).then(res => {
					if (res.code == 200) {
						isInit()
						ElMessage.success(res.data)
					}
					if (res.code == 301) {
						ElMessage.warning(res.message)
						isInit()
					}
				})
			}
		)
	} // 审核

	const merage = data => {
		orderTable.value.showDialog('MergeOrder', '合并订单', '35%', data)
	} // 合并订单

	const noMearge = data => {
		orderTable.value.showDialog('NoMergeOrder', '取消合并', '35%', data)
	} // 取消合并订单

	const cancelSplit = data => {
		confirm('确认取消拆分？', () => {
			const { packageIds } = data
			let log = data.logistic
			// logistic = logistic.filter(v => v.trackType !== 1)
			const logistic = log.filter(v => v.trackType !== 1)
			// 过滤手工单物流
			let param = {
				packageIds: packageIds
			}
			if (logistic.length == 0) {
				param = {
					packageIds: packageIds,
					logisticsId: null,
					logistics: null,
					lgtcLine: null,
					trackNumber: null
				}
			} else if (logistic.length == 1) {
				param = {
					packageIds: packageIds,
					logisticsId: Number(logistic[0].logisticsId),
					logistics: logistic[0].logistics,
					lgtcLine: logistic[0].lgtcLine,
					trackNumber: null
				}
			} else if (logistic.length > 1) {
				orderTable.value.showDialog('CancelSplitOrder', '选择物流方式', '35%', {
					packageIds,
					logistic
				})
				return
			}

			cancelSplitPackages(param)
				.then(res => {
					if (res.code == 200) {
						ElMessage.success(res.message)
						isInit().then(res => {
							orderTable.value.meargeData = orderTable.value.getMerge(
								res,
								'prefixId'
							)
							// 取消拆分单元格之后重新整理列表样式
						})
					}
				})
				.catch(err => {
					isInit()
					orderTable.value.getMergeNum()
				})
		})
	}

	const splitOrders = data => {
		let x = data.packageRels[0].packageSkus
		x.forEach(item => {
			item.checked = false
			item.splitNum = 0
		})
		orderTable.value.showDialog('SplitOrder', '拆分订单', '35%', {
			skus: data.packageRels[0].packageSkus,
			packageId: data.packageId
		})
	} //拆分订单

	const changePay = packageIds => {
		orderTable.value.showDialog('ChangePayType', '变更支付状态', '35%', {
			packageIds
		})
	} //变更支付状态

	const changeMorePay = packageIds => {
		orderTable.value.showDialog('ChangeMorePay', '导入变更支付状态', '35%', {
			packageIds
		})
	}
	// 更换物流 - 重新获取
	const applyNum2 = packageIds => {
		let id = packageIds.split(',')
		let arr = orderTable.value.tableData
		let bole = arr.some(item=>{
			if (id == item.packageId || id.indexOf(item.packageId) !== -1){
				return	item.packageRels?.some(v=>{
					return v?.packageSkus?.some(x=>{
						return x?.packageGoods.length > 0
					})
				})

			}
		})
		if(!bole) return  ElMessage.error('请添加发货商品！')
		confirm('系统将自动为你申请运单号，确认申请？', () => {
			const param = {
				packageIds
			}
			deliveredApplyNum(param).then(async res => {
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
						// proxy.$notify.error({
						//     title: '请求错误',
						//     dangerouslyUseHTMLString: true,
						//     message: orderMessage
						// });
					} else {
						ElMessage.success(res.message)
					}
					isInit()
				}
			})
		})
	} //申请运单号

	const applyNum = packageIds => {
		let id = packageIds.split(',')
		let arr = orderTable.value.tableData
		let bole = arr.some(item=>{
			if (id == item.packageId || id.indexOf(item.packageId) !== -1){
				return	item.packageRels?.some(v=>{
					return v?.packageSkus?.some(x=>{
						return x?.packageGoods.length > 0
					})
				})

			}
		})
		if(!bole) return  ElMessage.error('请添加发货商品！')
		confirm('系统将自动为你申请运单号，确认申请？', () => {
			const param = {
				packageIds
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
						// proxy.$notify.error({
						//     title: '请求错误',
						//     dangerouslyUseHTMLString: true,
						//     message: orderMessage
						// });
					} else {
						ElMessage.success(res.message)
					}
					isInit()
				}
			})
		})
	} //申请运单号

	const addGoods = packageIds => {
		function getInfos(ids, data) {
			let arr = []
			let excludeSkuIds = []
			for (let i = 0; i < data.length; i++) {
				if (ids.indexOf(data[i].packageId) !== -1) {
					let item = data[i]
					let obj = {
						orderId: data[i].packageRels[0].orderId,
						packageId: data[i].packageId
					}
					arr.push(obj)

					item.packageRels.map(a => {
						a.packageSkus.map(z => {
							z.packageGoods.map(x => {
								excludeSkuIds.push(x.skuId)
							})
						})
					})
				}
			}
			return {
				arr,
				excludeSkuIds
			}
		}
		const { arr, excludeSkuIds } = getInfos(
			packageIds.split(','),
			orderTable.value.tableData
		)

		orderTable.value.showDialog('AddGoodsDiloag', '追加发货商品', '50%', {
			infos: arr,
			excludeSkuIds
		})
	} //追加发货商品

	const selLogistics = (packageIds, orderType, applyFlag = 0) => {
		let infos = getInfos(packageIds.split(','), orderTable.value.tableData)
		let  isAllMatching = orderTable.value.tableData.some(item=>{
			if (packageIds == item.packageId || packageIds.split(',').indexOf(item.packageId) !==-1){
				return	item.packageRels?.some(v=>{
					console.log(v.packageSkus)
					return v?.packageSkus?.some(x=>{
						console.log(x.packageGoods)
						return x.packageGoods.length == 0
					})
				})
			}
		})
		console.log(isAllMatching)
		orderTable.value.showDialog('changeLogistics', '选择物流方式', '30%', {
			type: 1,
			infos: infos,
			orderType,
			packageIds,
			applyFlag,
			isAllMatching:!isAllMatching
		})

		function getInfos(ids, data) {
			let arr = []
			for (let i = 0; i < data.length; i++) {
				if (ids.indexOf(data[i].packageId) !== -1) {
					let obj = {
						logisticsId: data[i].logisticsId,
						packageId: data[i].packageId
					}
					arr.push(obj)
				}
			}
			return arr
		}
	} //选择物流方式

	const remark = data => {
		const packageIds = data.split(',')
		orderTable.value.showDialog('Remarks', '订单备注', '35%', { packageIds })
	} //备注

	const print = packageIds => {
		return new Promise((resolve, reject) => {
			const param = { packageIds, source: 0 }
			printed(param)
				.then(res => {
					if (res.code == 200) {
						resolve(true)
						orderTable.value.showDialog(
							'PrintInfo',
							'面单打印信息确认',
							'35%',
							res.data
						)
						if (res.data.pdfUrl) window.open(res.data.pdfUrl)
					}
				})
				.catch(err => {
					reject(err)
				})
		})
	} //打单

	const reissuePrinted = packageIds =>{
		orderTable.value.showDialog('ReissuePrinted', '请选择补打原因', '30%', { packageIds })

	}

	const shelve = packageIds => {
		orderTable.value.showDialog('Shelve', '移入搁置', '35%', { packageIds })
	} //搁置

	const shelveIn = (packageIds, reason) => {
		const reqLayDto = {
			packageIds,
			reason
		}
		layFlag(reqLayDto).then(res => {
			if (res.code == 200) {
				ElMessage.success(res.message)
				isInit()
			}
			if (res.code == 301) {
				ElMessage.warning(res.message)
				isInit()
			}
		})
	} // 移入搁置

	const shelveOut = packageIds => {
		outLay({ packageIds }).then(res => {
			if (res.code == 200) {
				ElMessage.success(res.message)
				isInit()
			}
		})
	} // 移出搁置

	const forbidFlagTrue = packageIds => {
		ElMessageBox.confirm(
			'禁止处理，当前选中包裹将不可执行其他任何操作，确认禁止处理？',
			'提示',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(res => {
			updateForbidFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 禁止处理打开

	const forbidFlagFalse = packageIds => {
		ElMessageBox.confirm('当前选中订单确认正常处理？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(res => {
			cancelForbidFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 禁止处理关闭

	const priorityFlagTrue = packageIds => {
		confirm('当前选中包裹确认优先分配库存？', () => {
			updatePriorityFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 分配库存开

	const priorityFlagFalse = packageIds => {
		confirm('当前选中包裹确认正常分配库存？', () => {
			cancelPriorityFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 分配库存关

	const deductFlagTrue = packageIds => {
		confirm('当前选中包裹确认正常扣库存？', () => {
			updateDeductFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 库存状态开

	const deductFlagFalse = packageIds => {
		confirm('当前选中包裹确认不扣库存？', () => {
			cancelDeductFlag({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} // 库存状态关

	const pending = packageIds => {
		confirm('打回后，订单将变更为待处理状态，确认打回？', () => {
			returnHandle({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success('打回成功，订单已移入待处理')
					isInit()
				}
			})
		})
	} // 打回待处理

	const waitPrint = packageIds => {
		confirm('订单将变更为待打单状态，确认打回？', () => {
			returnWaitPrint({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.data)
					isInit()
				}
				if (res.code == 301) {
					ElMessage.warning(res.message)
					isInit()
				}
			})
		})
	} // 打回待打单

	const reduction = packageIds => {
		confirm('订单将移出已搁置，确认移出？', () => {
			outLay({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					isInit()
				}
			})
		})
	} //还原包裹

	const forDataList = val => {
		let packList = []
		let forbList = []
		const { orderType } = store.getters
		orderTable.value.tableData.forEach(item => {
			if (orderTable.value.selectRows.indexOf(item.packageId) !== -1) {
				if (item.forbidFlag == 0 && checkTrue(item)) {
					packList.push(item.packageId)
				} else {
					forbList.push(item.packageId)
				}
			}
		}) // 去除禁止处理的

		function checkTrue(item) {
			let bole = true
			if (orderType == 8 && item.lplApplyStatus == 2) {
				bole = false
			}
			return bole
		}

		return {
			packList: packList.join(','),
			forbList: forbList.join(',')
		}
	}

	const customsInfo = (packageIds, tableData) => {
		const { packList, forbList } = forDataList()
		if (orderTable.value.selectRows.length > 0 && !packList) {
			ElMessage.error('选中的包裹已经禁止处理!')
			return false
		}
		const arr = packList.split(',')
		let logisticsInfo = []
		tableData.forEach(item => {
			if (arr.indexOf(item.packageId) !== -1) {
				let obj = {
					lgtcLine: item.lgtcLine,
					logisticsId: item.logisticsId,
					logistics: item.logistics,
					packageIds: item.packageId
				}
				logisticsInfo.push(obj)
			}
		})

		if (forbList.length > 0) {
			let msg = `以下包裹${forbList}禁止处理`
			ElMessage.error(msg)
		}
		storage.set('BatchCustomsInfo', logisticsInfo)

		proxy.go('/order/orderManagement/batchCustomsInfo/index', {
			packageIds: packList,
			status: store.getters.orderType
		})
	} // 批量修改报关信息

	const addressee = packageIds => {
		const { packList, forbList } = forDataList()
		if (orderTable.value.selectRows.length > 0 && !packList) {
			ElMessage.error('选中的包裹已经禁止处理!')
			return false
		}

		if (forbList.length > 0) {
			let msg = `以下包裹${forbList}禁止处理`
			ElMessage.error(msg)
		}

		const arr = forDataList()
		proxy.go('/order/orderManagement/batchAddressee/index', {
			packageIds: packList,
			status: store.getters.orderType
		})
	} // 批量修改收件人信息

	// 已交运的按钮操作

	const goPrinted = packageIds => {
		confirm('订单将变更为待打单状态，确认打回？', () => {
			goPrint({ packageIds }).then(res => {
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
						// proxy.$notify.error({
						//     title: '请求错误',
						//     dangerouslyUseHTMLString: true,
						//     message: orderMessage
						// });
					} else {
						ElMessage.success(res.message)
					}
					formOptions.value.init(1)
				}
			})
		})
	} // 已交运打回待打单

	const goPend = packageIds => {
		confirm('订单将变更为待处理状态，确认打回？', () => {
			goPending({ packageIds }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	} // 已交运打回待处理

	const deliverdAll = packageIds =>{
		confirm('订单将批量发货,确认发货?',_=>{
			deliveryBatch({packageIds:packageIds.split(',')}).then(res=>{
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	}  // 已交运批量发货


	const isPrinte = packageId => {
		confirm('确认打单？', () => {
			isPrint({ packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	} // 已交运打单按钮

	const moveToPrinted = packageIds => {
		confirm('订单将变更为待打单状态，确认变更？', () => {
			moveToPrint({ packageIds }).then(res => {
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
						// proxy.$notify.error({
						//     title: '请求错误',
						//     dangerouslyUseHTMLString: true,
						//     message: orderMessage
						// });
					} else {
						ElMessage.success(res.message)
					}
					isInit()
				}
			})
		})
	} // 已交运移入待打单

	const needPrint = packageId => {
		confirm('确认打单？', () => {
			isPrint({ packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	}

	const noPrint = packageId => {
		confirm('确认不打单？', () => {
			isPrint({ packageId }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	}

	const addPrinted = packages => {
		confirm('确认移入待打单？', () => {
			addPrint({ packages }).then(res => {
				if (res.code == 200) {
					ElMessage.success(res.message)
					formOptions.value.init(1)
				}
			})
		})
	}

	const exportDian = () => {
		const { form } = formOptions.value
		dianxiaomi(form).then(res => {
			if (res.code == 200) {
				window.open(res.data)
			}
		})
	}

  let refund = (selectInfo) => {
    orderTable.value.showDialog('refund', '退款', '1400px', {
      selectInfo
		})
  }

	const cancelLogistics = (packageIds,tableData)=>{
		confirm('确认取消更换物流？', () => {
			cancelChange({packageIds:packageIds.split(',')}).then(res=>{
				ElMessage.success('取消更换物流成功')
				isInit()
			})
		})
	}

	const cancelLog  = (packageIds)=>{
		cancelChange({packageIds:packageIds.split(',')}).then(res=>{
			ElMessage.success('取消更换物流成功')
			isInit()
		})
	}
	return {
		applyNum,
		applyNum2,
		print,
		remark,
		shelve,
		shelveIn,
		shelveOut,
		selLogistics,
		forbidFlagTrue,
		forbidFlagFalse,
		priorityFlagTrue,
		priorityFlagFalse,
		deductFlagTrue,
		deductFlagFalse,
		customsInfo,
		addressee,
		pending,
		waitPrint,
		merage,
		noMearge,
		splitOrders,
		cancelSplit,
		changePay,
		changeMorePay,
		reduction,
		moveToPrinted,
		isPrinte,
		goPend,
		goPrinted,
		examine,
		needPrint,
		noPrint,
		addPrinted,
		exportDian,
		addGoods,
		deliverdAll,
		reissuePrinted,
    refund,
		cancelLogistics,
		cancelLog
	}
}
