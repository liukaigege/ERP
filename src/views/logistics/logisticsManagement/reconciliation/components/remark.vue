<template>
<el-dialog title="账单备注" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
  <el-form :model="form" :inline="false" size="normal">
    <el-form-item label="备注:">
      <el-input v-model.trim="form.remark" :rows="4" type="textarea" maxlength="200" placeholder="请输入备注" clearable></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button  @click="close">取消</el-button>
    <el-button  type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { batchRemark } from '../api/api.js'
import { ElMessage } from 'element-plus'
export default {
  emits: ["closeEvent",'search'],
  props: {
    data: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      form: {
        remark: '',
        ids:props.data.map(item=>item.id)
      }
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      batchRemark(state.form).then(res=>{
        ElMessage.success('添加备注成功')
        ctx.emit('search')
        close()
      })
    }

    return {
      ...toRefs(state),
      close,
      submit,

    }
  }
}
</script>

<style>

</style>
