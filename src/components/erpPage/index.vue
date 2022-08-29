<template>
	<erp-footer v-if="type==='fixed'">
		<div class="page-box" :class="{'has-count': count!=null}">
			<div v-show="count!=null" class="select-count">
				<span>已选 </span>
				<span style="color: rgb(24, 144, 255)">{{count}}</span>
				<span> 条</span>
			</div>
			<el-pagination :total="total" :current-page="pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</div>
	</erp-footer>
	<div class="page-box" v-else :class="{'has-count': count!=null}">
		<div v-show="count!=null" class="select-count">
			<span>已选 </span>
			<span style="color: rgb(24, 144, 255)">{{count}}</span>
			<span> 条</span>
		</div>
		<el-pagination :total="total" :current-page="pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
	</div>
</template>
<script>
	import erpFooter from '@/components/erpFooter/index.vue'
	import { reactive, toRefs } from 'vue-demi'
	export default {
		props: {
			type: {
				type: String,
				default: 'fixed'
			},
			pageSizes: {
				type: Array,
				default: [10, 20, 30, 40, 100]
			},
			count: {
				type: Number,
				default: null
			},
			total: {
				type: Number,
				default: 0
			},
		},
		components: { erpFooter },
		emits: ["update-data"],
		setup(props, ctx) {
			let state = reactive({
				pageSize: props.pageSizes[0],
				pageNo: 1
			})
			function handleSizeChange(v) {
				state.pageSize = v
				ctx.emit('update-data', state)
			}
			function handleCurrentChange(v) {
				state.pageNo = v
				ctx.emit('update-data', state)
			}
			function initPageNo(v = 1) {
				state.pageNo = v
			}
			function init() {
				state.pageNo = 1
				state.pageSize = props.pageSizes[0]
			}
			return {
				handleSizeChange,
				handleCurrentChange,
				initPageNo,
				...toRefs(state),
				init
			}
		}
	}
</script>
<style lang="scss" scoped>
	.page-box {
		padding: 12px 15px;
		text-align: right;
		.select-count {
			line-height: 28px;
		}
	}
	.has-count {
		display: flex;
		justify-content: space-between;
	}
</style>
