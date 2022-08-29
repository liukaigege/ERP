<template>
<div class="reconciliationBox">
  <el-affix :offset="110" target=".reconciliationBox">
    <div class="tabs">
      <el-button :class="{active:tabsActive=='beReviewed'}" @click="tabsChange('beReviewed')">
        <div>待审核</div>
        <div>({{dataNum.todoApprovalTotal || 0}})</div>
      </el-button>
      <el-button :class="{active:tabsActive=='reviewed'}" @click="tabsChange('reviewed')">
        <div>已审核</div>
        <div>({{dataNum.approvedTotal || 0}})</div>
      </el-button>
    </div>
  </el-affix>
  <div class="search">
    <el-form :model="formData" ref="formRef" :inline="true">
      <el-form-item label="时间范围:" prop="timeType">
        <el-select v-model="formData.timeType" style="width:150px">
          <el-option label="发货时间" :value="1"></el-option>
          <el-option label="对账时间" :value="2" v-if="tabsActive=='beReviewed'"></el-option>
          <el-option label="审核时间" :value="3" v-else></el-option> 
          <el-option label="物流商发货时间" :value="4" ></el-option>
        </el-select>
        <el-date-picker v-model="formData.date" unlink-panels type="daterange" value-format="YYYY-MM-DD" style="width:280px;margin-left: 10px;" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="dateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="物流方式:" prop="logist">
        <el-cascader :options="logisticList" placeholder="请选择物流方式" :props="caProps" @change="selectedLogis" v-model="formData.logist" style="width: 300px;" clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="状态:" v-if="tabsActive=='beReviewed'" prop="status">
        <el-select v-model="formData.status" style="width:120px" clearable>
          <el-option label="未获取" :value="0"></el-option>
          <el-option label="待审核" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重量差异(g):" prop="endWeight" :rules="{validator:(rule,value,callback)=>{
          if(value<formData.startWeight){
            callback('请输入正确的重量差异范围')
          }else{
            callback()
          }
        },trigger:'blur'}">
        <el-input-number v-model="formData.startWeight" :controls="false" placeholder="请输入" />
        <span style="color:#d7d7d7;margin: 0 10px;">—</span>
        <el-input-number v-model="formData.endWeight" :controls="false" placeholder="请输入" />
      </el-form-item>
      <div class="flex">
        <div>
          <el-form-item label="包裹类型:" prop="orderType">
            <el-select v-model="formData.orderType" style="width:120px" clearable>
              <el-option label="系统订单" :value="0"></el-option>
              <el-option label="店小秘订单" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搜索内容:" prop="searchType">
            <el-select v-model="formData.searchType" placeholder="请选择" clearable style="width:120px" @change="changeSearch">
              <el-option label="包裹号" value="1"></el-option>
              <el-option label="运单号" value="2"></el-option>
              <el-option label="订单号" value="3"></el-option>
              <el-option label="审核人" value="4" v-if="tabsActive == 'reviewed'"></el-option>
              <el-option label="物流方式" value="5" ></el-option>
            </el-select>
            <el-input v-model="formData.searchText" :placeholder="placeholderType" clearable style="width:320px;margin-left: 10px;"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <div class="btnBox">
    <erpSort :options="options[tabsActive]" :defaultSort="{value:formData.sortType,type:formData.sort}" @sort="sortChange" />
    <div class="flex">
      <div class="left">
        <el-button type="primary" @click="batchAuditShow = true" v-if="tabsActive == 'beReviewed'" v-permission="'batchAudit'">批量审核</el-button>
        <el-button type="primary" @click="exportFileShow = true" v-if="tabsActive == 'beReviewed'" v-permission="'importBtn'">导入对账</el-button>
        <el-button type="primary" @click="importFileShow = true" v-if="tabsActive == 'reviewed'" v-permission="'importFileBtn'">导入修改</el-button>
        <el-button type="primary" @click="openDialog('remarkShow',true)" v-if="tabsActive == 'beReviewed'">备注</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="exportDataShow = true">导出</el-button>
      </div>
    </div>
  </div>
  <tables :logisticList="logisticList" :formData="formData" :tabsActive="tabsActive" @checkList="checkChange" ref="tableRef" @dataNum="(e)=> dataNum = e" />
  <batchAudit @closeEvent="batchAuditShow=false" v-if="batchAuditShow" :data="checkList" :formData="formData" @search="search" />
  <exportFile @closeEvent="exportFileShow=false" v-if="exportFileShow" @search="search" />
  <importFile @closeEvent="importFileShow=false" v-if="importFileShow" @search="search" />
  <remark @closeEvent="remarkShow=false" v-if="remarkShow" :data="checkList" @search="search" />
  <exportData @closeEvent="exportDataShow=false" v-if="exportDataShow" :data="checkList" :formData="formData" />
</div>
</template>

