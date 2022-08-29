<template>
  <div>
    <div class="applay-block" v-show="!isShowSelectList">
      <erp-nav title='申请付款' :goBack='cancel'></erp-nav>
      <div class="step-warp">
        <el-steps :active="1" align-center>
          <el-step title="申请付款"></el-step>
          <el-step title="财务审批" status="wait"></el-step>
          <el-step title="完成付款"></el-step>
        </el-steps>
      </div>
      <div class="header">
        <span>{{formData.purchaseOrderNumber}}</span>
        <span>{{fmtSupplierPartnerTypes(formData)}}</span>
        <span v-if="formData.thirdId">{{formData.thirdId}}</span>
        <span>{{fmtType(formData)}}</span>
      </div>
      <div class="table-warp" v-setHeight:minHeight='80'>
        <vxe-table v-bind='applyTableOption' :data="tableData" ref="applyRef">
          <vxe-column type="checkbox" width="60"></vxe-column>
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
          <vxe-column field="sku" align="left" title="SKU" min-width="230"></vxe-column>
          <vxe-column field="price" title="单价(￥)" width="100">
            <!-- <template #header>
            <div>
              <span>单价(￥)</span>
              <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start" v-if="customization ==1">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template> -->
            <template #default="{row}">
              <!-- <div v-if="customization ==1">{{row.price}}/{{row.partsPrice?row.partsPrice?.join('/'):'-'}}</div> -->
              <div>{{row.price}}</div>
            </template>
          </vxe-column>
          <vxe-column field="purchaseCount" title="采购数量" width="100">
            <!-- <template #header>
            <div>
              <span>采购数量</span>
              <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start" v-if="customization ==1">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template> -->
            <template #default="{row}">
              <!-- <div v-if="customization ==1">{{row.purchaseCount}}/{{row.partsNums ? row.partsNums?.join('/') : '-'}}</div> -->
              <div>{{row.purchaseCount}}</div>
            </template>
          </vxe-column>
          <vxe-column field="partsPrice" title="配件金额(￥)" width="120">
            <template #default="{row}">{{row.partsPrice ? row.partsPrice : '-'}}</template>
          </vxe-column>
          <vxe-column field="purchaseAmount" title="金额(￥)" width="100">
            <template #default="{row}">
              {{row.purchaseAmount ? (row.purchaseAmount*1).toFixed(2): '-'}}
            </template>
          </vxe-column>
          <vxe-column field="storageCount" title="到货数量" width="100">
            <!-- <template #header>
            <div>
              <span>到货数量</span>
              <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start" v-if="customization ==1">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template> -->
            <template #default="{row}">
              <!-- <div v-if="customization ==1">{{row.storageCount}}/{{disposeCount(row)}}</div> -->
              <div>{{row.storageCount}}</div>
            </template>
          </vxe-column>
          <vxe-column field="storageAmount" title="到货金额(￥)" width="120">
            <template #default="{row}">
              {{row.storageAmount? (row.storageAmount*1).toFixed(2): '-'}}
            </template>
          </vxe-column>
          <vxe-column field="payAmount" title="已付(￥)" width="100"></vxe-column>
          <vxe-column field="remainAmount" title="剩余可申请金额(￥)" min-width="150">
            <template #default="{row}">
              {{row.remainAmount? (row.remainAmount*1).toFixed(2): '-'}}
            </template>
          </vxe-column>
          <vxe-column field='applyAmount' width="250">
            <template #header>
              <div>
                <span>申请金额(￥)</span>
                <span style="margin-left: 5px;color:#409eff;cursor: pointer;" @click="applyAll" v-if="tableData.every(item=>item.customization==0)">全部申请</span>
                <el-button v-if="tableData.some(v=>v.customization==1)" type="text" style="margin-left:20px;" @click="selectCustomizedOrder(tableData,true)">批量选择</el-button>
              </div>
            </template>
            <template #default="{row}">
              <div class="number-flex">
                <el-input-number v-model="row.applyAmount" @blur="validateApplyAmount(row)" style="width: 100%" :placeholder="'剩余可申请￥'+ (row.remainAmount*1).toFixed(2)" :disabled="(!row.isChecked && row.customization == 0) || row.customization != 0" :min="0" :max="9999999.99" :precision="2" :controls='false'></el-input-number>
                <p class="number-flex-button" v-if="row.customization != 0" @click="selectCustomizedOrder([row])">选择</p>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="table-footer">
          <el-form label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="运费(￥)：">
                  <vxe-input v-model.number="formData.fee" type="float" :min="0" :max="9999999.99" placeholder="请输入运费" :controls="false" @change="setAmount(formData)"></vxe-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="3">
                <el-form-item label="折扣(￥)：">
                  <vxe-input v-model.number="formData.discount" type="float" :min="0" :max="9999999.99" :controls="false" placeholder="请输入折扣" @change="setAmount(formData)"></vxe-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="3">
                <el-form-item label="税率(%)：">
                  <el-input-number v-model="formData.taxRate" style="width: 100%" disabled :min="0.00" :max="100" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="应付(￥)：">
                  <span>{{formData.totalAmount?(formData.totalAmount*1).toFixed(2): '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="实付(￥)：">
                  <span>{{formData.totalGrandAmount?(formData.totalGrandAmount*1).toFixed(2): '-'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已付(￥)：" label-width="180px">
                  <div>{{formData.totalPayAmount}}</div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请付款总金额(￥)：" label-width="180px">
                  <span>{{totalAmount}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form ref="formRef" :model="paymentList">
            <el-row v-for="(item,i) in paymentList" :key="item.supplierPaymentId">
              <el-col :span="6">
                <el-form-item label="付款方式：">
                  <el-select v-model="item.supplierPaymentId" style="width: 100%">
                    <el-option v-for="item in formData.payments" :key="item.id" :label="item.bankUserName + '(' + item.bankAccount +')'" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="3">
                <el-form-item label="付款金额(￥)：" :prop="i+'.payAmount'" :rules="{required: true,message: '请输入付款金额',trigger: 'blur'}">
                  <div class="add-btn">
                    <el-input-number v-model="item.payAmount" style="width: 100%;margin-right: 15px" :min="0.00" :max="9999999.99" :precision="2" :controls="false"></el-input-number>
                    <el-button type="text" @click="del(i)" class="color-danger" v-if="i>0">删除</el-button>
                    <el-button type="text" @click="add" v-if="i == 0" :disabled='paymentList.length >= formData.payments.length'>增加</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <erp-footer>
        <div class="footer">
          <div>
            <el-button @click="cancel">取消</el-button>
            <el-button @click="commit(0)">保存草稿</el-button>
            <el-button type="primary" @click="commit(1)">提交审核</el-button>
          </div>
        </div>
      </erp-footer>
    </div>
    <PurchaseOrderInformation v-if="isShowSelectList" :params="selectParams" @closeEvent="isShowSelectList = false" @fillPrice="fillRowPrice" />
  </div>
</template>
<script>
import erpNav from '@/components/erpNav/index.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { applyTableOption } from './composables/options.js'
import { reactive, ref, computed, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { moreDetailSave, moreDetail } from '@/api/purchase/order.js'
import { settlementTypeList } from '@/assets/js/staticData.js'
import { fmtSupplierPartnerTypes } from './composables/comFun.js'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PurchaseOrderInformation from './purchaseOrderInformation.vue'
export default {
  components: { erpNav, erpFooter, QuestionFilled, PurchaseOrderInformation },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let ids = (route.query.id + '').split(',')
    let customization = route.query.customization
    let state = reactive({
      tableData: [],
      formData: { detail: [] },
      paymentList: []
    })
    let isShowSelectList = ref(false)
    let selectParams = reactive({
      purchaseOrderNumber: null,
      // purchaseOrderItemId: null,
      checkedList: [],
      purchaseOrderItemIds: null,
      paymentItemIdList: null,
      isBatch: false
    })
    let checkedInfo = reactive([])
    let applyRef = ref(null)
    let formRef = ref(null)
    // 获取数据
    moreDetail({ ids: ids }).then(({ data }) => {
      let info = data.map((item) => {
        let arr = Object.assign(item, { initialDiscount: item.discount, initialFee: item.fee, initialTotalGrand: item.totalGrandAmount, initialTotal: item.totalAmount })
        return arr
      })
      state.tableData = info[0].detail
      state.tableData.forEach(item => {
        item.purchaseOrderNumber = info[0].purchaseOrderNumber
        item.applyAmount = undefined
      })
      if (info[0].payment?.length > 0) {
        state.paymentList = info[0].payment
      } else if (info[0].payments?.length > 0) {
        state.paymentList.push({
          supplierPaymentId: info[0].payments[0]?.id,
          payAmount: undefined
        })
      }
      delete info[0].detail
      state.formData = info[0]
    })
    let totalAmount = computed(() => {
      return (state.tableData.filter(item => item.isChecked).reduce((total, next) => {
        return total + (next.applyAmount ? next.applyAmount * 1 : 0)
      }, state.formData.fee - state.formData.discount)).toFixed(2)
    })

    function setAmount(row) {
      let { initialDiscount, initialFee, fee, discount } = row
      row.totalAmount = row.initialTotal * 1 - initialFee * 1 + fee * 1
      row.totalGrandAmount = row.initialTotalGrand * 1 - initialFee * 1 + fee * 1 + initialDiscount * 1 - discount * 1
    }
    function fmtType(row) {
      if (!row) return ''
      let item = settlementTypeList.find(item => item.value == row.settlementType)
      if (row.settlementValue) {
        let unit = row.settlementUnit ? row.settlementUnit == 1 ? '%' : '元' : '天'
        return `${item?.typeName} ( ${row.settlementValue}${unit})`
      }
      return item?.typeName
    }

    function applyAll() {
      let rows = applyRef.value.getCheckboxRecords(true).filter(item => item.id)
      rows.forEach(item => {
        item.applyAmount = item.remainAmount
      })
    }

    function disposeCount(row) {
      if (row.storagePartsNums != null) {
        if (!row.storagePartsNums.length) {
          const numList = row.partsNums ? row.partsNums.map(item => item * 0) : []
          return numList.join('/')
        } else {
          return row.storagePartsNums?.join('/')
        }
      } else {
        return 0
      }

    }

    function cancel() {
      router.push({
        name: 'PurchaseOrders',
        params: {
          status: route.query.status
        }
      })
      selectParams.checkedList = []
    }

    function getParams() {
      let apply = state.tableData.map(item => {
        return {
          itemOrderIds: item.isChecked ? item.itemOrderIds : [],
          id: item.id,
          sign: item.isChecked ? 1 : 0,
          applyAmount: item.isChecked ? item.applyAmount : 0
        }
      })
      return Object.assign({}, state.formData, { apply }, { payment: state.paymentList })
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
      if (state.formData.partnerType == 1) {  // 合作供应商
        let arr = new Set(state.paymentList.map(item => item.supplierPaymentId))
        if (arr.size < state.paymentList.length) {
          ElMessage({
            message: '付款账号不能重复',
            type: 'error'
          })
          return false
        }
        let num = state.paymentList.reduce((total, next) => {
          let payAmount = next.payAmount ?? 0
          return total + payAmount * 1
        }, 0)
        if (num != totalAmount.value) {
          ElMessage({
            message: '付款金额之和不等于申请付款总金额',
            type: 'error'
          })
          return false
        }
      }
      if (totalAmount.value < 0) {
        ElMessage({
          message: '申请付款总金额不能为负数',
          type: 'error'
        })
        return false
      }
      return true
    }

    function validateApplyAmount(row) {
      applyRef.value.validate(row)
      setTimeout(() => {
        applyRef.value.clearValidate("applyAmount")
      }, 2000)
    }

    function commit(operation) {
      Promise.all([applyRef.value.validate(true), formRef.value.validate()]).then(res => {
        if (res[0]) {
          return setTimeout(() => {
            applyRef.value.clearValidate()
          }, 2000)
        }
        if (!checkData()) return
        let params = getParams()
        moreDetailSave({ operation, type: 1, submitDTOS: [params] }).then(() => {
          cancel()
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
        })
      })
      // .catch(err => {
      //   const { message, timeId } = err
      //   clearTimeout(timeId)
      //   return ElMessage.error(message??'操作失败')
      // })
    }
    function add() {
      let ids = state.paymentList.map(item => item.supplierPaymentId)
      let item = state.formData.payments.find(item => !ids.includes(item.id))
      state.paymentList.push({
        supplierPaymentId: item.id,
        payAmount: undefined
      })
    }
    function del(i) {
      state.paymentList.splice(i, 1)
    }
    function focus({ el }) {
      el.querySelector('.el-input__inner').focus()
    }

    function selectCustomizedOrder(list, status = false) {
      isShowSelectList.value = true
      selectParams.purchaseOrderNumber = null
      selectParams.purchaseOrderItemIds = list.map(v => v.id - 0)//id和itemId相同，全部取id即可，后端重复命名
      selectParams.paymentItemIdList = list.map(v => v.id - 0)
      selectParams.isBatch = status // 是否是批量按钮
    }
    // 定制品计算完价格后填充到对应的sku数据中
    function fillRowPrice({ selectArr, isBatch }) {
      if (isBatch) {
        checkedInfo = selectArr
      } else {
        const simpleItem = selectArr[0] || null
        const someIndex = checkedInfo.findIndex(son => son.id === simpleItem.id)
        if (someIndex > -1) {
          checkedInfo.splice(someIndex, 1, simpleItem)
        } else {
          checkedInfo.push(simpleItem)
        }
      }
      state.tableData.forEach(item => {
        const row = checkedInfo.find(v => v.id == item.id)
        if (row) {
          const taxRate = state.formData?.taxRate ? state.formData.taxRate : 0
					console.log(taxRate,item.taxRate)
          item.applyAmount = Number((row.sum * (1 + taxRate / 100)).toFixed(2))
          item.itemOrderIds = row.ids
        } else {
          item.applyAmount = null
          item.itemOrderIds = []
        }
      })
      setTimeout(() => {
        selectParams.checkedList = checkedInfo.map(item => item.ids).flat()
        isShowSelectList.value = false
      }, 500)
    }

    return {
      applyTableOption,
      applyAll,
      cancel,
      commit,
      applyRef,
      add,
      fmtType,
      totalAmount,
      ...toRefs(state),
      setAmount,
      fmtSupplierPartnerTypes,
      del, focus,
      formRef,
      customization,
      disposeCount,
      selectCustomizedOrder,
      fillRowPrice,
      selectParams,
      isShowSelectList,
      validateApplyAmount,
      checkedInfo
    }
  }
}

</script>
<style lang="scss" scoped>
.step-warp {
  margin: 0 -25px;
  background-color: #fff;
  padding: 15px;
}
.header {
  margin-top: 25px;
  background-color: #fff;
  line-height: 70px;
  padding: 0 30px;
  border-bottom: 1px dashed #e9e9e9;
  color: rgba(0, 0, 0, 0.65);
  span + span {
    margin-left: 60px;
  }
}
.table-warp {
  background-color: #fff;
  padding: 25px;
}
.number-flex {
  display: flex;
  .number-flex-button {
    width: 15%;
    margin-left: 5%;
    color: #409eff;
    line-height: 32px;
    cursor: pointer;
  }
}
.add-btn {
  display: flex;
}
.table-footer {
  background: rgba(255, 251, 230, 0.7);
  padding: 22px 25px 0 25px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 25px;
}
</style>
