<template>
	<el-dialog title="商品备注" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="备注类型:" prop="remarkTypeId">
					<el-radio v-model="form.remarkTypeId" :label="item.value" v-for="(item, index) in remakeOptions" :key="index" @change="changeEvent">{{item.label}}</el-radio>
				</el-form-item>
				<el-form-item label="备注内容:" prop="content">
					<el-input type="textarea" placeholder="请输入备注" v-model="form.content" maxlength="500" rows="4" show-word-limit />
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
	import Hooks from '../../js/hooks.js'
	import { batchAddRemark } from '@/api/goods/quotedPrice.js'
	import { ElMessage } from 'element-plus';
	export default {
		props: {
			goodsIds: {
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
					remarkTypeId: null,
					content: '',
					goodsIds: props.goodsIds
				},
        loading: false
			})
			let rules = {
				remarkTypeId: { required: true, message: '请选择备注类型', trigger: 'blur' },
				content: { required: true, message: '请填写备注内容', trigger: 'blur' }
			}
			let formRef = ref(null)
			let hooks = Hooks(state)

			// 关闭弹框
			let closeEvent = (refresh = false) => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent', refresh)
				}, 500)
			}

			// 取消回调
			let cancelEvent = () => {
				closeEvent()
			}

      // 确认回调
			let affirmEvent = () => {
				formRef.value.validate((valid) => {
					if (valid) {
            state.loading = true
						batchAddRemark(state.form).then(res => {
              state.loading = false
							if (res.code == 200) {
								ElMessage.success({ message: '操作成功！', type: 'success' });
								closeEvent(true)
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
				hooks.getRemarkTypes()
			})

			return {
				...toRefs(state),
				rules,
				formRef,
				closeEvent,
				cancelEvent,
				affirmEvent,
				changeEvent,
				...hooks
			}
		}
	}
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
	margin-right: 16px;
}
</style>