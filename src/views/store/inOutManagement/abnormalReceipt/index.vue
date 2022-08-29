<template>
<div class="contentBox">
  <el-tabs v-model="formData.status" tab-position="top">
    <el-tab-pane label="待处理" name="0" />
    <el-tab-pane label="已处理" name="1" />
  </el-tabs>
  <div class="search">
    <div class="flex-item">
      <el-form :model="formData" :inline="true"  @keyup.enter="search">
        <el-form-item label="搜索内容:">
          <div style="display:flex;align-items:center">
            <el-select v-model="formData.searchType" clearable @change="selectChange">
              <el-option v-for="item in formData.status=='0'?searchSelect.s1:searchSelect.s2" :key="item.value" :label="item.label" :value="item.value" >
              </el-option>
            </el-select>
            <el-input v-model="formData.searchContent" :placeholder="placeholder" maxlength="200" clearable style="margin-left:16px;width:360px"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="采购审核:">
          <el-select v-model="formData.purchaseAudit" clearable>
            <el-option v-for="item in formData.status=='0'?searchSelect.s3:searchSelect.s4" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="search">查询</el-button>
          <el-button  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary"  @click="excl" v-permission="'export'">导出</el-button>
      </div>
    </div>
    <tables :tableData="tableData" :activeTabs="formData.status" v-if="formData.status == 0" @checkChange="(e)=>{checkData = e}" />
    <tables :tableData="tableData" :activeTabs="formData.status" v-if="formData.status == 1" @checkChange="(e)=>{checkData = e}" />
  </div>
  <div class="flex-pagination page-fixed">
    <div></div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :pager-count="5" :page-sizes="[10, 20, 30, 50,100]" :page-size="pagination.pageSize" small layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
    </el-pagination>
  </div>
</div>
</template>

<script>
import { provide, reactive, toRefs, watch } from 'vue'
import tables from './components/tables.vue'
import { erpElTable } from '@/utils/hooks.js'
import { exceptionList , execption} from './composables/api.js'
import { ElMessage } from 'element-plus'
export default {
  components: {
    tables
  },
  setup() {
    const state = reactive({
      formData: {
        status: '0',
        searchContent: "",
        searchType: 2,
        purchaseAudit: ''
      },
      tableData: [],
      checkData: [],
      placeholder:'请输入要检索的内容'
    })
    let searchSelect = {
      s1: [
        { label: '商品名称', value: 2 },
        { label: '商品SKU', value: 1 },
        { label: 'SKU ID', value: 3 },
        { label: '采购单号', value: 6 },
        { label: '物流单号', value: 7 },
        { label: '异常单号', value: 5 },
      ],
      s2: [
        { label: '商品名称', value: 2 },
        { label: '商品SKU', value: 1 },
        { label: 'SKU ID', value: 3 },
        { label: '采购单号', value: 6 },
        { label: '物流单号', value: 7 },
        { label: '异常单号', value: 5 },
      ],
      s3: [
        { label: '待审核', value: 1 },
        { label: '多发入库', value: 2 },
        { label: '多发退货', value: 3 },

      ],
      s4: [
        { label: '多发入库', value: 2 },
        { label: '多发退货', value: 3 },
      ],
    }

    const {
      tableData,
      search,
      pagination,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(exceptionList, state.formData, {
      dataFilter: data => {
        data.map(item => {
          console.log(item.purchaseAudit);
          if (item.spe && JSON.parse(item.spe) ?.length) {
            console.log(JSON.parse(item.spe));
            item.spe = JSON.parse(item.spe).map(val => val.speVal).join('-')
            console.log(item.spe);
          }
          
        })
        return data
      }
    })
    watch(() => state.formData.status, val => {
      tableData.value = []
      state.checkData = []
      resetForm()
    })

    function changeTabs(val) {
      search()
    }

    provide('changeTabs', changeTabs)

    function resetForm() {
      state.formData.searchContent = ""
      state.formData.searchType = 2
      state.formData.purchaseAudit = ''
      search()
    }

    function excl() {
      if (!state.checkData.length) return ElMessage.error('请选择订单')
      execption({
        status:state.formData.status,
        serialNumber:state.checkData
      }).then(res=>{
        window.open(res.data,'_self')
      })
    }
    function selectChange(e){
      if(e == 2){
        state.placeholder = '请输入要检索的内容'
      }else{
        state.placeholder = '请输入要检索的内容多条可用逗号或者空格隔开'
      }
    }
    return {
      ...toRefs(state),
      searchSelect,
      changeTabs,
      resetForm,
      tableData,
      search,
      pagination,
      handleSizeChange,
      handleCurrentChange,
      excl,
      selectChange
    }
  }
}
</script>

<style lang="scss" scoped>
.contentBox {
  background-color: #fff;
  padding: 24px;
  margin-bottom:36px;
}

::v-deep(.el-form-item +.el-form-item) {
  margin-left: 6px;
}

.flex-item {
  display: flex;
  justify-content: space-between;
}
</style>
