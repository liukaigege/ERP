<!--
 * @Descripttion: 'infringingManagement 侵权商品管理'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-07 00:00:00
-->
<template>
  <div>
    <div class="infringingManagement">
      <el-tabs v-model="activeIndex" @tab-click="changeSearchType">
        <el-tab-pane label="待审核" name="1"> </el-tab-pane>
        <el-tab-pane label="已审核" name="2"> </el-tab-pane>
      </el-tabs>
      <el-form :model="searchData" label-width="80px" :inline="true">
        <el-form-item label="搜索内容:">
          <el-select
            clearable
            v-model="searchData.searchType"
            placeholder="请选择搜索内容"

            style="width: 115px"
            :maxlength="500"
          >
            <el-option label="商品名称" :value="1"></el-option>
            <el-option label="敏感词汇" :value="2"></el-option>
            <el-option label="商品标签" :value="3"></el-option>
          </el-select>
          <el-input
            v-model="searchData.searchText"
            placeholder="请输入要检索的内容"
            style="width: 260px; margin-left: 16px"
            :maxlength="500"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型:">
          <el-select
            clearable
            v-model="searchData.skuType"
            placeholder="请选择商品类型"

            style="width: 145px"
          >
            <el-option label="全部" :value="0"></el-option>
            <el-option label="普通商品" :value="1"></el-option>
            <el-option label="定制商品" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品品类:">
          <el-cascader
            :options="categoryData"
            clearable
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'child'
            }"
            v-model="searchData.categoryId"
          />
          <!-- <ElSelectTree

          v-model="sourceModel"
          :width="91"
          :data="categoryData"
          :treeProps="treeProps"
          slPlaceholder="请选择商品品类"
          @ok="treeChecked"
        /> -->
        </el-form-item>
        <el-form-item label="商品来源:">
          <el-cascader
            clearable

            style="width: 115px"
            v-model="searchData.sourceChecked"
            :options="searchData.sourceData"
            @change="sourceChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="申请人:">
          <el-select
            clearable
            v-model="searchData.applyBy"
            placeholder="请选择申请人"

            style="width: 145px"
          >
            <el-option
              v-for="item in richiedenteList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="侵权原因:">
          <el-select
            clearable
            v-model="searchData.reason"
            placeholder="请选择侵权原因"

            style="width: 155px"
          >
            <el-option
              v-for="item in searchData.tortReason"
              :key="item"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="activeIndex == 2" label="审核人:">
          <el-select
            clearable
            v-model="searchData.examineBy"
            placeholder="请选择审核人"

            style="width: 135px"
          >
            <el-option
              v-for="item in recensioneList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间:" :label-width="60">
          <el-select
            v-if="activeIndex == 2"
            clearable
            v-model="searchData.timeType"
            placeholder="请选择时间"

            style="width: 125px"
          >
            <el-option label="审核时间" value="2"></el-option>
            <el-option label="申请时间" value="1"></el-option>
          </el-select>
          <el-date-picker
            unlink-panels
            v-model="searchData.searchTime"
            type="daterange"
            range-separator="至"
            style="width: 260px"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="activeIndex == 2" label="审核结果:">
          <el-select
            clearable
            v-model="searchData.status"
            placeholder="请选择审核结果"
            style="width: 115px"
          >
            <el-option
              v-for="(item, index) in searchData.tortResult"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"

            style="margin-left: 10px"
            @click="searchFn"
            >查询</el-button
          >
          <el-button  @click="init">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="infringingManagement"
      style="margin-top: 24px; padding-bottom: 50px"
    >
      <Table
        v-if="tableData.length"
        :tableData="tableData"
        :listStatus="activeIndex"
      />
      <Table v-if="!tableData.length" />
      <div class="paginationContent">
        <el-pagination
          @size-change="sizeChangeFn"
          @current-change="currentChangeFn"
          :current-page="pageData.pageNo"
          :page-sizes="paginationData.paginationArr"
          :page-size="pageData.pageSize"
          :layout="paginationData.layout"
          :total="pageData.totalCount"
          :style="paginationData.style"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, computed, toRaw } from 'vue'
import SearchReady from './components/searchReady.vue'
import SearchWait from './components/searchWait.vue'
import Table from './components/table.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { userList, tortList } from './composables/api.js'
import { paginationData, searchData } from './composables/staticData.js'
import { deepCopy } from '@/utils/tool.js'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { getCategory } from '@/api/goods/quotedPrice.js'
import { ElMessage } from 'element-plus'

