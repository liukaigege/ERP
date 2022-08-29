<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: zhangzhifang
 * @Date: 2021-07-14 14:13:48
 * @LastEditors: zhangzhifang
 * @LastEditTime: 2021-07-15 18:42:55
-->
<template>
  <div class="headRemarks">
    <el-dialog
      title="备注"
      v-model="dialogRemarks"
      width="800px"
      custom-class="myDialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <div class="heads">
        <el-form>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="remarks" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button  
          @click="closeDialog"
            >取 消</el-button
          >
          <el-button type="primary"  @click="handOkRemarks"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { onMounted } from 'vue'
export default {
  props:{
    remark:{
      type:String,
      default:String

    }
  },
  emits: ['closeDialog','handOkRemarks'],
  setup(props, context) {
    const remark=props.remark
    const state = reactive({
      dialogRemarks: true,
      remarks: ''
    })
    //一进页面的渲染
    const init=()=>{
      state.remarks=remark
    }
    onMounted(()=>{
      init()
    })
    const closeDialog = () => {
      context.emit('closeDialog')
    }
    const handOkRemarks=()=>{
     context.emit('handOkRemarks',state.remarks)
    }
    return { ...toRefs(state), closeDialog,handOkRemarks,remark }
  }
}
</script>
<style scoped lang="scss" >
.headRemarks {
  .heads {
    :deep(.el-textarea__inner) {
      height: 100px !important;
    }
    :deep(.el-dialog__body) {
      padding-top: 10px;
    }
  }
}
</style>

