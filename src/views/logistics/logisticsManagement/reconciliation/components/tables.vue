<template>
<div class="tablsBox">
  <el-table :data="tableData" border :header-cell-style="{color:'#000'}" @selectionChange="selectionChange" max-height="580px" row-key="id" default-expand-all :tree-props="{ children: 'refList', hasChildren: 'hasChildren' }">
    <el-table-column type="selection" align="center" width="50" :selectable="selectable">
    </el-table-column>
    <el-table-column prop="deliveryTime" label="发货时间" align="center" width="110px" :resizable="false"></el-table-column>
    <el-table-column prop="packageId" label="包裹号" align="center" :resizable="false">
      <template #default="{row}">
        <el-tooltip placement="top" effect="light" :offset="10">
          <template #content>
            <a href="javascript:;" v-copy="row.packageId">复制</a>
          </template>
          <div class="textOverflow_2" :title="row.packageId">{{row.packageId}}</div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="logistics" label="物流方式" align="center" :resizable="false" width="180">
      <template #default="{row}">
        <div class="textOverflow_2" :title="row.titleDesc">{{row.titleDesc}}</div>
        <el-tooltip placement="top" effect="light" :offset="10">
          <template #content>
            <a href="javascript:;" v-copy="row.trackNumber">复制</a>
          </template>
          <div class="textOverflow" :title="row.trackNumber">{{row.trackNumber}}</div>
        </el-tooltip>
      </template>
    </el-table-column>
     <el-table-column prop="orderTypeName" label="包裹类型" align="center" width="110px" :resizable="false">
    </el-table-column>
    <el-table-column prop="reconciliationTime" label="对账时间" align="center" v-if="tabsActive == 'beReviewed'" width="110px" :resizable="false">
    </el-table-column>
    <el-table-column prop="preDiscountExpenses" label="折前费用(CNY)" align="center" width="90px" :resizable="false">
    </el-table-column>
    <el-table-column prop="logisticsFee" label="" align="center" width="100px" :resizable="false">
      <template #header>
        物流费用<br />(CNY)
      </template>
    </el-table-column>
    <el-table-column prop="additionalFee" label="额外费用(CNY)" align="center" width="100px" :resizable="false">
      <template #header>
        额外费用<br />(CNY)
      </template>
    </el-table-column>
    <el-table-column prop="logisticsWeight" label="物流称重(g)" align="center" width="100px" :resizable="false"></el-table-column>
    <el-table-column prop="deliveryWeight" label="自称重(g)" align="center" width="90px" :resizable="false"></el-table-column>
    <el-table-column prop="weightDifference" label="重量差异(g)" align="center" width="100px" :resizable="false"></el-table-column>
    <el-table-column prop="orderIdList" label="订单号" align="center" :resizable="false" width="180px">
      <template #default="{row}">
        <el-tooltip placement="top" effect="light" :offset="10" v-for="(item ,index) in row.orderIdList" :key="item + index">
          <template #content>
            <a href="javascript:;" v-copy="item">复制</a>
          </template>
          <div class="textOverflow" :title="item">{{item}}</div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center" width="80px" :resizable="false" v-if="tabsActive == 'beReviewed'">
      <template #default="{row}">
        {{['未获取','待审核','已审核'][row.status]}}
      </template>
    </el-table-column>
    <el-table-column prop="logisticsDeliveryTime" label="物流商发货时间" align="center"  :resizable="false" width="125px"></el-table-column>
    <el-table-column prop="approverName" label="审核人" align="center" v-if="tabsActive == 'reviewed'" :resizable="false"></el-table-column>
    <el-table-column prop="approveTime" label="审核时间" align="center" v-if="tabsActive == 'reviewed'" width="110px" :resizable="false"></el-table-column>
    <el-table-column prop="remark" label="备注" align="center" :resizable="false">
      <template #default="{row}">
        <div class="textOverflow_2" :title="row.remark">{{row.remark}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="A" label="操作" align="center" width="100px" :resizable="false" fixed="right">
      <template #default="{row}">
        <div class="editBox">
          <span type="text" class="edit" @click="edit('edit',row)" v-if="row.status!=0" v-permission="'editBtn'">编辑</span>
          <span class="edit" @click="edit('relation',row)" v-if="tabsActive == 'beReviewed'&&row.isParent == 1" v-permission="'relationBtn'">关联</span>
          <span v-permission="'deleteBtn'" v-if="row.isParent == 0 && tabsActive == 'beReviewed'">
            <el-popconfirm title="确认删除当前包裹数据？" @confirm="deleteChild(row.id)">
              <template #reference>
                <span class="danger">移除</span>
              </template>
            </el-popconfirm>
          </span>

        </div>
      </template>
    </el-table-column>
  </el-table>
  <relation @closeEvent="relationShow=false" v-if="relationShow" :logisticList="logisticList" :status="status" :data="relationData" :tabsActive="tabsActive" @search="search" />
  <div class="flex-pagination page-fixed">
    <div></div>
    <el-pagination v-model:currentPage="currentPage" :page-sizes="[100, 200, 300, 400, 1000]" v-model:pageSize="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
  </div>

</div>
</template>

<script>
import { reactive, toRefs, watch, nextTick, onActivated, onDeactivated, onMounted } from 'vue'
import relation from './relation.vue'
import { pageQuery, getTagTotal, deleteItem } from '../api/api.js'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
export default {
  props: {
    logisticList: {},
    tabsActive: {},
    formData: {}
  },
  emits: ['checkList', 'dataNum'],
  components: { relation },
  setup(props, ctx) {
    const route = useRoute()
    const state = reactive({
      relationShow: false,
      isCheckAll: false,
      status: '',
      totalCount: 0,
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      relationData: null,
      tableRef: null,
    })

    onMounted(()=>{
      search()
    })

    function search(resetPage) {
      if (resetPage) {
        state.currentPage = 1
        state.pageSize = 100
      }
      state.tableData = []
      let page = {
        pageNo: state.currentPage,
        pageSize: state.pageSize
      }
      nextTick(() => {
        pageQuery(Object.assign(props.formData, { page })).then(res => {
          state.tableData = res.data.dataList
          console.log(state.tableData);
          state.pagination = res.data.page
          state.totalCount = res.data.page.totalCount
          state.tableData.forEach(item => {
            console.log(item.orderTypeName);
            item.titleDesc = item.logisticsName + (item.lgtcLineName ? '-' + item.lgtcLineName : '') + (item.trackType == 1 && item.orderTypeName!='店小秘订单' ? '-手工' : '')
            if (item.refList && item.refList.length) {
              item.refList.forEach(val => {
                val.titleDesc = val.logisticsName + (val.lgtcLineName ? '-' + val.lgtcLineName : '') + (val.trackType == 1 && item.orderTypeName!='店小秘订单'? '-手工' : '')
              })
            }
          })
        }).catch(err => {

        })
      })
      getTagTotal().then(res => {
        ctx.emit('dataNum', res.data)
      })

    }

    watch(() => [state.pageSize, state.currentPage], val => {
      search()
    })

    function edit(val, data) {
      state.relationData = data
      state.status = val
      state.relationShow = true
    }

    function selectionChange(e) {
      ctx.emit('checkList', e)
    }

    function selectable(row) {
      return row.isParent == 1 ? true : false
    }

    function deleteChild(id) {
      deleteItem({ id }).then(res => {
        ElMessage.success('移除成功！')
        search()
      })
    }
    return {
      ...toRefs(state),
      edit,
      search,
      selectionChange,
      selectable,
      deleteChild
    }
  }
}
</script>

<style lang="scss" scoped>
.editBox {
  display: flex;
  justify-content: space-around;
}

.edit {
  color: #1890FF;
  cursor: pointer;
}

.danger {
  color: #D9001B;
  cursor: pointer;
}

.tablsBox {
  padding: 16px;
  background-color: #fff;
  margin-bottom: 50px;

  ::v-deep(.el-table__expand-icon) {
    display: none;
  }

  ::v-deep(.el-table__indent) {
    display: none;
  }

  ::v-deep(.el-table__placeholder) {
    display: none;
  }

  ::v-deep(.el-table__row--level-1) {
    background-color: #f5f7fa;
  }
}
</style>
