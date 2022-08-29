<template>
  <div>
    <filter-form :form="filterForm" type="logistic" @search="searchAndRefresh"></filter-form>
    <div class="padding-flex-wrap justify-between mb-15">
      <div>
        <el-button v-permission="'logisticsBatch:btn'"  type="primary" @click="batchQuote('logisticsBatch')">批量报价</el-button>
        <el-button v-permission="'logisticsBatchRejectPurchase:btn'"  type="primary" @click="batchRejectPurchase">打回采购</el-button>
        <el-button v-permission="'logisticsBatchReject:btn'"  type="primary" @click="batchReject">拒绝报价</el-button>
        <el-button v-permission="'quotationImportL:btn'" type="primary"  @click="importDialogVisible = true">导入物流信息</el-button>
      </div>
      <el-button v-permission="'quotationExportL:btn'" @click="exportGoods('logistics')" type="primary" >导出物流信息</el-button>
    </div>
    <el-card shadow="never" class="none-border-card">
      <div class="logistic-table-view">
        <vxe-table ref="tableRef" :loading="tableLoading" :scroll-y="{enabled: false}" border :data="tableData" :span-method="colspanMethodL">
          <vxe-column field="id" title="商品信息" width="360">
            <template #header>
              <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll"></el-checkbox>
              <span class="ml-10">商品信息</span>
            </template>
            <template #default="{ row, rowIndex }">
              <div v-if="rowIndex % 2 === 0" class="goods-id-div">
                <div class="goods-id">
                  <el-checkbox v-model="row.checked" @change="selectRow(row)"></el-checkbox>
                  <span class="ml-10">{{row.id}}</span>
                </div>
                <div :class="['goods-tag', row.enableCustom ==1 ? 'yellow' : 'blue']">{{ row.enableCustom ==1 ? '定制' : '普通'}}商品报价</div>
              </div>
              <div v-else class="goodsInfo">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row.mainImgUrl" fit="contain"></el-image>
                  <template #reference>
                    <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
                  </template>
                </el-popover>
                <div class="right">
                  <el-tooltip placement="top" :offset="10">
                    <template #content>
                      <a style="color: #fff" v-copy="row.nameCn">复制</a>
                    </template>
                    <a class="goodsName textOverflow" :title="row.nameCn">{{row.nameCn}}</a>
                  </el-tooltip>
                  <div class="tagBox">
                    <el-tag type="danger"  v-if="row.tortStatus === 2">侵</el-tag>
                    <el-tag  v-for="tag in row.labelList" :key="tag.id">{{tag.name}}</el-tag>
                  </div>
                  <div class="color-primary" v-if="row.combineType === 2">组合</div>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="weight" title="预估重量(g)" align="center" width="80"></vxe-column>
          <vxe-column field="lwh" title="商品体积(cm³)" align="center" width="80"></vxe-column>
          <vxe-column field="attr" title="特殊属性" align="center"></vxe-column>
          <vxe-column field="categoryName" title="品类" align="center"></vxe-column>
          <vxe-column field="sourceLabel" title="来源" align="center"></vxe-column>
          <vxe-column title="操作员" align="center">
            <template #default="{ row }">
              <div v-permission="'logistics:word:developer'">开发人：{{row.createUserName}}</div>
              <div v-permission="'logistics:word:applicant'">申请人：{{row.applyUserName}}</div>
              <div>采购报价：{{row.purchaseUserName}}</div>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="时间" align="center" width="240">
            <template #default="{ row }">
              <div>开发时间：{{row.createTime}}</div>
              <div>申请时间：{{row.applyTime}}</div>
              <div :class="(Date.now() - new Date(row.purchaseTime).getTime()) > 21600000 ? 'color-danger' : ''">采购报价：{{row.purchaseTime}}</div>
            </template>
          </vxe-column>
          <vxe-column field="authTypeLabel" title="查看权限" align="center"></vxe-column>
          <vxe-column title="操作" align="center" width="100" v-if="authPath('logisticsQuote:btn')">
            <template #default="{ row }">
              <el-button type="text" @click="singleQuote('logisticsQuote', row.id)">物流报价</el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div class="flex-pagination page-fixed">
        <div>
          <span class="ml-25" v-if="selectRows.length > 0">已选{{selectRows.length}}条</span>
          <span class="ml-20">采购超时：<span class="color-danger">{{purchaseOvers}}</span>条</span>
          <span class="ml-20">物流超时：<span class="color-danger">{{logisticOvers}}</span>条</span>
          <span class="ml-20">总超时：<span class="color-danger">{{summaryOvers}}</span>条</span>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
      </div>
    </el-card>
    <import-dialog type="logistics" v-if="importDialogVisible" @close="closeDialog"></import-dialog>
    <return-dialog v-if="returnDialogVisible" :selections="batchIds" reasonType="logistic" @close="closeDialog"></return-dialog>
    <back-purchase v-if="showBackPurchase" :type= "2" :ids="batchIds" @close="closeDialog"></back-purchase>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import ReturnDialog from '../../../components/PurchaseInfo/components/ReturnDialog.vue'
