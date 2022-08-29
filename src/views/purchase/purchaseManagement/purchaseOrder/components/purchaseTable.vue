<template>
  <div class="tableView">
    <vxe-table v-bind="tableOptions" :data="props.purchaseTable" :loading="props.loading" ref="tableRef">
      <vxe-column min-width="339" type="expand">
        <template #header>
          <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll"></el-checkbox>
          <span class="ml-10">商品信息</span>{{ props.tableSelectInfo }}
        </template>
        <template #default="{ row, $rowIndex }">
          <div :key="row.purchaseOrderNumber">
            <div v-if="$rowIndex % 2 === 0" class="flexLeft">
              <div class="left">
                <el-checkbox v-model="row.checked" @change="selectRow(row)"></el-checkbox>
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="row.purchaseOrderNumber">复制</a>
                  </template>
                  <a style="color: #000">{{ row.purchaseOrderNumber }}</a>
                </el-tooltip>
                <div class="supplierInfo">
                  <div>【{{ supplierType(row.supplierType) }}】</div>
                  <el-tooltip placement="top" :offset="10">
                    <template #content>
                      <a style="color: #fff" v-copy="row.supplierName">复制</a>
                    </template>
                    <div class="supplierName textOverflow" :title="row.supplierName">
                      {{ row.supplierName }}
                    </div>
                  </el-tooltip>
                  <a :href="`https://amos.alicdn.com/getcid.aw?charset=utf-8&amp;uid=${row.sellerLoginId}&amp;site=cnalichn`" target="_blank" v-if="row.supplierType == 2">
                    <el-image style="width: 22px; height: 22px" :src="taobaoIcon" fit="contain"></el-image>
                  </a>
                </div>
                <el-popover placement="top" :width="800" trigger="hover" v-for="(item, index) in row.packageRemarkTypes" :key="index" @after-enter="getRemarkDetail(row.id, item.id)">
                  <template #reference>
                    <div class="remarkLabel" :style="{ backgroundColor: item.color }">
                      {{ item.word }}
                    </div>
                  </template>
                  <el-table :data="remarkList" :header-cell-style="{ background: '#F5F7FA', color: '#000', 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" fit>
                    <el-table-column min-width="300" property="remark" label="内容"></el-table-column>
                    <el-table-column width="170" property="createTime" label="时间"></el-table-column>
                    <el-table-column width="90" property="remarkTypeName" label="类型"></el-table-column>
                    <el-table-column width="90" property="createByName" label="操作人"></el-table-column>
                  </el-table>
                </el-popover>
                <div class="remarkLabel" style="background-color: chocolate;" v-if="row.reissueQuantity && ['5', '6', '7'].includes(row.status)" :title="row.reissueRemark">补</div>
              </div>
              <div class="right">万众智谷仓库</div>
              <div class="purchaseType" :style="{ color: row.type == 2 ? '#FD4C60' : '#1890FF' }">
                {{ purchaseType(row.type) }}
              </div>
            </div>
            <div class="goodsInfo" v-else>
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px;" :src="row.mainImg" fit="contain"></el-image>
                </template>
              </el-popover>
              <div class="right">
                <div>商品SKU种类: {{ row.skuQuantity }}</div>
                <div>采购数量: {{ row.purchaseQuantity }}</div>
                <div v-if="['5', '6', '7', '8'].includes(row.status)">
                  已入库/未入库: {{ row.storageQuantity }}/{{ row.notStorageQuantity }}
                </div>
                <el-button type="text" @click="jumpOrderInformation(row)" v-if="row.customization == 1" style="padding:unset;height:unset">订单信息{{row.importStatus != 0 ? `(${accessoriesTypeOptions[row.importStatus-1].label})`:''}}</el-button>
                <div class="anomalyTag" v-if="row.exceptionQuantity > 0 && props.status !== '7'"> 异 </div>
              </div>
            </div>
          </div>
        </template>
        <template #content="{ row }">
          <div class="goodsDetail">
            <div class="goodsItem" v-for="(item, index) in row.purchaseDetail" :key="index">
              <div class="left">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="item.mainImg" fit="contain"></el-image>
                  <template #reference>
                    <el-image style="width: 60px; height: 60px;" :src="item.mainImg" fit="contain"></el-image>
                  </template>
                </el-popover>
                <div class="tag1" v-if="item.goodAttribute == 2">相似</div>
                <div class="tag2" v-if="item.goodAttribute == 3">替代</div>
                <a :href="item.link" target="_blank" style="display: block; text-align: center" v-if="row.supplierType == 2">商品信息</a>
              </div>
              <div class="right">
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="item.skuCode">复制</a>
                  </template>
                  <div style="cursor: pointer" class="textOverflow" @click="goSetPrcie(item)">
                    {{ item.skuCode }}
                  </div>
                  <!--                  <div class="textOverflow">-->
                  <!--										{{ item.skuCode }}-->
                  <!--									</div>-->
                </el-tooltip>
                <div v-if="['5', '6', '7'].includes(row.status) && item.exceptionAmount > 0">
                  采购报价/单价/已退: ￥{{ item.purchasePrice }}/￥{{ item.price }}/￥{{ item.price }}
                </div>
                <div v-else>
                  采购报价/单价: ￥{{ item.purchasePrice }}/￥{{ item.price }}
                </div>
                <div class="textOverflow">{{ item.goodsName }}</div>
                <div style="display:flex;justify-content:space-between">
                  <div class="speBox">
                    <span v-for="(it, ind) in JSON.parse(item.skuValue)" :key="ind">{{ it.spe }}: {{ it.speVal }}</span>
                  </div>
                  <el-button type="text" @click="jumpOrderInformation(item,2)" v-if="row.customization == 1" style="padding:unset;height:unset">订单信息</el-button>
                </div>
                <!-- 国码预留 -->
                <div v-if="item.codeVal" style="color:#2fbba6;font-size:12px">
                  国码：{{item.codeVal}}
                </div>
                <div v-if="row.supplierType ==2 && item.pairInfo" class="textOverflow" :title="fmtSpe(item.pairInfo.speInfo)">
                  配对信息：{{fmtSpe(item.pairInfo.speInfo)}}
                </div>
                <div class="num black">
                  <span>x </span>
                  <span v-if="['5', '6', '7', '8'].includes(row.status)">{{ item.storageCount }}/</span>
                  <span v-if="['5', '6', '7'].includes(row.status) && item.exceptionAmount > 0" class="gray">{{ item.exceptionQuantity }}<span class="black">/</span></span>
                  <span class="red">{{ item.purchaseQuantity }}</span>
                  <span class="green" style="margin-left: 10px" v-if="item.storageCount == item.purchaseQuantity && ['5', '6', '7'].includes(row.status)">已完成</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="订单信息" min-width="245" :visible="authPath('purchase-orderInfo-column')">
        <template #default="{ row }">
          <div class="orderInfo" :key="row.purchaseOrderNumber">
            <div class="box">
              <div class="supplierType">
                【{{ supplierType(row.supplierType) }}】
              </div>
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.thirdId">复制</a>
                </template>
                <div class="textOverflow orderNum" :title="row.thirdId" @click="editOrderNum('EditOrder', row, [3, 4].includes(row.supplierType))">
                  {{ row.thirdId }}
                </div>
              </el-tooltip>
              <el-button type="text" icon="el-icon-plus" @click="editOrderNum('EditOrder', row, true)" v-if="([3, 4].includes(row.supplierType) && ![null, '8'].includes(props.status) && row.thirdId == null && row.type !== 3) || (row.supplierType == 2 && props.status == '5, 6' && row.thirdStatus == 2 && row.thirdId == null && row.type !== 3)" v-permission="'purchaseOrder-orderNum'">添加平台订单号</el-button>
            </div>
            <div v-if="['0', '1', '2'].includes(row.status)">金额: ￥{{ row.totalAmount }}</div>
            <div v-if="row.thirdTotalAmount > 0">
              1688金额: ￥{{row.thirdTotalAmount}}
              <span v-if="row.thirdFee" style="color: rgba(0, 0, 0, 0.45)">(含运费￥{{ row.thirdFee }})</span>
            </div>
            <div v-if="['5', '6', '7', '8'].includes(row.status)">
              应付: ￥{{ row.totalAmount }}<span style="color: rgba(0, 0, 0, 0.45)" v-if="row.fee">(含运费￥{{ row.fee }})</span>
            </div>
            <div v-if="row.totalPayQuantity > 0">
              已申请: ￥{{ row.totalPayAmount }}
            </div>
            <div v-if="['5', '6', '7', '8'].includes(row.status)">
              <div v-if="!([null, '5, 6', '7'].includes(props.status) && row.type == 3)">
                已付: ￥{{ row.paidAmount }}
                <i class="el-icon-s-finance" v-if="row.paidAmount == 0"></i>
                <i class="el-icon-s-finance yellow" v-if="row.paidAmount < row.grandAmount && row.paidAmount !== 0"></i>
                <i class="el-icon-s-finance green" v-if="row.paidAmount == row.grandAmount && row.paidAmount !== 0"></i>
              </div>
            </div>
            <div v-if="['5', '6', '7'].includes(row.status)">
              <div v-if="!([null, '5, 6', '7'].includes(props.status) && row.type == 3)">
                到货: ￥{{ row.storageAmount }}
              </div>
            </div>
            <div v-if="['5', '6', '7', '8'].includes(row.status) && row.cancelAmount">
              已退金额: ￥{{ Number(row.cancelAmount).toFixed(2) }}
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="物流" min-width="364" :visible="[null, '5', '6', '5, 6', '7', '8'].includes(props.status) && authPath('purchase-logisticses-column')">
        <template #default="{ row }">
          <div v-for="(item, index) in row.ordersLogisticses" :key="index" class="logisticses">
            <div>
              <div @click="addWaybillNum('AddWaybillNum', row.purchaseOrderNumber, item.id, 'edit')">
                <span>{{ item.name }}:
                  <el-tooltip placement="top" :offset="10">
                    <template #content>
                      <a style="color: #fff" v-copy="item.trackNum">复制</a>
                    </template>
                    <a class="blue">{{ item.trackNum }}</a>
                  </el-tooltip>
                </span>
                <span class="ml-16">
                  <span v-if="item.trackStatus == '0'">未签收</span>
                  <span v-if="item.trackStatus == '1'">已签收</span>
                  <a class="blue ml-10" v-if="item.estimateArrivalTime && item.trackStatus !== '1'">预计{{ item.estimateArrivalTime?.substring(0, 10) }}送达</a>
                </span>
              </div>
              <div class="gray trackBox" style="cursor: pointer" @click="logisticsesDetail('Iframe', item.trackNum)" v-if="item.trackInfo">
                <a class="track gray textOverflow">{{ JSON.parse(item.trackInfo)[0]?.context }}</a>
                <div>》</div>
              </div>
            </div>
          </div>
          <el-button type="text" v-if="['5, 6'].includes(props.status) && row.type !== 3" @click="addWaybillNum('AddWaybillNum', row.purchaseOrderNumber, null, 'add')" v-permission="'purchaseOrder-addWaybillNum'">+添加运单号</el-button>
        </template>
      </vxe-column>
      <vxe-column title="人员" min-width="150" :visible="authPath('purchase-man-column')">
        <template #default="{ row }">
          <div v-if="row.purchaseUser">采购: {{ row.purchaseUser }}</div>
          <div v-if="['5', '6', '7', '8'].includes(row.status) && row.auditUser">审批: {{ row.auditUser }}</div>
          <div v-if="['5', '6', '7', '8'].includes(row.status) && row.payUser">付款: {{ row.payUser }}</div>
          <div v-if="row.inputUser">入库: {{ row.inputUser }}</div>
        </template>
      </vxe-column>
      <vxe-column title="时间" min-width="240">
        <template #default="{ row }">
          <div :class="dateCompare(row) ? 'red' : ''" v-if="row.createTime">创建时间: {{ row.createTime }}</div>
          <div v-if="row.submitTime">下单时间: {{ row.submitTime }}</div>
          <div v-if="['5', '6', '7', '8'].includes(row.status) && row.auditTime">审批时间: {{ row.auditTime }}</div>
          <div v-if="['5', '6', '7', '8'].includes(row.status) && row.payTime">付款时间: {{ row.payTime }}</div>
          <div v-if="['5', '6', '7'].includes(row.status) && row.recordCreateTime">到货时间: {{ row.recordCreateTime }}</div>
        </template>
      </vxe-column>
      <vxe-column title="未通过原因" width="300" :visible="props.status == '2'">
        <template #default="{ row }">
          <div class="textOverflow_2" :title="row.ckeckContent">
            {{ row.ckeckContent }}
          </div>
        </template>
      </vxe-column>
      <vxe-column title="状态" min-width="159">
        <template #default="{ row }">
          <div v-if="row.status == '0'" class="gray">草稿</div>
          <div v-if="row.status == '1'" class="yellow">待审核</div>
          <div v-if="row.status == '2'" class="red">未通过</div>
          <div v-if="row.status == '3'" style="color: #7ebfdd">待接单</div>
          <div v-if="row.status == '4'" class="red">拒绝接单</div>
          <div v-if="row.status == '5'" class="blue">待到货</div>
          <div v-if="row.status == '6'" class="blue">待到货（<span class="yellow">部分到货</span>）</div>
          <div v-if="row.status == '7'" class="green">已完成</div>
          <div v-if="row.status == '8'" style="color: #b163bb">已取消{{ cancelReason(row.cancelReason) }}</div>
          <div v-if="['7', '8'].includes(row.status)" class="textOverflow_2" :title="row.cancelRemark">{{ row.cancelRemark }}</div>
        </template>
      </vxe-column>
      <vxe-column title="操作" min-width="100" fixed="right">
        <template #default="{ row }">
          <div class="operation" v-if="row.voidFlag == 0">
            <el-button type="text" v-if="['0', '2'].includes(props.status)" @click="purchaseOrderExamine(row.id, 1)" v-permission="'purchaseOrder-postExamine'">提交审核</el-button>
            <el-button type="text" v-if="['0', '2'].includes(props.status) && row.supplierType == 2 && row.thirdFlag == 0 && row.type !== 3" @click="createOrder(row.id)" v-permission="'purchaseOrder-1688Pay'">1688下单</el-button>
            <el-button type="text" v-if="props.status == '1'" @click="purchaseOrderExamine(row.id, 2)" v-permission="'purchaseOrder-passExamine'">通过审核</el-button>
            <el-button type="text" v-if="props.status == '1'" @click="rejectCheck('RejectCheck', row.id)" v-permission="'purchaseOrder-unPassExamine'">驳回审核</el-button>
            <el-button type="text" v-if="['5, 6', '7'].includes(props.status) && row.settlementType != 2 && !row.totalPayQuantity && row.canPayAmount && row.type != 3" @click="payEvent(row.id, props.status,row.customization)" v-permission="'purchase-order_apply-pay:btn'">申请付款</el-button>
            <el-button type="text" v-if="['5, 6', '7'].includes(props.status) && row.settlementType != 2 && row.totalPayQuantity && row.canPayAmount && row.type != 3 && !(row.paidAmount == row.grandAmount && row.paidAmount !== 0)" @click="payEvent(row.id, props.status,row.customization)" v-permission="'purchase-order_apply-pay:btn'">继续申请</el-button>
            <el-button type="text" v-if="['5, 6'].includes(props.status)" @click="cancelOrder('CancelOrder', row)" :disabled="row.type == 3" v-permission="'purchaseOrder-cancelOrder'">取消订单</el-button>
            <el-button type="text" v-if="['5, 6', '7'].includes(props.status) && row.customization != 1" @click="editEvent(row, 3)" v-permission="'purchase-order_pays:btn'">再次购买</el-button>
            <el-button type="text" v-if="props.status == '8'" @click="orderRestore(row)" v-permission="'purchase-orderRestore'">还原</el-button>
            <el-button type="text" v-if="!['0', '2'].includes(props.status)" @click="lookDetail(row)" v-permission="'purchaseOrderDetail'">详情</el-button>
            <el-button type="text" v-if="!['0', '1', '2'].includes(props.status)" @click="remarkEvent('Remark', row.id)" v-permission="'purchaseOrder-remark'">备注</el-button>
            <el-button type="text" v-if="['0', '2'].includes(props.status)" @click="editEvent(row, props.status == 2 ? 2 : 1)" :disabled="row.type == 3" v-permission="'purchase-order_edit:btn'">编辑</el-button>
            <el-button type="text" v-if="props.status == '0'" @click="delOrder(row.id)" v-permission="'purchaseOrder-del'">删除</el-button>
            <el-button type="text" v-if="props.status == '2'" @click="purchaseOrderToVoid(row.id)" :disabled="row.type == 3" v-permission="'purchaseOrder-toVoid'">作废</el-button>
          </div>
          <el-button type="text" disabled v-else>已作废</el-button>
        </template>
      </vxe-column>
      <vxe-column width="0">
        <template #default="{  }"></template>
      </vxe-column>
    </vxe-table>
    <component :is="compName[url]" :purchaseId="purchaseId" :purchaseOrderNumber="purchaseOrderNumber" :trackNum="trackNum" :status="status" :thirdId="thirdId" :payPrice="payPrice" :waybillNumType="waybillNumType" :waybillNumId="waybillNumId" @closeEvent="closeEvent" v-if="ifShow"></component>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { accessoriesTypeOptions } from '../composables/staticData.js'
