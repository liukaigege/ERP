<template>
	<!-- 申请中 -->
	<div class="headApplicationTable">
		<vxe-table highlight-hover-row auto-resize align="center" max-height="600" ref="xTable1" :data="tabelData" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent">
			<vxe-column type="checkbox" width="60"></vxe-column>
			<vxe-column title="对账单号" field="serialNumber"  min-width="150"></vxe-column>
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
			<vxe-column title="采购单数" field="purchaseQuantity" width="100"></vxe-column>
			<vxe-column title="入库单数" field="putInStorageQuantity" width="100"></vxe-column>
			<vxe-column title="SKU种类" field="skuQuantity" width="100"></vxe-column>
			<vxe-column title="商品总数" field="goodsQuantity" width="100"></vxe-column>
			<vxe-column title="对账金额" field="totalAmount" width="100">
        <template #default="{row}">
          <div >¥{{row.totalAmount?row.totalAmount:'0'}}</div>
        </template>
      </vxe-column>
			<vxe-column title="创建时间" field="createTime" width="100">
        <template #default="{row}">
        <div :class="!timeLimt(row.createTime)?'redColor':''">{{row.createTime}}</div>
        </template>
      </vxe-column>
      <vxe-column title="申请时间" field="applicationTime" width="100"></vxe-column>
			<vxe-column title="申请人" field="createByName" width="100"></vxe-column>
			<vxe-column title="回执文件" field="fileQuantity" width="100"></vxe-column>
			<vxe-column title="操作" width='100' fixed="right">
				<template #default="{row}">
					<el-button type="text" @click="jumpEdit(row)">详情</el-button>
          <el-popconfirm icon="el-icon-info" title="是否取消对账单？" @confirm="deleteList(row.id)">
						<template #reference>
							<el-button v-permission="'reconciliationApplication_singleCancel:btn'" type="text" style="color:#FD4C60;margin-left:20px;">取消</el-button>
						</template>
					</el-popconfirm>
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
    emits: ['cancelList','selecDataList'],
		setup(props, context) {
			const router = useRouter()
			const state = reactive({
				xTable1: null,
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
			function selectAllEvent({ checked, records }) {
				state.checkData = records.map(item=>item.id)
				context.emit('selecDataList', state.checkData)
			}
			function selectChangeEvent({ checked, records }) {
				state.checkData = records.map(item=>item.id)
				context.emit('selecDataList', state.checkData)
			}
			//跳转
			function jumpEdit(row) {
				router.push({ name: 'reconciliationEdit', params:{ active: 1,id:row.id}})
			}
			//取消
			function deleteList(id) {
        context.emit('cancelList',id)
			}
      function timeLimt(data = '2021-11-25 17:09:00'){
       const inTimestamp = new Date(data).getTime()
       const nowTimestamp = new Date().getTime()
       if(inTimestamp+(1*24*60*60*1000)>=nowTimestamp){
         return true
       }else{
         return false
       }
     }
			return {
				...toRefs(state),
				selectAllEvent,
				selectChangeEvent,
				resubmit,
				jumpEdit,
				deleteList,
        timeLimt
			}

		}
	}
</script>

<style lang="scss" scoped>
.headApplicationTable {
	background: #fff;
	padding: 16px;
	margin-top: 24px;
	margin-bottom: 60px;
  .redColor{
    color: #f56c6c;
  }
}
</style>>
