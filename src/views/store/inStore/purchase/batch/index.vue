<template>
  <div>
    <div class="pageView">
      <div class="purchaseInfo">
        <div class="item">
          <div class="name">仓库</div>
          <div class="value">万众智谷仓库</div>
        </div>
        <div class="item">
          <div class="name">经办人</div>
          <div class="value">{{userInfo.fullName}}</div>
        </div>
        <div class="item" v-if="tableData.trackNumber">
          <div class="name">运单号</div>
          <div class="value">{{tableData.trackNumber}}</div>
        </div>
        <div class="item">
          <div class="name">入库类型</div>
          <div class="value">{{ purchaseType(tableData.type) }}</div>
        </div>
      </div>
    </div>
    <div class="pageView mgr_top">
        <Table :checkboxType="2" checkedKey="ivtPurchaseDetailId" :columns="columns" :border="true" :tableData="tableData.purchaseIdGoodsInfoList" fieldName="purchaseGoodsInfo"
        @selectRowKeys="selectRowKeys" ref="tableRef">
          <template v-slot:extraHeader="scoped">
            <div class="extraHeader">
              <div class="left">
                <span v-if="[2, 3].includes(tableData.type)">批次号: {{scoped.row.ivtPurchaseId}}</span>
                <span v-if="[4, 5, 6].includes(tableData.type)">采购单号: {{scoped.row.purchaseOrderNumber}}</span>
								<span v-if="[4, 5, 6].includes(tableData.type)">采购员: {{scoped.row.purchaseUserName}}</span>
                <span v-if="[4, 5, 6].includes(tableData.type)">采购备注: {{scoped.row.purchaseOrderRemark?.remarkTypeName}} {{scoped.row.purchaseOrderRemark?.remark}}</span>
              </div>
              <div class="right">
                <span>采购单总数：{{scoped.row.purchaseNumAll}}</span>
                <span>已入库：<span style="color: #70b603">{{scoped.row.inStoreTotal}}</span></span>
                <span>未入库：<span style="color: #e1521b">{{scoped.row.uninStoreTotal}}</span></span>
              </div>
            </div>
          </template>
          <template v-slot:mainImg="scoped">
            <div class="mainImg">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="scoped.row.mainImg" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 60px; height: 60px;" :src="scoped.row.mainImg" fit="contain"></el-image>
                </template>
              </el-popover>
              <div class="tag1" v-if="scoped.row.goodAttribute == 2">相似</div>
              <div class="tag2" v-if="scoped.row.goodAttribute == 3">替代</div>
            </div>

          </template>
          <template v-slot:goodsName="scoped">
            <div class="goodsName lines-overflow" :title="scoped.row.goodsName">{{scoped.row.goodsName}}</div>
            <div class="sku textOverflow" :title="scoped.row.goodsSku">{{scoped.row.goodsSku}}</div>
            <div class="textOverflow" :title="scoped.row.skuCode">{{scoped.row.skuCode}}</div>
          </template>
          <template v-slot:spe="scoped">
            <div class="lines-overflow" :title="scoped.row.speVal">{{scoped.row.speVal}}</div>
            <!-- 国码预留 -->
            <div v-if="scoped.row.codeVal" style="color:#2fbba6;font-size:12px">
								国码：{{scoped.row.codeVal}}
						</div>
          </template>
          <template v-slot:shelf="{row}">
            <div class="shelf">
              <div v-for="(item, index) in row.gridProductList" :key="index">
                {{item.areaName}} {{item.gridName}} X <span :style="{'color': item.areaId == 3 ? '#f69a86' : '#409eff'}">{{item.areaId == 3 ? item.quantity : item.originQuantity}}</span>
              </div>
            </div>
          </template>
          <template v-slot:buyNum="scoped">
            <div>{{scoped.row.num}}</div>
            <div v-if="scoped.row.salesreturnQuantity > 0">退货: {{scoped.row.salesreturnQuantity}}</div>
            <div v-if="scoped.row.cancelQuantity > 0">取消: {{scoped.row.cancelQuantity}}</div>
          </template>
          <template v-slot:inStoreRemark="scoped">
            <div v-if="scoped.row.unInstoreNum == 0">-</div>
            <el-input v-model="scoped.row.inStorageRemark" placeholder="请输入备注"  :maxlength="60" style="width: 90%" v-else></el-input>
          </template>
          <template v-slot:inStoreInfo="scoped">
            <div>
              <span style="display: inline-block; width: 60px;">已入库</span>
              <span style="display: inline-block; width: 60px;">{{scoped.row.arrivalNum}}</span></div>
            <div>
              <span style="display: inline-block; width: 60px;">未入库</span>
              <span style="display: inline-block; width: 60px;">{{scoped.row.unInstoreNum}}</span>
            </div>
            <div v-if="scoped.row.extraNum > 0">
              <span style="display: inline-block; width: 60px;">多发入库</span>
              <span style="display: inline-block; width: 60px; color: #f69a86;">{{scoped.row.extraNum}}</span>
            </div>
          </template>
          <template v-slot:inStoreNum="scoped">
            <div v-if="scoped.row.unInstoreNum == 0">-</div>
            <el-input-number size="small" :precision="0" v-model="scoped.row.assignNum" style="width: 80%" controls-position="right" :min="0" :max="scoped.row.unInstoreNum" v-else
              @blur="assignNumBlur(scoped.row.assignNum, scoped.index, scoped.ind)"></el-input-number>
          </template>
          <template v-slot:operation="scoped">
            <div class="operation">
              <!-- 打印商品标签过滤货架为收货暂存区、次品区的商品， 打印多发入库过滤拣货区、次品区的商品 -->
              <!-- <el-button type="text" :disabled="scoped.row.ablePrint == 0" @click="openPrintExpressSheet(scoped.row.ivtPurchaseDetailId)">打印面单</el-button> -->
              <el-button type="text" :disabled="scoped.row.ablePrint == 0" style="cursor: not-allowed">打印面单</el-button>
              <el-button type="text" :disabled="scoped.row.unInstoreNum == 0" @click="scoped.row.assignNum = scoped.row.unInstoreNum" style="margin-left: 0">一键输入</el-button>
              <el-button type="text" v-if="scoped.row.unInstoreNum == 0 && [4, 5].includes(tableData.type)" @click="pilosityInstore(scoped.row)" style="margin-left: 0">多发入库</el-button>
            </div>
          </template>
        </Table>
    </div>
    <div class="footer">
      <el-button type="primary"  v-if="ifShowSaveBtn" :disabled="selectIvtPurchaseDetailId.length == 0" @click="setAssignNum">一键输入</el-button>
      <el-button type="primary"  v-if="ifShowSaveBtn" @click="saveEvent" :loading="loading">保存并继续</el-button>
      <el-button type="primary"  v-if="ifSave" :disabled="filterPrintExpressSheetInfo.length == 0" @click="openPrintExpressSheet('select')">打印面单</el-button>
      <el-button type="primary"  v-if="ifSave" :disabled="filterPrintQrcodeInfo.length == 0" @click="showStatus = 4">打印商品标签</el-button>
      <el-button type="primary"  v-if="ifShowPrintPilosity" :disabled="filterPrintPilosityInfo.length == 0" @click="printPilosity">打印多发标签</el-button>
      <el-button  @click="cancel">取消</el-button>
    </div>
    <PilosityInstore v-if="showStatus == 1" :pilosityInfo="pilosityInfo" @closeEvent="closePilosityInstoreEvent" @affirmEvent="affirmPilosityInstoreEvent" />
    <PrintExpressSheet v-if="showStatus == 2" :ivtPurchaseDetailId="ivtPurchaseDetailId" :type="PrintExpressSheetType" :purchaseType="tableData.type" @closeEvent="closeEvent" />
    <PrintExpressSheetStatus v-if="showStatus == 3" :expressSheetStatus="expressSheetStatus" @closeEvent="closePrintExpressSheetStatus" @affirmEvent="affirmPrintExpressSheetStatus" />
    <PrintQrcode v-if="showStatus == 4" :selectGoodsInfo="filterPrintQrcodeInfo" @closeEvent="closeQrCodeInfo" />
    <StorageFailure v-if="showStatus == 5" :failList="failList" @closeEvent="showStatus = null" />
    <PrintPilosity v-if="showStatus == 6" :selectGoodsInfo="filterPrintPilosityInfo" @closeEvent="closeQrCodeInfo" />
  </div>
