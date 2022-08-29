<template>
	<el-dialog :title="`${data.id}订货明细`" v-model="showDialog" @close="closeDialog" width="80%" top="7vh" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form :model="form" inline>
			<el-form-item prop="searchContent">
				<el-input clearable type="text" :input-style="{ width: '300px' }" v-model="form.searchContent" placeholder="请输入订单号或sku进行模糊查询"></el-input>
			</el-form-item>
			<el-form-item prop="purchaseStatus">
				<el-select clearable v-model="form.purchaseStatus" placeholder="订货状态">
					<el-option v-for="(value, key) in stateLabel" :key="key" :label="value" :value="key">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
				<el-button type="primary" icon="el-icon-download" @click="exportDetail">导出</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" :disabled="!purchaseDetailIds.length" @click="batchSetYdn(true, null, 'batch')">批量设置运单号</el-button>
		<el-table :data="tableData" border :height="540" class="small-vertical-padding-table mt-20" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55px"></el-table-column>
			<el-table-column prop="orderId" label="订单号" min-width="160px"></el-table-column>
			<el-table-column prop="skuImg" label="主图" width="96px">
				<template #default="scope">
					<el-popover placement="right-start" trigger="hover" width="auto">
						<el-image style="width: 200px; height: 200px" :src="scope.row.skuImg" fit="contain"></el-image>
						<template #reference>
							<el-image style="width: 70px; height: 70px" :src="scope.row.skuImg" fit="contain">
								<template #error>
									<div class="image-slot">
										<el-image style="width: 70px; height: 70px" fit="contain" :src="errorImage" />
									</div>
								</template>
							</el-image>
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="sku" label="商品SKU" width="300px"></el-table-column>
			<el-table-column prop="flag" label="商品标识" min-width="80px"></el-table-column>
			<el-table-column prop="num" label="采购数量" min-width="80px"></el-table-column>
			<el-table-column prop="purchaseStatus" label="订货状态" min-width="80px">
				<template #default="scope">
					<span>{{
							stateLabel[scope.row.purchaseStatus]
						}}{{ scope.row.purchaseStatus === 2 ? `(${scope.row.arrivalNum})` : '' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="purchaseTime" label="订货时间" min-width="160px"></el-table-column>
			<el-table-column prop="trackNumber" label="运单号" min-width="120px">
				<template #default="scope">
					<div class="flex-div" v-if="!scope.row.trackNumber">
						<i v-if="scope.row.purchaseStatus < 3" @click="batchSetYdn(false, scope.row, 'add')" class="el-icon-plus color-process"></i>
					</div>
					<div class="flex-div" v-else>
						<el-tooltip placement="top">
							<template #content>
								<p style="cursor: pointer" v-copy="scope.row.trackNumber">
									复制
								</p>
							</template>
							<div class="orderNum">{{ scope.row.trackNumber }}</div>
						</el-tooltip>
						<i v-if="scope.row.purchaseStatus < 3" @click="batchSetYdn(false, scope.row, 'edit')" class="ml-5 el-icon-edit color-process"></i>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="deliveryTime" label="入库时间" min-width="160px"></el-table-column>
			<el-table-column prop="createUser" label="入库操作员" min-width="80px"></el-table-column>
			<el-table-column prop="arrivalInterval" label="到货周期" min-width="80px">
				<template #default="scope">
					<span>{{ scope.row.arrivalInterval }}{{scope.row.arrivalInterval !== null ? '小时' : ''}}</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex-pagination">
			<div></div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
			</el-pagination>
		</div>
		<el-dialog v-model="showDownload" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" title="下载进度提示">
			<el-progress class="mt-20" :percentage="percentage"></el-progress>
			<div class="mt-10 text-center">订货导出数据整理中，请耐心等待，如长时间进度无反应，请与研发部联系</div>
		</el-dialog>
	</el-dialog>
</template>

<script>
	import { reactive, ref, toRefs, getCurrentInstance } from 'vue'
	import { getImportOrderDetail, exportImportOrderDetail, batchAddTrackNumber } from '@/api/purchase/purchase.js'
	import { erpElTable } from 'hooks'
	import errorImage from '@/assets/image/zwt_bg.png'

	export default {
		emits: ['closeDialog'],
		props: {
			show: { // 显示控制
				type: Boolean,
				default: false
			},
			row: { // 表格数据
				type: Object,
				default: null
			}
		},
		setup(props, context) {
			const state = reactive({
				stateLabel: {
					0: '导入成功',
					1: '订货中',
					2: '部分到货',
					3: '已完成',
					4: '已关闭'
				}, // 订货状态集合
				form: {
					purchaseId: '',
					searchContent: '',
					purchaseStatus: ''
				},
				showDownload: false,
				percentage: 0,
				uuid: null,
				purchaseDetailIds: [],
				trackNumber: null
			})
			const { proxy } = getCurrentInstance()
			const showDialog = ref(props.show)
			let data = ref(props.row)
			let progressTimer = null
			state.form.purchaseId = data.value.id

			const erpEltableOpts = erpElTable(getImportOrderDetail, state.form)

			const exportDetail = () => {
				progressTimer && clearInterval(progressTimer)
				state.percentage = 0
				state.showDownload = true
				state.uuid = createUUID()
				exportImportOrderDetail({
					purchaseId: state.form.purchaseId,
					searchContent: state.form.searchContent,
					purchaseStatus: state.form.purchaseStatus,
					uuid: state.uuid
				}).then(r => {
					state.percentage = 100
					setTimeout(_ => {
						window.open(r.data.msg, '_self')
					}, 500)
				}).finally(_ => {
					progressTimer && clearInterval(progressTimer)
					state.showDownload = false
				})

				progressTimer = setInterval(_ => {
					getProgress(state.uuid)
				}, 800)
			}

			function createUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
					let r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8)
					return v.toString(16)
				})
			}

			const closeDialog = () => {
				showDialog.value = false
				context.emit('closeDialog')
			}

			const getProgress = uuid => {
				progressInfo(uuid).then(r => {
					const response = r.data
					if (typeof response !== 'String') {
						state.percentage = response.percent
						state.description = response.description
					}
				})
			}

			function handleSelectionChange(selection) {
				state.purchaseDetailIds = []
				selection.map(select => {
					state.purchaseDetailIds.push(select.id)
				})
			}

			// 批量设置运单号
			function batchSetYdn(batch, row, action) {
				if (action === 'edit') {
					state.trackNumber = row.trackNumber
				} else {
					state.trackNumber = null
				}
				proxy.$prompt('请设置运单号', {
					closeOnClickModal: false,
					inputPlaceholder: '运单号为字母和数字组合',
					inputPattern: /^[A-Za-z0-9]{1,60}$/,
					inputErrorMessage: '运单号为字母或数字组合的1到60位字符',
					inputValue: state.trackNumber
				}).then(r => {
					if (r.action === 'confirm') {
						state.trackNumber = r.value
						const { trackNumber, purchaseDetailIds } = state
						batchAddTrackNumber({
							trackNumber,
							purchaseDetailIds: batch ? purchaseDetailIds.join(',') : row.id + ''
						}).then(res => {
							proxy.$message.success({ message: '设置成功' })
							erpEltableOpts.search()
						})
					}
				})
			}

			return {
				...toRefs(state),
				showDialog,
				data,
				closeDialog,
				...erpEltableOpts,
				exportDetail,
				errorImage,
				batchSetYdn,
				handleSelectionChange
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-div {
		display: flex;
		font-size: 14px;
		align-items: center;
		.el-icon-plus,
		.el-icon-edit {
			font-size: 16px;
			margin-left: 5px;
			font-weight: bold;
			cursor: pointer;
		}
	}
</style>
