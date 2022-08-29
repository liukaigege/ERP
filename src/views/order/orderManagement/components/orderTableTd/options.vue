<!--
 * @Descripttion: 操作
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:22:30
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 23:24:27
-->

<template>
	<div class="options" v-if="showOptions">
		<div>
			<el-button
				type="text"
				size="small"
				v-if="isShow('detail')"
				v-permission="'order/orderManagement/orderDetail'"
				@click="goDetail"
				>详情</el-button
			>
		</div>

		<div>
			<el-button
				type="text"
				size="small"
				v-if="isShow('remark')"
				v-permission="'orderManagement/remark'"
				@click="
					showDialogs('Remarks', '订单备注', '35%', {
						packageIds: [parent.packageId]
					})
				"
				>备注</el-button
			>
		</div>

		<!--		<div>-->
		<!--			<el-button-->
		<!--				type="text"-->
		<!--				-->
		<!--				v-if="isShow('goHandle')"-->
		<!--				@click="goDetail('goHandle')"-->
		<!--			>去处理</el-button-->
		<!--			>-->
		<!--		</div>-->

		<div>
			<el-button
				type="text"
				size="small"
				v-if="isShow('refund')"
				v-permission="'orderManagement/refund'"
				:disabled="isDisabled('refund')"
				@click="clickBtn('refund')"
				>退款</el-button
			>
		</div>

		<div>
			<el-popconfirm
				@confirm="examine"
				title="审核通过后，订单将变更为待处理，且不可打回重新匹配，确认审核通过？"
				v-if="isShow('examine')"
			>
				<template #reference>
					<el-button
						type="text"
						size="small"
						:disabled="isDisabled('examine')"
						v-permission="'orderManagement/examine'"
						>审核</el-button
					>
				</template>
			</el-popconfirm>
		</div>
		<div>
			<el-button
				type="text"
				size="small"
				@click="splitOrders"
				v-if="isShow('splitOrder')"
				:disabled="isDisabled('splitOrder')"
				>拆分订单</el-button
			>
		</div>

		<div>
			<el-popconfirm
				@confirm="applyOrderNum"
				:title="isTrackNum()"
				v-if="isShow('applyWayNum')"
			>
				<template #reference>
					<el-button
						:disabled="isDisabled('applyOrderNum')"
						type="text"
						size="small"
						v-permission="'orderManagement/applyWayNum'"
						>申请运单号</el-button
					>
				</template>
			</el-popconfirm>
		</div>

		<div>
			<el-popconfirm
				@confirm="applyOrderNum"
				title="系统将重新为你申请运单号，确认申请？"
				v-if="isShow('reacquire')"
			>
				<template #reference>
					<el-button
						type="text"
						size="small"
						:disabled="isDisabled('applyAgain')"
						v-permission="'orderManagement/applyWayNum'"
						>重新获取</el-button
					>
				</template>
			</el-popconfirm>
		</div>

		<div>
			<el-popconfirm
				@confirm="addPrinted"
				title="确定移入待打单吗?"
				v-if="isShow('toPrinted')"
			>
				<template #reference>
					<el-button
						type="text"
						size="small"
						v-permission="'orderManagement/toPlay'"
						>移入待打单</el-button
					>
				</template>
			</el-popconfirm>
		</div>

		<div>
			<el-popconfirm
				@confirm="clickBtn('print')"
				title="确定打单吗?"
				v-if="isShow('printed')"
			>
				<template #reference>
					<el-button
						type="text"
						size="small"
						v-permission="'orderManagement/print'"
						:disabled="isDisabled('printed')"
						>打单</el-button
					>
				</template>
			</el-popconfirm>
		</div>

		<div>
			<el-button
				v-if="isShow('reissueGift')"
				v-permission="'reissueGifts'"
				@click="goReissueGift"
				type="text"
				size="small"
				>补发赠品</el-button
			>
		</div>

		<div>
			<el-button
				@click="clickBtn('reissuePrinted')"
				type="text"
				size="small"
				v-permission="'orderManagement/reissuePrinted'"
				v-if="isShow('reissuePrinted')"
				:disabled="isDisabled('reissuePrinted')"
				>补打单</el-button
			>
		</div>

		<div>
			<el-button
				type="text"
				v-if="isShow('reissuePackage')"
				v-permission="'orderManagement/supply'"
				size="small"
				@click="
					go('/order/orderManagement/supply', {
						packageId: parent.packageId
					})
				"
				>补发包裹</el-button
			>
		</div>

		<div>
			<!-- <el-popconfirm
				title="确定变更支付状态吗?"
				@confirm="clickBtn('changePay')"
				v-if="isShow('changePayType')"
			>
				<template #reference>

				</template>
			</el-popconfirm> -->
			<el-button
				v-if="isShow('changePayType')"
				type="text"
				size="small"
				@click="clickBtn('changePay')"
				v-permission="'orderManagement/changePayType'"
				>变更支付状态</el-button
			>
		</div>

		<div>
			<el-popconfirm
				@confirm="clickBtn('shelveOut')"
				title="确认还原?"
				v-if="isShow('reduction')"
			>
				<template #reference>
					<el-button
						type="text"
						size="small"
						v-permission="'orderManagement/reduction'"
						>还原</el-button
					>
				</template>
			</el-popconfirm>
		</div>
		<div>
			<el-popconfirm
				@confirm="clickBtn('cancelLog')"
				title="确认取消更换物流?"
				v-if="isShow('cancelLog')"
			>
				<template #reference>
					<el-button type="text" size="small">取消更换</el-button>
				</template>
			</el-popconfirm>
		</div>
	</div>

	<div v-if="!showOptions">
		<el-button type="primary" @click="merage" v-if="meargStatus == '1'">
			合并
		</el-button>
		<el-button type="primary" @click="noMearge" v-if="meargStatus == '2'">
			取消合并
		</el-button>
		<el-button type="primary" @click="noSplit" v-if="meargStatus == '3'">
			取消拆分
		</el-button>
	</div>
