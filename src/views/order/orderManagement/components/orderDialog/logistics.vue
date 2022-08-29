<!--
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-07-23 15:16:26
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 22:29:15
-->
<!--
 * @Descripttion: 物流
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 11:37:52
-->

<template>
	<div>
		<el-dialog
			:title="dialogTitle"
			v-model="dialogVisible"
			:width="width"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div class="logistics">
				<el-form
					:model="form"

					label-width="140px"
					:rules="rules"
					ref="formRef"
				>
					<el-form-item label="选择物流方式:" prop="selected">
						<!-- <el-select v-model="form.selected" placeholder="请选择物流方式" style="width:210px">
                  <el-option v-for="(item,index) in logisticList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select> -->

						<el-cascader
							:options="logisticList"
							placeholder="请选择物流方式"
							:props="caProps"
							@change="selectedLogis"
							v-model="form.selected"
							style="width: 300px"
						>
						</el-cascader>
					</el-form-item>
					<el-form-item
						label="其他物流方式:"
						v-if="form.selected[0] == 1"
						prop="otherLogistic"
					>
						<el-input
							v-model="form.otherLogistic"
							placeholder="请输入其他物流方式"
							style="width: 300px"
							:maxlength="60"
						></el-input>
					</el-form-item>
					<el-form-item
						label="获取方式:"
						v-if="form.selected[0] !== 1 && form.selected[0]"
					>
						<el-radio-group v-model="form.getType">
							<el-radio :label="0">自动获取</el-radio>
							<el-radio
								:label="1"
								v-if="logiType == 0 ? true : false"
								>手动输入</el-radio
							>
						</el-radio-group>
					</el-form-item>
					<el-form-item
						label="运单号:"
						v-if="form.selected[0] == 1 || form.getType == 1"
						prop="num"
					>
						<el-input
							v-model="form.num"
							placeholder="请输入运单号"
							style="width: 300px"
							:maxlength="60"
						></el-input>
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button
						type="primary"
						@click="saveApply"
						:loading="showLoadingSave"
						:disabled="showLoading"
						>保存并申请运单号</el-button
					>
					<el-button
						type="primary"
						@click="dialogHandOk"
						v-if="showSuccess"
						:disabled="showLoadingSave"
						:loading="showLoading"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	getCurrentInstance,
	inject,
	onMounted,
	ref,
	computed,
	nextTick
} from 'vue'
import { resetForm } from '@/utils/tool.js'
import { useStore } from 'vuex'
import {
	selectLogisticsSingle,
	channelWithManual,
	selectLogisticsMany,
	deliveredSelectLogisticsSingle,
	deliveredSelectLogisticsMany,
	checkTrackNumber
} from '@/api/order/orderManagement.js'
import { checkNumOrWords } from '@/utils/ruleOptions.js'
import {ElMessage} from 'element-plus'

