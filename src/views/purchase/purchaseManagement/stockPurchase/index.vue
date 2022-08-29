<template>
  <div class="container">
    <div v-if="!showDetail" class="formOptions">
      <el-form v-model="form" :inline="true" >
        <el-form-item label="仓库：">
          <el-select v-model="form.warehouseId" disabled clearable>
            <el-option label="万众智谷仓库" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商：">
          <el-cascader
            v-model="form.supplierId"
            :options="supllierList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              children: 'childs',
              value: 'id',
              label: 'name'
            }"
						filterable
            clearable
            placeholder="全部"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="搜索内容：">
          <div style="display: flex">
            <el-select v-model="searchType" clearable placeholder="全部">
              <el-option
                v-for="(item, index) in searchTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
                v-once
              ></el-option>
            </el-select>
            <el-input
              placeholder="请输入要检索的内容"
              maxlength="500"
              style="margin-left: 10px"
              v-model="keyWorld"
							clearable
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item>
          <div>
            <el-button type="primary" @click="init">查询</el-button>
            <el-button type="default" @click="resertFun">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--			form表单-->

    <div v-if="!showDetail" class="btn">
      <BtnCom
        :btnType="'stockPurchase'"
        @openDialog="openDialog"
        @next="next"
        :selectedList="selectedList"
      />
    </div>
    <!--			btns-->

    <div v-if="!showDetail" class="tables">
      <vxe-table
        border
        max-height="800"
        align="center"
        ref="xTable1"
        :checkbox-config="{}"
        :scroll-y="{ gt: 50 }"
        :data="dataList"
        :span-method="colSpanMethod"
        :cell-style="cellStyle"
      >
				<vxe-column field="check" title="" width="50">
					<template #header>

						<el-checkbox v-model='tableCheckdAll'  :indeterminate="tableIndeter" @change="handleCheckedAll"></el-checkbox>
					</template>
					<template #default="{ row }">
						<el-checkbox v-model='row.checked' :key='row.id' :indeterminate='row.indeterminate' @change="val=>handleChecked(row,val)"></el-checkbox>
					</template>
				</vxe-column>
        <vxe-column field="goodsId" title="商品信息" width="380">
          <template #default="{ row }">
            <div class="goods" v-if="row.parentId">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="row.mainImg"
                  fit="contain"
                ></el-image>
                <template #reference>
                  <el-image
                    style="width: 67px; height: 67px"
                    :src="row.mainImg"
                    fit="contain"
                  ></el-image>
                </template>
              </el-popover>
              <div class="goodsInfo">
								<div class="infoName">
                    <p :title="row.skuCode">{{ row.skuCode }}</p>
                  </div>
								<div class="infoName">
                    <p :title="row.goodsName">{{ row.goodsName }}</p>
                  </div>

								<div class="infoSku over" >
									<p :title='getRowSku(row.skuValue)'>	{{getRowSku(row.skuValue)}}</p>
								</div>
                <!-- 国码预留 -->
                	<div v-if="row.codeVal" style="color:#2fbba6;font-size:12px">
										国码：{{row.codeVal}}
									</div>
                <!--								<div class="infoSku">万众智谷仓</div>-->
              </div>
            </div>
            <div v-else class="header">
              <div class="headerInfo">
                【{{ row.partnerTypeName || '暂无供应商' }}】
								<span :title="row.supplierName">{{
										row.supplierName?.length > 50 ? row.supplierName.slice(0,50)+'...' : row.supplierName
									}}</span>
              </div>
              <div class="headerInfo">{{ row.warehouseName }}</div>
            </div>
          </template>
        </vxe-column>

        <vxe-column field="pairInfo" title="供应商商品信息" width="380">
          <template #default="{ row }">
            <div v-if="row.partnerType === 2">
              <div v-if="testPairInfo(row)" class="goods">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="jsonData(row.pairInfo).img"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 67px; height: 67px"
                      :src="jsonData(row.pairInfo).img"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
                <div class="goodsInfo">
									<div class="infoName">
                      <p :title="jsonData(row.pairInfo).name">
                        {{ jsonData(row.pairInfo).name }}
                      </p>
                    </div>
                  <div class="infoSku" :title="renderSku(jsonData(row.pairInfo).speInfo)">
                    <div>
                      <span
                        style="margin-right: 10px"
                        v-for="(a, b) in jsonData(row.pairInfo).speInfo"
                        :key="b"
                      >
                        {{ a.spe ? a.spe +':' : ''}}{{ a.speVal }}
                      </span>
                    </div>
                    <div class="btn">
                      <el-button
                        type="text"

                        @click="match(row)"
                        v-if="row.partnerType === 2 && jsonData(row.pairInfo)"
												v-permission="'stockPurchase:btn:supplier'"
                      >
                        更换
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <el-button v-else type="text"  @click="match(row)" v-permission="'stockPurchase:btn:supplier'">
                配对
              </el-button>
            </div>

            <div v-else-if="row.partnerType !== 2 && row.partnerType">
              <div class="goods">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.mainImg"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 67px; height: 67px"
                      :src="row.mainImg"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
                <div class="goodsInfo">
									<div class="infoName">
                      <p :title="row.skuCode">{{ row.skuCode }}</p>
                    </div>
									<div class="infoName">
                      <p :title="row.goodsName">{{ row.goodsName }}</p>
                    </div>
                  <div class="infoSku" :title="renderSku(row.skuValue)">
                    <span
                      style="margin-right: 10px"
                      v-for="(a, b) in row.skuValue"
                      :key="b"
                    >
                      {{ a.spe ? a.spe +':' : ''}}{{ a.speVal }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!row.partnerType">暂无供应商</div>
          </template>
        </vxe-column>

        <vxe-column field="cPrice" title="采购报价/上次采购价">
          <template #default="{ row }">
            <div class="options">
              {{ changePrice(row.purchasePrice) }}/{{
                changePrice(row.lastPurchasePrice)
              }}
            </div>
          </template>
        </vxe-column>

        <vxe-column field="pirce" title="单价" width="180px">
          <template #default="{ row }">
            <div class="options">
              <el-input-number

                controls-position="right"
                :precision="2"
                :min="0"
                :step="1"
                :max="createdMax(row)"
                type="float"
                v-model="row.price"
                :class="priceColor(row) ? 'singlePrice' : ''"
                style="width: 160px"
                @change="v => addReduce(v, row, 'price')"
              ></el-input-number>
            </div>
          </template>
        </vxe-column>

        <vxe-column field="num" title="数量" width="180px">
          <template #default="{ row }">
            <div class="options">
              <el-input-number

                :step="1"
                step-strictly
                :min="1"
                controls-position="right"
                :max="99999"
                v-model="row.quantity"
                @change="v => addReduce(v, row, 'num')"
                style="width: 160px"
              ></el-input-number>

            </div>
          </template>
        </vxe-column>

        <vxe-column field="name" title="应付">
          <template #default="{ row }">
            ￥{{ (row.price * row.quantity).toFixed(2) }}
          </template>
        </vxe-column>

        <vxe-column field="options" title="操作" width="100px">
          <template #default="{ row }">
            <div class="options">
              <el-button
                type="text"

                @click="del(row)"
                style="color: red"
								v-permission="'stockPurchase:btn:deletes'"
                >删除
              </el-button>
            </div>
          </template>
        </vxe-column>

        <vxe-column field="bank" title="" width="0" class-name="option">
          <template #default="{ row }"><span :ss="row"></span></template>
        </vxe-column>
      </vxe-table>
    </div>

    <!--		<AddGoods v-if="dialogVisible"/>-->

    <component
      :is="comp[componentUrl]"
      v-if="dialogVisible"
      @cancel="dialogVisible = false"
      @ok="comOk"
      :query="comQuery"
    />

    <PurchaseOrder
      v-if="showDetail"
      :dataList="detailList"
      :submitType="1"
      :from-type="1"
      :param="renderParam"
      @refresh="detailToRefresh"
			@cancel='showDetail = false'
    />

    <ErpFooter v-if="!showDetail">
      <div class="bottom">
        <div class="num">
          <span>供应商数量：{{ totalInfo.supplierNum }}</span>
          <span>商品种类：{{ totalInfo.goodsTypeNum }} 种 </span>
          <span>数量总计：{{ totalInfo.goodsNum }} 件 </span>
          <span> 总计：{{ totalInfo.totalPrice }} 元</span>
        </div>
        <div class="btn">
          应付总额:{{ totalInfo.totalPrice }}元
          <el-button type="primary"  @click="createPurchase"
										 v-permission="'stockPurchase:btn:createPurOrder'"
            >生成采购单
          </el-button>
        </div>
      </div>
    </ErpFooter>
  </div>
</template>

<script>
export default {
	name:'stockPurchase'
}
</script>


<script setup>
import { ElMessage } from 'element-plus'
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  computed
} from 'vue'
import BtnCom from '../outOfStock/components/btnsCom.vue'
import MatchGoods from '../components/matchGoods.vue'
import AddGoods from './components/addGoods'
import SetSuplier from '../outOfStock/dialog/setSuplier'
import PurchaseOrder from '../components/purchaseOrder.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import {
  getPlanList,
  getSupplier,
  changeTableData,
  deletePlans,
  pairMatch,
  changePrice,
	testPairInfo
} from '../outOfStock/hooks/hooks'
import { deepCopy, resetForm } from '../../../../utils/tool'
import { addOrUpdate, renderCat } from '@/api/purchase/outOfStock.js'

