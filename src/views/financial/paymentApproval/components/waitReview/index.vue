<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="container_box">
    <el-form :model="searchData" :inline="true" ref="formRef" :rules="rules" class="formContainer" @keyup.enter="queryList">
      <el-form-item label="时间范围：">
        <el-select class="selectWidth" v-model="searchData.timeType" placeholder="请选择">
          <el-option v-for="item in [{ value: 2, label: '申请时间' }]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-model="searchData.start_end" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="搜索内容：" prop="keyword">
        <el-select class="selectWidth" v-model="searchData.type" placeholder="请选择">
          <el-option v-for="item in [
              { value: 1, label: '采购单号' },
              { value: 2, label: '供应商名称' },
              { value: 3, label: '流水号' }
            ]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input style="width: 318px" v-model="searchData.keyword" placeholder="请输入要检索的内容多条可用逗号或空格隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="申请人：">
        <el-select class="selectWidth" v-model="searchData.userId" placeholder="请选择" clearable>
          <el-option v-for="item in applyListData" :key="item.userId" :label="item.fullName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商类型：">
        <ElSelectTree :data="supplierListData" slPlaceholder="请选择" :treeProps="{
            value: 'id',
            label: 'name',
            children: 'childs'
          }" @ok="checkedSupplier" :defaultExpandAll="true" :width="140" :slClearable="true" displayStyle="inline-block" ref="elSelectTree" />
        <!-- <el-button type="primary" style="margin-left: 20px" @click="queryList"
          >查询</el-button
        >
        <el-button @click="resetFn">重置</el-button> -->
      </el-form-item>
      <el-form-item label="结算方式：">
        <el-select class="selectWidth" v-model="searchData.settlementEnum" placeholder="请选择" clearable>
          <el-option v-for="item in settlementList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 20px" @click="queryList">查询</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="sortContainer">
      <ErpSort :options="waitSortCondition" :defaultSort="defaultData" @sort="sortFn" />
    </div>
    <div class="printContainer" v-if="authPath('completePayment') || authPath('nonpayment')">
      <div>
        <el-button type="primary" @click="completePayment" v-if="authPath('completePayment')">完成付款</el-button>
        <el-button type="primary" @click="refuseToPay(false)" v-if="authPath('nonpayment')">拒绝付款</el-button>
      </div>
      <div>
        <el-button type="primary" @click="exportModalShow = true">导出</el-button>
      </div>
    </div>
    <div class="tableContainer" v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="serialNumber" label="流水号" width="170" align="center">
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
				<el-table-column prop="applyAmount" label="申请金额" width="80" align="center">
          <template #default="{row}">&yen;{{row.applyAmount}} </template>
        </el-table-column>
        <el-table-column prop="skuTypeCount" width="90" label="SKU种类" align="center">
        </el-table-column>
        <el-table-column prop="purchaseCount" label="采购数量" width="80" align="center">
        </el-table-column>
        <el-table-column prop="storageCount" label="到货数量" width="80" align="center">
        </el-table-column>
        <el-table-column prop="storageAmount" label="到货金额" width="80" align="center">
					<template #default="{row}">&yen;{{row.storageAmount}} </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="应付" width="80" align="center">
          <template #default="{row}">&yen;{{row.totalAmount}} </template>
        </el-table-column>
        <el-table-column prop="grandAmount" label="实付" width="80" align="center">
          <template #default="{row}">&yen;{{row.grandAmount}} </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已付" width="80" align="center">
          <template #default="{row}">&yen;{{row.paidAmount}} </template>
        </el-table-column>
        <el-table-column label="结算方式" width="130" align="center">
          <template #default="scope">
            <div>
              {{ settlementRender(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" width="80" align="center">
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" align="center" width="200">
          <template #default="scope">
            <div class="timeRow" :title="scope.row.applyTime" :class="!timeLimt(scope.row.applyTime) ? 'redCor' : ''">
              {{ scope.row.applyTime }}
            </div>
          </template>
        </el-table-column>
         <el-table-column prop="remark" width="110" show-overflow-tooltip label="备注" align="center">
        </el-table-column>
        <el-table-column prop="applyId"  fixed="right" label="操作" align="center" width="60" v-if="authPath('waitReviewDetail')">
          <template #default="scope">
            <el-button type="text" @click="toDetailFn(scope.row.applyId)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表单分页 -->
    <div v-show="!isCheckWaitReviewDetail">
      <ErpPage ref="erpPage" :total="totalCount" :count="checkedList.length" @updateData="erpPageBack" />
    </div>
    <!-- 拒绝付款弹框 -->
    <RefuseDialog v-if="refuseDialogShow" :list="refuseList" @closeBack="closeBack" />
    <CompletePay v-if="completePayShow" @closeBack="completePaymentBack" />
    <ExportModal v-if="exportModalShow" :exportType="2" :tableData="tableData" :status="1" :selectList="checkedList" :seachParams="searchData" @close="exportModalBack" />
  </div>
</template>
<script>
import { reactive, toRefs, ref, onActivated } from 'vue'
import ErpPage from '@/components/erpPage/index.vue'
import RefuseDialog from '../dialog/refuseDialog.vue'
import ExportModal from '../../../statementApproval/components/export.vue'
import { authPath } from '@/utils/hooks'
import {
  waitSortCondition,
  searchData,
  defaultData,
  settlementList
} from '../../composables/data'
import { ElMessage, ElMessageBox } from 'element-plus'
import { examineList, completetFn } from '../../composables/api'
import { deepCopy } from '@/utils/tool'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import { timeLimt, paramsQuery, settlementRender } from '../../composables/tool'
import { useRouter, useRoute } from 'vue-router'
import CompletePay from '../dialog/completePay.vue'
export default {
  name: 'WaitReview',
  components: {
    ErpPage,
    RefuseDialog,
    ElSelectTree,
    ErpSort,
    CompletePay,
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
    const elSelectTree = ref(null)
    const state = reactive({
      searchData: deepCopy(searchData),
      tableData: [],
      checkedList: [],
      refuseDialogShow: false,
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
            message: '采购单号及供应商名称最多查询1000条'
          }
        ]
      },
      totalCount: 0,
      completePayShow: false,
      exportModalShow: false,
      refuseList: []
    })

    // 查询列表
    function checkExamineList() {
      state.searchData.status = 1
			state.tableData = []
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
      if (route.params.id > 9) {
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
      elSelectTree.value.init(false)
      // 重置分页器
      erpPage.value.handleSizeChange(10)
      // 重置搜索条件
      state.searchData = deepCopy(searchData)
      // 调用页面数据
      checkExamineList()
    }
    // 分页器返回数据
    function erpPageBack(val) {
      state.searchData.page = val
      checkExamineList()
    }
    // 查询明细
    function toDetailFn(id) {
      router.push({ name: 'waitReviewDetail', query: { id } })
    }
    // 选择table表单中的多选按钮
    function handleSelectionChange(val) {
      state.checkedList = val.map(v => v.applyId)
      state.refuseList = []
      val.forEach(v => {
        if (v.settlementType != 2) state.refuseList.push(v.applyId)
      })
    }
    // 关闭拒绝原因输入弹框
    function closeBack(val) {
      if (val === 'success') {
        // 拒绝成功
        state.refuseDialogShow = false
        checkExamineList()
      } else {
        state.refuseDialogShow = val
      }
    }
    // 完成付款
    function completePayment() {
      if (state.checkedList.length) {
        state.completePayShow = true
      } else {
        ElMessage.warning({
          message: '请选择申请审核单'
        })
      }
    }
    function completePaymentBack(val) {
      state.completePayShow = false
      if (val)
        completetFn({ applyId: state.checkedList, ...val }).then(res => {
          if (res.code == 200) {
            // 完成后原搜索条件再次调用列表数据
            ElMessage.success({ message: '提交成功！' })
            checkExamineList()
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
    }
    // 点击拒绝付款按钮
    function refuseToPay(id) {
      if (id) state.refuseList = [id]
      if (state.refuseList.length) {
        state.refuseDialogShow = true
      } else {
        ElMessage.warning({ message: state.checkedList.length ? '采购单结算方式为账期的付款单，不能执行拒绝付款' : '请选择申请审核单' })
      }
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

    // 导出返回
    function exportModalBack(val) {
      state.exportModalShow = val
    }

    return {
      ...toRefs(state),
      defaultData,
      waitSortCondition,
      erpPage,
      toDetailFn,
      refuseToPay,
      handleSelectionChange,
      closeBack,
      sortFn,
      checkedSupplier,
      resetFn,
      checkExamineList,
      erpPageBack,
      completePayment,
      timeLimt,
      queryList,
      elSelectTree,
      completePaymentBack,
      settlementList,
      exportModalBack,
      settlementRender
    }
  }
}
</script>
<style lang='scss' scoped>
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
.redCor {
  color: #f56c6c;
}
.timeRow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  display: flex;
  justify-content: space-between;
}
.tableContainer {
  box-sizing: border-box;
  padding: 20px;
}
.formContainer {
  background-color: #fff;
}
:deep(.el-range-separator) {
  z-index: 0;
}
</style>