</template>

<script>
import Table from './components/elTable/index.vue'
import PrintExpressSheet from './components/printExpressSheet.vue'
import PrintExpressSheetStatus from '../components/printExpressSheetStatus.vue'
import PrintQrcode from './components/printQrcodes.vue'
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { instorage, purchaseSearch } from '@/api/store.js'
import StorageFailure from './components/storageFailure.vue'
import PilosityInstore from './components/pilosityInstore.vue'
import PrintPilosity from './components/printPilosity.vue'
import { deepCopy, getuuid } from '@/utils/tool.js'
export default {
  setup() {
    let tableRef = ref(null)
    let route = useRoute()
    let router = useRouter()
    let store = useStore()
    let batchInfo = computed(() => store.getters.purchaseInfo)
    let stage = computed(() => store.getters.stage)
	  let userInfo = computed(() => store.state.user.userInfo)
    let batchNum = route.query.batchNum
    let formRef = ref(null)
    let state = reactive({
      columns: [
        {
          title: '图片',
					key: 'mainImg',
					width: '100px',
        },
        {
          title: '货品名称/SKU',
					key: 'goodsName',
					width: '220px',
        },
        {
          title: '规格值',
					key: 'spe',
					width: '200px',
        },
        {
          title: '货架位',
					key: 'shelf',
					width: '200px',
        },
        {
          title: '采购数量',
					key: 'buyNum',
					width: '100px',
        },
        {
          title: '入库备注',
					key: 'inStoreRemark',
					width: '302px',
        },
        {
          title: '入库信息',
					key: 'inStoreInfo',
					width: '150px',
        },
        {
          title: '入库数量',
					key: 'inStoreNum',
					width: '168px',
        },
        {
          title: '操作',
					key: 'operation',
					width: '108px',
        },
      ],
      tableData: batchInfo.value,
      selectIvtPurchaseDetailId: [], // 当前勾选的采购明细id
      selectGoodsInfo: [],
      ifSave: false, // 是否保存并继续了
      ifShowSave: true, // 是否显示保存并继续按钮
      ivtPurchaseDetailId: [], // 采购明细id
      PrintExpressSheetType: 0, // 打单类型
      expressSheetStatus: {},
      pilosityInfo: { // 多发入库弹框的数据
        mainImg: '',
        goodsName: '',
        speVal: '',
        goodsSku: '',
        ivtPurchaseDetailId: null,
        type: null,
        trackNumber: batchInfo.value.trackNumber
      },
      showStatus: null, // 控制弹框的显示
      failList: [], // 异常入库信息
      ifShowSaveBtn: false, // 是否显示一键入库、保存并继续按钮
      ifShowPrintPilosity: false, // 是否显示多发入库标签
      filterPrintExpressSheetInfo: [], // 筛选过后的打印面单数据
      filterPrintQrcodeInfo: [], // 筛选过后的打印商品标签
      filterPrintPilosityInfo: [], // 筛选过后的打印多发数据
      loading: false
    })
    // assignNum : 分配的入库数量
    // num: 订单采购数量(总量)
    // arrivalNum：已入库数量
    // unInstoreNum: 未入库数量

    // 获取当前勾选的商品对应的数据
    watch(() => state.selectIvtPurchaseDetailId, (newVal) => {
      state.selectGoodsInfo = []
      state.tableData.purchaseIdGoodsInfoList.forEach(item => {
        item.purchaseGoodsInfo.forEach(it => {
          let ble = state.selectIvtPurchaseDetailId.includes(it.ivtPurchaseDetailId)
          if (ble) state.selectGoodsInfo.push(it)
        })
      })
    })

    // 控制打印面单、打印商品标签、打印多发标签的数据筛选
    watch(() => state.selectGoodsInfo, (newVal) => {
      let arr = [], arr2 = [], arr3 = []
      newVal.forEach(item => {
        if (item.ablePrint == 1) arr.push(item.ivtPurchaseDetailId)
        item.gridProductList.forEach(it => {
           // areaId: 1拣货区、2次品区、3暂存区
          if (item.arrivalNum > 0 && it.areaId == 1) {
            let v = deepCopy(item)
            v.areaName = it.areaName
            v.gridName = it.gridName
            v.originQuantity = it.originQuantity
            v.maxNum = it.originQuantity
            v.uuId = getuuid()
            arr2.push(v)
          }
          if (it.areaId == 3) {
            let v = deepCopy(item)
            v.areaName = it.areaName
            v.gridName = it.gridName
            v.quantity = it.quantity
            v.maxNum = it.quantity
            v.purchaseOrderNumber = item.purchaseOrderNumber
            v.uuId = getuuid()
            arr3.push(v)
          }
        })
      })
      state.filterPrintExpressSheetInfo = arr
      state.filterPrintQrcodeInfo = arr2
      state.filterPrintPilosityInfo = arr3
    }, { deep: true })

    // 控制一键入库、保存并继续、打印多发标签的显示与隐藏
    watch(() => state.tableData.purchaseIdGoodsInfoList, (newVal) => {
      let num = 0, num2 = 0
      newVal.forEach(item => {
        item.purchaseGoodsInfo.forEach((it, ind) => {
          if (it.unInstoreNum > 0) num++
          if (it.extraNum > 0) num2++
        })
      })
      state.ifShowSaveBtn = num == 0 ? false : true
      state.ifShowPrintPilosity = num2 == 0 ? false : true
    }, { deep: true }, { immediate: true })

    // 入库类型枚举
    let purchaseType = computed(() => {
      return (type) => {
        switch (type) {
          case 2:
            return '订货入库'
          case 3:
            return '订货入库'
          case 4:
            return '采购入库'
          case 5:
            return '采购入库'
          case 6:
            return '多发特批入库'
        }
      }
    })

    // 初始化数据
    let initFun = () => {
      if (stage.value == 1) { // 未点击保存并继续过
        state.ifSave = false
      } else { // 已保存
        state.ifSave = true
      }
      let num = 0, num2 = 0
      state.tableData.purchaseIdGoodsInfoList.forEach(item => {
        item.purchaseNumAll = 0
        item.inStoreTotal = 0 // 已入库总数
        item.uninStoreTotal = 0 // 未入库总数
        item.purchaseGoodsInfo.forEach(it => {
          it.inStorageRemark = null
          it.assignNum = 0
          it.purchaseOrderNumber = item.purchaseOrderNumber
          if ([4, 5, 6].includes(state.tableData.type)) {
            it.unInstoreNum = it.num - it.arrivalNum - it.salesreturnQuantity - +it.cancelQuantity
          } else {
            it.unInstoreNum = it.num - it.arrivalNum
          }
          if (it.unInstoreNum > 0) num++
          if (it.extraNum > 0) num2++
          item.purchaseNumAll = item.purchaseNumAll + it.num

          item.inStoreTotal = item.inStoreTotal + it.arrivalNum
          item.uninStoreTotal = item.uninStoreTotal + it.unInstoreNum
        })
      })
      state.ifShowSaveBtn = num == 0 ? false : true
      state.ifShowPrintPilosity = num2 == 0 ? false : true
      tableRef.value.initFun()
    }

    // 获取入库信息
    let getPurchaseInfo = () => {
      purchaseSearch({ ivtPurchaseId: batchNum, warehouseId: 1, flag: 1 }).then(res => {
        if (res.code == 200) {
          store.dispatch('store/setPurchaseInfoActions', res.data)
          state.tableData = res.data
          initFun()
        } else {
          ElMessage.error(error.message);
        }
      })
    }

    // 接收table组件勾选的goodsId
    let selectRowKeys = (value) => {
      state.selectIvtPurchaseDetailId = value
    }

    // 一键输入
    let setAssignNum = () => {
      state.selectGoodsInfo.forEach(item => {
        item.assignNum = item.unInstoreNum
      })
    }

    // 分配数量失去焦点
    let assignNumBlur = (value, index, ind) => {
      if (value == undefined) state.tableData.purchaseIdGoodsInfoList[index].purchaseGoodsInfo[ind].assignNum = 0
    }

    // 保存并继续
    let saveEvent = () => {
      let arr = []
      let ble = true
      state.tableData.purchaseIdGoodsInfoList.forEach(item => {
        let saveInfo = []
        let isChangeData = false
        item.purchaseGoodsInfo.forEach(it => {
          if (it.assignNum) {
            isChangeData = true
            let obj = {
              ivtPurchaseDetailId: it.ivtPurchaseDetailId,
              goodsId: it.goodsId,
              num: it.assignNum,
              remark: it.inStorageRemark,
              goodsName: it.goodsName,
              goodsSku: it.goodsSku,
              speType: it.speType,
              skuImg: it.mainImg
            }
            saveInfo.push(obj)
            ble = false
          }
        })
        if (isChangeData) {
          arr.push({
            purchaseGoodsVoList: saveInfo,
            purchaseId: item.ivtPurchaseId + ''
          })
        }
      })
      if (ble) {
        ElMessage.error('请输入商品入库数量！')
        return false;
      }
      let params = {
        reqPurchaseIdGoodsVo: arr,
        trackNumber: state.tableData.trackNumber,
        warehouseId: 1,
        type: state.tableData.type
      }
      state.loading = true
      instorage(params).then(res => {
        state.loading = false
        if (res.code == 200) {
          if (!res.data.flag) { // 入库异常
            state.failList = res.data.failList
            state.showStatus = 5
          }
          store.dispatch('store/setStageActions', 2)
          getPurchaseInfo()
        } else {
          ElMessage.error(error.message);
        }
      })
    }

    //取消
    let cancel = () => {
      ElMessageBox.confirm('取消将会清除界面输入数据，是否继续', '警告', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          router.replace('/store/instore/purchase')
        })

    }

    // 多发入库
    let pilosityInstore = ({ mainImg, goodsName, speVal, goodsSku, ivtPurchaseDetailId }) => {
      state.pilosityInfo.mainImg = mainImg
      state.pilosityInfo.goodsName = goodsName
      state.pilosityInfo.speVal = speVal
      state.pilosityInfo.goodsSku = goodsSku
      state.pilosityInfo.ivtPurchaseDetailId = ivtPurchaseDetailId
      state.showStatus = 1
    }

    let printPilosity = () => {
      if (state.filterPrintPilosityInfo.length == 0) {
        ElMessage.error('请选择可以多发入库的商品！')
        return false
      }
      state.showStatus = 6
    }

    // 关闭多发入库弹框
    let closePilosityInstoreEvent = () => {
      state.showStatus = null
    }

    // 确认多发入库
    let affirmPilosityInstoreEvent = (value) => {
      if (value) {
        state.failList = value
        state.showStatus = 5
      } else {
        state.showStatus = null
      }
      getPurchaseInfo()
    }

    // 打开打印面单弹框
    let openPrintExpressSheet = (value) => {
      if (value == 'select') { // 选择打印面单
        state.ivtPurchaseDetailId = state.filterPrintExpressSheetInfo
        state.PrintExpressSheetType = 1
      } else { // 单商品打印面单
        state.ivtPurchaseDetailId = []
        state.ivtPurchaseDetailId.push(value)
        state.PrintExpressSheetType = 0
      }
      state.showStatus = 2
    }

    // 关闭打印面单弹框
    let closeEvent = (value) => {
      if (value) {
        state.expressSheetStatus = value
        state.showStatus = 3
      } else {
        state.showStatus = null
      }
    }

    // 关闭打印商品标签弹框
    let closeQrCodeInfo = () => {
      state.showStatus = null
    }

    // 关闭打印弹框
    let closePrintExpressSheetStatus = () => {
      state.showStatus = null
    }

    // 打印完成
    let affirmPrintExpressSheetStatus = () => {
      state.showStatus = null
    }

    // 打印商品标签弹框
    let affirmQrCodeInfo = () => {
      state.showStatus = null
    }

    onMounted(() => {
      initFun()
    })
    return {
      ...toRefs(state),
      stage,
      userInfo,
      formRef,
      tableRef,
      purchaseType,
      selectRowKeys,
      setAssignNum,
      saveEvent,
      cancel,
      openPrintExpressSheet,
      closeEvent,
      closeQrCodeInfo,
      affirmQrCodeInfo,
      closePrintExpressSheetStatus,
      affirmPrintExpressSheetStatus,
      assignNumBlur,
      pilosityInstore,
      closePilosityInstoreEvent,
      affirmPilosityInstoreEvent,
      printPilosity
    }
  },
  components: {
    Table,
    PrintExpressSheet,
    PrintQrcode,
    PrintExpressSheetStatus,
    StorageFailure,
    PilosityInstore,
    PrintPilosity
  }
}
</script>


