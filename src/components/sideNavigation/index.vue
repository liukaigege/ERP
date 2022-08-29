<template>
  <div class="page">
    <div class="headBox">快速导航</div>
    <div class="contentBox">
      <el-timeline>
          <el-timeline-item v-for="(item, index) in props.moduleList" :key="index" :class="index == props.activeStatus ? 'active' : ''" :color="index == props.activeStatus ? '#1890FF' : '#CDCDCD'" @click="clickEvent(item.id, index)">
            <div class="title">{{ item.title }}</div>
          </el-timeline-item>
        </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';
  const emit = defineEmits(['selectModel'])
  const props = defineProps({
    activeStatus: {
      type: Number,
      default: 0,
      require: true 
    },
    moduleList: {
      type: Array,
      default: [],
      require: true 
    }
  })
  let clickEvent = (id, index) => {
    emit('selectModel', { id, index })
  }
</script>

<style lang="scss" scoped>
  .page{
    width: 240px;
    min-height: 498px;
    background-color: #fff;
    border-radius: 2px;
    .headBox{
      padding: 0 24px;
      height: 55px;
      line-height: 55px;
      color: rgba(0,0,0,.85);
      font-size: 16px;
      border-bottom: 1px solid #E9E9E9;
    }
    .contentBox{
      padding: 30px 0 0 70px;
      .active{
        :deep(.el-timeline-item__content) {
          color: #1890ff;
        }
      }
      .title {
        cursor: pointer
      }
    }
  }
  
</style>