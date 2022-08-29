<template>
  <div class="combine-container">
    <erp-nav title="合并商品" :routeOpt="{ name: 'Quotation' }"></erp-nav>
    <div class="step-container">
      <el-steps :active="active" align-center>
        <el-step title="确认商品"></el-step>
        <el-step title="选择主品"></el-step>
      </el-steps>
    </div>
    <div v-show="active === 1">
      <el-card shadow="never" class="none-border-card">
        <div>
          <span>共{{table1Data.length}}个商品</span>
          <span class="ml-20">商品品类：{{table1Data[0].categoryName}}</span>
        </div>
        <el-table border class="mt-20" :data="table1Data">
          <el-table-column align="center" label="图片" prop="mainImgUrl" width="100">
            <template #default="{ row }">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 400px; height: 400px" :src="row.mainImgUrl" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" prop="nameCn"></el-table-column>
          <el-table-column align="center" label="开发人" prop="createUserName" width="120"></el-table-column>
          <el-table-column align="center" label="开发时间" prop="createTime" width="180"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template #default="{ $index }">
              <el-button @click="deleteTable1Data($index)" type="text" class="color-danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="active === 2">
      <el-card shadow="never" class="none-border-card">
        <el-radio-group v-model="selectFrom" :disabled="table1Data.length === 1">
          <el-radio label="all">商品库选择</el-radio>
          <el-radio label="current">当前商品选择</el-radio>
        </el-radio-group>
        <div style="display: flex; align-items: center; justify-content: space-between" v-if="selectFrom === 'all'">
          <el-form inline :model="filterForm" ref="filterFormRef">
            <el-form-item prop="categoryId" label="商品品类:">
              <el-select-tree :defaultCheckedKeys="[filterForm.categoryId]" @ok="changeCategory" :data="categoryIdOptions" :treeProps="{label: 'name', children: 'child', value: 'id'}"  :width="140"></el-select-tree>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="filterForm.name" type="text"  class="w-300" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button  type="primary" @click="search">查询</el-button>
            <el-button  @click="resetForm">重置</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="never" class="none-border-card mt-20">
        <el-table border :data="selectFrom === 'all' ? tableData : table1Data">
          <el-table-column align="center" label="图片" prop="mainImgUrl" width="100">
            <template #default="{ row }">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 400px; height: 400px" :src="row.mainImgUrl" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" prop="nameCn"></el-table-column>
          <el-table-column align="center" label="开发人" prop="createUserName" width="120"></el-table-column>
          <el-table-column align="center" label="开发时间" prop="createTime" width="180"></el-table-column>
          <el-table-column align="center" label="操作" width="140">
            <template #default="{ row }">
              <el-button :disabled="row.id === mainId" @click="selectGoods(row)" type="text">{{row.id === mainId ? '已' : ''}}选择</el-button>
              <el-button v-if="selectFrom === 'all'" type="text" @click="openDetail(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex-pagination" v-if="selectFrom === 'all'">
          <div></div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <erp-footer>
      <div class="combine-footer">
        <template v-if="active === 1">
          <el-button  type="primary" @click="active = 2">下一步</el-button>
        </template>
        <template v-else>
          <el-button  type="primary" @click="active = 1">上一步</el-button>
          <el-button  @click="confirmCancel">取消合并</el-button>
          <el-button  type="primary" @click="confirmFinish">完成合并</el-button>
        </template>
      </div>
    </erp-footer>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import ErpNav from '@/components/erpNav/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { sessionStorage } from "storage"
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryTree, getGoodsList, combineQuotationGoods } from "@/api/goods/quotation"
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { erpElTable } from "hooks"

export default {
  name: 'QuotationCombine',
  components: { ErpNav, ErpFooter, ElSelectTree },
  setup() {
    const table1Data = ref(sessionStorage.get('combine_goods'))
    const cid = table1Data.value[0].categoryId
    const state = reactive({
      active: 1,
      filterForm: {
        name: '',
        categoryId: cid
      },
      categoryIdOptions: null,
      defaultCheckedKeys: [cid],
      filterFormRef: null,
      mainId: null,
      selectFrom: 'all' // all 商品库 current 当前商品
    })
    const router = useRouter()
    const erpTableOpts = erpElTable(getGoodsList, state.filterForm, {
      pagination: {
        pageSizes: [20, 30, 50, 100, 200],
        pageSize: 20
      }
    })

    function deleteTable1Data(index) {
      if (table1Data.value.length <= 1) {
        ElMessage.error({ message: '至少保留1个商品进行合并' })
        return false
      }
      table1Data.value.splice(index, 1)
    }

    function selectGoods(row) {
      state.mainId = row.id
    }

    function openDetail(row) {
      window.open(location.origin + '/#/goods/goodsManagement/setPrice/detail?id=' + row.id + '&combine=1')
    }

    function confirmCancel() {
      ElMessageBox.alert('确认取消合并商品？', '提示', {
        cancelButtonText: '停留',
        confirmButtonText: '确认',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showCancelButton: true,
        showClose: false,
        callback: action => {
          if (action === 'confirm') {
            router.push({ name: 'Quotation' })
          }
        }
      })
    }

    function confirmFinish() {
      if (!state.mainId) {
        ElMessage.error({ message: '请先选择主品' })
        return false
      }
      ElMessageBox.confirm('确认合并商品？合并商品后，被选择合并的商品将被主品替代！', '提示', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(_ => {
        const form = {
          mainId: state.mainId,
          goodsIds: []
        }
        // goodsIds 不包含mainId
        table1Data.value.map(g => {
          if (g.id !== state.mainId) {
            form.goodsIds.push(g.id)
          }
        })
        combineQuotationGoods(form).then(_ => {
          ElMessage.success({ message: '合并成功' })
          setTimeout(_ => {
            router.push({ name: 'Quotation' })
          }, 1000)
        })
      }).catch(_ => { })
    }

    function changeCategory(value) {
      state.filterForm.categoryId = value
    }

    function resetForm() {
      state.filterFormRef.resetFields()
    }

    onMounted(_ => {
      getCategoryTree().then(r => {
        state.categoryIdOptions = r.data
      })
    })

    return {
      ...toRefs(state),
      table1Data,
      ...erpTableOpts,
      deleteTable1Data,
      confirmCancel,
      changeCategory,
      selectGoods,
      resetForm,
      confirmFinish,
      openDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.combine-container {
  padding-top: 110px;
}
.step-container {
  background: #fff;
  position: fixed;
  left: var(--sideBarWidth);
  right: 0;
  top: 180px;
  transition: left 1s;
  padding: 25px 0;
  z-index: 999;
}
.combine-footer {
  text-align: right;
  padding-right: 20px;
}
.el-form-item {
  margin-bottom: 0;
}
.w-300 {
  width: 300px;
}
</style>
