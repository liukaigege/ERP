<template>
<div>
  <vxe-table border :data="tableData" align="center" :row-class-name="rowClassName">
    <vxe-column field="name" title="物流方式">
      <template #default="{row}">
        <div v-if="row.logistics == '合计'">{{row.logistics}}</div>
        <div v-else>
          <p v-if="row.parent" class="logistics-name">
            {{row.logisticsName}}
          </p>
          <p v-else>
            {{row.lgtcLineName}}
          </p>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="packageTotal" title="签收包裹总量"></vxe-column>
    <vxe-column field="totalAbnormalRate" title="总异常占比">
      <template #header>
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <span>包裹异常次数合计/（包裹正常次数合计+包裹异常次数合计）</span>
          </template>
          <span> 总异常占比 <i class="el-icon-question"></i></span>
        </el-tooltip>
      </template>
      <template #default="{row}">
        {{row.totalAbnormalRate}}%
      </template>
    </vxe-column>
    <vxe-column field="internetAbnormal" title="揽件上网"></vxe-column>
    <vxe-column field="internetAbnormalRate" title="节点异常占比">
      <template #default="{row}">
        {{row.internetAbnormalRate}}%
      </template>
    </vxe-column>
    <vxe-column field="flightDepartureAbnormal" title="航班起飞"></vxe-column>
    <vxe-column field="flightDepartureAbnormalRate" title="节点异常占比">
      <template #header>
        <el-tooltip effect="dark" placement="top">
          <template #content>
            <span>包裹在该状态发生异常的次数/包裹所有状态异常次数合计</span>
          </template>
          <span> 节点异常占比 <i class="el-icon-question"></i></span>
        </el-tooltip>
      </template>
      <template #default="{row}">
        {{row.flightDepartureAbnormalRate}}%
      </template>
    </vxe-column>
    <vxe-column field="flightArrivalAbnormal" title="航班抵达"></vxe-column>
    <vxe-column field="flightArrivalAbnormalRate" title="节点异常占比">
      <template #default="{row}">
        {{row.flightArrivalAbnormalRate}}%
      </template>
    </vxe-column>

    <vxe-column field="customClearanceAbnormal" title="目的国清关"></vxe-column>
    <vxe-column field="customClearanceAbnormalRate" title="节点异常占比">
      <template #default="{row}">
        {{row.customClearanceAbnormalRate}}%
      </template>
    </vxe-column>
    <vxe-column field="transferAbnormal" title="转移末端服务商"></vxe-column>
    <vxe-column field="transferAbnormalRate" title="节点异常占比">
      <template #default="{row}">
        {{row.transferAbnormalRate}}%
      </template>
    </vxe-column>
    <vxe-column field="signForAbnormal" title="签收"></vxe-column>
    <vxe-column field="signForAbnormalRate" title="节点异常占比">
      <template #default="{row}">
        {{row.signForAbnormalRate}}%
      </template>
    </vxe-column>
  </vxe-table>
</div>
</template>

<script>
export default {
  props: {
    tableData: {}
  },
  setup() {
    function rowClassName({ row }) {
      return row.parent ? '' : 'lgtc-line-name'
    }
    return {
      rowClassName
    }
  }

}
</script>

<style>
</style>