import store from '@/store/index.js'
import { _debounce } from '@/utils/tool.js'
import taobaoIcon from '@/assets/image/ww_icon.png'
import { remarkDetail, purchaseExamine, purchaseToVoid, createOrderTo1688, purchaseCancelReduction, purchaseDelete, getPurchaseDetail, goodsCheck } from '@/api/purchase/purchase.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import CancelOrder from './cancelOrder.vue'
import Iframe from './iframe.vue'
import AddWaybillNum from './addWaybillNum.vue'
import EditOrder from './editOrder.vue'
import Remark from './remark.vue'
import RejectCheck from './rejectCheck.vue'
let props = defineProps({
  status: {
    // 订单状态
    default: null
  },
  purchaseTable: {
    // 表格数据
    type: Array,
    default: []
  },
  loading: {
    // 加载状态
    type: Boolean,
    default: false
  },
  selections: {
    // 选中的采购订单id
    type: Array,
    default: []
  },
  selectedAll: {
    // 全选状态
    type: Boolean,
    default: false
  }
})
let emit = defineEmits(['selectAll', 'selectRow', 'loadInfoEvent'])
let { authPath: myAuthPath } = store.getters
let router = useRouter()
let tableRef = ref(null)
let state = reactive({
  url: '',
  ifShow: false,
  purchaseId: null, // 采购订单id
  purchaseOrderNumber: null, // 采购订单号
  trackNum: '', // 物流单号
  status: null, // 采购状态
  thirdId: null, // 平台订单号
  payPrice: 0, // 衣服金额
  selections: [],
  selectedAll: false,
  remarkList: [],
  waybillNumType: 'add',
  waybillNumId: null
})
let tableOptions = {
  border: true,
  autoResize: true,
  keepSource: true,
  align: 'center',
  highlightHoverRow: true,
  scrollY: { enabled: false },
  columnKey: true,
  spanMethod: ({ row, columnIndex, $rowIndex }) => {
    if ($rowIndex % 2 == 0) {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 8 }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    }
  },
  expandConfig: {
    visibleMethod: ({ $rowIndex, row }) => {
      if ($rowIndex % 2 == 0) {
        return false
      }
      return true
    },
    lazy: true,
    loadMethod: ({ row }) => {
      return new Promise(reslove => {
        getPurchaseDetail({ id: row.id }).then(res => {
          if (res.code == 200) {
            row.purchaseDetail = res.data.map(item => ({ ...item, purchaseOrderNumber: row.purchaseOrderNumber, pairInfo: JSON.parse(item.pairInfo) }))
            reslove()
          } else {
            ElMessage.error(res.message)
          }
        })
      })
    }
  }
}

