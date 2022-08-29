<template>
  <div class="detailView">
    <ErpNav :title="`采购订单「${ route.query.purchaseOrderNumber }」详情`" routeOpt='/purchase/purchaseManagement/purchaseOrder' />
    <div class="purchaseInfo">
      <div>采购员: {{purchaseInfo?.purchaseOrder?.purchaseUserName}}</div>
      <div class="supplier textOverflow" :title="purchaseInfo?.purchaseOrder?.supplier?.name">供应商: 【{{supplierType(purchaseInfo?.purchaseOrder?.supplier?.partnerType)}}】{{purchaseInfo?.purchaseOrder?.supplier?.name}}</div>
      <div>应付总额: ￥{{purchaseInfo?.purchaseOrder?.totalAmount}}</div>
      <div>实付总额: ￥{{purchaseInfo?.purchaseOrder?.actualPaidAmount}}</div>
      <div>订单状态: <span style="color: #FD4C60">{{purchaseStatus(purchaseInfo?.purchaseOrder?.status)}}</span></div>
    </div>
    <div class="sideNav">
      <SideNavigation :activeStatus="activeStatus" :moduleList="['0', '1', '2'].includes(route.query.status) ? moduleList2 : moduleList" @selectModel="selectModel" />
    </div>
    <div class="content" v-if="Object.keys(purchaseInfo).length > 0">
      <!-- 采购单信息 -->
      <PurchaseInfo id="model01" :info="purchaseInfo.purchaseOrder" />
      <!-- 商品信息 -->
      <GoodsInfo id="model02" :info="purchaseInfo" />
      <!-- 物流信息 -->
      <LogisticsInfo id="model03" :info="purchaseInfo.logisticsInfo" v-if="!['0', '1', '2'].includes(route.query.status)" />
      <!-- 异常信息 -->
      <Abnormal id="model04" :info="purchaseInfo.purchaseException" v-if="!['0', '1', '2'].includes(route.query.status)" />
      <!-- 审核记录 -->
      <CheckInfo id="model05" :info="purchaseInfo.auditRecord" />
      <!-- 付款记录 -->
      <PaymentInfo id="model06" :info="purchaseInfo.payRecord" v-if="!['0', '1', '2'].includes(route.query.status)" />
      <!-- 到货记录 -->
      <TakeDeliveryGoodsInfo id="model07" :info="purchaseInfo.signForRecordList" v-if="!['0', '1', '2'].includes(route.query.status)" />
      <!-- 入库记录 -->
      <InStoreGoodsInfo id="model08" :info="purchaseInfo.arriveRecord" v-if="!['0', '1', '2'].includes(route.query.status)" />
      <!-- 备注信息 -->
      <RemarkInfo id="model09" />
      <!-- 操作日志 -->
      <LogInfo id="model10" />
    </div>
    <div class="footer">
			<div class="left"></div>
			<div class="right">
				<el-button  @click="closeEvent">关闭</el-button>
			</div>
		</div>
  </div>
</template>

