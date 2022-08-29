<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-07-23 15:16:26
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-18 11:36:26
-->
<template>
  <div class="withContainer">
   
    <withTable/>
  </div>
</template>
<script>
import withTable from './component/withTable.vue'
export default {
  name:'ExportSettings',
  components: { withTable }
  }
</script>

<style lang="scss" scoped>
.withContainer{
    background-color: #fff;
    padding: 24px;
    margin-bottom: 32px;
}
</style>