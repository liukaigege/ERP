<template>
  <el-dialog title="添加配件" v-model="show" width="600px" @close="close" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" :inline="false">
      <el-form-item label="配件名称" prop="partsName">
        <el-input v-model="form.partsName" maxlength="50" style="width: 180px" size="large"></el-input>
      </el-form-item>
      <el-form-item label="配件数量" prop="partsNum">
        <el-input-number :controls="false" v-model="form.partsNum" :min="0" :max="999" :precision="0" size="large"></el-input-number>
      </el-form-item>
      <el-form-item label="配件单价" prop="partsPrice">
        <el-input-number :controls="false" v-model="form.partsPrice" :precision="2" :min="0.01" :max="99999.99" placeholder="CNY" size="large"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="returnInfo">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
export default {
  emits: ['close', 'addData'],
  props: ['ids'],
  setup(props, ctx) {
    let state = reactive({
      form: {
        partsName: '',
        partsNum: undefined,
        partsPrice: undefined,
        operation: 1,
      },
      show: true
    })
    let formRef = ref(null)

    let rules = {
      partsName: [
        { required: true, message: '请填写配件名称', trigger: 'blur' }
      ],
      partsNum: [
        { required: true, message: '请填写配件数量', trigger: 'blur' },
        {
          validator(rule, value, callback) {
            value <= 0 || value > 999
              ? callback(new Error(rule.message))
              : callback()
          },
          message: '配件数量为1-999'
        }
      ],
      partsPrice: [
        { required: true, message: '请填写配件单价', trigger: 'blur' },
        {
          validator(rule, value, callback) {
            value <= 0.01 || value > 99999.99
              ? callback(new Error(rule.message))
              : callback()
          },
          message: '配件单价为0.01-99999.99'
        }
      ]
    }

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('close')
      }, 500)
    }

    function returnInfo() {
      formRef.value.validate().then(res => {
        ctx.emit('addData', { ...state.form })
        close()
      })
    }
    return {
      ...toRefs(state),
      formRef,
      close,
      rules,
      returnInfo
    }
  }
}
</script>

<style>
</style>