const compName = {
  // 动态组件的引用
  CancelOrder,
  Iframe,
  AddWaybillNum,
  EditOrder,
  Remark,
  RejectCheck
}

let supplierType = computed(() => {
  return type => {
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
let purchaseType = computed(() => {
  return type => {
    switch (type) {
      case 1:
        return '缺货'
      case 2:
        return '备货'
      case 3:
        return '多发入库'
    }
  }
})
let purchaseStatus = computed(() => {
  return type => {
    switch (type) {
      case null:
        return '订单状态'
      case '0':
        return '草稿'
      case '1':
        return '待审核'
      case '2':
        return '未通过'
      case '3':
        return '待接单'
      case '5':
        return '待到货'
      case '6':
        return '待到货（部分到货）'
      case '7':
        return '已完成'
      case '8':
        return '已取消'
    }
  }
})
let dateCompare = computed(() => {
  // 时间超过24小时则红色显示
  return ({ createTime, status }) => {
    return new Date().getTime() - new Date(createTime).getTime() > 86400000 && ['0', '1', '2'].includes(status)
  }
})

let cancelReason = computed(() => {
  return type => {
    switch (type) {
      case 1:
        return '（断货）'
      case 2:
        return '（换货）'
      case 3:
        return '（退货）'
      case 4:
        return '（无效）'
      case 5:
        return '（其他）'
    }
  }
})

watch(
  () => props.purchaseTable,
  () => {
    nextTick(() => {
      tableRef.value.refreshColumn()
    })
  },
  { deep: true },
  { immediate: true }
)

watch(
  () => props.selections,
  newVal => {
    state.selections = newVal
  },
  { deep: true },
  { immediate: true }
)

watch(
  () => props.selectedAll,
  newVal => {
    console.log(newVal)
    state.selectedAll = newVal
  },
  { deep: true },
  { immediate: true }
)

// 添加运单号
let addWaybillNum = (url, purchaseOrderNumber, id, type) => {
  if (!myAuthPath['purchaseOrder-addWaybillNum']) return fasle
  if (props.status == null) return false
  state.url = url
  state.ifShow = true
  state.purchaseOrderNumber = purchaseOrderNumber
  state.waybillNumType = type
  state.waybillNumId = id
}

function fmtSpe(spes) {
  return spes.map(item => item.spe + ': ' + item.speVal).join(' ')
}
// 打开物流轨迹弹框
let logisticsesDetail = (url, trackNum) => {
  state.url = url
  state.ifShow = true
  state.trackNum = trackNum
}

// 取消订单
let cancelOrder = (url, row) => {
  state.url = url
  state.ifShow = true
  state.purchaseId = row.id
  state.purchaseOrderNumber = row.purchaseOrderNumber
  state.status = row.status
  state.payPrice = row.totalAmount
}

// 还原订单
let orderRestore = row => {
  ElMessageBox.confirm('确认还原此订单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  })
    .then(() => {
      let params = {
        id: row.id,
        purchaseOrderNumber: row.purchaseOrderNumber,
        status: row.status,
        type: 2
      }
      purchaseCancelReduction(params).then(res => {
        if (res.code == 200) {
          if (row.type == 1) {
            if (res.data.length) {
              var amount = 0
              res.data.forEach(v => {
                amount += +v.amount
              })
              ElMessage.warning({ message: `当前商品${amount > 0 ? '仅缺' + amount + '件' : '暂不缺货'}，无法还原` })
            } else {
              emit('loadInfoEvent')
              ElMessage.success({ message: '操作成功！' })
            }
          } else {
            emit('loadInfoEvent')
            ElMessage.success({ message: '操作成功！' })
          }
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => { })
}

// 修改平台订单号
let editOrderNum = (url, row, bole) => {
  if (!myAuthPath['purchaseOrder-orderNum']) return fasle
  if ((![null, '8'].includes(props.status) && bole) || (row.supplierType == 2 && props.status == '5, 6' && row.thirdStatus == 2)) {
    state.url = url
    state.ifShow = true
    state.purchaseId = row.id
    state.thirdId = row.thirdId
  }
}

// 保存备注
let remarkEvent = (url, id) => {
  state.url = url
  state.ifShow = true
  state.purchaseId = [id]
}

// 申请付款
let payEvent = (id, status, customization) => {
  router.push({
    path: '/purchase/purchaseManagement/applyPay',
    query: {
      id,
      status,
      customization
    }
  })
  // router.push({
  //   path: '/purchase/purchaseManagement/batchApplyPay',
  //   query: {
  //     id
  //   }
  // })
}

// 查看详情
let lookDetail = ({ id, purchaseOrderNumber, status, type, customization }) => {
  router.push({
    name: 'PurchaseOrderDetail',
    query: {
      customization,
      id,
      purchaseOrderNumber,
      status,
      type
    }
  })
}

// 编辑
let editEvent = (row, type) => {
  router.push({
    name: 'purchaseOrder_editOrder',
    query: {
      id: row.id,
      status: props.status,
      type,
      customization: row.customization
    }
  })
}

// 提交审核/通过审核
let purchaseOrderExamine = (id, type) => {
  let text = type == 1 ? '提交审核' : '通过审核'
  ElMessageBox.confirm(`确认${text}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
    let params = {
      ids: [id],
      type
    }
    purchaseExamine(params)
      .then(res => {
        if (res.code == 200) {
          emit('loadInfoEvent')
          ElMessage.success({ message: '操作成功！', type: 'success' })
        } else {
          ElMessage.error(res.message)
        }
      })
  })
    .catch(() => { })
}

// 驳回审核
let rejectCheck = (url, id) => {
  state.url = url
  state.ifShow = true
  state.purchaseId = [id]
}

// 作废
let purchaseOrderToVoid = id => {
  ElMessageBox.confirm('确认作废此订单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  })
    .then(() => {
      purchaseToVoid({ ids: [id] }).then(res => {
        if (res.code == 200) {
          emit('loadInfoEvent')
          ElMessage.success({ message: '操作成功！', type: 'success' })
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => { })
}

// 1688下单
let createOrder = id => {
  ElMessageBox.confirm(`确认1688下单？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  })
    .then(() => {
      createOrderTo1688({ id }).then(res => {
        if (res.code == 200) {
          emit('loadInfoEvent')
          ElMessage.success({ message: '操作成功！', type: 'success' })
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => { })
}

// 删除订单
let delOrder = id => {
  ElMessageBox.confirm('确认删除此订单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  })
    .then(() => {
      purchaseDelete({ ids: [id] }).then(res => {
        if (res.code == 200) {
          emit('loadInfoEvent')
          ElMessage.success({ message: '操作成功！', type: 'success' })
        } else {
          ElMessage.error(res.message)
        }
      })
    })
    .catch(() => { })
}

// 跳转已报价
let goSetPrcie = ({ goodsId }) => {
  goodsCheck({ goodsId }).then(res => {
    if (res.code == 200) {
      let { flag, goodsId, layFlag } = res.data
      if (flag) {
        if (layFlag == 0) {
          router.push({
            path: '/goods/goodsManagement/setPrice/detail',
            query: {
              id: goodsId,
              sourceRoute: 'purchaseOrder'
            }
          })
        } else {
          router.push({
            path: '/goods/goodsManagement/layAside/detail',
            query: {
              id: goodsId
            }
          })
        }
      } else {
        ElMessage.error(res.data.msg)
      }
    } else {
      ElMessage.error(res.message)
    }
  })

}

// 备注详情
let getRemarkDetail = (id, remarkTypeId) => {
  state.remarkList = []
  remarkDetail({ id, remarkTypeId }).then(res => {
    if (res.code == 200) {
      state.remarkList = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

// let leaveHandle = () => {
//   console.log('关闭')
//   state.remarkList = []
// }

// 关闭弹框回调
let closeEvent = status => {
  // status为true时，刷新列表
  state.ifShow = false
  state.url = ''
  if (status) {
    emit('loadInfoEvent')
  }
}

// 全选
let selectAll = value => {
  emit('selectAll', value)
}

// 单选
let selectRow = row => {
  emit('selectRow', row)
}

function jumpOrderInformation(row, type) {
  let query = {
    purchaseOrderNumber: row.purchaseOrderNumber,
    status: props.status,
    purchaseOrderItemId: type == 2 ? row.id : '',
    settlementType: row.settlementType
  }
  router.push({ name: 'orderInformation', query })
}
let {
  ifShow,
  url,
  purchaseId,
  purchaseOrderNumber,
  trackNum,
  status,
  thirdId,
  payPrice,
  selections,
  selectedAll,
  remarkList,
  waybillNumType,
  waybillNumId
} = toRefs(state)
</script>

<style lang="scss" scoped>
.tableView {
  .supplierInfo {
    margin-left: 20px;
    display: flex;
    align-items: center;
    a {
      width: 22px;
      height: 22px;
      margin-left: 10px;
    }
    .supplierName {
      color: rgb(0, 0, 0, 0.7);
      cursor: pointer;
      max-width: 200px;
    }
  }
  .purchaseType {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :deep(.vxe-header--column) {
    position: relative;
    .el-checkbox {
      position: absolute;
      left: 16px;
      height: 24px;
    }
  }
  .goodsInfo {
    display: flex;
    padding-left: 40px;
    .right {
      flex: 1;
      overflow: hidden;
      margin-left: 16px;
      text-align: left;
      .anomalyTag {
        position: absolute;
        right: 20px;
        top: 0px;
        color: #fd4c60;
      }
    }
  }
  .goodsDetail {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 12px;
    padding-bottom: 0;
    .goodsItem {
      position: relative;
      border: 1px solid #e8e8e8;
      border-radius: 2px;
      padding: 13px;
      width: calc((100% - 26px) / 3);
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      margin-right: 13px;
      .left {
        position: relative;
        .tag1,
        .tag2 {
          position: absolute;
          right: 0;
          top: -5px;
          border-radius: 4px;
          padding: 0 2px;
          background-color: #fff;
        }
        .tag1 {
          color: #f6a439;
          border: 1px solid #f6a439;
        }
        .tag2 {
          color: #da1931;
          border: 1px solid #da1931;
        }
      }
      .right {
        flex: 1;
        overflow: hidden;
        margin-left: 10px;
        color: rgba(0, 0, 0, 0.45);
        width: 510px;
        .num {
          position: absolute;
          right: 13px;
          top: 30px;
        }
        .speBox {
          span {
            margin-right: 10px;
          }
          :nth-last-of-type(1) {
            margin-right: 0;
          }
        }
      }
    }
    .goodsItem:nth-of-type(3n) {
      margin-right: 0;
    }
  }
  .orderInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding: 0 20px;
    .box {
      display: flex;
      flex-direction: row;
      .supplierType {
        max-width: 100px;
        line-height: 32px;
      }
      .orderNum {
        cursor: pointer;
        max-width: 100px;
        display: block;
        white-space: nowrap;
        line-height: 32px;
      }
      .el-button {
        margin-left: 0;
        min-height: 20px;
        padding: 5px;
      }
    }
  }

  .flexStart {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .logisticses {
    font-size: 12px;
    .trackBox {
      position: relative;
      display: flex;
      justify-content: center;
      .track {
        width: 260px;
        margin-right: 10px;
      }
    }
  }
  .operation {
    display: flex;
    flex-direction: column;
    .el-button {
      margin-left: 0;
      min-height: 20px;
      padding: 4px;
    }
  }
}
.flexLeft {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
  }
}
:deep(.vxe-header--column) {
  .el-checkbox {
    margin-left: -5px !important;
  }
}
:deep(.vxe-cell) {
  position: relative;
  .vxe-table--expanded {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    i {
      color: #3a8ee6;
    }
  }
  .vxe-table--expand-label {
    padding: 0;
  }
}
.remarkLabel {
  padding: 0px 5px;
  height: 24px;
  line-height: 24px;
  border-radius: 4px;
  margin-left: 10px;
  color: #fff;
}
.el-icon-s-finance {
  font-size: 16px;
}
.blue {
  color: #1890ff;
}
.ml-16 {
  margin-left: 16px;
}
.gray {
  color: rgba(0, 0, 0, 0.45);
}
.green {
  color: #429167;
}
.yellow {
  color: #f0b524;
}
.red {
  color: #fd4c60;
}
.black {
  color: rgba(0, 0, 0, 0.85) !important;
}
</style>
