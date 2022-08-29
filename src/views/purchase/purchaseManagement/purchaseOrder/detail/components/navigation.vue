<template>
  <div class="page">
    <div class="headBox">快速导航</div>
    <div class="contentBox">
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';

</script>

<style lang="scss" scoped>
  .page{
    background-color: #fff;
    margin-bottom: 24px;
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
    }
  }
  
</style>