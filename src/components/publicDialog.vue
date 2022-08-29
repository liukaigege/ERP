<!-- dialog弹框模板，复制粘贴使用 Author: 韦剑 -->
<template>
  <el-dialog title="标题" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="contentView">
      <!-- 内容区 -->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="affirmEvent" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({})
const emit = defineEmits(['closeEvent'])
let state = reactive({
  ifShow: true,
  loading: false
})

// 关闭弹框
let closeEvent = (refresh = false) => { // refresh为true则刷新列表
  state.ifShow = false
  setTimeout(() => {
    emit('closeEvent', refresh)
  }, 500)
}

// 取消回调
let cancelEvent = () => {
  closeEvent()
}

// 确认回调
let affirmEvent = () => {
  closeEvent()
}

let { ifShow, loading } = toRefs(state)
</script>

<style lang="scss" scoped>
</style>
