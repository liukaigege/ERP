<template>
	<div class="purchase-order-container">
		<el-card shadow="never" class="none-border-card">
			<el-form :model="filterForm" class="filter-el-form" inline>
				<el-form-item prop="date">
					<el-date-picker unlink-panels class="sperator-big-date-picker" v-model="daterange" value-format="YYYY-MM-DD" type="daterange" range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate" :clearable="false" />
				</el-form-item>
				<el-form-item prop="supplierId">
					<el-select clearable filterable v-model="filterForm.supplierId" placeholder="订货厂商">
						<el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="status">
					<el-select clearable v-model="filterForm.status" placeholder="订货状态">
						<el-option v-for="(value, key) in stateLabel" :key="key" :label="value" :value="key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<div style="display:flex;">
						<el-select clearable v-model="filterForm.searchType" style="margin-right:10px">
							<el-option v-for="(label,key) in wordsLabel" :key="key" :label="label" :value="key">
							</el-option>
						</el-select>
						<el-input v-model="filterForm.tempWord" clearable @change="changeSearchStr"></el-input>
					</div>
				</el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
				<!-- <el-button type="success" icon="el-icon-download" @click="openImportDialog">导入订货单
				</el-button> -->
			</el-form>
		</el-card>
		<div class="mt-20">
			<el-button type="primary" :disabled="!purchaseIds.length" @click="downloadDetailXls">批量下载明细</el-button>
			<el-button type="primary" @click="renameDialog = true">重命名并打包下载</el-button>
		</div>
		<el-card shadow="never" class="mt-20 none-border-card">
			<el-table :data="tableData" border @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55px"></el-table-column>
				<el-table-column type="index" label="序号" width="55px"></el-table-column>
				<el-table-column prop="id" label="订货批次号"></el-table-column>
				<el-table-column prop="supplierName" label="订货厂商"></el-table-column>
				<el-table-column prop="createTime" label="导入订货时间" width="180px"></el-table-column>
				<el-table-column prop="createUser" label="导入订货人"></el-table-column>
				<el-table-column prop="rowCount" label="导入数据量"></el-table-column>
				<el-table-column prop="goodsCount" label="总订货数量"></el-table-column>
				<el-table-column prop="purchaseStatus" label="订货状态">
					<template #default="scope">
						<span>{{ stateLabel[scope.row.purchaseStatus] }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="arriveNum" label="已到货数量"></el-table-column>
				<el-table-column label="操作" width="150px">
					<template #default="scope">
						<div>
							<el-button type="text" size="small" @click="downloadXls(false, scope)">下载</el-button>
							<el-button type="text" size="small" :disabled="scope.row.purchaseStatus > 1" @click="cancel(scope)">撤销</el-button>
							<el-button type="text" size="small" :disabled="scope.row.purchaseStatus !== 2 || scope.row.isClose === 1" @click="close(scope.row.id, !scope.row.isClose)">关闭</el-button>
						</div>
						<div>
							<el-button type="text" size="small" @click="openDetailDialog(scope)">查看明细</el-button>
							<el-button type="text" size="small" @click="downloadQrCode(scope.row)">打印二维码</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="flex-pagination page-fixed">
				<div></div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
				</el-pagination>
			</div>
		</el-card>
		<import-dialog @closeDialog="closeImportDialog" v-if="showImportDialog" :suppliers="supplierList" />
		<detail-dialog v-if="rowData && rowData.id" @closeDialog="closeDetailDialog" :show="showDetailDialog" :row="rowData" />
		<el-dialog v-model="showDownload" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" title="下载进度提示">
			<el-progress class="mt-20" :percentage="percentage"></el-progress>
			<div class="mt-10 text-center">订货导出数据整理中，请耐心等待，如长时间进度无反应，请与研发部联系</div>
		</el-dialog>
		<el-dialog title="重命名并打包下载" v-model="renameDialog" v-if="renameDialog" width="30%" :close-on-click-modal="false" @close="dialogClose">
			<el-form :model="formData" ref="formRef" :rules="rules" label-width="100px" size="normal">
				<el-form-item label="文件名前缀" prop="textContent">
					<el-input v-model="formData.textContent" style="width:300px" maxlength="15" show-word-limit></el-input>
				</el-form-item>
				<el-form-item>
					<upload-file v-if="renameDialog" accept=".xlsx" @getFileList="uploadSuccess" :moduleName="'rename'" class="flex-div" button-text="上传文件" tip="">
					</upload-file>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="renameDialog = false">取消</el-button>
				<el-button type="primary" @click="downFile">下载</el-button>
			</template>
		</el-dialog>
		<el-dialog title="导出订单" v-model="prolog" width="33%" :close-on-click-modal="false" @close="prolog = false">
			<div class="probox">
				<div class="box">
					<div style="width:100%;height:10px">
						<el-progress :percentage="percentage" :show-text='true' :stroke-width="10"></el-progress>
					</div>
					<span class="mt-10">打包下载数据整理中，请耐心等待，若长时间进度无反应，请与研发部联系</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCurrentInstance, reactive, ref, toRefs } from 'vue'
	import moment from 'moment'
	import { getImportOrderListPage, getSupplierList, cancelImportOrder, downloadImportOrder, closeImportOrder, exportImportOrderDetail, downloadQrCodePdf } from '@/api/purchase/purchase.js'
	import { progressInfo } from '@/api/basic.js'
	import { erpElTable } from 'hooks'
	import ImportDialog from './components/ImportDialog.vue' // 导入订货单弹窗
	import DetailDialog from './components/DetailDialog.vue' // 导入订货单弹窗
	import { ElMessageBox, ElMessage } from 'element-plus'
	import { exportRename } from '@/api/order/orderProcessing.js'
	import UploadFile from '@/components/uploadFile/index.vue'

	export default {
		name: 'PurchaseOrder',
		components: { ImportDialog, DetailDialog, UploadFile },
		setup() {
			const { proxy } = getCurrentInstance()
			const data = reactive({
				filterForm: {
					startDate: '', // 开始时间
					endDate: '', // 结束时间
					supplierId: '', // 订货厂家ID
					status: '', // 订货状态
					tempWord: '',// 临时搜索内容
					contentList: '',// 搜索内容
					searchType: '' // 搜索类型
				},
				daterange: [
					moment().subtract(14, 'days').format('YYYY-MM-DD'),
					moment().format('YYYY-MM-DD')
				],
				supplierList: [], // 订货供应商集合
				stateLabel: {
					0: '导入成功',
					1: '订货中',
					2: '部分到货',
					3: '已完成'
				}, // 订货状态集合
				rowData: null,
				percentage: 0,
				description: null,
				showDownload: false,
				purchaseIds: [],
				uuid: null,
				renameDialog: false,
				rename: false,
				rules: {
					textContent: [
						{ required: true, message: '请输入文件名', trigger: 'blur' }
					]
				},
				formData: {
					textContent: ''
				},
				files: '',
				prolog: false,
				formRef: null
			})
			const wordsLabel = { 1: 'SKU', 2: '订单号', 3: '物流单号', 4: '二维码ID', 5: '导入订货人' }
			let progressTimer = null
			// 默认值
			if (!data.filterForm.startDate && !data.filterForm.endDate) {
				data.filterForm.startDate = moment().subtract(14, 'days').format('YYYY-MM-DD') + ' 00:00:00'
				data.filterForm.endDate = moment().format('YYYY-MM-DD') + ' 23:59:59'
			}

			const erpEltableOpts = erpElTable(getImportOrderListPage, data.filterForm)

			const changeDate = date => {
				if (date) {
					data.filterForm.startDate = date[0] + ' 00:00:00'
					data.filterForm.endDate = date[1] + ' 23:59:59'
				} else {
					data.filterForm.startDate = data.filterForm.endDate = null
				}
			} // 选择下单时间

			function changeSearchStr() {
				if (data.filterForm.tempWord) {
					data.filterForm.tempWord = data.filterForm.tempWord.replace(/(^\s*)|(\s*$)/g, '')
				}
				try {
					const obj = JSON.parse(data.filterForm.tempWord)
					if (obj.ivtPurchaseDetailId) {
						data.filterForm.contentList = [obj.ivtPurchaseDetailId]
					} else {
						data.filterForm.contentList = data.filterForm.tempWord ? data.filterForm.tempWord.split(' ') : null
					}
				} catch (error) {
					data.filterForm.contentList = data.filterForm.tempWord ? data.filterForm.tempWord.split(' ') : null
				}
			}


			// 单条操作撤销订货单
			const cancel = scope => {
				ElMessageBox.confirm('确认撤销吗？', '警告', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				"close-on-click-modal":false,
				"close-on-press-escape":false
				}).then(() => {
					cancelImportOrder({
						id: scope.row.id
					}).then(r => {
						proxy.$message.success({ message: '撤销成功' })
						erpEltableOpts.search()
					})
				})

			}

			function close(purchaseId, isClose) {
				ElMessageBox.confirm('确认关闭吗？', '警告', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				"close-on-click-modal":false,
				"close-on-press-escape":false
				}).then(() => {
					closeImportOrder({
						purchaseId,
						isClose: isClose ? 1 : 0
					}).then(r => {
						proxy.$message.success({ message: '关闭成功' })
						erpEltableOpts.search()
					})
				})

			}

			const getProgress = uuid => {
				progressInfo(uuid).then(r => {
					const response = r.data
					if (typeof response !== 'String') {
						data.percentage = response.percent
						data.description = response.description
					}
				})
			}

			// 单条/批量 操作下载
			function handleSelectionChange(selection) {
				data.purchaseIds = []
				selection.map(select => {
					data.purchaseIds.push(select.id)
				})
			}

			const downloadXls = (batch, scope) => {
				progressTimer && clearInterval(progressTimer)
				data.percentage = 0
				data.description = null
				data.showDownload = true
				data.uuid = createUUID()
				downloadImportOrder({
					purchaseIds: batch ? data.purchaseIds : [scope.row.id],
					uuid: data.uuid
				}).then(r => {
					data.percentage = 100
					data.description = '下载成功'
					setTimeout(_ => {
						window.open(r.data, '_self')
						erpEltableOpts.search()
					}, 500)
				}).finally(_ => {
					progressTimer && clearInterval(progressTimer)
					data.showDownload = false
				})
				progressTimer = setInterval(_ => {
					getProgress(data.uuid)
				}, 800)
			}

			function downloadDetailXls() {
				progressTimer && clearInterval(progressTimer)
				data.percentage = 0
				data.description = null
				data.showDownload = true
				data.uuid = createUUID()
				exportImportOrderDetail({
					purchaseIds: data.purchaseIds.join(','),
					uuid: data.uuid
				}).then(r => {
					data.percentage = 100
					data.description = '下载成功'
					setTimeout(_ => {
						window.open(r.data.msg, '_self')
					}, 500)
				}).finally(_ => {
					progressTimer && clearInterval(progressTimer)
					data.showDownload = false
				})
				progressTimer = setInterval(_ => {
					getProgress(data.uuid)
				}, 800)
			}

			function createUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
					let r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8)
					return v.toString(16)
				})
			}

			getSupplierList().then(r => {
				if (r.data && r.data.length) {
					r.data.map(it => {
						data.supplierList.push({
							id: it.id,
							name: it.name
						})
					})
				}
			})

			// 导入订单弹窗
			const showImportDialog = ref(false)

			const openImportDialog = () => {
				showImportDialog.value = true
			}

			const closeImportDialog = needRefresh => {
				showImportDialog.value = false
				needRefresh && erpEltableOpts.search()
			}

			// 查看明细弹窗
			const showDetailDialog = ref(false)

			const openDetailDialog = scope => {
				data.rowData = scope.row
				showDetailDialog.value = true
			}

			const closeDetailDialog = () => {
				data.rowData = null
				showDetailDialog.value = false
			}

			// 下载打包文件文件
			const downFile = e => {
				progressTimer && clearInterval(progressTimer)
				data.description = null
				data.percentage = 0
				data.formRef.validate(val => {
					if (!val) return
					if (data.files) {
						data.prolog = true
						data.uuid = createUUID()
						exportRename({
							fileUrl: data.files.fileUrl,
							prefix: data.formData.textContent,
							uuid: data.uuid
						}).then(res => {
							data.percentage = 100
							data.description = '下载成功'
							setTimeout(_ => {
								window.open(res.data, '_self')
								progressTimer && clearInterval(progressTimer)
								data.prolog = false
								data.renameDialog = false
								data.formData.textContent = ''
							}, 100)
						}).catch(err => {
							clearTimeout(err.timeId)
							ElMessageBox({
								type: "error",
								message: err.message
							})
							progressTimer && clearInterval(progressTimer)
							data.prolog = false
							data.renameDialog = false
							data.formData.textContent = ''

						})
						progressTimer = setInterval(_ => {
							getProgress(data.uuid)
						}, 800)
					} else {
						ElMessage.error('请上传文件或等待文件上传完成')
					}
				})
			}

			const uploadSuccess = e => {
				if (!e.length) return data.files = ''
				data.files = e[0]
				console.log(e);
			}

			const dialogClose = () => {
				data.files = null
				data.uuid = null
				data.formData.textContent = null
			}

			function downloadQrCode(row) {
				downloadQrCodePdf({
					purchaseIds: [row.id]
				}).then(r => {
					window.open(r.data)
				})
			}

			return {
				...toRefs(data),
				...erpEltableOpts,
				changeDate,
				showImportDialog,
				openImportDialog,
				closeImportDialog,
				showDetailDialog,
				openDetailDialog,
				closeDetailDialog,
				downloadXls,
				downloadDetailXls,
				handleSelectionChange,
				cancel,
				close,
				wordsLabel,
				uploadSuccess,
				downFile,
				dialogClose,
				changeSearchStr,
				downloadQrCode
			}
		}
	}
</script>

<style lang="scss" scoped>
	.purchase-order-container {
		padding-bottom: 40px;
	}
</style>
