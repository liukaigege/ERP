<template>
  <!-- 特殊属性组件 -->
  <div class="special-info-container">
    <div class="info-title">特殊属性:</div>
    <div class="info-item">
      <el-checkbox class="more-clear-disabled" @change="selectElectronic" :disabled="disabled" v-model="electronic" true-label="含电" false-label="empty">含电</el-checkbox>
      <el-select class="info-select more-clear-disabled" :disabled="disabled || (electronic !== '含电')" v-model="electronicType" size='small'>
        <el-option value="含电内电" label="内电"></el-option>
        <el-option value="含电纯电" label="纯电"></el-option>
      </el-select>
    </div>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="noLiquid" true-label="含非液体化妆品" false-label="empty">含非液体化妆品</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="liquid" true-label="液体" false-label="empty">液体</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="paste" true-label="膏体" false-label="empty">膏体</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="plant" true-label="植物" false-label="empty">植物</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="special" true-label="特货（敏感货）" false-label="empty">特货（敏感货）</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="magnet" true-label="带磁" false-label="empty">带磁</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="powder" true-label="含粉末" false-label="empty">含粉末</el-checkbox>
    <el-checkbox class="more-clear-disabled" :disabled="disabled" v-model="powder" true-label="木质" false-label="empty">木质</el-checkbox>
  </div>
</template>

<script>
import { toRefs } from 'vue'
export default {
  props: ['info', 'disabled'],
  setup(props) {
    function selectElectronic(value) {
      if (value === '含电') {
        if (!props.info.electronicType) {
          props.info.electronicType = '含电内电'
        }
      } else {
        props.info.electronicType = null
      }
    }
    return {
      ...toRefs(props.info),
      selectElectronic
    }
  }
}
</script>

<style lang="scss" scoped>
.special-info-container {
  display: flex;
  align-items: center;
  .info-title {
    margin-right: 10px;
    color: #606266;
  }
  .info-select {
    width: 90px;
    margin-right: 20px;
  }
  :deep(.el-checkbox) {
    margin-right: 20px;
  }
  .info-item {
    display: flex;
    align-items: center;
    :deep(.el-checkbox) {
      margin-right: 10px;
    }
  }
}
</style>
