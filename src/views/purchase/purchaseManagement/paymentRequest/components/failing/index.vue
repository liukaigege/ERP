<!--
* @Descripttion: 未通过
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div class="middle">
      <ErpSort :options="sortList" :defaultSort="defaultSort" @sort="sortFn" />
      <el-button
        type="primary"
        @click="batchResubmit()"
        v-if="authPath('/v1/failing/resubmit')"
      >
        提交审核
      </el-button>
      <el-popconfirm
        title="是否批量删除该订单？"
        @confirm="batchDeleteItem(row)"
        v-if="authPath('/v1/failing/delete')"
      >
        <template #reference>
          <el-button type="primary"> 删除 </el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="table-list">
      <vxe-table
        highlight-hover-row
        border
        auto-resize
        max-height="600"
        align="center"
        ref="xTable1"
        :data="data"
        :span-method="colspanMethod"
        :cell-style="cellStyle"
      >
        <vxe-column title="采购单号" min-width="180" align="left">
          <template #header>
            <el-checkbox
              v-model="checkedList"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            ></el-checkbox
            ><span
              style="
                margin-left: 20px;
                text-align: center;
                display: inline-block;
                width: 100px;
              "
              >采购单号</span
            >
          </template>
          <template #default="{ row }">
            <template v-if="!row.orderItemsFlag">
              <el-checkbox
                v-model="row.isChecked"
                style="margin-right: 10px"
                @change="val => handleCheckedChange(val, row)"
              ></el-checkbox>
              {{ row.purchaseOrderNumber }}
            </template>
            <div v-else class="purchaseOrderReason">
              {{ row.content }}
            </div>
          </template>
        </vxe-column>
				<vxe-column title="平台订单号" min-width="150">
					<template #default="{ row }"> {{ row.thirdId || '-' }} </template>
				</vxe-column>
        <vxe-column field="skuTypeCount" title="SKU种类" width="100"></vxe-column>
        <vxe-column field="purchaseCount" title="采购数量" width="100"></vxe-column>
        <vxe-column field="storageCount" title="到货数量" width="100"></vxe-column>
        <vxe-column field="storageAmount" title="到货金额" width="100">
          <template #default="{ row }"> ￥{{ row.storageAmount }} </template>
        </vxe-column>
        <vxe-column field="grandTotalAmount" title="应付" width="100">
          <template #default="{ row }"> ￥{{ row.grandTotalAmount }} </template>
        </vxe-column>
        <vxe-column field="subtotalAmount" title="实付" width="100">
          <template #default="{ row }"> ￥{{ row.subtotalAmount }} </template>
        </vxe-column>
        <vxe-column title="已付" width="100">
          <template #default="{ row }"> ￥{{ row.payAmount }} </template>
        </vxe-column>
				<vxe-column title="结算方式" width="120">
          <template #default="{ row }">
            <p>{{{"1":'预付',"3":"货到付款","4":"款到发货"} [row.settlementType] }}
            <span v-if="row.settlementType==1">({{row.settlementValue}}{{{'1':'%','2':'元'}[row.settlementUnit]}})</span>
            <span v-if="row.settlementType==2">账期（{{row.settlementValue}}天）</span>
            </p>
          </template>
        </vxe-column>
        <vxe-column field="applyAmount" title="申请金额" width="100">
          <template #default="{ row }"> ￥{{ row.applyAmount }} </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" width="100">
          <template #default="{ row }">
            <span
              :class="
                new Date(row.createTime).getTime() + 24 * 60 * 60 * 1000 >
                Date.now()
                  ? ''
                  : 'red'
              "
              >{{ row.createTime }}</span
            >
          </template>
        </vxe-column>
        <vxe-column field="applyTime" title="申请时间" width="100"></vxe-column>
        <vxe-column field="purchaseUserName" title="采购员" width="100"></vxe-column>
				<vxe-column field="createByName" title="创建人" width="100"></vxe-column>
				<vxe-column field="serialNumber" title="流水号" min-width="150"></vxe-column>
        <vxe-column title="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              class="primaryBtn"
              @click="resubmit(row)"
              v-if="authPath('/v1/failing/resubmit')"
              >重新提交</el-button
            >
            <el-button
              type="text"
              class="primaryBtn"
              @click="edit(row)"
              v-if="authPath('/v1/paymentRequest/edit')"
              >编辑</el-button
            >
            <el-popconfirm
              title="是否删除该订单？"
              @confirm="deleteItem(row)"
              v-if="authPath('/v1/failing/delete')"
            >
              <template #reference>
                <el-button type="text" class="deleteBtn">删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  toRefs,
  onMounted,
  watch,
  defineProps,
  nextTick,
  defineEmits
} from 'vue'
import { reSubmit, remove } from '../../composables/api.js'
import ErpSort from '@/components/erpSort/index.vue'
import { ElMessage } from 'element-plus'
import { authPath } from '@/utils/hooks'
const sortList = [
  // 创建时间：ppa.create_time 付款金额：ppa.grand_total_amount 申请时间：ppa.apply_time 付款时间：ppc.creat_time
  {
    label: '创建时间',
    value: 'ppa.create_time'
  },
  {
    label: '付款金额',
    value: 'ppa.grand_total_amount'
  }
]
const defaultSort = { value: 'ppa.create_time', type: 'asc' }
const props = defineProps({
  form: Object,
  dataList: Array
})
let state = reactive({
  data: [],
  selectArr: [],
  isIndeterminate: false,
  checkedList: false
})
//重新提交
const emit = defineEmits(['openDetail', 'selectCount', 'listRefresh'])
function batchResubmit() {
  const params = []
  state.selectArr.forEach(({ applyId }) => {
    params.push(applyId)
  })
  if (!params.length) {
    ElMessage.warning('请先勾选需要提交审核的单号!')
    return false
  }
  resubmitFun(params)
}
function resubmit({ applyId }) {
  const params = [applyId]
  resubmitFun(params)
}
function resubmitFun(applyId) {
  reSubmit({ applyId }).then(res => {
    if (res.code == 200) {
      state.selectArr = []
      ElMessage.success('提交审核成功！')
      emit('listRefresh')
      emit('selectCount', [])
    } else {
      ElMessage.error(res.message)
    }
  })
}
// 编辑
function edit({ applyId, settlementType }) {
  const params = {
    applyId,
    type: 0,
		settlementType
  }
  emit('openDetail', params)
}
function batchDeleteItem() {
  const params = []
  state.selectArr.forEach(({ applyId }) => {
    params.push(applyId)
  })
  if (!params.length) {
    ElMessage.warning('请先勾选需要删除的单号!')
    return false
  }
  removeFun(params)
}
function deleteItem({ applyId }) {
  const params = [applyId]
  removeFun(params)
}
function removeFun(params) {
  remove({ applyId: params }).then(res => {
    if (res.code == 200) {
      state.selectArr = []
      ElMessage.success('删除成功！')
      emit('listRefresh')
      emit('selectCount', [])
    } else {
      ElMessage.error(res.message)
    }
  })
}
// 合并单元格方法
function colspanMethod(row) {
  const { rowIndex, columnIndex } = row
  if (row.row.orderItemsFlag) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 16 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}
