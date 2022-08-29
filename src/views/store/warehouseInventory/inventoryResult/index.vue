<template>
  <div class="inventory-result">
    <div v-if="!isShowAddInventory" class="inventory-result-list">
      <ErpNav :title="tableTypeTabelColumns[tableType].navTitle" routeOpt='index' />
      <el-space wrap :size="[100,0]">
        <p>盘点编号：{{inventoryCheckNumber}}</p>
        <p>仓库：万众智谷仓库</p>
        <p>盘点类型：{{{"1":'整仓盘点',"2":'按商品SKU盘点'}[inventoryType]}}</p>
      </el-space>
      <el-form :inline="true" :model="stateForm" ref="stateFormRef">
        <el-form-item label="搜索内容:" prop="searchType">
          <el-select v-model="stateForm.searchType" style="width:120px" clearable @clear="stateForm.searchType=1">
            <el-option v-for="item in searchTypeOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchText">
          <el-input v-model="stateForm.searchText" :placeholder="computedPlaceholder" style="width:350px" clearable/>
        </el-form-item>
        <el-form-item label="盘点状态:" prop="inventoryStatus" v-if="!['0','2','4'].includes(tableType)">
          <el-select v-model="stateForm.inventoryStatus" placeholder="请选择" style="width:100px" clearable>
            <el-option v-for="item in inventoryStatusOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="盘点结果:" prop="result" v-if="['2','4'].includes(tableType)">
          <el-select v-model="stateForm.result" placeholder="请选择" style="width:100px" clearable>
            <el-option v-for="item in inventoryResultOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="inventory-result-table">
        <erpSort @sort="sortEvent" :options="defaultSortOptions" :defaultSort="{ value: stateForm.sortName, type: stateForm.sortType}" />
        <div class="result-table-opration">
          <div class="opration-left">
            <el-dropdown @command="handlePadding" v-if="['1','3'].includes(tableType)">
              <el-button type="primary">
                批量填充盘平数<el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="1">当前勾选商品</el-dropdown-item>
                  <el-dropdown-item command="2">当前查询商品</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" v-if="['0','1'].includes(tableType)" @click="isShowAddInventory = true">添加商品</el-button>
            <el-button type="primary" v-if="['0','1'].includes(tableType)" @click="delProduct">删除商品</el-button>
          </div>
          <div class="opration-right">
            <el-dropdown @command="changeExportInOrOut" v-if="['1','3'].includes(tableType)">
              <el-button type="primary">
                导入/导出<el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="1">导出盘点数据</el-dropdown-item>
                  <el-dropdown-item command="2">导入盘点数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" v-if="tableType=='2'||tableType=='4'" @click="changeExportInOrOut(1)">导出盘点结果</el-button>
          </div>
        </div>
        <vxe-table :data="tableList" border highlight-hover-row  @checkbox-change="handleSelectionChange" @checkbox-all="handleSelectionChange" :loading="tableLoading">
          <vxe-table-column type="checkbox" width="40" />
          <vxe-table-column v-for="(item,index) in tableTypeTabelColumns[tableType].columns" :field="item.prop" :title="item.label" :width="item.width?item.width:'auto'" :min-width="item.minWidth" :key="index" align="center">
            <template #default="{row}">
              <div class="name-column" v-if="item.prop === 'nameCn'">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row.url" fit="contain"></el-image>
                  <template #reference>
                    <el-image style="width: 70px; height: 70px" :src="row.url" fit="contain"></el-image>
                  </template>
                </el-popover>
                <div class="test-box">
									<el-tooltip placement="top" :offset="10">
										<template #content>
											<a style="color: #fff" v-copy="row.nameCn">复制</a>
										</template>
										<p class="test-box-name" :title="row.nameCn">{{row.nameCn}}</p>
               		</el-tooltip>
									<p class="test-box-spe" v-if="row.speVal && row.speVal.length" :title="JSON.parse(row.speVal).reduce( (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ','')">
										{{ JSON.parse(row.speVal).reduce( (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ','') }}
									</p>
                </div>
              </div>
              <div v-else-if="item.prop === 'sku'">
								<el-tooltip placement="top" :offset="10">
									<template #content>
										<a style="color: #fff" v-copy="row.sku">复制</a>
									</template>
									<p>{{row.sku}}</p>
								</el-tooltip>
								<el-tooltip placement="top" :offset="10">
									<template #content>
										<a style="color: #fff" v-copy="row.skuId">复制</a>
									</template>
									<p>{{row.skuId}}</p>
								</el-tooltip>
              </div>
              <div v-else-if="item.prop === 'remark'">
                <el-input v-model="row.remark" style="width:100%" v-if="['1','3'].includes(tableType)" maxlength="50" @change="saveResult(row,'remark')"></el-input>
                <div class="test-box-name" :title="row.remark" v-else>{{row.remark}}</div>
              </div>
              <div v-else-if="item.prop === 'auditRemark'">
                <el-input v-model="row.auditRemark" style="width:100%" v-if="tableType=='2'" maxlength="50" @change="saveResult(row,'auditRemark')"></el-input>
                <div class="test-box-name"  :title="row.auditRemark" v-else>{{row.auditRemark}}</div>
              </div>
              <div v-else-if="item.prop === 'nowInventoryNum'">
                <el-input-number  v-if="['1','3'].includes(tableType)" v-enterNumber v-model="row.nowInventoryNum" maxlength="5" :min="undefined" :max="99999" style="width:100%"  @change="saveResult(row,'nowInventoryNum')" :controls="false" :precision="0"></el-input-number>
                <div v-else>{{row.nowInventoryNum}}</div>
              </div>
              <div v-else-if="item.prop === 'differenceNum'" :class="row.differenceClass">
                <p v-if="tableType!=4" class="difference-num">{{ cumputedDifferenceText(row) }}</p>
                <div v-else>
									<p class="difference-num">{{ cumputedDifferenceText(row) }}</p>
									<p v-if="row.differenceNum">{{ row.statusText }}</p>
								</div>
              </div>
              <div v-else-if="item.prop==='shelfSpace'">
                <p>{{row[item.prop]?"拣货区":"-"}}</p>
                <p>{{row[item.prop]}}</p>
              </div>
              <div v-else>
                {{row[item.prop]}}
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>

      <ErpFooter>
        <div class="left">
          <p>已选 <span class="left-num">{{ selectList.length }}</span> 条</p>
          <el-pagination :total="total" :current-page="stateForm.page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizes" :page-size="stateForm.page.pageSize" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
        <div class="right">
          <el-button @click="()=>{router.push('index')}">关闭</el-button>
          <el-button type="primary" v-if="tableType=='0'" v-permission="'open_Task:btn'" @click="openTask" :disabled="data.tableList.length<1">开启任务</el-button>
          <!-- <el-button type="primary" v-if="['1','3'].includes(tableType)" @click="saveResult(1)">保存</el-button> -->
          <el-button type="primary" v-if="['1','3'].includes(tableType)" v-permission="'submit_Approval:btn'" @click="commitAudit(2)">提交审批</el-button>
          <el-button type="primary" v-if="tableType=='4'&&isDetail == 0" v-permission="'inventoryInStore'" :disabled="!addStatus" @click="toInventoryStore('inventoryInStore')">盘盈入库</el-button>
          <el-button type="primary" v-if="tableType=='4'&&isDetail == 0" v-permission="'inventoryOutStore'" :disabled="!reduceStatus" @click="toInventoryStore('inventoryOutStore')">盘亏出库</el-button>
          <el-button type="primary"  v-if="tableType=='2'" v-permission="'through_HSE:btn'" @click="submitApproval">通过审核</el-button>
          <el-button type="primary" v-if="tableType=='2'" v-permission="'reject_review:btn'" @click="rejectReview">驳回审核</el-button>
        </div>
      </ErpFooter>
    </div>
    <div v-if="isShowAddInventory" class="inventory-result-add">
      <InventoryEdit :inventoryCheckNumber="otherParams.inventoryCheckNumber" :pageType="0" @editBack="inventoryEditBack" />
    </div>
    <ExportResult v-if="exportResultShow" :searchForm="otherParams" :sortParams="{ sortName: stateForm.sortName, sortType: stateForm.sortType}" @closeEvent="exportResultShow = false" />
    <ImportInventory v-if="importInventoryShow" :dialogVisible="importInventoryShow" @closeEvent="closeImportInventory" :inventoryCheckNumber="otherParams.inventoryCheckNumber" />
    <RejectReview v-if="showReject"  :inventoryCheckNumber="inventoryCheckNumber" @closeReject="showReject=false" />
  </div>

</template>

<script setup>
import ErpNav from '@/components/erpNav/index.vue'
import RejectReview from '../components/rejectReview.vue'
import ErpSort from '@/components/erpSort/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import ExportResult from "../components/exportResult.vue"
import ImportInventory from "../components/importInventory.vue"
import InventoryEdit from '../components/inventoryEdit.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { reactive, toRefs, ref, computed, onMounted } from 'vue'
import {
  searchTypeOptions,
  inventoryStatusOptions,
  tableTypeTabelColumns,
  inventoryResultOptions
} from "../composables/data.js"
import {
  queryInventoryResultList,
  paddingInventoryList,
  saveInventoryResult,
  startInfo,
  deleteDetailList,
  getCountingOperation,
  getButtonStatus,
} from "../composables/api.js"
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepCopy } from '@/utils/tool'
const router = useRouter()
const route = useRoute()
const { tableType = 0, inventoryCheckNumber, isDetail = 0, inventoryType = 1 } = route.query // 父级传过来的tab框数据  isDetail 是否是查看详情
const pageSizes = [100, 200, 300, 400, 500]
const defaultSortOptions = [{ value: 'icd.create_time', label: '添加时间' }, { value: 'inventoryNum', label: '库存' }]

const data = reactive({
  showReject: false,
  total: 0,
  tableList: [],
  copyTableList: [], // 作对比用
  selectList: [],
  exportResultShow: false,
  importInventoryShow: false,
  isShowAddInventory: false,
  stateForm: {
    inventoryCheckNumber,
    searchType: 1,
    searchText: "",
    inventoryStatus: '',
    result: '',
    sortName: "icd.create_time",
    sortType: "desc",
    page: {
      pageNo: 1,
      pageSize: 100
    }
  },
  otherParams: {
    inventoryCheckNumber,
    searchType: 0,
    searchText: "",
    inventoryStatus: '',
    result: '',
    ids: []
  },
  tableLoading: false,
  reduceStatus: 0, //  盘亏出库按钮状态
  addStatus: 0 // 盘盈入库按钮状态
})

const computedPlaceholder = computed(() => {
  const { searchType } = data.stateForm
  const batchSearch = [0, 1, 2]
  return batchSearch.includes(searchType)
    ? `请输入${searchTypeOptions[searchType - 1].label},多条请用空格或者逗号隔开`
    : `请输入${searchTypeOptions[searchType - 1].label}`
})

// 盘盈盘亏入库按钮
const toInventoryStore = (name) => {
  const { searchType, searchText, inventoryStatus, sortName, sortType } = data.stateForm
  const queryData = { searchType, searchText, inventoryStatus, sortName, sortType }
  sessionStorage.setItem('inventoryquerydata', JSON.stringify(queryData))
  router.push({ name, query: { inventoryCheckNumber, tableType, inventoryType } })
}

const handleCurrentChange = (value) => {
  const { page } = data.stateForm
  page.pageNo = value
  getInventoryResultList()
}

const handleSizeChange = (value) => {
  const { page } = data.stateForm
  page.pageNo = 1
  page.pageSize = value
  getInventoryResultList()
}

const handleSelectionChange = (checked) => {
  data.selectList = checked.records
  const ids = data.selectList.length ? data.selectList.map(item => item.id) : []
  data.otherParams.ids = ids
}

const onSubmit = () => {
  const { searchType, searchText, inventoryStatus, result } = data.stateForm
  Object.assign(data.otherParams, { searchType, searchText, inventoryStatus, result }) // 将查询参数赋值给填充参数
  data.selectList = data.otherParams.ids = [] // 重置已选项
  getInventoryResultList()
}

const stateFormRef = ref(null)

const resetForm = () => {
  stateFormRef.value.resetFields()
  onSubmit()
}

//
const sortEvent = (sortName, sortType) => {
  Object.assign(data.stateForm, { sortName, sortType })
  getInventoryResultList()
}

const changeExportInOrOut = (exportType) => {
  if (exportType == 1) data.exportResultShow = true
  else data.importInventoryShow = true
}

// 批量填充按钮
const handlePadding = async (paddingType) => {
  const ids = data.selectList.length ? data.selectList.map(item => item.id) : []
  if (!ids.length && paddingType == 1) return ElMessage.warning('请选择商品!')
  const paddingParmas = Object.assign({}, data.otherParams, { type: paddingType - 0, ids, sortName: data.stateForm.sortName, sortType: data.stateForm.sortType })
  const result = await paddingInventoryList(paddingParmas)
  if (result.code == 200) getInventoryResultList()
}

// 获取盘点结果数据
const getInventoryResultList = async () => {
  data.tableLoading = true
  const result = await queryInventoryResultList(data.stateForm)
  data.tableLoading = false
  const { data: resultData = [], code } = result
  if (code != 200) return
  resultData.dataList.forEach(item => {
    item.nowInventoryNum = item.nowInventoryNum == null ? undefined : item.nowInventoryNum // el-input-number会把null值处理成0，所以重新赋值成undefined
  })
  data.copyTableList = deepCopy(resultData.dataList)
  data.tableList = resultData.dataList
  data.total = resultData.page.totalCount
}

// 删除商品按钮
const delProduct = () => {
  if (data.total == data.selectList.length) return ElMessage.warning('至少保留一条数据!')
  if (!data.selectList.length) return ElMessage.warning('请选择商品!')
  ElMessageBox.confirm('是否确定删除已选择商品？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
    const skuIds = data.selectList.map(item => item.skuId)
    deleteDetailList({ inventoryCheckNumber, skuIds }).then(res => {
      if (res.code == 200) {
        ElMessage.success('操作成功')
        getInventoryResultList()
      }
    })
  })
}

// 添加商品
const inventoryEditBack = (val) => {
  data.isShowAddInventory = false
  // val为true
  val && setTimeout(() => {
    getInventoryResultList()
  }, 500)
}

// 开启任务
const openTask = (row) => {
  ElMessageBox.confirm('确定开启盘点任务?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    startInfo({ inventoryCheckNumber }).then(res => {
      if (res.code == 200) {
        ElMessage.success('操作成功')
        router.push('index')
      }
    })
  })
}

