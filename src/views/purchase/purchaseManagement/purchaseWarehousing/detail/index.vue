<template>
  <div class="publishDialog">
    <el-dialog
      title="详情"
      v-model="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="到货信息" :name="0"> </el-tab-pane>
        <!-- <el-tab-pane label="质检信息" :name="1"> </el-tab-pane> -->
        <el-tab-pane label="出入库信息" name="2"> </el-tab-pane>
      </el-tabs>
      <vxe-table
        border
        show-overflow
        highlight-hover-row
        max-height="400"
        :data="data.logisticses"
        v-if="activeName == 0"
        align="center"
      >
        <vxe-column field="time" title="时间"></vxe-column>
        <vxe-column title="箱数" field="boxesNum"></vxe-column>
        <vxe-column title="运单号" field="trackNum"></vxe-column>
      </vxe-table>
      <vxe-table
        border
        show-overflow
        highlight-hover-row
        max-height="400"
        :data="data.records"
        v-if="activeName == 1"
      >
        <vxe-column field="time" title="时间"></vxe-column>
        <vxe-column title="需检数" field="needInspect"></vxe-column>
        <vxe-column title="合格数" field="qualified" align="center"></vxe-column
        ><vxe-column field="不合格数" title="unqualified"></vxe-column>
        <vxe-column title="质检结果" field="result"></vxe-column>
      </vxe-table>
      <vxe-table
        border
        show-overflow
        highlight-hover-row
        max-height="400"
        :data="data.storages"
        v-if="activeName == 2"
        align="center"
      >
        <vxe-column field="time" title="时间"></vxe-column>
        <vxe-column title="出入库数量" field="numbers">
          <template #default="{ row }">
            <span v-if="row.type == 0" class="in"> +{{ row.numbers }} </span>
            <span v-if="row.type == 1" class="out"> - {{ row.numbers }} </span>
          </template>
        </vxe-column>
        <vxe-column title="货架位" field="grid" align="center"></vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { purchaseWarehousesDetail } from '../composables/api.js'
const state = reactive({
  activeName: '0',
  dialogVisible: false,
  data: {}
})
const porps = defineProps({
  detailsId: Number
})
const emit = defineEmits(['dialogClose'])
function openDetail() {
  purchaseWarehousesDetail({ id: porps.detailsId })
    .then(res => {
      if (res.code == 200) {
        state.data = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
    .catch(err => {
      ElMessage.error(err.message)
    })
}
function closeDialog() {
  emit('dialogClose')
}
onMounted(() => {
  openDetail()
  state.dialogVisible = true
})
const { activeName, dialogVisible, data } = toRefs(state)
</script>

<style lang="scss" scoped>
.publishDialog {
  :deep(.el-dialog__body) {
    padding: 0 24px 60px 24px;
  }
}
.in {
  color: #ff0000;
}
.out {
  color: #00b050;
}
</style> 


