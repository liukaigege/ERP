<!--
* @Descripttion: Vango ERP customCart
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div v-if="!detailListShow">
      <ErpNav title="采购计划" :goBack="cancel" />
      <div class="formHeader">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="搜索内容:">
            <div class="searchContent">
              <el-select v-model="searchType" placeholder="全部" clearable>
                <el-option label="商品SKU" value="1" />
                <el-option label="订单SKU" value="2" />
                <el-option label="订单号" value="3" />
              </el-select>&nbsp;&nbsp;
              <el-input v-model="keyWords" clearable placeholder="请输入要检索的内容多条可用逗号或空格隔开" @keydown.enter="queryList" />
            </div>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item label="供应商:">
            <el-cascader v-model="supplierIds" :options="supllierList" filterable :props="{
							expandTrigger: 'hover',
							checkStrictly: true,
							children: 'childs',
							value: 'id',
							label: 'name',
						}" clearable placeholder="全部"></el-cascader>
          </el-form-item>
          <el-form-item label="团队:">
            <el-cascader v-model="form.deptId" :options="oraganziationList" :show-all-levels="false" clearable :props="{
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
            <el-button type="primary" @click="queryList">查询</el-button>
            <el-button @click="init">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableListContainer">
        <ul class="tableListHeader">
          <li class="tableListHeaderList header_check">
            <el-checkbox v-model="checkAll" @change="checkboxAll" :indeterminate="indeterminate" size="large" />
          </li>
          <li class="tableListHeaderList header_goodsInfo">商品信息</li>
          <!-- <li class="tableListHeaderList header_orderInfo">订单信息</li> -->
          <li class="tableListHeaderList header_orderId">订单号</li>
          <li class="tableListHeaderList header_payTime">付款时间</li>
          <li class="tableListHeaderList header_qty">数量</li>
          <!-- <li class="tableListHeaderList header_team">团队</li> -->
          <li class="tableListHeaderList header_orderInfo">定制属性</li>
          <li class="tableListHeaderList header_ctrl">操作</li>
        </ul>
        <ul class="tableListInnerContainer" v-if="list&&list.length">
          <li class="tableList" v-for="(item, index) in list" :key="index">
            <div class="tableListContent">
              <div class="tableListContentHeader">
                <div class="tableListContentCheck">
                  <el-checkbox v-model="item.checkRowAll" :indeterminate="item.indeterminate" @change="checkboxChange(item.checkRowAll, index)" size="large" />
                </div>
                <div class="tableListContentTitle">
                  <span v-if="item.partnerTypeName">【{{ item.partnerTypeName }}】</span>&nbsp;&nbsp;{{ item.supplierName || '暂无供应商' }}
                </div>
              </div>
              <ul class="tableListContentContainer">
                <li class="tableListContentList" v-for="(v, i) in item.skuList" :key="i">
                  <ul class="contentListContainer">
                    <li class="contentList content_check">
                      <div class="contentListInner contentListInner_check">
                        <el-checkbox v-model="v.checkList" @change="checkListChange(v.checkList, index, i)" size="large" />
                      </div>
                    </li>
                    <li class="contentList content_goodsInfo">
                      <div class="contentListInner goods_info_content">
                        <div class="images_conatiner">
                          <el-popover placement="right-start" trigger="hover" width="auto">
                            <el-image style="width: 200px; height: 200px" :src="v.mainImg" fit="contain"></el-image>
                            <template #reference>
                              <el-image class="ml-10" style="width: 70px; height: 70px;margin-top: 4px;" :src="v.mainImg" fit="contain"></el-image>
                            </template>
                          </el-popover>
                        </div>
                        <div class="goods_infomation_container">
                          <el-tooltip placement="top">
                            <template #content>
                              <p style="cursor: pointer" v-copy="v.skuCode">
                                复制
                              </p>
                            </template>
                            <p :title="v.skuCode" class="pClass">
                              {{ v.skuCode }}
                            </p>
                          </el-tooltip>
                          <p class="greyColor">&yen; {{ v.lastPurchasePrice ||  v.purchasePrice }}</p>
                          <p class="grayColor" v-if="v.skuValue && v.skuValue.length">
                            <span v-for="(val, key) in v.skuValue" :key="key">{{ val.spe }}:{{ val.speVal }}&nbsp;&nbsp;
                            </span>
                          </p>
                        </div>
                      </div>
                    </li>
                    <!-- <li class="contentList content_orderInfo">
											<div class="contentListInner" style="text-align: center;">
												<el-tooltip placement="top">
												<template #content>
													<p style="cursor: pointer" v-copy="v.orderSku">
														复制
													</p>
												</template>
												<p :title="v.orderSku" class="pClass">
													{{ v.orderSku }}
												</p>
											</el-tooltip>
												<p>{{v.currency}} {{ v.skuPrice }}</p>
											</div>
										</li> -->
                    <li class="contentList content_orderId">
                      <div class="contentListInner">{{ v.orderId }}</div>
                    </li>
                    <li class="contentList content_payTime">
                      <div class="contentListInner">{{ v.paymentTime }}</div>
                    </li>
                    <li class="contentList content_qty">
                      <div class="contentListInner">{{ v.quantity }}</div>
                    </li>
                    <!-- <li class="contentList content_team">
											<div class="contentListInner">{{ v.deptName }}</div>
										</li> -->
                    <li class="contentList content_orderInfo">
                        <el-popover placement="left-end" trigger="hover" width="auto">
                          <div class="contentListInner">
                            <div class="customValueList" v-for="(v,i) in v.customValue" :key="i">
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
                            <div class="customValueContainer contentListInner" style="width: 80%;">
                              <div class="customValueList" v-for="(v,i) in v.customValue" :key="i">
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
                    </li>
                    <li class="contentList content_ctrl">
                      <div class="contentListInner">
                        <el-button type="text" @click="queryCustomVAlue(v)">查看定制信息</el-button>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="tableEmptyContainer" v-if="!list || !list.length">暂无数据</div>
      </div>
      <CustomInfo v-if="!!customInfoData" :nobtn="true" :data="customInfoData" @customInfoClose="customInfoClose" />
      <ErpFooter>
        <div class="footer">
          <div class="left-box">
            <div>已选{{ selectListNum || 0 }}条</div>
            <div style="margin-left: 35px">
              <el-button type="primary" @click="removeOut" v-permission="'removePurchasePlan'">移出计划
              </el-button>
              <el-button type="primary" @click="createPurOrder" v-permission="'outStock:btn:createPurOrder'">生成采购单
              </el-button>
              <el-button @click="cancel"> 退 出 </el-button>
            </div>
          </div>
          <div class="right-box">
            <el-pagination :total="totalNum" :current-page="form.page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5,10,20,30,50]" layout="total, sizes, prev, pager, next, jumper" :page-size="form.page.pageSize"></el-pagination>
          </div>
        </div>
      </ErpFooter>
    </div>
    <PurchaseOrder froms="customCart" :submitData="searchData" :status="1" :searchData="searchData" v-if="detailListShow" :submitType="1" :dataList="setOrderData" :param="setOrderData.param" @refresh="detailToRefresh" @cancel="cancelPurchaseOrder" />
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import ErpNav from '@/components/erpNav/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { deepCopy } from '@/utils/tool'
import { getOrganizationTree } from '@/api/user'
import { customPlanList, deletePlan, direct, renderCat } from '@/api/purchase/outOfStock.js'
import { ElMessage } from 'element-plus'
import CustomInfo from '../../customOder/components/customInfo.vue'
import queryCustomVue from '../dialog/queryCustom.vue'
import PurchaseOrder from '@/views/purchase/purchaseManagement/components/cusPurchaseOrder.vue'
import { PictureFilled } from '@element-plus/icons-vue'
export default {
  props: {
    supllierList: Array
  },
  components: {
    ErpNav,
    ErpFooter,
    CustomInfo,
    PurchaseOrder,
    PictureFilled
  },
  emits: ['closeCart'],
  setup(props, { emit }) {
    const form = {
      deptId: null,
      deptIdList: null, //团队ID
      skuCode: null, //skuId
      orderSku: null, //订单sku
      orderId: null, //订单号
      warehouseId: 1,
      goodsId: null,
      supplierId: null,
      supplierName: null,
      goodsName: null,
      type: 1,
      customizationType: 1, //定制品类型（0：普通，1：定制）
      partnerType: null,
      page: {
        pageNo: 1,
        pageSize: 5
      }
    }

    const state = reactive({
      keyWords: null,
      searchType: '1',
      form: deepCopy(form),
      list: [],
      totalNum: 0,
      customInfoData: null,
      selectListNum: 0,
      detailList: [],
      detailListShow: false,
      oraganziationList: [],
      selectedList: [],
      checkAll: false,
      indeterminate: false,
      setOrderData: null,
      searchData: null,
      supplierIds: null
    })

    function checkListChange(val, index, i) {
      if (val) {
        state.list[index].checkRowAll = state.list[index].skuList.every(
          v => v.checkList
        )
        state.checkAll = state.list.every(v => v.checkRowAll)
      } else {
        state.list[index].checkRowAll = false
        state.checkAll = false
      }
      if (state.list[index].skuList.every(v => v.checkList == val))
        state.list[index].indeterminate = false
      else state.list[index].indeterminate = true
      if (state.list.every(v => v.checkRowAll == val && !v.indeterminate)) state.indeterminate = false
      else state.indeterminate = true
      cusNum()
    }
    function checkboxChange(val, index) {
      if (val) state.checkAll = state.list.every(v => v.checkRowAll)
      else state.checkAll = false
      if (state.list.every(v => v.checkRowAll == val)) state.indeterminate = false
      else state.indeterminate = true
      state.list[index].indeterminate = false
      state.list[index].skuList.forEach(v => (v.checkList = val))
      cusNum()
    }
    function checkboxAll() {
      state.indeterminate = false
      state.list = state.list.map(v => {
        v.checkRowAll = state.checkAll
        v.indeterminate = false
        v.skuList.forEach(val => {
          val.checkList = state.checkAll
        })
        return v
      })
      cusNum()
    }
    function cusNum() {
      state.selectListNum = 0
      state.list.forEach(v => {
        v.skuList.forEach(val => {
          if (val.checkList) state.selectListNum++
        })
      })
    }

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
    queryList()

    function cancel() {
      emit('closeCart', false)
    }
    function init() {
      state.form = deepCopy(form)
      state.searchType = '1'
      state.keyWords = null
      queryList()
    }
    function queryList() {
      if (state.searchType == '2')
        state.form.orderSku = state.keyWords
      else if (state.searchType == '3')
        state.form.orderId = state.keyWords
      else
        state.form.skuCode = state.keyWords
      state.form.deptIdList = state.form.deptId ? [state.form.deptId] : null

      if (state.supplierIds) {
        if (state.supplierIds[0] === -1) {
          state.form.partnerType = null
          state.form.supplierId = -1
        } else {
          state.form.partnerType = state.supplierIds[0]
          state.form.supplierId = state.supplierIds?.length > 1 ? state.supplierIds[1] : null
        }
      } else {
        state.form.partnerType = null
        state.form.supplierId = null
      }
      customPlanList(state.form).then(res => {
        if (res.code == 200) {
          state.checkAll = false
          state.indeterminate = false
          state.list = res.data.dataList?.map(v => {
            v.checkRowAll = false
            v.indeterminate = false
            v.skuList.forEach(val => {
              val.checkList = false
            })
            return v
          })
          state.totalNum = res.data.page.totalCount
        } else ElMessage.error(res.message)
      })
    }
    function removeOut() {
      if (!state.selectListNum) return ElMessage.error('请选择商品')
      const list = []
      state.list.forEach(v => {
        v.skuList.forEach(val => {
          if (val.checkList) {
            const tempObj = {
              id: val.id,
              orderId: val.orderId
            }
            list.push(tempObj)
          }
        })
      })
      const obj = {
        list,
        query: {
          type: 1,
          partnerType: null,//供应商类型（1：合作、2：1688、3：淘宝、4：拼多多）
          supplierId: null,
          warehouseId: 1,
          skuCode: null,
          goodsId: null,
          goodsName: null,
          supplierName: null,
          customizationType: 1,
        }
      }
      deletePlan(obj)
        .then(res => {
          if (res.code == 200) {
            state.selectListNum = 0
            queryList()
            ElMessage.success('移除成功')
          }
          else ElMessage.error(res.message)
        })
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
      if (!state.selectListNum) return ElMessage.error('请选择商品')
      const skuList = []
      const relIdList = []
      const param = []
      state.list.forEach(v => {
        if (v.supplierName) v.skuList.forEach(val => {
          if (val.checkList) {
            skuList.push({
              id: val.id,
              quantity: val.quantity - 0,
              skuId: val.skuId,
              purchasePrice: createEditPrice(
                val.lastPurchasePrice,
                val.purchasePrice,
                val.pairInfo,
                v.partnerType,
                v.thirdPlatformSupplierId
              ),
              relIdList: [val.relId]
            })
            relIdList.push(val.relId)
            param.push({
              quantity: val.quantity,
              suggestId: val.id
            })
          }
        })
      })
      if (skuList.length === 0) return ElMessage.error('请设置供应商')
      renderCat({ skuList, relIdList, customizationType: 1 }).then(res => {
        if (res.code == 200) {
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
      // renderCat
    }
    function detailToRefresh(data) {
      state.detailListShow = false
      queryList()
    }
    function cancelPurchaseOrder(data) {
      state.detailListShow = false
    }
    function handleSizeChange(val) {
      state.form.page.pageSize = val
      queryList()
    }
    function handleCurrentChange(val) {
      state.form.page.pageNo = val
      queryList()
    }
    function queryCustomVAlue(data) {
      state.customInfoData = data
    }
    function customInfoClose(val) {
      state.customInfoData = null
      if (val) queryList()
    }

    return {
      ...toRefs(state),
      cancel,
      init,
      queryList,
      removeOut,
      checkboxAll,
      checkboxChange,
      createPurOrder,
      checkListChange,
      customInfoClose,
      handleSizeChange,
      queryCustomVAlue,
      handleCurrentChange,
      detailToRefresh,
      cancelPurchaseOrder
    }
  }
}
</script>
<style lang='scss' scoped>
.goods_info_content {
  width: 90%;
  display: flex;
  justify-content: flex-start;
  .images_conatiner {
    width: 100px;
  }
  .goods_infomation_container {
    max-width: 70%;
    p {
      line-height: 25px;
    }
    .grayColor {
      color: #666;
    }
    .greyColor {
      color: #888;
    }
  }
}
.tableListContainer {
  border: 1px solid #e8eaec;
  margin: 20px 0 20px;
  .tableListHeader {
    border-bottom: 1px solid #e8eaec;
    background-color: #f8f8f9;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    text-align: center;
    .tableListHeaderList {
      border-left: 1px solid #e8eaec;
    }
    .header_check {
      width: 55px;
      box-sizing: border-box;
      padding-left: 13px;
      border-left: none;
    }
    .header_goodsInfo {
      flex: 4;
    }
    .header_orderInfo {
      flex: 3;
    }
    .header_orderId {
      flex: 2;
    }
    .header_payTime {
      flex: 2;
    }
    .header_qty {
      flex: 1;
    }
    .header_team {
      flex: 2;
    }
    .header_ctrl {
      flex: 2;
    }
  }
  .tableListContentHeader {
    border-bottom: 1px solid #e8eaec;
    background-color: #f8f8f9;
    display: flex;
    line-height: 40px;
    .tableListContentCheck {
      text-align: center;
      width: 55px;
      box-sizing: border-box;
      padding-left: 13px;
    }
    .tableListContentTitle {
      border-left: 1px solid #e8eaec;
    }
  }
  .contentListContainer {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaec;
    height: 122px;
    .contentList {
      border-left: 1px solid #e8eaec;
      position: relative;
      .contentListInner {
        max-width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .contentListInner_check {
        text-align: center;
        box-sizing: border-box;
        padding-left: 13px;
      }
    }
    .content_check {
      width: 55px;
      border-left: none;
    }
    .content_goodsInfo {
      flex: 4;
    }
    .content_orderInfo {
      flex: 3;
    }
    .content_orderId {
      flex: 2;
    }
    .content_payTime {
      flex: 2;
    }
    .content_qty {
      flex: 1;
    }
    .content_team {
      flex: 2;
    }
    .content_ctrl {
      flex: 2;
    }
  }
  .tableEmptyContainer {
    height: 120px;
    line-height: 120px;
    color: #888;
    text-align: center;
  }
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
.pClass {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.tableListContentContainer {
  background-color: #fff;
}
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