</template>

<script>
import orderOptions from '../../util/options.js'
import changeLogistic from '../../util/changeLogistic.js'
import btnFunList from '@/views/order/orderManagement/util/btnFunList.js'
import optionsDisabled from '../../util/optionsDisabled.js'
import { duplicate } from '@/utils/tool.js'
import {
	computed,
	onMounted,
	getCurrentInstance,
	reactive,
	toRefs,
	inject
} from 'vue'
import { useStore } from 'vuex'
import {
	updateExamine,
	getWayBillNum,
	addPrint,
	printed,
	cancelSplitPackages,
	moveToPrint, // 移入待打单
	deliveredApplyNum // 重新获取
} from '@/api/order/orderManagement.js'
export default {
	components: {},
	props: {
		scope: {
			type: Object,
			default: null
		},
		tableData: Object
	},
	setup(props) {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const btnFunction = btnFunList(orderTable, formOptions)
		const parent = computed(() => {
			return props.scope.parentRow
		})
		let disabledFun = optionsDisabled()
		const data = reactive({})
		const isShow = types => {
			const { orderTabType, isChangeLogist, changeLogisticType } = store.getters
			const list = orderOptions[orderTabType].options
			if (isChangeLogist) {
				if (
					types == 'cancelLog' &&
					['pending', 'waitPrint', 'toBeDelivered'].includes(changeLogisticType)
				) {
					return true
				}

				const logisticList = changeLogistic[changeLogisticType].options
				let bole
				let { applyStatus, logistics } = props.scope.parentRow
				if (logisticList.indexOf(types) !== -1) {
					if (changeLogisticType == 'pending') {
						// 如果为已交运待处理
						let status = applyStatus
						if (!logistics) status = 3 // 如果运单号不在,则为3
						if (types == 'detail' || types == 'remark') {
							return (bole = true)
						}
						let statusList = {
							reacquire: 0,
							applyWayNum: 3, //未申请
							toPrinted: 1
						}
						if (statusList[types] == status) {
							return (bole = true)
						} else {
							return (bole = false)
						}
					} else {
						bole = true
					}
				} else {
					bole = false
				}
				return bole
			} else if (list.indexOf(types) !== -1) {
				return true
			} else {
				return false
			}
		} // 是否显示按钮

		const isDisabled = type => {
			return disabledFun[type](
				props.scope.row,
				parent.value,
				store.getters.orderType
			)
		}

		const isChangeLogist = computed(() => store.getters.isChangeLogist)
		const showOptions = computed(() => {
			if (store.getters.merageStatus !== '0') return false
			return true
		})

		const meargStatus = computed(() => {
			return store.getters.merageStatus
		})

		const showDialogs = (val, title, width, data) => {
			// if (!isSelected()) return
			orderTable.value.showDialog(val, title, width, data)
		}

		const isTrackNum = () => {
			let title = '系统将自动为你申请运单号，确认申请？'

			if (props.scope.parentRow.trackNumber) {
				title = '系统将重新为你申请运单号，确认申请？'
				if (props.scope.parentRow.trackType == 1) {
					title = '该包裹已设置运单号，将自动匹配库存，确认匹配库存？'
				}
			}
			return title
		} // s是否有运单号

		const examine = () => {
			const { packageId } = parent.value
			const param = {
				packageIds: packageId
			}
			updateExamine(param).then(res => {
				if (res.code == 200) {
					proxy.$message.success(res.message)
					formOptions.value.init()
				}
				if (res.code == 301) {
					proxy.$message.warning(res.message)
					formOptions.value.init()
				}
			})
		} // 审核包裹

		const goReissueGift = () => {
			const { packageId } = parent.value
			const { orderId } = props.scope.row
			const query = { packageId, orderId }
			proxy.go('/order/orderManagement/reissueGifts/index', query)
		} //补发赠品

		const addPrinted = () => {
			if (store.getters.isChangeLogist) {
				const packageIds = parent.value.packageId
				moveToPrint({ packageIds }).then(res => {
					if (res.code == 200) {
						proxy.$message.success(res.message)
						formOptions.value.init(1)
					}
				})
				return
			}
			const param = {
				packages: parent.value.packageId
			}
			addPrint(param).then(res => {
				if (res.code == 200) {
					proxy.$message.success(res.message)
					formOptions.value.init()
				}
			})
		} //移入待打单

		const showPrint = () => {
			const param = { packageIds: parent.value.packageId }
			printed(param).then(res => {
				if (res.code == 200) {
					const { pdfUrl } = res.data
					showDialogs('PrintInfo', '面单打印信息确认', '35%', res.data)
				}
			})
		} // 打单

		const splitOrders = () => {
			btnFunction['splitOrders'](props.scope.parentRow)
		}

		const clickBtn = val => {
			if (val === 'refund') {
				btnFunction[val]([parent.value])
				return
			}
			if (val) {
				const packageIds = parent.value.packageId
				btnFunction[val](packageIds)
			}
		}

		const applyOrderNum = () => {
			if (!parent.value.logistics) {
				proxy.$message.error('请选择物流方式后再申请!')
				return
			}
			const { isChangeLogist } = store.getters
			let param = {
				packageIds: parent.value.packageId
			}
			if (isChangeLogist) {
				deliveredApplyNum(param).then(async res => {
					if (res.code == 200) {
						const { code, errorMag } = res.data
						if (code == 0 || code == 2) {
							let orderMessage = `无效包裹号:`
							errorMag.map((v, index) => {
								let x = index + 1 == errorMag.length ? '' : ','
								orderMessage += `${v.packageId}${x}`
							})
							proxy.$message.warning(orderMessage)
						} else {
							proxy.$message.success(res.message)
							formOptions.value.init()
						}
					}
				})
				return
			} // 已交运待处理重新获取

			getWayBillNum(param).then(async res => {
				if (res.code == 200) {
					const { code, errorMag } = res.data
					if (code == 0) {
						let orderMessage
						errorMag.map(v => {
							orderMessage += `<p>${v.packageId}:${v.errorMessage}</p>`
						})
						proxy.$notify.error({
							title: '请求错误',
							dangerouslyUseHTMLString: true,
							message: orderMessage
						})
					} else {
						proxy.$message.success(res.message)
						formOptions.value.init()
					}
				}
			})
		} // 申请运单号

		const getMeargeData = () => {
			let meargeKey = orderTable.value.meargeKey
			const { meargeData, tableData } = orderTable.value
			const { infoCode, packageId, deductFlag } = props.scope.parentRow
			let mergeOrdersRelDTOS = []
			let logistic = []
			tableData.forEach((item, index) => {
				let x = item.packageRels
				if (isHave(item[meargeKey]) && x.length > 0) {
					if (item.logistics && item.trackType !== 1) {
						let logis = {
							logistics: item.logistics,
							lgtcLine: item.lgtcLine,
							logisticsName: item.logisticsName,
							lgtcLineName: item.lgtcLineName,
							trackNumber: item.trackNumber,
							id: index,
							packageId: item.packageId,
							trackType: item.trackType
						}
						logistic.push(logis)
					} else if (item.trackNumber && item.trackType !== 1) {
						let logis = {
							logistics: item.logistics,
							lgtcLine: item.lgtcLine,
							logisticsName: item.logisticsName,
							lgtcLineName: item.lgtcLineName,
							trackNumber: item.trackNumber,
							id: index,
							packageId: item.packageId,
							trackType: item.trackType
						}
						logistic.push(logis)
					}

					for (let i = 0; i < x.length; i++) {
						let obj = {
							orderId: x[i].orderId,
							packageId: item.packageId,
							deductFlag: item.infoCodeFlag == 2 ? 1 : item.deductFlag,
							createTime: x[i].createTime,
							logisticsId: item.logisticsId,
							totalPrice: x[i].totalPrice,
							currency: x[i].currency,
							lag: item.mergeFlag == 1 ? true : false // 是否已合并
						}

						mergeOrdersRelDTOS.push(obj)
					}
				}
			}) // 获取合并订单数据

			function isHave(code) {
				let bole = false
				if (meargeData[code] && code == props.scope.parentRow[meargeKey])
					bole = true
				return bole
			}
			return {
				mergeOrdersRelDTOS,
				logistic: logistic
			}
		}

		function setLogistic(array) {
			let obj = {}
			return array.filter((item, index) => {
				// 防止key重复
				let newItem = item.logistic + item.lgtcLine
				return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true)
			})
		} // 物流去重

		const merage = async () => {
			const data = await getMeargeData()
			btnFunction['merage'](data)
		} // 合并订单

		const noMearge = () => {
			const { packageId, packageRels } = props.scope.parentRow
			let orderData = []
			packageRels.forEach(item => {
				let obj = {
					orderId: item.orderId,
					price: item.totalPrice,
					currency: item.currency
				}
				orderData.push(obj)
			})

			const data = {
				orderData,
				packageId
			}

			btnFunction['noMearge'](data)
		} // 取消合并订单

		const noSplit = () => {
			let meargeKey = orderTable.value.meargeKey
			const { tableData } = orderTable.value
			const { infoCode, packageId, deductFlag } = props.scope.parentRow
			let prefixId = props.scope.parentRow[meargeKey]
			let packageIds = []
			let logistic = []
			tableData.forEach((item, index) => {
				if (item[meargeKey] == prefixId) {
					packageIds.push(item.packageId)
					if (item.logistics && item.trackType !== 1) {
						let obj = {
							logisticsId: item.logisticsId,
							logistics: item.logistics,
							lgtcLine: item.lgtcLine,
							logisticsName: item.logisticsName,
							lgtcLineName: item.lgtcLineName,
							trackNumber: item.trackNumber,
							index: index,
							trackType: item.trackType
						}
						logistic.push(obj)
					}
				}
			})

			btnFunction['cancelSplit']({
				packageIds: packageIds.join(','),
				logistic: setLogistic(logistic)
			})
		}

		const goDetail = () => {
			//	store.dispatch('orderManage/setShowDetailByActions',true)
			const { isChangeLogist } = store.getters
			let query = {
				packageId: parent.value.packageId,
				isAll: store.getters.orderTabType == 'allOrder' ? 0 : 1,
				show: store.getters.showDetail,
				isChangeLogist
			}
			//	store.dispatch('orderManage/setDetailQueryByActions',query)
			const packageIdList = props.tableData.map(v => v.packageId)
			sessionStorage.setItem('packageIdList', JSON.stringify(packageIdList))
			proxy.go('/order/orderManagement/orderDetail', query)
		}

		onMounted(() => {})
		return {
			...toRefs(data),
			isShow,
			parent,
			examine,
			showDialogs,
			applyOrderNum,
			addPrinted,
			showPrint,
			clickBtn,
			showOptions,
			merage,
			meargStatus,
			noMearge,
			splitOrders,
			noSplit,
			goDetail,
			isChangeLogist,
			isTrackNum,
			isDisabled,
			goReissueGift
		}
	}
}
</script>
<style lang="scss" scoped>
.options {
	padding: 5px 10px;
}
:deep(.el-button--small) {
	min-height: 10px;
	padding: 2px 2px;
}
</style>