const comp = {
  MatchGoods,
  AddGoods,
  SetSuplier
}
const data = reactive({
  dialogVisible: false,
  dataList: [], // 数组
  supllierList: [], // 供应商列表
  searchType: 0,
  keyWorld: null,
  selectedList: [], // 选中的数据
  componentUrl: '',
  comQuery: null, // 组件传参
  showDetail: false, //生成采购单
  detailList: [], //生成采购单的回显数据
  renderParam: null, //生成采购单的请求参数
	tableCheckdAll:false,
  form: {
    type: 2,
    supplierId: null,
    warehouseId: 1,
    skuCode: null,
    goodsId: null,
    goodsName: null,
    supplierName: null
  }
})
const xTable1 = ref({})
let matchInfo = null // 配对的商品信息
watch(
  () => data.dataList,
  a => {
    // load()
    // console.log('==>watch')
    load()
  },
  {
    deep: true
  }
)

const {
  form,
  supllierList,
  searchType,
  keyWorld,
  dialogVisible,
  selectedList,
  componentUrl,
  comQuery,
  dataList,
  detailList,
  showDetail,
	tableCheckdAll
} = toRefs(data)

const searchTypes = [
  {
    label: '商品SKU',
    value: 0,
    key: 'skuCode'
  },
  {
    label: '商品名称',
    value: 1,
    key: 'goodsName'
  },
  {
    label: '商品编码',
    value: 2,
    key: 'goodsId'
  },
  {
    label: '供应商',
    value: 3,
    key: 'supplierName'
  }
]

