<!--
 * @Descripttion: 'skuRecord SKU历史记录弹框'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div>
    <el-dialog
      title="SKU历史记录"
      v-model="closeModal"
      width="800px"
      :close-on-click-modal="!closeModal"
      :before-close="closeFn"
    >
      <el-table :data="data">
        <el-table-column type="expand">
          <template #default="props">
            <div class="sku-record" v-for="(item,index) in props.row.recordSku" :key="index">
                <div class="sku-record-div">{{item.beforeSku || '-'}}</div>
                <div class="sku-record-div small">{{item.afterSku || '-'}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新前">
          <template #default="scope">
            <div class="re switchContainer">
              更新时间：{{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新后">
            <template #default="scope">
                操作人:{{ scope.row.createUser }}
            </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  setup(props, context) {
    const data = props.data
    const state = reactive({
      closeModal: true,
      data
    })

    function closeFn() {
      context.emit('changeBack', false)
    }
    return {
      ...toRefs(state),
      closeFn
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px;
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
:deep(.el-table__row.expanded) {
  background: #fafafa;
}
:deep(.el-table__row) {
  background: #fafafa;
}
.sku-record {
    display: flex;
    align-items: center;
    &-div {
        flex: .5;
        padding-left: 58px;
        &.small {
            padding-left: 10px;
        }
    }
}
</style>