export default {
  components: { ElSelectTree, SearchReady, SearchWait, Table },
  setup() {
    let store = useStore()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const route = useRoute()
    let richiedenteList = [{ userId: 0, userName: '全部' }], //申请人
      recensioneList = [{ userId: 0, userName: '全部' }], //审核人
      categoryData = [] //商品品类
    const treeProps = {
      value: 'id',
      label: 'name',
      children: 'child'
    }
    const state = reactive({
      activeIndex: route.query.listStatus || '1',
      searchData: deepCopy(searchData),
      categoryData,
      tableData: [], //表格列表数据
      pageData: {
        pageSize: 10,
        pageNo: 1,
        totlePages: 0,
        totalCount: 0
      },
      sourceModel: '',
      richiedenteList: [],
      recensioneList: []
    })
    //品类选择
    function treeChecked(data) {
      state.searchData.categoryId = data
    }

    async function getUserList(type) {
      userList({ type }).then(res => {
        if (res.code == 200) {
          //1.申请人 2.审核人
          if (type == 1) {
            state.richiedenteList = [...richiedenteList, ...res.data]
          } else {
            state.recensioneList = [...recensioneList, ...res.data]
          }
        }
      })
    }
    //申请人
    getUserList(1)
    //审核人
    getUserList(2)

    function searchFn() {
      const {
        searchType, //搜索类型 1商品名 2敏感词汇 3商品标签
        searchText, //检索内容
        categoryId, //商品品类
        source, //商品来源
        applyBy, //申请人
        reason, //侵权原因
        examineBy, //	审核人
        timeType, //时间查询类型 1 申请时间 2 审核时间
        searchTime,
        mode,
        status, //审核结果 1待审核2未侵权 3侵权不可用 4侵权可用
        skuType //商品类型 1普通商品 2定制商品
      } = state.searchData
      let timeStart = null, //申请时间始
        timeEnd = null //申请时间至
      if (searchTime) {
        timeStart = searchTime[0] ? searchTime[0] + ' 00:00:00' : null
        timeEnd = searchTime[1] ? searchTime[1] + ' 23:59:59' : null
      }
      console.log('searchTime', searchTime)
      const listStatus = state.activeIndex - 0 //待审核/已审核列表查询字段 1 待审核 2已审核
      const { pageNo, pageSize } = state.pageData
      tortList({
        page: {
          pageNo,
          pageSize
        },
        searchType: searchType - 0 ? searchType - 0 : null,
        searchText,
        skuType: skuType - 0 ? skuType - 0 : null,
        categoryId: categoryId - 0 ? categoryId - 0 : null,
        mode: mode - 0 ? mode - 0 : null,
        source,
        applyBy: applyBy - 0 ? applyBy - 0 : null,
        reason,
        examineBy: examineBy - 0 ? examineBy - 0 : null,
        timeType: timeType - 0 ? timeType - 0 : null,
        timeStart,
        timeEnd,
        status: status - 0 ? status - 0 : null,
        listStatus: listStatus - 0 ? listStatus - 0 : null
      }).then(res => {
        console.log(res)

        state.pageData.totlePages = res.data.page.totalPage
        state.pageData.totalCount = res.data.page.totalCount
        state.tableData = res.data.dataList
      })
    }
    searchFn()

    //商品品类
    getCategory().then(res => {
      state.categoryData = res.data
    })

    function init() {
      state.searchData = deepCopy(searchData)
      state.searchData.status = ''
      state.searchData.categoryId = ''
      state.searchData.searchText = ''
      state.searchData.searchType = 1
      state.searchData.skuType = ''
      state.searchData.applyBy = ''
      state.searchData.timeType = ''
      searchFn()
    }

    function changeSearchType(key, keyPath) {
      //切换类型(审核状态,'1'待审核,'2'已审核)
      state.activeIndex = key.props.name
      state.pageData.pageSize = 10
      state.pageData.pageNo = 1
      state.searchData = searchData
      init()
    }
    //分页数切换
    function sizeChangeFn(val) {
      state.pageData.pageSize = val
      state.pageData.pageNo = 1
      searchFn()
    }

    //页码切换
    function currentChangeFn(val) {
      state.pageData.pageNo = val
      searchFn()
    }

    function sourceChange() {
      const { sourceChecked } = state.searchData
      if (sourceChecked.length == 1) {
        state.searchData.mode = sourceChecked[0]
      } else if (sourceChecked.length == 2) {
        state.searchData.mode = sourceChecked[0]
        state.searchData.source = sourceChecked[1]
      } else {
        state.searchData.mode = ''
        state.searchData.source = ''
      }
    }
    return {
      ...toRefs(state),
      changeSearchType,
      sideBarWidth,
      paginationData,
      sizeChangeFn,
      currentChangeFn,
      searchFn,
      init,
      sourceChange,
      treeProps,
      treeChecked
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep(.el-date-editor .el-range-separator) {
  width: 8%;
}
.infringingManagement {
  background-color: #fff;
  padding: 20px 20px 0;
  position: relative;
  .paginationContent {
    position: fixed;
    z-index: 2;
    bottom: 0;
    box-sizing: border-box;
    padding: 10px;
    background-color: #fff;
    left: v-bind(sideBarWidth);
    width: calc(100% - v-bind(sideBarWidth));
  }
}
.el-form--inline .el-form-item {
  margin-bottom: 16px;
}
</style>
