<template>
  <div>
    <div class="applay-block" v-show="!isShowSelectList">
      <erp-nav title='申请付款' :goBack="goBack"></erp-nav>
      <div class="step-warp">
        <el-steps :active="1" align-center>
          <el-step title="申请付款"></el-step>
          <el-step title="财务审批" status="wait"></el-step>
          <el-step title="完成付款"></el-step>
        </el-steps>
      </div>
      <div class="table-warp" v-setHeight:minHeight='80'>
        <vxe-table v-bind='batchTableOption' @checkbox-change="checkboxChange" ref='batchTableRef'>
          <vxe-column type="checkbox" width='40' :class-name="setSkuClass"></vxe-column>
          <vxe-column width="100">
            <template #default="{row}">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.skuMainImage" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 80px; padding: 5px 0" :src="row.skuMainImage" fit="contain"></el-image>
                </template>
              </el-popover>
            </template>
          </vxe-column>
          <vxe-column align="left" title="SKU" min-width="230" :class-name="setSkuClass">
            <template #default='{row}'>
              <div v-if="row.detail" style="margin-right: 45px">
                <el-row>
                  <el-col :span="6">采购单号：<span style="color: #1890FF">{{row.purchaseOrderNumber}}</span></el-col>
                  <el-col :span="8">{{fmtSupplierPartnerTypes(row)}}</el-col>
                  <el-col :span="6" v-if="row.thirdId">{{row.thirdId}}</el-col>
                  <el-col :span="4">{{fmtType(row)}}</el-col>
                </el-row>
              </div>
              <div v-else-if="row.info">
                <el-form :model="row.info" v-bind="applyForm" class="inline-table-form">
                  <el-form-item label="运费(￥):" prop="fee">
                    <vxe-input v-model="row.info.fee" type="float" :min="0" :max="9999999.99" placeholder="请输入运费" :controls="false" @change="setAmount(row.info)"></vxe-input>
                  </el-form-item>
                  <el-form-item label="折扣(￥):" prop="discount">
                    <vxe-input v-model="row.info.discount" type="float" :min="0" :max="9999999.99" :controls="false" placeholder="请输入折扣" @change="setAmount(row.info)"></vxe-input>
                  </el-form-item>
                  <el-form-item label="税率(%):">
                    <el-input-number v-model="row.info.taxRate" placeholder="请输入税率" :controls="false" disabled></el-input-number>
                  </el-form-item>
                  <el-form-item label="应付(￥):">
                    <span>{{row.info.totalAmount ? (row.info.totalAmount*1).toFixed(2) : '-'}}</span>
                  </el-form-item>
                  <el-form-item label="实付(￥):">
                    <span>{{row.info.totalGrandAmount ? (row.info.totalGrandAmount*1).toFixed(2) : '-'}}</span>
                  </el-form-item>
                  <el-form-item label="已付(￥):">
                    <div>{{row.info.totalPayAmount}}</div>
                  </el-form-item>
                  <el-form-item label="付款方式:" style="width: 400px" v-if="row.info.partnerType === 1">
                    <el-select v-model="row.info.paymentId" style="width: 100%">
                      <el-option v-for="item in row.info.payments" :key="item.id" :label="item.bankUserName + '(' + item.bankAccount +')'" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div style="color: #1890FF;text-align: left" v-else>
                <div>{{row.sku}}</div>
                <div v-if="row.customization == 1">
                  <span style="color:#409EFF;cursor: pointer;">定制</span>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="price" title="单价(￥)" width="100">
            <!-- <template #header>
              <div>
                <span>单价</span>
                <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template> -->
            <template #default="{row}">
              <!-- <div v-if="row.customization ==1">{{row.price}}/{{row.partsPrice?row.partsPrice?.join('/'):'-'}}</div> -->
              <div>{{row.price}}</div>
            </template>
          </vxe-column>
          <vxe-column field="purchaseCount" title="采购数量" width="100">
            <!-- <template #header>
              <div>
                <span>采购数量</span>
                <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template> -->
            <template #default="{row}">
              <!-- <div v-if="row.customization ==1">{{row.purchaseCount}}/{{row.partsNums ? row.partsNums?.join('/') : '-'}}</div> -->
              <div>{{row.purchaseCount}}</div>
            </template>
          </vxe-column>
          <vxe-column field="partsPrice" title="配件金额(￥)" width="120">
            <template #default="{row}">{{row.partsPrice ? row.partsPrice : '-'}}</template>
          </vxe-column>
          <vxe-column field="purchaseAmount" title="金额(￥)" width="100">
            <template #default="{row}">
              {{row.purchaseAmount? (row.purchaseAmount*1).toFixed(2): '-'}}
            </template>
          </vxe-column>
          <vxe-column field="storageCount" title="到货数量" width="100">
            <!-- <template #header>
              <div>
                <span>到货数量</span>
                <el-tooltip class="box-item" effect="dark" content="主件/配件" placement="top-start">
                  <el-icon>
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template> -->
            <template #default="{row}">
              <!-- <div v-if="row.customization ==1">{{row.storageCount}} / {{row.storagePartsNums?.join('/')}}</div> -->
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
                <span style="margin-left: 5px;color:#409eff;cursor: pointer;" @click="applyAll" v-if="isShowApplyAll">全部申请</span>
                <el-button v-if="info.some(v=>v.detail.some(val=>val.customization==1))" type="text" style="margin-left:20px;" @click="selectCustomizedOrder(info,true)">批量选择</el-button>
              </div>
            </template>
            <template #default="{row}">
              <div class="number-flex">
                <el-input-number v-model="row.applyAmount" @blur="validateApplyAmount(row)" style="width: 80%" :placeholder="'剩余可申请￥'+ (row.remainAmount*1).toFixed(2)" :disabled="(!row.isChecked && row.customization == 0) || row.customization != 0" :min="0" :max="9999999.99" :precision="2" :controls='false'></el-input-number>
                <p class="number-flex-button" v-if="row.customization != 0" @click="selectCustomizedOrder([row])">选择</p>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <erp-footer>
        <div class="footer">
          <div>
            <span style="color: rgba(0, 0, 0, 0.65)">申请付款总金额：</span>
            <span style="color: red">￥{{totalAmount}}</span>
          </div>
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
import { batchTableOption, applyForm } from './composables/options.js'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, computed, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { moreDetailSave, moreDetail } from '@/api/purchase/order.js'
import { settlementTypeList } from '@/assets/js/staticData.js'
import { fmtSupplierPartnerTypes } from './composables/comFun.js'
import { QuestionFilled } from '@element-plus/icons-vue'
import PurchaseOrderInformation from './purchaseOrderInformation.vue'
import { deepCopy } from '@/utils/tool'
import CustomInfo from './components/customInfo.vue'
export default {
  components: { erpNav, erpFooter, QuestionFilled, PurchaseOrderInformation },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let ids = (route.query.id + '').split(',')
    let batchTableRef = ref(null)
    let isShowSelectList = ref(false)
    let isShowApplyAll = ref(false)
    let checkedInfo = reactive([])
    let info = reactive([])
    let selectParams = reactive({
      purchaseOrderNumber: null,
      purchaseOrderItemId: null,
      checkedList: [],
      purchaseOrderItemIds: null,
      paymentItemIdList: null,
      isBatch: false
    })
    moreDetail({ ids }).then(({ data }) => {
      const cloneData = deepCopy(data) || []
      isShowApplyAll.value = cloneData.map(ite => ite.detail).flat().some(it => it.customization == 0) // 返回数据含有普货的时候才显示全部申请按钮
      let arr = cloneData.map((item) => {
        let arr = Object.assign(item, { initialDiscount: item.discount, initialFee: item.fee, initialTotalGrand: item.totalGrandAmount, initialTotal: item.totalAmount, detail: [...item.detail] })
        let paymentId = item.payments[0]?.id
        item.detail.push({ info: Object.assign(arr, { paymentId }) })
        return item
      })
      info = Object.assign(info, arr)
      info.forEach(item => {
        item.detail.forEach(sub => {
          sub.applyAmount = undefined
          sub.purchaseOrderNumber = item.purchaseOrderNumber
        })
      }) // null 变为 undefined
      batchTableRef.value.loadData(info)
    })

    function setRefs(el) {
      if (el) applyFormRefs.value.push(el)
    }
    let totalAmount = computed(() => {
      let num = 0
      info.forEach(item => {
        num = num * 1 + (item.fee ?? 0) * 1 - (item.discount ?? 0) * 1
        item.detail.forEach(sku => {
          if (sku.isChecked && sku.id) num = num * 1 + (sku.applyAmount ?? 0) * 1
        })
      })
      return num.toFixed(2)
    })
    //  用来 优化table全选功能的，与业务无关
    function checkboxChange({ checked, row }) {
      if (row.detail) return  // 不是子节点，直接返回
      let item = info.find(item => {
        return item.detail.some(child => child.id == row.id)
      })
      let flag = item.detail.every((child, i) => { // 判定是否除了最后一个节点都已经选中
        return child.isChecked === checked || (i === item.detail.length - 1)
      })
      if (flag) batchTableRef.value.setCheckboxRow(item.detail[item.detail.length - 1], checked)
    }
    function setSkuClass({ row }) {
      if (row.detail) return 'sku-content'
      if (row.info) return 'form-content'
    }
    function applyAll() {
      let rows = batchTableRef.value.getCheckboxRecords(true).filter(item => item.id && item.customization == 0)
      rows.forEach(item => {
        item.applyAmount = item.remainAmount
      })
    }

    function selectCustomizedOrder(list, status = false) {
      if (status) {
        var list = []
        info.forEach(v => {
          v.detail.forEach(val => {
            if (!val.info) list.push(val)
          })
        })
      }
      isShowSelectList.value = true
      selectParams.purchaseOrderNumber = null
      selectParams.purchaseOrderItemIds = list.map(v => v.id - 0)//id和itemId相同，全部取id即可，后端重复命名
      selectParams.paymentItemIdList = list.map(v => v.id - 0)
      selectParams.isBatch = status // 是否是批量按钮
    }

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

    function goBack() {
      router.go(-1)
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
      return info.map(item => {
        let apply = item.detail.filter(sku => sku.id).map(_item => {
          return {
            itemOrderIds: _item.isChecked ? _item.itemOrderIds : [],
            id: _item.id,
            sign: _item.isChecked ? 1 : 0,
            applyAmount: _item.isChecked ? _item.applyAmount : 0
          }
        })
        let obj = Object.assign({}, item)
        delete obj.detail
        delete obj.payments
        return {
          ...obj,
          operation: 0,
          type: 0,
          payment: [{ supplierPaymentId: item.paymentId }],
          apply
        }
      })
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
      info.forEach(item => {
        item.detail.forEach(it => {
          const row = checkedInfo.find(v => v.id == it.id)
          if (it.id && row) {
            const taxRate = item.taxRate ? item.taxRate : 0
            it.applyAmount = Number((row.sum * (1 + taxRate / 100)).toFixed(2))
            it.itemOrderIds = row.ids
          } else {
            it.applyAmount = null
            it.itemOrderIds = []
          }
        })
      })
      setTimeout(() => {
        selectParams.checkedList = checkedInfo.map(item => item.ids).flat()
        isShowSelectList.value = false
      }, 500)
    }

    function isChoose() {
      let msg = [], msg2 = []
      info.forEach(item => {
        // if (!item.isChecked && item.detail.every(sku => !sku.isChecked)) msg = msg + `<p style="line-height: 2">采购单号：${item.purchaseOrderNumber} 至少一个采购SKU</p>`
        if (!item.isChecked && item.detail.every(sku => !sku.isChecked)) msg.push(item.purchaseOrderNumber)
      })
      if (msg.length > 0) {
        ElMessage.error(`采购单号：${msg[0]} 至少一个采购SKU`)
        return false
      }

      info.forEach(item => {
        let totalAmount = item.detail.reduce((total, next) => {
          return total = total * 1 + (next.applyAmount ?? 0) * 1
        }, ((item.fee ?? 0)) * 1 - (item.discount ?? 0) * 1)
        // if (totalAmount < 0) msg2 = msg2 + `<p style="line-height: 2">采购单号：${item.purchaseOrderNumber} 申请总额不能为负数</p>`
        if (totalAmount < 0) msg2.push(item.purchaseOrderNumber)
      })
      if (msg2.length > 0) {
        ElMessage.error(`采购单号：${msg2[0]} 申请总额不能为负数`)
        return false
      }

      return true
    }

    function validateApplyAmount(row) {
      batchTableRef.value.validate(row)
      setTimeout(() => {
        batchTableRef.value.clearValidate("applyAmount")
      }, 2000)
    }

    function commit(operation) {
      if (isChoose()) {
        batchTableRef.value.validate(true).then(res => {
          if (res) {
            return setTimeout(() => {
              batchTableRef.value.clearValidate()
            }, 2000)
          }
          let params = getParams()
          moreDetailSave(Object.assign({ operation, type: 0 }, { submitDTOS: params })).then(_ => {
            cancel()
            ElMessage.success({
              message: '申请成功',
            })
          })
        })
      }
    }
    return {
      batchTableOption,
      applyForm,
      info,
      isShowSelectList,
      isShowApplyAll,
      selectParams,
      batchTableRef,
      setRefs,
      applyAll,
      cancel,
      commit,
      checkboxChange,
      setAmount,
      totalAmount,
      fmtType,
      fmtSupplierPartnerTypes,
      setSkuClass,
      goBack,
      selectCustomizedOrder,
      fillRowPrice,
      deepCopy,
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
.table-warp {
  margin-top: 25px;
  background-color: #fff;
  padding: 25px;
}
:deep(.sku-content) {
  line-height: 55px;
  background: #fafafa;
}
:deep(.form-content) {
  line-height: 55px;
  background: #fafafa;
  background: rgba(255, 251, 230, 0.7);
}
.inline-table-form {
  display: flex;
  justify-content: space-between;
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
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
.footer {
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
}
</style>