export default {
	props: {
		dialog: {
			type: Object,
			default: null
		},
		dialogTitle: {
			type: String,
			default: '提示'
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '30%'
		},
		data: {
			type: Object,
			default: null
		},
		forbid: {
			type: Boolean,
			default: false
		},
		defaultChecked: {
			type: String,
			default: ''
		},
		defaultValue: {
			type: Array,
			default: []
		},
		isAllMatching:{
			type:Boolean,
			default:true
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		if (!props.forbid) {
			var formOptions = inject('formOptions')
			// 获取的formOptions 组件
			var orderTable = inject('orderTable')
			// 获取的orderTable 组件
		}

		const formRef = ref()
		const data = reactive({
			rules: {
				num: [
					{
						required: true,
						message: '请输入运单号',
						trigger: 'blur'
					},
					{ validator: checkNumOrWords, trigger: 'blur' }
				],
				selected: [
					{
						type:'array',
						required: true,
						message: '请选择物流方式',
						trigger: 'change'
					}
				],
				otherLogistic: [
					{
						required: true,
						message: '请输入其他物流方式',
						trigger: 'blur'
					}
				]
			},
			form: {
				selected: [],
				otherLogistic: '',
				num: '',
				getType: 0 //获取方式
			},
			logisticList: [], //物流方式
			caProps: {
				value: 'value',
				label: 'name',
				children: 'billWays'
			},
			showLoading: false,
			showLoadingSave: false
		})

		const logiType = computed(() => props.data.type)

		const showSuccess = computed(() => {
			if (store.getters.orderType == 8) return false
					//如果当前tab为已发货则就不允许显示
					return true
		}) // 是否显示确定按钮

		const getList = () => {
			const { type } = props.data
			channelWithManual().then(res => {
				if (res.code == 200) {
					data.logisticList = res.data || []

					if (type == 1) return
					data.logisticList.unshift({
						name: '其他',
						value: 1,
						billWays: null
					})
				}
			})
		} // 获取物流方式列表

		const selectedLogis = val => {
			console.log(val)
			data.form.selected = val
		} //选择物流方式

		const loadingFun = (val, type) => {
			if (type == 1) {
				//save
				data.showLoadingSave = val
				data.showLoading = !val
			} else if (type == 2) {
				data.showLoadingSave = !val
				data.showLoading = val
			} else {
				data.showLoadingSave = val
				data.showLoading = val
			}
		} // loading 的开启

		const dialogHandOk = () => {
			const { type } = props.data
			formRef.value.validate((bole, obj) => {
				if (bole) {
					checkTrack().then(res => {
						loadingFun(true, 2)
						type === 0 ? signle(0) : selectLogisticsMore(0)
						if (props.forbid) context.emit('change', true)
					})
				}
			})
		} //确定

		const saveApply = () => {
			const { type,isAllMatching} = props.data
			if(!isAllMatching || !props.isAllMatching) return ElMessage.error('请匹配所有发货商品!')
			formRef.value.validate((bole, obj) => {
				if (bole) {
					checkTrack().then(res => {
						loadingFun(true, 1)
						if (store.getters.orderType == 8) {
							type === 0 ? deliveSignle() : deliveMany()
							if (props.forbid) context.emit('change', true)
						} else {
							type === 0 ? signle(1) : selectLogisticsMore(1)
						}
					})
				}
			})
		} // 保存并申请

		const signle = operation => {
			const { id, logisticsId } = props.data
			const { selected, otherLogistic, num, getType } = data.form

			const param = {
				packageId: id,
				logistics: selected[0] == 1 ? otherLogistic : selected[0],
				lgtcLine: getLine(),
				operation: operation || 0,
				logisticsId: Number(logisticsId),
				trackNumber: getNum(),
				isOther: selected[0] == 1 ? 1 : 0
			}
			function getLine() {
				if (selected[0] == 1) return ''
				if (!selected[1]) return ''
				return selected[1]
			}
			function getNum() {
				if (selected[0] == 1) return num
				if (selected[0] !== 1 && getType == 1) return num
				return ''
			}

			selectLogisticsSingle(param)
				.then(res => {
					if (res.code == 200) {
						errMessage(res)
						if (props.forbid) {
							context.emit('closeModal', false)
						} else {
							cancel()
							formOptions.value.init()
						}
					}
					loadingFun(false, 3)
				})
				.catch(err => {

					loadingFun(false, 3)
					if (!props.forbid) formOptions.value.init()
					cancel()
				})
		} //单个选择物流
		//单条
		const selectLogisticsMore = operation => {
			const { logisticsId } = props.data
			const { infos } = props.data
			const { selected, otherLogistic, num, getType } = data.form
			const param = {
				infos,
				logistics: selected[0] == 1 ? otherLogistic : selected[0],
				lgtcLine: getLine(),
				operation: operation || 0,
				trackNumber: getNum(),
				isOther: selected[0] == 1 ? 1 : 0
			}

			function getLine() {
				if (selected[0] == 1) return 1
				if (!selected[1]) return selected[0]
				return selected[1]
			}
			function getNum() {
				if (selected[0] == 1) return num
				if (selected[0] !== 1 && getType == 1) return num
				return ''
			}

			selectLogisticsMany(param)
				.then(res => {
					console.log(res)
					if (res.code == 200) {
						errMessage(res)
						orderTable.value.dialogVisible = false
						loadingFun(false, 3)
						cancel()
					}
					if (!props.forbid) formOptions.value.init()
				})
				.catch(err => {

					loadingFun(false, 3)
					if (!props.forbid) formOptions.value.init()
					cancel()
				})
		} // 批量选择物流
		//多条

		const deliveMany = () => {
			const { packageIds, applyFlag } = props.data
			const { selected, otherLogistic, num, getType } = data.form
			const param = {
				packageIds,
				logistics: selected[0] == 1 ? otherLogistic : selected[0],
				lgtcLine: getLine(),
				applyFlag: applyFlag,
				isOther: selected[0] == 1 ? 1 : 0
			}

			function getLine() {
				if (selected[0] == 1) return 1
				if (!selected[1]) return selected[0]
				return selected[1]
			}
			function getNum() {
				if (selected[0] == 1) return num
				if (selected[0] !== 1 && getType == 1) return num
				return ''
			}

			deliveredSelectLogisticsMany(param)
				.then(res => {
					if (res.code == 200) {
						errMessage(res)
						orderTable.value.dialogVisible = false
						cancel()
						loadingFun(false, 3)
					}
					if (!props.forbid) formOptions.value.init()
				})
				.catch(err => {

					if (!props.forbid) formOptions.value.init()
					cancel()
					loadingFun(false, 3)
				})
		} /// 更换物流管理批量操作

		const deliveSignle = () => {
			const { id, logisticsId, applyFlag } = props.data
			const { selected, otherLogistic, num, getType } = data.form
			const param = {
				packageId: id,
				logistics: selected[0] == 1 ? otherLogistic : selected[0],
				lgtcLine: getLine(),
				logisticsId: Number(logisticsId),
				trackNumber: getNum(),
				applyFlag,
				isOther: selected[0] == 1 ? 1 : 0
			}
			function getLine() {
				if (selected[0] == 1) return ''
				if (!selected[1]) return ''
				return selected[1]
			}
			function getNum() {
				if (selected[0] == 1) return num
				if (selected[0] !== 1 && getType == 1) return num
				return ''
			}
			deliveredSelectLogisticsSingle(param)
				.then(res => {
					if (res.code == 200) {
						errMessage(res)
						orderTable.value.dialogVisible = false
						cancel()
						loadingFun(false, 3)
					}
					formOptions.value.init()
				})
				.catch(err => {

					formOptions.value.init()
					cancel()
					loadingFun(false, 3)
				})
		}

		const errMessage = res => {
			if (res.data.errorMag) {
				const { errorMag, code } = res.data
				if (code == 0 || code == 2) {
					let orderMessage = ``
					errorMag.map((v, index) => {
						let x = index + 1 == errorMag.length ? '' : ','
						orderMessage += `${v.errorMessage}: ${v.packageId}${x}`
					})
					let duration = 3000
					errorMag.length > 8 ? (duration = 5000) : ''
					proxy.$message.warning({
						message: orderMessage,
						type: 'warning',
						duration
					})
					//	proxy.$message.warning(orderMessage)
				} else {
					proxy.$message.success(res.message)
				}
			} else {
				proxy.$message.success(res.message)
			}
		}

		const reset = () => {
			data.form = resetForm(data.form, { selected: [], getType: 0 })
			console.log(data.form)
		}
		const close = () => {
			if (props.forbid) context.emit('closeModal', false)
			proxy.$parent.dialogVisible = false
			reset()
		}
		const cancel = () => {
			if (props.forbid) context.emit('closeModal', false)
			proxy.$parent.dialogVisible = false
			reset()
		}

		const checkTrack = () => {
			const { selected, num, getType } = data.form
			let trackNumber = getNum()

			return new Promise((resolve, reject) => {
				if (!getNum()) return resolve() // 如果没有运单号则不走该流程校验
				checkTrackNumber({ trackNumber })
					.then(res => {
						if (res.code == 200) {
							console.log(res)
							resolve()
						}
					})
					.catch(err => {

						reject()
					})
			})

			function getNum() {
				if (selected[0] == 1) return num
				if (selected[0] !== 1 && getType == 1) return num
				return ''
			}
		} // 检验运单号是否存在

		const getBackDetail = () => {
			const { parent } = props.data
			if (!parent) return
			const { isOther, logistics, lgtcLine, trackType, trackNumber } =
				parent
			if (isOther === 1) {
				data.form.selected[0] = 1
				// 选中其他物流
				data.form.otherLogistic = logistics
				data.form.num = trackNumber
				data.form.getType = trackType
			} else if (logistics) {
				data.form.selected[0] = logistics
				if (lgtcLine) {
					data.form.selected[1] = lgtcLine
				}
			}
			if (trackType !== null) {
				data.form.getType = trackType
				if (trackType == 1) {
					data.form.num = trackNumber
				}
			}
		}

		onMounted(() => {
			getList()
			nextTick(() => {
				getBackDetail()
			})
		})
		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			saveApply,
			selectedLogis,
			formRef,
			showSuccess,
			logiType
		}
	}
}
</script>

<style lang="scss" scoped></style>
