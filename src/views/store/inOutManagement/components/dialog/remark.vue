<!--
* @Descripttion: Vango ERP 备注信息
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="备注"
      v-model="remarkShow"
      width="520px"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        class="demo-form-inline demo-ruleForm headerForm"
        ref="formRef"
        label-width="52px"
      >
        <el-form-item label="内容：">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="modelValue"
            :maxlength="100"
            @keyup.enter="ok"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="remarkShow = false" >取 消</el-button>
          <el-button type="primary" @click="ok" >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { editRemark } from '../../composables/api'
import { ElMessage } from 'element-plus'
export default {
  props: {
    modelValue: String,
    remarkId: Number
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      remarkShow: true
    })
    function handleClose() {
      state.remarkShow = false
      proxy.$parent.remarkShow = false
    }
    function ok() {
      editRemark({ id: props.remarkId, remark: props.modelValue })
        .then(res => {
          ElMessage.success({
            message: res.message
          })
          emit('ok', { id: props.remarkId, remark: props.modelValue })
          handleClose()
        })
      
    }
    return {
      ...toRefs(state),
      handleClose,
      ok
    }
  }
}
</script>
<style lang='scss' scoped>
</style>