<template>
	<div>
		<el-dialog v-model="dialogVisible" title="批量设置" width="500px" @close="handleClose">
			<el-form ref="dataScopeRef" label-width="0">
				<el-form-item>
					<el-select v-model="data.dataScope" placeholder="请选择数据范围"  style="width: 100%" clearable>
						<el-option v-for="item in scopeList" :key="item.dataScope" :label="item.dataScopeName" :value="item.dataScope">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="data.dataScope ==2">
					<el-select-tree class="my-select"  :treeProps="{value: 'deptId',  label: 'deptName',children: 'children'}" :data="deptData" checkStrictly @ok="data.deptIds= $event" :multiple="true" defaultExpandAll></el-select-tree>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="ok">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import { ref, reactive } from 'vue'
  import ElSelectTree from '@/components/elSelectTree/index.vue'
	export default {
		props: ['scopeList','deptData'],
		emits: ['close', 'batchSetting'],
    components: {ElSelectTree},
		setup(props, ctx) {
			let dialogVisible = ref(true)
			let data = reactive({
				dataScope: '',
				deptIds: []
			})
			function handleClose() {
        console.log(112);
				setTimeout(() => {
					ctx.emit('close')
				}, 300)
			}
			function ok() {
				ctx.emit('batchSetting', data)
        dialogVisible.value = false
			}
			return {
				handleClose,
				dialogVisible,
				data,
				ok
			}
		}
	}
</script>
<style lang="scss" scoped>
	.my-select {
		:deep(.el-select) {
			width: 100% !important;
		}
	}
</style>