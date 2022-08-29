<!--
* @Descripttion: 已付款
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
      >
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
        <vxe-column field="grandTotalAmount" title="应付" width="100">
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
        <vxe-column
          field="createTime"
          title="创建时间"
          width="100"
        ></vxe-column>
        <vxe-column field="applyTime" title="申请时间" width="100"></vxe-column>
        <vxe-column field="payTime" title="付款时间" width="100"></vxe-column>
        <vxe-column field="purchaseUserName" title="采购员" width="100"></vxe-column>
				<vxe-column field="createByName" title="创建人" width="100"></vxe-column>
				<vxe-column field="serialNumber" title="流水号" min-width="150"></vxe-column>
        <vxe-column title="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              class="primaryBtn"
              @click="detail(row)"
              v-if="authPath('/v1/paymentRequest/detail')"
              >详情</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch, defineProps, nextTick } from 'vue'
import ErpSort from '@/components/erpSort/index.vue'
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
    // 创建时间：ppa.create_time 付款金额：ppa.grand_total_amount 申请时间：ppa.apply_time 付款时间：ppc.creat_time
    const sortList = [
      {
        label: '创建时间',
        value: 'ppa.create_time'
      },
      {
        label: '申请时间',
        value: 'ppa.apply_time'
      },
      {
        label: '付款时间',
        value: 'ppc.create_time'
      },
      {
        label: '付款金额',
        value: 'ppa.grand_total_amount'
      }
    ]
    const defaultSort = { value: 'ppa.create_time', type: 'asc' }
    let state = reactive({
      data: []
    })
    function detail({ applyId, settlementType }) {
      const params = {
        applyId,
        type: 1,
				settlementType
      }
      emit('openDetail', params)
    }
    onMounted(() => {})
    function sortFn(val, type) {
      const params = {
        sortName: val,
        sortType: type
      }
      emit('listRefresh', params)
    }
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
      sortFn,
      sortList,
      defaultSort
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
.table-list {
  background: #fff;
  padding: 24px 30px;
}
</style>