//单元格样式
function cellStyle({ row, column }) {
  if (row.orderItemsFlag) return { backgroundColor: '#FAFAFA' }
}
// 生成假数据
function getTableList() {
  let arr = []
  props.dataList.forEach((item, index) => {
    arr.push({ ...item, orderItemsFlag: false, isChecked: false })
    arr.push({ ...item, orderItemsFlag: true })
  })
  state.data = arr
}
function sortFn(val, type) {
  const params = {
    sortName: val,
    sortType: type
  }
  emit('listRefresh', params)
}
// 单选
const handleCheckedChange = (value, item) => {
  if (value) {
    state.selectArr.push(item)
  } else {
    state.selectArr.splice(state.selectArr.indexOf(item), 1)
  }
  item.checked = !item.checked
  state.checkedList = state.selectArr.length === props.dataList.length
  state.isIndeterminate =
    state.selectArr.length > 0 && state.selectArr.length < props.dataList.length
  emit('selectCount', state.selectArr)
}
// 全选/不选
let handleCheckAllChange = val => {
  state.data.forEach((item, index) => {
    if (index % 2 == 0) {
      item.isChecked = val
    }
  })
  state.checkedList = val
  state.isIndeterminate = false
  state.selectArr = val ? props.dataList : []
  emit('selectCount', state.selectArr)
}
const { data, checkedList, isIndeterminate } = toRefs(state)
watch(
  () => props.dataList,
  () => {
    nextTick(() => {
      getTableList()
    })
  },
  { deep: true },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.purchaseOrderReason {
  text-align: left;
}
.middle {
  margin-bottom: 16px;
}
.unSelectActive {
  color: #909399;
}
.red {
  color: #ff0000;
}
.table-list {
  background: #fff;
  padding: 24px 30px;
}
.deleteBtn {
  color: #ff0000;
}
</style>
