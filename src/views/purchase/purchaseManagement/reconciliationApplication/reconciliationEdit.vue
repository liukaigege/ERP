<template>
  <div class="headDetail">
    <!-- 详情 -->
    <erpNav routeOpt="/purchase/purchaseManagement/reconciliationApplication" title="申请对账" />
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
      <el-button type="primary" @click="exportCustomizedList">导出定制信息</el-button>
    </div>
    <!-- 手绘 -->

    <div class="pageTable">
      <el-table :data="data.tableData" :header-cell-style="{ color: '#000' }" border :span-method="spanMethod" :row-class-name="rowClassName">
        <el-table-column prop="info" label="采购信息" width="200" align="center">
          <template #default="{ row }">
            <!-- 第一列 合并 isHead isFooter isCount-->
            <div v-if="row.isHead" class="flex">
              <!-- 列表头部 -->
              <div style="padding-right:50px">{{ '【' + row.partnerTypeName + '】' + row.supplierName }}</div>
              <div style="color:#1890ff" v-if="row.settlementType == 2">账期({{ row.settlementValue }}天)</div>
              <div style="color:#1890ff" v-else>{{ { "1": '预付', "3": "货到付款", "4": "款到发货" }[row.settlementType] }}</div>
            </div>
            <div v-if="row.isContent">
              <!-- 列表内容 -->
              <div>{{ row.purchaseOrderNumber }}</div>
              <div>{{ row.auditTime }}</div>
              <div>{{ row.purchaseUserName }}</div>
            </div>
            <div v-if="row.isFooter" class="flexFee">
              <!-- 列表底部 -->
              <div>运费(￥)： <el-input-number :disabled="!hideButton" v-model.number="row.fee" @input="changeFee(row)" :controls="false" :min="0" :max="9999999.99" clearable style="width:208px;"></el-input-number>
              </div>
              <div class="footer-input-box">折扣(￥)：
                <el-input-number v-model.number="row.discount" :disabled="!hideButton" :controls="false" @input="changeFee(row)" :min="0" :max="9999999.99" clearable style="width:208px"></el-input-number>
              </div>
              <div class="footer-input-box">税率(%)： <el-input-number v-model.number="row.taxRate" @input="changeFee(row)" disabled clearable style="width:208px" :controls="false" :min="0" :max="100"></el-input-number>
              </div>
              <!-- 入库金额之和*（1+税率）+运费-折扣 -->
              <!-- <div class="footer-input-box">对账金额：¥{{row.putInStorageTotalPrice * (1 + ~~row.taxRate) + ~~row.fee - ~~row.discount}}</div> -->
              <div class="footer-input-box">对账金额：¥{{ row.putInStorageTotalPrice }}</div>
            </div>
            <div v-if="row.isCount" class="text-left reconmentCont">
              <!-- 列表结算 -->
              <div style="margin-bottom:24px">总对账金额：¥ <span style="color:#D9001B">{{ row.amount }}</span> </div>
              <div v-for="(item, index) in row.paymentList" :key="item.supplierPaymentId" class="flex mr-t-8">
                <div>
                  付款方式：<el-select v-model="item.supplierPaymentId" :disabled="!hideButton">
                    <!-- <el-option :label="item.bankUserName" :value="item.id">
										</el-option> -->
                    <el-option v-for="sonItem in row.supplierPaymentList" :key="sonItem.id" :label="sonItem.bankUserName" :value="sonItem.id"></el-option>
                  </el-select>
                </div>
                <div style="margin-left:16px;width:350px">
                  付款金额：<el-input-number v-model="item.payAmount" :disabled="!hideButton" :controls="false" :min="0" clearable style="width:250px"></el-input-number>
                </div>
                <el-button v-if="!index && hideButton" @click="addPayment(row)" :disabled="row.paymentList.length == row.supplierPaymentList.length">+增加</el-button>
                <el-button v-if="hideButton && index" type="text" @click="delPayment(row.paymentList, index)" style="color:red">删除</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="SKU" width="550" align="center">
          <template #default="{ row }">
            <div class="flex">
              <div>
                <el-image :src="row.skuImage" fit="contain" style="width:80px;height:80px"></el-image>
                <p :style="row.goodsType ? 'color:#409eff' : ''">{{ row.goodsType ? '定制' : '普通' }}</p>
              </div>
              <div class="text-left" style="margin-left:12px;font-size:12px;">
                <div>{{ row.sku }}</div>
                <div>{{ row.goodsName }}</div>
                <div>
                  <!-- <span :style="row.goodsType?'color:#409eff':''">{{row.goodsType?'定制':'普通'}}</span> -->
                  <span v-if="row.skuValue != null">{{ JSON.parse(row.skuValue).map(v => v.spe + ': ' + v.speVal).join('-') }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="采购单价" width="150" align="center">
          <!-- <template #header>
						<el-tooltip content="" placement="top" effect="dark">
							<template #content>
								主件/配件
							</template>
							<div>
								采购单价 <i class="el-icon-question"></i>
							</div>
						</el-tooltip>
					</template> -->
          <template #default="{ row }">
            <div>
              <span>¥{{ row.purchaseGoodsPrice }}</span>
              <!-- <span v-for="item in row.purchasePartsPriceList" :key="item">/¥{{ item }}</span> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="采购数量" width="120" align="center">
          <!-- <template #header>
						<el-tooltip content="" placement="top" effect="dark">
							<template #content>
								主件/配件
							</template>
							<div>
								采购数量 <i class="el-icon-question"></i>
							</div>
						</el-tooltip>
					</template> -->
          <template #default="{ row }">
            <div>
              <span>{{ row.purchaseGoodsQuantity }}</span>
              <!-- <span v-for="item in row.purchasePartsQuantityList" :key="item">/{{ item }}</span> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="入库单号" width="130" align="center">
          <template #default="{ row }">
            <div class="content" v-for="s in row.putInStorageNoList" :key="s">{{ s }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="入库时间" width="110" align="center">
          <template #default="{ row }">
            <div class="content" v-for=" m in row.putInStorageTimeList" :key="m">{{ m }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sku" label="入库数量" width="100" align="center">
          <!-- <template #header>
						<el-tooltip content="" placement="top" effect="dark">
							<template #content>
								主件/配件
							</template>
							<div>
								入库数量 <i class="el-icon-question"></i>
							</div>
						</el-tooltip>
					</template> -->
          <template #default="{ row }">
            <div>
              <span>{{ row.putInStorageGoodsQuantity }}</span>
              <!-- <span v-for="item in row.putInStoragePartsQuantityList" :key="item">/{{ item }}</span> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="putInStoragePartsPriceList" label="入库配件金额" align="center" width="120">
          <template #default="{ row }">
            <div v-if="row.putInStoragePartsPriceList?.length">
              <p v-for="item in row.putInStoragePartsPriceList" :key="item">
                {{item===null||item==='null'?'-':'¥'+item}}
                </p>
            </div>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="putInStorageTotalPrice" label="入库总金额" align="center" width="110">
          <template #default="{ row }">
            ￥{{ row.putInStorageTotalPrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" v-if="hideButton && isShowDelete" fixed="right">
          <template #header>
            <div v-if="hideButton">操作</div>
          </template>
          <template #default="{ row }">
            <div v-if="hideButton">
              <el-button type="text" @click="deleteSku(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 长传回执 -->
      <div style="margin-top:50px">
        <div v-if="imgList && !imgList.length">暂无回执文件</div>
        <div v-else>回执文件</div>
        <div class="imgItem">
          <div class="img" v-for="(item, index) in imgList" :key="index">
            <img :src="item.url" alt="" style="max-width: 100%;height:auto;max-height: 270px;margin: 0 auto;" @click="imgClick(item)" />
            <div class="deleteIcon" v-if="hideButton">
            </div>
            <div v-if="hideButton" class="delelteItem" @click="deleteItem(index)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
        <div>
          <UploadImg ref="uploadImg" :data="[]" id="uploadImg" moduleName="spe" :addNameWithSize="true" :isTrigger="true" :showFileList="false" :isCompress="true" :isNoFilieList="true" @getFileList="getImgList" @getCompressList="getCompressList" :limit="10" :maxSize="20" :notAcceptedType="notAcceptedType">
            <template #trigger>
              <el-button type="primary" @click="clearn" icon="el-icon-upload" v-if="hideButton" style="margin-top:20px">上传图片</el-button>
            </template>
          </UploadImg>
          <!-- <el-button :disabled="isDisabled" type="primary">上传图片</el-button> -->
        </div>
      </div>
    </div>
    <div class="flex-pagination page-fixed">
      <div>
        <span>采购单:{{ data.purchaseQuantity }}单</span>
        <span style="margin-left:24px">SKU种类：{{ data.skuQuantity }}种</span>
        <span style="margin-left:24px">对账商品总数：{{ data.goodsQuantity }}件</span>
        <span style="margin-left:24px">对账金额：¥{{ data.totalAmount }}</span>
      </div>
      <div>
        <el-button @click="goBack">{{ hideButton ? '取消' : '关闭' }}</el-button>
        <el-button @click="submit(1)" v-if="hideButton">{{ buttonType == 2 ? '保存' : '保存草稿' }}</el-button>
        <el-button @click="submit(2)" type="primary" v-if="hideButton">提交审核</el-button>
      </div>
    </div>
    <el-dialog v-model="visitble" :width="800" :close-on-click-modal="false" :destroy-on-close="true" trigger="click">
      <!-- <el-button type="text" style="float:right" @click="closeImg" >关闭</el-button> -->
      <div style="display:flex;align-items:center;justify-content:center">
        <el-image :src="imgLists" style="height:450px;" fit="contain"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import UploadImg from '@/components/uploadImg/index.vue'
import { reactive, toRefs, onMounted, ref, computed } from 'vue'
import { queryGetDetail, queryAccountSave, exportCustomized } from './api/api'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { moreDetail } from '@/api/purchase/order.js'
import { ElMessage } from 'element-plus'
export default {
  // name: 'reconciliationEdit',
  props: {
    notAcceptedType: {
      Type: Array,
      default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']
    }
  },
  components: {
    erpNav,
    UploadImg
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const uploadImg = ref(null)
    const state = reactive({
      active: 0,
      imgLists: '',
      visitble: false,
      hideButton: true,
      imgList: [],
      thumbnailList: [], // 压缩图列表
      data: {
        tableData: [],
        purchaseQuantity: 0, // 采购单数量
        skuQuantity: 0,// sku种类数量
        goodsQuantity: 0,// 对账商品数量,
        totalAmount: 0//对账总金额
      },
      // lengthList: null,
      buttonType: null,
    })
    onMounted(() => {
      state.buttonType = route.params.active
      if (route.params.active === '1') {//申请中
        state.active = 1
        state.hideButton = false
      } else if (route.params.active === '3' || route.query.id) {//已完成
        state.active = 3
        state.hideButton = false
      }

      const queryId = route.params.id || route.query.id
      //接口回显
      if (queryId) getDetail()
      else router.go(-1)
    })

    const isShowDelete = computed(() => {
      const contentLen = state.data.tableData.filter(_item => _item.isContent).length
      return contentLen > 1
    })


    function getDetail() {
      queryGetDetail({ id: route.params.id || route.query.id }).then(res => {
        state.data = res.data
        state.imgList = res.data.verifyInfo.receiptList
        // state.lengthList = res.data.verifyInfo.paymentList.length + res.data.verifyInfo.supplierPaymentList.length
        const { verifyInfo } = state.data
        state.data.tableData = [{ isHead: true, supplierName: verifyInfo.supplierName, settlementType: verifyInfo.settlementType, settlementTypeName: verifyInfo.settlementTypeName, settlementValue: verifyInfo.settlementValue, partnerTypeName: verifyInfo.partnerTypeName }]
        verifyInfo.purchaseList.forEach(item => {
          let { purchaseOrderNumber, purchaseUserName, auditTime, amount, discount, fee, taxRate, id } = item
          let priceSum = 0
          state.data.tableData = state.data.tableData.concat(item.goodsList.map((good, index) => {
            if (index == 0) return { ...good, purchaseOrderNumber, purchaseUserName, auditTime, merge: item.goodsList.length, isContent: true }
            return { ...good, purchaseOrderNumber, purchaseUserName, auditTime, isContent: true }
          }))
          item.goodsList.forEach(v => priceSum += v.putInStorageTotalPrice)
          item.amount = calcTotalPrice(priceSum, fee, taxRate, discount)
          state.data.tableData.push({
            isFooter: true, purchaseOrderNumber, id, amount, discount, fee, taxRate, putInStorageTotalPrice: calcTotalPrice(priceSum, fee, taxRate, discount), goodsList: item.goodsList
          })
        })
        state.data.tableData.push({
          isCount: true, paymentList: verifyInfo.paymentList, supplierPaymentList: verifyInfo.supplierPaymentList, amount: verifyInfo.amount
        })
      })
    }


    //合并方法
    function spanMethod({ row, columnIndex }) {
      if (row.merge && row.isContent && !columnIndex) return [row.merge, 1]
      if (!row.merge && row.isContent && !columnIndex) return [1, 0]
      if ((row.isHead || row.isFooter || row.isCount) && !columnIndex) return [1, state.hideButton && isShowDelete ? 10 : 9]
      if ((row.isHead || row.isFooter || row.isCount) && columnIndex) return [1, 0]
    }

    function goBack() {
      router.push({ name: 'reconciliationApplication' })
    }

    function rowClassName({ row }) {
      if (row.isHead || row.isFooter) return 'color-f2'
      if (row.isCount) return 'color-ffbe6'
    }

    function addPayment(row) {
      let ids = row.paymentList.map(item => item.supplierPaymentId)
      let payment = row.supplierPaymentList.find(item => !ids.includes(item.id))
      row.paymentList.push({
        supplierPaymentId: payment.id,
        payAmount: undefined,
        id: undefined
      })
    }

    function delPayment(payment, index) {
      payment.splice(index, 1)
    }
    //图片上传
    function getImgList(val) {
      if (state.imgList.length >= 10) return ElMessage.error('最多可添加10张图片')
      if (val) {
        val.forEach(item => {
          let obj = {
            url: item.fileUrl,
            resolution: `${item.imgSize.width}x${item.imgSize.height}`,
          }
          if (state.imgList.length < 10) {
            state.imgList.push(obj)
          }
        })
      }
    }
    function getCompressList(val) {
      val?.forEach(item => {
        state.thumbnailList.push(item)
      })
    } // 获取压缩图列表
    function clearn(params) {
      resertUpload()
    }
    //导出定制化信息
    function exportCustomizedList() {
      let arr = []
      let allGoodsList = []
      state.data.verifyInfo.purchaseList.forEach(item => allGoodsList.push(...item.goodsList))
      arr = allGoodsList.filter(p => p.goodsType).map(i => i.purchaseVerifyItemIds).flat()
      if (!arr.length) {
        return ElMessage.warning('无可导出的定制数据')
      }
      exportCustomized({ ids: arr }).then(res => {
        window.open(res.data)
      })
    }
    //保存草稿
    function submit(value) {
      const { verifyInfo, tableData } = state.data
      const currentPayItem = tableData.find(_item => _item.isCount)
      const currentPayContentItem = tableData.find(_item => _item.isFooter)
      const isAllLessZero = currentPayContentItem.goodsList.every(it => it.purchaseGoodsPrice == 0)
      if (currentPayItem.amount <= 0 && !isAllLessZero) return ElMessage.error('申请付款总金额应大于0元')
      let sumAmount = 0
      currentPayItem.paymentList.forEach(v => sumAmount += (v.payAmount == undefined ? 0 : Number(v.payAmount)))
      if (verifyInfo.partnerType == 1 && currentPayItem.paymentList.length > 0) {
        if (sumAmount.toFixed(2) * 1 != currentPayItem.amount) return ElMessage.error('付款金额之和不等于总对账金额')
        const paymentIdList = new Set(currentPayItem.paymentList.map(item => item.supplierPaymentId))
        if (paymentIdList.size < currentPayItem.paymentList.length) return ElMessage.error('付款账号不能重复')
      }
      let param = {
        mode: value,
        id: verifyInfo.id,
      }
      param.paymentList = []
      param.purchaseList = []
      tableData?.filter(item => item.isFooter).forEach(_p => {
        const { paymentList } = tableData?.find(it => it.isCount)
        const { goodsList, purchaseOrderNumber, id, fee, taxRate, discount } = _p
        param.paymentList = paymentList.map(v => { return { id: v.id, supplierPaymentId: v.supplierPaymentId, payAmount: v.payAmount ? v.payAmount : 0 } })
        param.purchaseList.push({
          id,
          fee,
          discount,
          verifyItemIds: goodsList.map(p => p.purchaseVerifyItemIds).flat(),
          purchaseOrderNumber,
        })
      })

      param.receiptList = []
      state.imgList.forEach(s => {
        param.receiptList.push({
          id: s.id,
          applyId: verifyInfo.id,
          url: s.url
        })
      })
      queryAccountSave(param).then(res => {
        if (res.code == 200) {
          ElMessage.success('操作成功')
          goBack()
        }
      })
    }
    function resertUpload() {
      uploadImg.value.resert()
    }
    function deleteItem(index) {
      state.imgList.splice(index, 1)
    }

    function hand(e, v) {
      return false
    }
    /**
     * @param {*}: amountSum：对账金额之和 fee：运费 taxRate：税率 discount：折扣
     * @Description :计算对账金额  入库金额之和*（1+税率）+运费-折扣
     *
    */
    function calcTotalPrice(amountSum, fee, taxRate, discount) {
      return (amountSum * (1 + taxRate / 100) + fee * 1 - discount * 1).toFixed(2) * 1
    }
    //删除操作
    function deleteSku({ productId, purchaseOrderNumber }) {
      const { tableData } = state.data
      const sameItem = tableData.find(v => v.productId === productId && v.purchaseOrderNumber === purchaseOrderNumber && v.isContent)
      const haveThisGoodsList = tableData.find(item => item.isFooter && item.purchaseOrderNumber === purchaseOrderNumber)
      haveThisGoodsList.goodsList.splice(haveThisGoodsList.goodsList.findIndex(item => item.productId === productId), 1)
      // 删除当前条目
      tableData.splice(tableData.indexOf(sameItem), 1)
      // 重新计算合并的单元格
      const firstMergeItem = tableData.find(item => item.isContent && item.purchaseOrderNumber == purchaseOrderNumber)
      if (firstMergeItem) firstMergeItem.merge = tableData.filter(_v => _v.purchaseOrderNumber === firstMergeItem.purchaseOrderNumber && _v.isContent).length

      //重新计算当前对账金额
      let priceSum = 0, countSum = 0
      tableData.filter(item => item.isContent && item.purchaseOrderNumber === purchaseOrderNumber).forEach(_v => priceSum += _v.putInStorageTotalPrice)

      // 删除的当前数据下的isFooter内的数据要改变
      const isDelFooter = tableData.find(p => p.isFooter && p.purchaseOrderNumber === purchaseOrderNumber)
      isDelFooter.putInStorageTotalPrice = calcTotalPrice(priceSum, isDelFooter.fee, isDelFooter.taxRate, isDelFooter.discount)

      const itemOrderNumberLength = tableData.filter(n => n.purchaseOrderNumber == purchaseOrderNumber && n.isContent)?.length
      if (itemOrderNumberLength < 1) tableData.splice(tableData.findIndex(v => v.isFooter && v.purchaseOrderNumber == purchaseOrderNumber), 1)

      tableData.filter(footer => footer.isFooter).forEach(it => countSum += it.putInStorageTotalPrice)

      // 当前供应商下的汇总数据
      const isDelCount = tableData.find(p => p.isCount)
      isDelCount.amount = state.data.totalAmount = countSum
      if (tableData.filter(item => item.isContent).length < 1) state.data.tableData = []
      state.data.purchaseQuantity = tableData.filter(v => v.isContent && v.merge).length // 采购单
      const isContentList = tableData.filter(v => v.isContent)
      // const isContentList = tableData.filter(v => v.skuId)
      state.data.skuQuantity = Array.from(new Set(isContentList.map(it => it.skuId))).length || 0 // sku数量 按照skuid数据来统计sku种类数量
      state.data.goodsQuantity = state.data.tableData.length > 0 ? isContentList.map(i => i.putInStorageGoodsQuantity).reduce((pre, next) => pre += next) : 0
    }

    function changeFee(row) {
      const { tableData } = state.data
      // 重新计算当前对账金额
      let priceSum = 0, totalAmount = 0
      tableData.filter(item => item.isContent && item.purchaseOrderNumber === row.purchaseOrderNumber).forEach(_v => priceSum += _v.putInStorageTotalPrice)
      row.putInStorageTotalPrice = calcTotalPrice(priceSum, row.fee, row.taxRate, row.discount)
      tableData.filter(_item => _item.isFooter).forEach(v => totalAmount += v.putInStorageTotalPrice)
      state.data.totalAmount = tableData.find(item => item.isCount).amount = totalAmount
    }
    function imgClick(row) {
      state.visitble = true
      state.imgLists = row.url
    }
    return {
      ...toRefs(state),
      goBack,
      spanMethod,
      rowClassName,
      addPayment,
      delPayment,
      getImgList,
      getCompressList,
      uploadImg,
      clearn,
      deleteItem,
      hand,
      submit,
      calcTotalPrice,
      deleteSku,
      changeFee,
      exportCustomizedList,
      isShowDelete,
      getDetail,
      imgClick
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
    margin-top: 130px;
    margin-bottom: 80px;
    background: #fff;
    padding: 24px;

    .imgItem {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      margin-top: 24px;

      .img {
        // width: 100%;
        position: relative;
        height: 270px;
        display: flex;
        align-items: center;
        width: calc(33.333333% - 10px);
        margin-right: 10px;
        margin-top: 10px;
        .deleteIcon {
          position: absolute;
          width: 50px;
          height: 50px;
          right: 0;
          top: 0;
          box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.2);
          border-radius: 0px 0px 0px 61px;
          background: rgba(0, 0, 0, 0.3);
        }

        .delelteItem {
          position: absolute;
          right: 10px;
          top: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .flexFee {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    padding-right: 150px;
  }

  ::v-deep(.color-f2) {
    background-color: #fafafa;
  }

  ::v-deep(.color-ffbe6) {
    background: #fffbe6;
  }

  .footer-input-box {
    margin-left: 16px;
  }

  .text-left {
    text-align: left;
  }

  .reconmentCont {
    padding: 24px;
  }

  .mr-t-8 + .mr-t-8 {
    margin-top: 8px;
  }
}
</style>
