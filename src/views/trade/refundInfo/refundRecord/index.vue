<!--
* @Descripttion: Vango ERP refundInfo refundRecord
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-form
      :model="searchInfos"
      class="demo-form-inline demo-ruleForm headerForm"
      :inline="true"
    >
      <el-form-item label="时间范围：">
        <el-select
          v-model="searchInfos.timeType"
          placeholder="请选择"
          class="width140"
        >
          <el-option
            v-for="item in defaultData.timeTypeList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="searchInfos.queryTimeStart_queryTimeEnd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          unlink-panels
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="退款原因：">
        <el-cascader
          v-model="reasonIds"
          :options="reasonList"
					clearable
          :props="{
            value: 'id',
            label: 'name',
            children: 'children',
						checkStrictly: true
          }"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="责任方：">
        <el-select
          v-model="searchInfos.refundDuty"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in refundDutyList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          v-model="searchInfos.refundState"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in defaultData.statusData"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索内容：">
        <el-select
          v-model="searchInfos.serachType"
          placeholder="请选择"
          class="width140"
        >
          <el-option
            v-for="item in defaultData.serachTypeList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          style="width: 350px"
          v-model="searchInfos.serachValue"
          :placeholder="
            searchInfos.serachType == 1 || searchInfos.serachType == 5
              ? '请输入要检索的内容'
              : '请输入要检索的内容，多条可用逗号或空格隔开'
          "
          clearable
          @keyup.enter="queryListFn"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryListFn">查询</el-button>
        <el-button @click="initFn">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btnContainer">
      <el-button type="primary" @click="() => (exportModalsShow = true)"
        >导出</el-button
      >
    </div>
    <div class="tableContainer">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="订单号/交易号" align="center" width="200">
          <template #default="scope">
            <div>
              <p v-if="scope.row.orderId">{{ scope.row.orderId }}</p>
              <p v-if="scope.row.transcationId">
                ({{ scope.row.transcationId }})
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="210">
          <template #default="scope">
            <div>
              <p v-if="scope.row.offerTime">支付：{{ scope.row.offerTime }}</p>
              <p v-if="scope.row.refundTime">
                退款：{{ scope.row.refundTime }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="退款原因" align="center" width="200">
          <template #default="scope">
            <div>
              <p v-if="scope.row.oneReasonWord">
                {{ scope.row.oneReasonWord }}
              </p>
              <p v-if="scope.row.twoReasonWord">
                {{ scope.row.twoReasonWord }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="退款金额"
          align="center"
          width="130"
        >
          <template #default="scope">
            <div>
              {{ scope.row.payCurrency }}
              {{ (scope.row.amount - 0).toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundAccount"
          label="退款账号"
          align="center"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="userEmail"
          label="客户邮箱"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="refundDuty"
          label="责任方"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column label="状态" align="center" width="130">
          <template #default="scope">
            <div>
              <p v-if="scope.row.refundState !== null">
                {{ scope.row.refundState == 1 ? '失败' : '成功' }}
              </p>
              <p
                v-if="scope.row.refundStateInfo"
                :title="scope.row.refundStateInfo"
                class="two_line"
              >
                {{ scope.row.refundStateInfo }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="opertionMan"
          label="操作人"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="操作"
          align="center"
          width="100"
        >
          <template #default="scope">
            <el-button type="text" @click="queryDetail(scope.row.refundId)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ErpPage
      ref="erpPage"
      :total="totalCount"
      :count="checkedList.length || 0"
      @updateData="erpPageBack"
      :pageSizes="[100, 200, 300, 400, 1000]"
    />
    <QureyDetail
      v-if="detailShow"
      :refundId="refundId"
      @closeBack="detailBack"
    />
    <ExportModal
      v-if="exportModalsShow"
      :searchInfos="searchInfos"
      :selectData="checkedList"
      @closeBack="exportBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs, ref } from 'vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import ErpPage from '@/components/erpPage/index.vue'
import QureyDetail from './components/qureyDetail.vue'
import ExportModal from './components/exportModals.vue'
import { deepCopy } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import {
  listRefundDuty,
  getIvtRefundReasons,
  queryList
} from './composables/api'
import { searchData, defaultData } from './composables/data'
export default {
  name: 'RefundRecord',
  components: {
    ElSelectTree,
    QureyDetail,
    ExportModal,
    ErpPage
  },
  setup() {
    // const ElSelectTreeRef = ref(null)
    const erpPage = ref(null)
    const state = reactive({
      searchInfos: deepCopy(searchData), //搜索条件
      reasonList: [], //原因选择列表数组
      tableData: [], //表单数据list数组
      totalCount: 100, //退款总条数
      refundDutyList: [], //责任方列表
      detailShow: false,
      refundId: '',
      checkedList: [], //已选列表
      exportModalsShow: false,
      reasonIds: null
    })

    // 获取责任人数组
    listRefundDuty({}).then(res => {
      state.refundDutyList = res.data
    })

    //获取原因列表数组
    getIvtRefundReasons({}).then(res => {
      state.reasonList = res.data
    })


    // 表单选项选择
    function handleSelectionChange(val) {
      state.checkedList = val.map(v => v.refundId)
    }

    // 查询列表数据
    queryListFn()
    function queryListFn() {
      queryList(state.searchInfos).then(res => {
        state.tableData = res.data.dataList
        state.totalCount = res.data.page.totalCount
      })
    }

    // 分页返回
    function erpPageBack(val) {
      state.searchInfos.page = val
      queryListFn()
    }

    // 查看详情
    function queryDetail(id) {
      state.refundId = id
      state.detailShow = true
    }

    // 重置搜索条件
    function initFn() {
      // 重置搜索条件
      state.searchInfos = deepCopy(searchData)
			state.searchInfos.reasonId = null
			state.searchInfos.reasonIds = null
			state.reasonIds = null
      // 重置分页器
      erpPage.value.handleSizeChange(100)
      erpPage.value.handleCurrentChange(1)
    }

    function exportBack(val) {
      state.exportModalsShow = false
    }

    function detailBack(val) {
      state.detailShow = false
    }

    function handleChange(val) {
      state.searchInfos.reasonId = state.reasonIds
        ? state.reasonIds[state.reasonIds?.length - 1]
        : null
    }
    return {
      ...toRefs(state),
      initFn,
      erpPageBack,
      handleChange,
      defaultData,
      queryListFn,
      queryDetail,
      exportBack,
      detailBack,
      erpPage,
      handleSelectionChange
    }
  }
}
</script>
<style lang='scss' scoped>
.width140 {
  width: 140px;
  margin-right: 5px;
}
.headerForm {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0 20px;
}
.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}
.btnContainer {
  text-align: right;
  padding: 30px;
}
.two_line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
