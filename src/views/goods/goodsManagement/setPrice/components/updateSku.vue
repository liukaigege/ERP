<template>
	<el-dialog title="更新SKU" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
        <i class="el-icon-warning"></i>
        <span class="text">确认更新勾选商品的SKU？</span>
				<el-form-item label="更新备注:" style="margin-top: 24px" prop="remark">
					<el-input type="textarea" placeholder="请输入备注内容" v-model="form.remark" maxlength="100" rows="4" show-word-limit />
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
	import { reactive, toRefs, ref } from 'vue'
  import { ElMessage } from 'element-plus'
	import { batchUpdateSku } from '@/api/goods/quotedPrice.js'
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
        form: {
          remark: '',
					goodsIds: props.goodsIds
        },
        loading: false
			})
			let rules = {
				remark: { required: true, message: '请输入备注内容', trigger: 'blur' }
			}
      let formRef = ref(null)

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
            batchUpdateSku(state.form).then(res => {
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

			return {
				...toRefs(state),
				rules,
        formRef,
				closeEvent,
				cancelEvent,
				affirmEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.el-icon-warning{
  font-size: 14px;
  color: #FAAD14;
  margin-right: 8px;
}
.text{
  font-size: 14px;
  color: rgba(0,0,0,.85);
}
</style>