<script>
import { onMounted, reactive, toRefs, ref, nextTick, onActivated } from 'vue'
import erpSort from '@/components/erpSort/index.vue'
import { channelWithManual } from '@/api/order/orderManagement.js'
import batchAudit from './components/batchAudit.vue'
import exportFile from './components/exportFile.vue'
import importFile from './components/importFile.vue'
import remark from './components/remark.vue'
import exportData from './components/export.vue'
import tables from './components/tables.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import moment from 'moment'
export default {
  name: 'Reconciliation',
  components: { erpSort, batchAudit, exportFile, importFile, remark, exportData, tables },
  setup() {
    const route = useRoute()
    const state = reactive({
      tabsActive: 'beReviewed',
      formData: {
        approveStatus: 0,
        date: '',
        timeType: 1,
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        status: '',
        startWeight: undefined,
        endWeight: undefined,
        searchType: '1',
        searchText: '',
        logist: null,
        sort: 'desc',
        sortType: 2,
        orderType: ''
      },
      logisticList: [],
      batchAuditShow: false,
      exportFileShow: false,
      importFileShow: false,
      remarkShow: false,
      exportDataShow: false,
      relationShow: false,
      checkList: [],
      formRef: null,
      dataNum: {},
      placeholderType:'请输入要检索的内容多条可用逗号或空格隔开'
    })
    let tableRef = ref(null)
    let options = {
      beReviewed: [{ value: 2, label: '发货时间' }],
      reviewed: [{ value: 1, label: '审核时间' }, { value: 2, label: '发货时间' }]
    }

    let caProps = {
      value: 'value',
      label: 'name',
      children: 'billWays',
      checkStrictly: true
    }

    onMounted(() => {
      const params = route.params.data ? JSON.parse(route.params.data) : {}
      if(Object.keys(params).length){
        state.tabsActive = params.tabsActive
        state.formData.approveStatus = state.tabsActive == 'beReviewed' ? 0 : 1
        if(params.time){
         params.startTime =  moment().endOf('day').subtract(params.time==3?params.time:params.time-1, 'days').format('YYYY-MM-DD 00:00:00')
         params.endTime =  moment().endOf('day').subtract(params.time>1?1:0, 'days').format('YYYY-MM-DD 23:59:59')
         state.formData.date = [ params.startTime, params.endTime]
        }
      }
      Object.assign(state.formData,params)
      channelWithManual().then(res => {
        res.data.unshift({ name: '其他', value: 'isOther' })
        state.logisticList = res.data
      })
    })
    function changeSearch(val){
      console.log(val,'val');
      if(val==5){
        state.placeholderType = '请输入要检索的内容'
      }else{
        state.placeholderType = '请输入要检索的内容多条可用逗号或空格隔开'
      }
    }
    function tabsChange(val) {
      state.tabsActive = val
      state.formData.approveStatus = val == 'beReviewed' ? 0 : 1
      reset(true)
    }

    function dateChange(t) {
      state.formData.startTime = null
      state.formData.endTime = null
      if (t) {
        state.formData.startTime = t[0] + ' 00:00:00'
        state.formData.endTime = t[1] + ' 23:59:59'
      }
    }

    function sortChange(type, val) {
      state.formData.sort = val
      state.formData.sortType = type
      nextTick(() => {
        tableRef.value.search()
      })
    }

    function selectedLogis(e) {
      state.formData.logistics = null
      state.formData.lgtcLine = null
      if (e) {
        state.formData.logistics = e[0]
        state.formData.lgtcLine = e[1]
      }
    }

    function checkChange(val) {
      state.checkList = val
    }

    function search(e) {
      tableRef.value.search(e)
    }

    function reset(e) {
      state.formRef.resetFields()
      state.formData.startTime = null
      state.formData.endTime = null
      state.formData.startWeight = undefined
      state.formData.endWeight = undefined
      state.formData.searchText = null
      state.formData.date = null
      state.formData.logistics = null
      state.formData.lgtcLine = null
      state.formData.sort = 'desc'
      state.formData.sortType = 2
      state.formData.orderType = ''
      search(e)
    }

    function openDialog(key, isCheck) {
      if (isCheck && !state.checkList.length) return ElMessage.error('请选择要备注的订单')
      state[key] = true
    }
    return {
      ...toRefs(state),
      tabsChange,
      dateChange,
      sortChange,
      options,
      caProps,
      selectedLogis,
      checkChange,
      search,
      reset,
      tableRef,
      openDialog,
      changeSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  padding: 15px;
  background-color: #fff;

  .el-button {
    height: 80px;
  }

  .active {
    color: #fff;
    background-color: #409EFF;
  }
}

.search {
  margin-top: 24px;
  background-color: #fff;
  padding: 15px;
  padding-bottom: 0;

  ::v-deep(.el-form-item + .el-form-item) {
    margin-left: 6px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;

  .left {
    .el-button+.el-button {
      margin-left: 0;
    }

    .el-button {
      margin-right: 10px;
    }
  }

}

.btnBox {
  padding: 15px;
}
</style>
