<template>
<el-form :model="data" ref="form"  label-width="80px" :inline="false">
  <el-form-item label="店铺名称">
    <el-input v-model="data.name" disabled class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="临时域名">
    <el-input v-model="data.tempDomain" disabled class="input-width"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import {
  empower
} from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'

export default {
  props: {
    data: Object
  },
  mits:['search'],
  setup(props,ctx) {
  
    function submit() {
      empower({
          tempDomain:props.data.tempDomain,
          token:'',
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
    }
    return {
      submit
    }
  }
}
</script>

<style scoped lang="scss">
.input-width{
  width: 350px;
}

</style>
