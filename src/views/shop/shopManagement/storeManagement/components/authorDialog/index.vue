<template>
<el-dialog :title="title" v-model="show" width="580px" @close="close">
  <component :is="templateName" :data="data" ref="componentRef" @search="search"/>
  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit">授权</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import shoplazza from './shoplaza.vue'
import shopify from './shopify.vue'
import vshop from './vshop.vue'
import funpinpin from './funpinpin.vue'
import shopline from './shopline.vue'
import shopyy from './shopyy.vue'
import xshoppy from './xshoppy.vue'
import shopbase from './shopbase.vue'

export default {
  props: {
    data: Object,
  },
  emits: ['closeEvent','search'],
  components:{shoplazza,shopify,vshop,funpinpin,shopline,shopyy,xshoppy,shopbase},
  setup(props,ctx) {
    const state = reactive({
      show:false,
      templateName:'shoplazza',
      componentRef:'',
      title:''
    })
    onMounted(()=>{

      state.show = true
      state.templateName = props.data.platform
      state.title = props.data.authorStatus == 0?'添加授权':'重新授权'
      console.log(state.templateName);
    })
    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      state.componentRef.submit()
    }

    function search(){
      console.log('授权成功刷新页面');
      ctx.emit('search')
      close()
    }
    return {
      ...toRefs(state),
      close,
      submit,
      search
    }
  }
}
</script>

<style>

</style>
