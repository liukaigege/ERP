<template>
	<div class="warehosePartition">
		<!-- 头部 -->
		<div class="headName">
			<span>仓库名称:</span>
			<span style="margin-left:16px">
				<el-select v-model="form.warehouseId"  @change="changeStore" >
					<el-option  v-for="item in storeList" :key="item.id" :label="item.warehouseName" :value="item.id">万众智谷仓库</el-option>
				</el-select>
			</span>
		</div>
		<!-- 表格部分 -->
		<div class="pageTable">
			<el-table :data='data'>
				<el-table-column label="序号" type="index" align="center" width="100" />
				<el-table-column label="分区名称" prop="name" align="center" />
				<el-table-column label="货架/货架位数" align="center">
					<template #default="scope">
						<div>{{scope.row.shelfCount}}/{{scope.row.shelfGridCount}}</div>
					</template>
				</el-table-column>
				<el-table-column label="商品总数" prop="goodsCount" align="center" />
			</el-table>
		</div>
	</div>
</template>

<script>
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import {
		getWareHouse //仓库管理页面查询
	} from '@/api/store.js'
	import {
		getStoreArea //列表查询
	} from '@/api/store/warehouseSettings.js'
	import { ElMessage } from 'element-plus'
	export default {
		name: 'WarehousePartition',
		setup() {
			const state = reactive({
				form: {
					warehouseId: 1,
				},
				storeList: [],//获取仓库列表
				data: []
			})
			//获取仓库的接口
			getWareHouse({ page: { pageNo: 1, pageSize: 10 } }).then(res => {
				state.storeList = res.data.dataList
				state.form.warehouseId = state.storeList[0].id
			})
			//初始进去
			function init() {
				getStoreArea({ warehouseId: state.form.warehouseId }).then(res => {
					console.log(res);
                    state.data=res.data
				})
			}
			//仓库下拉查询
			function changeStore(val) {
                console.log(val);
				init()
			}
			onMounted(() => {
				init()
			})
			return {
				...toRefs(state),
				changeStore

			}
		}
	}
</script>

<style lang="scss" scoped>
.warehosePartition {
	.headName {
		background: #fff;
		padding: 24px 30px;
	}
	.pageTable {
		background: #fff;
		padding: 34px 22px;
		margin-top: 24px;
	}
}
</style>