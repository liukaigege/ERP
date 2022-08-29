<!--
 * @Descripttion: 商品订单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:02:44
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-21 09:45:04
-->
<template>
  <div class="orderNum">

    <el-tooltip placement="top" >
      <template #content>
        <p style="cursor:pointer"	v-copy="scope.row.orderId">复制</p>
      </template>
      <p>{{scope.row.orderId}}</p>

    </el-tooltip>


<!--		<el-tooltip placement="top" style='margin-top: 10px'>-->
<!--			<template #content>-->
<!--				<p style="cursor:pointer"	v-copy="scope.row.thrId">复制</p>-->
<!--			</template>-->
<!--			<p style='color:#9e9e9e'>({{scope.row.thrId || '-'}})</p>-->
<!--		</el-tooltip>-->
		<p style='color:#9e9e9e;margin-top: 5px' >({{scope.row.thrOrderId || '-'}})</p>


		<!-- <p style='color:#9e9e9e;margin-top: 10px'>	{{scope.row.transcationId}}</p> -->
<!--		<el-tooltip placement="top" style='margin-top: 10px'>-->
<!--			<template #content>-->
<!--				<p style="cursor:pointer;"	v-copy="scope.row.transcationId">复制</p>-->
<!--			</template>-->
<!--			<p style='color:#9e9e9e'>	{{scope.row.transcationId}}</p>-->
<!--		</el-tooltip>-->

		<p  style='color:#9e9e9e;'  >{{scope.row.deptName || '暂无部门'}}</p>



    <div class="mearge" v-if="scope.parentRow.mergeFlag == 2 || scope.parentRow.mergeFlag == -1 ">
      拆
  </div>
  </div>
</template>

<script>
  import {onMounted} from 'vue'
  export default {
    props:{
      scope:{
        type:Object,
        default:null
      }
    },
    setup(props){

      onMounted(()=>{

      })
    }
  }

</script>


<style lang="scss" scoped>
.orderNum{
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: column;
  p{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1890FF;
  }
  .mearge{
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    background: #FFF1EB;
    border-radius: 4px;
    border: 1px solid #FFB999;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FF5100;
    margin: 5px 0;
  }
}
</style>
