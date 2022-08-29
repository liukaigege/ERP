<template>
<el-dialog title="提示" v-model="show" width="900px" @close="close" :close-on-click-modal="false">
  <div style="padding:16px">
    <div v-for="item in data" :key="item.name" style="font-size:16px">该域名{{item.domain}}已在{{item.name}}店铺中使用且处于启用状态，是否仍需变更？</div>
  <div style="color:red">说明：若仍需变更，则系统自动将原店铺中域名停用</div>
  </div>
  <template #footer>
    <el-button @click="close">返回上一步</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { inject, onMounted, reactive, toRefs } from 'vue'
export default {
  props:{
    data:Object
  },
  setup(props){
    const state= reactive({
      show:true
    })

    onMounted(()=>{
      console.log(props.data);
    })
    const closeTips = inject('closeTips')
    const towSubmit = inject('towSubmit')
    function close(){
      state.show = false
      setTimeout(()=>{
        closeTips()
      },500)
    }

    function submit(){
      towSubmit(true)
    }
    return {
      ...toRefs(state),
      close,
      submit
    }
  }
}
</script>

<style>

</style>
