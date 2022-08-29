<!--
 * @Descripttion: 取消拆分的选择物流弹窗
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-17 11:29:51
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
			<div class="logistic">
				<p class="text" style="margin-bottom: 20px">
					您选择取消拆分的订单物流方式不同，请选择一个取消拆分后使用的物流方式
				</p>
				<el-form
					:model="form"
					
					label-width="120px"
					:rules="rules"
					ref="formRef"
				>
					<el-form-item label="选择物流方式" prop="selectedLog">
						<el-select
							v-model="form.selectedLog"
							placeholder=""
							@change="getSelect"
						>
							<el-option
								v-for="(item, index) in logistic"
								:key="index"
								:label="item.logisticsName+'-'+item.lgtcLineName"
								:value="item.index"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button type="primary"  @click="dialogHandOk"
          :disabled="disabled"
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
	onMounted,
	ref,
	inject
} from 'vue'
import { cancelSplitPackages } from '@/api/order/orderManagement.js'
import { debounce } from '@/utils/tool.js'
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
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const formOptions = inject('formOptions')
		const orderTable = inject('orderTable')
    // 获取的orderTable 组件
		const data = reactive({
			rules: {
				selectedLog: [
					{
						required: true,
						message: '请选择物流方式',
						trigger: 'change'
					}
				]
			},
			form: {
				selectedLog: ''
			},
			logistic: [],
      disabled:false
		})
		const formRef = ref(null)
		const getSelect = val => {
			console.log(val)
		}

		const dialogHandOk = debounce(() => {
			formRef.value.validate((bole, obj) => {
				if (bole) {
					console.log(data.form.selectedLog)
					let param
					const { logistic, packageIds } = props.data
				
					logistic.forEach(item => {
						if (item.index == data.form.selectedLog) {
							param = {
								packageIds: packageIds,
								logisticsId: Number(item.logisticsId),
								logistics: item.logistics,
								lgtcLine: item.lgtcLine,
								trackNumber: null
							}
              data.disabled = true
							cancelSplitPackages(param)
								.then(res => {
									if (res.code == 200) {
										proxy.$message.success(res.message)
										formOptions.value.init().then(res=>{
											orderTable.value.meargeData = orderTable.value.getMerge(res,'prefixId')
											 // 取消拆分单元格之后重新整理列表样式
										})
                    data.disabled = false
										cancel()
									}
								})
								.catch(err => {
									
                  data.disabled = false
									formOptions.value.init()
								})
						}
					})
				}
			})
		})

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
		}
		onMounted(() => {
			data.logistic = props.data.logistic
			console.log(props.data, 123)
		})
		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			getSelect,
			formRef
		}
	}
}
</script>

<style lang="scss" scoped></style>
