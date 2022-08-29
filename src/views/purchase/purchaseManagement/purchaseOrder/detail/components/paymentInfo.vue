<template>
  <div class="page">
    <div class="headBox">付款记录</div>
    <div class="contentBox">
      <vxe-table v-bind="tableOptions" :data="props.info" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column title="申请时间">
          <template #default="{ row, rowIndex }">
            <div v-if="!row.flag" class="tdContent">
              {{row.applyTime || '-' }}
            </div>
            <div v-else class="tdFooter textOverflow" :title="row.content">{{row.content}}</div>
          </template>
        </vxe-column>
        <vxe-column title="申请金额">
          <template #default="{ row }">
            <div><span v-if="row.applyAmount !== null">￥</span>{{row.applyAmount ?? '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column title="剩余待付">
          <template #default="{ row }">
            <div><span v-if="row.paymentAmount !== null">￥</span>{{row.paymentAmount ?? '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="changeReason" title="变更原因">
          <template #default="{ row }">
            <div>{{row.changeReason || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            <div v-if="row.status == 0">草稿</div>
            <div v-if="row.status == 1">申请中</div>
            <div v-if="row.status == 2">已拒绝</div>
            <div v-if="row.status == 3">已付款</div>
            <div v-if="row.status == 4">已拒绝</div>
          </template>
        </vxe-column>
        <vxe-column field="payTime" title="付款时间">
          <template #default="{ row }">
            <div>{{row.payTime || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column title="付款金额">
          <template #default="{ row }">
            <div><span v-if="row.payAmount !== null">￥</span>{{row.payAmount ?? '-'}}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, shallowReactive } from 'vue';
  let props = defineProps({
    info: {
      type: Object,
      default: {}
    }
  })
  let colspanMethod = ({ row, columnIndex }) => {
    if (row.flag) {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 10 }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    }
  }
  let tableOptions = shallowReactive({
    spanMethod: colspanMethod,
    border: 'inner',
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true
  })
</script>

<style lang="scss" scoped>
  .page{
    background-color: #fff;
    margin-bottom: 24px;
    border-radius: 2px;
    .headBox{
      padding: 0 24px;
      height: 55px;
      line-height: 55px;
      color: rgba(0,0,0,.85);
      font-size: 16px;
      border-bottom: 1px solid #E9E9E9;
    }
    .contentBox{
      padding: 16px 24px;
      .tdFooter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 44px;
        padding: 0 20px;
        text-align: left;
        color: #afada2;
        background-color: rgba(255, 251, 230, 0.7);
      }
    }
  }
  :deep(tbody){
    .vxe-body--row{
      position: relative;
      .vxe-cell{
        min-height: 21px;
      }
    }
  }
  
</style>