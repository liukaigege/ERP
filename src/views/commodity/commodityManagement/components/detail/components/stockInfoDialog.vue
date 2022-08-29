<template>
<el-dialog title="在仓库存" v-model="show" width="800px" @close="closeEvent">
  <span style="margin-right:16px">SKU：{{tabsData.skuCode}}</span>
  <span> 在仓共计：{{tabsData.stockInWarehouse}}件</span>
  <el-tabs v-model="tabsActive"  tab-position="top">
    <el-tab-pane lazy :label="`拣货区（${tabsData.pickingAreaStock}）`" name="1">
    </el-tab-pane>
    <el-tab-pane lazy :label="`次品区（${tabsData.defectiveAreaStock}）`" name="2">
    </el-tab-pane>
    <el-tab-pane lazy :label="`收货暂存区（${tabsData.stagingAreaStock}）`" name="3">
    </el-tab-pane>
  </el-tabs>
  <el-table :data="tabsData.gridAreaMap?.[tabsActive]" border stripe max-height="500px">
    <el-table-column prop="shelfSpace" label="货架位" align="center"></el-table-column>
    <el-table-column prop="after" label="数量" align="center"></el-table-column>
    <el-table-column prop="quantity" label="最新库存变化" align="center">
      <template #default="{row}">
        <span v-if="row.type==1" style="color:#70B603">-{{row.quantity}}</span>
        <span v-else style="color:#D9001B">+{{row.quantity}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
  </el-table>

</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue-demi'
export default {
  props: {
    tabsData: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      tabsActive: '1',
      show:true
    })
    onMounted(() => {
      if(props.tabsData){
        for (let key in props.tabsData.gridAreaMap) {
        props.tabsData.gridAreaMap[key].map(item => {
          item.shelfSpace =item.preCode? `${item.preCode}-${item.row<10?'0'+item.row:item.row}-${item.col<10?'0'+item.col:item.col}`:'-'
        })
      }
      }
      
    })

    function closeEvent() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    return {
      ...toRefs(state),
      closeEvent
    }
  }
}
</script>

<style>

</style>
