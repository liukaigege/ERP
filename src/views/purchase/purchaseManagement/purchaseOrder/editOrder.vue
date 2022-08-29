<template>
  <div>
    <div class="editPuchase" v-if="showEditPuchase">
      <erp-nav title="编辑采购单" :goBack="goBack"></erp-nav>
      <el-form class="top-form" :model="info" :rules="topRules" ref="topFormRef">
        <el-row>
          <el-form-item label="采购类型: ">
            <el-input :model-value="fmtPurchaseTyp(info.type)" disabled></el-input>
          </el-form-item>
          <el-form-item label="采购员: ">
            <el-input v-model="info.purchaseUser" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商: " prop="supplierId">
            <el-cascader v-model="info.supplierId" ref="cascaderRef" @change="setPairInfo" :options="supplierList" :show-all-levels="false" :props="{
              emitPath: false,
              value: 'id',
              label: 'name',
              children: 'childs'
            }"></el-cascader>
          </el-form-item>
          <el-form-item label="仓库: ">
            <el-select v-model="info.warehouseId">
              <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.warehouseId" :key="item.warehouseId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="1688账号" v-if="info.partnerType === 2" prop="accountId">
            <el-select v-model="info.accountId" @change="initAddress" clearable>
              <el-option :label="item.accountName" :value="item.id" v-for="item in accountList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="收货地址：" v-if="info.partnerType === 2" prop="address">
          <div class="address-box">
            <div class="address-info">{{ info.address || '-' }}</div>
            <span class="btn-change" @click="showAddress = true" v-show="info.accountId">更换地址</span>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" @click="batchDel(editRef)">批量删除</el-button>
        <el-button type="primary" @click="batchEdit()">批量修改</el-button>
        <!-- 备货有 添加商品-->
        <el-button type="primary" @click="openGoodsList" v-if="info.type == 2">添加商品</el-button>
      </div>
      <div class="table-warp" v-setHeight:minHeight="80">
        <vxe-table v-bind="editTableOption" ref="editRef" :data="info.orderItems">
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column title="商品信息" width="300">
            <template #default="{ row }">
              <div class="info-content">
                <div class="img-content">
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 80px; height: 80px" :src="row.mainImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="info-cell">
                  <div class="one-line" :title="row.skuCode">
                    {{ row.skuCode }}
                  </div>
                  <div :title="row.goodsName" class="two-line">
                    {{ row.goodsName }}
                  </div>
                  <div class="one-line" :title="fmtSpe(row.skuValue)">
                    {{ fmtSpe(row.skuValue) }}
                  </div>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="供应商商品信息" width="450">
            <template #default="{ row }">
              <!-- 1688 -->
              <div class="info-content" v-if="info.partnerType == 2">
                <div class="img-content">
                  <el-popover placement="right-start" trigger="hover" width="auto" v-if="row.pairInfo">
                    <el-image style="width: 200px; height: 200px" :src="row.pairInfo?.img" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 80px; height: 80px" :src="row.pairInfo?.img" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="info-cell">
                  <div class="two-line" :title="row.pairInfo?.name">
                    {{ row.pairInfo?.name }}
                  </div>
                  <div class="one-line" :title="fmtSpe(JSON.stringify(row.pairInfo?.speInfo))">
                    {{ fmtSpe(JSON.stringify(row.pairInfo?.speInfo)) }}
                  </div>
                  <div class="btn-content">
                    <el-button type="text" size="small" @click="openDialog(row)">{{ row.pairInfo ? '更换' : '配对' }}</el-button>
                  </div>
                </div>
                <div class="goods-attr">
                  <el-select v-model="row.goodAttribute" style="width:100px">
                    <el-option label="原品" :value="1" />
                    <el-option label="相似品" :value="2" />
                    <el-option label="替代品" :value="3" />
                  </el-select>
                </div>
              </div>
              <div class="info-content" v-else>
                <div class="img-content">
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 80px; height: 80px" :src="row.mainImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="info-cell">
                  <div class="two-line" :title="row.goodsName">
                    {{ row.goodsName }}
                  </div>
                  <div class="one-line" :title="fmtSpe(row.skuValue)">
                    {{ fmtSpe(row.skuValue) }}
                  </div>
                </div>
                <div class="goods-attr">
                  <el-select v-model="row.goodAttribute" style="width:100px">
                    <el-option label="原品" :value="1" />
                    <el-option label="相似品" :value="2" />
                    <el-option label="替代品" :value="3" />
                  </el-select>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="采购报价/上次采购价(￥)" width="180">
            <template #default="{ row }">
              <div>
                {{ row.purchasePrice == null ? '-' : row.purchasePrice }} /
                {{ row.lastPurchasePrice == null ? '-' : row.lastPurchasePrice }}
              </div>
            </template>
          </vxe-column>
          <vxe-column field="price" min-width="150" :title="customization == 0 ? '单价(￥)': '主件单价(￥)'" :edit-render="{}">
            <template #default="{ row }">
              <div :class="{'err-title': row.price > Number(row.purchasePrice * 1 + 3).toFixed(2) }">
                {{ row.partSwitch ? 0 : Number(row.price).toFixed(2) }}
              </div>
            </template>
            <template #edit="{ row }">
              <div>
                <el-input-number :disabled="!!row.partSwitch && customization==1" v-model="row.price" :min="0" :precision="2" style="width: auto" controls-position="right" :max="
                  info.partnerType != 2 ? Number(row.purchasePrice * 1 + 3).toFixed(2)*1 : 9999999.99
                " @change="val=>inputChange(val,row)"></el-input-number>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="purchaseQuantity" min-width="90" :title="customization == 0? '数量': '主件数量'" :edit-render="{enabled: customization == 0}">
            <template #edit="{ row }">
              <el-input-number v-model="row.purchaseQuantity" :min="1" :precision="0" style="width: auto" controls-position="right" :max="99999"></el-input-number>
            </template>
          </vxe-column>
          <!-- <vxe-column field="partsPrice" min-width="110" title="配件总价(￥)" v-if="customization == 1">
            <template #default="{ row }">
              <p>{{row.partsPrice}}</p>
              <el-button type="text" @click="openPrice(row.id)">修改</el-button>
            </template>
          </vxe-column>
          <vxe-column field="partsNum" min-width="100" title="配件数量" v-if="customization == 1"></vxe-column> -->
          <vxe-column field="partSwitch" min-width="100" title="配件金额" v-if="customization == 1">
            <template #header>
              <div>
                <span>配件金额</span>
                <el-tooltip class="box-item" effect="dark" raw-content content="<p>开启：前期未知定制商品采购价格，后期需导入采购金额</p><p>关闭：已知定制商品采购价格，根据所填价格生成采购单</p>" placement="top-start">
                  <el-icon style="cursor: pointer;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <el-switch v-model="row.partSwitch" @change="partSwitchChange(row)" :active-value="1" :inactive-value="0" />
            </template>
          </vxe-column>
          <vxe-column title="应付(￥)" min-width="100">
            <template #default="{ row }">
              {{calcPay(row)}}
            </template>
          </vxe-column>
          <vxe-column title="操作" min-width="50">
            <template #default="{ row }">
              <el-button v-if="row.customization" type="text" style="color: red" @click="del(row.id, row.skuId,true)">删除</el-button>
              <el-popconfirm v-else title="确定删除？" @confirm="del(row.id, row.skuId)">
                <template #reference>
                  <el-button type="text" style="color: red">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="table-footer">
          <el-form ref="formRef" :model="info" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="税率(%)：">
                  <el-input-number v-model="info.taxRate" :min="0.0" :max="100" :precision="2" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="结算方式：" label-width="100px" prop="settlementType">
                  <el-select v-model="info.settlementType" @change="setType">
                    <el-option v-for="item in settlementTypeList" :key="item.value" :label="item.typeName" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="info.settlementType == 1 || info.settlementType == 2">
                <el-form-item label="金额：" label-width="100px" v-if="info.settlementType == 1">
                  <div style="display: flex; width: 100%">
                    <el-form-item prop="settlementValue">
                      <vxe-input v-model="info.settlementValue" type="float" style="width: 100%" :min="0.0" :max="info.settlementUnit == 1 ? 100 : 9999999.99" :controls="false"></vxe-input>
                    </el-form-item>
                    <el-form-item prop="settlementUnit">
                      <el-select v-model="info.settlementUnit" style="width: 110px; margin-left: 10px" @change="info.settlementValue = ''">
                        <el-option label="%" value="1"></el-option>
                        <el-option label="元" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item v-if="info.settlementType == 2" label-width="30px" prop="settlementValue">
                  <el-radio-group v-model="info.settlementValue">
                    <el-radio label="30">30(天)</el-radio>
                    <el-radio label="45">45(天)</el-radio>
                    <el-radio label="60">60(天)</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="备货团队：" v-if="purchaseType === 2" prop="toDeptId">
                  <el-cascader v-model="info.toDeptId" :options="oraganziationList" :show-all-levels="false" clearable :props="{
                    expandTrigger: 'click',
                    label: 'deptName',
                    value: 'deptId',
                    children: 'children'
                  }">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-form-item label="备注类型：">
                  <el-select v-model="info.remarkTypeId" clearable @clear="info.remark = ''" :disabled="info.remarkUserFlag == 0">
                    <el-option v-for="item in remarkTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="info.remarkTypeId">
                <el-form-item label="备注内容：">
                  <el-input type="textarea" v-model="info.remark" :autosize="{ minRows: 3, maxRows: 6 }" :maxlength="100" :disabled="info.remarkUserFlag == 0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <erp-footer>
        <div class="footer">
          <div>
            <span>商品种类：{{ skuQuantity }} 种 </span>
            <span>数量总计：{{ purchaseQuantity }} 件 </span>
            <span>总计：</span>
            <span style="color: red">￥{{ totalAmount }}</span>
          </div>
          <div>
            <el-button @click="goBack">取消</el-button>
            <el-button @click="commit(1)">{{
            type == 3 ? '保存草稿' : '保存'
          }}</el-button>
            <el-button type="primary" @click="commit(2)">下单并提交审核</el-button>
          </div>
        </div>
      </erp-footer>
    </div>
    <goods-list v-if="showGoodsList" @close="showGoodsList = false" @returnGoods="addGoods"></goods-list>
    <match-goods v-if="showDialog" @cancel="showDialog = false" @ok="getInfo" :query="goodsInfo"></match-goods>
    <address-list v-if="showAddress" :id="info.accountId" :addressId="info.addressId" @close="showAddress = false" @change="updateAddress"></address-list>
    <edit-dialog v-if="showEdit" :editRef="editRef" @close="showEdit = false" />
    <AccessoryPrice v-if="showPrice" @closeEvent="showPrice = false" :itemId="itemId" @saveSuccess="saveSuccess" :delRelIds="delRelIds" />
    <PurchaseOrderInformationNew v-if="showOrderInformation" :orderInformationId="orderInformationId" @orderInformatinBack="orderInformatinBack" :informationForm="informationForm" @selectList="selectList" :delRelIds="delRelIds" />
  </div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { editTableOption, rules, topRules } from './composables/options.js'
