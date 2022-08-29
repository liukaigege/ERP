<template>
  <div>
    <div v-show="!orderInfoShow">
      <erp-nav title="申请付款" :goBack="goBack" :combineType="combineType"></erp-nav>
      <div class="header">
        <span>{{ data.purchaseOrderNumber }}</span>
        <span>【{{ partnerType(data.partnerType) }}】
          {{ supplierName(data.supplierName) }}</span>
        <span>{{ data.thirdId }}</span>
        <span>{{ fmtType(data) }}</span>
      </div>
      <div class="table-warp">
        <vxe-table v-bind="applyTableOption" :data="dataSource" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" :checkbox-config="{ checkField: 'checked' }" :edit-config="{
						trigger: 'click',
						mode: 'cell',
						activeMethod: activeCellMethod
					}" class="table" ref="applyRef">
          <vxe-column type="checkbox" width="60" v-if="!isDisabled"></vxe-column>
          <vxe-column width="100" :show-overflow="false">
            <template #default="{row}">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.skuMainImage" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 80px; padding: 5px 0" :src="row.skuMainImage" fit="contain"></el-image>
                </template>
              </el-popover>
            </template>
          </vxe-column>
          <vxe-column field="sku" title="SKU" min-width="80" show-overflow="tooltip">
            <template #default="{ row }">
              <span style="color: #1890ff">{{ row.sku }}</span>
              <p>{{row.customization?'定制':''}}</p>
            </template>
          </vxe-column>
          <vxe-column field="price" title="单价">
            <template #default="{ row }"> ￥{{ row.price }} </template>
          </vxe-column>
          <vxe-column field="purchaseCount" title="采购数量"></vxe-column>
          <vxe-column title="配件金额" width="80">
            <template #default="{ row }">
              <!-- <div>{{row.customization != 1 ? '' : '￥'}} {{ row.customization != 1 ? '-' : row.partsPrice ? row.partsPrice : '0' }}</div> -->
              <div>{{ row.customization == 1 && row.partSwitch == 1 ? '￥' + (row.partsPrice - 0) : '-' }}</div>
            </template>
          </vxe-column>
          <vxe-column field="purchaseAmount" title="金额" width="80">
            <template #default="{ row }"> ￥{{ row.purchaseAmount }} </template>
          </vxe-column>
          <vxe-column field="storageCount" title="到货数量"></vxe-column>
          <vxe-column field="storageAmount" title="到货金额">
            <template #default="{ row }"> ￥{{ row.storageAmount }} </template>
          </vxe-column>
          <vxe-column title="已付">
            <template #default="{ row }"> ￥{{ row.payAmount }} </template>
          </vxe-column>
          <vxe-column field="remainAmount" title="剩余可申请金额">
            <template #default="{ row }"> ￥{{ row.remainAmount }} </template>
          </vxe-column>
          <!-- <vxe-column field="applyAmount" width="200" header-class-name="header-rander" :edit-render="{
							name: '$input',
							immediate: true,
							props: { type: 'float', min: 0, max: 9999.99, controls: false }
						}"> -->
          <vxe-column field="applyAmount" width="200" header-class-name="header-rander">
            <template #header>
              <div>
                <span style="margin-right: 15px">申请金额</span>
                <el-button type="text" style="min-height: 20px; padding: 0" v-if="!isDisabled&&dataSource.some(v=>v?.customization == 0)" @click="applyAll">全部申请</el-button>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                <el-input :min="0" :max="9999.99" @input="changeNum(row)" :precision="2" :controls='false' :disabled="isDisabled || row.customization == 1 || !row.checked" v-model.number="row.applyAmount" type="number" class="text-align" :placeholder="`剩余可申请￥${row.remainAmount}`"></el-input>
                <!-- <el-input :min="0" :max="9999.99" :disabled="isDisabled || (!row.checked || row.customization == 1) " v-model="row.applyAmount" class="text-align" :placeholder="`剩余可申请￥${row.remainAmount}`"></el-input> -->
              </div>
            </template>
          </vxe-column>
          <vxe-column width="100" v-if="dataSource.some(v=>v?.customization == 1)">
						<template #header>
                <el-button type="text" @click="queryOrderList">批量选择</el-button>
            </template>
            <template #default="{ row }">
              <el-button v-if="row?.customization == 1" v-permission="'paymentRequestDetailQuery'" type="text" @click="queryInfo(row)">{{combineType==0||combineType==2 ? '选择' : '查看'}}</el-button>
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
                  <span>￥{{ (data.totalPayAmount-0).toFixed(2) }} </span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请付款总金额：" label-width="180px">
                  <span style="color: #fd4c60ff; font-size: 20px">￥{{ totalApplyAmount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="data.partnerType === 1" style="position: relative">
              <el-row v-for="(item, index) in payment" :key="item.supplierPaymentId">
                <el-col :span="5">
                  <el-form-item label="付款方式：">
                    <el-select v-model="item.supplierPaymentId" placeholder="请选择" style="width: 100%" :disabled="isDisabled" @change="selectBankUserName">
                      <el-option v-for="sonItem in payments" :key="sonItem.id" :label="sonItem.bankUserName + '(' + sonItem.bankAccount + ')'" :value="sonItem.id"></el-option>
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
            </div>
          </el-form>
        </div>
      </div>
      <erp-footer>
        <div class="footer">
          <div v-if="!isDisabled">
            <el-button @click="goBack">取消</el-button>
            <el-button @click="commit(0)">{{ combineType == 2 ? '保存' : '保存草稿' }}
            </el-button>
            <el-button type="primary" @click="commit(1)" v-if="authPath('/v1/paymentRequestDetail/commit')">提交审核</el-button>
          </div>
          <div v-else>
            <el-button @click="goBack">关闭</el-button>
          </div>
        </div>
      </erp-footer>
    </div>
    <div v-if="orderInfoShow">
      <OrderInfo :isChecked="combineType==0||combineType==2" :checkedInfo="checkedInfo" :orderInfoForm="orderInfoForm" :rowData="rowData" :pageType="2" @closeBack="closeOrderInfo" :isShowStatus="combineType == 1 ||combineType == 3" />
    </div>
  </div>
</template>
<script>
import erpNav from './components/erpNav.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { applyTableOption } from '../composables/option.js'
import { reactive, toRefs, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { settlementTypeList } from '@/assets/js/staticData.js'
import { detailInfo, submitInfo } from '../composables/api.js'
import OrderInfo from '@/views/financial/paymentApproval/components/orderInfo.vue'
import { authPath } from '@/utils/hooks'
import { deepCopy } from '@/utils/tool'
export default {
  name: 'PaymentRequestDeatil',
  components: { erpNav, erpFooter, OrderInfo },
  setup() {
    const route = useRoute()
    const router = useRouter()
    let state = reactive({
      orderInfoShow: false,
      orderInfoForm: null,
      isDisabled: route.query.type == 1,
      querySettlementType: route.query.settlementType || 0,
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
      rowData: null,
			checkedInfo:[]
    })
    let applyRef = ref(null)
		// query select orders data list
		function queryOrderList(){
			state.orderInfoForm = {
				purchaseOrderNumber: null,
				purchaseOrderItemIds: state.dataSource.map(v=>v.itemId-0),
				paymentItemIdList: state.dataSource.map(v=>v.id-0)
			}
			state.orderInfoShow = true
		}


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
    //申请付款总金额
    const totalApplyAmount = computed(() => {
      let result = 0
      if (state.dataSource[0]?.settlementType === 2) {
        if (state.payments.length) {
          state.payment.forEach(v => {
            result += Number(v.payAmount)
          })
        }
      } else {
        if (state.isDisabled) {
          result = state.dataSource.reduce((pre, cur) => pre + cur.applyAmount, 0)
          result =
            Math.round((result + (state.fee ?? 0) - (state.discount ?? 0)) * 100) /
            100
        } else {
          state.selectArr.forEach(item => {
            result = Math.round((result + Number(item.applyAmount)) * 100) / 100
          })
          result =
            Math.round((result + (state.fee ?? 0) - (state.discount ?? 0)) * 100) /
            100
          //payments 只有一个时  付款金额为固定值  等于申请付款总金额
          if (state.payments.length == 1) {
            state.payment.payAmount = result
          }
        }
      }
      if (result < 0) result = 0
      return (result - 0).toFixed(2)
    })
    // 应付
    const totalAmount = computed(() => {
      return (state.data?.detail?.reduce((pre, cur) => (cur.price * cur.purchaseCount + cur.partsPrice) * (100 + cur.taxRate) / 100 + pre, 0) + state.data?.fee).toFixed(2)
    })
    function applyAll(params) {
      state.dataSource.forEach(item => {
        item.applyAmount = item.remainAmount
				changeNum(item)
      })
    }
    function commit(value) {
      applyRef.value.validate(true).then(res => {
        if (res) return
        if (checkData()) {
          let statusFlag = false
          state.payment.forEach((v, i) => {
            if (state.payment.some((val, index) => val.supplierPaymentId === v.supplierPaymentId && index != i)) statusFlag = true
          })
          if (statusFlag) return ElMessage.error('付款账号不能重复')
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
		function changeNum(row){
			if(String(row.applyAmount).split('.')[1]?.length>2) row.applyAmount = Math.floor(row.applyAmount*100)/100
			applyRef.value.validate(row)
		}
    function submitCommit(operation) {
      const apply = []
      state.selectArr.forEach(({ id, applyAmount, itemOrderIds }) => {
        apply.push({ id, applyAmount: Number(applyAmount), sign: 1, itemOrderIds })
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
      } else if (num.toFixed(2) * 1 != totalApplyAmount.value) {
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
      let ids = state.payment.map(item => item.supplierPaymentId)
      let payment = state.payments.find(item => !ids.includes(item.id))
      state.payment.push({
        supplierPaymentId: payment.id,
        payAmount: undefined,
        id: undefined
      })
    }
    function delRow(index) {
      const arr = deepCopy(state.payment)
      state.payment = arr.filter((v, i) => i != index)
    }

    function init() {
      detailInfo({ applyId: state.applyId }).then(res => {
        if (res.code == 200) {
          state.isShow = res.data.partnerType === 1
          const { detail, taxRate, payments, fee, discount, payment, purchaseOrderNumber } =
            (state.data = res.data)
          state.selectArr = []
          detail.forEach(item => {
            item.purchaseOrderNumber = purchaseOrderNumber
            // 申请金额的集合
            if (item.sign) {
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
          if (state.isDisabled) state.selectArr = detail
          state.payments = payments
          state.dataSource = detail
          state.taxRate = taxRate
          state.fee = fee
          state.discount = discount
          state.totalAmountResult = 0
          if (payment.length) state.payment = payment

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

    // 实付
    const totalGrandAmount = computed(() => {
      const result = state.data.totalGrandAmount +
        (state.fee || 0) -
        (state.data.fee ?? 0) -
        (state.discount || 0) +
        (state.data.discount ?? 0)
      return result.toFixed(2)
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
    function closeOrderInfo(val,list = null) {
      if (val && val.length) {
				if(state.orderInfoForm?.purchaseOrderItemIds?.length>1){
					//批量选择
					state.dataSource.forEach(v => {
						if (val.some(it=>it.itemId == v.itemId)) {
							const arr = val.filter(it=>it.itemId == v.itemId)
							const priceNumber = arr.reduce((prev, cur) => prev + ((cur.goodsPrice * cur.goodsQuantity) + cur.partTotalPrice), 0) // 单价*数量+配件金额
							v.applyAmount = ((state.data.taxRate / 100 + 1) * priceNumber).toFixed(2) - 0
							v.itemOrderIds = arr.map(it => it.id)
						}else{
							v.applyAmount = null
							v.itemOrderIds = []
						}
					})
				}else{
					//单个选择
					const priceNumber = val.reduce((prev, cur) => prev + ((cur.goodsPrice * cur.goodsQuantity) + cur.partTotalPrice), 0) // 单价*数量+配件金额
					state.dataSource.find(v => {
						if (val.some(a=>a.itemId == v.itemId)) {
							v.applyAmount = ((state.data.taxRate / 100 + 1) * priceNumber).toFixed(2) - 0
							v.itemOrderIds = val.map(it => it.id)
						}
					})
				}
      }
			if(!!list) state.checkedInfo = list
      state.orderInfoShow = false
    }
    function queryInfo(row) {
      state.rowData = row
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
			queryOrderList,
			changeNum,
      delRow,
      closeOrderInfo,
      applyTableOption,
      goBack,
      applyAll,
      commit,
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
      queryInfo,
      authPath
    }
  }
}
</script>
<style lang="scss" scoped>
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
  padding: 22px 25px 100px 25px;
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
</style>
