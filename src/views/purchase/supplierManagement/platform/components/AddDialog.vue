<template>
  <el-dialog title="添加平台授权账号" v-model="show" :width="600" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialog(false)">
    <el-form ref="formRef" :model="form" :rules="rules"  :label-width="120">
      <el-form-item prop="accountName" label="账号名称:">
        <el-input type="text" v-model="form.accountName"></el-input>
      </el-form-item>
      <el-form-item prop="appKey" label="appKey:">
        <el-input type="text" v-model="form.appKey"></el-input>
      </el-form-item>
      <el-form-item prop="secretKey" label="secretKey:">
        <el-input type="text" v-model="form.secretKey"></el-input>
      </el-form-item>
      <el-form-item prop="accessToken" label="accessToken:">
        <el-input type="text" v-model="form.accessToken"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: right">
        <el-button  @click="closeDialog(false)">取消</el-button>
        <el-button  type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { add } from '@/api/purchase/platform.js'
import { deepCopy } from 'tool'
import { ElMessage } from 'element-plus'

export default {
  props: ['type'],
  emits: ['close'],
  setup(props, ctx) {
    const state = reactive({
      form: {
        accountType: props.type,
        accountName: null,
        appKey: null,
        secretKey: null,
        accessToken: null
      },
      rules: {
        accountName: [{ required: true, message: '请输入账号名称' }, {
          validator(rule, value, callback) {
            value && value.length <= 50 ? callback() : callback(new Error('最多不能超过50个字符'))
          }
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        appKey: [{ required: true, message: '请输入appKey' }, {
          validator(rule, value, callback) {
            value && value.length <= 50 ? callback() : callback(new Error('最多不能超过50个字符'))
          }
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        secretKey: [{ required: true, message: '请输入secretKey' }, {
          validator(rule, value, callback) {
            value && value.length <= 100 ? callback() : callback(new Error('最多不能超过100个字符'))
          }
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        accessToken: [{ required: true, message: '请输入accessToken' }, {
          validator(rule, value, callback) {
            value && value.length <= 100 ? callback() : callback(new Error('最多不能超过100个字符'))
          }
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
      },
      show: true,
      formRef: null
    })

    function closeDialog(refresh) {
      ctx.emit('close', refresh)
    }

    function submit() {
      state.formRef.validate(val => {
        if (val) {
          const form = deepCopy(state.form)
          Object.keys(form).forEach(key => {
            if (form[key] && typeof form[key] === 'string') {
              form[key] = form[key].replace(/(^\s*)|(\s*$)/g, '')
            }
          })
          add(form).then(_ => {
            ElMessage.success({ message: '添加成功' })
            closeDialog(true)
          })
        }
      })
    }

    return {
      ...toRefs(state),
      closeDialog,
      submit
    }
  }
}
</script>