// 格式化盘点结果
const cumputedDifferenceText = (row) => {
  const { nowInventoryNum, inventoryNum } = row
  if (nowInventoryNum < 0) {
    row.nowInventoryNum = undefined
    return "-"
  }
  const subNumber = nowInventoryNum - inventoryNum
  row.differenceClass = subNumber > 0 ? "green" : subNumber < 0 ? "red" : ''
  row.statusText = row.status == "0" ? '未处理' : (subNumber > 0 ? '已入库' : '已出库')
  if (nowInventoryNum === "" || nowInventoryNum == 'null' || nowInventoryNum == undefined) {
    return "-"
  } else {
    return subNumber > 0 ? `盘盈+${subNumber}` : subNumber < 0 ? `盘亏${subNumber}` : subNumber == 0 ? `盘平` : '-'
  }
}

const saveResult = async (row, type) => {
  const { id, nowInventoryNum } = row
  if (nowInventoryNum < 0) return
  const sameCopyItem = data.copyTableList.find(item => item.id === id)
  if (sameCopyItem[type] === row[type]) return // 数据不变时不请求接口
  let obj = { detailId: id, inputType: type }
  obj[type] = row[type]
  const result = await saveInventoryResult(obj)
  if (result.code == 200) {
    data.copyTableList = deepCopy(data.tableList) // 更新作对比用的列表
    ElMessage.success('操作成功')
  }
}


