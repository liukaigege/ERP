<template>
<el-dialog title="处理进度" v-model="show" width="640px" @close="close" :close-on-click-modal="false">
  <p style="text-align:center">{{progressDesc}}</p>
  <el-progress :text-inside="true" :stroke-width="14" :percentage="progress" status="success" />
</el-dialog>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
export default {
  props: {
    progress: {
      default: 0
    },
    progressDesc:{
      default:'正在处理'
    }
  },
  emits:['closeEvent'],
  setup(props,ctx) {
    const state = reactive({
      show: true,
    })
    watch(()=>props.progress,val=>{
      if(val==100){
        setTimeout(() => {
          close(true)
        }, 700);
      }
    })
    function close(e) {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent',e)
      }, 500);
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
