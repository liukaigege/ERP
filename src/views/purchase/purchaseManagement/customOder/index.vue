<!--
* @Descripttion: Vango ERP customOder 查看定制品采购订单信息详情页面
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="customOderContainer">
    <div v-if="!detailListShow" class="customOderinfoContainer">
      <ErpNav :title="
          pageType == 1 ? '订单信息' : pageType == 4 ? '标记普货' : '请选择商品'
        " :goBack="goBack" />
      <div class="header-container">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="搜索内容:">
            <div class="searchContent">
              <el-select v-model="searechType" placeholder="全部" clearable>
                <el-option label="商品SKU" value="1" />
                <el-option label="订单SKU" value="2" />
                <el-option label="订单号" value="3" />
              </el-select>&nbsp;&nbsp;
              <el-input clearable v-model="keyWords" @keydown.enter="queryDetail" placeholder="请输入要检索的内容多条可用逗号或空格隔开" />
            </div>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item label="团队:">
            <el-cascader v-model="form.deptIds" :options="oraganziationList" :show-all-levels="false" clearable :props="{
                checkStrictly: true,
                expandTrigger: 'click',
                label: 'deptName',
                value: 'deptId',
                children: 'children',
								emitPath:false
              }">
            </el-cascader>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" @click="queryDetail">查询</el-button>
            <el-button @click="init">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableContainer">
        <el-table ref="multipleTableRef" v-if="oraganziationList" :data="list" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column v-if="tabPosition" type="selection" width="55" align="center" />
          <el-table-column label="商品信息" align="center" min-width="363">
            <template #default="{row}">
              <div class="goodsInfo">
                <div class="goodsImagesContainer">
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image class="ml-10" style="width: 70px; height: 70px" :src="row.mainImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="goodsContent" style="width: 80%">
                  <el-tooltip placement="top">
                    <template #content>
                      <p style="cursor: pointer" v-copy="row.skuCode">
                        复制
                      </p>
                    </template>
                    <p :title="row.skuCode" class="pClass">
                      {{ row.skuCode }}
                    </p>
                  </el-tooltip>
                  <p>&yen; {{ row.lastPurchasePrice || row.purchasePrice }}</p>
                  <p v-if="row.skuValue">
                    <span v-for="v in row.skuValue" :key="v.id">{{ v.spe }}:{{ v.speVal }}&nbsp;&nbsp;
                    </span>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="orderInfo.orderId" label="订单号" align="center" width="180" />
          <el-table-column property="orderInfo.paymentTime" label="付款时间" align="center" width="150">
            <template #default="{row}">
              <div v-if="row.orderInfo?.paymentTime">
                <p>{{ row.orderInfo?.paymentTime?.split(' ')[0] }}</p>
                <p>{{ row.orderInfo?.paymentTime?.split(' ')[1] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="goodsQuantity" label="数量" align="center" width="100" show-overflow-tooltip />
          <el-table-column label="定制属性" align="center" width="300">
            <template #default="{row}">
              <el-popover placement="left-end" trigger="hover" width="auto">
                <div>
                  <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                    <span v-if="v.type == 'upload_img' || v.type == 'img_options' || v.type == 'sub_options'">
                      {{v.field}}：
                      <el-popover placement="right-start" trigger="hover" width="auto">
                        <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                        <template #reference>
                          <el-icon style="font-size: 20px;position: relative;top: 3px;">
                            <PictureFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </span>
                    <span v-else>{{v.field}}：{{v.value}}</span>
                  </div>
                </div>
                <template #reference>
                  <div class="customValueContainer">
                    <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                      <span v-if="v.type == 'upload_img' || v.type == 'img_options' || v.type == 'sub_options'">
                        {{v.field}}：
                        <el-popover placement="right-start" trigger="hover" width="auto">
                          <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                          <template #reference>
                            <el-icon style="font-size: 20px;position: relative;top: 3px;">
                              <PictureFilled />
                            </el-icon>
                          </template>
                        </el-popover>
                      </span>
                      <span v-else>{{v.field}}：{{v.value}}</span>
                    </div>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-if="pageType != 4" label="供应商" align="center" width="200">
            <template #default="{row}">
              <p class="pClass" :title="row.supplierName">
                <span v-if="row.supplierName || pageType === 1">{{
                  row.supplierName || '未设置'
                }}</span>
                <el-button v-else @click="remarkRowList(row)">未设置</el-button>
              </p>
              <p class="pClass" v-if="row.partnerTypeName">
                <el-link v-if="row.storeHomePage" :href="
                    row.partnerType === 2 ? row.storeHomePage : null
                  " type="primary" target="_blank">{{ row.partnerTypeName }}</el-link>
                <span type="text" :style="row.partnerTypeName?'color:var(--el-color-primary)':''" v-else>{{ row.partnerTypeName }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template #default="{row}">
              <el-button type="text" @click="showCustomInfo(row)">查看定制信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <CustomInfo v-if="!!customInfoData" :data="customInfoData" :nobtn="pageType != 1 && pageType != 4" :tabPosition="tabPosition" @customInfoClose="customInfoClose" />
      <ErpFooter>
        <div class="footer">
          <div class="left-box">
            <div v-if="tabPosition != 0">已选{{ selectList?.length || 0 }}条</div>
            <div style="margin-left: 35px">
              <el-button v-permission="'outStock:btn:supplier'" type="primary" @click="setSuplierFn" v-if="(pageType == 2) && tabPosition != 0">设置供应商</el-button>
              <el-button v-permission="'outStock:btn:remarkNor'" type="primary" @click="remarkList" v-if="(pageType == 1 || pageType == 4) && tabPosition != 0">标为普货</el-button>
              <el-button type="primary" @click="setPlan" v-if="(pageType == 2 || pageType == 1) && tabPosition != 0" v-permission="'outStock:btn:batch:addPurchasePlan'">加入采购计划
              </el-button>
              <el-button type="primary" v-if="(pageType == 3 || pageType == 1) && tabPosition != 0" @click="createPurOrder" v-permission="'outStock:btn:createPurOrder'">生成采购单
              </el-button>
              <el-button @click="goBack"> 退 出 </el-button>
            </div>
          </div>
          <div class="right-box">
            <el-pagination :total="totalNum" :current-page="form.page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400, 500]" layout="total, sizes, prev, pager, next, jumper" :page-size="form.page.pageSize"></el-pagination>
          </div>
        </div>
      </ErpFooter>
    </div>

    <PurchaseOrder froms="customOder" :submitData="submitData" :searchData="searchData" :status="1" v-if="detailListShow" :submitType="0" :dataList="setOrderData" :param="setOrderData.param" @initData="initPurchaseOrderData" @refresh="detailToRefresh" @cancel="cancelPurchaseOrder" @deleteData="deleteData" />
    <SetSuplier v-if="setSuplierShow" @closeBack="closeBack" :selectList="selectList" :sigleData="sigleData" />
  </div>
</template>
<script>
import { reactive, toRefs, onActivated, onMounted } from 'vue'
import { purchaseOfOrders, addOrUpdate } from './composables/api'
import { form } from './composables/data'
import { deepCopy, treeToArr } from '@/utils/tool'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ArrowLeft, PictureFilled } from '@element-plus/icons-vue'
import CustomInfo from './components/customInfo.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { tagged } from './composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import PurchaseOrder from '@/views/purchase/purchaseManagement/components/cusPurchaseOrder.vue'
import { getOrganizationTree } from '@/api/user'
import { direct } from '@/api/purchase/outOfStock.js'
import SetSuplier from './components/setSuplier.vue'
import ErpNav from '@/components/erpNav/index.vue'
export default {
  components: {
    CustomInfo,
    ErpFooter,
    PurchaseOrder,
    SetSuplier,
    ErpNav,
    PictureFilled
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const goodsId = !!~route.query.id.indexOf(',')
      ? route.query.id.split(',')
      : [route.query.id]
    const idList = !!~route.query.idList.indexOf(',')
      ? route.query.idList.split(',')
      : [route.query.idList]
		const skuIdList = !!~route.query.skuIdList.indexOf(',')
      ? route.query.skuIdList.split(',')
      : [route.query.skuIdList]
    const tabPosition = route.query.tabPosition - 0 //是否搁置 （1：正常、0：搁置中）
    const formdata = { ...deepCopy(form), goodsIdList: goodsId, idList }
    const state = reactive({
      pageType: route.query.type - 0, // 1查看订单信息 2加入采购计划 3生成采购单 4标记普货 5订单信息(删除功能)
      form: deepCopy(formdata),
      searechType: '1',
      keyWords: null,
      list: [],
      totalNum: 0,
      customInfoData: null,
      selectList: [],
      detailList: [],
      detailListShow: false,
      oraganziationList: [], // 组织架构列表
      oraganziationArr: [],
      setSuplierShow: false,
      setOrderData: null,
      sigleData: null,
      needdelData: null,
      dataChange: false, // page data been changed
      submitData: null,
      searchData: null
    })
    getOrganizationTree().then(res => {
      if (res.code === 200) {
        state.oraganziationList = deleteChildren(res.data)
        state.oraganziationArr = [
          ...treeToArr(deepCopy(state.oraganziationList), 'children', true)
        ]
      }
    })

    onMounted(() => {
      queryDetail()
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

    // query the order's infomation list data
    function queryDetail() {
      const { page, deptIds, goodsIdList, idList } =
        state.form
      let listStr = '', skuCodeList = '', orderSkuList = '', orderIdList = ''
      if (state.keyWords) {
        if (!!~state.keyWords.indexOf(','))
          listStr = state.keyWords.split(',')
        else if (!!~state.keyWords.indexOf(' '))
          listStr = state.keyWords.split(' ')
        else if (!!~state.keyWords.indexOf('，'))
          listStr = state.keyWords.split('，')
        else
          listStr = [state.keyWords]
        if (state.searechType == 2)
          orderSkuList = listStr
        else if (state.searechType == 3)
          orderIdList = listStr
        else
          skuCodeList = listStr
      }
      const data = {
        goodsIdList,
        idList,
        page,
        deptIdList: deptIds ? [deptIds] : null,
        skuCodeList,
        orderSkuList,
        orderIdList,
        status: tabPosition,
				skuIdList:state.pageType === 1 ? null : skuIdList
      }
      purchaseOfOrders(data).then(res => {
        state.list = res.data.dataList.map((v, i) => {
          v.tempId = i
          return v
        })
        state.totalNum = res.data.page.totalCount
        state.selectList = []
      })
    }

    // init page search data
    function init() {
      state.form = deepCopy(formdata)
      state.searechType = '1'
      state.keyWords = null
      queryDetail()
    }

    // click back
    function goBack() {
      // if (state.dataChange) {
      //   // isCustom outOfStock
      router.push({
        name: 'outOfStock',
        // params: {
        //   isCustom: true,
        //   isRefresh: tabPosition == 1
        // }
      })
      // } else {
      //   router.back(-1)
      // }
    }

    // select the rows
    function handleSelectionChange(rows) {
      state.selectList = rows
    }

    // close the custom infomation dialog
    function customInfoClose(val) {
      state.customInfoData = null
      // if (val) queryDetail()
			if(val) goBack()
    }

    // query custom infomation dialog
    function showCustomInfo(val) {
      state.customInfoData = val
    }

    // change page size
    function handleSizeChange(val) {
      state.form.page.pageSize = val
      queryDetail()
    }

    // change page current
    function handleCurrentChange(val) {
      state.form.page.pageNo = val
      queryDetail()
    }

    // goods been marked
    function remarkList() {
      if (!state.selectList.length)
        return ElMessage.warning({ message: '请选择商品' })
      ElMessageBox.confirm('确认标记为普货？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        "close-on-click-modal": false,
        "close-on-press-escape": false
      })
        .then(() => {
          const paramsList = []
          state.selectList.forEach(v => {
            paramsList.push({
              productId: v.productId,
              orderSku: v.orderInfo.sku,
              orderId: v.orderInfo.orderId
            })
          })
          tagged({ list: paramsList }).then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '标记普货成功' })
              queryDetail()
              state.dataChange = true
							goBack()
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        })
        .catch(() => { })
    }

    function remarkRowList(val) {
      if (state.pageType === 1) return false
      state.sigleData = [val]
      state.setSuplierShow = true
    }

    // set plan
    function setPlan() {
      if (!state.selectList.length)
        return ElMessage.warning({ message: '请选择商品' })
      if (state.selectList.every(v => !v.supplierId))
        return ElMessage.warning('请设置供应商!')
      let params = {
        query: {
          type: 1,
          partnerType: null, //供应商类型（1：合作、2：1688、3：淘宝、4：拼多多）
          supplierId: null,
          warehouseId: null,
          skuCode: null,
          goodsId: null,
          goodsName: null,
          supplierName: null,
          customizationType: 1
        },
        skuList: []
      }
      state.selectList.forEach(v => {
        if (v.supplierId) {
          params.query = {
            type: 1,
            partnerType: v.partnerType, //供应商类型（1：合作、2：1688、3：淘宝、4：拼多多）
            supplierId: v.supplierId,
            warehouseId: 1,
            skuCode: v.skuCode,
            goodsId: v.goodsId,
            goodsName: v.goodsName,
            supplierName: v.supplierName,
            customizationType: 1
          }
          params.skuList.push({
            customization: 1,
            type: 1, //类型（1：缺货采购，2：备货采购）
            id: null, //采购计划id(修改用)
            suggestId: v.id, //采购建议id
            orderId: v.orderInfo.orderId, //订单号（新增定制品时该字段不能为空）
            productId: v.productId, //
            supplierId: v.supplierId,
            warehouseId: 1,
            skuId: v.skuId,
            quantity: v.goodsQuantity - 0,
            qtyOperateType: 2,
            price: v.purchasePrice,
            pairInfo: v.pairInfo
          })
        }
      })
      addOrUpdate(params)
        .then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '加入成功' })
            queryDetail()
            state.dataChange = true
						goBack()
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      // .catch(err => {
      //   ElMessage.error({ message: err.message })
      // })
    }

    // creat a purchase order
    function createEditPrice(lPrice, price, pairInfo, type, thirdId) {
      let p = lPrice != null ? Number(lPrice) : Number(price)
      if (type !== 2) return String(p) // 不是1688的就不用考虑配对商品价格
      if (
        pairInfo &&
        thirdId === JSON.parse(pairInfo).sellerUserId &&
        JSON.parse(pairInfo)?.price
      )
        return String(JSON.parse(pairInfo)?.price)
      // 备货有配对商品的时候用配对的单价
      if (lPrice > price + 3) p = price + 3
      return String(p)
    }
    function createPurOrder() {
      if (!state.selectList.length)
        return ElMessage.warning({ message: '请选择商品' })
      if (state.selectList.every(v => !v.supplierId))
        return ElMessage.warning('请设置供应商!')
      let skuList = []
      let relIdList = []
      const param = []
      state.selectList.forEach(v => {
        if (v.supplierId) {
          skuList.push({
            id: v.id,
            supplierId: v.supplierId,
            quantity: v.goodsQuantity - 0,
            purchasePrice: createEditPrice(
              v.lastPurchasePrice,
              v.purchasePrice,
              v.pairInfo,
              v.partnerType,
              v.thirdPlatformSupplierId
            ),
            relIdList: [v.orderInfo?.relId]
          })
          relIdList.push(v.orderInfo?.relId)
        }
        param.push({
          quantity: v.quantity,
          suggestId: v.id
        })
      })
      state.submitData = { skuList, relIdList, customizationType: 1 }
      direct({ skuList, relIdList, customizationType: 1 }).then(res => {
        if (res.code == 200) {
          state.detailListShow = false
          state.setOrderData = {
            data: res.data,
            param,
            type: 0
          }
          state.searchData = { skuList, relIdList, customizationType: 1 }
          state.detailListShow = true
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    function checkDaptName(id) {
      const deptName =
        state.oraganziationArr.filter(v => v.deptId == id)[0]?.deptName || ''
      return deptName
    }
    function closeBack(val) {
      state.sigleData = null
      state.setSuplierShow = false
      if (val) {
        const {
          partnerType,
          partnerTypeName,
          supplierId,
          supplierName,
          idList
        } = val
        const tempIndexList = state.selectList.map(v => v.tempId)
        state.list.forEach(v => {
          if (tempIndexList.some(vl => vl == v.id)) {
            v.partnerType = partnerType
            v.partnerTypeName = partnerTypeName
            v.supplierId = supplierId
            v.supplierName = supplierName
          }
        })
        state.selectList.forEach(v => {
          v.partnerType = partnerType
          v.partnerTypeName = partnerTypeName
          v.supplierId = supplierId
          v.supplierName = supplierName
        })
        state.dataChange = true
      }
    }
    function setSuplierFn() {
      if (!state.selectList.length)
        return ElMessage.warning({ message: '请选择商品' })
      state.setSuplierShow = true
    }
    function detailToRefresh(data) {
      state.detailListShow = false
      state.dataChange = true
      queryDetail()
    }
    function cancelPurchaseOrder(data) {
      state.selectList = []
      state.detailListShow = false
    }
    function deleteData(data) {
      state.needdelData = data
      state.detailListShow = false
    }
    function initPurchaseOrderData() {
      createPurOrder()
    }

    return {
      ...toRefs(state),
      tabPosition,
      ArrowLeft,
      queryDetail,
      goBack,
      init,
      deleteData,
      showCustomInfo,
      handleSelectionChange,
      initPurchaseOrderData,
      customInfoClose,
      handleSizeChange,
      handleCurrentChange,
      remarkList,
      remarkRowList,
      setPlan,
      createPurOrder,
      checkDaptName,
      closeBack,
      setSuplierFn,
      detailToRefresh,
      cancelPurchaseOrder
    }
  }
}
</script>
<style lang='scss' scoped>
.header-container {
  background-color: #fff;
  padding: 20px 10px 0;
  box-sizing: border-box;
  margin-top: 20px;
}
.customOderContainer {
  :deep(.el-page-header__content) {
    width: 90%;
    text-align: center;
  }
}
.searchContent {
  display: flex;
}
// .demo-form-inline {
//   padding-top: 30px;
// }
.pClass {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.goodsInfo {
  display: flex;
  .goodsContent {
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
  }
}
.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  .left-box {
    display: flex;
    align-items: center;
  }
  .right-box {
    flex-grow: 1;
  }
}
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
	width: 200px;
  margin: 0 auto;
}
</style>