const tableIndeter = computed(()=>{
	let checkedList = data.dataList.filter(v=>{
		return v.type === 'ch' && v.checked
	})
	let chList = data.dataList.filter(v=>v.type ==='ch')
	if(checkedList.length > 0 && checkedList.length<chList.length){
		return true
	}else {
		return  false
	}
})

function renderSku(arr){
	//{{ a.spe ? a.spe +':' : ''}}{{ a.speVal }}
	let str = ''
	if(arr) arr.forEach(a=>{
		str +=( a.spe +':' + a.speVal)
	})
	return str
}


const totalInfo = computed(() => {

	let goodsTypeList =  data.selectedList
	let supplierList = []
  let goodsNum = 0
  goodsTypeList.forEach(v => (goodsNum += v.quantity))
  let totalPrice = 0
  goodsTypeList.forEach(v => {
    const { price, quantity ,parentId} = v
		supplierList.push(parentId)
    let total = Number(price) * quantity || 0
    totalPrice += total
  })

  return {
    supplierNum: Array.from(new Set(supplierList)).length || 0,
    goodsTypeNum: goodsTypeList.length || 0,
    goodsNum,
    totalPrice: totalPrice.toFixed(2)
  }
})

function jsonData(info) {
  return JSON.parse(info)
} // 格式化pairInfo

function createdMax(row) {
  const { purchasePrice, lastPurchasePrice, partnerType } = row
  let max = 9999999.99
  if (partnerType === 2) return max
  if (purchasePrice) max = Number(purchasePrice) + 3
  if (max > 9999999.99) return 9999999.99
  return max
} // 单价最大额

function priceColor(row) {
  const { purchasePrice, partnerType, price } = row
  if (partnerType === 2 && Number(price) - Number(purchasePrice) > 3)
    return true
  return false
} // 单价超出标红

function colSpanMethod(row) {
  const { columnIndex, _columnIndex } = row
  if (row.row.parentId) {
    if (row.row.goodsId && columnIndex !== 8) {
      return { rowspan: 2, colspan: 1 }
    } else if (!row.row.goodsId && columnIndex !== 8) {
      return { rowspan: 0, colspan: 0 }
    }
  } else {
    if (_columnIndex === 1) {
      return { rowspan: 1, colspan: 12 }
    } else if (_columnIndex !== 0) {
      return { rowspan: 0, colspan: 0 }
    } else {
      return { rowspan: 1, colspan: 1 }
    }
  }
} // 合并单元格方法

