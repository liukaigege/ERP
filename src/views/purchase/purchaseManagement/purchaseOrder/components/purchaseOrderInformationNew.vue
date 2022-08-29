<template>
  <div class="orderInformation">
    <ErpNav title="订单信息" :goBack="goback" />
    <div class="formClass">
      <el-form :inline="true" :model="form" ref="formRef">
        <el-form-item label="搜索内容:">
          <el-select v-model="form.searchType" style="width:130px" @change="changeSelect">
            <el-option label="商品SKU" :value="1" />
            <el-option label="订单SKU" :value="2" />
            <el-option label="订单号" :value="3" />
            <!-- <el-option label="二维码ID" :value="4" /> -->
          </el-select>
          <el-input :placeholder="placeholderType" clearable style="width:320px;margin-left:10px" v-model="copySearchText" />
        </el-form-item>
        <!-- <el-form-item label="入库状态:">
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
        <el-form-item label="付款状态:">
          <el-select v-model="form.payStatus" style="width:150px">
            <el-option label="未申请" :value="1" />
            <el-option label="已申请" :value="2" />
            <el-option label="申请中" :value="3" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="团队:" style="margin-left:16px">
          <elSelectTree :data="deptList" :treeProps="{value: 'deptId', label: 'deptName',children: 'children'}" :width="200" filterable @ok="getDeptId" ref="ElSelectTreeRef" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableClass">
      <el-table :data="data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="商品信息" width="320px">
          <template #default="scope">
            <div class="goodsInfo">
              <div class="goodsImagesContainer">
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="scope.row.mainImg" fit="contain"></el-image>
                  <template #reference>
                    <el-image class="ml-10" style="width: 80px; height: 80px" :src="scope.row.mainImg" fit="contain"></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="goodsContent" style="width: 80%">
                <el-tooltip placement="top">
                  <template #content>
                    <p style="cursor: pointer" v-copy="scope.row.skuCode">
                      复制
                    </p>
                  </template>
                  <p :title="scope.row.skuCode" class="text-row">
                    {{ scope.row.skuCode }}
                  </p>
                </el-tooltip>
                <p>￥{{Number(scope.row.goodsPrice).toFixed(2)}}</p>
                <p v-if="scope.row.skuValue">
                  {{JSON.parse(scope.row.skuValue).map(v => v.spe +'：'+ v.speVal).join(' ')}}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="订单信息" align="center" :min-width="200">
          <template #default="scope">
            <el-tooltip placement="top">
              <template #content>
                <p style="cursor: pointer" v-copy="scope.row.sku">
                  复制
                </p>
              </template>
              <p :title="scope.row.sku" class="pClass">
                {{ scope.row.sku }}
              </p>
            </el-tooltip>
            <p>
              {{ scope.row.currency }}
              {{Number(scope.row.price).toFixed(2)}}
            </p>
          </template>
        </el-table-column> -->
        <el-table-column label="订单号" align="center" prop="orderId" width="200">
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
        <el-table-column prop="deliveryTime " label="付款时间" align="center" width="170">
          <template #default="{row}">
            <div>{{row.paymentTime?row.paymentTime:'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsQuantity" label="数量" align="center" width="60"></el-table-column>
        <!-- <el-table-column prop="arrivalQuantity" label="到货数量" align="center" :width="90"></el-table-column> -->
        <!-- <el-table-column prop="orderId" label="配件金额" align="center" :min-width="200">
          <template #default="{row}">
            <p v-if="row.partSwitch==0">-</p>
            <p v-if="row.importStatus==1 && row.partSwitch">未导入</p>
            <p v-if="row.importStatus==3 && row.partSwitch">{{row.partTotalPrice}}</p>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="deliveryTime " label="入库时间" align="center" :width="110">
          <template #default="{row}">
            <div>{{row.deliveryTime?row.deliveryTime:'-' }}</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="payStatus " label="付款状态" align="center" :min-width="90">
          <template #default="{row}">
            <div v-if="!row.payStatus">未申请</div>
            <div v-if="row.payStatus==1">申请中</div>
            <div v-if="row.payStatus==2">已付款</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="orderRelId" label="二维码ID" align="center" :min-width="200"></el-table-column> -->
        <el-table-column prop="customValue" label="定制属性" align="center" width="">
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
        <el-table-column label="操作" fixed="right" align="center" :width="130">
          <template #default="scope">
            <el-button type="text" @click="openCustomInfo(scope.row)">查看定制信息</el-button>
            <el-popconfirm title="确定删除该条数据？" @confirm="deleteList(scope.row.id)">
              <template #reference>
                <el-button type="text" style="color:#fd4c60">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex-pagination page-fixed">
      <div style="position: relative;">
        <el-button type="primary" @click="batchDelete">批量删除</el-button>
        <el-button @click="goback">退出</el-button>
      </div>
      <div>
        <el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
        </el-pagination>
      </div>
    </div>
    <customInfo @closeEvent="isShow = false" v-if="isShow" :info="purchaseInfo" />
  </div>
</template>

<script>
import { getOrganizationTree } from '@/api/user'
import customInfo from './customInfo.vue'
import { ArrowLeft, PictureFilled } from '@element-plus/icons-vue'
import elSelectTree from "@/components/elSelectTree/index.vue"
import { deepCopy, treeToArr } from '@/utils/tool'
import ErpNav from '@/components/erpNav/index.vue'
import { onMounted, reactive, ref, toRefs } from 'vue-demi'
import { purchaseOfOrders, deleteItemRels } from '@/api/purchase/order'
import { useRoute, useRouter } from 'vue-router'
import { getDepartmentList } from '@/api/user.js'
import { orderEditDetail } from '@/api/purchase/order.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { renderCustomInfo, isImgString } from '@/utils/tool.js'
export default {
  props: {
    orderInformationId: {
      type: String,
    },
    informationForm: {
      type: Object
    },
    delRelIds: {
      type: Array,
      default: []
    }
  },
  components: {
    ErpNav,
    elSelectTree,
    customInfo,
    PictureFilled
  },
  emits: ['orderInformatinBack', 'selectList'],
  setup(props, context) {
    const ElSelectTreeRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      placeholderType: '请输入要检索的内容多条可用逗号或者空格隔开',
      form: {
        searchType: 1,
        deptId: '',
        searchText: '',
        deliveryTimeStart_deliveryTimeEnd: [],
        purchaseStatus: null,
        payStatus: null,
      },
      copySearchText: '',
      data: [],
      deptList: [],
      selectList: [],
      page: {
        pageSize: 100, //分页
        pageNo: 1 //分页
      },
      deleteFlag: false,
      purchaseInfo: {},
      isShow: false,
      paginationTotal: 0, //分页总数据条数
      paginationArr: [100, 200, 300, 400, 500] //分页每页选择条数默认数据
    })
    onMounted(() => {
      getDepartmentList().then(res => {
        state.deptList = res.data
      })
      query()
    })
    function query() {
      let data = {
        page: state.page,
        purchaseOrderItemId: props.orderInformationId,
        purchaseOrderNumber: '',
        delRelIds: props.delRelIds
      }
      Object.assign(state.form, data)
      purchaseOfOrders(state.form).then(res => {
        state.data = res.data.dataList
        state.data.forEach(item => {
          if (item.customValue) {
            const copyCustomValue = JSON.parse(item.customValue)
            item.customValue = renderCustomInfo(copyCustomValue, 2)
          } else {
            item.customValue = []
          }
        })
        state.paginationTotal = res.data.page.totalCount
      })
    }
    function search() {
      state.form.searchText = state.copySearchText
      // if (state.form.searchType == 4) {
      //   let result
      //   try {
      //     result = JSON.parse(state.copySearchText)
      //   } catch {
      //     result = state.copySearchText
      //   }
      //   if (result.ivtPurchaseDetailId) {
      //     state.form.searchText = result.ivtPurchaseDetailId.toString()
      //   } else {
      //     const resultStr = result.toString()
      //     const symbolList = [',', '，', '[', ']', '。', '.', '?', '!', '%', '}{','}"','"{']
      //     if (symbolList.some(item => resultStr.indexOf(item) > -1)) return ElMessage.error('二维码ID格式不正确')
      //     state.form.searchText = resultStr
      //   }
      // }
      query()
    }
    function reset() {
      ElSelectTreeRef.value.init(false)
      state.page.pageSize = 100
      state.page.pageNo = 1
      state.form.searchType = 1
      state.form.searchText = ''
      state.copySearchText = ''
      state.form.deptId = null
      state.form.deliveryTimeStart_deliveryTimeEnd = []
      state.form.purchaseStatus = null
      state.form.payStatus = null
      query()
    }
    function handleSelectionChange(rows) {
      state.selectList = rows.map(item => item.id)
    }
    //分页
    const handleSizeChange = val => {
      state.page.pageSize = val
      state.page.pageNo = 1
      query()
    }
    const handleCurrentChange = val => {
      state.page.pageNo = val
      query()
    }
    function goback() {
      context.emit('orderInformatinBack')
    }
    function getDeptId(v) {
      state.form.deptId = v
    }
    function openCustomInfo(row) {
      state.isShow = true
      row.paymentIstrue = true
      state.purchaseInfo = row
    }
    //单个删除
    function deleteList(id) {
      let params = {
        id: props.informationForm.id,
        type: props.informationForm.type,
        delRelIds: [...props.delRelIds, id],
        customization: "1"
      }
      orderEditDetail(params).then(res => {
        let flag
        if (!res.data.orderItems?.length) {
          flag = false
        } else {
          flag = true
        }
        if (flag) {
          state.data.splice(state.data.findIndex(u => u.id == id), 1)
          context.emit('selectList', [...props.delRelIds, id])
          state.paginationTotal = state.paginationTotal - 1
        } else {
          return ElMessage.error('至少保留一条数据')
        }
      })
    }
    //批量删除
    function batchDelete() {
      if (!state.selectList.length) return ElMessage.warning('请勾选列表数据')

      ElMessageBox.confirm('是否确认批量删除', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        "close-on-click-modal": false,
        "close-on-press-escape": false
      }).then(() => {
        let params = {
          id: props.informationForm.id,
          type: props.informationForm.type,
          delRelIds: [...props.delRelIds, ...state.selectList],
          customization: "1"
        }

        orderEditDetail(params).then(res => {
          let flag
          if (!res.data.orderItems?.length) {
            flag = false
          } else {
            flag = true
          }
          if (flag) {
            state.data = state.data.filter(v => !state.selectList.some(val => val == v.id))
            state.paginationTotal = state.paginationTotal - state.selectList?.length
            context.emit('selectList', [...props.delRelIds, ...state.selectList])
          } else {
            return ElMessage.error('至少保留一条数据')
          }
        })

      })
    }
    function changeSelect(val) {
      // console.log(val, 'valval')
      // if (val == '4') {
      //   state.placeholderType = '请输入要检索的内容'
      // } else {
      //   state.placeholderType = '请输入要检索的内容多条可用逗号或者空格隔开'
      // }
    }
    return {
      ...toRefs(state),
      search,
      reset,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      goback,
      getDeptId,
      ElSelectTreeRef,
      openCustomInfo,
      deleteList,
      batchDelete,
      changeSelect,
      renderCustomInfo,
      isImgString
    }
  }

}
</script>

<style lang="scss" scoped>
.orderInformation {
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
    .customValueList {
      display: inline;
    }
  }
  .formClass {
    margin: 24px 0;
    background: #fff;
    padding: 16px;
    padding-bottom: 0;
  }
  .tableClass {
    background: #fff;
    padding: 16px;
    .text-row {
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 225px;
      cursor: pointer;
    }
    .goodsInfo {
      display: flex;
      .goodsImagesContainer {
        display: flex;
        align-items: center;
      }
      .goodsContent {
        text-align: left;
        box-sizing: border-box;
        padding: 0 15px;
      }
    }
  }
}
</style>
