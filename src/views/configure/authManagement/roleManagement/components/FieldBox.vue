<template>
	<div v-if="1">
		<div class="parent-title">{{scopeItem.parentTitle}}</div>
		<div class="child-title">
			<span>{{scopeItem.title}}</span>
		</div>
		<div class="field-box">
			<el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
			<el-checkbox-group v-model="checkIds" @change="handleChange">
				<el-checkbox v-for="item in scopeItem.list" :key="item.menuId" :label="item.menuId">{{item.menuName}}</el-checkbox>
			</el-checkbox-group>
		</div>
	</div>
</template>

<script>
	import { reactive, toRefs } from 'vue'
	export default {
		props: ['scopeItem', 'ids', 'id'],
		setup(props, ctx) {
			let state = reactive({
				isCheckAll: false,
				checkIds: []
			})
			if (props.ids?.length > 0) { //ids 是全量包括了菜单的id，所以编辑时这里不一定回显 
				props.scopeItem.list.forEach(item => {
					if (props.ids?.includes(item.menuId)) state.checkIds.push(item.menuId)
				})
				state.isCheckAll = state.checkIds.length == props.scopeItem.list.length
				if (state.checkIds.length > 0) {  // 回显时，告诉父级 选中的id，以便提交时正确
					ctx.emit('getBtnIds', {
						parentId: props.id,
						type: 'field',
						ids: state.checkIds
					})
				}
			}
			function handleChange(v) {
				state.isCheckAll = v.length == props.scopeItem.list.length
				ctx.emit('getBtnIds', {
					parentId: props.id,
					type: 'field',
					ids: v
				})

			}
			function checkAll(v) {
				if (v) {
					state.checkIds = props.scopeItem.list.map(item => item.menuId)
				} else {
					state.checkIds = []
				}
				ctx.emit('getBtnIds', {
					parentId: props.id,
					type: 'field',
					ids: state.checkIds
				})
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
	.parent-title {
		color: rgba(0, 0, 0, 0.65);
		font-size: 16px;
		margin-bottom: 15px;
	}
	.child-title {
		color: rgba(0, 0, 0, 0.65);
		font-size: 14px;
		margin-bottom: 15px;
	}
	.field-box {
		padding: 12px 25px;
		background-color: #fafafa;
		margin-bottom: 15px;
		transition: 1s max-height;
		:deep(.el-checkbox) {
			height: 30px !important;
		}
	}
</style>