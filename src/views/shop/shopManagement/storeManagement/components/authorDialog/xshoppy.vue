<template>
<el-form :model="formData" ref="form" :rules="rules" label-width="100px" :inline="false">
  <el-form-item label="店铺名称">
    <el-input v-model="data.name" disabled class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="临时域名">
    <el-input v-model="data.tempDomain" disabled class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="API密钥" prop="appKey">
    <el-input v-model="formData.appKey" class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="token">
    <el-input v-model="formData.token" class="input-width"></el-input>
  </el-form-item>
  <el-form-item label="共享密钥" prop="sharedSecret">
    <el-input v-model="formData.sharedSecret" class="input-width"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import {
  empower
} from '@/api/goods/shop.js'
import { onMounted, reactive, toRefs } from 'vue-demi'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: Object
  },
  emits: ['search'],
  setup(props, ctx) {
    const state = reactive({
      formData: {
        token: '',
        appKey: '',
        sharedSecret: ''
      },
      form: null
    })
    onMounted(() => {
      state.formData.token = props.data.token
      state.formData.appKey = props.data.appKey
      state.formData.sharedSecret = props.data.sharedSecret
    })
    const rules = {
      token: {
        required: true,
        message: 'API密钥不能为空',
        trigger: 'blur'
      },
      appKey: {
        required: true,
        message: '密码不能为空',
        trigger: 'blur'
      },
      sharedSecret: {
        required: true,
        message: '共享密钥不能为空',
        trigger: 'blur'
      }
    }

    function submit() {
      state.form.validate().then(res => {
        empower({
          tempDomain: props.data.tempDomain,
          token: state.formData.token.replace(/[ ]|[\r\n]/g, ''),
          appKey: state.formData.appKey.replace(/[ ]|[\r\n]/g, ''),
          platform: props.data.platform,
          shopId: props.data.shopId,
          sharedSecret: state.formData.sharedSecret.replace(/[ ]|[\r\n]/g, '')
        }).then(res => {
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

<style lang="scss" scoped>
.input-width {
  width: 350px;
}
</style>
