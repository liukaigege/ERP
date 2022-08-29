<!--
 * @Descripttion: 打印面单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-21 09:48:03
-->

<template>
	<div class='container'>
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
				面单生成信息:(成功生成面单
				<span style="color: #1890ff">{{ successCount }}</span> 个, 失败<span
					style="color: red"
					>{{ errorCount }}</span
				>
				个)
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button
						type="danger"
						@click="parintFail"
						class="submitBtn"
						autofocus
						>打印失败</el-button
					>
					<el-button
						type="primary"
						@click="dialogHandOk"
						class="submitBtn"
						@click.enter="dialogHandOk"
						autofocus
						:disabled="!!!data.pdfUrl"
						>打印完成</el-button
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
	computed,
	inject,
	onMounted
} from 'vue'
import {
	printComplate,
	printComplateDeliverys
} from '@/api/order/orderManagement.js'
import { useStore } from 'vuex'
import { confirm,debounce ,printFail} from '../../../../../utils/tool'
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
	setup(props, context) {
		document.activeElement?.blur()
		const formOptions = inject('formOptions')
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const data = reactive({
			success: 0,
			error: 0,

		})
		const successCount = computed(() => props.data.successCount)
		const errorCount = computed(() => props.data.errorCount)
		const dialogHandOk = debounce(()=>{
			const { uuid } = props.data
			const { isChangeLogist } = store.getters
			if (isChangeLogist) {
				printComplateDeliverys({ uuid }).then(res => {
					if (res.code == 200) {
						formOptions.value.init()
						cancel()
					}
				})
				return
			} // 如果是已交运待打单则走这个
			printComplate({ uuid, source: 0 }).then(res => {
				if (res.code == 200) {
					formOptions.value.init()
					cancel()
				}
			})
		})

		const parintFail = () => {

			printFail(()=>cancel())

		}

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
		}
		onMounted(() => {
			let btn = document.querySelector('.submitBtn')
			setTimeout(() => {
				btn.focus()
			}, 500)
		})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			errorCount,
			successCount,
			parintFail
		}
	}
}
</script>

<style lang="scss" scoped>

:deep(.container .el-message-box){
	width: auto !important;
}
.el-message-box{
	width: auto !important;
}
</style>
