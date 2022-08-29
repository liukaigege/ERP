<template>
	<div class="btn-box" v-if="list.length > 0">
		<el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
		<el-checkbox-group v-model="checkIds" @change="handleChange">
			<el-checkbox v-for="item in list" :key="item.menuId" :label="item.menuId">{{item.menuName}}</el-checkbox>
		</el-checkbox-group>
	</div>
</template>
<script>
	import { reactive, toRefs } from 'vue'
	export default {
		props: ['id', 'btnList', 'ids'],
		setup(props, ctx) {
			let state = reactive({
				isCheckAll: false,
				checkIds: [],
				list: []
			})
			function getscopeData(ids) {
				let scopeData = state.list.filter(item => item.dsFlag == 1).map(item => ({
					parentId: item.parentId,
					menuName: item.menuName,
					menuId: item.menuId,
					checked: ids.includes(item.menuId)
				}))
				if (scopeData.length > 0) ctx.emit('setScope', scopeData)
			}
			function handleChange(ids) {
				state.isCheckAll = ids.length == state.list.length
				ctx.emit('getBtnIds', {
					parentId: props.id,
					type: 'btn',
					ids
				})
				getscopeData(ids)
			}
			function checkAll(v) {
				if (v) {
					state.checkIds = state.list.map(item => item.menuId)
				} else {
					state.checkIds = []
				}
				ctx.emit('getBtnIds', {
					parentId: props.id,
					type: 'btn',
					ids: state.checkIds
				})
				getscopeData(state.checkIds)
			}
			state.list = props.btnList.filter(item => item.parentId == props.id)
			if (props.ids?.length > 0) { //ids 是全量包括了菜单的id，所以编辑时这里不一定回显
				state.list.forEach(item => {
					if (props.ids?.includes(item.menuId)) state.checkIds.push(item.menuId)
				})
				state.isCheckAll = state.checkIds.length == state.list.length
				if (state.checkIds.length > 0) {  // 回显时，告诉父级 选中的id，以便提交时正确
					ctx.emit('getBtnIds', {
						parentId: props.id,
						type: 'btn',
						ids: state.checkIds
					})
					getscopeData(state.checkIds)
				}
			}
			return {
				...toRefs(state),
				handleChange,
				checkAll
			}
		}
	}
</script>
<style lang="scss" scoped>
	.btn-box {
		padding: 8px 25px;
		background-color: #fafafa;
		margin: 15px 0;
		max-width: 400px;
		overflow: auto;
		transition: 1s max-height;
		:deep(.el-checkbox-group) {
			white-space: normal;
		}
		:deep(.el-checkbox) {
			height: 30px !important;
		}
	}
</style>
