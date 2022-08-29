<template>
<el-dialog title="导出报关信息" v-model="show" width="640px" :close-on-click-modal="false">
  <p style="text-align:center">{{data.description}}</p>
  <el-progress :text-inside="true" :stroke-width="14" :percentage="data.percent" status="success" />
</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { progressInfo } from '@/api/basic.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    uuid: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      data: {}
    })

    function close() {
      clearInterval(time)
      setTimeout(() => {
        state.show = false
      }, 700);
      setTimeout(() => {
        window.open(state.data.url, '_self')
        ctx.emit('closeEvent')
      }, 800);
    }

    let time = setInterval(() => {
      progressInfo(props.uuid).then(res => {
        state.data = res.data
        if (state.data.errorCode != 0) {
          ElMessage.error('出错了，请重新导出')
          close()
        }
        if (state.data.percent == 100) {
          close()
        }
      }).catch(err => {
        ElMessage.error('出错了，请重新导出')
        close()
      })
    }, 1000)

    return {
      ...toRefs(state),
      close
    }
  }

}
</script>

<style>

</style>
