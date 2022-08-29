<!--
 * @Descripttion: 
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-12 10:54:13
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-12 11:44:34
-->
<template>
  <div>
    <el-form>
      <el-form-item label="创建时间:">
        <el-input
          type="textarea"
          :rows="7"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';
  export default {
    setup() {
      let textarea = ref('')
      return {
        textarea
      }
    }
  };
</script>

<style>

</style>