<script setup>
import ErpNav from '@/components/erpNav/index.vue'
import PurchaseInfo from './components/purchaseInfo.vue'
import GoodsInfo from './components/goodsInfo.vue'
import LogisticsInfo from './components/logisticsInfo.vue'
import Abnormal from './components/abnormal.vue'
import CheckInfo from './components/checkInfo.vue'
import PaymentInfo from './components/paymentInfo.vue'
import TakeDeliveryGoodsInfo from './components/takeDeliveryGoodsInfo.vue'
import InStoreGoodsInfo from './components/inStoreGoodsInfo.vue'
import RemarkInfo from './components/remarkInfo.vue'
import LogInfo from './components/logInfo.vue'
import SideNavigation from '@/components/sideNavigation/index.vue'
import { onMounted, onUnmounted, reactive, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
import { purchaseOrderDetail } from '@/api/purchase/purchase'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepCopy } from '../../../../../utils/tool'
import router from '../../../../../router'
  let route = useRoute()
  let state = reactive({
    activeStatus: 0,
    moduleList: [
      {
        title: '采购单信息',
        id: 'model01'
      },
      {
        title: '商品信息',
        id: 'model02'
      },
      {
        title: '物流信息',
        id: 'model03'
      },
      {
        title: '异常信息',
        id: 'model04'
      },
      {
        title: '审核记录',
        id: 'model05'
      },
      {
        title: '付款记录',
        id: 'model06'
      },
      {
        title: '到货记录',
        id: 'model07'
      },
      {
        title: '人库记录',
        id: 'model08'
      },
      {
        title: '备注信息',
        id: 'model09'
      },
      {
        title: '操作日志',
        id: 'model10'
      }
    ],
    moduleList2: [
      {
        title: '采购单信息',
        id: 'model01'
      },
      {
        title: '商品信息',
        id: 'model02'
      },
      {
        title: '审核记录',
        id: 'model05'
      },
      {
        title: '备注信息',
        id: 'model09'
      },
      {
        title: '操作日志',
        id: 'model10'
      }
    ],
    purchaseInfo: {}
  })
  let supplierType = computed(() => {
    return (type) => {
      switch (type) {
        case 1:
          return '合作供应商'
        case 2:
          return '1688'
        case 3:
          return '淘宝'
        case 4:
          return '拼多多'
      }
    }
  })
  let purchaseStatus = computed(() => {
    return (type) => {
      switch (type) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '未通过'
        case 3:
          return '待接单'
        case 4:
          return '拒绝接单'
        case 5:
          return '待到货'
        case 6:
          return '待到货（部分到货）'
        case 7:
          return '已完成'
        case 8:
          return '已取消'
      }
    }
  })
  let statusFlag = true
  let selectModel = (value) => {
    statusFlag = false
    setTimeout(() => {
      statusFlag = true
    }, 500)
    state.activeStatus = value.index
    document.getElementById(value.id).scrollIntoView({ block: 'center', inline: 'nearest' })
  }
  // 获取各个模块的offsetTop
  let getDomOffsetTop = (scrollTop) => {
    let arr = ['0', '1', '2'].includes(route.query.status) ? state.moduleList2 : state.moduleList
    arr.forEach((v, i) => {
      v.offsetTop = document.querySelector('#' + v.id).offsetTop
      if (v.offsetTop < scrollTop + 230) state.activeStatus = i
    })
  }
  let handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    if (statusFlag) getDomOffsetTop(scrollTop)
  }
  // 获取采购订单详情
  let getPurchaseDetail = () => {
    let { purchaseOrderNumber } = route.query
    purchaseOrderDetail({ purchaseOrderNumber }).then(res => {
      if (res.code == 200) {
        // 处理审核记录数据
        if (res.data.auditRecord?.length) {
          let arr = []
          res.data.auditRecord.forEach(item => {
            arr.push(deepCopy(item))
            if (item.status == 0) {
              item.flag = true
              arr.push(deepCopy(item))
            }
          })
          res.data.auditRecord = arr
        }
        // 处理异常信息数据
        if (res.data.purchaseException?.length) {
          let arr = []
          res.data.purchaseException.forEach(item => {
            arr.push(deepCopy(item))
            if (item.remark !== null) {
              item.flag = true
              arr.push(deepCopy(item))
            }
          })
          res.data.purchaseException = arr
        }
        // 处理付款记录数据
        if (res.data.payRecord?.length) {
          let arr = []
          res.data.payRecord.forEach(item => {
            arr.push(deepCopy(item))
            if ([2, 4].includes(item.status)) {
              item.flag = true
              arr.push(deepCopy(item))
            }
          })
          res.data.payRecord = arr
        }
        state.purchaseInfo = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  let closeEvent = () => {
    router.push('/purchase/purchaseManagement/purchaseOrder')
  }
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    getPurchaseDetail()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  let { activeStatus, moduleList, purchaseInfo, moduleList2 } = toRefs(state)
</script>

<style lang="scss" scoped>
  .detailView{
    .purchaseInfo{
      position: fixed;
      width: calc(100% - var(--sideBarWidth));
      right: 0;
      top: 187px;
      padding: 0 120px;
      height: 40px;
      line-height: 30px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      color: rgba(0,0,0,.85);
      font-size: 14px;
      z-index: 50;
      .supplier{
        width: 250px;
        height: 30px;
      }
    }
    .content{
      margin: 66px 264px 50px 0;
    }
    .sideNav{
      position: fixed;
      right: 24px;
      top: 253px;
    }
  }
  .blue{
    color: #1890FF
  }
  .footer {
    position: fixed;
    width: 100%;
    // bottom: 0;
    top: 100vh;
    right: 0;
    transform: translateY(-100%);
    z-index: 1000;
    width: calc(100% - var(--sideBarWidth));
    height: 52px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    padding: 0 24px;
  }
  :deep(.vxe-header--row){
    background-color: #f5f7fa;
  }
</style>
