<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="导出"
      width="30%"
      :close-on-click-modal="false"
    >
      <div>
        <el-radio v-model="type" :label="1">导出当前查询</el-radio>
        <el-radio v-model="type" :label="2">导出当前勾选</el-radio>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" >取 消</el-button>
          <el-button type="primary"  @click="handleClose"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { exportInfo } from '../composables/api.js'
import { deepCopy } from '@/utils/tool'
const porps = defineProps({
  form: {
    type: Object,
    default: {}
  },
  selectIdArr: {
    type: Array,
    default: []
  },
  isResolved: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['close'])
const state = reactive({
  dialogVisible: false,
  type: 1
})
onMounted(() => {
  state.dialogVisible = true
})
const handleClose = () => {
  let params = {}
  if (state.type == 2) {
    if (porps.selectIdArr.length) {
      params.type = 2
      params.ids = porps.selectIdArr
    } else {
      ElMessage({ type: 'info', message: '请先勾选需要导出的单号' })
      emit('close')
      return false
    }
  } else {
    params = deepCopy(porps.form)
    params.type = 1
    params.isResolved = porps.isResolved
    params.caseReasonEnum = params.caseReason
    delete params.page
  }
  exportInfo(params).then(res => {
    if (res.code == 200) {
      window.open(res.data)
      ElMessage({ type: 'success', message: '操作成功!' })
      emit('close')
    } else {
      ElMessage.error(res.message)
    }
  })
}
const closeDialog = () => {
  emit('close')
}
const { dialogVisible, type } = toRefs(state)
</script>

<style>
</style>