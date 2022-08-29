<template>
	<el-dialog title="采购备注" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="close">
		<div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="备注类型:" prop="typeId">
					<el-radio v-model="form.typeId" :label="item.id" v-for="(item, index) in remakeOptions" :key="index" @change="changeEvent">{{item.name}}</el-radio>
				</el-form-item>
				<el-form-item label="备注内容:" prop="content">
					<el-input type="textarea" placeholder="请输入备注" v-model="form.content" maxlength="100" rows="4" show-word-limit />
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	import Handle from '../composables/handle.js'
	import { saveRemark } from '@/api/purchase/purchase.js'
	import { ElMessage } from 'element-plus';
	export default {
		props: {
			purchaseId: {
				type: Array,
				default: []
			}
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
				remakeOptions: [],
				form: {
					typeId: null,
					content: '',
					orderIds: props.purchaseId
				},
        loading: false
			})
			let rules = {
				typeId: { required: true, message: '请选择备注类型', trigger: 'blur' },
			}
			let formRef = ref(null)
      let handle = Handle(state)

			// 关闭弹框
			let close = (refresh = false) => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent', refresh)
				}, 500)
			}

			// 取消回调
			let cancelEvent = () => {
				close()
			}

      // 确认回调
			let affirmEvent = () => {
        state.form.content = state.form.content.trim()
				formRef.value.validate((valid) => {
					if (valid) {
            state.loading = true
						saveRemark(state.form).then(res => {
              state.loading = false
							if (res.code == 200) {
								ElMessage.success({ message: '操作成功！', type: 'success' })
								close(true)
							} else {
								ElMessage.error(res.message)
							}
						}).catch(err => {
              state.loading = false
						
						})
					} else {
						ElMessage.error('信息填写错误，提交失败')
					}
				})
			}

			let changeEvent = () => {
				formRef.value.clearValidate('remarkTypeId')
			}

			onMounted(() => {
				handle.getRemarkTypes()
			})

			return {
				...toRefs(state),
				rules,
				formRef,
				close,
				cancelEvent,
				affirmEvent,
				changeEvent,
				...handle
			}
		}
	}
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
	margin-right: 16px;
}
</style>