<template>
  <div class="page">
    <div class="headBox">到货记录</div>
    <div class="contentBox">
      <vxe-table v-bind="tableOptions" :data="props.info" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column field="createTime" title="时间"></vxe-column>
        <vxe-column field="trackNum" title="运单号">
          <template #default="{ row }">
            <div>{{row.trackNum ?? '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="boxNum" title="到货箱数"></vxe-column>
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
  let tableOptions = shallowReactive({
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
    }
  }
  
</style>