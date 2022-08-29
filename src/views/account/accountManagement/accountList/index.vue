<!--
* @Descripttion: Vango ERP /account/accountManagement/index 账号管理
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div class="searchHeader">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="PayPal" name="first"></el-tab-pane>
        <!-- <el-tab-pane label="信用卡" name="second"></el-tab-pane>
        <el-tab-pane label="Alipay" name="third"></el-tab-pane>
        <el-tab-pane label="Payssion" name="fourth"></el-tab-pane> -->
      </el-tabs>
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        style="margin-left: 20px"
        @keyup.enter="searchFn"
      >
        <el-form-item label="搜索内容：">
          <el-input
            v-model="form.name"
            placeholder="请输入贝宝名称/编号/账号名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="授权：">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option label="未授权" :value="0"></el-option>
            <el-option label="已授权" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="form.accountStatus"
            placeholder="请选择"
            clearable
          >
            <el-option label="正常" :value="0"></el-option>
            <el-option label="永久封禁" :value="-1"></el-option>
            <el-option label="限制收款" :value="1"></el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 20px" @click="searchFn"
            >查询</el-button
          >
          <el-button @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        class="addBtns"
        @click="addAccount(null)"
        v-if="authPath('edit_account:btn')"
        >新增账号</el-button
      >
    </div>
    <div class="btnsContainer">
      <el-button
        type="primary"
        @click="changeFee"
        v-if="authPath('modification_fee:btn')"
        >修改手续费</el-button
      >
      <el-button
        type="primary"
        @click="createReport(false)"
        v-if="authPath('create_report:btn')"
        >导出报告</el-button
      >
      <el-button
        type="primary"
        @click="exportModelFn"
        v-if="authPath('export_transaction_amount:btn')"
        >导出交易金额</el-button
      >
    </div>
    <div class="tableContainer">
      <el-table
        :data="tableData.dataList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="70" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="贝宝名称"
          align="center"
          show-overflow-tooltip
          min-width="300"
        >
        </el-table-column>
        <el-table-column prop="number" label="贝宝编号" align="center">
        </el-table-column>
        <el-table-column label="账号名称" align="center" min-width="350">
          <template #default="scope">
            <div
                class="paypalTitle"
                v-for="item in scope.row.accountList"
                :key="item.tempId"
                :title="item.value"
              >
                {{ item.value }}
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" align="center" width="120">
          <template #default="scope">
            <div>{{ scope.row.fee }}%</div>
          </template>
        </el-table-column>
        <el-table-column label="授权" align="center" width="120">
          <template #default="scope">
            <div>
              {{ scope.row.status == 1 ? '已授权' : '未授权' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="120">
          <template #default="scope">
            <div>
              <span v-if="scope.row.accountStatus == 0">正常</span>
              <span
                v-else-if="scope.row.accountStatus == 1"
                :style="{ color: '#F7B500' }"
                >限制收款</span
              >
              <span v-else :style="{ color: '#F7B500' }">永久封禁</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300"
          v-if="
            authPath('delete_account:btn') ||
            authPath('create_report:btn') ||
            authPath('authorization_account:btn') ||
            authPath('edit_account:btn')
          "
        >
          <template #default="scope">
            <div>
              <el-button
                type="text"
                @click="addAccount(scope.row)"
                v-if="authPath('edit_account:btn')"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="authorizationFn(scope.row)"
                v-if="authPath('authorization_account:btn')"
                >授权</el-button
              >
              <el-button
                type="text"
                @click="createReport(scope.row)"
                v-if="authPath('create_report:btn')"
                >导出报告</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表单分页 -->
    <ErpPage
      :total="tableData.page.totalCount"
      :count="selectedList.length"
      ref="erpPage"
      @updateData="erpPageBack"
    />
    <!-- 账号授权 -->
    <Authorization
      v-if="authorizationShow"
      :operationSingle="operationSingle"
      @authorizationBack="authorizationBack"
    />
    <!-- 新增账号 -->
    <AddAccount
      v-if="addAccountShow"
      :operationData="operationSingle"
      @addAccountBack="addAccountBack"
    />
    <!-- 选择导出格式 -->
    <ExportModel
      v-if="exportModelShow"
      :list="selectedList"
      @exportModelBack="exportModelBack"
    />
    <!-- 修改手续费 -->
    <ChangeFee
      v-if="changeFeeShow"
      :list="selectedList"
      @changeFeeBack="changeFeeBack"
    />
    <!-- 导出报告 -->
    <CreateReport
      v-if="createReportShow"
      :list="operationList"
      @createReportBack="createReportBack"
    />
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import ErpPage from '@/components/erpPage/index.vue'
import Authorization from './components/authorization.vue'
import AddAccount from './components/addAccount.vue'
import ExportModel from './components/exportModel.vue'
import ChangeFee from './components/changeFee.vue'
import CreateReport from './components/createReport.vue'
import { queryData } from './composables/data'
import { queryList, delAccount } from './composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepCopy } from '@/utils/tool'
import { isObjectValueEqual } from '../../../../utils/tool'
import { authPath } from '@/utils/hooks'
export default {
  components: {
    ErpPage,
    Authorization,
    AddAccount,
    ExportModel,
    ChangeFee,
    CreateReport
  },
  setup() {
    const erpPage = ref(null)
    const state = reactive({
      activeName: 'first',
      form: deepCopy(queryData),
      tableData: {
        accountList: [],
        page: {
          totalCount: 0
        }
      },
      authorizationShow: false,
      selectedList: [], //表单选择数据
      addAccountShow: false,
      exportModelShow: false,
      changeFeeShow: false,
      createReportShow: false,
      operationSingle: null, //操作单条数据
      operationList: []
    })
    // 查询账户列表信息
    queryAccountList()

    function queryAccountList() {
      queryList(state.form).then(res => {
        if (res.code == 200) {
          res.data.dataList.map(item => {
            if ([null, ''].includes(item.number)) item.number = undefined
            else item.number = +item.number
            item.accountList =
              item.accountList?.map(value => {
                return {
                  value,
                  isAdd: false,
                  tempId: Math.random()
                }
              }) || []
          })
          state.tableData = res.data
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    // 切换tab==>本期不做切换
    function handleClick(val) {
      state.activeName = val.props.name
    }

    // 点击查询按钮
    function searchFn() {
      erpPage.value.handleCurrentChange(1)
    }

    // 点击重置
    function resetFn() {
      state.form = deepCopy(queryData)
      erpPage.value.handleSizeChange(10)
    }

    // 分页返回值
    function erpPageBack(val) {
      state.form.page = val
      queryAccountList()
    }

    // 表单选择
    function handleSelectionChange(val) {
      state.selectedList = val
    }

    // 账号授权 返回
    function authorizationFn(val) {
      state.operationSingle = val
      state.authorizationShow = true
    }

    function authorizationBack(val) {
      if (val) queryAccountList()
      state.authorizationShow = false
      state.operationSingle = null
    }

    // 新增账号
    function addAccount(val) {
      // if (val)
      //   val.accountList =
      //     val.accountList?.map(value => {
      //       return {
      //         value,
      //         isAdd: false
      //       }
      //     }) || []

      state.operationSingle = val
      state.addAccountShow = true
    }

    // 新增账号 返回
    function addAccountBack(val) {
      if (val) queryAccountList()
      state.addAccountShow = false
      state.operationSingle = null
    }

    // 选择导出格式
    function exportModelFn() {
      if (state.selectedList.length) {
        state.exportModelShow = true
      } else {
        ElMessage.warning({ message: '请选择账号' })
      }
    }

    function exportModelBack(val) {
      if (val) {
        queryAccountList()
        state.selectedList = []
      }
      state.exportModelShow = false
    }

    // 修改手续费
    function changeFee() {
      if (state.selectedList.length) {
        state.changeFeeShow = true
      } else {
        ElMessage.warning({ message: '请选择账号' })
      }
    }

    function changeFeeBack(val) {
      if (val) {
        queryAccountList()
        state.selectedList = []
      }
      state.changeFeeShow = false
    }

    // 导出报告
    function createReport(val) {
      if (val) {
        // 单条操作
        state.operationList = [val]
        state.createReportShow = true
      } else {
        // 批量操作
        if (state.selectedList.length) {
          state.operationList = deepCopy(state.selectedList)
          state.createReportShow = true
        } else {
          ElMessage.warning({ message: '请选择账号' })
        }
      }
    }

    function createReportBack(val) {
      if (val) {
        queryAccountList()
        state.selectedList = []
      }
      state.createReportShow = false
    }

    // 删除账号
    function deleteFn(id) {
      ElMessageBox.confirm('是否确定删除当前账户？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        delAccount({ id }).then(res => {
          if (res.code == 200) {
            ElMessage.warning({ message: '删除成功' })
            queryAccountList()
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      })
    }

    return {
      ...toRefs(state),
      handleClick,
      erpPageBack,
      handleSelectionChange,
      authorizationFn,
      authorizationBack,
      addAccount,
      addAccountBack,
      exportModelFn,
      exportModelBack,
      changeFee,
      changeFeeBack,
      createReport,
      createReportBack,
      queryAccountList,
      searchFn,
      resetFn,
      erpPage,
      deleteFn
    }
  }
}
</script>

<style lang="scss" scoped>
.searchHeader {
  background-color: #fff;
  position: relative;

  .addBtns {
    position: absolute;
    right: 20px;
    top: 10px;
  }
}

.btnsContainer {
  padding: 20px 0;
}

.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}

:deep(.el-tabs__nav-scroll) {
  box-sizing: border-box;
  padding: 0 20px;
}

:deep(.el-form-item__label) {
  padding: 0;
}

:deep(.el-tabs__item) {
  height: 54px;
  line-height: 54px;
}
.paypalTitle {
  height: 23px;
  line-height: 23px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
</style>
