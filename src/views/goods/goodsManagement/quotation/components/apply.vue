<template>
  <div>
    <filter-form :form="filterForm" type="applyUser" @search="search"></filter-form>
    <el-card shadow="never" class="none-border-card">
      <div class="purchase-table-view">
        <vxe-table ref="tableRef" :loading="tableLoading" :scroll-y="{enabled: false}" border :data="tableData" :span-method="colspanMethodL">
          <vxe-column field="id" title="商品信息" width="360">
            <template #header>
              <span class="ml-10">商品信息</span>
            </template>
            <template #default="{ row, rowIndex }">
              <div v-if="rowIndex % 2 === 0" class="goods-id-div">
                <div class="goods-id">
                  <span class="ml-10">{{row.id}}</span>
                  <el-popover placement="top" :width="510" trigger="hover" v-for="(item, index) in row.remarkList" :key="index" @after-enter="showRemarkDetail(row.id, item.typeId)">
                    <template #reference>
                      <div class="remarkLabel" :style="{'backgroundColor': item.color}">{{item.word}}</div>
                    </template>
                    <el-table :data="remarkDetail" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}" fit>
                      <el-table-column width="160" property="content" label="内容">
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.content">{{row.content}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column width="160" property="createTime" label="时间">
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.createTime">{{row.createTime}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column width="90" property="typeName" label="类型"></el-table-column>
                      <el-table-column width="72" property="createUserName" label="操作人">
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.createUserName">{{row.createUserName}}</div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-popover>
                </div>
                <div :class="['goods-tag', row.enableCustom ==1 ? 'yellow' : 'blue']">{{ row.enableCustom ==1 ? '定制' : '普通'}}商品报价</div>
              </div>
              <div v-else class="goodsInfo">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 400px; height: 400px" :src="row.mainImgUrl" fit="contain"></el-image>
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
          <vxe-column field="expectPrice" title="期望售价(USD)" align="center" width="80"></vxe-column>
          <vxe-column field="costPrice" title="预估成本价(CNY)" align="center" width="90"></vxe-column>
          <vxe-column field="categoryName" title="品类" align="center"></vxe-column>
          <vxe-column field="sourceLabel" title="来源" align="center"></vxe-column>
          <vxe-column title="操作员" align="center">
            <template #default="{ row }">
              <div v-permission="'apply:word:developer'">开发人：{{row.createUserName}}</div>
              <div v-permission="'apply:word:applicant'">申请人：{{row.applyUserName}}</div>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="时间" align="center" width="240">
            <template #default="{ row }">
              <div>开发时间：{{row.createTime}}</div>
              <div>申请时间：{{row.applyTime}}</div>
            </template>
          </vxe-column>
          <vxe-column field="authTypeLabel" title="查看权限" align="center"></vxe-column>
          <vxe-column field="statusLabel" title="状态" align="center"></vxe-column>
          <vxe-column title="操作" align="center" width="100" v-if="authPath('applyUser:btn')">
            <template #default="{ row }">
              <el-button type="text" @click="openDetail(row.id, row.combineType)">查看详情</el-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div class="flex-pagination page-fixed">
        <div>
          <span class="ml-25" v-if="selectRows.length > 0">已选{{selectRows.length}}条</span>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import FilterForm from './FilterForm.vue'
import quoteTableList from './composables/table.js'
export default {
  components: { FilterForm },
  setup() {
    const state = reactive({
      filterForm: {
        goodsStatus: 8, // 1未报价 2待采购报价 3报价打回 4待物流报价 6已报价 8申请人
        timeType: null, // 时间种类
        start_end: [], // 开始时间 结束时间
        enableCustom: '', // 商品类型
        goodsSrc: '0', // 商品来源
        mode: '', // 商品来源一级菜单
        source: '', // 商品来源二级菜单
        categoryId: '', // 商品品类ID
        authType: '', // 查看权限
        searchType: '', // 搜索类型
        searchText: '', // 搜索内容
        tortStatus: '', // 侵权筛选
        costPriceBegin: null, // 成本价起始值
        costPriceEnd: null, // 成本价结束值
        expectPriceBegin: '', // 预估售价
        expectPriceEnd: '', // 预估售价2
        sortName: '2', // 排序字段
        sortType: 'desc', // 排序方式 desc 倒序 asc 正序
        quotationStatus: null,
        remarkTypeIds: null // 备注类型
      }
    })

    const tableOpts = quoteTableList(state.filterForm)

    return {
      ...toRefs(state),
      ...tableOpts
    }
  }
}
</script>

<style lang="scss" scoped>
.padding-flex-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
.padding-flex-wrap + .padding-flex-wrap {
  margin-top: 10px;
}
.purchase-table-view {
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
    .remarkLabel{
      padding: 0px 5px;
      border-radius: 4px;
      margin-left: 10px;
      color: #fff;
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
