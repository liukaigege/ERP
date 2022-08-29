<template>
  <div>
    <div class="heard">
      <el-button @click="syncDisputeFun" class="syncDispute" type="primary"
        >同步纠纷</el-button
      >
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`需要回复（${num}）`" name="first"></el-tab-pane>
      </el-tabs>
      <div class="form">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          @keyup.enter="submitForm"
        >
          <div>
            <el-form-item label="时间类型：">
              <el-select v-model="form.dateType" clearable style="width: 140px">
                <el-option label="创建时间" value="01"></el-option>
                <el-option label="到期时间" value="02"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                clearable
                class="daterange"
                unlink-panels
                style="width: 256px"
                v-model="form.startDate_endDate"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabledDate="disabledDate"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Paypal：">
              <el-select v-model="form.paypal" clearable style="width: 140px">
                <el-option
                  v-for="(item, index) in paypalList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="searchBtn">
            <div>
              <el-form-item label="搜索内容：">
                <el-select
                  v-model="form.queryType"
                  clearable
                  style="width: 140px"
                >
                  <el-option label="事情编号" :value="1"></el-option>
                  <el-option label="交易号" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.queryContent"
                  clearable
                  placeholder="请输入搜索内容"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="纠纷原因：">
                <el-select
                  v-model="form.caseReason"
                  clearable
                  style="width: 140px"
                >
                  <el-option
                    v-for="(item, index) in caseReason"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="纠纷状态：">
                <el-select
                  v-model="form.caseStatusEnum"
                  clearable
                  style="width: 140px"
                >
                  <el-option
                    v-for="(item, index) in caseType"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="btn">
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="sortContainer">
      <ErpSort
        :options="sortCondition"
        :defaultSort="defaultSort"
        @sort="sortFn"
      />
      <el-button @click="importInfo" class="importInfo" type="primary"
        >导出</el-button
      >
    </div>
    <div class="table">
      <el-table
        :data="data"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="事件编号" align="center">
          <template #default="{ row }">
            <p class="event-no">{{ row.caseId }}</p>
            <p class="event-name">{{ row.paypalAccount }}</p>
            <p class="event-name">「{{ row.paypalName }}」</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="disputeAmt"
          label="订单金额（USD）"
          align="center"
        />
        <el-table-column prop="caseReason" label="原因" align="center" />
        <el-table-column prop="caseStatus" label="纠纷状态" align="center" />
        <el-table-column
          prop="sellerTransactionId"
          label="交易号"
          align="center"
        />
        <el-table-column prop="invoiceId" label="订单号" align="center" />
        <el-table-column label="时间" align="center" width="200"
          ><template #default="{ row }">
            <p>创建：{{ row.caseOpenDate?.substr(0, 16) }}</p>
            <p>更新：{{ row.caseLastUpdateDate?.substr(0, 16) }}</p>
            <p style="color: #fd4c60" v-if="row.remainTime">
              剩余回复：{{ row.remainTime }}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ErpPage
      ref="erpPage"
      :count="selectCount"
      :total="totalCount"
      @updateData="updateData"
    />
    <ExportInfo
      v-if="isshow"
      @close="dialogClose"
      :form="form"
      :selectIdArr="selectIdArr"
      :isResolved="isResolved"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import ErpPage from '@/components/erpPage/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import { caseType, caseReason, disabledDate } from '../composables/option.js'
import {
  saveDispute,
  queryForPaypal,
  tradestateunsolve,
  exportInfo,
  unsolvecount
} from '../composables/api.js'
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  computed
} from 'vue'
import moment from 'moment'
import ExportInfo from '../components/exportInfo.vue'
// 排序条件
const sortCondition = [
  {
    value: 'pc.case_open_date',
    label: '创建时间'
  },
  {
    value: 'pc.seller_response_due_date',
    label: '剩余回复时间'
  }
]
const defaultSort = { value: 'pc.case_open_date', type: 'desc' }
const state = reactive({
  form: {
    dateType: '',
    startDate_endDate: [
      moment(moment().subtract(30, 'days').calendar()).format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    ],
    paypal: '',
    queryContent: '',
    caseReason: '',
    caseStatusEnum: '',
    queryType: '',
    sortName: 'pc.case_open_date',
    sortType: 'asc',
    page: {
      pageNo: 1,
      pageSize: 10
    }
  },
  data: [],
  selectCount: 0,
  selectIdArr: [],
  activeName: 'first',
  num: 0,
  paypalList: [],
  totalCount: 0,
  isshow: false,
  isResolved: 2
})
const importInfo = () => {
  state.isshow = true
}
function sortFn(val, type) {
  state.form.sortName = val
  state.form.sortType = type
  init()
}
const resetForm = () => {
  state.form.dateType = ''
  state.form.startDate_endDate = [
    moment(moment().subtract(30, 'days').calendar()).format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]
  state.form.paypal = ''
  state.form.queryContent = ''
  state.form.caseReason = ''
  state.form.caseStatusEnum = ''
  state.form.queryType = ''
  state.form.sortName = 'pc.case_open_date'
  state.form.sortType = 'asc'
  state.form.page.pageNo = 1
  state.form.page.pageSize = 10
  init()
}
const submitForm = () => {
  init()
}
const syncDisputeFun = () => {
  saveDispute().then(res => {
    if (res.code == 200) {
      init()
      unsolvecountFun()
    } else {
      ElMessage.error(res.message)
    }
  })
}
const handleSelectionChange = val => {
  state.selectCount = val.length
  state.selectIdArr = []
  val?.forEach(element => {
    state.selectIdArr.push(element.id)
  })
}
const init = () => {
  tradestateunsolve(state.form).then(res => {
    if (res.code == 200) {
      state.data = res.data.dataList
      state.totalCount = res.data.page.totalCount
    } else {
      ElMessage.error(res.message)
    }
  })
}
function unsolvecountFun() {
  unsolvecount().then(res => {
    if (res.code == 200) {
      state.num = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}
const queryPaypal = () => {
  queryForPaypal().then(res => {
    if (res.code == 200) {
      state.paypalList = res.data
    }
  })
}
function updateData(v) {
  state.form.page = v
  init()
}
function dialogClose() {
  state.isshow = false
}
onMounted(() => {
  queryPaypal()
  init()
  unsolvecountFun()
})
const {
  form,
  activeName,
  num,
  selectCount,
  paypalList,
  data,
  totalCount,
  selectIdArr,
  isshow,
  isResolved
} = toRefs(state)
</script>

<style lang="scss" scoped>
.searchBtn {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.heard {
  padding: 10px 30px 0 30px;
  background: #fff;
  position: relative;
  .syncDispute {
    position: absolute;
    top: 8px;
    right: 30px;
    cursor: pointer;
    z-index: 10;
  }
}
.sortContainer {
  background-color: #f9f9fb;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.event-no {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  text-align: left;
}
.event-name {
  color: rgba(0, 0, 0, 0.45);
  text-align: left;
}
.table {
  background: #fff;
  padding: 24px 30px;
}
:deep(.el-form--inline .el-form-item) {
  margin-bottom: 16px;
}
:deep(.el-tabs__header) {
  margin-bottom: 16px;
}
:deep(.el-date-editor .el-range-separator) {
  width: 24px;
}
:deep(.el-form-item__label) {
  padding: 0;
}
</style>