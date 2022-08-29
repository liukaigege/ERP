<template>
  <div class="pageView">
    <div class="title">关联包裹</div>
    <div class="headBox">
      <Table :tableData="purchaseInfo.relPackage || []" fieldName="relGoodsInfo" :checkboxType="1" checkedKey="packageId" :columns="columns" :border="true" @selectRowKeys="selectRowKeys" ref="tableRef">
        <template v-slot:extraHeader="scoped">
          <div class="extraHeader">
            <span>包裹号：{{scoped.row.packageId}}</span>
            <span>包裹类型：{{packageType(scoped.row.packageType)}}</span>
            <span>物流信息：{{scoped.row.logisticsInfo ? scoped.row.logisticsInfo : '无'}}</span>
            <el-tag type="warning" v-if="scoped.row.priorityFlag">优先</el-tag>
            <el-tag v-if="scoped.row.deductFlag == 0">不扣库存</el-tag>
            <el-tag effect="dark">{{packageStatus(scoped.row.packageStatus)}}</el-tag>
            <el-tag v-if="scoped.row.printCount == 0">可打单</el-tag>
            <el-tag type="info" v-if="scoped.row.printCount > 0">已打单</el-tag>
            <el-tag type="danger" v-if="scoped.row.layFlag == 1">已搁置</el-tag>
          </div>
        </template>
        <template v-slot:mainImg="scoped">
          <div class="imgBox">
            <el-image style="width: 60px; height: 60px" :src="scoped.row.mainImg" fit="contain"></el-image>
          </div>
        </template>
        <template v-slot:goodsName="scoped">
          <div class="goodsName textOverflow_2" :title="scoped.row.goodsName">{{scoped.row.goodsName}}</div>
        </template>
        <template v-slot:sku="scoped">
          <div class="sku textOverflow_2" :title="scoped.row.goodsSku">{{scoped.row.goodsSku}}</div>
          <div class="textOverflow" :title="scoped.row.skuCode" style="padding: 0 20px;">{{scoped.row.skuCode}}</div>
        </template>
        <template v-slot:gridProduct="{ row }">
          <el-popover placement="top-start" title="货架位" :width="200" trigger="hover" :disabled="!row.gridProductList || row.gridProductList?.length <= 3">
            <div v-for="(item, index) in row.gridProductList" :key="index">
              {{item.areaName}} {{item.gridName}} X {{item.originQuantity}}
            </div>
            <template #reference>
              <div v-if="row.gridProductList">
                <div v-for="(item, index) in row.gridProductList" :key="index">
                  <div v-if="index<3">
                    {{item.areaName}} {{item.gridName}} X {{item.originQuantity}}
                  </div>
                </div>
                <div class="ellipsis" v-if="row.gridProductList?.length > 3">...</div>
              </div>
              <div v-else>-</div>
            </template>
          </el-popover>
        </template>
        <template v-slot:buyNum="scoped">
          <div class="buyNum">{{scoped.row.goodsQuantity}}</div>
        </template>
        <template v-slot:arrivalNum="scoped">
          <div class="arrivalNum">{{scoped.row.arrivalQuantity}}</div>
        </template>
      </Table>
    </div>
    <div class="footerBox">
      <div class="orderInfo">
        <span>订单号：{{purchaseInfo.transactionId}}</span>
        <span>仓库：万众智谷仓库</span>
        <span>经办人：{{userInfo.fullName}}</span>
      </div>
      <div class="tableBox">
        <el-table :data="[purchaseInfo.mainGoodsInfo]" style="width: 100%" border :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
          <el-table-column label="图片" className="my-cell" :resizable="false">
            <template #default="scope" style="position: relative;">
              <el-image style="width: 60px; height: 60px" :src="scope.row.mainImg" fit="contain"></el-image>
              <!-- <el-tag size="small" type="warning" class="tag" v-if="scope.row.purchaseStatus == 0">导入成功</el-tag> -->
              <el-tag size="small" type="warning" class="tag" v-if="scope.row.purchaseStatus == 1 || scope.row.purchaseStatus == 0">未入库</el-tag>
              <el-tag size="small" type="success" class="tag" v-if="scope.row.purchaseStatus == 2">部分入库</el-tag>
              <el-tag size="small" class="tag" v-if="scope.row.purchaseStatus == 3">已入库</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="货品名称" :resizable="false">
            <template #default="scope">
              <div class="goodsName textOverflow_2" :title="scope.row.goodsName">{{scope.row.goodsName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsSku" label="商品sku" :resizable="false">
            <template #default="scope">
              <div class="goodsSku textOverflow_2" :title="scope.row.goodsSku">{{scope.row.goodsSku}}</div>
              <div class="textOverflow" :title="scope.row.skuCode">{{scope.row.skuCode}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shelfPosition" label="货架位" :resizable="false">
            <template #default="{row}">
              <el-popover placement="top-start" title="货架位" :width="200" trigger="hover" :disabled="!row.gridProductList || row.gridProductList?.length <= 3">
                <div v-for="(item, index) in row.gridProductList" :key="index">
                  {{item.areaName}} {{item.gridName}} X {{item.originQuantity}}
                </div>
                <template #reference>
                  <div>
                    <div v-for="(item, index) in row.gridProductList" :key="index">
                      <div v-if="index<3">
                        {{item.areaName}} {{item.gridName}} X {{item.originQuantity}}
                      </div>
                    </div>
                    <div class="ellipsis" v-if="row.gridProductList?.length > 3">...</div>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="订单采购数量" :resizable="false"></el-table-column>
          <el-table-column prop="takeNum" label="本次收货" :resizable="false">
            <template #default>
              <div>{{takeNumComputed}}</div>
            </template>
          </el-table-column>
          <el-table-column label="本次质检信息" :resizable="false">
            <template #default>
              <div>
                <span style="display: inline-block; width: 60px;">合格</span>
                <span style="display: inline-block; width: 60px;">{{type == 1 ? qualifiedNum : '-'}}</span>
              </div>
              <div>
                <span style="display: inline-block; width: 60px;">不合格</span>
                <span style="display: inline-block; width: 60px;">{{type == 1 ? arrivalNum - qualifiedNum : '-'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="入库信息" :resizable="false">
            <template #default="scope">
              <div>
                <span style="display: inline-block; width: 60px;">已入库</span>
                <span style="display: inline-block; width: 60px;">{{arrivalNumComputed(scope)}}</span>
              </div>
              <div>
                <span style="display: inline-block; width: 60px;">未入库</span>
                <span style="display: inline-block; width: 60px;">{{unArrivalNumComputed(scope)}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button type="primary" @click="ifShow = 1" :disabled="scanQrcodeBtnComputed">扫描二维码</el-button>
        <el-button type="primary" @click="printExpressSheetEvent" :disabled="printExpressSheetComputed.length == 0">打印面单</el-button>
        <el-button type="primary" :disabled="filterPrintQrcode.length == 0" @click="ifShow = 3">打印商品标签</el-button>
        <el-button @click="overEvent">结束</el-button>
      </div>
    </div>
    <ScanQrcode v-if="ifShow == 1" :packageIdAll="packageIdAll" :ivtPurchaseDetailId="purchaseInfo.mainGoodsInfo.ivtPurchaseDetailId" @closeEvent="closeEvent" @affirmEvent="affirmScanQrcode" />
    <PrintExpressSheetStatus v-if="ifShow == 2" :expressSheetStatus="expressSheetStatus" @closeEvent="closeEvent" @affirmEvent="affirmPrintExpressSheetStatus" />
    <PrintLabel v-if="ifShow == 3" :selectPackageArr="filterPrintQrcode" @closeEvent="closeEvent" @affirmEvent="affirmPrintLabel" />
    <QrCodeInfo v-if="ifShow == 4" :twicePurchaseInfo="twicePurchaseInfo" @closeEvent="closeEvent" @affirmEvent="affirmQrCodeInfo" />
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { printExpressSheet, gridProduct } from '@/api/store.js'
import { ElMessage } from 'element-plus'
import { notAllowRouter, getuuid } from '@/utils/tool.js'
import ScanQrcode from './components/scanQrcode.vue'
import PrintExpressSheetStatus from '../../components/printExpressSheetStatus.vue'
import PrintLabel from './components/printLabel.vue'
import QrCodeInfo from './components/qrCodeInfo.vue'
import Table from '@/components/elTable/index.vue'
import { _debounce } from '@/utils/tool.js'
import { deepCopy } from '../../../../../../utils/tool'
export default {
  setup() {
    let tableRef = ref(null)
    let router = useRouter()
    let store = useStore()
    let route = useRoute()
    const batchNum = route.query.batchNum
    let userInfo = computed(() => store.state.user.userInfo)
    let purchaseInfo = computed(() => store.getters.purchaseInfo)
    let state = reactive({
      columns: [
        {
          title: '图片',
          key: 'mainImg',
          width: '186px',
        },
        {
          title: '货品名称',
          key: 'goodsName',
          width: '385px',
        },
        {
          title: '商品sku',
          key: 'sku',
          width: '302px'
        },
        {
          title: '货架位',
          key: 'gridProduct',
          width: '300px'
        },
        {
          title: '商品数量',
          key: 'buyNum',
          width: '193px'
        },
        {
          title: '到货数量',
          key: 'arrivalNum',
          width: '193px'
        }
      ],
      arrivalNum: 0, // 到货数
      qualifiedNum: undefined, // 合格数
      type: 0, // 直接扫码进入：0， 质检完进入：1
      ifShow: null,
      packageIdAll: [], // 所有的包裹号数组
      selectPackageId: [], // 已选择的包裹id
      selectPackageArr: [], // 已选择的包裹数据
      twicePurchaseInfo: [], // 二次扫描传入的数据
      expressSheetStatus: {},
      filterPrintQrcode: [] // 筛选出可打印商品标签的数据
    })

    // 获取id对应的包裹数据
    let getPackageInfo = () => {
      state.selectPackageArr = []
      purchaseInfo.value.relPackage.forEach(item => {
        let ble = state.selectPackageId.includes(item.packageId)
        if (ble) {
          state.selectPackageArr.push(item)
        }
      })
      // 根据货架位将三维数组扁平成二维数组，用于打印商品标签
      let arr = []
      let step = 0
      state.selectPackageArr.forEach(item => {
        // debugger
        let step2 = 0
        item.relGoodsInfo.forEach(it => {
          if (it.gridProductList?.length) {
            if (step2 == 0) {
              arr[step] = {}
              arr[step].packageType = item.packageType
              arr[step].packageId = item.packageId
              arr[step].relGoodsInfo = []
            }
            it.gridProductList.forEach(scope => {
              arr[step].relGoodsInfo[step2] = deepCopy(it)
              arr[step].relGoodsInfo[step2].uuId = getuuid()
              arr[step].relGoodsInfo[step2].gridInfo = scope
              arr[step].relGoodsInfo[step2].gridInfo.maxNum = scope.originQuantity
              step2++
            })
          }
        })
        if (arr[step]) step++
      })
      state.filterPrintQrcode = arr
    }

    // 本次收货
    let takeNumComputed = computed(() => {
      if (state.type == 0) {
        return '-'
      } else if (state.type == 1) {
        return state.arrivalNum
      }
    })

    // 已入库
    let arrivalNumComputed = computed(() => {
      return function (scoped) {
        if (state.type == 0) {
          return purchaseInfo.value.mainGoodsInfo.arrivalNum
        } else if (state.type == 1) {
          return purchaseInfo.value.mainGoodsInfo.arrivalNum + state.qualifiedNum
        }
      }
    })

    // 未入库
    let unArrivalNumComputed = computed(() => {
      return function (scoped) {
        let num = 0
        if (state.type == 0) { // 商品总量 - 已入库数量
          num = purchaseInfo.value.mainGoodsInfo.num - purchaseInfo.value.mainGoodsInfo.arrivalNum
        } else if (state.type == 1) { // 商品总量 - (已入库数量+合格数)
          num = purchaseInfo.value.mainGoodsInfo.num - (purchaseInfo.value.mainGoodsInfo.arrivalNum + state.qualifiedNum)
          if (num == 0) { // 若质检后未入库数量为0，则修改包裹入库状态为已入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 3
          }
        }
        return num
      }
    })

    // 匹配包裹类型
    let packageType = computed(() => {
      return function (type) {
        switch (type) {
          case 1:
            return '单品单数'
          case 2:
            return '单品多数'
          case 3:
            return '多品多数'
        }
      }
    })

    // 匹配包裹状态
    let packageStatus = computed(() => {
      return function (status) {
        switch (status) {
          case 0:
            return '待审核'
          case 1:
            return '待处理'
          case 2:
            return '申请中'
          case 3:
            return '申请失败'
          case 4:
            return '申请成功'
          case 5:
            return '待打单有货'
          case 6:
            return '待打单缺货'
          case 7:
            return '待发货'
          case 8:
            return '已发货'
          case 9:
            return '未付款'
          case -1:
            return '更换物流待处理'
          case -2:
            return '更换待打单'
          case -3:
            return '更换待发货'
          case -4:
            return '已发货'
        }
      }
    })

    // 监听selectPackageId，获取对应包裹数据
    watch(() => state.selectPackageId, getPackageInfo)

    // 根据已选中的包裹信息筛选出可打印面单的包裹的packageId数组
    let printExpressSheetComputed = computed(() => {
      let arr = state.selectPackageArr.filter(item => item.printCount !== null)
      let printExpressSheetArr = []
      arr.forEach(item => {
        printExpressSheetArr.push(item.packageId)
      })
      return printExpressSheetArr
    })

    // 当所有包裹内的其他商品都已入库，二次扫码按钮置灰
    let scanQrcodeBtnComputed = computed(() => {
      let goodsId = purchaseInfo.value.mainGoodsInfo.goodsId // 主品id
      let ble = true
      purchaseInfo.value.relPackage.forEach(item => {
        item.relGoodsInfo.forEach(it => {
          if (goodsId !== it.goodsId && it.goodsQuantity !== it.arrivalQuantity) {
            ble = false
          }
        })
      })
      return ble
    })

    const methods = {
      getGridProduct() { // 获取货架位
        return new Promise((reslove) => {
          gridProduct({ warehouseId: 1, ivtPurchaseDetailId: purchaseInfo.value.mainGoodsInfo.ivtPurchaseDetailId }).then((res) => {
            if (res.code == 200) {
              purchaseInfo.value.mainGoodsInfo.gridProductList = res.data.mainGoodsGridProduct
              // res.data.relPackage.forEach((item, index) => {
              //   item.relGoodsInfo.forEach((it, ind) => {
              //     purchaseInfo.value.relPackage[index].relGoodsInfo[ind].gridProductList = it.gridProductList
              //   })
              // })
              // 因为质检页面入库后重新排序导致和res的数据排序不一致
              res.data.relPackage.forEach(item => {
                item.relGoodsInfo.forEach(it => {
                  purchaseInfo.value.relPackage.forEach(scoped => {
                    scoped.relGoodsInfo.forEach(scope => {
                      if (item.packageId == scoped.packageId && it.ivtPurchaseDetailId == scope.ivtPurchaseDetailId) {
                        scope.gridProductList = it.gridProductList
                      }
                    })
                  })
                })
              })
              reslove()
            } else {
              ElMessage.error(res.message)
            }
          })
        })
      },
      closeEvent() {
        state.ifShow = null
      },
      affirmScanQrcode(value) { // 扫描成功
        state.ifShow = 4
        state.twicePurchaseInfo = value
      },
      affirmPrintExpressSheetStatus() { // 打印完成
        state.ifShow = null
        purchaseInfo.value.relPackage.forEach(item => {
          let ble = printExpressSheetComputed.value.includes(item.packageId)
          if (ble) item.printCount = 1
        })
        store.dispatch('store/setPurchaseInfoActions', purchaseInfo.value)

        if (batchNum) { // 跳转定制品入库列表页面
          router.push({
            name: 'CustomizeBatch',
            query: {
              batchNum
            }
          })
        } else {
          router.replace('/store/instore/purchase')
        }
        // router.replace('/store/instore/purchase')
      },
      affirmPrintLabel() { // 确定打印标签
        state.ifShow = null
      },
      affirmQrCodeInfo() { // 保存
        state.ifShow = null
        methods.getGridProduct().then(() => {
          state.selectPackageId = []
          purchaseInfo.value.relPackage.forEach((item, index) => {
            if (item.printCount == 0) {
              state.selectPackageId.push(item.packageId)
            }
          })
          store.dispatch('com/setSelectRowKeysActions', state.selectPackageId)
          tableRef.value.initFun()
          getPackageInfo()
        })
      },
      overEvent() { // 结束当前流程
        if (batchNum) {
          router.push({
            name: 'CustomizeBatch',
            query: {
              batchNum
            }
          })
        } else {
          router.push('/store/instore/purchase')
        }
      },
      selectRowKeys(value) { // 接收table组件勾选包裹时传递的数据
        state.selectPackageId = value
      }
    }
    let printExpressSheetEvent = _debounce(() => { // 打印面单
      let packageIds = printExpressSheetComputed.value.join(',')
      printExpressSheet({ packageIds, source: 1 }).then((res) => {
        if (res.code == 200) {
          let { errorCount, pdfUrl, successCount, uuid } = res.data
          if (successCount > 0 && pdfUrl) {
            window.open(pdfUrl)
          }
          state.expressSheetStatus = {
            errorCount,
            successCount,
            uuid,
            ifPrintSuccess: pdfUrl ? true : false
          }
          state.ifShow = 2
        } else {
          ElMessage.error(res.message)
        }
      })
    })

    // 初始化数据
    let initFun = () => {
      let route = useRoute()
      state.type = route.query.type
      if (state.type == 0) { // 全部入库扫码直接进入
      } else if (state.type == 1) { // 质检完进入
        state.arrivalNum = parseInt(route.query.arrivalNum)
        state.qualifiedNum = parseInt(route.query.qualifiedNum)
      }
      state.packageIdAll = []
      purchaseInfo.value.relPackage.forEach((item, index) => {
        if (item.printCount == 0) {
          state.selectPackageId.push(item.packageId)
        }
        state.packageIdAll.push(item.packageId)
      })
      store.dispatch('com/setSelectRowKeysActions', state.selectPackageId)
      tableRef.value.initFun()
      methods.getGridProduct().then(_ => {
        getPackageInfo()
      })
    }

    onMounted(() => {
      initFun()
      notAllowRouter()
    })
    return {
      ...toRefs(state),
      tableRef,
      purchaseInfo,
      packageType,
      takeNumComputed,
      arrivalNumComputed,
      unArrivalNumComputed,
      printExpressSheetComputed,
      packageStatus,
      scanQrcodeBtnComputed,
      userInfo,
      ...methods,
      printExpressSheetEvent
    }
  },
  components: {
    Table,
    ScanQrcode,
    PrintExpressSheetStatus,
    PrintLabel,
    QrCodeInfo
  }
}
</script>

<style lang="scss" scoped>
.pageView {
  height: calc(100vh - 430px);
  .title {
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .headBox {
    position: relative;
    height: calc(100% - 45px);
    overflow: hidden;
    overflow-y: scroll;
    .imgBox {
      height: 86px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .extraHeader {
    width: 100%;
    display: flex;
    align-items: center;
    height: 46px;
    background-color: #f5f7fa;
    font-size: 14px;
    padding: 0 20px;
    span {
      margin-right: 16px;
    }
  }
  .goodsName,
  .buyNum,
  .arrivalNum {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
  .goodsName,
  .goodsSku {
    padding: 0 16px;
  }
  .ellipsis {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
  }
  .footerBox {
    padding-top: 24px;
    position: fixed;
    right: 0;
    bottom: 0;
    width: calc(100% - var(--sideBarWidth));
    height: 278px;
    background-color: #fff;
    box-shadow: 10px 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    .orderInfo {
      width: calc(100% - 80px);
      font-size: 14px;
      padding: 0 20px;
      height: 46px;
      line-height: 46px;
      border: 1px solid #ebeef5;
      border-bottom: none;
      span {
        margin-right: 16px;
      }
    }
    .tableBox {
      width: calc(100% - 80px);
      .tag {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .footer {
      width: 100%;
      height: 52px;
      position: absolute;
      right: 0;
      bottom: 0;
      border-top: 1px solid #ebeef5;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        margin-left: 16px;
      }
    }
  }
}
:deep(.el-table__header) {
  background-color: #f5f7fa;
}
:deep(td) {
  position: relative;
}
</style>
