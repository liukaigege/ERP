<template>
	<div>
		<el-dialog
			title="设置权限"
			v-model="dialogVisible"
			width="30%"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
					<div class="activeF">
						<el-form :model="form" ref="formRef"  >
							<el-form-item label="查看范围：" prop="active">
								<el-select v-model="form.active" placeholder="">
									<el-option v-for="(item,index) in authTypeOptionsBK" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</div>


			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>

					<el-button type="primary"  @click="setPer"
						>确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { toRefs, reactive ,defineEmits} from 'vue'
import {authTypeOptionsBK } from '@/assets/js/staticData.js'
const emits = defineEmits(['cancel'])
const data = reactive({
	dialogVisible: true,
	form:{
		active:0
	},
})
const { dialogVisible,form } = toRefs(data)

function close() {
	emits('cancel')
}
function cancel(){
	data.dialogVisible = false
}

function setPer(){
	emits('ok',data.form.active)
}
</script>

<style scoped></style>
