<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="recivedContainer">
    <el-form :model="searchData" :inline="true" ref="formRef" :rules="rules" class="formContainer" @keyup.enter="queryList">
      <el-form-item label="时间范围：">
        <el-select class="selectWidth" v-model="searchData.timeType" placeholder="请选择">
          <el-option v-for="item in [
              { value: 1, label: '创建时间' },
              { value: 2, label: '申请时间' },
              { value: 3, label: '支付时间' },
              { value: 4, label: '审批时间' }
            ]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-model="searchData.start_end" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="搜索内容：" prop="keyword">
        <el-select class="selectWidth" v-model="searchData.type" placeholder="请选择">
          <el-option v-for="item in [
              { value: 1, label: '采购单号' },
              { value: 3, label: '流水号' }
            ]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input style="width: 318px" v-model="searchData.keyword" placeholder="请输入要检索的内容多条可用逗号或空格隔开"  clearable></el-input>
      </el-form-item>
      <el-form-item label="申请人：">
        <el-select class="selectWidth" v-model="searchData.userId" placeholder="请选择" clearable>
          <el-option v-for="item in applyListData" :key="item.userId" :label="item.fullName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款账号：">
        <el-cascader v-model="searchData.checkedList" :options="list" :props="{
            label: 'accountId',
            value: 'accountId',
            children: 'childSupplierPayDO'
          }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="供应商类型：">
        <ElSelectTree :data="supplierListData" slPlaceholder="请选择" :treeProps="{
            value: 'id',
            label: 'name',
            children: 'childs'
          }" @ok="checkedSupplier" :defaultExpandAll="true" :width="140" :slClearable="true" displayStyle="inline-block" ref="ElSelectTreeRef" />
      </el-form-item>
      <el-form-item label="审核结果：">
        <el-select class="selectWidth" v-model="searchData.result" clearable placeholder="请选择">
          <el-option v-for="item in [
              { value: 1, label: '已付款' },
              { value: 0, label: '已打回' }
            ]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式：">
        <el-select class="selectWidth" v-model="searchData.settlementEnum" clearable placeholder="请选择">
          <el-option v-for="item in settlementList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="queryList">查询</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="sortContainer">
      <ErpSort :options="sortCondition" :defaultSort="defaultDatad" @sort="sortFn" />
    </div>
    <div class="printContainer">
      <!-- <el-button type="primary" >打印</el-button> -->
      <el-button type="primary" @click="exportModalShow = true">导出</el-button>
    </div>
    <div class="tableContainer" v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" tooltip-effect="dark" :cell-style="{ width: '100px' }" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号" align="center" width="170">
        </el-table-column>
        <el-table-column prop="purchaseOrderNumber" label="采购单号" align="center" width="170">
        </el-table-column>
         <el-table-column prop="partnerType" width="120" label="平台" align="center">
          <template #default="{row}">
           <div>{{{"1":'合作供应商',"2":"1688","3":"淘宝","4":"拼多多"}[row.partnerType]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="200">
        </el-table-column>
        <el-table-column prop="accountName" width="140" label="1688账号" align="center">
        </el-table-column>
        <el-table-column prop="thirdSubmitTime" width="140" label="1688下单时间" align="center">
        </el-table-column>
				<el-table-column prop="applyAmount" label="申请金额" align="center" width="80">
					<template #default="{row}">&yen;{{row.applyAmount}} </template>
        </el-table-column>
        <el-table-column prop="skuTypeCount" label="SKU种类" align="center" width="90">
        </el-table-column>
        <el-table-column prop="purchaseCount" label="采购数量" align="center" width="80">
        </el-table-column>
        <el-table-column prop="storageCount" label="到货数量" align="center" width="80">
        </el-table-column>
        <el-table-column prop="storageAmount" label="到货金额" align="center" width="80">
					<template #default="{row}">&yen;{{row.storageAmount}} </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="应付" align="center" width="80">
					<template #default="{row}">&yen;{{row.totalAmount}} </template>
        </el-table-column>
        <el-table-column prop="grandAmount" label="实付" align="center" width="80">
					<template #default="{row}">&yen;{{row.grandAmount}} </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已付" align="center" width="80">
					<template #default="{row}">&yen;{{row.paidAmount}} </template>
        </el-table-column>
        <el-table-column label="结算方式" width="130" align="center">
          <template #default="scope">
            <div>
              {{ settlementRender(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" align="center" width="80">
        </el-table-column>
        <el-table-column label="审核结果" align="center" width="80">
          <template #default="scope">
            <div>
              {{ scope.row.checkStatus == 1 ? '已付款' : '已打回' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核原因" align="center" width="80">
          <template #default="scope">
            <el-button type="text" :disabled="!scope.row.reason" @click="queryReason(scope.row.reason)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" align="center" width="200">
          <template #default="scope">
            <div :class="!timeLimt(scope.row.applyTime) ? 'redCor' : ''">
              {{ scope.row.applyTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" align="center" width="110">
          <template #default="scope">
            <div>
              {{
                scope.row.checkStatus == 1 && scope.row.payTime
                  ? scope.row.payTime.split(' ')[0]
                  : ''
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierPaymentAccount" label="付款账号" align="center" width="140">
        </el-table-column>
            <el-table-column prop="remark" width="110" show-overflow-tooltip label="备注" align="center">
        </el-table-column>
        <el-table-column  fixed="right" prop="applyId" label="操作" align="center" width="60" v-if="authPath('reviewedDetail')">
          <template #default="scope">
            <el-button type="text" @click="toDetailFn(scope.row.applyId)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!isCheckWaitReviewDetail">
      <ErpPage ref="erpPage" :total="totalCount" :count="checkedList.length || 0" @updateData="erpPageBack" />
    </div>
    <ExportModal v-if="exportModalShow" :exportType="2" :status="2" :tableData="tableData" :selectList="checkedList" :seachParams="searchData" @close="exportModalBack" />
  </div>
</template>
<script>
import { reactive, toRefs, ref, onActivated } from 'vue'
import ErpPage from '@/components/erpPage/index.vue'
import {
  searchDatad,
  sortCondition,
  defaultDatad,
  settlementList
} from '../../composables/data'
import { deepCopy } from '@/utils/tool'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import { timeLimt, paramsQuery, settlementRender } from '../../composables/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { examineList, listSupplierPaymentAccount } from '../../composables/api'
import { useRouter, useRoute } from 'vue-router'
import { authPath } from '@/utils/hooks'
import ExportModal from '../../../statementApproval/components/export.vue'
export default {
  name: 'Reviewed',
  components: {
    ErpPage,
    ElSelectTree,
    ErpSort,
    ExportModal
  },
  props: {
    supplierListData: Array,
    applyListData: Array,
    isCheckWaitReviewDetail: Boolean
  },
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const erpPage = ref(null)
    const ElSelectTreeRef = ref(null)
    const state = reactive({
      searchData: deepCopy(searchDatad),
      tableData: [],
      allChecked: false, //全选
      indeterminate: false, //部分选择
      checkedList: [],
      sortConditionChecked: 1,
      formRef: null,
      rules: {
        keyword: [
          {
            validator(rule, value, callback) {
              value && value.indexOf(',') && value.split(',').length > 1000
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '采购单号最多查询1000条'
          }
        ]
      },
      totalCount: 0,
      list: [],
      exportModalShow: false,
    })

    // 查询付款账户列表
    listSupplierPaymentAccount().then(res => {
      if (res.code == 200) {
        state.list = res.data.childSupplierPayDO || []
      } else {
        ElMessage.warning({ message: res.message })
      }
    })
    // 查询列表
    function checkExamineList() {
			state.tableData = []
      const { checkedList } = state.searchData
      state.searchData.supplierPaymentAccount =
        checkedList && checkedList.length
          ? checkedList[checkedList.length - 1]
          : null
      examineList(state.searchData).then(res => {
        if (res.code == 200) {
          state.tableData = deepCopy(res.data.dataList)
          state.totalCount = res.data.page.totalCount
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    onActivated(() => {
      if (route.params.id < 10) {
        state.searchData = paramsQuery(route.params.id - 0, state.searchData)
      }
      checkExamineList()
    })

    // 点击查询
    function queryList() {
      state.formRef.validate(val => {
        if (val) checkExamineList()
      })
    }
    // 查询明细
    function toDetailFn(id) {
      router.push({ name: 'reviewedDetail', query: { id } })
    }
    // 选择table表单中的多选按钮 => 改为全选
    function handleSelectionChange(val) {
      state.checkedList = val.map(v => v.applyId)
    }

    // 分页器返回数据
    function erpPageBack(val) {
      state.searchData.page = val
      checkExamineList()
    }
    //选择供应商二级树状结构数据
    function checkedSupplier(val, title) {
      if (val) {
        state.searchData.supplierName = title || null
        if (props.supplierListData.some(v => v.id === val)) {
          // 一级供应商
          state.searchData.supplierType = val
        } else {
          // 二级供应商
          props.supplierListData.forEach(v => {
            if (v.childs.some(item => item.id === val))
              state.searchData.supplierType = v.id
          })
        }
      } else {
        state.searchData.supplierName = title || null
        state.searchData.supplierType = val
      }
    }
    // 重置按钮
    function resetFn() {
      // 重置分页器
      erpPage.value.handleSizeChange(10)
      // 重置搜索条件
      state.searchData = deepCopy(searchDatad)
      ElSelectTreeRef.value.init(false)
      // 调用页面数据
      checkExamineList()
    }
    // 排序方式切换
    function sortFn(val, type) {
      state.searchData.sortName = val
      state.searchData.sortType = type
      state.searchData.page = {
        pageNo: 1,
        pageSize: 10
      }
      erpPage.value.handleSizeChange(10)
    }
    function queryReason(val) {
      ElMessageBox.confirm(val, '审核原因', {
        showConfirmButton: false,
        cancelButtonText: '关闭',
        closeOnClickModal: false
      })
        .then(() => { })
        .catch(() => { })
    }

    // 导出返回
    function exportModalBack(val) {
      state.exportModalShow = val
    }
    return {
      ...toRefs(state),
      sortCondition,
      erpPage,
      toDetailFn,
      handleSelectionChange,
      sortFn,
      checkedSupplier,
      checkExamineList,
      erpPageBack,
      resetFn,
      sortCondition,
      timeLimt,
      queryList,
      defaultDatad,
      queryReason,
      ElSelectTreeRef,
      settlementList,
      settlementRender,
      exportModalBack
    }
  }
}
</script>
<style lang='scss' scoped>
.centerClass {
  text-align: center;
}
.explainContainer {
  background-color: #fffced;
  // border-bottom: 1px solid #ebeef5;
  line-height: 40px;
  box-sizing: border-box;
  padding: 0 20px;
  color: #8c8c8c;
  font-size: 14px;
}
.redCor {
  color: #f56c6c;
}

.selectWidth {
  width: 140px;
  margin-right: 16px;
}
:deep(.el-range-separator) {
  z-index: 1;
}
.sortContainer {
  background-color: #f9f9fb;
  padding: 10px 0;
  .sortCondition {
    margin-right: 16px;
    color: #606266;
  }
  .sortCondition:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  .active {
    color: #1890ff;
  }
}
.printContainer {
  background-color: #f9f9fb;
  padding: 0 0 20px;
  text-align: right;
}
.tableContainer {
  box-sizing: border-box;
  padding: 20px;
}
:deep(.el-form) {
  box-sizing: border-box;
  padding: 0 20px;
}
:deep(.el-form-item) {
  margin-bottom: 10px;
}
:deep(.el-form-item__label) {
  padding: 0;
}
.formContainer {
  background-color: #fff;
}
:deep(.el-range-separator) {
  z-index: 0;
}
</style>