import ImportDialog from './ImportDialog.vue'
import FilterForm from './FilterForm.vue'
import quoteTableList from './composables/table.js'
import BackPurchase from '@/views/goods/components/Logistics/components/BackPurchase.vue'
export default {
  emits: ['refresh'],
  components: { ReturnDialog, ImportDialog, FilterForm,BackPurchase },
  setup(props, ctx) {
    const state = reactive({
      filterForm: {
        goodsStatus: 4, // 1未报价 2待采购报价 3报价打回 4待物流报价 6已报价
        timeType: null, // 时间种类
        start_end: [], // 开始时间 结束时间
        enableCustom: '', // 商品类型
        goodsSrc: '0', // 商品来源
        mode: '', // 商品来源一级菜单
        source: '', // 商品来源二级菜单
        categoryId: '', // 商品品类ID
        preCategory: [], // 品类展示Array
        authType: '', // 查看权限
        searchType: '', // 搜索类型
        searchText: '', // 搜索内容
        tortStatus: '', // 侵权筛选
        costPriceBegin: null, // 成本价起始值
        costPriceEnd: null, // 成本价结束值
        expectPriceBegin: '', // 预估售价
        expectPriceEnd: '', // 预估售价2
        remarkTypeIds: '', // 备注类型ID 多个用逗号隔开
        sortName: '2', // 排序字段
        sortType: 'asc', // 排序方式 desc 倒序 asc 正序
        weightBegin: '', // 重量
        weightEnd: '', // 重量
        attr: [] // 特殊属性
      }
    })

    const tableOpts = quoteTableList(state.filterForm, ctx)


    return {
      ...toRefs(state),
      ...tableOpts
    }
  }
}
</script>

<style lang="scss" scoped>
.quotation-same-select {
  width: 140px;
}
.form-input-big {
  width: 300px;
}
.form-input-small {
  width: 80px;
}
.flex-div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.el-icon-right {
  margin-right: 10px;
}
.padding-flex-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  &.justify-between {
    justify-content: space-between;
  }
}
.padding-flex-wrap + .padding-flex-wrap {
  margin-top: 10px;
}
.logistic-table-view {
  margin-top: 15px;
  .extraHeader {
    width: 100%;
    display: flex;
    align-items: center;
    height: 46px;
    background-color: #f5f7fa;
    font-size: 14px;
    padding-right: 20px;
    a {
      margin-right: 16px;
      color: #000;
    }
    .tagBox {
      .el-tag {
        margin-right: 8px;
        padding: 0 5px;
        cursor: pointer;
      }
      .el-tag:nth-of-type(3) {
        background-color: rgba(114, 46, 209, 0.1);
        color: rgba(114, 46, 209, 0.9);
        border-color: rgba(114, 46, 209, 0.1);
      }
    }
  }
  .goods-id-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-id {
      display: flex;
      align-items: center;
    }
    .goods-tag {
      margin-right: 100px;
      &.blue {
        color: #1890ff;
      }
      &.yellow {
        color: #f7b500;
      }
    }
  }
  .goodsInfo {
    display: flex;
    padding: 16px;
    .right {
      flex: 1;
      overflow: hidden;
      margin-left: 16px;
      text-align: left;
      .goodsName {
        margin-bottom: 10px;
        color: #000;
      }
      .tagBox {
        display: flex;
        flex-wrap: wrap;
        max-height: 62px;
        overflow: hidden;
        .el-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
  .goodsSpu {
    padding: 16px;
    color: #3da2ff;
  }
}
</style>
