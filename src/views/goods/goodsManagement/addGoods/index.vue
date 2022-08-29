<template>
	<div>
		<div class="addGoods" v-if="!showInfo">
			<div class="importBox">
				<div class="headTab">
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane
							class="tabItem"
							label="平台采集"
							name="first"
						></el-tab-pane>
						<el-tab-pane
							class="tabItem"
							label="独立站采集"
							name="second"
						></el-tab-pane>
						<el-tab-pane
							class="tabItem"
							label="手动添加"
							name="third"
						></el-tab-pane>
						<el-tab-pane
							class="tabItem"
							label="表格导入"
							name="fourth"
						></el-tab-pane>
					</el-tabs>
				</div>
				<Collection :type="activeName" @refersh="handleCurrentChange(1)" />
				<div class="form">
					<el-form :model="form" :inline="true" >
						<el-form-item label="搜索内容：" prop="type">
							<div class="searchTxt">
								<el-select
									slot="prepend"
									v-model="form.type"
									placeholder="请选择"
									clearable
								>
									<el-option label="商品名称" :value="1"></el-option>
									<el-option label="采集链接" :value="2"></el-option>
								</el-select>
								<el-input
									v-model="form.keyword"
									clearable
									placeholder="请输入要检索的内容"
									class="input-with-select searchTxt"
								>
								</el-input>
							</div>
						</el-form-item>

						<el-form-item label="创建时间：" prop="daterange">
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

						<el-form-item label="来源平台：" prop="sourceModel">
							<!-- <el-select v-model="form.source" placeholder=""> </el-select> -->
							<el-cascader
								v-model="form.sourceModel"
								:options="sourceData"
								:props="{ multiple: false, checkStrictly: true }"
								clearable
								@change="changeSource"
								style="width: 200px"
							></el-cascader>
						</el-form-item>

						<el-form-item label="商品类型：" prop="enableCustom">
							<el-select v-model="form.enableCustom" placeholder="" clearable>
								<el-option label="普通商品" :value="0"></el-option>
								<el-option label="定制商品" :value="1"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="品类：" prop="categoryId">
							<!-- <el-select v-model="form.source" placeholder=""> -->

							<el-cascader
								v-model="form.categoryId"
								:options="categoryList"
								:props="categoryProps"
								:show-all-levels="false"
								style="width: 140px"
								clearable
							></el-cascader>

							<!-- </el-select> -->
						</el-form-item>

						<el-form-item label="状态：" prop="goodsStatus">
							<el-cascader
								v-model="form.goodsStatus"
								:options="goodsStatusInfo"
								:props="{ checkStrictly: true }"
								clearable
								@change="changeStatus"
								style="width: 140px"
							></el-cascader>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="search">查 询</el-button>
							<el-button type="default" @click="resert">重 置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tableBtn">
				<el-button type="primary"  @click="setCategory"
					>设置品类</el-button
				>
				<el-button type="primary"  @click="activationAll"
					>激活</el-button
				>
<!--									<el-button type="primary"  @click="copyGoods">复制商品</el-button>-->
				<el-button type="primary"  @click="delAll"
					>批量删除</el-button
				>
			</div>
			<div class="table">
				<AddTable
					ref="tables"
					v-model="tableData"
					@sort-change="sortChange"
					@edit="edit"
					@del="del"
					@activation="activation"
					@setCategory="setCategorySingle"
					@refresh="search"
				/>
			</div>
		</div>
		<div class="flex-pagination page-fixed" v-if="!showInfo">
			<div>
				<!--				<el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll">已选{{selections.length}}条</el-checkbox>-->
				已选{{ selections.length }}条
			</div>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pagination.currentPage"
				:page-sizes="pagination.pageSizes"
				:page-size="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pagination.totalCount"
			>
			</el-pagination>
		</div>

		<GoodsInfo
			v-if="showInfo"
			:editGoodsId="editGoodsId"
			:goTab="goTab"
			@cancel="cancelInfo"
		/>
		<ImportGoods
			:dialogVisible="dialogVisible"
			v-if="dialogVisible"
			@cancel="cancelInfo"
		/>
		<ActiveDilaog
			:dialogVisible="ActiveDilaogShow"
			v-if="ActiveDilaogShow"
			:query="activeQuery"
			@matching="matching"
			@cancel="
				() => {
					ActiveDilaogShow = false
					search()
				}
			"
		/>

		<CategoryDilago
			:dialogVisible="showCategory"
			v-if="showCategory"
			:query="{ categoryList, goodsIds }"
			@cancel="cancelInfo"
		/>
	</div>
</template>

