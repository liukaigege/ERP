<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-10-23 19:16:12
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 22:23:47
-->


<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
      :before-close="befroeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="progress">
        <el-progress :percentage="percentage" :format="format"></el-progress>
      </div>
      <p v-if="text">{{ text }}</p>
      <p>采集中，请耐心等待，20-30分钟后仍无反应，请与研发部联系</p>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  nextTick,
  watch
} from 'vue'
import { progressInfo } from '@/api/basic.js'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  props: {
    dialog: {
      type: String,
      default: null
    },
    dialogTitle: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '30%'
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const data = reactive({
      percentage: 0,
      timer: null,
      text: null,
      emitQuery: null
    })

    const format = percentage =>
      percentage === 100 ? '完成' : `${percentage}%`

    watch(
      () => data.percentage,
      a => {
        if (a == 100) {
        }
      }
    )

    const dialogHandOk = () => {}

    const close = () => {
      if (data.timer) {
        clearInterval(data.timer)
      }
      proxy.$parent.showLoadingDialog = false
    }

    const befroeClose = done => {
      if (data.percentage >= 0 && data.percentage < 100) {
        ElMessageBox.confirm('正在采集，确定关闭采集进度条?')
          .then(() => {
            done()
          })
          .catch(() => {
            // catch error
          })
      }

      return false
    }

    const cancel = () => {
      if (data.timer) {
        clearInterval(data.timer)
      }
      context.emit('cancel', data.emitQuery)
      proxy.$parent.showLoadingDialog = false
    }

    const progress = uuid => {
      data.timer = setInterval(() => {
        progressInfo(uuid).then(res => {
          const response = res.data
          if (typeof response !== 'String') {
            data.percentage = response.percent
            console.log(response.description)
            if (response.percent == 100) {
              let x = JSON.parse(response.description)
              data.emitQuery = x
              cancel()
            } else {
              data.text = response.description
            }
          }
        })
      }, 1000)
    }

    onMounted(() => {
      nextTick(() => {
        console.log(2321)
        progress(props.dialog)
      })
    })

    onUnmounted(() => {
      console.log(1)
      clearInterval(data.timer)
    })

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      format,
      befroeClose
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
