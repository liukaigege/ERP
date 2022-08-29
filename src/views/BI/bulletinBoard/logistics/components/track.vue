<template>
<div>
  <vxe-table border :data="tableData" align="center" :row-class-name="rowClassName">
    <vxe-column field="logisticsName" title="物流方式">
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
    <vxe-column field="packageTotal" title="发货包裹总量"></vxe-column>
    <vxe-colgroup title="揽件上网">
      <vxe-column field="internetNormal" title="正常"></vxe-column>
      <vxe-column field="internetAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="航班起飞">
      <vxe-column field="flightDepartureNormal" title="正常"></vxe-column>
      <vxe-column field="flightDepartureAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="航班抵达">
      <vxe-column field="flightArrivalNormal" title="正常"></vxe-column>
      <vxe-column field="flightArrivalAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="目的国清关">
      <vxe-column field="customClearanceNormal" title="正常"></vxe-column>
      <vxe-column field="customClearanceAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="转交末端服务商">
      <vxe-column field="transferNormal" title="正常"></vxe-column>
      <vxe-column field="transferAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
    <vxe-colgroup title="签收">
      <vxe-column field="signForNormal" title="正常"></vxe-column>
      <vxe-column field="signForAbnormal" title="异常"></vxe-column>
    </vxe-colgroup>
  </vxe-table>
</div>
</template>

<script>
export default {
  props: {
    tableData: {}
  } ,
  setup() {
    function rowClassName({row}) {
      return row.parent ?'' : 'lgtc-line-name'
    }
    return {
      rowClassName
    }
  }

}
</script>

<style>
</style>
