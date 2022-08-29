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
    <vxe-column field="packageTotal" title="发货包裹总量"></vxe-column>
    <vxe-column field="sevenDay" title="7天签收率">
      <template #default="{row}">
        {{row.sevenDay}}%
      </template>
    </vxe-column>
    <vxe-column field="tenDay" title="10天签收率">
      <template #default="{row}">
        {{row.tenDay}}%
      </template>
    </vxe-column>
    <vxe-column field="fourteenDay" title="14天签收率">
      <template #default="{row}">
        {{row.fourteenDay}}%
      </template>
    </vxe-column>
    <vxe-column field="eighteenDay" title="18天签收率">
      <template #default="{row}">
        {{row.eighteenDay}}%
      </template>
    </vxe-column>
    <vxe-column field="twentyTwoDay" title="22天签收率">
      <template #default="{row}">
        {{row.twentyTwoDay}}%
      </template>
    </vxe-column>
    <vxe-column field="twentySixDay" title="26天签收率">
      <template #default="{row}">
        {{row.twentySixDay}}%
      </template>
    </vxe-column>
    <vxe-column field="thirtyDay" title="30天签收率">
      <template #default="{row}">
        {{row.thirtyDay}}%
      </template>
    </vxe-column>
    <vxe-column field="moreThanThirtyDay" title="30天以上签收率">
      <template #default="{row}">
        {{row.moreThanThirtyDay}}%
      </template>
    </vxe-column>
    <vxe-column field="theSameDay" title="截至查询日期最终签收率" width="250">
      <template #default="{row}">
        {{row.theSameDay}}%
      </template>
    </vxe-column>
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