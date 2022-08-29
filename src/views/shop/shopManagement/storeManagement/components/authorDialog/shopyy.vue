<template>
<el-form :model="formData" ref="form" :rules="rules" label-width="120px" :inline="false">
   <el-form-item label="店铺名称">
    <el-input v-model="data.name" disabled class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="临时域名">
    <el-input v-model="data.tempDomain" disabled class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="CORE_TOKEN" prop="token">
    <el-input v-model="formData.token" class="input-width" ></el-input>
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
      },
      form:null
    })
     onMounted(()=>{
      state.formData.token = props.data.token
      
    })
    const rules = {
      token: {
        required: true,
        message: 'CORE_TOKEN不能为空',
        trigger: 'blur'
      },
    }


    function submit(){
      state.form.validate().then(res=>{
        empower({
          tempDomain:props.data.tempDomain,
          token:state.formData.token.replace(/[ ]|[\r\n]/g,''),
          appKey:'',
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
