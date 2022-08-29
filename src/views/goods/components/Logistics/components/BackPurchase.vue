<template>
	<el-dialog v-model="dialogVisible" title="打回采购" :width="500" @closed="handleClose">
		<el-form ref="formRef" :model="formData"  :rules="rules">
			<el-form-item label="原因" prop="reason">
				<el-input type="textarea" v-model="formData.reason" :rows="5" :maxlength="500" placeholder="请输入原因"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="ok">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script>
	import { reactive, toRefs, ref } from 'vue'
	import { rejectQuote,rejectQuoteBatch } from '@/api/goods/quotation.js'
	import { ElMessage } from 'element-plus'
	export default {
    props: {
      ids: Array,
      type: {
        default: 1,  //1 单个，2 批量
        type: Number
      }
    },
    emits: [''],
		setup(props,ctx) {
			let state = reactive({
				dialogVisible: true,
				formData: {
					reason: '',
					status: 3
				}
			})
			let formRef = ref(null)
			let rules = {
				reason: { required: true, message: '请输入原因', trigger: 'blur', }
			}
			function handleClose() {
        ctx.emit('close', false)
			}
			function ok() {
				formRef.value.validate(v => {
					if (v) {
            let obj = {}
            props.type == 1? obj.goodsId = props.ids[0] : obj.goodsIds = props.ids
            let api = {1:rejectQuote,2:rejectQuoteBatch}
						api[props.type](Object.assign(obj,state.formData)).then(_ => {
              ctx.emit('close', true)
							ElMessage({
								type: 'success',
								message: '打回成功'
							})
						})
					}
				})
			}
			return {
				...toRefs(state),
				handleClose,
				ok,
				rules,
				formRef
			}
		}
	}
</script>
