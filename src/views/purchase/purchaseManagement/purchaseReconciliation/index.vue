<template>
  <div class="purchase-reconciliation">
    <AffixTab>
      <template v-slot:tabSlot>
        <el-button :type="status == 0 ? 'primary' : 'default'" class="btn" @click="tabSelectEvent(0)">
          <div style="margin: 0">待入库</div>
        </el-button>
        <!-- 待对账 -->
        <el-button :type="status == 1 ? 'primary' : 'default'" class="btn" @click="tabSelectEvent(1)">
          <div>待对账</div>
          <div class="num">
            (<span :class="status == 1 ? 'active-num' : 'noactive-num'">{{waitStatus?waitStatus:0}}</span>)
          </div>
        </el-button>
        <!-- 已对账 -->
        <el-button :type="status == 2 ? 'primary' : 'default'" class="btn" @click="tabSelectEvent(2)">
          <div style="margin: 0">已对账</div>
        </el-button>
      </template>
    </AffixTab>
    <!-- form表单-->
    <div class="form-class">
      <el-form :model="form" :inline="true" ref="formRef" @keydown.enter='search'>
        <el-form-item label="时间范围:">
          <el-select v-if="status!==0" style="width: 130px" v-model="form.timeType" clearable>
            <el-option label="入库时间" :value="1"></el-option>
            <el-option label="下单时间" :value="2"></el-option>
            <el-option label="审批时间" :value="3"></el-option>
          </el-select>
          <el-select v-else style="width: 130px" v-model="form.timeType" clearable>
            <el-option label="下单时间" :value="1"></el-option>
            <el-option label="审批时间" :value="2"></el-option>
          </el-select>
          <el-form-item label="" prop="date">
            <el-date-picker style="margin-left:10px;width: 224px" v-model="form.date" type="daterange" unlink-panels range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="仓库:">
          <el-select style="width: 130px" v-model="form.warehouseId">
            <el-option label="万众智谷仓库" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:" prop="supplier">
          <el-cascader filterable clearable :options="supplierList" placeholder="请选择" v-model="form.supplier" @change="cascaderChange" collapse-tags :props="cascaderProps" style="width:300px">
          </el-cascader>
        </el-form-item>
        <el-form-item label="采购员:" prop="purchaseUserId">
          <el-select style="width: 200px" v-model="form.purchaseUserId" clearable multiple collapse-tags collapse-tags-tooltip>
            <el-option :label="user.purchaseUserName" :value="user.purchaseUserId" v-for="user in purchaseUserList" :key="user.purchaseUserId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型:">
          <el-select style="width: 130px" v-if="status==0" v-model="form.customization" clearable>
            <el-option label="普通商品" :value="0"></el-option>
            <el-option label="定制商品" :value="1"></el-option>
          </el-select>
          <el-select style="width: 130px" v-else v-model="form.goodsType" clearable>
            <el-option label="普通商品" :value="0"></el-option>
            <el-option label="定制商品" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品品类:" prop="categoryIdValue">
          <el-cascader :options="classify" v-model="form.categoryIdValue" :props="{
						value: 'id',
						label: 'name',
						children: 'child',
						multiple: true
					}" collapse-tags clearable filterable :show-all-levels="false" @change="categoryCheck" ref="selectTreeRef" />
        </el-form-item>
        <el-form-item label="结算方式:" prop="settlement">
          <el-select style="width: 130px" v-model="form.settlement" clearable @change="settlementChange">
            <el-option v-if="status !==1" label="款到发货" :value="4"></el-option>
            <el-option v-if="status !==1" label="预付" :value="1"></el-option>
            <el-option v-if="status !==1" label="货到付款" :value="3"></el-option>
            <el-option label="账期（30天）" value="2,30"></el-option>
            <el-option label="账期（45天）" value="2,45"></el-option>
            <el-option label="账期（60天）" value="2,60"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态:" prop="paymentStatus" v-if="status == 2">
          <el-select style="width: 130px" v-model="form.paymentStatus" clearable>
            <el-option label="未付款" :value="1"></el-option>
            <el-option label="已付款" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索内容:" prop="searchType">
          <el-select style="width: 130px" v-model="form.searchType" clearable>
            <el-option v-for="item in searchOptions[status > 0 ? 0 : 1]" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <el-form-item label="" prop="searchText">
            <el-input v-model="form.searchText" style="width: 280px;margin-left:10px" clearable placeholder="请输入要检索的内容用逗号或空格隔开">
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 排序 -->
    <div style="margin-top: 16px">
      <!-- 待入库排序 -->
      <ErpSort v-if="status == 0" :options="sortList1" :defaultValue="false" :defaultSort="{ value: form.sort1.sortName, type: form.sort1.sortType }" @sort="sortFn($event, 1)" />
      <!-- 待对账 已对账排序 -->
      <ErpSort v-if="status == 1 " :options="sortList2" :defaultValue="false" :defaultSort="{ value: form.sort2.sortType, type:form.sort2.sort }" @sort="sortFn($event, 2)" />
      <ErpSort v-if="status == 2" :options="sortList2" :defaultValue="false" :defaultSort="{ value: form.sort3.sortType, type:form.sort3.sort }" @sort="sortFn($event, 3)" />
    </div>
    <!-- 按钮 -->
    <div class="button-class">
      <div>
        <el-button type="primary" @click="remark" v-permission="'purchaseReconciliation_remark:btn'">备注</el-button>
        <el-button type="primary" v-if="status == 1" @click="batchReconciliation" v-permission="'purchaseReconciliation_batchApplyRreconciliation:btn'">申请对账</el-button>
      </div>
      <div>
        <el-button type="primary" @click="exportList" v-permission="'purchaseReconciliation_export:btn'">导出</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <Tables :status="status" v-loading="loading" :data="tableData" @select="selectList = $event" @remarkUpdate="remarkUpdate" />
    <!-- 分页器 -->
    <div class="flex-pagination page-fixed">
      <div style="position: relative">
        已选<span style="color: #1890ff">{{ selectList.length }}</span>条
      </div>
      <div>
        <el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="[50, 100, 200,300, 500, 1000]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 导出 -->
    <ExportOrder v-if="dialogExport" :formData="form" :selectList="selectList" :status="status" />
    <!-- 备注 -->
    <PurchaseRemark v-if="dialogRemark" :selectList='selectList' :status="status" @closeRemark="closeRemark" />
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import PurchaseRemark from './components/purchaseRemark.vue'
import ExportOrder from './components/exportOrder.vue'
import Tables from './components/table.vue'
import AffixTab from '@/components/affixTab/index.vue'
import ErpSort from '@/components/erpSort/index.vue'
import { reactive, toRefs, onMounted, ref, provide, onActivated } from 'vue'
import { getTree } from '@/api/purchase/outOfStock.js'
import { categoryId } from '@/api/goods/goodsPublish.js'
import { getPurchaseUsers } from '@/api/purchase/outOfStock.js'
import { pageQuery, purchaseStayWarehouses, getTagTotal, getPurchaseUsersWait } from './api/api.js'
import { deepCopy } from 'tool'
import { ElMessage } from 'element-plus'
export default {
  name: 'purchaseReconciliation',
  components: {
    AffixTab,
    ErpSort,
    Tables,
    PurchaseRemark,
    ExportOrder
  },
  setup() {
    const sortList1 = [
      { label: '下单时间', value: 'o.create_time' },
      { label: '审批时间', value: 'o.audit_time' }
    ]
    const sortList2 = [
      { label: '入库时间', value: 1 },
      { label: '下单时间', value: 2 },
      { label: '审批时间', value: 3 }
    ]
    const route = useRoute()
    const state = reactive({
      dialogRemark: false,
      status: 0, // tab页
      dialogExport: false,
      waitStatus: null,
      form: {
        supplier: [],
        timeType: 1,
        date: null,
        startTime: null,
        endTime: null,
        timeStart: null,
        timeEnd: null,
        sort1: {
          sortName: 'o.create_time',
          sortType: 'asc'
        },
        sort2: {
          sort: 'asc',
          sortType: 1
        },
        sort3: {
          sort: 'desc',
          sortType: 1
        },
        sort: 'desc',
        sortType: 1,
        goodsType: null, // 商品类型
        customization: null, // 商品类型
        partnerTypeList: [],
        supplierIdList: [],
        categoryIds: [],
        purchaseUserId: [],
        warehouseId: 1,
        categoryIdValue: null,
        paymentStatus: null,
        searchType: 1
      },
      selectList: [],
      page: {
        pageSize: 50, //分页
        pageNo: 1 //分页
      },
      paginationTotal: 0, //分页总数据条数
      supplierList: [],
      classify: [],
      purchaseUserList: [],
      loading: false,
      tableData: [{}]
    })
    const formRef = ref(null)
    const cascaderProps = {
      expandTrigger: 'hover',
      label: 'name',
      children: 'childs',
      value: 'id',
      multiple: true
    }
    let copyForm = deepCopy(state.form)
    const searchOptions = [
      [
        { label: '入库单号', value: 1 },
        { label: '采购单号', value: 2 },
        { label: '商品SKU', value: 3 },
        { label: '商品名称', value: 4 },
        { label: '商品编码', value: 5 },
        { label: '平台订单号', value: 6 },
        { label: '运单号', value: 7 }
      ],
      [
        { label: '采购单号', value: 1 },
        { label: '商品SKU', value: 2 },
        { label: '商品名称', value: 3 },
        { label: '商品编码', value: 4 },
        { label: '平台订单号', value: 5 },
      ]
    ]
    onActivated(() => {
      search()
      getTagTotal()
    })
    function getTagTotalUpdate() {
      getTagTotal().then(res => {
        state.waitStatus = res.data
      })
    }
    onMounted(() => {
      getTagTotalUpdate()
      getTree().then(res => {
        state.supplierList = res.data
      })
      categoryId().then(res => {
        state.classify = res.data
      })
      queryUserList()
      search()
    })
    //采购员接口
    function queryUserList() {
      if (state.status > 0) {
        getPurchaseUsersWait({ tabFlag: state.status }).then(res => {
          state.purchaseUserList = res.data
        })
      } else {
        getPurchaseUsers().then(res => {
          state.purchaseUserList = res.data
        })

      }
    }
    function tabSelectEvent(val) {
      if (val == state.status) return false
      state.status = val
      formRef.value.resetFields()
      copyForm.sort = val == 1 ? 'asc' : 'desc'
      state.form = deepCopy(copyForm)
      state.page.pageSize = 50
      state.page.pageNo = 1
      state.selectList = []
      search()
      queryUserList()
    }

    function cascaderChange(select) { // 处理供应商
      // 清空选中的供应商
      state.form.partnerTypeList = []
      state.form.supplierIdList = []
      // 存储不同的供应商id
      let obj = { 1: [], 2: [], 3: [], 4: [] }
      select.forEach(el => obj[el[0]].push(el[1]))
      state.supplierList.forEach(item => {
        // 如果供应商类别下面的所有供应商被选中
        if (obj[item.id].length == item.childs.length)
          state.form.partnerTypeList.push(item.id)
        // 否则
        else state.form.supplierIdList.push(...obj[item.id])
      })
    }

    function sortFn($event, type) {
      console.log($event.type, $event.val, type)
      if (type == 1) {
        state.form.sort1.sortName = $event.val
        state.form.sort1.sortType = $event.type
        search()
      } else if (type == 2) {
        state.form.sort = $event.type
        state.form.sortType = $event.val
        state.form.sort2.sort = $event.type
        state.form.sort2.sortType = $event.val
        search()
      } else {
        state.form.sort = $event.type
        state.form.sortType = $event.val
        state.form.sort3.sort = $event.type
        state.form.sort3.sortType = $event.val
        search()
      }
    }
    //分页
    const handleSizeChange = val => {
      state.page.pageSize = val
      state.page.pageNo = 1
      search()
    }
    const handleCurrentChange = val => {
      state.page.pageNo = val
      search()
    }

    function remark() {
      if (!state.selectList.length) return ElMessage.error('请选择订单')
      state.dialogRemark = true
    }
    //子组件批量备注返回
    function closeRemark(val) {
      state.dialogRemark = false
      if (val) {
        search()
      }
    }
    function categoryCheck(ids) {
      state.form.categoryIds = ids.map(item => item[item.length - 1])
    }

    function reset() {
      formRef.value.resetFields()
      state.form = deepCopy(copyForm)
      search()
    }

    function formHandle() {
      // 处理表单数据
      let data = {
        status: state.status,
        page: state.page
      }
      if (state.status > 0) {
        // 待对账 已对账
        if (state.form.date) {
          // 处理时间
          state.form.startTime = state.form.date[0] + ' 00:00:00'
          state.form.endTime = state.form.date[1] + ' 23:59:59'
        }
        Object.assign(state.form, data)
      } else {
        // 待入库
        if (state.form.date) {
          // 处理时间
          state.form.timeStart = state.form.date[0] + ' 00:00:00'
          state.form.timeEnd = state.form.date[1] + ' 23:59:59'
        }
        Object.assign(state.form, state.form.sort1, data)
      }
    }

    function search() {
      formHandle()
      if (state.status > 0) {
        let params = {
          purchaseUserIdList: state.form.purchaseUserId
        }
        Object.assign(state.form, params)
        pageQuery(state.form).then(res => {
          state.tableData = res.data.dataList
          state.paginationTotal = res.data.page.totalCount
          state.tableData?.forEach(item => {
            if (item.skuValue) {
              item.skuCn = JSON.parse(item.skuValue)
            }
          })
        })
      } else {
        let params
        params = {
          timeStart: state.form.timeStart,
          timeEnd: state.form.timeEnd,
          partnerTypes: state.form.partnerTypeList,
          supplierIds: state.form.supplierIdList,
          // customization: state.form.goodsType === 2 ? 1 : 0,
        }
        Object.assign(state.form, params)
        purchaseStayWarehouses(state.form).then(res => {
          state.paginationTotal = res.data.page.totalCount
          state.tableData = res.data.dataList
          state.tableData?.forEach(item => {
            if (item.skuValue) {
              item.skuCn = JSON.parse(item.skuValue)
            }
          })
        })
      }
    }

    function settlementChange(val) {
      if (typeof val == 'number') {
        state.form.settlementType = val
      } else {
        state.form.settlementType = val.split(',')[0]
        state.form.settlementValue = val.split(',')[1]
      }
    }

    let router = useRouter()
    function batchReconciliation() {
      if (!state.selectList.length) return ElMessage.error('请选择订单')
      // 确认已选数据中是否有正在对账中的数据，防止重复申请
      const id = state.selectList.filter(item => !item.applyStatus).map(_item => _item.id)
      if (!id.length) return ElMessage.error('入库单不可重复申请对账!')
      router.push({ name: 'applyReconciliation', params: { id: id } })
    }
    function exportList() {
      state.dialogExport = true
    }
    //导出
    provide('closeDialog', closeDialog)
    function closeDialog(val) {
      state.dialogExport = false
    }
    //单条备注删除后刷新页面
    function remarkUpdate(val) {
      if (val) {
        search()
      }
    }
    return {
      ...toRefs(state),
      tabSelectEvent,
      sortList1,
      sortList2,
      sortFn,
      handleSizeChange,
      handleCurrentChange,
      remark,
      cascaderProps,
      cascaderChange,
      categoryCheck,
      formRef,
      reset,
      search,
      settlementChange,
      batchReconciliation,
      searchOptions,
      exportList,
      closeRemark,
      remarkUpdate
    }
  }
}
</script>

<style lang="scss" scoped>
.form-class {
  background: #fff;
  padding: 24px;
  margin-top: 24px;
  ::v-deep(.el-cascader__search-input) {
    // opacity: 0;
    margin-left: 10px;
  }
}

.button-class {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  // margin-bottom: 24px;
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

.num {
  height: 12px;
  margin-top: 10px;
}
</style>
