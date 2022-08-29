<template>
  <div class="supplier-index-container">
    <el-card shadow="never" class="none-border-card no-padding">
      <div class="flex-tabs">
        <el-tabs class="flex-tabs-left" v-model="activeName" @tab-click="changeTab">
          <el-tab-pane v-for="tab in supplierPartnerTypes" :label="tab.label" :name="tab.key" :key="tab.key"></el-tab-pane>
        </el-tabs>
        <div class="flex-tabs-right">
          <el-button v-permission="'supplier:btn:add'" @click="changeRouter('PurchaseSMSupplierDetail', { query: { type: 'add', active: activeName } })" type="primary">新增供应商</el-button>
        </div>
      </div>
      <div class="form-div">
        <el-form :model="filterForm" ref="filterFormRef" inline>
          <el-form-item label="创建时间:">
            <el-date-picker unlink-panels class="sperator-big-date-picker" v-model="filterForm.startTime_endTime" value-format="YYYY-MM-DD" type="daterange" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间" clearable />
          </el-form-item>
          <template v-if="activeName === 'cooperation'">
            <el-form-item label="供应商类型:">
              <el-select v-model="filterForm.techType" clearable>
                <el-option v-for="supplier in supplierTypeOptions" :key="supplier.value" :label="supplier.label" :value="supplier.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算方式:">
              <el-select v-model="filterForm.preSettlementType" clearable>
                <el-option v-for="spp in supplierPayTypeOptions" :key="spp.value" :label="spp.label" :value="spp.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item prop="categoryId" label="供应商商品品类:">
            <el-select v-model="filterForm.categoryId" clearable>
              <el-option v-for="category in categoryIdOptions" :key="category.value" :label="category.label" :value="category.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="createBy" label="开发人:">
            <el-select v-model="filterForm.createBy" clearable>
              <el-option v-for="ct in createByOptions" :key="ct.userId" :label="ct.fullName || ct.userName" :value="ct.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="flex-div">
            <el-form-item prop="searchText" label="搜索内容:">
              <el-select v-if="activeName === 'cooperation'" v-model="filterForm.searchType" class="form-same-select" clearable>
                <el-option v-for="search in supplierSearchTypeOptions" :key="search.value" :label="search.label" :value="search.value">
                </el-option>
              </el-select>
              <el-select v-else v-model="filterForm.searchType" class="form-same-select" clearable>
                <el-option v-for="search in supplierSearchTypeOptions2" :key="search.value" :label="search.label" :value="search.value">
                </el-option>
              </el-select>
              <el-input clearable class="form-input-big ml-10" v-model="filterForm.searchText" placeholder="请输入要检索的内容多条可用逗号隔开"></el-input>
            </el-form-item>
            <div class="flex-div-right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <div style="margin: 10px 0">
      <erp-sort :options="[{ value: 1, label: '创建时间' }, { value: 3, label: '采购单量' }]" @sort="changeSort" :defaultSort="defaultSort"></erp-sort>
    </div>
    <el-card shadow="never" class="none-border-card">
      <el-table v-loading="tableLoading" :data="tableData" border>
        <el-table-column v-if="authPath('supplier:word:name')" align="center" prop="name" label="供应商名称" min-width="120">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.name">
              <div class="textOverflow">{{row.name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="authPath('supplier:word:code')" align="center" prop="code" label="供应商编码" min-width="160"></el-table-column>
        <template v-if="activeName === 'cooperation'">
          <el-table-column v-if="authPath('supplier:word:phone')" align="center" prop="phone" label="联系电话" min-width="160"></el-table-column>
          <el-table-column v-if="authPath('supplier:word:techTypeName')" align="center" prop="techTypeName" label="供应商类型" min-width="120"></el-table-column>
          <el-table-column v-if="authPath('supplier:word:settlementTypeName')" align="center" prop="settlementTypeName" label="结算方式" min-width="120">
            <template #default="{ row }">
              <span>{{row.settlementTypeName}}{{`${row.settlementValue ? `(${row.settlementValue}天)` : ''}`}}</span>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column v-if="authPath('supplier:word:storeHomePage')" align="center" prop="storeHomePage" label="店铺主页" min-width="300">
            <template #default="{ row }">
              <a class="textOverflow" :href="row.storeHomePage" target="_blank">{{ row.storeHomePage }}</a>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column align="center" prop="goodsSum" label="供应商商品数量"></el-table-column> -->
        <el-table-column v-if="authPath('supplier:word:categoryNames')" align="center" prop="categoryNames" label="供应商商品品类" min-width="240">
          <template #default="{ row }">
            <el-tooltip effect="dark" :content="row.categoryNames">
              <div class="textOverflow">{{row.categoryNames}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="authPath('supplier:word:completedSum')" align="center" prop="completedSum" min-width="160">
          <template #header>
            <div>已采购单数</div>
            <div>（已完成/待到货）</div>
          </template>
          <template #default="{ row }">
            <el-button type="text"><span @click="changeRouter('PurchaseOrders', { params: { status: '7', supplier: [ filterForm.partnerType, row.id ] } })">{{row.completedSum || 0}}</span> / <span @click="changeRouter('PurchaseOrders', { params: { status: '5, 6', supplier: [ filterForm.partnerType, row.id ] } })">{{row.waitingForArrivalSum || 0}}</span></el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="authPath('supplier:word:createByName')" align="center" prop="createByName" label="开发人" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" min-width="140">
          <template #default="{ row }">
            <!-- <el-button @click="changeRouter('PurchaseSMSupplierDetail', { query: { id: row.id, type: 'detail' } })" type="text">详情</el-button> -->
            <el-button v-permission="'supplier:btn:edit'" @click="changeRouter('PurchaseSMSupplierDetail', { query: { id: row.id, type: 'edit', active: activeName } })" type="text">编辑</el-button>
            <el-button v-permission="'supplier:btn:delete'" class="color-danger" type="text" @click="deleteSupplier(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex-pagination page-fixed">
        <div></div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { onActivated, reactive, toRefs, watch,nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSupplierList, del, getCreateBy } from '@/api/purchase/supplier.js'
import { getCategoryTree } from '@/api/goods/quotation.js'
import { erpElTable } from 'hooks'
import { resetForm as toolResetForm } from 'tool'
import { supplierTypeOptions, supplierPayTypeOptions, supplierSearchTypeOptions, supplierSearchTypeOptions2, supplierPartnerTypes } from '@/assets/js/staticData.js'
import ErpSort from '@/components/erpSort/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import  moment from 'moment'

export default {
  name: 'PurchaseSMSupplier',
  components: { ErpSort },
  setup() {
    const route = useRoute()
    const state = reactive({
      filterForm: {
        name: null,
        partnerType: null, // 供应商种类
        techType: null, // 合作供应商-供应商类型
        preSettlementType: null,
        settlementType: null, // 结算方式
        startTime_endTime: [], // 创建时间
        categoryId: null, // 供应商商品品类
        createBy: null, // 开发人
        searchText: null, // 搜索内容
        searchType: 1, // 搜索类型
        sort: 'desc', // asc desc
        sortType: 1, // 1创建时间 2商品数量 3采购单量
        settlementValue: null
      },
      isIndex:'',
      defaultSort:{value:1,type:'desc'},
      categoryIdOptions: [],
      createByOptions: [],
      activeName: 'cooperation'
    })
    const router = useRouter()
    const erpEltableOpts = erpElTable(getSupplierList, state.filterForm, {
      autoSearch: false,
      formHandle: () => {
        state.filterForm.partnerType = supplierPartnerTypes.find(t => t.key === state.activeName).value
        if (state.filterForm.preSettlementType >= 5 && state.filterForm.preSettlementType <= 7) {
          state.filterForm.settlementValue = state.filterForm.preSettlementType === 5 ? '30' : (state.filterForm.preSettlementType === 6 ? '45' : '60')
          state.filterForm.settlementType = 2
        } else {
          state.filterForm.settlementType = state.filterForm.preSettlementType
          state.filterForm.settlementValue = null
        }
        return state.filterForm
      },
      autoSearch: false
    })
		let formatStart = 'YYYY-MM-DD 00:00:00',formatEnd = 'YYYY-MM-DD',formatNow = 'YYYY-MM-DD HH:mm:ss'
		const orderIndexParmas = {
			1: [moment().format(formatStart),moment().format(formatNow)],//当前日期
			2: [moment().endOf('day').subtract(1, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//昨天日期
			3: [moment().endOf('day').subtract(3, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//三日期
		}

 function changeTab(a){
      // state.isIndex=''
       toolResetForm(state.filterForm, { sort: state.filterForm.sort, sortType: state.filterForm.sortType})
      state.filterForm.searchType = 1
      erpEltableOpts.search()
    }
    //之前的逻辑暂时注销
		// watch(() => state.activeName, _ => {
    //   console.log();
    //   if(!state.isIndex){
    //   toolResetForm(state.filterForm, { sort: state.filterForm.sort, sortType: state.filterForm.sortType})
    //   state.filterForm.searchType = 1
    //   erpEltableOpts.search()
    //   }
    // })
    const staticOptions = {
      supplierTypeOptions,
      supplierPayTypeOptions,
      supplierSearchTypeOptions,
      supplierSearchTypeOptions2,
      supplierPartnerTypes
    }

    getCategoryTree().then(r => {
      r.data.forEach(item => {
        state.categoryIdOptions.push({
          label: item.name,
          value: item.id
        })
      })
    })

    getCreateBy().then(r => {
      state.createByOptions = r.data
    })

    function resetForm() {
      toolResetForm(state.filterForm, { sort: state.filterForm.sort, sortType: state.filterForm.sortType })
      erpEltableOpts.search()
    }

    function changeSort(name, type) {
      state.filterForm.sortType = name
      state.filterForm.sort = type
      erpEltableOpts.search()
    }

    function changeRouter(name, query) {
      const opt = Object.assign({
        name
      }, query)
      router.push(opt)
    }

    function deleteSupplier(id) {
      ElMessageBox.confirm('确认删除当前供应商吗？').then(_ => {
        del({ ids: [id] }).then(_ => {
          ElMessage.success({ message: '删除成功' })
        }).finally(_ => {
          erpEltableOpts.search()
        })
      })
    }
    onActivated(_ => {
			const {activeName,startTime_endTime,isIndex} = route.params
      state.isIndex=isIndex
      if(isIndex){
        state.defaultSort={value:1,type:'desc'}
        state.filterForm.sort='desc'
        state.filterForm.sortType=1
        toolResetForm(state.filterForm, { sort: state.filterForm.sort, sortType: state.filterForm.sortType })
      }
			if(activeName){
				state.activeName = activeName
			}
			if(startTime_endTime){
          	state.filterForm.startTime_endTime = orderIndexParmas[Number(startTime_endTime)]
			}
      if (route?.params?.active) {
        state.activeName = route?.params?.active
      }
      erpEltableOpts.search()
    })

    return {
      ...toRefs(state),
      ...erpEltableOpts,
      ...staticOptions,
      resetForm,
      changeSort,
      changeRouter,
      deleteSupplier,
      changeTab
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-tabs {
  display: flex;
  border-bottom: 1px solid #e9e9e9;
  padding-top: 10px;
  &-right {
    width: 550px;
    padding: 0 30px 5px 0;
    text-align: right;
    background: #fff;
  }
  &-left {
    flex-grow: 1;
    background: #fff;
    ::v-deep(.el-tabs__nav-wrap) {
      padding: 0 30px;
    }
    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }
    ::v-deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }
}
.form-div {
  padding: 25px 30px;
  .form-same-select {
    width: 140px;
  }
  .form-input-big {
    width: 300px;
  }
  .flex-div {
    display: flex;
    justify-content: space-between;
  }
}
.supplier-index-container {
  padding-bottom: 50px;
}
</style>