const commitAudit = (type) => {
  ElMessageBox.confirm('确定结束盘点任务并提交审核?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
    const { sortName, sortType } = data.stateForm
    let params = {
      type: 2,
      inventoryCheckNumber,
      sortName,
      sortType
    }
    getCountingOperation(params).then(res => {
      ElMessage.success('操作成功')
      router.push('index')
    })
  })
}
//通过审核
const submitApproval = () => {
  ElMessageBox.confirm('确认审核通过?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  }).then(() => {
    let params = {
      type: 3,
      inventoryCheckNumber,
      reason: ''
    }
    getCountingOperation(params).then(res => {
      ElMessage.success('操作成功')
      router.push('index')
    })
  })
}
//驳回审核
const rejectReview = () => {
  data.showReject = true
}

const closeImportInventory = () => {
  data.importInventoryShow = false
  getInventoryResultList()
}

const queryButtonStatus = async () => {
  const { data: resultData, code } = await getButtonStatus({ inventoryCheckNumber })
  if (code != 200) return
  console.log(resultData)
  data.reduceStatus = resultData.reduce
  data.addStatus = resultData.add
}

onMounted(() => {
  getInventoryResultList()
  tableType == 4 && queryButtonStatus() // 只有在已完成列表内 查询盘盈盘亏的按钮状态
})