import { ref, shallowReactive, toRefs, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  warehouseList,
  settlementTypeList,
  purchaseTypeList
} from '@/assets/js/staticData.js'
import getEditInfo from './composables/editOrderHooks'
import { getRemarkTypes } from '@/api/goods/quotedPrice.js'
import {
  ordersUpdate,
  getPairInfo,
  placeAnOrder
} from '@/api/purchase/order.js'
import PurchaseOrderInformationNew from './components/purchaseOrderInformationNew.vue'
import matchGoods from '../components/matchGoods.vue'
import { getTree } from '@/api/purchase/outOfStock.js'
import { getAccountList } from '@/api/purchase/platform.js'
import AddressList from '@/views/purchase/components/AddressList.vue'
import GoodsList from './components/GoodsList.vue'
import AccessoryPrice from './components/accessoryPrice.vue'
import { getOrganizationTree } from '@/api/user.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import editDialog from './components/batchEdit.vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import _ from "lodash"
export default {
  components: { erpNav, erpFooter, matchGoods, AddressList, GoodsList, editDialog, AccessoryPrice, PurchaseOrderInformationNew, QuestionFilled },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let editRef = ref(null)
    let formRef = ref(null)
    let topFormRef = ref(null)
    let cascaderRef = ref(null)
    let { type, status, customization } = route.query // type: 1草稿编辑 2未通过编辑 3再次购买 4处理异常
    let state = shallowReactive({
      remarkTypeList: [],
      showDialog: false,
      supplierList: [],
      accountList: [],
      showAddress: false,
      showGoodsList: false,
      showPrice: false,
      showEdit: false,
      showOrderInformation: false,
      showEditPuchase: true,
      goodsInfo: {},
      purchaseType: 0,
      oraganziationList: [], // 组织架构列表
      itemId: null,
      orderInformationId: '',
      delRelIds: [],//保存订单信息页面的删除ids
      informationForm: {}
    })
    // 1：合作供应商、2：1688、3：淘宝、4：拼多多
    let { info, setType, initAddress, getDetail } = getEditInfo()
    function del(id, skuId, type) {
      if (type) {
        //定制品的话就跳转到订单信息页面
        state.orderInformationId = id + ''
        state.showOrderInformation = true
        state.showEditPuchase = false
      } else {
        if (id) {
          //
          info.orderItems = info.orderItems.filter(item => item.id != id)
          if (info.delIds) info.delIds.push(id)
          else info.delIds = [id]
        } else {
          // 刚添加的商品
          info.orderItems = info.orderItems.filter(item => item.skuId != skuId)
        }
      }
    }

    function inputChange(val, row) {
      if (val == 0) {
        row.partSwitch = 1
      }
      row.copyPrice = !val ? row.copyPrice : val
    }

    //批量删除
    function batchDel(editRef) {
      let flag = editRef.data.some(val => val.customization)
      if (flag) {
        state.orderInformationId = editRef.getCheckboxRecords(true).filter(item => item.id).map(item => item.id).join(',')
        state.showOrderInformation = true
        state.showEditPuchase = false
      } else {
        let ids = editRef
          .getCheckboxRecords(true)
          .filter(item => item.id)
          .map(item => item.id)
        let skuIds = editRef.getCheckboxRecords(true).map(item => item.skuId)
        if (skuIds.length < 1) return ElMessage.error('请至少选择一个')
        ElMessageBox.confirm('确定删除吗', {
          type: 'warning',
          "close-on-click-modal": false,
          "close-on-press-escape": false
        }).then(() => {
          info.orderItems = info.orderItems.filter(
            item => !skuIds.includes(item.skuId)
          )
          info.taxRate = 0
          if (ids?.length > 0) {
            if (info.delIds) info.delIds.push(...ids)
            else info.delIds = ids
          }
        })
      }
    }
    // 种类
    let skuQuantity = computed(() => {
      return info.orderItems?.length
    })
    //数量总计
    let purchaseQuantity = computed(() => {
      return info.orderItems?.reduce((total, next) => {
        return (total += next.purchaseQuantity * 1)
      }, 0)
    })
    // 应付金额
    let totalAmount = computed(() => {
      return info.orderItems?.reduce((total, next) => {
        return (total += calcPrice(next) * 1)
      }, 0)?.toFixed(2)
    })
    // 计算应付
    function calcPay(row) {
      let price = 0
      if (row.purchaseQuantity && row.price) price = row.purchaseQuantity * row.price
      if (customization == 1) price = price * 1 + row.partsPrice * 1
      // 处理js相加后的浮点数精度问题
      return parseFloat(price.toFixed(2))
    }
    function calcPrice(row) {
      let { price, purchaseQuantity } = row
      let partsPrice = 0
      if (customization == 1) partsPrice = row.partsPrice
      if (purchaseQuantity) return ((purchaseQuantity * price + partsPrice * 1) * (1 + (info.taxRate ?? 0) / 100)).toFixed(2)
      return ''
    }

    function partSwitchChange(row) {
      if (customization == 1) {
        if (!row.partSwitch) row.price = row.copyPrice
        else row.price = 0
      }
      row.totalAmount = row.price * row.purchaseQuantity
    }

    getTree().then(res => {
      state.supplierList = res.data
    })
    getRemarkTypes({ useScope: '2' }).then(res => {
      state.remarkTypeList = res.data
    })
    getAccountList().then(res => {
      state.accountList = res.data
    })

    function goBack() {
      router.push({
        name: 'PurchaseOrders',
        params: {
          status
        }
      })
    }

    function openDialog(row) {
      state.showDialog = true
      let pairInfo = {}
      if (row.pairInfo) pairInfo = row.pairInfo
      state.goodsInfo = {
        pairInfo: {
          img: row.mainImg,
          name: row.goodsName,
          speInfo: pairInfo.speInfo
        },
        url: row.link,
        thirdPlatformSupplierId: info.thirdPlatformSupplierId,
        row: row
      }
    }

    function openGoodsList() {
      state.showGoodsList = true
    }

    function fmtSpe(spes) {
      if (spes) {
        let list = JSON.parse(spes)
        return list.map(item => item.spe + ': ' + item.speVal).join(' ')
      }
      return ''
    }

    function addGoods(goodsList) {
      if (!goodsList) return
      goodsList.forEach(item => {
        let order = info.orderItems.find(order => order.skuId == item.skuId)
        if (order) {
          let purchaseQuantity =
            order.purchaseQuantity * 1 + item.purchaseQuantity * 1
          order.purchaseQuantity =
            purchaseQuantity >= 99999 ? 99999 : purchaseQuantity
        } else {
          let obj = { ...item }
          if (info.partnerType == 2) {
            // 1688 配对
            obj.price =
              (obj.lastPurchasePrice ?
                obj.lastPurchasePrice :
                obj.purchasePrice) * 1
            getPairInfo({ supplierId: info.supplierId, skuId: obj.skuId }).then(
              ({ data }) => {
                if (data.link && data.pairInfo) {
                  obj.pairInfo = data.pairInfo
                  obj.link = data.link
                  obj.price = obj.pairInfo.price * 1
                }
                info.orderItems.push(obj)
                editRef.value.loadData(info.orderItems)
              }
            )
          } else {
            obj.price =
              (obj.lastPurchasePrice ?
                obj.lastPurchasePrice :
                obj.purchasePrice) * 1
            info.orderItems.push(obj)
            editRef.value.loadData(info.orderItems)
          }
        }
      })
    }

    function setPairInfo(v) {
      let { data } = cascaderRef.value.getCheckedNodes()[0]
      let partnerType = data.parentId // 供应商类型
      let partner = state.supplierList.find(item => item.id == partnerType)
      let supplier = partner.childs.find(item => item.id == v)
      // 重新赋值供应商id
      info.thirdPlatformSupplierId = supplier.thirdPlatformSupplierId
      info.partnerType = partnerType
      if (partnerType !== 2) {
        // 不是1688
        info.accountId = null
        info.address = null
        info.orderItems.forEach(item => {
          item.price = item.partSwitch == 1 ? 0 : (item.lastPurchasePrice ?
            item.lastPurchasePrice :
            item.purchasePrice)
          item.pairInfo = null
          item.link = null
        })
      } else {
        // 1688
        let supplierId = v
        info.orderItems.forEach(item => {
          getPairInfo({ supplierId, skuId: item.skuId }).then(({ data }) => {
            item.pairInfo = data.pairInfo ?? null
            item.link = data.link ?? null
            if (item.pairInfo) {
              item.price = item.pairInfo.price * 1
            } else {
              item.price =
                (item.lastPurchasePrice ?
                  item.lastPurchasePrice :
                  item.purchasePrice) * 1
            }
            item.price = item.partSwitch == 1 ? 0 : item.price
          })
        })
      }
    }

    function getInfo({ url, data, sku, spe }) {
      if (info.thirdPlatformSupplierId !== data.shopInfo.sellerUserId) {
        ElMessage.error('不是同一供应商，更换失败')
        return
      }
      let price = ''
      if (data.orderParam.skuParam.skuPriceType == 'skuPrice') {
        price = sku.price || sku.discountPrice
      } else {
        //根据采购数量 确定单价
        data.orderParam.skuParam.skuRangePrices.some(item => {
          price = item.price
          return true
        })
      }
      let pairInfo = {
        img: sku.imageUrl,
        name: data.goodsSpu.goodsName,
        offerId: data.goodsSpu.goodsNum,
        specId: sku.specId,
        sellerUserId: data.shopInfo.sellerUserId,
        price: price,
        speInfo: spe.map(item => {
          return {
            spe: item.key,
            speVal: item.value.name
          }
        })
      }
      state.goodsInfo.row.pairInfo = pairInfo
      state.goodsInfo.row.link = url
      if (customization == 1) {
        state.goodsInfo.row.copyPrice = state.goodsInfo.row.partSwitch ? state.goodsInfo.row.copyPrice : price * 1
        state.goodsInfo.row.price = state.goodsInfo.row.partSwitch ? 0 : price * 1
      } else {
        state.goodsInfo.row.copyPrice = state.goodsInfo.row.price = price * 1
      }
      state.showDialog = false
    }

    function commit(saveFlag) {
      if (info.orderItems.length < 1) {
        ElMessage.error('至少存在一个商品')
        return
      }
      if (info.toDeptId) {
        if (info.toDeptId?.length > 0) {
          info.toDeptId = info.toDeptId[info.toDeptId.length - 1]
        }
      } else if (state.purchaseType === 2) {
        ElMessage.error('备货团队不能为空')
        return
      }

      editRef.value.validate(true).then(res => {
        if (res) return
        Promise.all([
          topFormRef.value.validate(),
          formRef.value.validate()
        ]).then(() => {
          if (type == 3) {
            // 再次购买
            placeAnOrder(
              Object.assign({
                saveFlag,
                totalAmount: totalAmount.value,
                purchaseQuantity: purchaseQuantity.value,
                skuQuantity: skuQuantity.value
              },
                info
              )
            ).then(_ => {
              goBack()
              ElMessage({
                message: '操作成功',
                type: 'success'
              })
            })
          } else {
            ordersUpdate(
              Object.assign({
                saveFlag,
                purchaseQuantity: purchaseQuantity.value,
                skuQuantity: skuQuantity.value,
                totalAmount: totalAmount.value,
                delRelIds: state.delRelIds
              },
                info
              )
            ).then(_ => {
              goBack()
              ElMessage({
                message: '操作成功',
                type: 'success'
              })
            })
          }
        })
      })
    }

    function fmtPurchaseTyp(type) {
      let item = purchaseTypeList.find(item => item.value == type)
      state.purchaseType = item?.value
      return item?.typeName
    }

    function updateAddress(item) {
      info.addressId = item.id
      info.address = item.address
      topFormRef.value.validateField('address')
    }

    function getOrganization() {
      getOrganizationTree().then(res => {
        console.log(res.data, '组织架构')
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
    }
    onMounted(() => {
      state.informationForm = route.query
      getOrganization()
    })

    function openPrice(id) {
      state.showPrice = true
      state.itemId = id
    }

    function batchEdit() {
      let l = editRef.value.getCheckboxRecords(true).length
      if (!l) return ElMessage.error('请选择商品')
      state.showEdit = true
    }
    //订单信息页面返回事件
    function orderInformatinBack() {
      state.showOrderInformation = false
      state.showEditPuchase = true
    }
    function saveSuccess() {
      getDetail(state.delRelIds)
    }
    function selectList(ids) {
      state.delRelIds = ids
      getDetail(state.delRelIds)
    }
    return {
      editTableOption,
      goBack,
      del,
      info,
      commit,
      warehouseList,
      batchDel,
      totalAmount,
      purchaseQuantity,
      skuQuantity,
      openDialog,
      editRef,
      fmtSpe,
      setType,
      settlementTypeList,
      fmtPurchaseTyp,
      ...toRefs(state),
      openGoodsList,
      updateAddress,
      initAddress,
      getInfo,
      addGoods,
      setPairInfo,
      type,
      cascaderRef,
      rules,
      formRef,
      topFormRef,
      topRules,
      openPrice,
      batchEdit,
      customization,
      calcPay,
      getDetail,
      orderInformatinBack,
      selectList,
      saveSuccess,
      partSwitchChange,
      inputChange
    }
  }
}
</script>

<style lang="scss" scoped>
.address-box {
  display: flex;
  align-items: flex-start;
  background-color: #fff;

  .address-info {
    margin-right: 30px;
  }

  .btn-change {
    cursor: pointer;
    color: #409eff;
    width: 300px;
  }
}

.top-form {
  margin-top: 25px;
  padding-top: 20px;
  padding-bottom: 1px;
  background: #fff;

  .el-form-item {
    margin-left: 15px;
  }
}

.err-title {
  color: red;
}

.header {
  margin-top: 25px;
  background-color: #fff;
  line-height: 70px;
  padding: 0 30px;
  border-bottom: 1px dashed #e9e9e9;
  color: rgba(0, 0, 0, 0.65);

  span + span {
    margin-left: 60px;
  }

  span {
    color: rgba(0, 0, 0, 0.65);
  }
}

.btn-box {
  padding: 15px 0;
}

.table-warp {
  background-color: #fff;
  padding: 25px;
}

.table-footer {
  background: rgba(255, 251, 230, 0.7);
  padding: 22px 25px 0 25px;
  margin-top: 15px;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
}

.info-content {
  display: flex;
  align-items: center;

  .img-content {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    flex-shrink: 0;
  }
}

.info-cell {
  color: rgba(0, 0, 0, 0.85);
  line-height: 2;
  width: 190px;
  text-align: left;

  div:last-child {
    color: rgba(0, 0, 0, 0.65);
  }

  .two-line {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: break-spaces;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btn-content {
  flex-grow: 1;
  text-align: right;
  align-self: flex-end;
  line-height: 1;
}

.goods-attr {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  width: 140px;
  height: 120px;
  border-left: 1px solid #e8eaec;
  margin-left: 10px;
}
</style>
