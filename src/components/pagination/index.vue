<!--
 * @Descripttion: ''
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-08-30 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-08-30 00:00:00
-->
<template>
  <div class="paginationContainer">
    <!-- 分页器 -->
    <el-pagination
      @size-change="sizeChangeFn"
      @current-change="currentChangeFn"
      :current-page="currentPage"
      :page-sizes="paginationArr"
      :page-size="pageSize"
      :layout="layout"
      :total="totlePages"
      :style="style"
    >
    </el-pagination>
  </div>
</template>
<script>
import { reactive, toRefs, ref, toRaw, getCurrentInstance } from 'vue'
export default {
  props: {
    pageSize: {//每页分页数量
      type: Number,
      default: 10
    },
    currentPage: {//当前页码
      type: Number,
      default: 1
    },
    paginationArr: {//分页数组
      type: Array,
      default: [10, 20, 30, 50]
    },
    totlePages: {//总页数
      type: Number,
      default: 0
    },
    layout:{//排列顺序
        type:String,
        default:'prev, pager, next, sizes, jumper, total'
    },
    style:{//分页器样式-对齐方式
        type:String,
        default:'text-align: right;margin:0;'
    }
  },
  setup(props, context) {
    const state = reactive({
      //
    })

    //分页数切换
    function sizeChangeFn(val){
        context.emit('size', val)
    }

    //页码切换
    function currentChangeFn(val){
        context.emit('current', val)
    }

    return {
      ...toRefs(state),
      sizeChangeFn,
      currentChangeFn
    }
  }
}
</script>
<style lang="scss" scoped>
   .paginationContainer{
       padding: 10px;
       background-color: #fff;
   }
</style>