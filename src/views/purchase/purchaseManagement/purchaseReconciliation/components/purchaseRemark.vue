<template>
	<el-dialog title="采购备注" width="500px" v-model="dialogBatchCategory" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeRemark">
		<div class="headRemark">
			<el-form :model="form" :rules="rules" ref="formRef">
				<el-form-item label="备注类型:" prop="buttonStatus">
					<el-radio-group v-model="form.buttonStatus">
						<el-radio v-for="item in remarkButtonList" :key="item" :label="item.id">{{item.name}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item >
          <span style="color:#606266;margin-top:-40px;margin-right:10px">备注内容:</span>
					<el-input type="textarea" v-model="form.remarks" style="width:380px" show-word-limit maxlength="100" />
				</el-form-item>
			</el-form>
		</div>
		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeRemark">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>

			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
	import { ElMessage } from 'element-plus'
	import { getRemarkTypes, batchRemark, saveStayWarehousesRemark } from '../api/api'
	export default {
		props: {
			selectList: {
				type: Array,
				default: []
			},
			status: {
				type: Number
			}
		},
		emits: ['closeRemark'],
		setup(props, context) {
			const rules = {
				buttonStatus: [{ required: true, message: '请选择备注类型', trigger: 'blur' }]
			}
			const formRef = ref(null)
			const state = reactive({
				remarkButtonList: [],//备注
				dialogBatchCategory: true,
				form: {
					buttonStatus: '',
					remarks: ''
				}

			})


			//弹框关闭事件
			function closeRemark() {
				context.emit('closeRemark')
			}

			//回显接口
			onMounted(() => {
				let params;
				params = {
					useScope: props.status === 0 ? '5' : '4'
				}
				getRemarkTypes(params).then(res => {
					state.remarkButtonList = res.data
				})
			})

			//确定事件
			function submit() {
				formRef.value.validate().then(() => {
					if (props.status === 0) {
						let params = {
							orderIds: props.selectList.map(item => item.id),
							typeId: state.form.buttonStatus,
							content: state.form.remarks
						}
						saveStayWarehousesRemark(params).then(res => {//待入库备注-吴伟
							ElMessage.success('操作成功')
							context.emit('closeRemark', true)
						})
					} else {
						let params = {
							purchaseVerifyItemIds: props.selectList.map(item => item.id),
							remarkTypeId: state.form.buttonStatus,
							remark: state.form.remarks
						}
						batchRemark(params).then(res => {
							ElMessage.success('操作成功')
							context.emit('closeRemark', true)
						})
					}
				})
			}
			return {
				...toRefs(state),
				closeRemark,
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
	.bindingClass {
		padding: 16px 0 16px 10px;
		display: flex;
		align-items: center;
	}
	.catagoryClass {
		height: 300px;
		overflow: auto;
		padding-bottom: 24px;
		border: 1px solid #e7e7e7;
		.treeClass {
			padding: 0 24px 34px 24px;
		}
		.checkbxClass {
			:deep(.el-checkbox__label) {
				font-weight: 600;
			}
		}
	}
}
</style>