<script>
import {
	onMounted,
	reactive,
	toRefs,
	nextTick,
	ref,
	getCurrentInstance,
	onActivated,
	computed
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Index from './hooks/index.js'
import {
	sourceData,
	goodsStatus as goodsStatusInfo
} from '@/assets/js/staticData.js'
import { resetForm } from '@/utils/tool.js'
import Collection from '@/views/goods/goodsManagement/addGoods/components/collection.vue'
import AddTable from '@/views/goods/goodsManagement/addGoods/components/addTable.vue'
import GoodsInfo from '@/views/goods/goodsManagement/addGoods/goodsInfo/index.vue'
import ImportGoods from '@/views/goods/goodsManagement/addGoods/components/importGoods.vue'
import ActiveDilaog from '@/views/goods/goodsManagement/addGoods/components/activeDilago.vue'
import CategoryDilago from '@/views/goods/goodsManagement/addGoods/components/categoryDilago.vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { list, remove, activate, activates } from '@/api/goods/addGoods.js'
import { getCategoryTree } from '@/api/goods/quotation.js'
import { deepCopy } from '@/utils/tool.js'
import moment from 'moment'

import { erpElTable } from 'hooks'
export default {
	name: 'addGoods',
	components: {
		Collection,
		AddTable,
		GoodsInfo,
		ImportGoods,
		ActiveDilaog,
		CategoryDilago,
		ElSelectTree
	},
	setup() {
		const { proxy } = getCurrentInstance()
		const router = useRouter()
		const route = useRoute()
		const data = reactive({
			categoryProps: {
				value: 'id',
				label: 'name',
				children: 'child',
				emitPath: false
			},
			selectedAll: false, // 是否全选
			goTab: null,
			showInfo: false,
			activeName: 'first',
			oldActiveName: 'first',
			goodsStatus: null,
			daterange: [
				moment().endOf('day').subtract(119, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			],
			form: {
				type: 1,
				keyword: null,
				mode: null,
				activationFailed: null,
				start: moment()
					.endOf('day')
					.subtract(119, 'days')
					.format('YYYY-MM-DD 00:00:00'),
				//开始时间
				end: moment().format('YYYY-MM-DD 23:59:59'), // 结束时间
				source: null,
				enableCustom: null,
				categoryId: null,
				status: null,
				sortName: 'g.create_time', // 创建时间排序
				sortType: 'desc', // 正序  倒叙
				goodsStatus: null,
				sourceModel: null
			},
			sourceList: [],
			dialogVisible: false,
			ActiveDilaogShow: false, // 单条激活
			editGoodsId: null,
			activeQuery: null, // 激活弹窗参数
			showCategory: false,
			goodsIds: null,
			categoryList: [],

			treeProps: {
				value: 'id',
				label: 'name',
				children: 'child'
			}
		})
		const tables = ref(null)
		const { changeDate, confirm } = Index(data)
		const {
			tableData,
			search,
			pagination,
			handleSizeChange,
			handleCurrentChange
		} = erpElTable(list, data.form, {
			pagination: {
				pageSizes: [10, 20, 30, 40, 100],
				pageSize: 10
			}
		})

		const selections = computed(() => {
			if (tables?.value?.selected) return tables.value.selected || []
			return []
		})

		function matching(val) {
			data.editGoodsId = val
			data.showInfo = true
			data.goTab = '2'
		} // 去匹配

		function handleClick(val) {
			if (data.activeName == 'fourth') {
				data.dialogVisible = true
			}
			if (data.activeName == 'third') {
				data.showInfo = true
			}
			if (data.activeName == 'third' || data.activeName == 'fourth') {
				setTimeout(() => {
					console.log(data.oldActiveName)
					data.activeName = data.oldActiveName
				}, 100)
			}
			setTimeout(() => {
				data.oldActiveName = data.activeName
			}, 150)
		}

		function cancelInfo(val) {
			if (val) {
				search()
			}
			data.editGoodsId = null
			data.showInfo = false
			data.dialogVisible = false
		}

		function changeStatus(value) {
			console.log(value)
			if (value) {
				data.form.status = value[0]
				value[1]
					? (data.form.activationFailed = value[1])
					: (data.form.activationFailed = null)
			} else {
				data.form.status = null
				data.form.activationFailed = null
			}
		}

		function getList() {
			const parma = {
				type: null,
				keyword: null,
				start: null,
				end: null,
				source: null,
				enableCustom: null,
				categoryId: null,
				status: null,
				page: {
					pageNo: 1,
					pageSize: 10
				}
			}
			list(parma).then(res => {
				nextTick(() => {
					data.tableList = res.data.dataList
				})
			})
		}

		function changeSource(value) {
			if (value) {
				data.form.mode = value[0]
				value[1] ? (data.form.source = value[1]) : (data.form.source = null)
			} else {
				data.form.mode = null
				data.form.source = null
			}
		}

		function edit(val) {
			const { row, index } = val
			data.editGoodsId = row.goodsId
			data.showInfo = true
			document.documentElement.scrollTop = 0
		}

		function del(val) {
			const { row, index } = val
			const { goodsId } = row
			delGoods(goodsId)
		} // 单条删除

		function delAll() {
			const list = tables.value.selected
			if (list.length == 0) {
				proxy.$message.error('请勾选商品!')
				return
			}
			confirm('商品删除后将不可恢复，确认删除？', () => {
				let goodsIds = []
				list.forEach(item => {
					goodsIds.push(item.goodsId)
				})
				delGoods(goodsIds.join(','))
			})
		} // 批量删除

		function delGoods(goodsIds) {
			remove({ goodsIds }).then(res => {
				if (res.code == 200) {
					search()
					proxy.$message.success('删除成功')
				}
			})
		}

		function setCategory() {
			const list = tables.value.selected
			if (list.length == 0) {
				proxy.$message.error('请勾选商品!')
				return
			}
			let goodsIds = []
			list.forEach(item => {
				goodsIds.push(item.goodsId)
			})
			data.goodsIds = goodsIds.join(',')
			data.showCategory = true
		} // 批量设置品类

		function setCategorySingle(val) {
			data.goodsIds = String(val.row.goodsId)
			data.showCategory = true
		} // 单条设置品类

		function activation(val) {
			const { goodsId } = val.row
			activate({ goodsId }).then(res => {
				if (res.code == 200) {
					if (res.data.isSuccess == 0) {
						let activeQuery = null
						const {
							checkType,
							other,
							repeat,
							similarGoodsVO,
							tortVO,
							msgVOList
						} = res.data.failMsg
						let d = {
							1: repeat,
							2: msgVOList,
							3: similarGoodsVO,
							4: tortVO
						}
						if (checkType == 0) {
							proxy.$message.error(other.message)
							search()
							return
						}
						activeQuery = {
							checkType,
							query: d[String(checkType)],
							goodsId,
							status: 'fail'
						}
						data.activeQuery = activeQuery
						data.ActiveDilaogShow = true
						// 激活失败
					} else {
						data.activeQuery = { checkType: 3, goodsId, status: 'success' }
						data.ActiveDilaogShow = true
					}
				}
			})
		} // 单条激活

		function activationAll() {
			const list = tables.value.selected.filter(item => item.categoryStr)
			let arr = list.map(item => {
				return item.categoryId
			})
			console.log(arr, '过滤后的arr')

			if (list.length == 0) {
				proxy.$message.error('请勾选商品!')
				return
			}
			let goodsIds = []
			list.forEach(item => {
				goodsIds.push(item.goodsId)
			})
			router.push({
				name: 'activation',
				query: { goodsIds: goodsIds.join(',') }
			})

			// activates({ goodsIds: goodsIds.join(",") }).then((res) => {
			//   console.log(res);
			//   if (res.code == 200) {
			//     console.log(JSON.stringify(res.data))
			//   }
			// });
		} // 批量激活

		function getCateList() {
			getCategoryTree().then(res => {
				data.categoryList = res.data
			})
		}

		function selectAll() {} // 全选

		function resert() {
			let start = moment()
				.endOf('day')
				.subtract(119, 'days')
				.format('YYYY-MM-DD 00:00:00')
			//开始时间
			let end = moment().format('YYYY-MM-DD 23:59:59') // 结束时间

			let form = {
				start,
				end,
				sortName: 'g.create_time', // 创建时间排序
				sortType: 'desc' // 正序  倒叙
			}
			data.daterange = [
				moment().endOf('day').subtract(119, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			]
			resetForm(data.form, form)
			data.sourceModel = null
			handleCurrentChange(1)
		} // 重置

		function treeChecked(val) {
			data.form.categoryId = val
		}
		function sortChange(v) {
			data.form.sortType = v
			search()
		}
		onActivated(() => {
			search()
		})

		onMounted(() => {
			getCateList()
		})

		return {
			...toRefs(data),
			handleClick,
			changeDate,
			cancelInfo,
			tables,
			tableData,
			search,
			pagination,
			handleSizeChange,
			handleCurrentChange,
			edit,
			del,
			delAll,
			activation,
			treeChecked,
			setCategory,
			setCategorySingle,
			activationAll,
			sourceData,
			goodsStatusInfo,
			changeSource,
			resert,
			sortChange,
			matching,
			changeStatus,
			selections,
			selectAll
		}
	}
}
</script>

<style lang="scss" scoped>
.importBox {
	background: white;
	padding: 10px 20px;
}
.headTab {
	:deep(.el-tabs__item) {
		padding-right: 80px !important;
	}
}

.searchTxt {
	display: flex;
	align-items: center;
	.input-with-select {
		margin-left: 10px;
	}
}
.table {
	margin: 20px 0;
	padding: 10px;
	background: white;
}

:deep(.el-date-editor .el-range-separator) {
	width: 6% !important;
}
.tableBtn {
	margin: 20px 0;
}
</style>
