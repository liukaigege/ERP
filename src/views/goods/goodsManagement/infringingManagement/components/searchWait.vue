<!--
 * @Descripttion: 'searchWait.vue 待审核-搜索'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-07 00:00:00
-->
<template>
  <div class="searchContent">
    <el-form :model="searchData" label-width="80px" :inline="true">
      <el-form-item label="搜索内容:">
        <el-select
          clearable
          v-model="searchData.searchWordsType"
          placeholder="请选择搜索内容"
          
          style="width: 115px"
        >
          <el-option label="商品名称" value="1"></el-option>
          <el-option label="敏感词汇" value="2"></el-option>
          <el-option label="商品标签" value="3"></el-option>
        </el-select>
        <el-input
          v-model="searchData.searchContent"
          
          style="width: 260px; margin-left: 16px"
          :maxlength="500"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品品类:">
        <el-select
          clearable
          v-model="searchData.goodsCateGory"
          placeholder="请选择商品品类"
          
          style="width: 115px"
        >
          <el-option label="全部" value="1"></el-option>
          <el-option label="商品品类二" value="2"></el-option>
          <el-option label="商品品类一" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品来源:">
        <el-cascader
          clearable
          
          style="width: 115px"
          v-model="searchData.source"
          :options="searchData.sourceData"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="申请人:">
        <el-select
          clearable
          v-model="searchData.searchContentType"
          placeholder="请选择申请人"
          
          style="width: 115px"
        >
          <el-option label="申请人一" value="shanghai"></el-option>
          <el-option label="申请人二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间:">
        <el-date-picker
          v-model="searchData.searchTime"
          type="daterange"
          
          range-separator="至"
          style="width: 260px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="侵权原因:">
        <el-select
          clearable
          v-model="searchData.tortReasonChecked"
          placeholder="请选择侵权原因"
          
          style="width: 115px"
        >
          <el-option v-for="item in searchData.tortReason" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  style="margin-left: 10px"
          >查询</el-button
        >
        <el-button >重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import {sourceData,tortReason} from '@/assets/js/staticData.js'
export default {
  setup() {
    const state = reactive({
      searchData: {
        searchWordsType: '商品名称', //搜索内容选择
        searchContent: '', //搜索内容文字
        goodsCateGory: '全部', //商品品类
        source: [], //商品来源
        sourceData, //商品来源数据
        tortReason,//侵权原因
        tortReasonChecked:'全部',//侵权原因选择
        searchContentType: '',
        searchTime: ''
      }
    })
    function handleChange(){
      // 
    }
    return {
      ...toRefs(state),
      handleChange
    }
  }
}
</script>
<style lang="scss" scoped>
.searchContent {
  border-top: 1px solid #e9e9e9;
  padding-top: 20px;
}
:deep(.el-date-editor .el-range-separator) {
  width: 8%;
}
</style>