<!--
* @Descripttion: Vango ERP CusToNor
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="cusToNorContainer">
    <ErpNav title="定制转普货" :goBack="goBack" />
    <div class="formHeader">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="搜索内容:">
          <div class="searchContent">
            <el-select v-model="form.searchType" placeholder="全部">
              <!-- <el-option label="商品SKU" value="1" /> -->
              <el-option label="订单SKU" value="1" />
              <el-option label="订单号" value="2" /> </el-select
            >&nbsp;&nbsp;
            <el-input
              v-model="form.searchText"
							@keydown.enter="queryList"
              placeholder="请输入要检索的内容多条可用逗号或空格隔开"
            />
          </div> </el-form-item
        >&nbsp;&nbsp;
        <el-form-item label="团队:">
          <el-cascader
						ref="cascaderRef"
            v-model="teamList"
            :options="oraganziationList"
            :show-all-levels="false"
            clearable
						filterable
            @change="teamChange"
            :props="{
              checkStrictly: true,
              expandTrigger: 'click',
              label: 'deptName',
              value: 'deptId',
              children: 'children'
            }"
          >
          </el-cascader> </el-form-item
        >&nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button @click="initFn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContainer">
      <el-table
        ref="multipleTableRef"
        :data="list"
        style="width: 100%"
        border
        @selection-change="val => selectList = val"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row, index) => row.status != 1"
        />
        <el-table-column label="商品信息" align="center" min-width="360">
          <template #default="scope">
            <div class="goodsContainer">
              <div class="goodsImagesContainer">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="scope.row.skuImg"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 70px; height: 70px"
                      :src="scope.row.skuImg"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="goodsContent" style="width: 80%">
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="scope.row.sku">复制</a>
                  </template>
                  <p :title="scope.row.sku" class="pClass">
                    {{ scope.row.sku }}
                  </p>
                </el-tooltip>
                <p>{{scope.row.currency|| '$'}} {{ scope.row.price }}</p>
                <p v-if="scope.row.skuValue">
                  规格名称:
                  <span v-for="v in skuVal(scope.row.skuValue)" :key="v.id"
                    >{{ v.spe }}:{{ v.speVal }}&nbsp;&nbsp;
                  </span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="packageId"
          label="包裹号"
          show-overflow-tooltip
          align="center"
          width="250"
        />
        <el-table-column
          property="orderId"
          label="订单号"
          show-overflow-tooltip
          align="center"
          width="250"
        />
        <el-table-column
          property="paymentTime"
          label="付款时间"
          show-overflow-tooltip
          align="center"
          width="150"
        />
        <el-table-column
          property="quantity"
          label="数量"
          show-overflow-tooltip
          align="center"
          width="90"
        />
        <el-table-column
          property="deptName"
          label="团队"
          show-overflow-tooltip
          align="center"
          width="200"
        />
        <el-table-column label="采购状态" align="center" width="120">
          <template #default="scope">
            <span v-if="scope.row.status == 1" style="color: #f59a23"
              >已生成采购单</span
            >
            <span v-else>【未生成采购单】</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="text" @click="setCustomInfo(scope.row)"
              >查看定制信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <QueryDetail
      v-if="queryDetailShow"
      :dialogType="1"
      :orderInfo="orderInfo"
      @queryBack="queryBackFn"
    />
    <div class="footerContainer">
      <el-button type="primary" @click="cusToNorFn">确认转为普货</el-button>
      <el-button @click="goBack">退 出</el-button>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ErpNav from '@/components/erpNav/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { deepCopy } from '@/utils/tool'
import QueryDetail from './components/queryDetail.vue'
import {
  ordinaryToCustomized,
  saveCustomizedAndOrdinary
} from './composables/api'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getOrganizationTree } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { ErpNav, ErpFooter, QueryDetail },
  setup() {
    let store = useStore()
		let cascaderRef = ref(null)
    const router = useRouter()
    const route = useRoute()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const form = {
      packageIds: !!~route.query.packageIds.indexOf(',')
        ? route.query.packageIds.split(',')
        : [route.query.packageIds],
      deptId: null, //团队ID
      searchText: null, //skuId
      searchType: '1'//搜索类型 1商品sku 2订单sku 3订单号
    }
    const state = reactive({
      form: deepCopy(form),
      list: [],
      queryDetailShow: false,
      orderInfo: null,
      oraganziationList: [], // 组织架构列表
      teamList: [],
			selectList:[]
    })
    getOrganizationTree().then(res => {
      if (res.code === 200) {
        state.oraganziationList = deleteChildren(res.data)
      }
    })
    function deleteChildren(arr) {
      arr.forEach(v => {
        if (v?.children?.length > 0) {
          v.children = deleteChildren(v.children)
        } else {
          v.children = null
        }
      })
      return arr
    }
    function goBack() {
      router.push({
        name: 'OrderManagement'
      })
    }
    queryList()
    function queryList() {
      ordinaryToCustomized(state.form).then(res => {
        state.list = res.data
      })
    }
    function queryBackFn() {
      state.queryDetailShow = false
    }
    function skuVal(str) {
      if (str) return JSON.parse(str)
      else return []
    }
    function initFn() {
			cascaderRef.value.handleClear()
      state.form = deepCopy(form)
      queryList()
    }
    function setCustomInfo(row) {
      state.orderInfo = row
      state.queryDetailShow = true
    }
    function teamChange(val) {
      if (val && val.length > 0) state.form.deptId = val[val.length - 1] - 0
      else state.form.deptId = null
    }

    function cusToNorFn() {
			if(state.selectList.length === 0) return ElMessage.warning({ message: '请选择商品' })
      ElMessageBox.confirm('确认定制品转为普货？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
					const datas = state.selectList.map(v=>{
						return {
							type:1,//类型 1定制转普货 2普货转定制
							packageSkuId:v.id,//订单商品ID
							customValue:v.customValue//定制信息
						}
					})
					// return false
          saveCustomizedAndOrdinary({saveCustomizedAndOrdinaryDTO:datas}).then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '定制品转普货成功' })
							goBack()
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        })
        .catch(() => {})
    }
    return {
      ...toRefs(state),
      skuVal,
      goBack,
      initFn,
      queryList,
      cusToNorFn,
      teamChange,
      queryBackFn,
			cascaderRef,
      setCustomInfo,
      sideBarWidth
    }
  }
}
</script>
<style lang='scss' scoped>
.goodsContainer {
  display: flex;
  justify-content: flex-start;
  .goodsContent {
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
  }
}
.pClass {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.tableContainer {
  margin-top: 20px;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  padding-bottom: 60px;
}
.footerContainer {
  text-align: right;
  right: 0;
  width: calc(100% - v-bind(sideBarWidth));
  position: fixed;
  bottom: 0;
  background-color: #fff;
  height: 52px;
  line-height: 52px;
  box-sizing: border-box;
  padding: 0 30px;
  border-top: 1px solid #e8ecef;
  z-index: 99;
}
.formHeader {
  margin-top: 20px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
  .searchContent {
    display: flex;
  }
}
</style>