<style lang="scss" scoped>
.pageView{
  .lines-overflow{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  margin-bottom: 50px;
  .purchaseInfo{
    display: flex;
    height: 54px;
    border: 1px solid #EBEEF5;
    border-right: none;
    color: rgba(0,0,0,.65);
    .item{
      display: flex;
      justify-content: space-between;
      flex: 1;
      .name{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        background-color: #F5F7FA;
      }
      .value{
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #EBEEF5;
        border-right: 1px solid #EBEEF5;
      }
    }
  }
  .extraHeader{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    background-color: #F5F7FA;
    font-size: 14px;
    padding: 0 20px;
    span{
      margin-right: 16px;
    }
  }
  a{
    font-size: 14px;
    color: #1e93ff;
  }
  .goodsName{
    text-align: left;
    padding: 0 16px;
  }
  .sku{
    padding: 0 16px;
    font-weight: bold;
  }
  .shelf{
    padding: 10px;
  }
}
.mgr_top{
  margin-top: 24px;
}
.footer{
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - var(--sideBarWidth));
  height: 52px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:  10px 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.operation{
  display: flex;
  flex-direction: column;
  .el-button{
    margin-left: 0;
    min-height: 20px;
    padding: 4px;
  }
}
.mainImg{
  position: relative;
}
.tag1, .tag2{
  position: absolute;
  left: 45px;
  top: -5px;
  border-radius: 4px;
  padding: 0 2px;
  background-color: #fff;
}
.tag1{
  color: #f6a439;
  border: 1px solid #f6a439;
}
.tag2{
  color: #da1931;
  border: 1px solid #da1931;
}
</style>
