<!--
 * @Descripttion: 补打单原因
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-21 09:48:03
-->

<template>
	<div class="container">
		<el-dialog
			:title="dialogTitle"
			v-model="dialogVisible"
			:width="width"
			@close="close"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div style="text-align: center">
				<div class="radioList" v-for="(item,index) in typeList" :key="index"><el-radio v-model="type" :label="item.value">{{ item.label }}</el-radio></div>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button type="default" @click="cancel" class="submitBtn" autofocus
						>取消</el-button
					>
					<el-button type="primary" :disabled="!type" @click="dialogHandOk" class="submitBtn"
						>确定</el-button
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
	onMounted
} from 'vue'
import {
	printed
} from '@/api/order/orderManagement.js'
import { useStore } from 'vuex'
import { confirm, debounce } from '../../../../../utils/tool'
import { ElMessageBox } from 'element-plus'

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
	setup(props, { emit }) {
		const formOptions = inject('formOptions')
		const orderTable = inject('orderTable')
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const data = reactive({
			type:null,
			typeList:[
				{
					label:'面单破损补打',
					value:1
				},
				{
					label:'面单生成异常补打',
					value:2
				},
				{
					label:'面单丢失补打',
					value:3
				}
			]
		})

		const dialogHandOk = debounce(() => {
			const param = { packageIds:props.data.packageIds, source: 0,printReason:data.type }
			printed(param).then(res=>{
				if(res.code === 200){
						if(props.data?.fromSourth){
							emit('emitBack', res.data)
							if (res.data.pdfUrl) {
								window.open(res.data.pdfUrl)
							}
						}else{
								orderTable.value.showDialog(
									'PrintInfo',
									'面单打印信息确认',
									'35%',
									res.data
								)
								if (res.data.pdfUrl) {
									window.open(res.data.pdfUrl)
								}

							}
				}
			})

		})

		const close = () => {
			if(props.data?.fromSourth){
				emit('emitBack', false)
			}else{
				proxy.$parent.dialogVisible = false
			}
		}
		const cancel = () => {
			if(props.data?.fromSourth){
				emit('emitBack', false)
			}else{
				proxy.$parent.dialogVisible = false
			}
		}
		onMounted(() => {})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close
		}
	}
}
</script>

<style lang="scss" scoped>
:deep(.container .el-message-box) {
	width: auto !important;
}
.el-message-box {
	width: auto !important;
}
.radioList{
	display: flex;
	align-items: center;
	padding-left: 30px;
}
</style>
