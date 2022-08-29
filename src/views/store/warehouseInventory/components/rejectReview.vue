<template>
	<el-dialog title="驳回审核" width="500px" v-model="dialogBatchCategory" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeReject">
		<div class="headRemark">
			<el-form :model="form" :rules="rules" ref="formRef">
				<el-form-item label="驳回原因:" prop="reason">
					<el-input type="textarea" v-model="form.reason" style="width:380px" show-word-limit maxlength="150" />
				</el-form-item>

			</el-form>
		</div>
		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeReject">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>

			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
	import { ElMessage } from 'element-plus'
	import {
		getCountingOperation,//盘点基本操作
	} from '../composables/api'
	import router from '../../../../router'
	import { useRouter } from 'vue-router'
	export default {
		props: {
			selectList: {
				type: Array,
				default: []
			},
			row: {
				type: Object
			},
			inventoryCheckNumber: {
				type: String
			}
		},
		emits: ['closeReject'],
		setup(props, context) {
			const router = useRouter()
			const rules = {
				reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
			}
			const formRef = ref(null)
			const state = reactive({
				remarkButtonList: [],//备注
				dialogBatchCategory: true,
				form: {
					reason: '',
				}

			})
			//弹框关闭事件
			function closeReject() {
				context.emit('closeReject')
			}

			//回显接口
			onMounted(() => {
			})
			//确定事件
			function submit() {
				formRef.value.validate().then(() => {
					console.log(props.inventoryCheckNumber, 'inventoryCheckNumber');
					let params = {
						type: 4,
						inventoryCheckNumber: props.inventoryCheckNumber ? props.inventoryCheckNumber : props.row.inventoryCheckNumber,
						reason: state.form.reason
					}
					getCountingOperation(params).then(res => {
						if (props.inventoryCheckNumber) {
							ElMessage.success('操作成功')
							context.emit('closeReject', true)
							router.push({
								name: 'WarehouseInventory'
							})
						} else {
							ElMessage.success('操作成功')
							context.emit('closeReject', true)
						}

					})
				})
			}
			return {
				...toRefs(state),
				closeReject,
				submit,
				rules,
				formRef
			}
		}
	}
</script>

<style lang="scss" scoped>
.headRemark {
	:deep(.el-input__inner) {
		height: 32px;
		// padding: 11px;
	}
}
</style>