<!--
* @Descripttion: Vango ERP 交易明细 transactionDetails
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
<div>
  <div class="formClass">
    <el-form ref="formRef" :model="form" :inline="true">
      <el-form-item label="搜索内容：">
        <el-select v-model="form.searchType" placeholder="请选择" style="width: 140px">
          <el-option label="Paypal账号" :value="1"></el-option>
          <el-option label="交易号" :value="2"></el-option>
          <el-option label="Paypal参考号" :value="3"></el-option>
          <el-option label="账单号" :value="4"></el-option>
          <el-option label="Paypal编号" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.searchContent" clearable placeholder="请输入搜索内容" style="width: 320px"></el-input>
      </el-form-item>
      <el-form-item label="交易开始日期：">
        <el-date-picker v-model="form.start_end" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="事件类型：">
        <el-select v-model="form.eventType" placeholder="请选择" clearable style="width: 140px">
          <el-option v-for="item in eventTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="tableContainer formClass">
    <el-table :data="list" style="width: 100%" border v-loading="loading">
      <el-table-column prop="accountId" label="paypal名称" align="center">
      </el-table-column>
      <el-table-column prop="number" label="PayPal编号" align="center">
      </el-table-column>
      <el-table-column prop="account" label="PayPal账号" align="center">
      </el-table-column>
      <el-table-column prop="transactionId" label="交易号" align="center">
      </el-table-column>
      <el-table-column prop="referenceId" label="PayPal参考号" align="center">
      </el-table-column>
      <el-table-column prop="tsnEventCodeCn" label="事件类型" align="center">
      </el-table-column>
      <el-table-column prop="tsnInitiationDate" label="交易开始日期" align="center">
      </el-table-column>
      <el-table-column prop="grossTsnAmount" label="交易总额" align="center">
      </el-table-column>
      <el-table-column prop="invoiceId" label="账单号" align="center">
      </el-table-column>
    </el-table>
  </div>
  <!-- 表单分页 -->
  <ErpPage :total="totalCount" ref="erpPage" @updateData="erpPageBack" :pageSizes="[100, 200, 300, 500, 1000]" />
</div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import ErpPage from '@/components/erpPage/index.vue'
import { form, page, eventTypeList } from './composables/data'
import { queryTsn } from './composables/api'
import { deepCopy } from '@/utils/tool'
export default {
  components: {
    ErpPage
  },
  setup() {
    const erpPage = ref(null)
    const state = reactive({
      form: deepCopy(form),
      page: deepCopy(page),
      list: [],
      totalCount: 0,
      loading:false
    })
    // 查询列表
    queryList()

    function queryList() {
      state.loading = true
      const data = { ...state.form, page: state.page }
      queryTsn(data).then(res => {
        state.loading = false
        state.list = res.data.dataList
        state.totalCount = res.data.page.totalCount
      }).catch(err=>state.loading = false)
    }
    // 重置
    function resetFn() {
      state.form = deepCopy(form)
      state.page = deepCopy(page)
      erpPage.value.handleSizeChange(100)
      queryList()
    }
    // 分页返回值
    function erpPageBack(val) {
      state.page = val
      queryList()
    }
    return {
      ...toRefs(state),
      erpPageBack,
      queryList,
      resetFn,
      eventTypeList,
      erpPage
    }
  }
}
</script>

<style lang="scss" scoped>
.formClass {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
  margin-bottom: 20px;
}

.tableContainer {
  padding-bottom: 20px;
}

:deep(.el-form-item__label) {
  padding: 0;
}
</style>
