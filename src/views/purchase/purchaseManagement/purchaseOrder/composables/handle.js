import { useRouter } from 'vue-router'
import { deepCopy } from '@/utils/tool.js'
import {
	supplierGetTree,
	purchaseOrdersList,
	remarkTypes,
	purchaseUsers,
	purchaseStatusNum,
	purchaseExamine,
	purchaseToVoid,
	purchaseDelete,
	printPurchases,
	exceptionList,
	exceptionUser
} from '@/api/purchase/purchase.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick } from 'vue'
export default function (
	state,
	formRef,
	formRef2,
	selectTreeRef,
	ErpPage_01,
	ErpPage_02,
	route
) {
	let router = useRouter()
	let imposeEvent = () => {
		if (state.selections.length == 0) {
			ElMessage.error('请选择订单!')
			return false
		} else {
			return true
		}
	}

	let initFun = () => {
		state.purchaseTable.forEach(item => (item.checked = false))
		state.selections = []
		state.selectionArr = []
		state.selectedAll = false
	}

	// 设置默认排序
	let defaultSort = i => {
		switch (i) {
			case null: // 全部订单
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'desc'
				break
			case '0': // 草稿
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'asc'
				break
			case '1': // 待审核
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'asc'
				break
			case '2': // 未通过
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'asc'
				break
			case '5, 6': // 待到货 全部
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'asc'
				break
			case '7': // 已完成
				state.form.sortName = 'tr.record_create_time'
				state.form.sortType = 'desc'
				break
			case '8': // 已取消
				state.form.sortName = 'o.create_time'
				state.form.sortType = 'desc'
				break
		}
	}

	// 获取供应商列表
	let getSupplierGetTree = () => {
		supplierGetTree().then(res => {
			if (res.code == 200) {
				state.supplierOptions = res.data
				// if (route?.params?.supplierType) {
				//   console.log(route.params.supplierType)
				//   res.data.some(item => {
				//     if (item.name == route?.params?.supplierType) {
				//       console.log(item.id)
				//       state.form.supplierModel = [item.id]
				//       state.form.supplierId = null
				//       state.form.partnerType = item.id
				//       return true
				//     }
				//   })
				// }
				// console.log(state.form.partnerType)
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 选择供应商
	let changeSupplier = value => {
		console.log(value)
		if (value) {
			state.form.partnerType = value[0]
			state.form.supplierId = value[1] || null
		} else {
			state.form.partnerType = null
			state.form.supplierId = null
		}
	}

	// 获取备注列表
	let getRemarkTypes = () => {
		remarkTypes({ useScope: '2' }).then(res => {
			if (res.code == 200) {
				res.data.forEach(item => {
					item.checked = false
				})
				state.remakeOptions = res.data
        let remark=state.form.remarkTypeId?state.form.remarkTypeId.split(','):[]
        state.remakeOptions.forEach(item=>{
          if(remark.some(v=>item.id==v)) item.checked = true
        })
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 勾选备注类型
	let changeRemake = () => {
		let arr = []
		state.remakeOptions.forEach(item => {
			if (item.checked) {
				arr.push(item.id)
			}
		})
		state.form.remarkTypeId = arr.join(',')
	}

	let recursionEvent = data => {
		data.forEach(item => {
			if (item.children?.length) {
				item.children.forEach(it => {
					it.disabled = true
				})
				if (item.userVos?.length) {
					item.userVos.forEach(it => {
						let obj = {
							deptName: it.fullName,
							deptId: it.userId,
							disabled: false
						}
						item.children.push(obj)
					})
				}
				recursionEvent(item.children)
			} else {
				item.children = item.userVos || []
				item.children.forEach(it => {
					it.deptName = it.fullName
					it.deptId = it.userId
					it.disabled = false
				})
			}
		})
		return data
	}

	// 获取采购员列表
	let getPurchaseUsers = () => {
		purchaseUsers().then(res => {
			if (res.code == 200) {
				// state.purchaseUserOptions = recursionEvent(res.data)
				state.purchaseUserOptions = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 选择采购员
	let checkedDept = value => {
		state.form.purchaseUserId = value
	}

	// 获取采购员列表（异常）
	let getPurchaseExceptionUsers = () => {
		exceptionUser({ userType: 1 }).then(res => {
			if (res.code == 200) {
				state.purchaseExceptionUsers = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 获取签收员列表
	let getqaUserUsers = () => {
		exceptionUser({ userType: 2 }).then(res => {
			if (res.code == 200) {
				state.qaUserOptions = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 获取入库员列表
	let getinputUserUsers = () => {
		exceptionUser({ userType: 4 }).then(res => {
			if (res.code == 200) {
				state.inputUserOptions = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 获取质检员列表
	let getsignUserUsers = () => {
		exceptionUser({ userType: 3 }).then(res => {
			if (res.code == 200) {
				state.signUserOptions = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 查询订单不同状态的数量
	let getPurchaseStatusNum = () => {
		purchaseStatusNum().then(res => {
			if (res.code == 200) {
				state.statusNumList = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}

	// 查询
	let searchEvent = () => {
		return new Promise(reslove => {
			state.loading = true
      state.btnLoading = true
      state.form.searchText = state.copySearchText
      if (state.form.searchType == 9) {
        let result
        try {
          result = JSON.parse(state.copySearchText)
        } catch {
          result = state.copySearchText
        }
        if (result.ivtPurchaseDetailId) {
          state.form.searchText = result.ivtPurchaseDetailId.toString()
        } else {
          const resultStr = result.toString()
          const symbolList = [',', '，', '[', ']', '。', '.', '?', '!', '%', '}{','}"','"{']
          if (symbolList.some(item => resultStr.indexOf(item) > -1)) {
            state.loading = false
            state.btnLoading = false
            return ElMessage.error('二维码ID格式不正确')
          }
          state.form.searchText = resultStr
        }
      }
			// let params = deepCopy(state.form)
			// if (state.isSupplier == 1) params.status = '5, 6, 7'
			purchaseOrdersList(state.form)
				.then(res => {
					state.loading = false
					state.btnLoading = false
					if (res.code == 200) {
						let arr = []
						res.data.dataList.forEach((item, index) => {
							arr.push(deepCopy(item))
							arr.push(deepCopy(item))
						})
						state.purchaseTotalCount = res.data.page.totalCount
						state.purchaseTable = arr
						initFun()
						reslove()
					} else {
						ElMessage.error(res.message)
					}
				})
				.catch(err => {
					state.loading = false
					state.btnLoading = false
				})
		})
	}

	// 重置
	let resetForm = bole => {
		formRef.value.resetFields()
		state.settlementCopy =
			state.form.settlementType =
			state.form.settlementValue =
				null
		// 重置pageNo
		state.form.page.pageNo = 1
    state.copySearchText = null
		ErpPage_01.value.initPageNo(1)
		// 重置订单状态
		state.orderStatus = null
		// 待到货状态下重置采购状态
		if (['5, 6', '5', '6'].includes(state.form.status)) {
			state.shippedStatus = null
			state.form.status = '5, 6'
		}
		// 重置备注类型勾选状态
		state.remakeOptions.forEach(item => (item.checked = false))
		state.form.remarkTypeId = ''
		// 重置供应商选择
		state.form.supplierModel = null
		state.form.partnerType = null
		state.form.supplierId = null
		// 重置采购员选择
		// state.form.purchaseUserId = null
		// selectTreeRef.value.selectedData = null
		if (bole) searchEvent()
	}

	// 查询未关闭异常
	let searchExceptionInfo = () => {
		state.loading = true
		exceptionList(state.exceptionForm)
			.then(res => {
				state.loading = false
				state.btnLoading = false
				if (res.code == 200) {
					state.exceptionTable = res.data.dataList
					state.exceptionTotalCount = res.data.page.totalCount
				} else {
					ElMessage.error(res.message)
				}
			})
			.catch(err => {
				state.loading = false
				state.btnLoading = false
			})
	}

	// 重置未关闭异常
	let resetExceptionForm = bole => {
		formRef2.value.resetFields()
		state.exceptionForm.page.pageNo = 1
		ErpPage_02.value.initPageNo(1)
		if (bole) searchExceptionInfo()
	}

	// tab切换
	let tabSelectEvent = i => {
		if (state.tabStatus == '5, 6' && state.radioGroupModel == 1) {
			resetExceptionForm()
		} else {
			resetForm()
		}
		i == '2' ? (state.form.noPassStatus = 1) : (state.form.noPassStatus = null)
		state.tabStatus = i
		state.form.status = i
		state.radioGroupModel = state.radioGroupModel && 0
		if (i == '2') {
			state.form.voidFlag = 0
		} else {
			state.form.voidFlag = null
		}
		// 修改排序设置字段
		const arr = ['0', '1', '2', '8']
		if (arr.includes(state.tabStatus)) {
			state.defaultSortOptions = [
				{ value: 'o.create_time', label: '创建时间' },
				{ value: 'total_amount', label: '订单金额' }
			]
		} else {
			state.defaultSortOptions = [
				{ value: 'o.create_time', label: '创建时间' },
				{ value: 'tr.record_create_time', label: '到货时间' },
				{ value: 'total_amount', label: '订单金额' }
			]
		}
		defaultSort(i)
		// 为了重置排序，手动把默认排序的配置置为空对象
		state.defaultNormalSortOpt = {}
		Object.assign(state.defaultNormalSortOpt, {
			value: state.form.sortName,
			type: state.form.sortType
		})
		ErpPage_01.value.init()
		searchEvent().then(_ => {
			nextTick(() => {
				document.documentElement.scrollTop = 0
			})
		})
		if (i == '5, 6') searchExceptionInfo()
	}

	// 切换订单状态
	let changeStatus = e => {
		console.log(e)
		if (e == '2') state.form.voidFlag = null
	}

	// 排序
	let sortEvent = (name, type) => {
		state.defaultNormalSortOpt = state.defaultExceptionSortOpt = {
			type,
			value: name
		}
		if (state.radioGroupModel == 0) {
			state.form.sortType = type
			state.form.sortName = name
			searchEvent()
		} else {
			state.exceptionForm.orderFieId = name
			state.exceptionForm.orderBy = type
			searchExceptionInfo()
		}
	}

	// 修改采购状态
	let shippedStatusChange = e => {
		if (!e) {
			state.form.status = '5, 6'
			return false
		}
		state.form.status = e
	}

	// 关闭弹框回调
	let closeEvent = status => {
		// status为true时，刷新列表
		state.ifShow = false
		state.url = ''
		if (status) {
			getPurchaseStatusNum()
			searchEvent()
		}
	}

	// 同步订单
	let syncOrder = url => {
		state.url = url
		state.ifShow = true
	}

	// 导出订单
	let exportOrder = url => {
		state.url = url
		state.ifShow = true
	}
	// 导出定制信息
	let exportCustom = url => {
		state.url = url
		state.ifShow = true
	}

	// 导入配件价格
	let importAccessoryPrice = url => {
		state.url = url
		state.ifShow = true
	}
	// 备注
	let remarkEvent = url => {
		if (!imposeEvent()) return false
		state.url = url
		state.ifShow = true
	}

	// 驳回审核
	let batchRejectCheck = url => {
		if (!imposeEvent()) return false
		state.url = url
		state.ifShow = true
	}

	// 批量添加运单号
	let batchaddWaybillNum = url => {
		if (!imposeEvent()) return false
		state.url = url
		state.ifShow = true
	}

	// 批量申请付款
	let batchPay = () => {
		if(state.selectionArr.some(v=>v.customization == 1) && state.selectionArr.some(v=>v.customization == 0)) return ElMessage.error('普货和定制品采购单不可同时申请付款，请筛选订单类型分别批量申请')
		if (!imposeEvent()) return
		let arr = []
		state.selectionArr.forEach(item => {
			if (
				item.type !== 3 &&
				item.canPayAmount &&
				item.settlementType != 2 // 账期类定制品不允许申请付款 settlementType为2时是账期类数据
			) {
				arr.push(item.id)
			}
		})
		if (arr.length == 0)
			return ElMessage.error('已选采购订单均不能申请付款，请重新选择！')
		router.push({
			path: '/purchase/purchaseManagement/batchApplyPay',
			query: {
				id: arr.join(',')
			}
		})
	}

	// 批量提交审核/通过审核
	let batchPurchaseExamine = type => {
		if (!imposeEvent()) return false
		let arr = []
		if (type == 1) {
			state.selectionArr.forEach(item => {
				if (item.voidFlag !== 1) {
					arr.push(item.id)
				}
			})
			if (arr.length == 0) {
				ElMessage.error('已选采购订单均不能提交审核，请重新选择！')
				return false
			}
		} else {
			arr = state.selections
		}
		let text = type == 1 ? '提交审核' : '通过审核'
		ElMessageBox.confirm(`确认${text}?`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			closeOnClickModal: false
		})
			.then(() => {
				let params = {
					ids: arr,
					type
				}
				state.btnLoading = true
				purchaseExamine(params)
					.then(res => {
						state.btnLoading = false
						if (res.code == 200) {
							getPurchaseStatusNum()
							searchEvent()
							ElMessage.success({ message: '操作成功！', type: 'success' })
						} else {
							ElMessage.error(res.message)
						}
					})
					.catch(err => {
						state.btnLoading = false
					})
			})
			.catch(() => {})
	}

	// 作废
	let batchPurchaseToVoid = () => {
		if (!imposeEvent()) return false
		ElMessageBox.confirm('确认作废此订单?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			closeOnClickModal: false
		})
			.then(() => {
				state.btnLoading = true
				purchaseToVoid({ ids: state.selections })
					.then(res => {
						state.btnLoading = false
						if (res.code == 200) {
							getPurchaseStatusNum()
							searchEvent()
							ElMessage.success({ message: '操作成功！', type: 'success' })
						} else {
							ElMessage.error(res.message)
						}
					})
					.catch(err => {
						state.btnLoading = false
					})
			})
			.catch(() => {})
	}

	// 批量删除
	let batchDel = () => {
		if (!imposeEvent()) return false
		ElMessageBox.confirm('确认删除此订单?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			closeOnClickModal: false
		})
			.then(() => {
				purchaseDelete({ ids: state.selections }).then(res => {
					if (res.code == 200) {
						getPurchaseStatusNum()
						searchEvent()
						ElMessage.success({ message: '操作成功！', type: 'success' })
					} else {
						ElMessage.error(res.message)
					}
				})
			})
			.catch(() => {})
	}

	// 打印采购单/商品条码
	let printEvent = type => {
		if (!imposeEvent()) return false
		state.btnLoading = true
		printPurchases({ ids: state.selections, type })
			.then(res => {
				state.btnLoading = false
				if (res.code == 200) {
					window.open(res.data)
					ElMessage.success({ message: '操作成功！', type: 'success' })
				} else {
					ElMessage.error(res.message)
				}
			})
			.catch(err => {
				state.btnLoading = false
			})
	}

	// 全选
	let selectAll = value => {
		state.purchaseTable.map(row => {
			row.checked = value
			selectRow(row)
		})
	}

	// 单选
	let selectRow = row => {
		if (row.checked) {
			if (state.selections.indexOf(row.id) === -1) {
				state.selections.push(row.id)
				state.selectionArr.push(row)
			}
		} else {
			const index = state.selections.indexOf(row.id)
			state.selections.splice(index, 1)
			state.selectionArr.splice(index, 1)
		}
		const length = state.purchaseTable.length / 2
		state.selectedAll = state.selections.length === length
	}

	// 订单状态回调
	let changeOrderStatus = () => {
		state.form.status = state.orderStatus.join(', ')
		console.log(state.form.status)
		// state.isSupplier = null
	}

	return {
		tabSelectEvent,
		syncOrder,
		changeRemake,
		searchEvent,
		resetForm,
		searchExceptionInfo,
		resetExceptionForm,
		sortEvent,
		remarkEvent,
		closeEvent,
		batchRejectCheck,
		batchaddWaybillNum,
		batchPay,
		getSupplierGetTree,
		changeSupplier,
		getRemarkTypes,
		getPurchaseUsers,
		getqaUserUsers,
		getinputUserUsers,
		getsignUserUsers,
		getPurchaseExceptionUsers,
		selectAll,
		selectRow,
		getPurchaseStatusNum,
		batchPurchaseExamine,
		batchPurchaseToVoid,
		batchDel,
		printEvent,
		exportOrder,
		exportCustom,
		checkedDept,
		shippedStatusChange,
		changeStatus,
		changeOrderStatus,
		importAccessoryPrice
	}
}
