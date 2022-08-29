<!--
 * @Descripttion: 'relevanceSku 查询关联主规格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <el-dialog
    title="关联主规格"
    v-model="visible"
    width="800px"
    :close-on-click-modal="false"
  >
    <div class="tableContainer">
    <el-table :data="list" border style="width: 100%" :show-header="false">
      <el-table-column prop="mainSku" width="92">
        <template #default="scope">
          <div class="re">
            <p style="font-weight: 550">{{ scope.row.fa.name }}</p>
            <el-checkbox
            :disabled="true"
              :indeterminate="scope.row.indeterminate?true:false"
              v-model="scope.row.active"
              label="全选"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="rightList">
        <template #default="scope">
          <div class="re" style="line-height:36px;">
            <el-checkbox
            :disabled="true"
              v-for="v in scope.row.child"
              :key="v.frontId"
              v-model="v.active"
              :label="v.name"
              style="width: 125px;height:36px;white-space: nowrap;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close" >取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { showRelation } from '../composables/tools.js'
export default {
  props: {
    data: {
      type: Array,
      default: null
    },
    frontId:{
      type:String,
      default:null
    }
  },
  setup(props, context) {
    const list = showRelation(props.frontId,props.data.filter(v=>v.customType === 1 || v.normsType === 1))
    const state = reactive({
      visible: true,
      list
    })
    function close() {
      context.emit('close', false)
    }
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 0 !important;
}
.tableContainer{
  position: relative;
  .masker{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

}
</style>