function cellStyle({ row, column }) {
  if (!row.parentId) return { backgroundColor: '#FAFAFA' }
} //单元格样式

function load() {
  const $table = xTable1.value
  if ($table) {
    // $table.loadData(data.dataList)
    nextTick(() => {
      xTable1.value.setAllTreeExpand(true).then(res => {
        // console.log(res, '==>expand')
      })
    })
  }
}

function changeNum(v) {
  console.log(v, '==>')
}

function addReduce(v, row, type) {
	if(type === 'num' && !v) row.quantity = 1
  if(row.quantity*row.price>100000000)
    return ElMessage.error('应付总金额不能超过100000000元')
  let q = v
  if (String(v).indexOf('.') > 0 && type ==='num') {
    q = String(v).split('.')[0]
    row.quantity = Number(q[0])
  }
  let form = deepCopy(data.form)
  searchTypes.map(item => {
    if (data.searchType === item.value) {
      form[item.key] = data.keyWorld
    } else {
      form[item.key] = null
    }
  })
  if (form.supplierId) {
    form.supplierId =
      form.supplierId?.length > 1 ? form.supplierId[1] : form.supplierId[0]
  }

  const {
    quantity,
    lastQuantity,
    skuId,
    purchasePrice,
    supplierId,
    pairInfo,
    id,
    link,
    price,
		productId
  } = row

  let step = 1
  let stepNum
  let qtyOperateType = 2
  let submitNum = 0
  if (type == 'num') {
    if (quantity === lastQuantity) {
      qtyOperateType = 2
      submitNum = quantity
    } else {
      stepNum = Math.abs(quantity - lastQuantity)
      if (quantity < lastQuantity) step = -1
      if (stepNum > 1) {
        qtyOperateType = 2
        submitNum = quantity
      } else {
        qtyOperateType = 1
        submitNum = step
      }
    }
  } else {
    qtyOperateType = 2
    submitNum = String(price)
  }

  const skuList = []
  if (type == 'num') {
    skuList.push({
			id,
			productId,
      link,
      type: 2,
      skuId,
      quantity: submitNum,
      price: String(price),
      pairInfo,
      warehouseId: 1,
      supplierId,
      qtyOperateType // 2 覆盖,1 递增/减
    })
  } else {
    skuList.push({
			id,
			productId,
      link,
      type: 2,
      skuId,
      price: submitNum,
      quantity,
      pairInfo,
      warehouseId: 1,
      supplierId,
      qtyOperateType // 2 覆盖,1 递增/减
    })
  }
  addOrUpdate({ query: form, skuList }).then(res => {
    if (res.code == 200) {
      data.dataList = changeTableData(res.data)
			clearSelected()
    }
  })
}

function init() {
  let form = deepCopy(data.form)
  searchTypes.map(item => {
    if (data.searchType === item.value) {
      form[item.key] = data.keyWorld
    } else {
      form[item.key] = null
    }
  })
  if (form.supplierId) {
    form.supplierId =
      form.supplierId?.length > 1 ? form.supplierId[1] : form.supplierId[0]
  }

  getPlanList(form, res => {
    data.dataList = changeTableData(res)
		clearSelected()
    // xTable1.value.setAllTreeExpand(true)
  })
}

function resertFun() {
  data.form = resetForm(data.form, { warehouseId: 1, type: 2 })
  data.searchType = null
  data.keyWorld = null
	data.selectedList = []
	data.tableCheckdAll = false
  init()
} // 重置

function openDialog(val) {
  console.log(val, '==>emit')
  const { type, list } = val
  data.dialogVisible = true
  data.componentUrl = type
  data.comQuery = { selectedList: list, dataList: data.dataList, type: 2 }
} // 打开弹框

function next(val) {
  if(val?.data?.productList.find(v=>{
    if(v.skuList.find(k=>k.totalAmount>100000000)) return true
  })) return ElMessage.error('应付总金额不能超过100000000元')

  const { type } = val
  if (type === 'createPurOrder') {
    // emits('detail',{data:val.data,type:1})
    data.showDetail = true
    data.detailList = { data: val.data }
    return
  } // 生成采购订单
  init()
} //

