<template>
  <div>
    <erpNav :goBack="goBack" title="订单信息" />
    <div class="container">
      <el-form :model="form" ref="formRef" :inline="true" class="form-box">
        <el-form-item label="搜索内容:">
          <div class="flex">
            <el-select v-model="form.searchType" style="width:120px" @change="changeSelect">
              <el-option label="商品SKU" :value="1" />
              <el-option label="订单SKU" :value="2" />
              <el-option label="订单号" :value="3" />
              <el-option label="二维码ID" :value="4" />
            </el-select>
            <el-input v-model="copySearchText" :placeholder="placeholderType" clearable style="width:450px;margin-left:10px"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="入库状态:">
          <el-select v-model="form.purchaseStatus" style="width:150px">
            <el-option label="未入库" :value="1" />
            <el-option label="部分入库" :value="2" />
            <el-option label="全部入库" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间:">
          <el-date-picker v-model="form.deliveryTimeStart_deliveryTimeEnd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" unlink-panels clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购状态:" v-if="['5, 6','5','6','7','8'].includes(statusType)">
          <el-select v-model="form.isClose" clearable>
            <el-option label="正常采购" :value="0"></el-option>
            <el-option label="已关闭" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态:" v-if="settlementType!=2">
          <el-select v-model="form.payStatus" style="width:150px">
            <el-option label="未申请" :value="0" />
            <el-option label="申请中" :value="1" />
            <el-option label="已付款" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="团队:">
          <elSelectTree :data="deptList" :treeProps="{value: 'deptId', label: 'deptName',children: 'children'}" :width="200" filterable @ok="getDeptId" ref="ElSelectTreeRef" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(true)">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <!-- <el-table-column v-if="['5, 6'].includes(statusType)" type="selection" width="55" align="center" :selectable="selectable"></el-table-column> -->
          <el-table-column width="55" v-if="['5, 6','5','6'].includes(statusType)">
            <template #header>
              <el-checkbox :disabled="isDisabled" :indeterminate="indeterminate" v-model="allChecked" @change="marksCheckboxAll"></el-checkbox>
            </template>
            <template #default="{row}">
              <el-checkbox :disabled="row.isDisabled" v-model="row.checked" @change="selectRows(row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="col.id" label="商品信息" min-width="320" align="center">
            <template #default="{row}">
              <div class="flex">
                <div>
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 80px; height: 80px" :src="row.mainImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="column-center">
                  <el-tooltip placement="top" :offset="10">
                    <template #content>
                      <a style="color: #fff" v-copy="row.skuCode">复制</a>
                    </template>
                    <p class="text-row" :title="row.skuCode">{{ row.skuCode }}</p>
                  </el-tooltip>
                  <p>￥{{Number(row.goodsPrice).toFixed(2)}}</p>
                  <p v-if="row.skuValue">{{skuVal(row.skuValue)}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sku" label="订单信息" align="center" :min-width="200">
            <template #default="{row}">
              <p>{{row.sku}}</p>
              <p> {{row.currency}} {{Number(row.price).toFixed(2)}}</p>
            </template>
          </el-table-column> -->
          <el-table-column prop="orderId" label="订单号" align="center" width="200">
            <template #default="{row}">
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.orderId">复制</p>
                </template>
                <p>{{ row.orderId }} </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="paymentTime" label="付款时间" align="center" :min-width="200"></el-table-column> -->
          <el-table-column prop="goodsQuantity" label="数量" align="center" :width="60"></el-table-column>
          <el-table-column prop="arrivalQuantity" label="到货数量" align="center" :width="80"></el-table-column>
          <el-table-column label="配件金额" align="center" :width="80">
            <template #default="{row}">
              <p v-if="row.partSwitch==0">-</p>
              <p v-else-if="row.importStatus==1 && row.partSwitch">未导入</p>
              <p v-else-if="row.importStatus==3 && row.partSwitch">￥{{row.partTotalPrice}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryTime " label="入库时间" align="center" :width="110">
            <template #default="{row}">
              <div>{{row.deliveryTime || '-' }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="orderRelId" label="二维码ID" align="center" width="140">
            <template #default="{row}">
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.orderRelId">复制</p>
                </template>
                <p>{{ row.orderRelId }} </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="customValue" label="定制属性" align="center" width="300">
            <template #default="{row}">
              <el-popover placement="left-end" trigger="hover" width="auto">
                <div>
                  <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                    <p v-if="isImgString(v.value)">
                      {{v.field}}：
                      <el-popover placement="right-start" trigger="hover" width="auto">
                        <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                        <template #reference>
                          <el-icon style="font-size: 20px;position: relative;top: 3px;">
                            <PictureFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </p>
                    <p v-else>{{v.field}}：{{v.value}}</p>
                  </div>
                </div>
                <template #reference>
                  <div class="customValueContainer">
                    <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                      <p v-if="isImgString(v.value)">
                        {{v.field}}：
                        <el-popover placement="right-start" trigger="hover" width="auto">
                          <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                          <template #reference>
                            <el-icon style="font-size: 20px;position: relative;top: 3px;">
                              <PictureFilled />
                            </el-icon>
                          </template>
                        </el-popover>
                      </p>
                      <p v-else>{{v.field}}：{{v.value}}</p>
                    </div>
                  </div>
                </template>
              </el-popover>

            </template>
          </el-table-column>
          <el-table-column prop="payStatus " label="付款状态" align="center" width="80" v-if="settlementType!=2">
            <template #default="{row}">
              <div v-if="!row.payStatus">未申请</div>
              <div v-else-if="row.payStatus==1">申请中</div>
              <div v-else>已付款</div>
            </template>
          </el-table-column>
          <el-table-column prop="col.id" fixed="right" label="操作" align="center" :width="120">
            <template #default="{row}">
              <el-button type="text" @click="openCustomInfo(row)">查看定制信息</el-button>
              <!-- :disabled="row.isClose||row.arrivalQuantity>0" -->
              <el-button v-if="['5, 6','5','6'].includes(statusType)" type="text" :disabled="!!row.isClose||row.arrivalQuantity>0" @click="singleClosePurchase('single',row)">{{row.isClose?'已关闭':'关闭采购商品'}}</el-button>
              <el-button v-if="['7','8'].includes(statusType)" type="text" :disabled="!!row.isClose" >{{row.isClose?'已关闭':''}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="flex-pagination page-fixed">
      <div style="position: relative;" v-if="['5, 6','5','6'].includes(statusType)">
        <el-button @click="goBack">退出</el-button>
        <el-button type="primary" @click="batchClosePurchase">关闭采购商品</el-button>
      </div>
      <div>
        <erp-page :pageSizes="[100,200,300,400,500]" :total="total" @update-data="updateData"></erp-page>
      </div>
    </div>
    <customInfo @closeEvent="isShow = false" v-if="isShow" :info="purchaseInfo" />
    <ClosePurchasedGoods v-if="closePurchaseGoodsShow" @closeEvent="closePurchaseGoods" :purchaseOrderNumber="form.purchaseOrderNumber" :typeClose="typeClose" :selectList="selectList" />
  </div>
</template>

<script>
import { ArrowLeft, PictureFilled } from '@element-plus/icons-vue'
import ClosePurchasedGoods from './components/closePurchasedGoods.vue'
import erpNav from '@/components/erpNav/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, toRefs, onMounted, ref, computed } from 'vue'
import customInfo from './components/customInfo.vue'
import { purchaseOfOrders } from '@/api/purchase/order'
import ErpPage from '@/components/erpPage/index.vue'
import elSelectTree from "@/components/elSelectTree/index.vue"
import { getDepartmentList } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { renderCustomInfo, isImgString } from '@/utils/tool.js'
export default {
  components: { erpNav, customInfo, ErpPage, elSelectTree, PictureFilled, ClosePurchasedGoods },
  setup() {
    const ElSelectTreeRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      placeholderType: '请输入要检索的内容多条可用逗号或者空格隔开',
      form: {
        searchType: 1,
        searchText: '',
        deliveryTimeStart_deliveryTimeEnd: [],
        deptId: "",
        // start_end: [],
        purchaseStatus: null,
        payStatus: null,
        purchaseOrderNumber: route.query.purchaseOrderNumber,
        // purchaseOrderItemIds: [Number(route.query.purchaseOrderItemId)],
        isClose: 0,
        page: { pageNo: 1, pageSize: 100 }
      },
      copySearchText: '',
      total: 0,
      purchaseInfo: {},
      tableData: [],
      deptList: [],
      isShow: false,
      settlementType: route.query.settlementType,
      closePurchaseGoodsShow: false,//关闭采购单
      typeClose: '',
      statusType: route.query.status,
      selectList: [],
      allChecked: false,
      indeterminate: false,
      arr:[]
    })
    function reset() {
      ElSelectTreeRef.value.init(false)
      state.form.searchText = ''
      state.form.deptId = ''
      state.form.searchType = 1
      state.copySearchText = ''
      state.form.deliveryTimeStart_deliveryTimeEnd = []
      state.form.purchaseStatus = null
      state.form.payStatus = null
      state.form.isClose = 0
      Object.assign(state.form, { page: { pageNo: 1, pageSize: 100 } })
      search()
    }
    function updateData(data) {
      Object.assign(state.form, { page: data })
      search()
    }
    function search(t=false) {
     
      if (route.query.purchaseOrderItemId) {
        state.form.purchaseOrderItemIds = [Number(route.query.purchaseOrderItemId)]
      }
      state.form.searchText = state.copySearchText
      if (state.form.searchType == 4) {
        let result
        try {
          result = JSON.parse(state.copySearchText)
        } catch {
          result = state.copySearchText
        }
        if (result.ivtPurchaseDetailId) {
          state.form.searchText = result.ivtPurchaseDetailId.toString()
        } else {
          const resultStr = result.toString()
          const symbolList = [',', '，', '[', ']', '。', '.', '?', '!', '%', '}{', '}"', '"{']
          if (symbolList.some(item => resultStr.indexOf(item) > -1)) return ElMessage.error('二维码ID格式不正确')
          state.form.searchText = resultStr
        }
      }
      purchaseOfOrders(state.form).then(res => {
        state.tableData = res.data.dataList
        state.tableData.forEach(item => {
          item.isDisabled = item.arrivalQuantity > 0 || item.isClose == 1//禁用
          if(!item.isDisabled && t && state.arr.some(v=>v === item.id)) item.checked = true//复选框
          else item.checked = false//复选框
          console.log(item.isDisabled, 'item.isDisabled ')
          if (item.customValue) {
            const copyCustomValue = JSON.parse(item.customValue)
            item.customValue = renderCustomInfo(copyCustomValue, 2)
          } else {
            item.customValue = []
          }
        })
        state.total = res.data.page.totalCount
      })
    }
    function openCustomInfo(row) {
      state.isShow = true
      state.purchaseInfo = row
    }
    function getDeptId(v) {
      state.form.deptId = v
    }
    function goBack() {
      if (route.query.detailBack === '1')
        router.push({
          name: 'PurchaseOrderDetail', query: {
            purchaseOrderNumber: route.query.purchaseOrderNumber,
            id: route.query.id,
            customization: route.query.customization,
            status: route.query.status,
            type: route.query.type
          }
        })
      else router.push({ name: 'PurchaseOrders' })
    }
    function skuVal(str) {
      return JSON.parse(str).map(v => v.spe + '：' + v.speVal).join(' ')
    }
    onMounted(() => {
      console.log(route.query, 'route.query.status')
      reset()
      getDepartmentList().then(res => {
        state.deptList = res.data
      })
    })
    function changeSelect(val) {
      if (val == '4') {
        state.placeholderType = '请输入要检索的内容'
      } else {
        state.placeholderType = '请输入要检索的内容多条可用逗号或者空格隔开'
      }
    }
    //批量关闭采购商品
    function batchClosePurchase() {
      state.selectList = []
      state.selectList = state.tableData.filter(v => v.checked)
      if (!state.selectList.length) return ElMessage.error('请勾选列表数据')
      state.typeClose = 'batch'
      state.closePurchaseGoodsShow = true
    }
    //单条关闭采购商品
    function singleClosePurchase(type, row) {
      state.typeClose = type
      state.selectList = [row]
      state.closePurchaseGoodsShow = true
    }
    //关闭采购单返回方法
    function closePurchaseGoods(status) {
      state.selectList = []
      state.closePurchaseGoodsShow = false
      if (status) return search()

    }
    function selectable(row) {
      return !row.isClose && !row.arrivalQuantity
    }
    function handleSelectionChange(rows) {
      state.selectList = rows
    }
    //复选框优化
    function marksCheckboxAll(val) {
      state.indeterminate = false
      state.tableData.forEach(v => {
        v.checked = val
        if (v.isDisabled) {
          v.checked = false
        }
        
      })
      if(val){
          state.arr = state.tableData.map(item=>item.id)
        }else{
          state.arr = []
        }
    }
    function selectRows(row) {
      if (row.checked) state.indeterminate = !state.tableData.every(v => v.checked)
      else state.indeterminate = !state.tableData.every(v => !v.checked)
      state.allChecked = state.tableData.every(v => v.checked)
      state.arr = []
      state.tableData.forEach(item=>{
        if(item.checked){
          state.arr.push(item.id)
        }else{
          state.arr=state.arr.filter(v=>v!=item.id)
        }
      })
    }
    const isDisabled = computed(() => {
      return state.tableData.every(v => v.isDisabled)
    })
    return {
      ...toRefs(state),
      openCustomInfo,
      reset,
      search,
      updateData,
      getDeptId,
      ElSelectTreeRef,
      goBack,
      skuVal,
      changeSelect,
      isImgString,
      batchClosePurchase,
      closePurchaseGoods,
      singleClosePurchase,
      selectable,
      handleSelectionChange,
      marksCheckboxAll,
      selectRows,
      isDisabled,
    }
  }
}
</script>

<style lang="scss" scoped>
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: max-content;
  margin: 0 auto;
}
.flex {
  display: flex;
}

.form-box {
  // border-bottom: 1px dashed #aaa;
  padding: 16px;
  padding-bottom: 0;
  margin-bottom: 24px;
  background-color: #fff;
}
.table-box {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 60px;
  ::v-deep(.el-button + .el-button) {
    margin: 0;
  }
}

.text-row {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 225px;
  cursor: pointer;
}

.container {
  padding: 12px;
  padding-top: 0;
  margin-top: 24px;
}

::v-deep(.column-center) {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  margin-left: 8px;
  font-size: 12px;
}
</style>
