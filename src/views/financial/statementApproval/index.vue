<template>
  <div class="statement-approval">
    <div class="head">
      <el-tabs v-model="form.checkStatus" tab-position="top">
        <el-tab-pane label="待审核" name="1"></el-tab-pane>
        <el-tab-pane label="已审核" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="form-and-btn-container">
      <el-form :model="form" :inline="true" @keydown.enter='search'>
        <el-form-item label="时间范围:">
          <el-select v-model="form.timeType">
            <el-option label="申请时间" value="0" />
            <el-option label="审核时间" v-if="form.checkStatus==2" value="1" />
          </el-select>
          <el-date-picker style="width:350px" value-format="YYYY-MM-DD" v-model="form.startTime_endTime" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="搜索内容:">
          <div class="flex">
            <div>
              <el-select v-model="form.searchType">
                <el-option label="对账单号" :value="1" />
              </el-select>
            </div>
            <el-input v-model="form.searchText" placeholder="多个对账单号用逗号隔开" clearable style="width:318px"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="结算方式:">
          <el-select v-model="form.settlementValue" clearable>
            <el-option v-for="item in settlement" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:" style="margin-left:-16px">
          <el-cascader :options="supplierList" v-model="supplier" @change="cascaderChange" clearable filterable collapse-tags :props="cascaderProps" style="width:260px">
          </el-cascader>
        </el-form-item>
        <el-form-item label="申请人:">
          <el-select v-model="form.applyUserIds" clearable filterable multiple collapse-tags collapse-tags-tooltip style="width:200px">
            <el-option v-for="item in applySelectList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核结果:" v-if="form.checkStatus == 2" style="margin-left:-16px">
          <el-select v-model="form.checkResult" clearable filterable>
            <el-option label="已对账" :value="0" />
            <el-option label="已打回" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="审批人:" v-if="form.checkStatus == 2">
          <el-select v-model="form.checkUserIds" clearable filterable multiple collapse-tags collapse-tags-tooltip style="width:200px">
            <el-option v-for="item in checkUserList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="no-bgc">
      <erpSort :options="filterSort" :defaultSort="form.checkStatus==1?defaultSort:defaultSort1" @sort="sort" />
      <div class="btn">
        <div class="flex space-bt">
          <div v-if="form.checkStatus==1">
            <el-button v-permission="'statementApproval_ completeReconciliation:btn'" type="primary" size="default" @click="completeReconciliation">完成对账</el-button>
            <el-button v-permission="'statementApproval_ refuseReconciliation:btn'" type="primary" size="default" @click="rejectReconciliation">拒绝对账</el-button>
          </div>
          <div v-else>
            <!-- <el-button type="primary" size="default" @click="print">打印</el-button> -->
          </div>
          <div>
            <el-button v-permission="'statementApproval_ export:btn'" type="primary" @click="openExport">导出</el-button>
          </div>
        </div>
      </div>
      <exportDialog v-if="showExport" @close="showExport = false" :seachParams="form" :selectList="serialNumberList" />
    </div>
    <div class="table-container">
      <el-table :data="tableList" ref="tableRef" tooltip-effect v-loading="loading" @selection-change="handleSelectionChange" :key="form.checkStatus" default-expand-all row-key="serialNumber">
        <el-table-column type="expand" v-if="form.checkStatus == '2'" width="1">
          <template #default="{row}">
            <p class="expand-content" v-if="row.content!=null">{{row.content}}</p>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="50px" align="center"></el-table-column>
        <el-table-column prop="serialNumber" label="对账单号" width="180" align="center"> </el-table-column>
        <el-table-column prop="supplierName" show-overflow-tooltip label="供应商" align="center"></el-table-column>
        <el-table-column prop="settlementTypeName" label="结算方式" width="150" align="center">
          <template #default="{row}">
            <span v-if="row.settlementType==2">账期({{row.settlementValue}}天)</span>
            <span v-else>{{settlementTypeValue[row.settlementType] }}{{row.settlementValue}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseQuantity" label="采购单数" align="center"></el-table-column>
        <el-table-column prop="putInStorageQuantity" label="入库单数" align="center"></el-table-column>
        <el-table-column prop="skuQuantity" label="SKU种类" align="center"></el-table-column>
        <el-table-column prop="goodsQuantity" label="对账商品数" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="对账金额" align="center">
          <template #default="{row}">&yen;{{row.totalAmount}}</template>
        </el-table-column>
        <el-table-column prop="applicationTime" label="申请时间" width="180" align="center">
          <template #default="scope">
            <div :class="form.checkStatus != '2'&&!timeLimt(scope.row.applicationTime) ? 'red-color' : ''">
              {{ scope.row.applicationTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" label="申请人" align="center"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="180" align="center" v-if="form.checkStatus == '2'"></el-table-column>
        <el-table-column prop="auditName" label="审核人" align="center" v-if="form.checkStatus == '2'"></el-table-column>
        <el-table-column label="审核结果" align="center" v-if="form.checkStatus == '2'">
          <template #default="{row}">
            <span>{{row.auditStatus == 1?'已对账':(row.auditStatus == 0?'已打回':'')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="80px">
          <template #default="{row}">
            <el-button type="text" @click="goDetail(row.id,form.checkStatus)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <erp-page ref="erpPage" :total="total" @update-data="updateData" :count="serialNumberList.length"></erp-page>
    </div>
  </div>

</template>

<script>
import { onMounted, reactive, toRefs, ref, computed, watch, onActivated } from 'vue'
import erpPage from '@/components/erpPage/index.vue'
import { settlement, cascaderProps, sortOptions } from './composables/options.js'
import { verifyCheckUser, verifyApplyUser } from './composables/api.js'
import { getTree } from '@/api/purchase/outOfStock.js'
import erpSort from '@/components/erpSort/index.vue'
import exportDialog from './components/export.vue'
import { verifyCheckPageQuery, verifyCheckComplate, verifyCheckRefuse } from '@/api/financial'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { orderIndexParmas } from '@/utils/tool.js'
import moment from 'moment'
import { timeLimt } from '../paymentApproval/composables/tool.js'
export default {
  components: { erpPage, erpSort, exportDialog },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const erpPage = ref(null)
    let state = reactive({
      form: {
        checkStatus: "1", // 审核状态 1待审核 2已审核
        timeType: "0", // 时间类型 0申请时间 1创建时间
        startTime_endTime: [], // 开始结束时间
        searchType: 1,
        searchText: null,
        settlementValue: null, // 结算值（金额/到账日期）,结算方式为账期时必填
        supplierIdList: [], // 供应商id
        applyUserIds: [], // 申请人
        checkResult: null, //1 已通过 0 已打回
        checkUserIds: [], // 审核人id
        sortType: 'asc',
        sortName: 'a.application_time', // 排序字段 1申请时间 2对账金额 3审核时间
        page: { pageNo: 1, pageSize: 10 }
      },
      settlementTypeValue: { "1": '预付', "3": "货到付款", "4": "款到发货" },
      total: 0,
      supplierList: [],
      applySelectList: [], // 申请人
      checkUserList: [], // 审批人
      supplier: [],
      tableList: [],
      loading: false,
      serialNumberList: [],
      defaultSort: { value: 'a.application_time', type: 'asc' },
      defaultSort1: { value: 'a.application_time', type: 'desc' },
      copyForm: {} // 重置所需条件
    })
    onMounted(() => {
      state.copyForm = Object.assign({}, state.form)
      // 首页跳转-待审核
      if (route.params.types) {
        state.form.checkStatus = '1'
        if (route.params.types == 'history') {
          state.form.startTime_endTime = ['2000-01-01', moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')]
        } else {
          state.form.startTime_endTime = orderIndexParmas[parseInt(1)]
        }
      }
      // 首页跳转-已审核
      if (route.params.checkStatus == 2) {
        state.form.checkStatus = '2'
        state.form.timeType = '1'
        state.form.startTime_endTime = orderIndexParmas[parseInt(route.params.startTime_endTime)]
        if (route.params.checkResult) {
          state.form.checkResult = parseInt(route.params.checkResult)
        }
      }
      if (route.params.type == 2) {
        state.form.checkStatus = "2"
      }
      getTree().then(res => {
        state.supplierList = res.data
      })

      verifyCheckUser().then(res => {
        state.checkUserList = res.data
      })
      getApplyUser()
      search()
    })

    watch(() => state.form.checkStatus, (val) => {
      val == 1 && (state.copyForm.timeType = state.form.timeType = "0")
      state.copyForm.sortType = val == 2 ? "desc" : 'asc'
      getApplyUser()
      search()
    })

    const filterSort = computed(() => { // 待审核没有审核时间的排序
      return state.form.checkStatus == 1 ? sortOptions.filter(item => item.value != 'a.audit_time') : sortOptions
    })

    function getApplyUser() {
      verifyApplyUser({ status: state.form.checkStatus }).then(res => {
        state.applySelectList = res.data
      })
    }

    function cascaderChange(list) {
      // 存储不同的供应商id,不要最外层的id
      state.form.supplierIdList = list.map(item => item[1])
    }
    let applyIds = []
    function handleSelectionChange(list) {
      state.serialNumberList = list.map(item => item.serialNumber)
      applyIds = list.map(item => item.id)
    }
    function sort(value, sortType) {
      state.form.sortName = value
      state.form.sortType = sortType
      search()
    }

    function search() {
      state.loading = true

      verifyCheckPageQuery(state.form).then(res => {
        state.tableList = res.data.dataList
        state.total = res.data.page.totalCount
        state.loading = false
      })
    }
    function updateData(page) {
      state.form.page = page
      search()
    }

    function completeReconciliation() { // 完成对账
      if (applyIds.length < 1) return ElMessage({ message: '请选择对账单.', type: 'error' })
      verifyCheckComplate({ applyIds }).then(_ => {
        search()
        ElMessage.success('操作成功')
      })
    }

    function rejectReconciliation() { // 拒绝对账
      if (applyIds.length < 1) return ElMessage({ message: '请选择对账单.', type: 'error' })
      ElMessageBox.prompt('* 拒绝原因', '拒绝对账', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '请输入拒绝原因',
        inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
          if (!value) {
            return '请输入拒绝原因'
          }
          if (value.length > 50) {
            return '长度不超过50个字符'
          }
        }
      }).then(({ value }) => {
        verifyCheckRefuse({ applyIds, reason: value.trim() }).then(_ => {
          search()
          ElMessage.success('操作成功')
        })
      })

    }

    function print() { // 打印
      console.log('打印')
    }

    function reset() { // 重置
      console.log(state.copyForm)
      // 重置分页器
      state.copyForm.checkStatus = state.form.checkStatus
      state.copyForm.sortType = state.form.checkStatus == 2 ? 'desc' : 'asc'
      state.supplier = applyIds = state.serialNumberList = []
      state.form = Object.assign({}, state.copyForm)
      erpPage.value.handleSizeChange(10)
    }

    let showExport = ref(false)
    function openExport() {
      showExport.value = true
    }
    function goDetail(id, status) {
      router.push({
        name: 'statementDetail',
        query: { id, status }
      })
    }

    return {
      updateData,
      ...toRefs(state),
      settlement,
      cascaderProps,
      filterSort,
      cascaderChange,
      sort,
      search,
      completeReconciliation,
      rejectReconciliation,
      print,
      openExport,
      showExport,
      handleSelectionChange,
      goDetail,
      reset,
      erpPage,
      timeLimt
    }
  }

}
</script>

<style lang="scss" scoped>
.statement-approval {
  :deep(.el-tabs__item) {
    padding-left: 20px !important;
  }
}
.table-container {
  margin-top: 20px;
  padding: 12px;
  background-color: #fff;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}
.form-and-btn-container {
  padding: 0 20px;
  background-color: #fff;
}

.flex {
  display: flex;
}
.head {
  background-color: #fff;
}
.space-bt {
  justify-content: space-between;
}
.space-end {
  justify-content: end;
}

.red-color {
  color: #f56c6c;
}

.expand-content {
  padding: 10px 20px;
  border-bottom: var(--el-table-border);
  background-color: #fafafa;
}

:deep(.el-select) {
  width: 140px;
  margin-right: 16px;
}
:deep(.erp-sort-line) {
  padding: 10px 0;
}

:deep(.el-tag__content) {
  max-width: 200px;
}
:deep(.el-table__expand-icon) {
  display: none;
}
.statement-approval :deep(.el-table__expanded-cell) {
  padding: 0;
  border-bottom: none;
}
:deep(.el-cascader__search-input) {
  margin-left: 12px;
  opacity: 0;
}
</style>
