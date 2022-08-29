import { ElMessageBox, ElMessage } from 'element-plus'
import {
	applyNoQuotation,
	deleteGoods,
	quotationApply,
	batchModifyGoodsCategory
} from '@/api/goods/quotedPrice.js'
import { storage } from '@/utils/storage.js'
export default function (state, hooks, router) {
	let imposeEvent = () => {
		if (state.selections.length == 0) {
			ElMessage.error('请选择商品!')
			return false
		} else {
			return true
		}
	}
	// 排序
	let sortEvent = type => {
		if (state.form.sortName !== type) {
			state.form.sortType = 'desc'
			state.form.sortName = type
		} else {
			state.form.sortType == 'desc'
				? (state.form.sortType = 'asc')
				: (state.form.sortType = 'desc')
		}
		state.form.page.pageNo = 1
		hooks.searchEvent()
	}

	// 编辑
	let editEvent = ({ id, combineType }) => {
		router.push({
			path: '/goods/goodsManagement/unsetPrice/editDetail',
			query: {
				goodsId: id,
				combineType
			}
		})
	}

	// 查看
	let lookEvent = ({ id, combineType }) => {
		router.push({
			path: '/goods/goodsManagement/unsetPrice/editDetail',
			query: {
				goodsId: id,
				combineType,
				type: 'layList'
			}
		})
	}

	// 切换tab
	let tabSelectEvent = type => {
		state.form.goodsStatus = type
		state.form.page.pageNo = 1
		if (type == 1) state.form.sortName = 1
		if (type == 3) state.form.sortName = 3
		hooks.getGoodsNum(3)
		hooks.getCategoryEvent()
		hooks.searchEvent()
	}

	// 申请报价
	let quoteEvent = () => {
		if (!imposeEvent()) return false
		if (state.form.goodsStatus == 3) {
			quotationApply({
				goodsIds: state.selections,
				sign: 1
			}).then(res => {
				res.data.forEach(item => {
					//historyStatus 0 相似品
					//historyStatus 1 报价成功
					//historyStatus 2 相似品（已报价）
					//historyStatus 3 相似品（已申请权限）
					item.historyStatus = item.isSimilar
				})
				storage.set('quotation', JSON.stringify(res.data))
				router.push({
					path: '/goods/goodsManagement/unsetPrice/quotation'
				})
			})

			return false
		}
		ElMessageBox.confirm('确认申请报价勾选的商品？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			state.btnLoading = true
			applyNoQuotation({ goodsIds: state.selections, sign: 0 })
				.then(res => {
					state.btnLoading = false
					if (res.code == 200) {
						hooks.getGoodsNum(3)
						hooks.searchEvent()
						ElMessage.success({ message: '操作成功！', type: 'success' })
					} else {
						ElMessage.error(res.message)
					}
				})
				.catch(err => {
					state.btnLoading = false
				})
		})
	}

	// 删除商品
	let delGoodsEvent = () => {
		if (!imposeEvent()) return false
		ElMessageBox.confirm('确认删除勾选商品？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			state.btnLoading = true
			deleteGoods({ goodsIds: state.selections })
				.then(res => {
					state.btnLoading = false
					if (res.code == 200) {
						hooks.getGoodsNum(3)
						hooks.searchEvent()
						ElMessage.success({ message: '操作成功！', type: 'success' })
					} else {
						ElMessage.error(res.message)
					}
				})
				.catch(err => {
					state.btnLoading = false
				})
		})
	}

	let batchEditCategories = () => {
		if (!imposeEvent()) return
		state.ifShow = true
	}

	let closeEvent = () => {
		state.ifShow = false
		state.categoryValue = ''
	}

	// 确认回调
	let affirmEvent = () => {
		if (!state.categoryValue) return ElMessage.error('请选择要修改的品类!')
		ElMessageBox.confirm(
			'修改品类将会影响部分人员对该商品的查看权限，你还要继续吗?',
			'提示',
			{
				closeOnClickModal: false,
				closeOnPressEscape: false,
				showClose: false,
				type: 'warning'
			}
		).then(_ => {
			state.btnLoading = true
			batchModifyGoodsCategory({
				goodsIds: state.selections,
				categoryId: state.categoryValue
			})
				.then(res => {
					state.btnLoading = false
					closeEvent()
					if (res.code == 200) {
						hooks.getGoodsNum(3)
						hooks.searchEvent()
						ElMessage.success({ message: '操作成功！', type: 'success' })
					} else {
						ElMessage.error(res.message)
					}
				})
				.catch(err => {
					closeEvent()
					state.btnLoading = false
				})
		})
	}

	let colspanMethod = ({ rowIndex, columnIndex }) => {
		if (rowIndex % 2 === 0) {
			if (columnIndex === 0) {
				return { rowspan: 1, colspan: 7 }
			} else {
				return { rowspan: 0, colspan: 0 }
			}
		}
	}
	let colspanMethod2 = ({ rowIndex, columnIndex }) => {
		if (rowIndex % 2 === 0) {
			if (columnIndex === 0) {
				return { rowspan: 1, colspan: 9 }
			} else {
				return { rowspan: 0, colspan: 0 }
			}
		}
	}
	return {
		sortEvent,
		editEvent,
		tabSelectEvent,
		quoteEvent,
		delGoodsEvent,
		colspanMethod,
		colspanMethod2,
		lookEvent,
		batchEditCategories,
		affirmEvent,
		closeEvent
	}
}
