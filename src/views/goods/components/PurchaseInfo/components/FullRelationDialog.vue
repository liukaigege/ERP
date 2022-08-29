<template>
	<el-dialog v-model="show" width="1200px" @close="closeDialog(true)">
		<template #title>
			<div class="title-wrap">
				<div class="title-real">关联商品信息</div>
				<div v-if="activeStep === 1 && type === 1">
					<span class="color-info mr-10">商品库没有符合的商品可新建商品报价完成后再绑定</span>
					<el-button type="primary" @click="goAddGoods">新增商品</el-button>
				</div>
			</div>
		</template>
		<div style="margin: -30px 0 10px 0" v-if="activeStep === 2">
			<el-button type="primary" @click="batchRelation">批量关联</el-button>
		</div>
		<el-radio-group v-model="type" v-if="activeStep === 1">
			<!-- <el-radio :label="2">关联组合品变体</el-radio> -->
			<el-radio :label="1">关联商品库商品</el-radio>
		</el-radio-group>
		<el-form :model="filterForm" inline v-if="activeStep === 1">
			<el-form-item label="搜索内容:" >
				<el-select v-model="filterForm.searchType" placeholder="请选择" style="width:100px;">
					<el-option
						v-for="item in [{label:'商品名',value:1},{label:'商品编码',value:2},{label:'商品SKU',value:3},{label:'SKU ID',value:4}]"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input clearable v-model="filterForm.searchContent" :placeholder="`请输入要检索的内容${filterForm.searchType==1?'':'多条可用逗号或空格隔开'}`" style="width:400px;"></el-input>
			</el-form-item>
			<el-form-item label="品类">
				<el-cascader :options="categoryIdOptions" clearable :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'child' }" v-model="filterForm.preCategory" @change="changeCategory" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">查询</el-button>
			</el-form-item>
		</el-form>
		<div v-if="activeStep === 1">
			<!-- 关联商品库商品 -->
			<div class="full-relation-container flex-div" v-show="type === 1">
				<div class="same-table-width">
					<el-table border :data="tableData" max-height="450px" >
						<el-table-column label="商品信息">
							<template #default="{ row }">
								<div class="goods-info">
									<el-popover v-if="row.mainImageUrl" placement="right-start" trigger="hover" width="auto">
										<el-image style="width: 200px; height: 200px" :src="row.mainImageUrl" fit="contain"></el-image>
										<template #reference>
											<el-image class="ml-10" style="width: 70px; height: 70px" :src="row.mainImageUrl" fit="contain"></el-image>
										</template>
									</el-popover>
									<div class="info-content">
										<el-tooltip effect="dark" :content="row.nameCn || row.nameEn">
											<div class="textOverflow">{{row.nameCn || row.nameEn}}</div>
										</el-tooltip>
										<div>{{ row.id }}</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" align="center">
							<template #default="{ row }">
								<el-button v-if="!row.select" @click="addGoods(row.id)" type="text">选择</el-button>
								<el-button v-if="row.select === 1" type="text" disabled>已选择</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination class="mt-10" small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
					</el-pagination>
				</div>
				<div class="same-table-width">
					<el-form inline>
						<el-form-item label="已选择商品"></el-form-item>
					</el-form>
					<el-table border empty-text="请从左边选择商品" :data="selectedGoods" max-height="450px">
						<el-table-column label="商品信息">
							<template #default="{ row }">
								<div class="goods-info">
									<el-popover v-if="row.mainImageUrl" placement="right-start" trigger="hover" width="auto">
										<el-image style="width: 200px; height: 200px" :src="row.mainImageUrl" fit="contain"></el-image>
										<template #reference>
											<el-image class="ml-10" style="width: 70px; height: 70px" :src="row.mainImageUrl" fit="contain"></el-image>
										</template>
									</el-popover>
									<div class="info-content">
										<el-tooltip effect="dark" :content="row.nameCn || row.nameEn">
											<div class="textOverflow">{{row.nameCn || row.nameEn}}</div>
										</el-tooltip>
										<div>{{ row.id }}</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" align="center">
							<template #default="{ row }">
								<el-button @click="removeGoods(row.relationId)" type="text">移除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<!-- 关联组合品变体 -->
			<div class="full-relation-container" v-show="type === 2">
				<el-table border :data="copySkus" max-height="450px">
					<el-table-column align="center" width="60">
						<template #default="{ row }">
							<el-checkbox v-model="row.checked" @change="changeCopySkuChecked(row)"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="图片" width="120" align="center">
						<template #default="{ row }">
							<div class="goods-info">
								<el-popover v-if="row.url" placement="right-start" trigger="hover" width="auto">
									<el-image style="width: 200px; height: 200px" :src="row.url" fit="contain"></el-image>
									<template #reference>
										<el-image class="ml-10" style="width: 70px; height: 70px" :src="row.url" fit="contain"></el-image>
									</template>
								</el-popover>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="规格值" align="center" prop="speLabel"></el-table-column>
				</el-table>
			</div>
		</div>
		<div class="full-relation-container" v-if="activeStep === 2">
			<vxe-table class="mt-10" max-height="450px" :scroll-y="{enabled: false}" align="center" border :data="skus" ref="tableRef" >
        <vxe-column type="checkbox" width="60"></vxe-column>
				<vxe-column field="skuId" title="商品SKU" width="260">
					<template #default="{ row }">
						<div style="text-align: left">
							<div>{{row.skuId}}</div>
							<div>{{row.sku}}</div>
						</div>
					</template>
				</vxe-column>
				<vxe-column field="speLabel" title="规格值"></vxe-column>
				<vxe-column title="SKU开关">
					<template #default="{ row }">
						<span>{{ row.skuSwitch === 1 ? '开启' : '关闭' }}</span>
					</template>
				</vxe-column>
				<vxe-column field="weight" title="重量（g）"></vxe-column>
				<vxe-colgroup title="商品体积">
					<vxe-column field="length" title="长（cm）"></vxe-column>
					<vxe-column field="width" title="宽（cm）"></vxe-column>
					<vxe-column field="height" title="高（cm）"></vxe-column>
				</vxe-colgroup>
				<vxe-column field="price" title="默认采购价（CNY）"></vxe-column>
				<vxe-column title="已关联商品" width="200px">
					<template #default="{ row }">
						<el-popover placement="left" width="auto" trigger="hover">
							<template #reference>
								<div>
									<div :class="idx > 0 ? 'mt-5 textOverflow' : 'textOverflow'" v-for="(str, idx) in row.combinationLabels" :key="idx">{{str}}</div>
								</div>
							</template>
							<div :class="idx > 0 ? 'mt-5' : ''" v-for="(str, idx) in row.combinationLabels" :key="idx">{{str}}</div>
						</el-popover>
					</template>
				</vxe-column>
				<vxe-column title="组合商品">
					<template #default="{ row }">
						<el-button type="text" @click="showRelations([row], 'add')">{{row.goodsSkuCombinationRelation && row.goodsSkuCombinationRelation.length ? '修改' : '关联'}}</el-button>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
		<template #footer>
			<div class="justify-end-div">
				<el-button :disabled="(type === 1 && !selectedGoods.length) || (type === 2 && !selectedCopySkus.length)" type="primary" @click="changeActiveStep">
					{{activeStep === 1 ? '下一步' : '上一步'}}
				</el-button>
				<el-button v-if="activeStep === 2" type="primary" @click="completeRelation">完成关联</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
	import { reactive, toRefs, ref } from 'vue'
	import { useRouter } from 'vue-router'
	import { combinationSinglePage, getCategoryTree, updateRelations } from '@/api/goods/quotation.js'
	import { deepCopy } from 'tool'
	import { ElMessage } from 'element-plus'

	export default {
		props: ['skus', 'specialInfo', 'form'],
		emits: ['showRelations', 'close'],
		setup(props, ctx) {
			const router = useRouter()
			const state = reactive({
				show: true,
				// 选中的商品库商品
				selectedGoods: [],
				// 选中的组合品变体数据
				selectedCopySkus: [],
				// 商品库查询表单
				filterForm: {
					goodsId: props.form.goodsId,
					keyword: null,
					categoryId: null,
					preCategory: [],
					searchType:1,
					searchContent:null
				},
				// 商品库商品列表分页
				pagination: {
					currentPage: 1,
					nextPage: 1,
					offset: 0,
					pageSize: 10,
					prePage: 1,
					totalCount: 0,
					totalPage: 0,
					pageSizes: [10, 20, 30, 40, 100]
				},
				// 商品库列表数据
				tableData: null,
				// 组合品变体数据
				copySkus: deepCopy(props.skus),
				// 品类查询下拉数据
				categoryIdOptions: [],
				activeStep: 1,
				// 是否是初始化加载
				isInit: true,
				type: 1, // 1 关联商品库商品 2 关联组合品变体
			})

			// 处理一下 type 默认值
			// sku的关联商品数据里如果满足某一个是自己关联自己则是关联组合品变体 未关联的数据，默认显示
			// state.type = state.copySkus.some(sku => !sku.goodsSkuCombinationRelation || sku.goodsSkuCombinationRelation.some(g => g.mainId === g.childId)) ? 2 : 1
			// 处理 copySkus 的 checked
			state.copySkus.forEach(sku => {
				sku.checked = !!(sku.goodsSkuCombinationRelation && sku.goodsSkuCombinationRelation.some(s => s.mainId === s.childId))
				if (sku.checked) {
					state.selectedCopySkus.push(sku)
				}
			})

			function search() {
				const params = Object.assign({
					page: {
						pageNo: state.pagination.currentPage,
						pageSize: state.pagination.pageSize
					}
				}, state.filterForm)

				combinationSinglePage(params).then(r => {
					state.tableData = r.data.commonPager.dataList
					if (state.isInit && r.data.goodsCombinationVOList && r.data.goodsCombinationVOList.length) {
						const arr = r.data.goodsCombinationVOList
						arr.forEach(a => {
							a.id = a.relationId
							if (!state.selectedGoods.some(k => k.relationId === a.relationId)) {
								state.selectedGoods.push(a)
							}
						})
						state.isInit = false
					}
					state.pagination = Object.assign(state.pagination, r.data.commonPager.page)
					state.tableData.forEach(sku => {
						sku.select = state.selectedGoods.some(s => s.relationId === sku.id) ? 1 : 0
					})
				})
			}

			search()

			getCategoryTree().then(r => {
				state.categoryIdOptions = r.data
			})

			function handleSizeChange(val) {
				state.pagination.pageSize = val
				search()
			}

			function handleCurrentChange(val) {
				state.pagination.currentPage = val
				search()
			}

			function changeCategory(value) {
				if (value) {
					state.filterForm.categoryId = value[value.length - 1]
				} else {
					state.filterForm.categoryId = null
				}
			}

			function addGoods(id) {
				if (state.selectedGoods.length >= 5) {
					ElMessage.error({ message: '最多选择五个商品' })
					return false
				}
				if (!state.selectedGoods.some(k => k.relationId === id)) {
					const f = state.tableData.find(s => s.id === id)
					f.select = 1
					f.relationId = id
					state.selectedGoods.push(f)
				}
			}

			function removeGoods(id) {
				state.selectedGoods.splice(state.selectedGoods.findIndex(u => u.relationId === id), 1)
				if (state.tableData.find(s => s.id === id)) {
					state.tableData.find(s => s.id === id).select = 0
				}
			}

			// 新增或删除组合品变体
			function changeCopySkuChecked(row) {
				if (row.checked) {
					state.selectedCopySkus.push(row)
				} else {
					state.selectedCopySkus.splice(state.selectedCopySkus.findIndex(sku => sku.skuId === row.skuId), 1)
				}
			}

			function changeActiveStep() {
				if (state.type === 2 && state.selectedCopySkus.length === state.copySkus.length) {
					ElMessage.error({ message: '不可选择全部SKU变体！' })
					return false
				}
				// 组合品变体时 被选中的单品sku默认关联自身，系数为1
				if (state.type === 2) {
					const skuIds = state.selectedCopySkus.map(s => s.skuId)
					props.skus.forEach(sku => {
						if (skuIds.includes(sku.skuId)) {
							sku.goodsSkuCombinationRelation = [{
								goodsId: sku.goodsId,
								mainId: sku.skuId,
								childId: sku.skuId,
								coef: 1,
								speLabel: sku.speLabel,
								price: sku.price
							}]
						}
					})
				}
				// 根据当前选中的商品去过滤sku的关联关系
				if (state.activeStep === 1) {
					const goodsIdArr = state.type === 1 ? state.selectedGoods.map(good => good.relationId) : state.selectedCopySkus.map(sku => sku.goodsId)
					props.skus.forEach(sku => {
						if (sku.goodsSkuCombinationRelation && sku.goodsSkuCombinationRelation.length) {
							sku.goodsSkuCombinationRelation = sku.goodsSkuCombinationRelation.filter(g => goodsIdArr.includes(g.goodsId))
							// 已关联商品列的显示数据组装
							sku.combinationLabels = []
							sku.goodsSkuCombinationRelation.forEach(a => {
								if (a.goodsSpeValList !== undefined) {
									a.speLabel = a.goodsSpeValList?.map(s => s.nameCn || s.nameEn).join('-') || ''
								} else {
									a.speLabel = (a.speCnLabel || a.speLabel) === '-' ? '' : (a.speCnLabel || a.speLabel)
								}
								sku.combinationLabels.push(`${a.goodsId} ${a.speLabel}*${a.coef}`)
							})
						}
					})
				}
				state.activeStep = state.activeStep === 1 ? 2 : 1
			}

			function showRelations(rows, way,type) {
        let skuIds =  rows.map(item => item.skuId)
 				if (state.type === 2 && state.selectedCopySkus.some(sku => skuIds.includes(sku.skuId))) {
					ElMessage.error({ message: '设为单品的SKU变体已默认为本身，不可修改！' })
					return false
				}
				ctx.emit('showRelations', {
					way,
					mainGoodsId: state.filterForm.goodsId,
					mainSkuIds: skuIds,
					childGoodsIdList: state.type === 1 ? state.selectedGoods.map(a => a.relationId) : state.selectedCopySkus.map(b => b.goodsId),
					goodsSkuCombinationRelation: type==='batch'? []: rows[0].goodsSkuCombinationRelation,  // 批量不回显
					childSkuIdList: state.type === 1 ? null : state.selectedCopySkus.map(s => s.skuId)
				})
			}

			function closeDialog(flag) {
				ctx.emit('close', flag)
			}

			function completeRelation() {
				const find = props.skus.find(sku => !sku.goodsSkuCombinationRelation || !sku.goodsSkuCombinationRelation.length)
				if (find) {
					ElMessage.error({ message: `组合品${find.skuId}未关联选择的商品！` })
					return false
				}
				const submitForm = {
					goodsId: state.filterForm.goodsId,
          purchasePrice: 0,
					goodsCombinationRelation: [],
					skuList: [],
					// 组合品变体 和 商品库商品标识
					type: state.type
				}
				state.selectedGoods.forEach(g => {
					submitForm.goodsCombinationRelation.push({
						relationId: g.relationId
					})
				})
				props.skus.forEach(s => {
          submitForm.purchasePrice = submitForm.purchasePrice + s.price
					submitForm.skuList.push({
						skuId: s.skuId,
						goodsSkuCombinationRelation: s.goodsSkuCombinationRelation
					})
				})
				updateRelations(submitForm).then(r => {
					ElMessage.success({ message: '关联成功' })
					closeDialog(true)
				})
			}

			function goAddGoods() {
				router.push({ name: 'addGoods' })
			}
      let tableRef =  ref(null)
			// 批量关联
			function batchRelation() {
        let rows = tableRef.value.getCheckboxRecords()
        if(rows.length < 1) {
            ElMessage.error({ message: '最少选择1个SKU' })
            return
        }
        showRelations(rows,'add','batch')
			}
			return {
				...toRefs(state),
				search,
				handleSizeChange,
				handleCurrentChange,
				changeCategory,
				addGoods,
				removeGoods,
				showRelations,
				closeDialog,
				completeRelation,
				goAddGoods,
				changeActiveStep,
				changeCopySkuChecked,
				batchRelation,
        tableRef
			}
		},
	}
</script>

<style lang="scss" scoped>
	.full-relation-container {
		&.flex-div {
			display: flex;
			.same-table-width {
				flex: 0.5;
				min-width: 400px;
			}
			.same-table-width + .same-table-width {
				margin-left: 10px;
			}
		}
	}
	.w-120 {
		width: 160px;
	}
	:deep(.el-cascader--small.w-120) {
		width: 160px;
	}
	.goods-info {
		display: flex;
		.info-content {
			width: calc(100% - 80px);
			margin-left: 10px;
		}
	}
	.justify-end-div {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.title-wrap {
		display: flex;
		justify-content: space-between;
		padding-right: 40px;
		align-items: center;
		.title-real {
			font-size: 16px;
		}
	}
</style>
