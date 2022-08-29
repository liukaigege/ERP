<template>
  <div class="headWarehouseInventory">
    <div v-if="!createInventory">
      <AffixTab>
        <template v-slot:tabSlot>
          <el-button :type="combineType==0?'primary':'default'" class="btn" @click="tabSelectEvent(0)">
            待盘点
          </el-button>
          <el-button :type="combineType==1?'primary':'default'" class="btn" @click="tabSelectEvent(1)">
            盘点中
          </el-button>
          <!-- 审核 -->
          <div class="tab_left_box">
            <p class="title">审核</p>
            <div class="btn">
              <el-button :type="combineType==2?'primary':'default'" @click="tabSelectEvent(2)">
                待审批
              </el-button>
              <el-button style="margin-left:20px" :type="combineType==3?'primary':'default'" @click="tabSelectEvent(3)">
                未通过
              </el-button>
            </div>
          </div>
          <!-- 已完成 -->
          <el-button :type="combineType==4?'primary':'default'" class="btn" @click="tabSelectEvent(4)">
            已完成
          </el-button>
        </template>
      </AffixTab>
      <!-- form表单 -->
      <div class="formClass">
        <el-form :model="form" :inline="true" ref="formRef">
          <el-form-item label="仓库名称:">
            <el-select v-model="form.warehouseId" style="width:140px">
              <el-option label="万众智谷仓库" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间:" style="margin-left:8px">
            <el-date-picker v-model="form.createTimeStart_createTimeEnd" clearable type="daterange" unlink-panels style="width: 260px;" range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="盘点类型:" style="margin-left:8px">
            <el-select v-model="form.type" style="width:140px" clearable>
              <el-option label="整仓盘点" value="1"></el-option>
              <el-option label="按商品SKU盘点" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="搜索内容:" style="margin-left:8px">
            <el-select v-model="form.searchType" style="width:140px;" clearable @clear="form.searchType=1">
              <el-option label="任务编号" :value="1"></el-option>
              <el-option label="商品SKU" :value="2"></el-option>
              <el-option label="商品SKU ID" :value="3"></el-option>
              <el-option label="商品名称" :value="4"></el-option>
            </el-select>
            <el-input v-model="form.searchText" clearable style="width:318px;margin-left:16px" placeholder="请输入要检索的内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left:16px" @click="searchList">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 排序 -->
      <div class="mt-16">
        <ErpSort :options="[{label:'创建时间',value:'create_time'}]" :defaultSort="form.defaultSort" @sort="sortFn" />
      </div>
      <div class="buttonClass">
        <el-button v-permission="'printCount_sheet:btn'" type="primary" v-if="combineType==1" @click="printCount">打印盘点单</el-button>
        <div></div>
        <div>
          <el-button type="primary" v-if="combineType==0" @click="updateList">手动刷新</el-button>
          <el-button v-permission="'createCountingTask:btn'" type="primary" v-if="combineType==0" @click="createInventoryFn">创建盘点任务</el-button>
        </div>

      </div>
      <!-- 表格 -->
      <div class="tableClass">
        <vxe-table :data="tableData" highlight-hover-row auto-resize @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent">
          <vxe-column v-if="combineType==1" type="checkbox" width="55" align="center"></vxe-column>
          <vxe-column title="盘点编号" align="center" field="inventoryCheckNumber" :max-width="combineType==4?'110':'150px'">
            <template #default="{row}">
              <p>{{row.inventoryCheckNumber}}</p>
              <p>[{{row.warehouseName}}]</p>
            </template>
          </vxe-column>
          <vxe-column title="盘点进度(SKU数量)" align="center" field="alreadyCount" :width="combineType==4?'190':'200'">
            <template #default="{row}">
              <p>{{row.alreadyCount}}/{{row.skuCount}}</p>
            </template>
          </vxe-column>
          <vxe-column title="盘点类型" align="center" field="type" :width="combineType==4?'180':'200'">
            <template #default="{row}">
              <p>{{{"1":'整仓盘点',"2":'按商品SKU盘点'}[row.type]}}</p>
            </template>
					</vxe-column>
					<vxe-column title="盘点结果" v-if="combineType==4" align="center" field="addNum" width="210">
						<template #default="{row}">
							<p> <span style="margin-right:10px">盘盈数量：{{row.addNum}} </span> 状态：<span >{{row.addNum?{"0":'未处理',"1":'已入库'}[row.addStatus]:'-'}}</span></p>
							<p> <span style="margin-right:10px">盘亏数量：{{Math.abs(row.reduceNum)}}</span> 状态：<span >{{row.reduceNum?{"0":'未处理',"1":'已出库'}[row.reduceStatus]:'-'}}</span></p>
						</template>
					</vxe-column>
					<vxe-column title="时间" align="center"  field="createTime"  :width="combineType==4?'215':'250'">
						<template #default="{row}">
							<p>创建：{{row.createTime||'-'}}</p>
							<p v-if="combineType==4">结束：{{row.endTime||'-'}}</p>
							<p v-if="combineType==4"> 入库：{{row.addTime||'-'}}</p>
							<p v-if="combineType==4">出库：{{row.reduceTime||'-'}}</p>
						</template>
					</vxe-column>
					<vxe-column title="操作员" align="center"  field="createByName"  :width="combineType==3?'150':'200'">
						<template #default="{row}">
							<p>创建：{{row.createByName||'-'}}</p>
							<p v-if="combineType==3||combineType==4">审核：{{row.auditByName||'-'}}</p>
							<p v-if="combineType==4">入库：{{row.addByName||'-'}}</p>
							<p v-if="combineType==4">出库：{{row.reduceByName||'-'}}</p>
						</template>
					</vxe-column>
					<vxe-column v-if="combineType==3"  title="打回原因" align="center" field="rejectReason" width="200">
						<template #default="{row}">
							<p class="textClass" :title="row.rejectReason">{{row.rejectReason}}</p>
						</template>
					</vxe-column>
					<vxe-column title="操作" align="center"   :width="combineType==4?'220':'230'">
						<template #default="{row}">
							<el-button type="text" v-permission="'open_Task:btn'" v-if="combineType==0" @click="openTask(row)">开启任务</el-button>
							<el-button type="text" v-permission="'count_Edit:btn'"  v-if="combineType==0||combineType==3" :disabled="combineType==0&&row.type==1" @click="editInventory(row)">编辑</el-button>
							<el-button type="text" v-permission="'count_delete:btn'" style="color:#FD4C60" v-if="combineType==0" @click="deleteRows(row,'delete')">删除</el-button>
							<el-button type="text" v-permission="'Inventory:btn'" v-if="combineType==1" @click="editInventory(row)">盘点</el-button>
							<el-button type="text" v-permission="'cancel_Count:btn'" v-if="combineType==1||combineType==3" style="color:#FD4C60" @click="deleteRows(row,'cancel')">取消盘点</el-button>
							<el-button type="text" v-permission="'submit_Approval:btn'" v-if="combineType==1||combineType==3" @click="submitApproval(row,'approval')">提交审批</el-button>
							<el-button type="text" v-permission="'through_HSE:btn'" v-if="combineType==2" @click="submitApproval(row,'Approved')">通过审核</el-button>
							<el-button type="text" v-permission="'reject_review:btn'" v-if="combineType==2" @click="reject(row)">驳回审核</el-button>
							<!-- <el-button type="text" v-if="combineType==2" @click="editInventory(row)">查看详情</el-button> -->
							<el-button type="text" v-permission="'count_handle:btn'" :disabled="!!row.addStatus&&!!row.reduceStatus" v-if="combineType==4" @click="editInventory(row)">处理</el-button>
							<el-button type="text" v-permission="'look_Detail:btn'" v-if="combineType==2||combineType==4" @click="editInventory(row,1)">查看详情</el-button>
						</template>
					</vxe-column>
				</vxe-table>
			</div>
			<!-- 分页 -->
			<div class="flex-pagination page-fixed">
				<div style="position: relative;">
				</div>
				<div>
					<el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
					</el-pagination>
				</div>
			</div>
		</div>
		<div v-if="createInventory">
			<InventoryEdit :pageType="1" @editBack="inventoryEditBack" />
		</div>
		<RejectReview v-if="showReject" :row="row" @closeReject="closeReject" />
	</div>
