<template>
	<el-dialog title="入库失败" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-alert title="部分商品入库失败" type="error" show-icon :closable="false"> </el-alert>
      <vxe-table v-bind="tableOptions" :data="failList" :loading="props.loading" ref="tableRef">
        <vxe-column title="货品名称 / SKU" width="180">
          <template #default="{ row }">
            <div class="textOverflow" :title="row.goodsName">{{row.goodsName}}</div>
            <div>{{row.skuId}}</div>
          </template>
        </vxe-column>
        <vxe-column field="speVal" title="规格值"></vxe-column>
        <vxe-column field="successCount" title="入库成功">
           <template #default="{ row }">
            <div>{{row.successCount || 0}}</div>
          </template>
        </vxe-column>
        <vxe-column field="failCount" title="入库失败"></vxe-column>
        <vxe-column field="reason" title="失败原因" width="100"></vxe-column>
      </vxe-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  const props = defineProps({
    failList: {
      type: Array,
      default: []
    }
  })
  const emit = defineEmits(['closeEvent'])
  let state = reactive({
    ifShow: true,
    loading: false
  })

  let tableOptions = {
    border: true,
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true
  }

  // 关闭弹框
  let closeEvent = () => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent')
    }, 500)
  }

  // 确认回调
  let affirmEvent = () => {
    closeEvent()
  }

  let { ifShow, loading, tableData } = toRefs(state)
</script>

<style lang="scss" scoped>
  .contentView{
    max-height: 300px;
    overflow: auto;
    .el-alert{
      margin-bottom: 20px;
    }
  }
</style>