const { showReject, total, tableList, selectList, stateForm, otherParams, exportResultShow, importInventoryShow, isShowAddInventory, tableLoading, reduceStatus, addStatus } = toRefs(data)

</script>

<style lang="scss" scoped>
.inventory-result-table {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  .result-table-opration {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .green .difference-num {
    color: #429167;
  }
  .red .difference-num {
    color: #fd4c60;
  }

  .name-column {
    display: flex;
  }
  .test-box {
    display: inherit;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    margin-left: 10px;
    text-align: left;
  }
  .test-box-name,
  .test-box-spe {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: fit-content;
    line-height: 1;
  }
  .test-box-spe {
    // width: fit-content;
    // overflow: hidden; //超出的文本隐藏
    // text-overflow: ellipsis; //用省略号显示
    // white-space: nowrap; //不换行
    // line-height: 1;
    width: 100%;
  }
}

.el-space {
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  // border-bottom: 1px dashed #9e9e9e;
  background-image: linear-gradient(
    to right,
    #ebeef5 70%,
    rgba(255, 255, 255, 0.9) 0%
  ); /* 35%设置虚线点x轴上的长度 */
  background-position: bottom; /* top配置上边框位置的虚线 */
  background-size: 15px 1px; /* 第一个参数设置虚线点的间距；第二个参数设置虚线点y轴上的长度 */
  background-repeat: repeat-x;
}

::v-deep(.erp-footer) {
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right,
  .left {
    display: inherit;
  }
  .left-num {
    color: #409eff;
  }
}

.el-pagination {
  margin-left: 15px;
}

.el-form--inline {
  padding: 20px 20px 0;
  background: #fff;
}
.el-dropdown + .el-button {
  margin-left: 12px;
}
</style>
