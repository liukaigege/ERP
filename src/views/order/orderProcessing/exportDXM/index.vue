<!--
 * @Descripttion:  导出店小蜜订单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-08-26 11:21:38
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 15:18:04
-->

<template>
	<div class="DXMcontainer">
		<div class="tab">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="待发货" name="0"></el-tab-pane>
				<el-tab-pane label="已发货" name="1"></el-tab-pane>
			</el-tabs>
		</div>

		<div class="form">
			<el-form :model="form" :inline="true" >
				<el-form-item label="导入时间：">
					<el-date-picker
						v-model="daterange"
						type="daterange"
						range-separator="→"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
						@change="changeDate"
					/>
				</el-form-item>

				<el-form-item label="搜索内容：">
					<div class="searchTxt">
						<el-select
							slot="prepend"
							v-model="form.searchContentTypeId"
							placeholder="请选择"
							clearable
						>
							<el-option
								v-for="item in searchTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
						<el-input
							v-model="form.searchContent"
							clearable
							placeholder="请输入要搜索的内容"
							class="input-with-select searchTxt"
						>
						</el-input>
					</div>
				</el-form-item>

				<el-form-item>
					<div class="btnL">
						<el-button type="primary" @click="init(1)"
							>查 询</el-button
						>
						<el-button @click="resert">重 置</el-button>
					</div>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="primary"  @click="deletes" v-if="activeName === '0'"
					>批量删除</el-button
				>
				<el-button type="primary"  @click="importFun"
					>导入店小秘订单</el-button
				>
			</div>
		</div>

		<div class="table">
			<el-table :data="tableData" @selection-change="selectChange">
				<el-table-column type="selection" width="55" v-if="activeName === '0'"> </el-table-column>
				<el-table-column align="center" prop="orderId" label="订单号">
					<template #default="scope">
						<el-tooltip placement="top">
							<template #content>
								<p
									style="cursor: pointer"
									v-copy="scope.row.orderId"
								>
									复制
								</p>
							</template>
							<div class="orderNum">{{ scope.row.orderId }}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="packageId" label="包裹号">
					<template #default="scope">
						<el-tooltip placement="top">
							<template #content>
								<p
									style="cursor: pointer"
									v-copy="scope.row.packageId"
								>
									复制
								</p>
							</template>
							<div class="orderNum">
								{{ scope.row.packageId }}
							</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					prop="logistics"
					label="物流方式"
				>
					<template #default="scope">
						<span> {{ scope.row.logistics }}</span>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					prop="trackNumber"
					label="运单号"
				>
					<template #default="scope">
						<el-tooltip placement="top">
							<template #content>
								<p
									style="cursor: pointer"
									v-copy="scope.row.trackNumber"
								>
									复制
								</p>
							</template>
							<div class="trackNumber">
								{{ scope.row.trackNumber }}
							</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					prop="goodsCount"
					label="发货商品件数"
				></el-table-column>
				<el-table-column
					align="center"
					prop="name"
					label="收件人"
				></el-table-column>
				<el-table-column
					align="center"
					prop="country"
					label="国家"
				></el-table-column>
				<el-table-column
					align="center"
					prop="ordersTime"
					label="下单时间"
				></el-table-column>
				<el-table-column
					align="center"
					prop="createTime"
					label="导入时间"
				></el-table-column>
			</el-table>
		</div>

		<div class="page">
			<div></div>
			<div>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="form.page.pageNo"
					:page-sizes="[10, 20, 30, 40, 100]"
					:page-size="form.page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div>
		</div>
		<importDXM :dialogVisible="dialogVisible" v-if="showImport" />
	</div>
</template>

