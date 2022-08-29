<template>
	<el-dialog title="退款" v-model="ifShow" top="50px" :width="1400" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent" :show-close="false">
		<div class="content-view">
      <div class="head-box">
        <div class="el-stepbox" :style="{ 'justify-content': active == 1 ? 'space-between' : 'center' }">
          <el-steps :active="active">
            <el-step title="选择商品并填写退款信息"></el-step>
            <el-step title="确认退款信息"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <el-dropdown @command="handleCommand" v-if="active == 1">
            <el-button type="primary">
              批量填充<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item command="0" :disabled="orderIdList.length == 0">全部商品数量</el-dropdown-item> -->
                <el-dropdown-item command="1" :disabled="orderIdList.length == 0">全部剩余金额</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-alert title="确认转账后，资金将直接打入对方账户，无法退回！" type="warning" show-icon style="width: 50%; margin: 0 auto; margin-top: 20px;" v-if="active == 2" />
      </div>
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="props.loading" v-show="active == 1" ref="tableRef">
        <vxe-column width="50">
          <template #header>
            <el-checkbox :indeterminate="orderIdList.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAllChangeEvent"></el-checkbox>
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.checked" @change="selectChangeEvent(row)" :disabled="row.resultText !== undefined"></el-checkbox>
          </template>
        </vxe-column>
        <vxe-column title="商品信息" min-width="310">
          <template #default="{ row }">
            <div class="goods-info">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.skuImg || row.mainImg" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="row.skuImg || row.mainImg" fit="contain"></el-image>
                </template>
              </el-popover>
              <div class="right">
                <div class="textOverflow" :title="row.spuName">{{row.spuName}}</div>
                <div class="textOverflow" :title="row.sku">{{row.sku}}</div>
                <div>{{row.currency}} {{row.price}}</div>
                <div class="speBox textOverflow_2">
                  <span v-for="(item, index) in JSON.parse(row.skuValue)" :title="item.spe+ ':' + item.speVal">{{item.spe}}: {{item.speVal}}</span>
                </div>
              </div>
              <div class="goods-total">X{{ row.quantity }}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="订单号/交易号" width="180">
          <template #default="{ row }">
            <div class="textOverflow" :title="row.orderId">{{ row.orderId }}</div>
            <div class="textOverflow" :title="row.transcationId" style="color: #ccc" v-if="row.transcationId">({{ row.transcationId }})</div>
            <el-tag type="warning" style="margin-top: 10px;" v-if="[2, -1].includes(row.mergeFlag)">拆</el-tag>
          </template>
        </vxe-column>
        <vxe-column title="订单金额" width="120">
          <template #default="{ row }">
            <div>{{ row.totalPrice }} {{row.currency}}</div>
          </template>
        </vxe-column>
        <!-- <vxe-column title="退款商品数量" width="120">
          <template #default="{ row }">
            <div v-if="row.surplusPrice == undefined">-</div>
            <div v-else>
              <div>{{ row.quantity }}</div>
              <el-input-number v-model="row.refundQuantity" :min="0" :max="row.quantity" :precision="0" size="small" controls-position="right" style="width: 100%;" />
            </div>
          </template>
        </vxe-column> -->
        <vxe-column title="剩余金额" width="120">
          <template #default="{ row }">
            <div v-if="row.resultText !== undefined" style="color: red">{{row.resultText}}</div>
            <div v-else>{{ row.surplusPrice }} {{row.payCurrency}}</div>
          </template>
        </vxe-column>
        <vxe-column field="amount" width="120">
          <template #header>
            <i class="vxe-cell--required-icon"></i>
            <i class="vxe-cell--edit-icon vxe-icon--edit-outline"></i>
            <span class="vxe-cell--title">退款金额</span>
          </template>
          <template #default="{ row }">
            <div v-if="row.resultText !== undefined">-</div>
            <el-input-number v-else v-model="row.amount" :placeholder="row.payCurrency" :min="0.01" :max="row.surplusPrice" :precision="2" controls-position="right" clearable style="width: 100%;" />
          </template>
        </vxe-column>
        <vxe-column title="退款原因" width="120">
          <template #header>
            <i class="vxe-cell--required-icon"></i>
            <i class="vxe-cell--edit-icon vxe-icon--edit-outline"></i>
            <span class="vxe-cell--title">退款原因</span>
          </template>
          <template #default="{ row, _rowIndex }">
            <div v-if="row.resultText !== undefined">-</div>
            <el-cascader v-else v-model="row.reasonId" :options="reasonList" :props="reasonProps" @change="(e) => handleChange(e, _rowIndex)" clearable />
          </template>
        </vxe-column>
        <vxe-column title="退款备注" min-width="200">
          <template #default="{ row }">
            <div v-if="row.resultText !== undefined">-</div>
            <el-input v-else :maxLength="150" clearable placeholder="请输入" v-model="row.remark"></el-input>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-table v-bind="tableOptions2" :data="tableData2" v-if="active == 2">
        <vxe-column field="orderId" title="订单号"></vxe-column>
        <vxe-column field="transcationId" title="交易号" width="180"></vxe-column>
        <vxe-column field="amount" title="退款金额">
          <template #default="{ row }">
            <div>{{ row.amount }} ({{ row.currency }})</div>
          </template>
        </vxe-column>
        <!-- <vxe-column field="quantityTotal" title="退款商品数量"></vxe-column> -->
        <vxe-column field="reasonName" title="退款原因">
          <template #default="{ row }">
            <div v-for="(item, index) in row.reasonName.split(',')" :key="index">{{item}}</div>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="退款备注" width="180"></vxe-column>
      </vxe-table>
      <vxe-table v-bind="tableOptions2" :data="tableData3" v-if="active == 3">
        <vxe-column field="orderId" title="订单号"></vxe-column>
        <vxe-column field="transcationId" title="交易号" width="180"></vxe-column>
        <vxe-column field="amount" title="退款金额">
          <template #default="{ row }">
            <div>{{ row.amount }} ({{ row.currency }})</div>
          </template>
        </vxe-column>
        <!-- <vxe-column field="quantity" title="退款商品数量"></vxe-column> -->
        <vxe-column field="reasonName" title="退款原因">
          <template #default="{ row }">
            <div v-for="(item, index) in row.reasonName.split(',')" :key="index">{{item}}</div>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="退款备注" width="180"></vxe-column>
        <vxe-column field="result" title="退款结果" width="180">
          <template #default="{ row }">
           <div class="textOverflow_2" :title="row.result" :style="{ 'color': row.result == '成功' ? '#87c12d' : '#df273e' }">{{row.result}}</div>
          </template>
        </vxe-column>
      </vxe-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<div v-if="active == 1">
          <el-button @click="cancelEvent(false)" >取消</el-button>
				  <el-button type="primary" @click="submit" :disabled="validList.length == 0">提交</el-button>
        </div>
        <!-- 第二步 -->
       <div v-if="active == 2">
          <el-button @click="goBack">上一步</el-button>
				  <el-button type="primary" @click="refoundEvent" :loading="loading">确认退款</el-button>
       </div>
       <el-button @click="cancelEvent(true)" v-if="active == 3">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs, getCurrentInstance, onMounted, markRaw, inject } from 'vue'
  import { ElMessage } from 'element-plus'
  import { deepCopy } from '@/utils/tool';
  import { orderRefund, getIvtRefundReasons, orderPayData } from '@/api/order/orderManagement.js'
  const { proxy } = getCurrentInstance()
  let formOptions = inject('formOptions')
  const props = defineProps({
    data: {
      type: Object,
      default: {}
    },
		sourth:{
			type:Boolean,
			default:false
		}
  })
  console.log(props.data.selectInfo)
  let state = reactive({
    ifShow: true,
    loading: false,
    active: 1,
    tableData: [],
    tableData2: [],
    tableData3: [],
    orderIdObj: {}, // 所有orderId的集合， key: orderId
    orderIdList: [], // 勾选的订单集合
    reasonList: [],
    reasonProps: {
      expandTrigger: 'hover',
      value: 'id',
      label: 'name',
      emitPath: false
    },
    submitDisabled: false,
    validList: [], // 有效的包裹数据
    selectedAll: false // 是否全选
  })
  let tableOptions = {
    height: 600,
    border: true,
		autoResize: true,
		keepSource: true,
		align: 'center',
		highlightHoverRow: false,
		scrollY: { enabled: false },
    columnKey: true,
    editConfig: {trigger: 'click', mode: 'row', showStatus: true},
    spanMethod: (scoped) => {
      let { $columnIndex, row } = scoped
      // if ([0, 5, 6, 7, 8].includes($columnIndex)) { // 相同订单号合并
      //   if (row._status == 0) {
      //     return { rowspan: state.orderIdObj[row.orderId].length, colspan: 1 }
      //   } else {
      //     return { rowspan: 0, colspan: 0 }
      //   }
      // }
      // 去除退款商品数量
      if ([0, 4, 5, 6, 7].includes($columnIndex)) { // 相同订单号合并
        if (row._status == 0) {
          return { rowspan: state.orderIdObj[row.orderId].length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
      if ([2, 3].includes($columnIndex)) { // 同一订单所有商品合并
        if (row._length) {
          return { rowspan: row._length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
  }

  let tableRef = ref(null)

  let tableOptions2 = {
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true,
    scrollY: { enabled: false },
    height: 500
  }

   // 增加字段
  let addField = (field, it, item) => {
    field.refundQuantity = 0 // 退款数量
    field.amount = undefined // 退款金额
    field.reasonId = null // 退款原因
    field.reasonName = '',
    field.remark = '' // 备注
    field.totalPrice = it.totalPrice // 订单金额
    field.transcationId = it.transcationId // 交易号
    field.surplusPrice = it._surplusPrice // 剩余金额
    field.mergeFlag = item.mergeFlag // 拆分标识
    field.currency = it.currency // 单位
    field.payCurrency = it.payCurrency
    field.resultText = it.resultText
  }

  // 处理数据
  let initData = () => {
    let selectInfo = deepCopy(props.data.selectInfo)
    let arr = []
    // 以包裹为维度，收集参数
    let requestArr = []
    selectInfo.forEach(item => {
      let paramsArr = []
      item.packageRels.forEach(it => {
        if (it.payPrice == null || it.payCurrency == null) {
          paramsArr.push({
            transcationId: it.transcationId,
            paymentMethod: it.paymentMethod,
            refundPrice: it.refundPrice
          })
        } else {
          it._surplusPrice = it.surplusPrice
        }
      })
      if (paramsArr.length > 0) {
        requestArr.push(orderPayData({ orderPayDataDTOS: paramsArr }))
        item.requestIndex = requestArr.length - 1
      }
    })

    // 获取每个包裹中所有订单的剩余金额并赋值
    console.log(requestArr)
    if (requestArr.length > 0) {
      Promise.all(requestArr).then(res => {
        console.log(res)
        selectInfo.forEach(item => {
          if (item.requestIndex !== undefined) {
            res[item.requestIndex].data.forEach(scoped => {
              if (scoped.resultcode == 0) { // 成功
                item.packageRels.forEach(it => {
                  if (scoped.transcationId == it.transcationId) {
                    it._surplusPrice = scoped.surplusPrice
                    it.payCurrency = scoped.payCurrency
                  }
                })
              } else { // 失败
                item.packageRels.forEach(it => {
                  console.log(scoped.result)
                  if (scoped.transcationId == it.transcationId) {
                    it.resultText = scoped.result
                  }
                })
              }
            })
          }
        })
        handle()
      }).catch((error) => {
        selectInfo.forEach(item => {
          item.packageRels.forEach(it => {
            it.resultText = '获取失败'
          })
        })
        handle()
      })
    } else {
      handle()
    }
    
    function handle() {
      selectInfo.forEach(item => {
        item.packageRels.forEach(it => {
          if (it.resultText == undefined) state.validList.push(it.orderId)
          it.packageSkus.forEach((i, ind) => {
            if (ind == 0) i._length = it.packageSkus.length // 向下合并单元格的数量
            addField(i, it, item)
            arr.push(i)
          })
        })
      })
      arr.forEach(item => {
        if (!state.orderIdObj[item.orderId]) {
          item._status = 0
          state.orderIdObj[item.orderId] = [item]
        } else {
          state.orderIdObj[item.orderId].push(item)
        }
      })
      console.log(state.orderIdObj)
      console.log(arr)
      state.tableData = arr
    }
  }

  // 获取退款原因
  let getRefundReasons = () => {
    getIvtRefundReasons().then(res => {
      if (res.code == 200) {
        state.reasonList = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 勾选全部
  let selectAllChangeEvent = (e) => {
    e ? state.orderIdList = deepCopy(state.validList) : state.orderIdList = []
    state.selectedAll = e
    state.tableData.map(row => {
      if (row.resultText == undefined) row.checked = e
    })
  }

  // 单个勾选
  let selectChangeEvent = (row) => {
    if (row.checked) {
      if (row.resultText == undefined && state.orderIdList.indexOf(row.id) === -1) {
        state.orderIdList.push(row.orderId)
      }
    } else {
      const index = state.orderIdList.indexOf(row.orderId)
      state.orderIdList.splice(index, 1)
    }
    state.selectedAll = state.orderIdList.length === state.validList.length
  }

  let handleCommand = (command) => {
    if (command == 0) { // 填充商品数量
      state.tableData.forEach(item => {
        if (state.orderIdList.includes(item.orderId)) {
          item.refundQuantity = item.quantity
        }
      })
    } else { // 填充剩余金额
      state.tableData.forEach(item => {
        if (state.orderIdList.includes(item.orderId)) {
          item.amount = item.surplusPrice
        }
      })
    }
  }

  let reasonListTraverse = (reasonList, value, index, parentName) => {
    reasonList.forEach(item => {
      if (item.children) {
        reasonListTraverse(item.children, value, index, item.name)
      } else {
        if (item.id == value) {
          state.tableData[index].reasonName = `${parentName},${item.name}`
        }
      }
    })
  }

  let handleChange = (value, index) => {
    console.log(value, index)
    if (value !== null) reasonListTraverse(state.reasonList, value, index)
  }

  // 关闭弹框
  let closeEvent = (refresh = false) => {
    state.ifShow = false
    setTimeout(() => {
			if(props.sourth){
				proxy.$parent.refundDialogShow = false
				proxy.$parent.packageOrderDetailsFn()
			}else{
				proxy.$parent.dialogVisible = false
      	if (refresh) formOptions.value.init()
			}

    }, 500)
  }

  // 取消回调
  let cancelEvent = (refresh) => {
    closeEvent(refresh)
  }

  // 提交回调
  let submit = async () => {
    console.log(state.tableData)
    let arr = []
    let orderIdObj = {}
    state.tableData.forEach(item => {
      if (item.resultText == undefined) {
        let { orderId, packageId, sku, amount, transcationId, surplusPrice, reasonId, reasonName, remark, packageSkuId, refundQuantity, currency } = item
        if (!orderIdObj[orderId]) {
          orderIdObj[orderId] = {
            orderId,
            packageIds: [packageId],
            transcationId,
            surplusPrice,
            reasonId,
            reasonName,
            remark,
            amount,
            currency,
            returnRefundSkus: [
              {
                packageSkuId,
                quantity: refundQuantity,
                packageId,
                sku
              }
            ],
            quantityTotal: refundQuantity
          }
        } else {
          orderIdObj[orderId].quantityTotal = orderIdObj[orderId].quantityTotal + refundQuantity
          if (!orderIdObj[orderId].packageIds.includes(packageId)) orderIdObj[orderId].packageIds.push(packageId)
          orderIdObj[orderId].returnRefundSkus.push({
            packageSkuId,
            quantity: refundQuantity,
            packageId,
            sku
          })
        }
      }
    })
    for(let keys in orderIdObj) {
      if (orderIdObj[keys].amount == null) {
        ElMessage.error(` 请选择订单号为${ orderIdObj[keys].orderId }的退款金额 `)
        return false
      }
      if (orderIdObj[keys].reasonId == null) {
        ElMessage.error(` 请选择订单号为${ orderIdObj[keys].orderId }的退款原因 `)
        return false
      }
      arr.push(orderIdObj[keys])
    }
    state.tableData2 = arr
    console.log(state.tableData2)
    state.active = 2
  }

  // 退款
  let refoundEvent = () => {
    state.loading = true
    orderRefund({ returnRefundDTOS: state.tableData2 }).then(res => {
      state.loading = false
      if (res.code == 200) {
        state.tableData3 = res.data
        state.active = 3
      } else {
        ElMessage.error(res.message)
      }
    }).catch(() => {
      state.loading = false
    })
  }

  // 上一步
  let goBack = () => {
    state.tableData2 = []
    state.active = 1
  }

  onMounted(() => {
    initData()
    getRefundReasons()
  })

  let { ifShow, loading, tableData, tableData2, tableData3, active, orderIdList, reasonList, reasonProps, submitDisabled, validList, selectedAll } = toRefs(state)
</script>

<style lang="scss" scoped>
.content-view{
  min-height: 600px;
}
.head-box{
  margin: 0 auto;
  width: 90%;
  margin-bottom: 30px;
  .el-stepbox{
    display: flex;
    justify-content: space-between;
    .el-steps{
      width: 80%;
    }
  }
}
.goods-info {
  position: relative;
  display: flex;
  // padding-left: 40px;
  .right {
    width: 170px;
    margin-left: 16px;
    text-align: left;
    .speBox{
      width: 170px;
      display: block;
      white-space: normal;
      span {
        margin-right: 10px;
      }
      :nth-last-of-type(1){
        margin-right: 0;
      }
    }
  }
  .goods-total{
    position: absolute;
    right: 5px;
    bottom: 0px;
    color: rgba(0,0,0,.4);
  }
}
:deep(.vxe-body--column){
  padding: 10px 0 !important;
}
:deep(.el-dropdown) {
  height: 32px !important;
}
</style>
