<template>
	<el-dialog title="修改分配上限" width="500px" v-model="dialogLimit" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeUpdateLimit">
		<div class="headLimitClass">
			<el-form :rules="rules" :model="form" :inline="true" :label-width="130" ref="formRef">
				<!-- SKU分配上限： -->
				<el-form-item label="SKU分配上限：" prop="skuLimit" >
					<el-input placeholder="仅支持正整数" :maxlength="3" v-model="form.skuLimit" style="width:300px"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeUpdateLimit">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { assignTool } from 'tool'
	import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
	import {
		batchUpdateSkuCount, //新增【批量修改分配上限
	} from '@/api/store/warehouseSettings.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			shelfSpaceData: {
				type: Array,
				default:[]
			},
		},
		emits: ['closeUpdateLimit'],
		setup(props, context) {
			const formRef = ref(null)
			const rules = {
				skuLimit: [
					{ required: true, message: 'SKU分配上限不能为空', trigger: 'blur' },
					{ pattern: /^[1-9]\d{0,3}$/, message: 'SKU分配上限格式不正确', trigger: 'blur' }
				],
			}
			const state = reactive({
				dialogLimit: true,
				form: {
					skuLimit: '',
				},
			})
			//弹框关闭事件
			function closeUpdateLimit() {
				context.emit('closeUpdateLimit', false)
			}
			//确定事件
			function submit() {
			formRef.value.validate().then(()=>{
        let params;
        params = {
          ids:props.shelfSpaceData.map(item =>item.id),
          count:state.form.skuLimit
        }
        batchUpdateSkuCount(params).then(res =>{
          ElMessage.success('修改成功')
          setTimeout(() => {
            context.emit('closeUpdateLimit', true)
          }, 500);
        })
      })
			
			}
			// 分页
		
			return {
				...toRefs(state),
				closeUpdateLimit,
				rules,
				formRef,
				submit,
			
			}
		}
	}
</script>

<style lang="scss" scoped>
.headLimitClass {
  padding:50px 0;
	:deep(.el-input__inner) {
		height: 32px;
		// padding: 11px;
	}
}
</style>