<script>
import { reactive, toRefs, onMounted, computed, getCurrentInstance } from 'vue'
import { infoDXM, batchDel } from '@/api/order/orderProcessing.js'
import { useStore } from 'vuex'
import moment from 'moment'
import { resetForm } from '@/utils/tool.js'
import importDXM from '@/views/order/orderProcessing/exportDXM/components/importDXM.vue'
export default {
	name: 'ExportDXM',
	components: { importDXM },
	setup() {
		const store = useStore()
		const { proxy } = getCurrentInstance()

		const data = reactive({
			daterange: [
				moment().endOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			],
			activeName: '0',
			tableData: [],
			selectList: [],
			total: 0,
			showImport: false,
			dialogVisible: false,
			form: {
				status: 0,
				startDate: moment()
					.endOf('day')
					.subtract(7, 'days')
					.format('YYYY-MM-DD 00:00:00'),
				endDate: moment().format('YYYY-MM-DD 23:59:59'),
				searchContentTypeId: 0,
				searchContent: null,
				page: {
					pageNo: 1,
					pageSize: 10
				}
			},
			searchTypes: [
				{
					label: '订单号',
					value: 0
				},
				{
					label: '包裹号',
					value: 1
				},
				{
					label: '运单号',
					value: 2
				}
			]
		})
		const sideBarWidth = computed(() => store.state.menu.sideBarWidth)

		function handleClick(tab, event) {
			const { name } = tab.props
			console.log(name)
			data.form.status = Number(name)
			resert()
		}

		const changeDate = date => {
			if (date) {
				data.form.startDate = date[0] + ' 00:00:00'
				data.form.endDate = date[1] + ' 23:59:59'
			} else {
				data.form.startDate = data.form.endDate = null
			}
		} // 选择下单时间

		function resert() {
			data.daterange = [
				moment().endOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			]
			let start = moment()
				.endOf('day')
				.subtract(7, 'days')
				.format('YYYY-MM-DD 00:00:00')
			let end = moment().format('YYYY-MM-DD 23:59:59') // 结束时间
			const form = {
				startDate: start,
				endDate: end,
				status: Number(data.activeName),
				searchContentTypeId: 0,
				page: {
					pageSize: 10,
					pageNo: 1
				}
			}
			resetForm(data.form, form)
			init(1)
		}

		function importFun() {
			data.showImport = true
			setTimeout(() => {
				data.dialogVisible = true
			}, 500)
		}

		function init(pageNo) {
			const { form } = data
			if (pageNo) form.page.pageNo = pageNo
			infoDXM(form).then(res => {
				if (res.code == 200) {
					console.log(res.data)
					data.tableData = res.data.dataList || []
					data.total = res.data.page.totalCount
				}
			})
		}

		function selectChange(val) {
			data.selectList = val
		}

		function deletes() {
			if (data.selectList.length == 0) {
				proxy.$message.error('请勾选订单!')
				return
			}
				let arr = []
				data.selectList.forEach(item=>{
					  arr.push(item.id)
				})
			const param = {
				ids:arr.join(',') || null
			}
			proxy
				.$confirm('是否删除选中的订单?', '提示', {
					type: 'warning'
				})
				.then(_ => {
					batchDel(param)
						.then(res => {
							if (res.code == 200) {
								proxy.$message.success(res.message)
								init()
							}
						})

				})
		}

		const handleSizeChange = val => {
			data.form.page.pageSize = val
			init()
		}

		const handleCurrentChange = val => {
			init(val)
		}

		onMounted(() => {
			init()
		})

		return {
			...toRefs(data),
			handleClick,
			changeDate,
			init,
			resert,
			handleSizeChange,
			handleCurrentChange,
			sideBarWidth,
			importFun,
			selectChange,
			deletes
		}
	}
}
</script>

<style lang="scss" scoped>
.DXMcontainer {
	background: white;
	padding: 10px;
	position: relative;
	.page {
		position: fixed;
		bottom: 0;
		left: v-bind(sideBarWidth);
		width: calc(100% - v-bind(sideBarWidth));
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		z-index: 999;
		padding: 5px 10px;
		box-shadow: 10px 10px 5px #888888;
	}
	::v-deep(.el-pagination) {
		margin-top: 0 !important;
	}
}

.searchTxt {
	display: flex;
	align-items: center;
	.input-with-select {
		margin-left: 10px;
	}
}

.btnL {
	min-width: 160px;
}

.form {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}
.trackNumber {
	color: #409eff;
}
::v-deep(.el-date-editor .el-range-separator) {
	width: 6% !important;
}
</style>
