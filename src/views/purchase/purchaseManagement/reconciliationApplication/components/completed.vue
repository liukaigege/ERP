<template>
	<!-- 已完成 -->
	<div class="headCompletedTable">
		<vxe-table highlight-hover-row auto-resize align="center" max-height="600" ref="xTable1" :data="tabelData" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent">
			<vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column title="对账单号" field="serialNumber" min-width="150"></vxe-column>
			<vxe-column title="供应商" field="supplierName" min-width="120" show-overflow></vxe-column>
			<vxe-column title="结算方式" field="settlementTypeName" width="100">
				<template #default="{row}">
					<span v-if="row.settlementType == '2'">账期({{row.settlementValue}}天)</span>
					<span v-else>
						{{{"1":'预付',"3":"货到付款","4":"款到发货"}[row.settlementTypeName]}}
            <span v-if="row.settlementType==1">({{row.settlementValue}}{{{'1':'%','2':'元'}[row.settlementUnit]}})</span>
        </span>
      </template>
      </vxe-column>
			<vxe-column title="采购单数" field="purchaseQuantity" width='100'></vxe-column>
			<vxe-column title="入库单数" field="putInStorageQuantity" width='100'></vxe-column>
			<vxe-column title="SKU种类" field="skuQuantity" width='100'></vxe-column>
			<vxe-column title="对账商品数" field="goodsQuantity" width='100'></vxe-column>
			<vxe-column title="对账金额" field="totalAmount" width='100'>
				 <template #default="{row}">
          <div >¥{{row.totalAmount?row.totalAmount:'0'}}</div>
        </template>
			</vxe-column>
      <vxe-column title="付款金额" field="payAmount" width='100'>
				 <template #default="{row}">
          <div v-if="row.payAmount">¥{{row.payAmount}}</div>
        </template>
			</vxe-column>
			<vxe-column title="创建时间" field="createTime" width='100'></vxe-column>
      <vxe-column title="申请时间" field="applicationTime" width='100'></vxe-column>
      <vxe-column title="完成时间" field="auditTime" width='100'></vxe-column>
			<vxe-column title="申请人" field="createByName" width='100'></vxe-column>
			<vxe-column title="回执文件" field="fileQuantity" width='100'></vxe-column>
			<vxe-column title="操作" width='100' fixed="right">
				<template #default="{row}">
					<el-button type="text"  @click="jumpEdit(row.id)">详情</el-button>
				</template>
			</vxe-column>
		</vxe-table>
	</div>
</template>

<script>
	import { reactive, toRefs, watch } from 'vue'
	import { useRouter } from 'vue-router'
	export default {
		props: {
		tabelData: { // 列表数据
				type: Array,
				default: () => []
			},
		},
     emits: ['selecDataList'],
		setup(props, context) {
			const router = useRouter()
			const state = reactive({
				xTable1: null,
				// data: [{
				// 	id: 1,
				// 	serialNumber: 'POXXUSD0010',
				// 	supplierName: '合肥科技有限公司',
				// 	settlementTypeName: '账期(30天)',
				// 	purchaseQuantity: 3,
				// 	putInStorageQuantity: 5,
				// 	skuQuantity: 3,
				// 	goodsQuantity: 334,
				// 	totalAmount: '¥55',
				// 	creatTime: '2021-11-01 17:09:00',
				// 	createByName: 'lisi',
				// 	fileQuantity: 1,
				// },
				// ],
				checkedList: false,
				indeterminate: false,
				checkData: [],//选择数据
				listRepet: [],//去重
			})
			//监听头部按钮改变清空选择框
			watch(() => props.checkType, val => {
				// state.xTable1.refreshColumn()
				// state.xTable1.clearCheckboxRow()
			})
			//提交审核
			function resubmit(val) {
				console.log(val);
			}
			//跳转
			function jumpEdit(id) {
				router.push({ name: 'reconciliationEdit', params: { active: 3,id:id } })
			}
      	function selectAllEvent({ checked, records }) {
				state.checkData = records.map(item=>item.id)
				context.emit('selecDataList', state.checkData)
			}
			function selectChangeEvent({ checked, records }) {
				state.checkData = records.map(item=>item.id)
				context.emit('selecDataList', state.checkData)
			}
			return {
				...toRefs(state),
				resubmit,
				jumpEdit,
        selectAllEvent,
        selectChangeEvent
			}

		}
	}
</script>

<style lang="scss" scoped>
.headCompletedTable {
	background: #fff;
	padding: 16px;
	margin-top: 24px;
	margin-bottom: 60px;
}
</style>>
