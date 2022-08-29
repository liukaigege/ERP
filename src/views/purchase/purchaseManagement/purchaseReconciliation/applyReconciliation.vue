<template>
  <div class="headDetail">
    <!-- 详情 -->
    <erpNav routeOpt="/purchase/purchaseManagement/purchaseReconciliation" title="申请对账" />
    <div class="purchaseInfo">
      <div class="step-warp">
        <el-steps :active="active" align-center>
          <el-step title="申请对账"></el-step>
          <el-step title="财务审批"></el-step>
          <el-step title="完成对账"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="buttonClass">
      <el-button type="primary" @click="exportCustomizedList" :disabled="!data.verifyList.length">导出定制信息</el-button>
    </div>
    <!-- 手绘 -->
    <div class="pageTable">
      <template v-for="(item,index) in data.verifyList" :key="index">
        <el-table ref="tableRef" :header-cell-style="{color:'#000'}" align="center" border :data="item.tableData" :span-method="spanMethod" :row-style="rowClassName" :show-header="index==0">
          <el-table-column prop="id" label="采购信息" align="center" width="200">
            <template #default="{row}">
              <div v-if="row.isContent">
                <div>{{row.purchaseOrderNumber}}</div>
                <div>{{row.auditTime}}</div>
                <div>{{row.purchaseUserName}}</div>
              </div>
              <div v-if="row.isHead" class="flex">
                <!-- 列表头部 -->
                <div style="padding-right:50px">{{'【'+row.partnerTypeName+'】'+row.supplierName}}</div>
                <div v-if="row.settlementType==2">账期({{row.settlementValue}}天)</div>
                <div v-else>{{{"1":'预付',"3":"货到付款","4":"款到发货"} [row.settlementType] }}</div>
                <!-- <div>{{row.settlementTypeName}}（{{row.settlementValue}}）<span v-if="row.settlementValue">天</span></div> -->
              </div>
              <div v-if="row.isFooter" class="flex">
                <div>运费(¥)： <el-input-number :controls="false" v-model.number="row.fee" @input="changeFee(row)" clearable :min="0"  :max="9999999.99" style="width:208px"></el-input-number>
                </div>
                <div class="footer-input-box">折扣(¥)： <el-input-number v-model.number="row.discount" :controls="false" @input="changeFee(row)" :min="0" :max="9999999.99" clearable style="width:208px"></el-input-number>
                </div>
                <div class="footer-input-box">税率(%)： <el-input-number v-model.number="row.taxRate" :controls="false" @input="changeFee(row)" :min="0" :max="100" disabled clearable style="width:208px"></el-input-number>
                </div>
                <!-- 入库金额之和*（1+税率）+运费-折扣 -->
                <!-- <div class="footer-input-box">对账金额：¥{{row.amount * (1 + row.taxRate*1) + row.fee*1 - row.discount*1}}</div> -->
                <div :class="['footer-input-box',row.isLessZero ? 'error' : '']">对账金额(¥)：{{ row.putInStorageTotalPrice }}</div>
              </div>
              <div v-if="row.isCount" class="text-left">
                <!-- 列表结算 -->
                <div>总对账金额(¥)：<span style="color:#D9001B">{{row.amount}}</span> </div>
                <div v-for="(item,index) in row.paymentList" :key="item.supplierPaymentId" class="flex mr-t-8">
                  <div>
                    付款方式：<el-select v-model="item.supplierPaymentId" :class="row.isSameSupplier?'error':''">
                      <el-option v-for="sonItem in row.supplierPaymentList" :key="sonItem.id" :label="sonItem.bankUserName" :value="sonItem.id"></el-option>
											<!-- <el-option :label="item.bankUserName" :value="item.id"></el-option> -->
                    </el-select>
                  </div>
                  <div style="margin-left:16px;width:350px">
                    付款金额(¥)： <el-input-number :class="row.isSameAmout?'error':''" v-model.number="item.payAmount" :controls="false" :min="0" clearable style="width:250px"></el-input-number>
                  </div>
                  <el-button v-if="!index" @click="addPayment(row)" :disabled="row.paymentList.length == row.supplierPaymentList.length">+增加</el-button>
                  <el-button v-if="index" type="text" @click="delPayment(row.paymentList,index)" style="color:red">删除</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="SKU" align="center" width="530">
            <template #default="{row}">
              <div class="flex sku-img">
                <div style="display:flex;flex-direction: column;">
									<el-image :src="row.skuImage" fit="contain" style="width: 80px;height: 80px;"></el-image>
                  <span style="color:#1890ff;margin-right: 10px;">{{ row.goodsType == '0'?'普货':'定制' }}</span>
								</div>
                <div class="text-left">
                  <div>{{row.sku}}</div>
                  <div class="textOverflow_2"> {{row.goodsName}}</div>
                  <div>
                    <span v-if="row.skuValue != null">{{ JSON.parse(row.skuValue).map(v =>v.spe +': '+ v.speVal).join(' ')}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="采购单价" align="center" width="150">
            <template #default="{row}">
              <div>
							<span>¥{{row.purchaseGoodsPrice}}</span>
						</div>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center" width="120">
              <template #default="{row}">
              <div>
              <span>{{row.purchaseGoodsQuantity}}</span>
            </div>
            </template>
          </el-table-column>
          <el-table-column label="入库单号" align="center" width="130">
            <template #default="{row}">
              <div v-for="(item,i) in row.putInStorageNoList" :key="i">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="入库时间" align="center" width="170">
            <template #default="{row}">
              <div v-for="(item,i) in row.putInStorageTimeList" :key="i">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" align="center" width="100">
            <template #default="{row}">
            <div>
							<span>{{row.putInStorageGoodsQuantity}}</span>
						</div>
            </template>
          </el-table-column>
          <el-table-column prop="putInStoragePartsPriceList" label="入库配件金额" align="center" width="110">
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
					 <template #default="{row}">
            <div>¥{{row.putInStorageTotalPrice}}</div>
            </template>
				</el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="80" v-if="isShowDelete">
            <template #default="{row}">
              <el-button type="text" style="color:#FD4C60" @click="deleteSku(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="flex-pagination page-fixed">
      <div>
        <span>供应商：{{data.supplierQuantity}}家</span>
        <span class="mr-l-24">采购单：{{data.purchaseQuantity}}单</span>
        <span class="mr-l-24">SKU种类：{{data.skuQuantity}}种</span>
        <span class="mr-l-24">对账商品总数：{{data.goodsQuantity}}件</span>
        <span class="mr-l-24">对账金额：¥{{data.totalAmount}}</span>
      </div>
      <div>
        <el-button @click="goBack">取消</el-button>
        <el-button @click="saveBatchVerify" :disabled="!data.verifyList.length">保存草稿</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import { onMounted, reactive, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { batchGenerateApplyInfo, exportCustomized, batchSaveVerify } from './api/api'
import { ElMessage } from 'element-plus'
export default {
  name: 'reconciliationEdit',
  components: {
    erpNav,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      active: 0,
      paymentId: null,
      data: {
        verifyList: [{
          tableData: []
        }],
        supplierQuantity: 0, // 供应商数量
        purchaseQuantity: 0, // 采购单数量
        skuQuantity: 0,// sku种类数量
        goodsQuantity: 0,// 对账商品数量,
        totalAmount: 0//对账总金额
      }
    })

    onMounted(() => {
      if (route.params.id) getGenerateApplyInfo()
      else router.go(-1)
    })

    const isShowDelete = computed(() => {
      const contentLen = state.data.verifyList.map(item => item.tableData.filter(_item => _item.isContent)).flat().length
      return contentLen > 1
    })


    // 获取对账申请数据
    function getGenerateApplyInfo() {
      batchGenerateApplyInfo({ ids: route.params.id }).then(res => {
        if (res.code == 200) {
          state.data = res.data
          state.data.verifyList.forEach(_p => {
            _p.tableData = [{ isHead: true, supplierName: _p.supplierName, settlementType: _p.settlementType, settlementTypeName: _p.settlementTypeName, settlementValue: _p.settlementValue, partnerTypeName: _p.partnerTypeName }]
            _p.purchaseList.forEach(item => {
              let priceSum = 0
              let { purchaseOrderNumber, purchaseUserName, auditTime, amount, discount, fee, taxRate } = item
              _p.tableData = _p.tableData.concat(item.goodsList.map((good, index) => {
                if (index == 0) return { ...good, purchaseOrderNumber, purchaseUserName, auditTime, merge: item.goodsList.length, supplierId: _p.supplierId, settlementType: _p.settlementType, settlementValue: _p.settlementValue, isContent: true }
                return { ...good, purchaseOrderNumber, purchaseUserName, auditTime, supplierId: _p.supplierId, settlementType: _p.settlementType, settlementValue: _p.settlementValue, isContent: true }
              }))
              item.goodsList.forEach(v => priceSum += v.putInStorageTotalPrice)
              _p.tableData.push({
                isFooter: true, purchaseOrderNumber, discount, fee, taxRate, supplierId: _p.supplierId, settlementType: _p.settlementType, settlementValue: _p.settlementValue, putInStorageTotalPrice: calcTotalPrice(priceSum, fee, taxRate, discount), goodsList: item.goodsList
              })
              item.amount = calcTotalPrice(priceSum, fee, taxRate, discount)
            })
            _p.tableData.push(
              {
                isCount: true,
                paymentList: _p.supplierPaymentList == null ? [] : [{
                  supplierPaymentId: _p.supplierPaymentList[0]?.id,
                  payAmount: undefined
                }],
                supplierId: _p.supplierId,
                supplierPaymentList: _p.supplierPaymentList == null ? [] : _p.supplierPaymentList,
                amount: _p.amount
              }
            )
          })
        }
      })
    }


    //合并方法
    function spanMethod({ row, columnIndex }) {
      if (row.merge && row.isContent && !columnIndex) return [row.merge, 1]
      if (!row.merge && row.isContent && !columnIndex) return [1, 0]
      if ((row.isHead || row.isFooter || row.isCount) && !columnIndex) return [1, 10]
      if ((row.isHead || row.isFooter || row.isCount) && columnIndex) return [1, 0]
    }

    function goBack() {
      router.push({ name: 'purchaseReconciliation' })
    }

    // 保存草稿 入参格式如下
    // 			{
    //     "verifyList": [{
    //         "supplierId": "供应商id",
    //         "settlementType": "结算方式（1：预付、2：账期、3：货到付款、4：款到发货）",
    //         "settlementValue": "结算值（金额/到账日期）",
    //         "paymentList": [{
    //             "supplierPaymentId": "供应商结算方式id",
    //             "payAmount": "付款金额"
    //         }],
    //         "purchaseList": [{
    //             "verifyItemIds": "对账明细ids",
    //             "fee": "运费",
    //             "taxRate": "税率",
    //             "amount": "对账金额",
    //             "purchaseOrderNumber": "采购订单号"
    //         }]
    //     }]
    // }
    function saveBatchVerify() {
      const { verifyList } = state.data
      let sumAmountErr = false, paymentErr = false, totalAmountErr = false, currentAmountErr = false, payContentErr = false
      verifyList.forEach(item => {
        const currentPayItem = item.tableData.find(_item => _item.isCount)
        const currentPayContentItem = item.tableData.filter(_item => _item.isFooter)
        // 校验单个单号下的付款金额
        currentPayContentItem.forEach(_item => {
          if (_item.putInStorageTotalPrice <= 0 && !_item.goodsList.every(it => it.purchaseGoodsPrice == 0)) {
            _item.isLessZero = true
            payContentErr = true // 元素标红
          } else {
            _item.isLessZero = false
          }
        })

        let sumAmount = 0
        // 非合作供应商不参与校验付款金额
        if (item.partnerType == 1 && currentPayItem.paymentList.length > 0) {
          currentPayItem.paymentList.forEach(v => sumAmount += (v.payAmount == undefined ? 0 : Number(v.payAmount)))
          if (currentPayItem.amount <= 0) return currentAmountErr = true
          if (sumAmount.toFixed(2) * 1 != currentPayItem.amount) {
            sumAmountErr = true
            currentPayItem.isSameAmout = true
          } else {
            currentPayItem.isSameAmout = false
          }
          const paymentIdList = new Set(currentPayItem.paymentList.map(item => item.supplierPaymentId))
          if (paymentIdList.size < currentPayItem.paymentList.length) {
            paymentErr = true
            currentPayItem.isSameSupplier = true
          } else {
            currentPayItem.isSameSupplier = false
          }
        }
        // if (currentPayItem.amount <= 0) return totalAmountErr = true
      })
      if (payContentErr) return ElMessage.error('单个采购单总对账金额应大于0元')
      if (currentAmountErr && payContentErr) return ElMessage.error('单个供应商总对账金额应大于0元')
      // if (totalAmountErr) return ElMessage.error('申请对账总金额应大于0元')
      if (sumAmountErr) return ElMessage.error('付款金额之和不等于供应商总对账金额')
      if (paymentErr) return ElMessage.error('付款账号不能重复')


      //  组合数据
      const saveVerifyList = verifyList.map(item => {
        // const { fee, taxRate, discount } = item.tableData?.find(_item => _item.isFooter)
        const { paymentList } = item.tableData?.find(_p => _p.isCount)
        const purchaseList = item.tableData.filter(cur => cur.isFooter).map(sonItem => {
          const { goodsList, purchaseOrderNumber, putInStorageTotalPrice, fee, taxRate, discount } = sonItem
          return {
            verifyItemIds: goodsList.map(p => p.purchaseVerifyItemIds).flat(),
            fee,
            discount,
            taxRate,
            amount: putInStorageTotalPrice,
            purchaseOrderNumber
          }
        })
        return {
          supplierId: item.supplierId,
          settlementType: item.settlementType,
          settlementValue: item.settlementValue,
          paymentList: paymentList.map(_p => { return { supplierPaymentId: _p.supplierPaymentId, payAmount: _p.payAmount == undefined ? 0 : Number(_p.payAmount) } }),
          purchaseList
        }
      })

      batchSaveVerify({ verifyList: saveVerifyList }).then(res => {
        if (res.code == 200) {
          ElMessage.success('操作成功')
          router.push({ name: 'purchaseReconciliation', params: { update: true } })
        }
      })
    }

    // 导出sku定制化数据
    function exportCustomizedList() {
      const allPurchaseList = state.data.verifyList.map(item => item.purchaseList).flat()
      let allGoodsList = []
      allPurchaseList.forEach(_item => allGoodsList.push(..._item.goodsList))
      const allCustomizedIds = allGoodsList.filter(p => p.goodsType == 1).map(_p => _p.purchaseVerifyItemIds).flat() // 筛选出定制类型数据的id集合
      const uniqueArray = Array.from(new Set(allCustomizedIds))
      if (uniqueArray.length < 1) return ElMessage.error('无可导出的定制数据')
      exportCustomized({ ids: uniqueArray }).then(res => {
        window.open(res.data)
      })
    }

    // 删除操作
    function deleteSku({ supplierId, productId, settlementType, settlementValue, purchaseOrderNumber }) {
      let totalAmount = 0, purchaseQuantity = 0, skuQuantity = [], goodsQuantity = 0
      state.data.verifyList.forEach(item => {
        if (item.supplierId === supplierId && item.settlementType === settlementType && item.settlementValue === settlementValue) {
          const sameItem = item.tableData.find(v => v.productId === productId && v.purchaseOrderNumber === purchaseOrderNumber && v.isContent)
          // 查找含有此条数据的goodList
          const haveThisGoodsList = item.tableData.find(item => item.isFooter && item.purchaseOrderNumber === purchaseOrderNumber)
          haveThisGoodsList.goodsList.splice(haveThisGoodsList.goodsList.findIndex(item => item.productId === productId), 1)
          // 删除当前条目
          item.tableData.splice(item.tableData.indexOf(sameItem), 1)
          // 如果当前数据内没有isContent数据  则删除当前数据
          if (item.tableData.filter(item => item.isContent).length < 1) {
            state.data.verifyList.splice(state.data.verifyList.indexOf(item), 1)
          }


          // 重新计算合并的单元格
          const firstMergeItem = item.tableData.find(item => item.isContent && item.purchaseOrderNumber == purchaseOrderNumber)
          if (firstMergeItem) firstMergeItem.merge = item.tableData.filter(_v => _v.purchaseOrderNumber === firstMergeItem.purchaseOrderNumber && _v.isContent).length

          // 重新计算当前对账金额
          let priceSum = 0, countSum = 0
          item.tableData.filter(item => item.isContent && item.purchaseOrderNumber === purchaseOrderNumber).forEach(_v => priceSum += _v.putInStorageTotalPrice)

          // 删除的当前数据下的isFooter内的数据要改变
          const isDelFooter = item.tableData.find(p => p.isFooter && p.purchaseOrderNumber === purchaseOrderNumber)
          isDelFooter.putInStorageTotalPrice = calcTotalPrice(priceSum, isDelFooter.fee, isDelFooter.taxRate, isDelFooter.discount)
          // 当前tableData下是否存在相同订单号的数据，如果没有，删除相同订单号下的isFooter的数据
          const itemOrderNumberLength = item.tableData.filter(n => n.purchaseOrderNumber == purchaseOrderNumber && n.isContent)?.length
          if (itemOrderNumberLength < 1) item.tableData.splice(item.tableData.findIndex(v => v.isFooter && v.purchaseOrderNumber == purchaseOrderNumber), 1)

          item.tableData.filter(footer => footer.isFooter).forEach(it => countSum += it.putInStorageTotalPrice)

          // 当前供应商下的汇总数据
          const isDelCount = item.tableData.find(p => p.isCount)
          isDelCount.amount = item.amount = parseFloat(countSum.toFixed(10))
        }

      })
      state.data.verifyList.forEach(item => {
        const delItem = item.tableData.filter(v => v.isContent)
        const itemGoodsQuantityList = delItem.map(i => i.putInStorageGoodsQuantity) // 每条数据的入库数量
        const itemSkuId = delItem.map(i => i.skuId) // 每条数据的入库数量
        totalAmount += (item.amount * 1)
        purchaseQuantity += item.tableData.filter(v => v.isContent && v.merge).length
        skuQuantity.push(itemSkuId)
        goodsQuantity += itemGoodsQuantityList.reduce((pre, next) => pre += next)
      })
      state.data.totalAmount = Number(totalAmount).toFixed(2)
      state.data.supplierQuantity = Array.from(new Set(state.data.verifyList.map(it => it.supplierId))).length
      state.data.purchaseQuantity = purchaseQuantity
      state.data.skuQuantity = Array.from(new Set(skuQuantity.flat())).length || 0 // 去重取长度
      state.data.goodsQuantity = goodsQuantity
    }

    function rowClassName({ row }) {
      if (row.isHead || row.isFooter) return { backgroundColor: "#f2f2f2" }
    }

    function addPayment(row) {
      let ids = row.paymentList.map(item => item.supplierPaymentId)
      let payment = row.supplierPaymentList.find(item => !ids.includes(item.id))
      row.paymentList.push({
        supplierPaymentId: payment.id,
        payAmount: undefined
      })
    }

    function delPayment(payment, index) {
      payment.splice(index, 1)
    }

    function changeFee(row) {
      const currentRow = state.data.verifyList.find(item => item.supplierId === row.supplierId && item.settlementType === row.settlementType && item.settlementValue === row.settlementValue)
      // 重新计算当前对账金额
      let priceSum = 0
      let totalAmount = 0
      let currentRowAmount = 0
      currentRow.tableData.filter(item => item.isContent && item.purchaseOrderNumber === row.purchaseOrderNumber).forEach(_v => priceSum += _v.putInStorageTotalPrice)
      row.putInStorageTotalPrice = calcTotalPrice(priceSum, row.fee, row.taxRate, row.discount)
      currentRow.tableData.filter(_item => _item.isFooter).forEach(v => currentRowAmount += v.putInStorageTotalPrice)
      currentRow.amount = currentRow.tableData.find(item => item.isCount).amount = Number(currentRowAmount).toFixed(2)
      currentRow.tableData.find(item => item.isFooter).isLessZero = Number(currentRowAmount).toFixed(2) * 1 < 0
      // 重新计算总对账金额
      state.data.verifyList.forEach(v => totalAmount += (v.amount * 1))
      state.data.totalAmount = Number(totalAmount).toFixed(2)
    }

    /**
       * @param {*}: amountSum：对账金额之和 fee：运费 taxRate：税率 discount：折扣
       * @Description :计算对账金额  入库金额之和*（1+税率）+运费-折扣
       *
      */
    function calcTotalPrice(amountSum, fee, taxRate, discount) {
      return (amountSum * (1 + taxRate / 100) + fee * 1 - discount * 1).toFixed(2) * 1
    }

    return {
      ...toRefs(state),
      goBack,
      spanMethod,
      rowClassName,
      addPayment,
      delPayment,
      exportCustomizedList,
      saveBatchVerify,
      deleteSku,
      calcTotalPrice,
      changeFee,
      isShowDelete,
      getGenerateApplyInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.headDetail {
  .purchaseInfo {
    position: fixed;
    width: calc(100% - var(--sideBarWidth));
    right: 0;
    top: 187px;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    z-index: 50;

    // padding: 60px;
    .step-warp {
      width: 80%;
      margin: 0 auto;
    }
  }

  .buttonClass {
    position: fixed;
    right: 25px;
    top: 265px;
    z-index: 50;
  }

  .pageTable {
    margin: 130px 0 80px;
    background: #fff;
    padding: 24px;
  }

  .sku-img .text-left {
    font-size: 12px;
    margin-left: 10px;
  }
}

.flex {
  display: flex;
  align-items: center;
}

.footer-input-box.error {
  color: var(--el-color-danger);
}

.mr-l-24 {
  margin-left: 24px;
}

::v-deep(.color-f2) {
  background-color: #f2f2f2;
}

.footer-input-box {
  margin-left: 16px;
}

.text-left {
  text-align: left;
}
::v-deep(.el-input-number.error) {
  .el-input__inner {
    border-color: var(--el-color-danger);
  }
}
::v-deep(.el-select.error) {
  .el-input__inner {
    border-color: var(--el-color-danger);
  }
}

.mr-t-8 + .mr-t-8 {
  margin-top: 8px;
}
</style>
