<template>
<el-dialog title="申请成功" v-model="show" width="480px" @close="close">
  <p>权限申请成功。</p>
  <p>可复制商品编码在【{{data.goodsPosition}}】中搜索查看该激活商品。</p>
  <template #footer>
    <el-button @click="close" >关闭</el-button>
    <el-button type="primary" v-copy="data.authId" @click="close" >复制商品编码</el-button>
  </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  emits: ['closeEvent'],
  props: {
    data: {
      default: {}
    }
  },
  setup(props, ctx) {
    const state = reactive({
      show: true
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>

<style>

</style>