function createPurchase() {
  if (data.selectedList.length == 0) {
    return ElMessage.error('请勾选SKU')
  }

  let newList = data.selectedList.filter(v => v.supplierId)
  if (newList?.length == 0) return ElMessage.error('请设置供应商')
  let renderOrderList = newList.map(v => {
    return {
      suggestId: v.id,
      quantity: v.editPurNum || v.quantity // 备货采购是quantity ,采购建议和购物车是editNum
    }
  })

  let skuList = newList.map(v => {
		let p = v.price != null ? Number(v.price) : Number(v.lastPurchasePrice)
    return {
      id: v.id,
      purchasePrice: p + '',
      quantity: v.editPurNum || v.quantity
    }
  })
  // 备货采购数量
  if(skuList.find(v=>(v.purchasePrice-0)*v.quantity>100000000))
    return ElMessage.error('应付总金额不能超过100000000元')

  renderCat({ skuList }).then(res => {
    if (res.code == 200) {
      data.showDetail = true
      data.detailList = { data: res.data }
      data.renderParam = skuList
    }
  })
}

function detailToRefresh(status = true) {
  if (status) init()
  data.showDetail = false
} // 生成订单回来刷新

function del(row) {
  const query = {
    type: 2,
    supplierId: null,
    warehouseId: null,
    skuCode: null,
    goodsId: null,
    goodsName: null,
    supplierName: null
  }

  deletePlans({ query, list: [{id:row.id,orderId:row.orderId}] }, res => {
    init()
  })
} // 删除

function comOk(val, t) {
  if (!val) return init()
  if (t && t === 'MatchGoods') {
    const { sku, spe, url } = val
    const { purchasePrice, quantity, id, supplierId } = matchInfo
    let price = ''
    if (val.data.orderParam.skuParam.skuPriceType == 'skuPrice') {
      price = sku.price || sku.discountPrice
    } else {
      //根据采购数量 确定单价
      val.data.orderParam.skuParam.skuRangePrices.some(item => {
				price = item.price
				return true
      })
    }
    let pairInfo = {
      img:  sku?.imageUrl || val.data.goodsSpu.mainImg,
      name: val.data.goodsSpu.goodsName,
      offerId: val.data.goodsSpu.goodsNum,
      specId: sku?.specId,
      price: price,
      sellerUserId: val.data.shopInfo.sellerUserId,
      speInfo: spe.map(item => {
        return {
          spe: item.key,
          speVal: item.value.name
        }
      })
    }
    const param = {
      id,
      link: url,
      pairInfo: JSON.stringify(pairInfo)
    }

    pairMatch(
      param,
      res => {
        matchInfo = null
        data.dialogVisible = false
        init()
      },
      1
    )
  } // 配对商品信息

  const { type, data } = val
  if (type === 'AddGoods') {
    let skuList = data?.map(item => {
			console.log(item)
      return {
        type: 2,
        supplierId: item.supplierId,
        warehouseId: item.warehouseId || 1,
        skuId: item.skuId,
        quantity: item.num,
        price: item.lastPurchasePrice !== null ? item.lastPurchasePrice + '' : item.purchasePrice + '',
        pairInfo: null
      }
    })
    const query = {
      type: 2,
      supplierId: null,
      skuCode: null,
      goodsId: null,
      goodsName: null,
      supplierName: null,
      warehouseId: 1
    }
    addOrUpdate({ query, skuList }).then(res => {
      console.log(res)
      if (res.code === 200) {
        data.dataList = changeTableData(res.data)
        // xTable1.value.setAllTreeExpand(true)
        init()
        clearSelected()
      }
    })
  }

  // load()
}

function getRowSku(val){
	let text = ''
	val.forEach(a=>{
		text += (a.spe ? a.spe + ':' : '') + a.speVal +' '
	})
	return text
}


function match(row) {
  matchInfo = row
  const { mainImg, skuCode, link, pairInfo ,thirdPlatformSupplierId} = row
  let speInfo
  if (pairInfo) speInfo = JSON.parse(pairInfo).speInfo
  data.comQuery = {
    pairInfo: {
      img: mainImg,
      name: skuCode,
      speInfo:testPairInfo(row) ? speInfo : null
    },
		url:testPairInfo(row) ? link :null,
		thirdPlatformSupplierId
  }
  data.dialogVisible = true
  data.componentUrl = 'MatchGoods'
}

