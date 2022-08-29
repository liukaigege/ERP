<template>
  <div>
		<div v-show="!orderInfoShow">
			<erp-nav title="申请付款" :goBack="goBack" :combineType="combineType"></erp-nav>
			<div class="header">
				<span>【{{ partnerType(data.partnerType) }}】
					{{ supplierName(data.supplierName) }}</span>
				<span>{{ data.thirdId }}</span>
				<span>{{ fmtType(data) }}</span>
			</div>
			<div class="table-warp">
				<vxe-table border v-bind="applyTableOption" :data="dataSource" :span-method="colSpanMethond" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" :checkbox-config="{ checkField: 'checked' }" :edit-config="{
						trigger: 'click',
						mode: 'cell',
						activeMethod: activeCellMethod
					}" class="table" ref="applyRef">
					<vxe-column title="采购单号" min-width="200">
						<template #default="{ row }">
							<span style="color: #1890ff">{{ row.purchaseOrderNumber }}</span>
							<p>{{data.applyTime}}</p>
							<p>{{data.applyName}}</p>
							<p v-if="data.verifyNum" @click="toVerifyOrder(row)">对账单：<span style="color: #1890ff;cursor: pointer;">{{ data.verifyNum }}</span></p>
							<p>对账金额：&yen; {{(data.amount-0).toFixed(2)}}</p>
						</template>
					</vxe-column>
					<vxe-column field="sku" title="SKU" min-width="200">
						<template #default="{ row }">
							<div v-if="row.showType == 'list'">
								<p class="skuP" style="color: #1890ff" :title="row.sku">{{ row.sku }}</p>
								<el-button type="text" class="buttonClass" v-if="row.customization == '1'">定制</el-button>
							</div>
							<div v-else>
								<ul>
									<li class="warehousInfoContainer" v-for="(v,i) in row.warehousInfo" :key="i">
										<span>{{v.warehousSerialNum}}</span>
										<span>{{v.warehousTime}}</span>
										<span>数量/金额：{{v.warehousCount}}  / ￥{{ v.warehousAmount? (v.warehousAmount - 0).toFixed(2) : '0'}}</span>
									</li>
								</ul>
							</div>
						</template>
					</vxe-column>
					<vxe-column width="80" title="单价" align="center">
						<template #default="{ row }">
							<div style="display:flex;justify-content: center;">
								<span>￥{{ row.price }}</span>
								<div v-if="row.partsPrice && row.partsPrice?.length > 0">
									<span v-for="(v,i) in row.partsPrice" :key="i">/ ￥{{v}}</span>
								</div>
							</div>
						</template>
					</vxe-column>
					<vxe-column width="100" title="采购数量">
						<template #default="{ row }">
							<div style="display:flex;justify-content: center;">
								<span>{{ row.purchaseCount }}</span>
								<div v-if="row.partsNums && row.partsNums?.length > 0">
									<span v-for="(v,i) in row.partsNums" :key="i">/ {{v}}</span>
								</div>
							</div>

						</template>
					</vxe-column>
					<vxe-column title="配件金额" width="100">
						<template #default="{ row }">
							<!-- <div>{{row.customization != 1 ? '' : '￥'}} {{ row.customization != 1 ? '-' : row.partsPrice ? row.partsPrice : '0' }}</div> -->
							<div>{{ row.customization == 1 && row.partSwitch == 1 ? '￥' + (row.partsPrice - 0) : '-' }}</div>
						</template>
					</vxe-column>
          <vxe-column field="purchaseAmount" title="金额" width="80">
						<template #default="{ row }"> ￥{{ row.purchaseAmount }} </template>
					</vxe-column>
					<vxe-column width="100" title="到货数量">
						<template #default="{ row }">
							{{ row.storageCount }}
							<div v-if="row.storagePartsNums && row.storagePartsNums?.length > 0">
								<span v-for="(v,i) in row.storagePartsNums" :key="i">/ {{v}}</span>
							</div>
						</template>
					</vxe-column>
					<vxe-column field="storageAmount" title="到货金额" width="100">
						<template #default="{ row }"> ￥{{ row.storageAmount }} </template>
					</vxe-column>
					<vxe-column title="已付" width="100">
						<template #default="{ row }"> ￥{{ row.payAmount }} </template>
					</vxe-column>
					<vxe-column title="对账数量" width="100">
						<template #default="{ row }">
							{{ row.verifyAccount || 0 }}
							<div v-if="row.verifyPartsAccount || row.verifyPartsAccount?.length > 0">
								<span v-for="(v,i) in row.verifyPartsAccount" :key="i">/ {{v}} </span>
							</div>
						</template>
					</vxe-column>
					<vxe-column title="对账金额" width="100">
						<template #default="{ row }">
							￥{{ row.verifyAmount || 0 }}
							<div v-if="row.verifyPartsAmount || row.verifyPartsAmount?.length > 0">
								<span v-for="(v,i) in row.verifyPartsAmount" :key="i">/ ￥{{v}}</span>
							</div>
						</template>
					</vxe-column>
          <vxe-column title="本次对账金额" width="110">
						<template #default="{ row }"> ￥{{ row.verifyAmountNow?row.verifyAmountNow:'0' }} </template>
					</vxe-column>
					<vxe-column width="200" title="申请金额">
						<template #default="{ row }">
							<el-input :disabled="true" :style="row?.customization && row?.customization == 1 ? 'width:180px;' : ''" class="text-align" :placeholder="`申请 ￥${row.applyAmount}`"></el-input>
						</template>
					</vxe-column>
				</vxe-table>
				<div class="table-footer">
					<el-form ref="form" :model="formState" label-width="100px">
						<el-row>
							<el-col :span="6">
								<el-form-item label="运费（￥）：">
									<el-input-number v-model="fee" style="width: 100%" :min="0" :max="9999999.99" :controls="false" :disabled="isDisabled" :precision="2"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="6" :offset="3">
								<el-form-item label="折扣（￥）：">
									<el-input-number v-model="discount" style="width: 100%" :min="0" :controls="false" :disabled="isDisabled" :precision="2"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="6" :offset="3">
								<el-form-item label="税率（%）：">
									<el-input-number v-model="taxRate" style="width: 100%" :min="0" :controls="false" disabled :precision="2"></el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="6">
								<el-form-item label="应付：">
									<span>￥{{ totalAmount }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="实付：">
									<span>￥{{ totalGrandAmount }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="已付：" label-width="180px">
									<span>￥{{ (data.totalPayAmount - 0).toFixed(2) }} </span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="申请付款总金额：" label-width="180px">
									<!-- <span style="color: #fd4c60ff; font-size: 20px">￥{{ totalApplyAmount }}</span> -->
									<span style="color: #fd4c60ff; font-size: 20px">￥{{(data.amount-0).toFixed(2)}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div v-if="data.partnerType === 1" style="position: relative">
							<el-row v-for="(item, index) in payment" :key="index">
								<el-col :span="5">
									<el-form-item label="付款方式：">
										<el-select v-model="item.supplierPaymentId" placeholder="请选择" style="width: 100%" :disabled="isDisabled" @change="selectBankUserName">
											<el-option v-for="(item, index) in payments" :key="index" :label="item.bankUserName + '(' + item.bankAccount + ')'" :value="item.id"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="5" :offset="3">
									<el-form-item label="付款金额：" :rules="{
											required: true,
											message: '请输入付款金额',
											trigger: 'blur'
										}">
										<el-input-number v-model="item.payAmount" style="width: 100%" :min="0" :controls="false" :disabled="isDisabled"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="2">
									&nbsp;&nbsp;<el-button style="color:red;" v-if="!isDisabled && isShow && index!=0" type="text" @click="delRow(index)">删除</el-button>
									&nbsp;&nbsp;<el-button type="text" @click="add" :disabled="payments?.length == payment?.length" v-if="!isDisabled && isShow && index == 0">
										+ 增加
									</el-button>
								</el-col>
							</el-row>
							<!-- <div class="add-btn" @click="add" v-if="!isDisabled && isShow && payments?.length > payment?.length">
								+ 增加
							</div> -->
						</div>
					</el-form>
				</div>
			</div>
			<erp-footer v-if="isDisabled">
				<div class="footer">
					<div>
						<el-button @click="goBack">关 闭</el-button>
					</div>
				</div>
			</erp-footer>
			<erp-footer v-else>
				<div class="footer">
					<div>
						<el-button @click="goBack" >取消</el-button>
						<el-button @click="commit(0)"
							>{{ combineType == 2 ? '保存' : '保存草稿' }}
						</el-button>
						<el-button
							type="primary"
							@click="commit(1)"

							v-if="authPath('/v1/paymentRequestDetail/commit')"
							>提交审核</el-button
						>
					</div>
				</div>
			</erp-footer>
		</div>
		<div v-if="orderInfoShow">
			<OrderInfo :orderInfoForm="orderInfoForm" :pageType="2" @closeBack="closeOrderInfo"/>
		</div>
	</div>
</template>
<script>
import erpNav from './components/erpNav.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { applyTableOption } from '../composables/option.js'
import { reactive, toRefs, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { settlementTypeList } from '@/assets/js/staticData.js'
import { detailInfo, submitInfo } from '../composables/api.js'
import { QuestionFilled } from '@element-plus/icons-vue'
import OrderInfo from '@/views/financial/paymentApproval/components/orderInfo.vue'
import { authPath } from '@/utils/hooks'
import { deepCopy } from '@/utils/tool'
export default {
  components: { erpNav, erpFooter, QuestionFilled,OrderInfo },
  setup() {
    // reconciliationEdit
    const route = useRoute()
    const router = useRouter()
    let state = reactive({
			orderInfoShow:false,
			orderInfoForm:null,
      isDisabled: route.query.type == 1,
      formState: {},
      applyId: route.query.applyId,
      type: route.query.type,
      combineType: route.query.combineType,
      selectArr: [],
      dataSource: [],
      fee: 0,
      discount: 0,
      taxRate: 0,
      totalAmountResult: 0,
      isShow: false,
      payments: [],
      data: {},
      payment: [
        {
          supplierPaymentId: '',
          payAmount: 0
        }
      ],
    })

    function toVerifyOrder(row) {
      window.open(`#/purchase/purchaseManagement/reconciliationApplication/reconciliationEdit?id=${state.data.verifyId}&from=3`, '_blank')
    }
    let applyRef = ref(null)
    function goBack(v = 0) {
      router.push({
        name: 'PaymentRequest',
        params: {
          combineType: route.query.combineType,
          form: route.query.form,
          type: v
        }
      })
    }

    function applyAll(params) {
      state.dataSource.forEach(item => {
        item.applyAmount = item.remainAmount
      })
    }
    function commit(value) {
      applyRef.value.validate(true).then(res => {
        if (res) return
        if (checkData()) {
					let statusFlag = false
					state.payment.forEach((v,i)=>{
						if(state.payment.some((val,index)=>val.supplierPaymentId === v.supplierPaymentId && index != i)) statusFlag = true
					})
					if(statusFlag) return ElMessage.error('付款账号不能重复')
					if(totalApplyAmount - 0 <= 0)	return ElMessage.error('申请付款总金额必须大于0')
          const params = submitCommit(value)
          submitInfo(params).then(res => {
            if (res.code == 200) {
              goBack(1)
            } else {
              ElMessage.error(res.message)
            }
          })
        }
      })
    }
    function submitCommit(operation) {
      const apply = []
      state.selectArr.forEach(({ id, applyAmount }) => {
        apply.push({ id, applyAmount: Number(applyAmount) })
      })
      const params = {
        operation, //0保存草稿 1提交审核
        submitDTO: {
          applyId: Number(state.applyId),
          fee: state.fee || 0,
          discount: state.discount || 0,
          totalAmount: totalAmount.value || 0,
          grandAmount: totalGrandAmount.value || 0,
          apply,
          payment: state.payment
        }
      }
      return params
    }
    function checkData() {
      let rows = applyRef.value.getCheckboxRecords(true).filter(item => item.id)
      if (rows.length < 1) {
        ElMessage({
          message: '请选择至少一个采购SKU',
          type: 'error'
        })
        return false
      }
      if (totalApplyAmount.value < 0) {
        ElMessage({
          message: '申请付款总金额不能小于0',
          type: 'error'
        })
        return false
      }
      if (state.data.partnerType !== 1) return true
      let isSave = false
      let num = state.payment.reduce((total, next) => {
        if (next.payAmount < 0) isSave = true
        let payAmount = next.payAmount ?? 0
        return total + payAmount * 1
      }, 0)
      if (isSave) {
        ElMessage({
          message: '请填写付款金额',
          type: 'error'
        })
        return false
      } else if (num != totalApplyAmount.value) {
        ElMessage({
          message: '付款金额之和不等于申请付款总金额',
          type: 'error'
        })
        return false
      }
      return true
    }
    //选择付款方式
    function selectBankUserName() { }
    function add() {
      state.payment.push({
        bankUserName: '',
        payAmount: ''
      })
    }
		function delRow(index){
			const arr = deepCopy(state.payment)
			state.payment = arr.filter((v,i)=>i!=index)
		}

    function init() {
      detailInfo({ applyId: state.applyId }).then(res => {
        if (res.code == 200) {
					state.isShow = res.data.partnerType === 1
          const { detail, taxRate, payments, fee, discount, payment, purchaseOrderNumber,settlementType } =
            (state.data = res.data)
          state.payments = payments
          state.dataSource = []
					state.selectArr = []
          detail.forEach(item => {
            // 申请金额的集合
            if (item.applyAmount) {
              item.checked = true // 回显复选框选中
              state.selectArr.push(item)
            } else {
              item.checked = false
            }
            state.totalAmountResult =
              Math.round(
                (state.totalAmountResult + item.purchaseAmount) * 100
              ) / 100
          })
          detail.forEach(v => {
            v.purchaseOrderNumber = purchaseOrderNumber
            v.showType = 'list'
						v.settlementType = settlementType
            state.dataSource.push(v)
            if (v.warehousInfo) {
              const obj = {
                showType: 'inStore',
                warehousInfo: v.warehousInfo || []
              }
              state.dataSource.push(obj)
            }
          })
					if (state.isDisabled) state.selectArr = detail
          state.taxRate = taxRate
          state.fee = fee
          state.discount = discount
          state.totalAmountResult = 0
          state.payment = payment
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    const partnerType = computed(() => val => {
      //供应商类型 1合作供应商 21688 3淘宝 4拼多多
      switch (val) {
        case 1:
          return '合作供应商'
        case 2:
          return '1688'
        case 3:
          return '淘宝'
        case 4:
          return '拼多多'
      }
    })
    function selectAllEvent({ checked, records }) {
      state.selectArr = records
    }
    function selectChangeEvent({ checked, records }) {
      state.selectArr = records
    }
    //申请付款总金额
    const totalApplyAmount = computed(() => {
      let result = 0
			if (state.payment?.length) {
					state.payment.forEach(v=>{
						result += Number(v.payAmount)
					})
				}else{
					result = state.selectArr.reduce((pre,cur)=>pre + cur.applyAmount,0)
					result =
            Math.round((result + (state.fee ?? 0) - (state.discount ?? 0)) * 100) /
            100
				}
			if(result<0) result = 0
      return result
    })
    // 应付
    const totalAmount = computed(() => {
			return (state.data?.detail?.reduce((pre,cur) => ( cur.price * cur.purchaseCount + cur.partsPrice ) * ( 100 + cur.taxRate ) / 100 + pre, 0) + state.data?.fee).toFixed(2)
    })
    // 实付
    const totalGrandAmount = computed(() => {
			return (state.data?.detail?.reduce((pre,cur) => ( cur.price * cur.purchaseCount + cur.partsPrice ) * ( 100 + cur.taxRate ) / 100 + pre, 0) + state.data?.fee - state.data?.discount).toFixed(2)
    })
    const totalPayment = computed(() => {
      let result = state.payment.reduce((total, next) => {
        let payAmount = next.payAmount ?? 0
        return total + payAmount * 1
      }, 0)
      return result
    })
    function activeCellMethod({ columnIndex, row }) {
      if (state.type == 1) {
        if (columnIndex === 8) {
          return false
        }
      } else if (!row.checked) {
        return false
      }
      return true
    }
    function supplierName(val) {
      if (val?.length > 30) {
        return val.substring(0, 30) + '...'
      } else {
        return val
      }
    }
    const settlementType = val => {
      switch (val) {
        case 1:
          return '预付'
        case 2:
          return '账期'
        case 3:
          return '货到付款'
        case 4:
          return '款到发货'
      }
    }
    function fmtType(row) {
      if (!row) return ''
      let item = settlementTypeList.find(
        item => item.value == row.settlementType
      )
      if (row.settlementValue) {
        let unit = row.settlementUnit
          ? row.settlementUnit == 1
            ? '%'
            : '元'
          : '天'
        return `${item?.typeName} (${row.settlementValue}${unit})`
      }
      return item?.typeName
    }

    //合并表单单元格
    function colSpanMethond({ row, rowIndex, columnIndex }) {
      // row 当前行数据
      // rowIndex 当前行下标 起始值为0
      // columnIndex 当前列下标 起始值为0
      if (columnIndex === 0) {//第一列
        if (rowIndex === 0) {//第一行
          return { rowspan: state.dataSource.length, colspan: 1 } // 合并为一列
        } else {//第一行之外后面的数据（实际是空单元格）
          return { rowspan: 0, colspan: 0 } //合并为0列
        }
      } else {//第一列之外的行
        // if(rowIndex % 2 == 1){//偶数行，注意index起始值为0
        if (row.showType === 'inStore') {//偶数行，注意index起始值为0
          if (columnIndex == 1) {//第二列
            return { rowspan: 1, colspan: 12 } // 合并为一行
          } else if (columnIndex > 1) {//第二列后面的数据（实际是空单元格）
            return { rowspan: 0, colspan: 0 } //合并为0行
          }
        }
      }
    }

		function closeOrderInfo(){
			state.orderInfoShow = false
		}
		function queryInfo(row){
			state.orderInfoForm = {
				purchaseOrderNumber: null,
        purchaseOrderItemIds: [row.itemId-0],
        paymentItemIdList: [row.id-0]
			}
			state.orderInfoShow = true
		}

    onMounted(() => {
      init()
    })
    return {
			delRow,
			closeOrderInfo,
      colSpanMethond,
      applyTableOption,
      goBack,
      applyAll,
      commit,
			queryInfo,
      ...toRefs(state),
      add,
      applyRef,
      partnerType,
      totalApplyAmount,
      selectAllEvent,
      selectChangeEvent,
      totalAmount,
      totalGrandAmount,
      selectBankUserName,
      totalPayment,
      activeCellMethod,
      supplierName,
      settlementType,
      fmtType,
      toVerifyOrder
    }
  }
}
</script>
<style lang="scss" scoped>
.buttonClass{
  cursor: default;
}
.header {
  margin-top: 133px;
  background-color: #fff;
  line-height: 70px;
  padding: 0 30px;
  border-bottom: 1px dashed #e9e9e9;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  span + span {
    margin-left: 60px;
  }
}
.table-warp {
  background-color: #fff;
  padding: 25px;
  height: 600px;
}
.table-footer {
  background: rgba(255, 251, 230, 0.7);
  padding: 22px 25px 0 25px;
  .add-btn {
    cursor: pointer;
    line-height: 32px;
    color: #1890ff;
    margin-left: 15px;
    font-size: 14px;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 25px;
}
:deep(.header-rander) {
  position: relative;
  .vxe-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.text-align {
  :deep(.el-input__inner) {
    text-align: center;
  }
}
.add-btn {
  position: absolute;
  bottom: 16px;
  right: 33%;
}
.skuP {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.warehousInfoContainer {
  text-align: left;
  span {
    margin: 0 20px;
  }
}
</style>
