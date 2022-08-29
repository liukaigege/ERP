<template>
<el-dialog title="批量审核" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
  <el-radio v-model="radio" :label="1">当前查询</el-radio>
  <el-radio v-model="radio" :label="2">当前选中</el-radio>
  <template #footer>
    <el-button  @click="close">取消</el-button>
    <el-button  type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { batchApprove } from '../api/api.js'
export default {
  emits: ["closeEvent",'search'],
  props: {
    data: {
      default: []
    },
    formData: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      radio: 1
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      switch (state.radio) {
        case 1:
          let data ={ type: 1,query:props.formData }
          batchApprove(data).then(res => {
            ElMessage.success('批量审核成功！')
            ctx.emit('search')
            close()
          })
          break;
        case 2:
          if (!props.data.length) {
            ElMessage.error('请先勾选数据')
          } else {
            batchApprove({ type: 2,ids: props.data.map(item => item.id)}).then(res => {
              ElMessage.success('批量审核成功！')
              ctx.emit('search')
              close()
            })
          }

          break;
      }

    }
    return {
      ...toRefs(state),
      close,
      submit
    }
  }
}
</script>

<style scoped lang="scss">

</style>
