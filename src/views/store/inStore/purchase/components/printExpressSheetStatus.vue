<template>
  <el-dialog title="面单打印信息确认" v-model="ifShow" :show-close="false" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="printExpressSheetView">
      <div>
        面单生成信息：（成功生成面单<span class="blue">{{expressSheetStatus.successCount}}</span>个，失败<span class="red">{{expressSheetStatus.errorCount}}</span>个）
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent" type="danger">打印失败</el-button>
        <el-button class="btn" type="primary" @click.enter="affirmEvent" autofocus :loading="loading" :disabled="!expressSheetStatus.ifPrintSuccess">打印完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { defineComponent } from 'vue'
import { printComplate } from '@/api/store.js'
import { ElMessage } from 'element-plus'
import { printFail } from '@/utils/tool.js'
export default defineComponent({
  emits: ['closeEvent', 'affirmEvent'],
  props: {
    expressSheetStatus: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    document.activeElement?.blur()
    let ifShow = ref(true)
    let state = reactive({
      loading: false
    })
    let methods = {
      closeEvent() {
        printFail(() => {
          context.emit('closeEvent')
        })
      },
      affirmEvent() {
        let uuid = props.expressSheetStatus.uuid
        state.loading = true
        printComplate({uuid, source: 1}).then(res => {
          state.loading = false
          if (res.code == 200) {
            context.emit('affirmEvent')
          } else {
            ElMessage.error(res.message)
          }
        }).catch(() => {
          state.loading = false
        })
      }
    }
    onMounted(() => {
      let btn = document.querySelector('.btn')
      setTimeout(() => {
        btn.focus()
      }, 500)
    })
    return {
      ...toRefs(state),
      ifShow,
      ...methods
    }
  }
})
</script>

<style lang="scss" scoped>
.printExpressSheetView{
  display: flex;
  justify-content: center;
  .blue{
    color: #1890FF;
  }
  .red{
    color: #FF4D4F;
  }
}
</style>