</template>

<script>
import RejectReview from './components/rejectReview.vue'
import AffixTab from '@/components/affixTab/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import InventoryEdit from './components/inventoryEdit.vue'
import { reactive, toRefs, ref, onMounted, onActivated } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { deepCopy } from 'tool'
import {
  getInventoryList,//列表
  deleteInfo,//删除
  startInfo,//开启任务
  printInfo,//打印盘点单
  getCountingOperation,//盘点基本操作
  updateStock,//手动刷新
} from './composables/api'
export default {
  name: 'WarehouseInventory',
  components: {
    AffixTab,
    ErpSort,
    InventoryEdit,
    RejectReview
  },
  setup() {
    const formRef = ref(null)
    const router = useRouter()
    const route = useRoute()
    const backType = route.params.backType ?? null
    const state = reactive({
      combineType: backType || 0,
      row: {},
      showReject: false,
      form: {
        warehouseId: 1,
        createTimeStart_createTimeEnd: [],
        type: '',
        searchType: 1,
        searchText: '',
        sortName: 'create_time',
        sortType: 'desc',
        defaultSort: {
          value: 'create_time',
          type: 'desc'
        }
      },
      page: {
        pageSize: 10, //分页
        pageNo: 1 //分页
      },
      paginationTotal: 0, //分页总数据条数
      paginationArr: [10, 20, 30, 50, 100], //分页每页选择条数默认数据
      tableData: [],
      selectList: [],
      createInventory: false
    })
    onMounted(() => {
      searchList()
    })
    onActivated(() => {
      searchList()
    })
    //刷新
    function updateList() {
      updateStock().then(res => {
        ElMessage.success('刷新成功')
      })
    }
    let copyForm = deepCopy(state.form)
    function searchList() {
      let data = {
        page: state.page,
        status: state.combineType
      }
      Object.assign(state.form, data)
      getInventoryList(state.form).then(res => {
        state.tableData = res.data.dataList
        state.paginationTotal = res.data.page.totalCount
      })
    }
    //创建盘点任务
    function createInventoryFn() {
      state.createInventory = true
    }

    function inventoryEditBack(val) {
      // val 为选择商品列表
      if (val) searchList()
      state.createInventory = false
    }
    //头部选择切换
    function tabSelectEvent(val) {
      state.combineType = val
      formRef.value.resetFields()
      state.form = deepCopy(copyForm)
      state.page.pageSize = 10
      state.page.pageNo = 1
      state.selectList = []
      searchList()
    }
    //排序
    function sortFn(val, type) {
      state.form.sortName = val
      state.form.sortType = type
      searchList()
    }
    //表格选择
    function selectChangeEvent({ checked, records }) {
      state.selectList = records
      console.log(records)
    }
    function selectAllEvent({ checked, records }) {
      state.selectList = records
      console.log(records)
    }
    //分页
    const handleSizeChange = val => {
      state.page.pageSize = val
      state.page.pageNo = 1
      searchList()
    }
    const handleCurrentChange = val => {
      state.page.pageNo = val
      searchList()
    }
    //重置
    function reset() {
      formRef.value.resetFields()
      state.form = deepCopy(copyForm)
      searchList()
    }
    //开启任务
    function openTask(row) {
      ElMessageBox.confirm('确定开启盘点任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        startInfo({ inventoryCheckNumber: row.inventoryCheckNumber }).then(res => {
          ElMessage.success('操作成功')
          searchList()
        })
      })
    }
    //删除、取消盘点
    function deleteRows(row, type) {
      ElMessageBox.confirm(type == "delete" ? '确定删除该盘点任务?' : "确定取消该盘点任务?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (type == "delete") {//删除盘点
          deleteInfo({ inventoryCheckNumber: row.inventoryCheckNumber }).then(res => {
            ElMessage.success('操作成功')
            searchList()
          })
        } else {
          //取消盘点
          let params = {
            type: 1,
            inventoryCheckNumber: row.inventoryCheckNumber,
          }
          getCountingOperation(params).then(res => {
            ElMessage.success('操作成功')
            searchList()
          })
        }
      })
    }
    //提交审批//通过审核
    function submitApproval(row, type) {
      ElMessageBox.confirm(type == "Approved" ? '确认审核通过?' : '确定结束盘点任务并提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {
          type: type == "Approved" ? 3 : 2,
          inventoryCheckNumber: row.inventoryCheckNumber,
          sortName: "icd.create_time", // 盘点结果页面列表时间排序字段为 icd.create_time
          sortType: "desc"
        }
        getCountingOperation(params).then(res => {
          ElMessage.success('操作成功')
          searchList()
        })

      })
    }
    //f打印盘点单
    function printCount() {
      if (!state.selectList.length) return ElMessage.error('请勾选盘点数据')
      printInfo({ inventoryCheckNumbers: state.selectList.map(item => item.inventoryCheckNumber) }).then(res => {
        window.open(res.data)
        ElMessage.success('操作成功')
      })
    }
    //跳转盘点结果页
    function editInventory(row, isDetail) {
      router.push({
        name: 'InventoryResult', query: {
          inventoryCheckNumber: row.inventoryCheckNumber,
          tableType: state.combineType,
          isDetail,
          inventoryType: row.type
        }
      })
    }
    //驳回审核弹框
    function reject(row) {
      state.row = row
      state.showReject = true
    }
    function closeReject(status) {
      if (status) searchList()
      state.showReject = false
    }
    return {
      ...toRefs(state),
      tabSelectEvent,
      sortFn,
      formRef,
      selectChangeEvent,
      handleSizeChange,
      handleCurrentChange,
      openTask,
      createInventoryFn,
      inventoryEditBack,
      deleteRows,
      submitApproval,
      reject,
      editInventory,
      closeReject,
      reset,
      searchList,
      printCount,
      selectAllEvent,
      updateList
    }
  }
}
</script>
<style lang="scss" scoped>
.headWarehouseInventory {
  .formClass {
    background: #fff;
    margin-top: 15px;
    padding: 24px 30px;
    padding-bottom: 10px;
    // display: flex;
    // justify-content: space-between;
  }
  .buttonClass {
    display: flex;
    justify-content: space-between;
    padding: 16px 0 29px 0;
  }
  .tableClass {
    background: #fff;
    padding: 24px 30px;
    margin-bottom: 60px;
    .textClass {
      width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .tab_left_box {
    margin: 0 16px;
    height: 80px;
    border: 1px solid #dcdfe6;
    color: #606266;
    border-radius: 3px;
    padding: 7px 15px;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #606266;
      margin-top: 7px;
      text-align: center;
    }
    .btn {
      margin-top: 7px;
      height: 14px;
      :deep(.el-button) {
        border: none;
        display: inline-block;
        min-height: 24px;
        padding: 0;
      }
      :deep(.el-button--text) {
        color: #606266;
      }
    }
  }
  .active-num {
    color: #fff;
    font-size: 12px;
  }
  .noactive-num {
    font-size: 12px;
    color: red;
  }
  .btn {
    height: 80px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
</style>
