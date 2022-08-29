<template>
  <div>
    <AffixTab>
      <template v-slot:tabSlot>
        <el-button :type="form.goodsStatus == 1 ? 'primary' : 'default'" @click="tabSelectEvent(1)" class="btn">
          <div>待申请</div>
          <div>(<span :style="{'color': form.goodsStatus == 3 ? '#f27869' : '#fff'}">{{noQuotedPendingNum}}</span>)</div>
        </el-button>
        <el-button :type="form.goodsStatus == 3 ? 'primary' : 'default'" @click="tabSelectEvent(3)" class="btn">
          <div style="margin-left: -4px">报价打回</div>
          <div>(<span :style="{'color': form.goodsStatus == 1 ? '#f27869' : '#fff'}">{{quotedRefuseNum}}</span>)</div>
        </el-button>
      </template>
    </AffixTab>
    <div class="pageView" style="padding-bottom: 10px">
      <el-form :inline="true" :model="form" ref="formRef" :scroll-y="{enabled: false}" @keyup.enter="searchEvent">
        <el-form-item label="时间范围:" prop="timeType">
          <el-select v-model="form.timeType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in form.goodsStatus == 1 ? timeType : timeType2" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="start_end">
          <el-date-picker v-model="form.start_end" type="daterange" value-format="YYYY-MM-DD" unlink-panels range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 245px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品类型:" prop="enableCustom">
          <el-select v-model="form.enableCustom" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in enableCustomOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品来源:" prop="goodsSource">
          <el-cascader v-model="form.goodsSource" :options="sourceData" :props="{ checkStrictly: true }" clearable @change="changeSource" style="width: 140px"></el-cascader>
        </el-form-item>
        <el-form-item label="商品品类:" prop="categoryId">
          <el-cascader v-model="form.categoryId" :options="categoryList" :props="categoryProps" style="width: 140px" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="查看权限:" prop="authType">
          <el-select v-model="form.authType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in authTypeOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="搜索内容:" prop="searchType">
          <el-select v-model="form.searchType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in searchType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchText">
          <el-input v-model="form.searchText" :placeholder="form.searchType !== 2 ? '请输入要检索的内容' : '请输入要检索的内容多条可用逗号或者空格隔开'" clearable style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="打回类型:" v-if="form.goodsStatus == 3" prop="refuseType">
          <el-select v-model="form.refuseType" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in refuseType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="侵权筛选:" prop="tortStatus">
          <el-select v-model="form.tortStatus" style="width: 140px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in tortStatusOptions" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-form-item label="成本价(CNY):" prop="costPriceBegin">
            <el-input-number v-model="form.costPriceBegin" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" />
          </el-form-item>
          <el-form-item>
            <span>→</span>
          </el-form-item>
          <el-form-item prop="costPriceEnd">
            <el-input-number v-model="form.costPriceEnd" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="预估售价(USD):" prop="expectPriceBegin">
            <el-input-number v-model="form.expectPriceBegin" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" />
          </el-form-item>
          <el-form-item>
            <span>→</span>
          </el-form-item>
          <el-form-item prop="expectPriceEnd">
            <el-input-number v-model="form.expectPriceEnd" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" />
          </el-form-item>
        </el-form-item>
        <div class="flex searchBtn">
          <el-button type="primary" @click="searchEvent">查询</el-button>
          <el-button @click="resetForm(1)">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="operationView">
      <el-form class="sortForm">
        <el-form-item label="排序:" style="margin-bottom: 8px">
          <el-button type="text" class="sortText" :class="form.sortName == 1 ? '' : 'unSelectActive'" @click="sortEvent(1)">
            开发时间<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" v-if="form.sortName == 1"></i>
          </el-button>
          <el-button type="text" class="sortText" :class="form.sortName == 2 ? '' : 'unSelectActive'" @click="sortEvent(2)" v-if="form.goodsStatus == 3">
            申请时间<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" v-if="form.sortName == 2"></i>
          </el-button>
          <el-button type="text" class="sortText" :class="form.sortName == 3 ? '' : 'unSelectActive'" @click="sortEvent(3)" v-if="form.goodsStatus == 3">
            打回时间<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" v-if="form.sortName == 3"></i>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="quoteEvent" :loading="btnLoading" v-permission="'/goods/goodsManagement/unsetPrice/quotation'">申请报价</el-button>
          <el-button type="primary" style="margin-left: 16px" @click="delGoodsEvent" :loading="btnLoading" v-permission="'/goods/goodsManagement/unsetPrice/delGoods'">删除商品</el-button>
          <!-- 菜单和按钮权限都是后台返回 src\views\configure\systemManagement\menu\index.vue-->
          <el-button type="primary" style="margin-left: 16px" @click="batchEditCategories" :loading="btnLoading" v-permission="'/goods/goodsManagement/unsetPrice/batchEdit'">批量修改品类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pageView" style="margin-bottom: 55px">
      <vxe-table v-bind="tableOptions" :spanMethod="form.goodsStatus == 1 ? colspanMethod : colspanMethod2" :scroll-y="{enabled: false}" :loading="loading" ref="tableRef">
        <vxe-column field="id" title="商品信息" :width="form.goodsStatus == 1 ? 431 : 339">
          <template #header>
            <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll" style="margin-top: 6px"></el-checkbox>
            <span class="ml-10">商品信息</span>
          </template>
          <template #default="{ row, rowIndex }">
            <div v-if="rowIndex % 2 === 0" class="flexLeft">
              <el-checkbox v-model="row.checked" @change="selectRow(row)"></el-checkbox>
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.id">复制</a>
                </template>
                <a style="color: #000">{{row.id}}</a>
              </el-tooltip>
            </div>
            <div class="goodsInfo" v-else>
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.mainImgUrl" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
                </template>
              </el-popover>
              <div class="right">
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="row.nameCn ? row.nameCn : row.nameEn">复制</a>
                  </template>
                  <a class="goodsName textOverflow" :title="row.nameCn ? row.nameCn : row.nameEn">{{row.nameCn ? row.nameCn : row.nameEn}}</a>
                </el-tooltip>
                <div class="tagBox">
                  <el-tag type="danger" v-if="row.tortStatus === 2">侵</el-tag>
                  <el-tag v-for="(item, index) in row.labelList" :key="index">{{item.name}}</el-tag>
                </div>
                <div style="color: #1890FF" v-if="row.enableCustom == 1">定制品</div>
              </div>
            </div>
          </template>
        </vxe-column>
        <!-- <vxe-column field="code" title="商品SPU" :width="form.goodsStatus == 1 ? 298 : 198" :visible="form.goodsStatus == 3"></vxe-column> -->
        <vxe-column field="categoryName" title="品类" width="151"></vxe-column>
        <vxe-column title="来源" width="151">
          <template #default="{ row }">
            <div v-if="row.mode == 0">平台采集</div>
            <div v-if="row.mode == 1">独立站采集</div>
            <div v-if="row.mode == 2">手动</div>
            <div v-if="row.mode == 3">导入</div>
            <div v-if="row.mode == 4">复制</div>
            <div>{{row.source}}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作员" :visible="form.goodsStatus == 3">
          <template #default="{ row }">
            <div v-permission="'unsetPrice/quotationRepulse/operator/createUserName'">开发人: {{row.createUserName}}</div>
            <div v-permission="'unsetPrice/quotationRepulse/operator/applyUserName'">申请人: {{row.applyUserName}}</div>
            <div v-if="row.refuseType == 1">采购打回: {{row.refuseUserName}}</div>
            <div v-if="row.refuseType == 2 && row.purchaseUserName">采购报价: {{row.purchaseUserName}}</div>
            <div v-if="row.refuseType == 2">物流打回: {{row.refuseUserName}}</div>
          </template>
        </vxe-column>
        <vxe-column title="时间" :visible="form.goodsStatus == 3" width="223">
          <template #default="{ row }">
            <div>开发时间: {{row.createTime}}</div>
            <div>申请时间: {{row.applyTime}}</div>
            <div v-if="row.refuseType == 1">采购打回: {{row.refuseTime}}</div>
            <div v-if="row.refuseType == 2 && row.purchaseTime">采购报价: {{row.purchaseTime}}</div>
            <div v-if="row.refuseType == 2">物流打回: {{row.refuseTime}}</div>
          </template>
        </vxe-column>
        <vxe-column field="createUserName" title="开发人" :visible="form.goodsStatus == 1 && authPath('unsetPrice/unsetPrice/createUserName')"></vxe-column>
        <vxe-column field="createTime" title="开发时间" :visible="form.goodsStatus == 1"></vxe-column>
        <vxe-column title="查看权限">
          <template #default="{ row }">
            <div v-if="row.authType == 0">仅维护人可见</div>
            <div v-if="row.authType == 1">仅部门人员可见</div>
            <div v-if="row.authType == 2">所有人可见</div>
            <div v-if="row.authType == 3">部门及以下</div>
          </template>
        </vxe-column>
        <vxe-column title="打回原因" width="156" :visible="form.goodsStatus == 3">
          <template #default="{ row }">
            <div>{{row.refuseType == 1 ? '采购打回' : '物流打回'}}</div>
            <div style="color: rgba(0,0,0,.45)">{{row.offerRefuseReson}}</div>
          </template>
        </vxe-column>
        <vxe-column field="operation" title="操作" width="90" :visible="(form.goodsStatus == 1 && authPath('goodsManagement/unsetPrice/editDetail/index')) || form.goodsStatus == 3">
          <template #default="{ row }">
            <div class="operation">
              <el-button type="text" @click="editEvent(row)" v-permission="'goodsManagement/unsetPrice/editDetail/index'" :disabled="form.goodsStatus == 3 && row.createUserName !== userInfo.fullName ">编辑</el-button>
              <el-button type="text" @click="lookEvent(row)" v-if="form.goodsStatus == 3">查看</el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="paginationBox">
        <div>
          <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll">已选{{selections.length}}条</el-checkbox>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page.pageNo" :page-sizes="[100, 200, 300, 500, 1000]" :page-size="form.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>
    <el-dialog title="批量修改商品品类" v-model="ifShow" :width="640" custom-class="my-dialog" :close-on-click-modal="false" destroy-on-close @close="closeEvent">
      <div class="content-view">
        <span class="red-color view-span">*</span>
        <span class="view-span">商品分类:</span>
        <el-cascader v-if="ifShow" v-model="categoryValue" :options="categoryOptions" :props="categoryProps" style="width: 140px" clearable></el-cascader>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEvent">取消</el-button>
          <el-button type="primary" @click="affirmEvent">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import AffixTab from '@/components/affixTab/index.vue'
