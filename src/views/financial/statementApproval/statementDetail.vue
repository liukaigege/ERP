<template>
	<div class="detail-container">
		<erpNav :routeOpt="{name:'statementApproval'}" :title="info.verifyInfo?.serialNumber" :goBack="cancel" />
		<div class="row-detail">
			<el-row v-for="(row,index) in detailRow" :key="index">
				<el-col :span="col.span" :offset="0" v-for="(col,i) in row" :key="i">
					<template v-if="col.isKey">
						<span v-if="verifyKeys.includes(col.value)">
							{{info['verifyInfo'][col.value]}}
						</span>
						<span v-else-if="col.value == 'settlementValue'">
							账期（{{info['verifyInfo']['settlementValue']}}天）
						</span>
						<span v-else-if="col.value == 'putInStorageNoList'">{{new Array(info[col.value]).flat().join('、')}}</span>
						<span v-else-if="col.value == 'totalAmount'"> ￥{{info[col.value]}} </span>
						<span v-else> {{info[col.value]}} </span>
					</template>
					<span v-else>{{col.value}}</span>
				</el-col>
			</el-row>
		</div>
		<h1 style="line-height: 60px;">申请明细</h1>
		<el-table ref="tableRef" align="center" border :data="tableData" tooltip-effect="dark" :span-method="arraySpanMethod" :row-style="rowStyle">
			<el-table-column prop="id" label="采购单" align="center" width="200">
				<template #default="{row}">
					<div v-if="!row.isFooter">
						<div>{{row.purchaseOrderNumber}}</div>
						<div>{{row.auditTime}}</div>
						<div>{{row.purchaseUserName}}</div>
					</div>
					<div v-else>
						<div class="flex">
							<span>运费(&yen;)：{{row.fee}}</span>
							<span>折扣(&yen;)：{{row.discount}}</span>
							<span>税率(%)：{{row.taxRate}}</span>
							<span>对账金额(&yen;)：{{ row.amount?.toFixed(2) }}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="SKU" min-width="460px" align="center">
				<template #default="{row}">
					<div class="sku-col">
						<div style="display: flex;align-items: center;flex-direction: column;">
							<el-image :src="row.skuImage" fit="contain" style="width: 80px;height: 80px;"></el-image>
							<p style="color:#1890ff;">{{row.goodsType == '1'?'定制':''}}</p>
						</div>
						<div class="sku-col-right ">
							<div>{{row.sku}}</div>
							<div class="textOverflow_2 ">
								{{row.goodsName}}
							</div>
							<div class="sku-box" :title="row.skuFmtVal">
								{{row.skuFmtVal}}
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="采购单价" align="center" width="150">
				<template #default="{row}">
					<div>
						￥{{row.purchaseGoodsPrice}}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="采购数量" align="center" width="150">
				<template #default="{row}">
					<div>
						{{row.purchaseGoodsQuantity}}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="入库单号" align="center" width="150">
				<template #default="{row}">
					<div v-for="(item,i) in row.putInStorageNoList" :key="i">{{item}}</div>
				</template>
			</el-table-column>
			<el-table-column label="入库时间" align="center" width="180">
				<template #default="{row}">
					<div v-for="(item,i) in row.putInStorageTimeList" :key="i">{{item}}</div>
				</template>
			</el-table-column>
			<el-table-column label="入库数量" align="center" width="100">
				<template #default="{row}">
					<div>
						{{row.putInStorageGoodsQuantity}}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="入库配件金额" align="center" width="100">
				<template #default="{ row }">
					 <div v-if="row.putInStoragePartsPriceList?.length">
              <p v-for="item in row.putInStoragePartsPriceList" :key="item">
                {{item===null||item==='null'?'-':'¥'+item}}
                </p>
            </div>
            <p v-else>-</p>
				</template>
			</el-table-column>
			<el-table-column prop="putInStorageTotalPrice" label="入库总金额" align="center" width="100">
				<template #default="{ row }">
					<div>￥{{row.putInStorageTotalPrice}}</div>
				</template>
			</el-table-column>
		</el-table>
		<h1 v-if="info.verifyInfo?.receiptList&&!info.verifyInfo.receiptList.length" style="line-height: 60px;">暂无回执文件</h1>
		<h1 v-else style="line-height: 60px;">回执文件</h1>
		<div class="flex flex-img">
			<el-image :src="img.url" fit="contain" :lazy="true" style="height:270px;" v-for="img in info.verifyInfo?.receiptList" :key="img.id" @click="imgClick(img)"></el-image>
		</div>
		<el-dialog v-model="visitble" :width="800" :close-on-click-modal="false" :destroy-on-close="true" trigger="click">
			<!-- <el-button type="text" style="float:right" @click="closeImg" >关闭</el-button> -->
			<div style="display:flex;align-items:center;justify-content:center">
				<el-image :src="imgLists" style="height:450px;" fit="contain"></el-image>
			</div>
		</el-dialog>
		<div class="flex-pagination page-fixed">
			<div>
				对账总金额：¥{{info.totalAmount}}
			</div>
			<div v-if="status ==1">
				<el-button @click="cancel">取消</el-button>
				<el-button @click="rejectReconciliation">拒绝对账</el-button>
				<el-button type="primary" @click="completeReconciliation">对账完成</el-button>
			</div>
			<div v-else>
				<el-button @click="cancel">关闭</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import erpNav from '@/components/erpNav/index.vue'
	import { reactive, toRefs, onMounted } from 'vue'
	import { detailRow } from './composables/options.js'
	import { verifyCheckGetDetail, verifyCheckComplate, verifyCheckRefuse } from '@/api/financial'
	import { useRouter, useRoute } from 'vue-router'
	import { ElMessageBox } from 'element-plus'
	export default {
		components: { erpNav },
		setup() {
			const router = useRouter()
			const route = useRoute()
			let id = route.query.id
			let status = route.query.status
			let verifyKeys = ['serialNumber', 'partnerTypeName', 'supplierName']
			const state = reactive({
				visitble: false,
				imgLists: '',
				info: {
					verifyInfo: {
						serialNumber: ''
					}
				},
				tableData: [],
				tableRef: null,
			})
			onMounted(() => {
				verifyCheckGetDetail({ id }).then(res => {
					state.info = res.data
					let tableData = []
					state.info.verifyInfo.purchaseList.forEach(item => {
						let { purchaseOrderNumber, purchaseUserName, auditTime, amount, discount, fee, taxRate } = item
						tableData = tableData.concat(item.goodsList.map((good, index) => {
							if (index == 0) return { ...good, purchaseOrderNumber, purchaseUserName, auditTime, mrege: item.goodsList.length }
							return { ...good, purchaseOrderNumber, purchaseUserName, auditTime }
						}))
						tableData.push({ isFooter: true, amount, discount, fee, taxRate })
					})
					tableData.forEach(item => {
						if (item.skuValue) {
							item.skuFmtVal = JSON.parse(item.skuValue).map(v => v.spe + ': ' + v.speVal).join(' ')
						} else {
							item.skuFmtVal = ''
						}

					})
					state.tableData = tableData
				})
			})
			function arraySpanMethod({ row, columnIndex }) {
				if (row.mrege && columnIndex == 0) return [row.mrege, 1]
				if (row.isFooter) {
					if (columnIndex == 0) return [1, 9]
					else return [0, 0]
				}
				if (!row.mrege && columnIndex == 0) return [0, 0]
			}

			function rowStyle({ row }) {
				if (row.isHead || row.isFooter) return {
					backgroundColor: "#f2f2f2",
				}
			}
			function completeReconciliation() { // 完成对账
				verifyCheckComplate({ applyIds: [id] }).then(_ => {
					cancel()
				})
			}

			function rejectReconciliation() { // 拒绝对账
				ElMessageBox.prompt('* 拒绝原因', '拒绝对账', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
					inputErrorMessage: '请输入拒绝原因',
					inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
						if (!value) {
							return '请输入拒绝原因'
						}
						if (value.length > 50) {
							return '长度不超过50个字符'
						}
					}
				}).then(({ value }) => {
					verifyCheckRefuse({ applyIds: [id], reason: value.trim() }).then(_ => {
						cancel()
					})
				})
			}

			function cancel() {
				router.push({ name: 'statementApproval', params: { type: route.query.status } })
			}
			function imgClick(row) {
				state.visitble = true
				state.imgLists = row.url
			}
			function closeImg() {

			}
			return {
				...toRefs(state),
				detailRow,
				arraySpanMethod,
				rowStyle,
				cancel,
				completeReconciliation,
				rejectReconciliation,
				verifyKeys,
				status,
				imgClick,
				closeImg
			}
		}
	}
</script>

<style lang="scss" scoped>
.detail-container {
	background: #fff;
	padding: 12px;
	margin-bottom: 40px;
}

::v-deep(.el-row) {
	border-bottom: 1px solid #f2f2f2;
	text-align: center;

	.el-col {
		padding: 8px;
		background-color: #fafafa;
	}

	.el-col:nth-child(2n) {
		background-color: #fff;
	}
}

.row-detail {
	border: 1px solid #f2f2f2;
}

::v-deep(.el-row:last-child) {
	border-bottom: unset;
}

.flex {
	display: flex;
	text-align: left;
	align-items: center;

	span {
		margin-left: 25px;
	}

	::v-deep(.el-input) {
		width: 200px;
	}
}
.sku-box {
	width: 350px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.sku-col {
	display: flex;
	align-items: center;
}
.sku-col-right {
	display: flex;
	text-align: left;
	margin-left: 8px;
	flex-direction: column;
	justify-content: space-around;
	font-size: 12px;
}
.flex-img {
	flex-wrap: wrap;
	.el-image {
		width: calc(33.333333% - 7px);
		margin-right: 10px;
		margin-top: 10px;
	}
	.el-image:nth-child(3n) {
		margin-right: 0;
	}
}
</style>
