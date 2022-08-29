<!--
* @Descripttion: 草稿
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
        @click="batchSubmit()"
        v-if="authPath('/v1/paymentRequest/submit')"
      >
        提交审核
      </el-button>
      <el-popconfirm
        title="是否批量删除该草稿？"
        @confirm="batchDeleteItem()"
        v-if="authPath('/v1/paymentRequest/delete')"
      >
        <template #reference>
          <el-button type="primary">删除</el-button>
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
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        ><vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column title="采购单号" min-width="150">
          <template #default="{ row }">
            <template v-if="!row.orderItemsFlag">
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
        <vxe-column field="grandTotalAmount" title="应付金额" width="100">
          <template #default="{ row }"> ￥{{ row.grandTotalAmount }} </template>
        </vxe-column>
        <vxe-column field="subtotalAmount" title="实付" width="100">
          <template #default="{ row }"> ￥{{ row.subtotalAmount }} </template>
        </vxe-column>
        <vxe-column title="已付" width="100">
          <template #default="{ row }"> ￥{{ row.payAmount }} </template>
        </vxe-column>
				<vxe-column title="结算方式" width="100">
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
        <vxe-column field="purchaseUserName" title="采购员" width="100"></vxe-column>
				<vxe-column field="createByName" title="创建人" width="100"></vxe-column>
				<vxe-column field="serialNumber" title="流水号" min-width="150"></vxe-column>
        <vxe-column title="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              class="primaryBtn"
              @click="submit(row)"
              v-if="authPath('/v1/paymentRequest/submit')"
              >提交审核</el-button
            >
            <el-button
              type="text"
              class="primaryBtn"
              @click="detail(row)"
              v-if="authPath('/v1/paymentRequest/edit')"
              >编辑</el-button
            >
            <el-popconfirm
              title="是否删除该草稿？"
              @confirm="deleteItem(row)"
              v-if="authPath('/v1/paymentRequest/delete')"
            >
              <template #reference>
                <el-button type="text" class="deleteBtn">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, nextTick } from 'vue'
import { reSubmit, remove } from '../../composables/api.js'
import ErpSort from '@/components/erpSort/index.vue'
import { ElMessage } from 'element-plus'
import { authPath } from '@/utils/hooks'
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    dataList: {
      type: Array,
      default: []
    }
  },
  components: {
    ErpSort
  },
  setup(props, { emit }) {
    // 创建时间：ppa.create_time 付款金额：ppa.grand_total_amount申请时间：ppa.apply_time 付款时间：ppc.creat_time
    const sortList = [
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
    let state = reactive({
      data: [],
      selectArr: []
    })
    function detail({ applyId, settlementType }) {
      const params = {
        applyId,
        type: 0,
				settlementType
      }
      emit('openDetail', params)
    }
    // 提交审核
    function batchSubmit() {
      const params = []
      state.selectArr.forEach(({ applyId }) => {
        params.push(applyId)
      })
      if (!params.length) {
        ElMessage.warning('请先勾选需要提交审核的单号!')
        return false
      }
      submitFun(params)
    }
    function submit({ applyId }) {
      const params = [applyId]
      submitFun(params)
    }
    function submitFun(params) {
      reSubmit({ applyId: params }).then(res => {
        if (res.code == 200) {
          state.selectArr = []
          ElMessage.success('提交审核成功!')
          emit('listRefresh')
          emit('selectCount', [])
        } else {
          ElMessage.error(res.message)
        }
      })
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
          emit('listRefresh')
          ElMessage.success('删除成功！')
          emit('selectCount', [])
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    function selectAllEvent({ checked, records }) {
      state.selectArr = records
      emit('selectCount', records)
    }
    function selectChangeEvent({ checked, records }) {
      state.selectArr = records
      emit('selectCount', records)
    }
    function sortFn(val, type) {
      const params = {
        sortName: val,
        sortType: type
      }
      emit('listRefresh', params)
    }
    onMounted(() => {})
    watch(
      () => props.dataList,
      () => {
        nextTick(() => {
          state.data = props.dataList
        })
      },
      { deep: true },
      { immediate: true }
    )
    return {
      ...toRefs(state),
      detail,
      deleteItem,
      submit,
      sortList,
      selectAllEvent,
      batchSubmit,
      selectChangeEvent,
      batchDeleteItem,
      sortFn,
      defaultSort,
      authPath
    }
  }
}
</script>

<style lang="scss" scoped>
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
