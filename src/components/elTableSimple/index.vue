<!--
 * @Descripttion: 
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-15 10:11:13
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-21 16:00:50
-->
<template>
  <div class="tableView">
    <table>
      <tbody>
        <tr :colspan="2" class="head">
          <slot name="extraHeader"></slot>
        </tr>
        <tr class="content">
          <slot name="infoList"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.tableView{
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
    tr, td{
      padding: 0;
    }
    .head{
      border: 1px solid #dcdfe6;
      border-bottom: none;
    }
    .content{
      width: 100%;
      border-left: 1px solid #dcdfe6;
      border-top: 1px solid #dcdfe6;
    }
  }
}
</style>