import { ref, reactive, toRefs, computed, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notAllowRouter, _debounce } from '@/utils/tool.js'
import { sourceData, authTypeOptions, tortStatusOptions, enableCustomOptions } from '@/assets/js/staticData.js'
import { timeType, timeType2, searchType, refuseType, sortInfo, categoryProps } from './composables/staticData'
import tableOptions from './composables/tableOptions'
import TableHandle from '../js/tableHandle'
import Hooks from '../js/hooks.js'
import Handle from './composables/handle'
import { authPath } from '@/utils/hooks.js'
import { useStore } from 'vuex'
export default {
  name: 'UnsetPrice',
  components: {
    AffixTab
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    let store = useStore()
    let state = reactive({
      form: {
        timeType: null, // 时间类型
        start_end: [], // 时间  start,end拼接
        enableCustom: null, // 商品类型
        mode: null, // 来源 一级
        source: null, // 来源 二级
        goodsSource: null,
        categoryId: null, // 品类ID
        tortStatus: null, // 侵权状态
        attr: null, // 属性
        goodsStatus: 1, // 商品状态
        combineType: null, // 组合标识
        searchType: null, // 搜索类型
        searchText: '', // 搜索内容
        refuseType: null, // 打回类型
        authType: null, // 查看权限
        purchasePriceBegin: undefined, // 采购价 <
        purchasePriceEnd: undefined, // 采购价 >
        suggestedPriceBegin: undefined, // 建议售价 <
        suggestedPriceEnd: undefined, // 建议售价 >
        freightBegin: undefined, // 运费 <
        freightEnd: undefined, // 运费 >
        costPriceBegin: undefined, // 成本价 <
        costPriceEnd: undefined, // 成本价 >
        expectPriceBegin: undefined, // 预估售价 <
        expectPriceEnd: undefined, // 预估售价 >
        remarkTypeIds: null, // 备注类型ID
        sortName: 1, // 排序字段
        sortType: 'desc', // 排序 （desc倒序，asc正序）
        page: {
          pageNo: 1,
          pageSize: 100
        }
      },
      selections: [], // 选中的id集合
      selectRows: [], // 选中的row集合
      selectedAll: false, // 是否全选
      totalCount: 0, // 总条目数
      loading: false,
      btnLoading: false,
      categoryList: [],
      tableData: [],
      noQuotedPendingNum: '-',
      quotedRefuseNum: '-',
      ifShow: false,
      stickyOptions: {
        className: '.vxe-table--header-wrapper', // 需要吸顶的节点
        stickyNum: 225 // 吸顶的距离
      },
      categoryOptions: [],
      categoryValue: ""
    })
    let formRef = ref(null)
    let tableRef = ref(null)

    let hooks = Hooks(state, formRef, tableRef, route)
    let tableHandle = TableHandle(state, hooks)
    let handle = Handle(state, hooks, router, route)

    let refuseCause = computed(() => {
      return (row) => {
        switch (row.offerRefuseReson) {
          case 1:
            return '信息不全'
          case 2:
            return '商品信息错误'
          case 3:
            return '没有货源'
          case 4:
            return '其他'
          default:
            return row.offerRefuseremark
        }
      }
    })


    let userInfo = computed(() => store.state.user.userInfo)

    onActivated(() => {
      if (route.params.categoryId !== undefined && route.params.categoryId !== null) {
        state.form.categoryId = parseInt(route.params.categoryId)
      }
      if (route.params.isRefresh == 'true') {
        state.form.page.pageNo = 1
      }
      hooks.getGoodsNum(3)
      hooks.getCategoryEvent()
      hooks.searchEvent()
    })

    return {
      ...toRefs(state),
      tableRef,
      formRef,
      refuseCause,
      userInfo,
      enableCustomOptions,
      sourceData,
      authTypeOptions,
      tortStatusOptions,
      tableOptions,
      timeType,
      timeType2,
      searchType,
      categoryProps,
      refuseType,
      sortInfo,
      ...hooks,
      ...tableHandle,
      ...handle
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: 87px;
  height: 70px;
}
.pageView {
  position: relative;
  margin-top: 15px;
  :deep(.vxe-header--column) {
    position: relative;
    .el-checkbox {
      position: absolute;
      left: 10px;
    }
  }
  .searchBtn {
    position: absolute;
    bottom: 25px;
    right: 25px;
  }
  .flexLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
    color: #000;
  }
}
.padding16 {
  padding: 0 16px;
}
.operationView {
  margin-top: 16px;
  .unSelectActive {
    color: #909399;
  }
  .sortText {
    font-size: 14px;
  }
}
:deep(.el-range-separator) {
  width: 6%;
}
:deep(.el-checkbox) {
  margin-right: 16px;
}
.flex {
  display: flex;
  justify-content: flex-end;
  height: 32px;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.paginationBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 0 30px;
  width: calc(100% - var(--sideBarWidth));
  height: 56px;
  background-color: #fff;
  .el-pagination {
    margin-top: 8px;
  }
}

.content-view {
  display: flex;

  .view-span {
    line-height: 32px;
    &:nth-child(2) {
      margin-right: 10px;
    }
  }

  .red-color {
    color: #f56c6c;
    margin-right: 3px;
  }
}
.operation {
  display: flex;
  flex-direction: column;
  .el-button {
    margin-left: 0;
    min-height: 20px;
    padding: 4px;
  }
}
:deep(.sortForm .el-form-item__label) {
  font-size: 14px;
}
</style>
