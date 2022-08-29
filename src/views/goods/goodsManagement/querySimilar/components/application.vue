<!--
* @Descripttion: Vango ERP 申请成功 application
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="申请成功"
    v-model="dialogVisible"
    width="640px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <p class="title-name"><i class="el-icon-success"></i>权限申请成功!</p>
      <p class="content-name">
        可复制商品编码在【{{ successStr }}】中搜索查看该激活商品。
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" 
          >复制商品编码</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { copy } from '@/utils/tool.js'
export default {
  props: {
    id: String,
    successStr: String
  },
  emits: ['applicationBack'],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: true
    })
    function handleClose() {
      emit('applicationBack', false)
    }
    function ok() {
      copy(props.id)
      emit('applicationBack', true)
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
.title-name {
  text-align: center;
  color: #52c41a;
  font-size: 18px;
  line-height: 50px;
  i {
    margin-right: 10px;
  }
}
.content-name {
  text-align: center;
  font-size: 16px;
  line-height: 50px;
}
</style>