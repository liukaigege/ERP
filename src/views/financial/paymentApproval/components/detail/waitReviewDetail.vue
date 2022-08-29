<!--
* @Descripttion: Vango ERP waitReviewDetail.vue
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="detailContainer" v-if="detailData">
    <div v-show="!orderInfoShow">
			<div class="detailHeader">
				<i class="el-icon-arrow-left" @click="closeDetail"></i>
				<span>{{ detailData.serialNumber }}</span>
			</div>
			<div class="detailList">
				<el-descriptions class="margin-top" :column="2" size="" border>
					<el-descriptions-item label="平台" align="center">
						{{
							detailData.partnerType === 1
								? '合作供应商'
								: detailData.partnerType === 2
								? '1688'
								: detailData.partnerType === 3
								? '淘宝'
								: detailData.partnerType === 4
								? '拼多多'
								: ''
						}}
					</el-descriptions-item>
					<el-descriptions-item label="采购单号" align="center">
						{{ detailData.purchaseOrderNumber }}
					</el-descriptions-item>
					<el-descriptions-item label="供应商名称" align="center">
						{{ detailData.supplierName }}
					</el-descriptions-item>
					<el-descriptions-item label="采购应付总额" align="center">
						&yen; {{ detailData.totalAmount || 0 }}
					</el-descriptions-item>
					<el-descriptions-item label="采购实付总额" align="center">
						&yen; {{ detailData.totalGrandAmount || 0 }}
					</el-descriptions-item>
					<el-descriptions-item label="已付" align="center">
						&yen; {{ detailData.totalPayAmount || 0 }}
					</el-descriptions-item>
					<el-descriptions-item label="结算方式" align="center">
						{{
							settlementData.typeList.filter(
								v => v.id == detailData.settlementType
							)[0]?.label
						}}{{
							 detailData.settlementType == 2
								? `(${detailData.settlementValue}天)`:(detailData.settlementType == 1 && detailData.settlementUnit
								? `(${detailData.settlementValue + settlementData.unitList.find(
										v => v.id == detailData.settlementUnit
									)?.label})`
								: '')
						}}
					</el-descriptions-item>
					<el-descriptions-item label="申请付款总金额" align="center">
						<p class="redColor">&yen; {{ applyTotalNum}}</p>
					</el-descriptions-item>
					<s v-for="(item, index) in detailData.payment" :key="index">
						<el-descriptions-item
							:label="
								detailData.payment.length > 1
									? '打款账户' + (index + 1)
									: '打款账户'
							"
							align="center"
						>
							{{ item.bankUserName }}
						</el-descriptions-item>
						<el-descriptions-item
							:label="
								detailData.payment.length > 1
									? '银行卡号' + (index + 1)
									: '银行卡号'
							"
							align="center"
						>
							{{ item.bankAccount }}
						</el-descriptions-item>
						<el-descriptions-item
							:label="
								detailData.payment.length > 1 ? '开户行' + (index + 1) : '开户行'
							"
							align="center"
						>
							{{ item.bankName }}
						</el-descriptions-item>
						<el-descriptions-item
							:label="
								detailData.payment.length > 1
									? '打款金额' + (index + 1)
									: '打款金额'
							"
							align="center"
						>
							&yen; {{ item.payAmount || 0 }}
						</el-descriptions-item>
					</s>
				</el-descriptions>
			</div>
			<div class="tableContainer">
				<vxe-table
					border
					resizable
					max-height="400"
					:scroll-y="{ enabled: false }"
					:data="detailData.detail"
					:span-method="mergeCells"
					align="center"
				>
					<vxe-column title="采购单号/采购员">
						<template #default="{ row }">
							<div class="blueColor">{{ detailData.purchaseOrderNumber }}</div>
							<div>{{ detailData.applyName }}</div>
							<div>{{detailData.applyTime || row.createTime}}</div>
							<div v-if="detailData?.verifyNumStr">
								<span>对账单：</span>
								<span class="blueColor" @click="toVerifyOrder(detailData.verifyId)">{{detailData.verifyNumStr}}</span>
							</div>
							<div v-if="!detailData?.verifyNumStr && detailData.verifyNum">
								<span>对账单：</span><span class="blueColor" style="cursor: pointer;" @click="toVerifyOrder(detailData.verifyId)">{{detailData.verifyNum}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="SKU">
						<template #default="{ row }">
							<div v-if="row.showType == 'list'">
								<p class="skuP blueColor" :title="row.sku">{{ row.sku }}</p>
								<el-button type="text" v-if="row.customization == '1'" class="buttonClass">定制</el-button>
							</div>
							<div v-else>
								<ul>
									<li class="warehousInfoContainer" v-for="(v,i) in row.warehousInfo" :key="i">
										<span>{{v.warehousSerialNum}}</span>
										<span>{{v.warehousTime}}</span>
										<span>数量/金额：{{v.warehousCount}} / ￥ {{v.warehousAmount ? (v.warehousAmount - 0).toFixed(2) :'0'}}</span>
									</li>
								</ul>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="单价(&yen;)">
						<template #default="{ row }">
							￥{{ row.price }}
							<div v-if="row.partsPrice && row.partsPrice?.length > 0">
								<span v-for="(v,i) in row.partsPrice" :key="i">/ ￥{{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="采购数量">

						<template #default="{ row }">
							{{ row.purchaseCount }}
							<div v-if="row.partsNums && row.partsNums?.length > 0">
								<span v-for="(v,i) in row.partsNums" :key="i">/ {{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column field="partsPrice" title="配件金额(&yen;)">
						<template #default="{ row }">
							<div>{{ row.customization == 1 && row.partSwitch == 1 ? '￥' + (row.partsPrice - 0) : '-' }}</div>
						</template>
					</vxe-column>
					<vxe-column field="purchaseAmount" title="金额(&yen;)"></vxe-column>
					<vxe-column title="到货数量">
						<template #default="{ row }">
							{{ row.storageCount }}
							<div v-if="row.storagePartsNums && row.storagePartsNums?.length > 0">
								<span v-for="(v,i) in row.storagePartsNums" :key="i">/ {{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column field="storageAmount" title="到货金额(&yen;)"> </vxe-column>
					<vxe-column field="payAmount" title="已付(&yen;)"></vxe-column>
					<vxe-column field="remainAmount" title="剩余待付金额(&yen;)" v-if="detailData.settlementType != 2"></vxe-column>
					<vxe-column title="对账数量" v-if="detailData.settlementType == 2">
						<template #default="{ row }">
							{{ row.verifyAccount }}
							<div v-if="row.verifyPartsAccount && row.verifyPartsAccount?.length > 0">
								<span v-for="(v,i) in row.verifyPartsAccount" :key="i">/ {{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="对账金额" v-if="detailData.settlementType == 2">
						<template #default="{ row }">
							<span >￥{{ row.verifyAmount||0 }}</span>
							<div v-if="row.verifyPartsAmount || row.verifyPartsAmount?.length > 0">
								<span v-for="(v,i) in row.verifyPartsAmount" :key="i">/ ￥{{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="本次对账金额" v-if="detailData.settlementType == 2">
						<template #default="{ row }"> ￥{{ row.verifyAmountNow || '0' }} </template>
					</vxe-column>
					<vxe-column title="申请金额(&yen;)">
						<template #default="{ row }">
							<el-input
								style="width:80px;"
								v-model="row.appliedAmount"
								:readonly="true"
							></el-input>
							<el-button v-permission="'paymentApprovalQuery'" v-if="detailData.settlementType != 2 && row?.customization == 1" type="text" style="margin-left:10px;" @click="orderInfoShowfn(row)">查看</el-button>
						</template>
					</vxe-column>
				</vxe-table>
				<div class="tableFooter">
					<div class="div3">
						<span>运费(&yen;)：</span>
						<el-input
							:readonly="true"
							v-model="detailData.fee"
							class="shortInps"
						></el-input>
					</div>
					<div class="div3">
						<span>折扣(&yen;)：</span>
						<el-input
							:readonly="true"
							v-model="detailData.discount"
							class="shortInps"
						></el-input>
					</div>
					<div class="div3">
						<span>税率(%)：</span>
						<el-input
							:readonly="true"
							v-model="detailData.taxRate"
							class="shortInps"
						></el-input>
					</div>
					<div class="div2">
						<span class="ml">应付(&yen;)：{{ detailData.totalAmount || 0 }}</span>
					</div>
					<div class="div2">
						<span class="ml"
							>实付(&yen;)：{{ detailData.totalGrandAmount || 0 }}</span
						>
					</div>
					<div class="div2">
						<span class="ml"
							>已付(&yen;)：{{
								detailData.totalPayAmount + detailData.totalApplyAmount || 0
							}}</span
						>
					</div>
					<div class="div3" style="text-align: right">
						<span class="ml" style="font-size: 18px">申请付款总金额(&yen;)：</span>
						<span class="redColor" style="font-size: 18px"
							>{{ applyTotalNum }}</span
						>
					</div>
				</div>
			</div>
			<div class="detailFooter">
				<span>付款总金额(&yen;)：</span
				><span class="redColor" style="margin-right: 20px"
					>{{ applyTotalNum }}</span
				>
				<el-button  @click="closeDetail">取消</el-button>
				<el-button  @click="refuse" v-if="authPath('nonpayment')"
					>拒绝付款</el-button
				>
				<el-button
					type="primary"
					@click="exportFn"
					>导出</el-button
				>
				<el-button
					type="primary"
					@click="completet"
					v-if="authPath('completePayment')"
					>付款完成</el-button
				>
			</div>
			<!-- 拒绝付款弹框 -->
			<RefuseDialog
				v-if="refuseDialogShow"
				:list="checkedList"
				@closeBack="closeBack"
			/>
			<!-- 完成付款弹框 -->
			<CompletePay v-if="completePayShow" @closeBack="completePaymentBack" />
		</div>
		<div v-if="orderInfoShow">
			<OrderInfo :orderInfoForm="orderInfoForm" :pageType="1" @closeBack="closeOrderInfo" :isShowStatus="true" />
		</div>
  </div>
</template>
<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { queryDetail, completetFn, exportDetail } from '../../composables/api'
import { settlementData } from '../../composables/data'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import RefuseDialog from '../dialog/refuseDialog.vue'
import { authPath } from '@/utils/hooks'
import CompletePay from '../dialog/completePay.vue'
import { deepCopy } from '@/utils/tool.js'
import { QuestionFilled } from '@element-plus/icons-vue'
import OrderInfo from '@/views/financial/paymentApproval/components/orderInfo.vue'
export default {
  components: {
    RefuseDialog,
    CompletePay,
		QuestionFilled,
		OrderInfo
  },
  props: {
    applyId: Number
  },
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const applyId = route.query.id - 0 || null
    const store = useStore()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const state = reactive({
      detailData: null,
      refuseDialogShow: false,
      checkedList: [applyId],
      completePayShow: false,
			orderInfoShow:false,
			orderInfoForm:null
    })
    const applyTotalNum = computed(() => {
      if (state.detailData) {
				if(state.detailData.settlementType === 2){
					return state.detailData.verifyAmount
				} else {
					let num = state.detailData.detail.reduce((prev, cur) => {
						if(cur.showType === 'list') return prev + cur.appliedAmount
							else return prev
						}, 0)
					return (num + state.detailData.fee - state.detailData.discount).toFixed(2)
				}
      } else {
        return 0
      }
    })
    // 查询明细
    queryDetail({ applyId }).then(res => {
      if (res.code == 200) {
        // state.detailData = res.data
				state.detailData = deepCopy(res.data)
				state.detailData.detail = []
				res.data.detail.forEach(v=>{
						v.purchaseOrderNumber = res.data.purchaseOrderNumber
						v.showType = 'list'
						state.detailData.detail.push(v)
						if(v.warehousInfo){
							const obj = {
								showType : 'inStore',
								warehousInfo : v.warehousInfo || []
							}
							state.detailData.detail.push(obj)
						}
					})
        // state.detailData.tax = state.detailData.taxRate - 0 + '%'
      } else {
        ElMessage.warning({ message: res.message })
      }
    })
    // 合并单元格
    function mergeCells({ row, rowIndex, columnIndex }) {
			// row 当前行数据
			// rowIndex 当前行下标 起始值为0
			// columnIndex 当前列下标 起始值为0
			if(columnIndex === 0){//第一列
				if(rowIndex === 0){//第一行
					return { rowspan: state.detailData.detail.length, colspan: 1 } // 合并为一列
				}else{//第一行之外后面的数据（实际是空单元格）
					return { rowspan: 0, colspan: 0 } //合并为0列
				}
			}else {//第一列之外的行
				// if(rowIndex % 2 == 1){//偶数行，注意index起始值为0
				if(row.showType === 'inStore' ){//偶数行，注意index起始值为0
					if(columnIndex == 1){//第二列
						return { rowspan: 1, colspan: 12 } // 合并为一行
					}else if(columnIndex > 1){//第二列后面的数据（实际是空单元格）
						return { rowspan: 0, colspan: 0 } //合并为0行
					}
				}
			}
    }
    function closeDetail() {
      router.push({ name: 'paymentApproval', params: { type: 'first' } })
    }
    // 拒绝付款
    function refuse() {
			if(state.detailData.settlementType == 2) return ElMessage.warning({ message: '采购单结算方式为账期的付款单，不能执行拒绝付款' })
			// settlementType
      state.refuseDialogShow = true
    }
    // 关闭拒绝原因输入弹框
    function closeBack(val) {
      if (val === 'success') {
        // 拒绝成功
        state.refuseDialogShow = false
        router.push({
          name: 'paymentApproval',
          params: { type: 'first', status: 1 }
        })
      } else {
        state.refuseDialogShow = val
      }
    }
    // 完成付款
    function completet() {
      state.completePayShow = true
    }
    function completePaymentBack(val) {
      state.completePayShow = false
      if (val)
        completetFn({ applyId: state.checkedList, ...val }).then(res => {
          if (res.code == 200) {
            // 完成后原搜索条件再次调用列表数据
            ElMessage.success({ message: '提交成功！' })
            router.push({
              name: 'paymentApproval',
              params: { type: 'first', status: 1 }
            })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
    }
		function toVerifyOrder(id){
			window.open(`#/financial/statementApproval/statementDetail?id=${id}&status=2`,'_blank')
		}

		function closeOrderInfo(){
			state.orderInfoShow = false
		}
		function orderInfoShowfn(row){
			state.orderInfoForm = {
				purchaseOrderNumber: null,
        purchaseOrderItemIds: [row.itemId-0],
        paymentItemIdList: [row.id-0]
			}
			state.orderInfoShow = true
		}
		function exportFn(){
			exportDetail({applyId})
			.then(res=>{
				if(res.code == 200) window.open(res.data,'_blank')
			})
		}
    return {
      ...toRefs(state),
      sideBarWidth,
			orderInfoShowfn,
      mergeCells,
      closeDetail,
      refuse,
			exportFn,
      completet,
      applyTotalNum,
      closeBack,
      settlementData,
      completePaymentBack,
			toVerifyOrder,
			closeOrderInfo,
			authPath
    }
  }
}
</script>
<style lang='scss' scoped>
.buttonClass{
  cursor: default;
}
.tableFooter {
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border-left: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  border-bottom: 1px solid #e8eaec;
  background-color: #fffced;
  padding: 0 20px;
  display: flex;
  .div2 {
    flex: 2;
  }
  .div3 {
    flex: 3;
  }
  .shortInps {
    width: 140px;
  }
  .ml {
    margin-left: 20px;
  }
}
.detailList {
  margin-top: 70px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  z-index: 2;
  :deep(.el-descriptions__label) {
    width: 20%;
  }
}
.redColor {
  color: #f56c6c;
}
.blueColor {
  color: #1890ff;
}
.tableContainer {
  margin-top: 20px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  z-index: 2;
}
.detailHeader {
  position: fixed;
  line-height: 76px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  right: 0;
  top: 111px;
  font-size: 20px;
  width: calc(100% - v-bind(sideBarWidth));
  z-index: 99;
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.detailFooter {
  height: 52px;
  line-height: 52px;
  box-sizing: border-box;
  padding: 0 20px;
  width: calc(100% - v-bind(sideBarWidth));
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  border-top: 1px solid #e8ecef;
  z-index: 1000;
  text-align: right;
}
.skuP{
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
}
.warehousInfoContainer{
	text-align: left;
	span{
		margin: 0 20px;
	}
}
</style>
