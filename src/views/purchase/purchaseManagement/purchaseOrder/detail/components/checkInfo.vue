<template>
  <div class="page">
    <div class="headBox">审核记录</div>
    <div class="contentBox">
      <vxe-table v-bind="tableOptions" :data="props.info" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column title="申请时间">
          <template #default="{ row, rowIndex }">
            <div v-if="!row.flag" class="tdContent">
              {{row.applyTime || '-'}}
            </div>
            <div v-else class="tdFooter textOverflow" :title="row.content">{{row.content}}</div>
          </template>
        </vxe-column>
        <vxe-column field="auditTime" title="审核时间">
          <template #default="{ row }">
            <div v-if="row.status !== -1">
              <div>{{row.auditTime || '-'}}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="status" title="审核结果">
          <template #default="{ row }">
            <div v-if="row.status == 1">审核通过</div>
            <div v-if="row.status == 0">未通过打回</div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, shallowReactive } from 'vue'
  let props = defineProps({
    info: {
      type: Array,
      default: []
    }
  })
  let colspanMethod = ({ row, rowIndex, columnIndex }) => {
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