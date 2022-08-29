<template>
<!-- 店匠 -->
<el-form :model="formData" ref="form" :rules="rules" label-width="80px" :inline="false">
  <el-form-item label="授权码" prop="token">
    <el-input v-model="formData.token" class="input-width" ></el-input>
  </el-form-item>
  <el-form-item label="App_key" prop="appKey">
    <el-input v-model="formData.appKey" class="input-width" ></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import {
  empower
} from '@/api/goods/shop.js'
import {onMounted, reactive, toRefs } from 'vue-demi'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: Object
  },
  emits:['search'],
  setup(props,ctx) {
    const state = reactive({
      formData: {
        token: '',
        appKey:''
      },
      form:null
    })
     onMounted(()=>{
      state.formData.token = props.data.token
      state.formData.appKey = props.data.appKey
    })
    const rules = {
      token: {
        required: true,
        message: 'token不能为空',
        trigger: 'blur'
      },
      appKey: {
        required: true,
        message: 'App_Key不能为空',
        trigger: 'blur'
      }
    }


    function submit(){
      state.form.validate().then(res=>{
        empower({
          tempDomain:props.data.tempDomain,
          token:state.formData.token.replace(/[ ]|[\r\n]/g,''),
          appKey:state.formData.appKey.replace(/[ ]|[\r\n]/g,''),
          platform:props.data.platform,
          shopId:props.data.shopId
        }).then(res=>{
            if (res.data) {
            ElMessage.success('店铺授权成功')
            ctx.emit('search')
          } else {
            ElMessage.error('店铺授权失败')
          }
        })
      })
    }
    return {
      ...toRefs(state),
      rules,
      submit,
    }
  }
}
</script>

<style scoped lang="scss">
.input-width{
  width: 350px;
}

</style>