function handleChecked(row,val){
	let list = data.dataList
	let selectedList = 	data.selectedList || []// 选中的数组
	if(row.type ==='fa'){
		row.indeterminate = false
		data.dataList.forEach(v=>{
			if(v.type ==='ch' && v.parentId &&  v.parentId === row.id){
				v.checked = val
				let ind =	selectedList.findIndex(i=>i.id === v.id)
				if(val){
					if(ind ==-1)	selectedList.push(v)
				}else{
					if(ind !==-1) selectedList.splice(ind,1)
				}
			}
		})
	}else{
		if(val){
			selectedList.push(row)
		}else{
			let ind =	selectedList.findIndex(v=>v.id === row.id)
			if(ind !==-1) selectedList.splice(ind,1)
		}

		let faIndex = list.findIndex(v=>{
			if(v.type ==='fa'){
				return v.skuList.some(x=>x.id === row.id)
			}
		})
		if(faIndex !==-1) {
			// 要找到和他关联的子集收集起来,判断是不是全部checked 为true
			let checkedList =  data.dataList.filter(v=>{
				return v.parentId === list[faIndex].id && v.type ==='ch' && v.checked
			})
			if(checkedList?.length >0 &&  checkedList?.length < list[faIndex].skuList.length){
				data.dataList[faIndex].indeterminate = true
				data.dataList[faIndex].checked = false
			}else if(checkedList?.length  === list[faIndex].skuList.length){
				data.dataList[faIndex].indeterminate = false
				data.dataList[faIndex].checked = true
			}
			else{
				data.dataList[faIndex].indeterminate = false
				data.dataList[faIndex].checked = false
			}
		}
	}



	data.selectedList = selectedList
	data.tableCheckdAll = isCheckedAll()
} // 选中当前数据


function isCheckedAll(){
	let chList = data.dataList.filter(v=>v.type ==='ch')
	return data.selectedList.length === chList.length
} // 判断是否需要全选

function handleCheckedAll(val){
	let selectedList = 	 []// 选中的数组
	data.dataList.forEach(v=>{
		if(v.type ==='ch' || v.type ==='fa'){
			v.checked = val
			v.indeterminate = false
		}
		if(v.type ==='ch'){
			if(val){
				selectedList.push(v)
			}else{
				let ind =	selectedList.findIndex(i=>i.id === v.id)
				if(ind !==-1) selectedList.splice(ind,1)
			}
		}
	})
	data.selectedList = selectedList
	// data.tableCheckdAll = isCheckedAll()

}// 是否全选当前数据


function clearSelected() {
 	data.tableCheckdAll = false
  data.selectedList = []
} // 清除选中状态

onMounted(() => {
  init()
  getSupplier(val => {
		console.log('wwww',val)
    data.supllierList = [{id: -1,name:'无供应商',parentId: 0,thirdPlatformSupplierId:null},...val]
  })
  // nextTick(() => {
  // 	const $table = xTable1.value
  // 	if ($table) {
  // 		$table.loadData(mockList1)
  // 	}
  // })
})
</script>

<style scoped lang="scss">
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
	.num span{
		margin-right: 10px;
	}
  .btn {
    button {
      margin-left: 20px;
    }
  }
}

.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tables {
  background: white;
  padding: 15px;
  margin-top: 10px;
}

.option .vxe-cell {
  padding: 0;
}

.a {
  color: #f7b500;
  text-decoration: underline;
}


.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .headerInfo {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
}

.skuCode {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .goodsImg {
    width: 60px;
    height: 60px;
    background: #9e9e9e;
  }

  .goodsInfo {
    text-align: left;
    width: 75%;

    .infoName {
      width: 270px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;

      font-weight: 600;
      // display: -webkit-box; /**对象作为伸缩盒子模型展示**/
      // -webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
      // -webkit-line-clamp: 1; /**显示的行数**/

      p {
        line-height: 22px;
        max-height: 22px;
        overflow: hidden; /**隐藏超出的内容**/
        white-space: nowrap;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }
    }
  }

  .tag {
    margin-left: 10px;
  }

  .infoSku {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: flex-start;
    align-items: center;
		flex-wrap: wrap;
    .btn {
      width: 10%;
    }
  }
}

//商品

.supplier {
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin-top: 5px;
  }
}

//供应商

.options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// 操作

:deep(.vxe-table--render-default .vxe-body--column.col--ellipsis > .vxe-cell) {
  max-height: 300px;
}

:deep(.vxe-table--render-default .vxe-tree-cell) {
  padding: 0;
}

:deep(.vxe-cell--tree-node) {
  padding: 0 !important;
}

:deep(.singlePrice .el-input__inner) {
  color: red !important;
}
.formOptions {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
  margin-bottom: 20px;
}
:deep(.el-form-item__label) {
  margin: 0;
  padding: 0;
}
</style>
