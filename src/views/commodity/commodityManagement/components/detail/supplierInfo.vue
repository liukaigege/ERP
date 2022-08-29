<template>
<div class="supplierIndo">
  <div class="operation">
    <div>
      <el-button type="primary"  v-if="supplierInfoEdit" @click="addSupplierOpen">添加供应商</el-button>
      <el-button type="primary"  v-if="supplierInfoEdit" @click="delSupplierOpen">移除供应商</el-button>
    </div>
    <div>
      <span @click="vxeTable.setAllRowExpand(true),expend=true" :class="{switch:true,switchcheck:expend}">展开<i class="el-icon-arrow-down"></i></span>
      <span @click="vxeTable.clearRowExpand(),expend=false" :class="{switch:true,switchcheck:!expend}">收起<i class="el-icon-arrow-up"></i></span>
    </div>
  </div>
  <vxe-table :data="data" border align="center" :expand-config="{labelField: 'expand'}" ref="vxeTable" :checkbox-config="{labelField:'skuCode'}" keep-source max-height="540px">
    <vxe-column field="skuCode" title="商品SKU" type="expand" show-overflow>
      <template #header>
        <div class="checkBox">
          <el-checkbox v-model="checked" :indeterminate="indeterminate" class="check" @change="checkEvent('all')" v-if="supplierInfoEdit"></el-checkbox>
          <span>商品SKU</span>
        </div>
      </template>
      <template #default="{row}">
        <span class="skuspan" v-if="supplierInfoEdit">
          <el-checkbox v-model="row.checked" @change="checkEvent(row)"></el-checkbox>
          <span>{{row.skuCode}}</span>
        </span>
        <span v-else class="skuspan">{{row.skuCode}}</span>
      </template>
      <template #content="{row}">
        <div class="row-bable-box">
          <vxe-table :data="row.supplierList" align="center" :edit-config="{trigger: 'click', mode: 'cell'}" ref="tableFn" :edit-rules="validRules">
            <vxe-column field="supplierName" title="供应商名称">
              <template #default="{row}">
                <p class="text-row2" :title="row.supplierName"><a :href="row.partnerType!=1?row.storeHomePage:row.webAddress" target="_blank">{{row.supplierName}}</a></p>
              </template>
            </vxe-column>
            <vxe-column field="partnerType" title="平台" width="150px">
              <template #default="{row}">
                {{supplierform[row.partnerType]}}
              </template>
            </vxe-column>
            <vxe-column field="purchasePrice" title="采购价（CNY）" width="150px" :edit-render="{name:'$input',props:{type: 'float', digits: 2},enabled:supplierInfoEdit}"></vxe-column>
            <vxe-column field="minBuyQuantity" title="起订量" width="150px" :edit-render="{name:'$input',props:{type: 'integer',min:1,max:9999,placeholder:'起订量1-9999'},enabled:supplierInfoEdit}"></vxe-column>
            <vxe-column field="pairInfo" title="商品配对">
              <template #default="{row}">
                <div class="supBox" v-if="row.pairInfo?.name">
                  <div style="width:60px;height:60px">
                    <el-popover placement="right" width="auto" trigger="hover">
                      <template #reference>
                        <el-image :src="row.pairInfo.img" fit="fill" style="width:60px;height:60px"></el-image>
                      </template>
                      <el-image :src="row.pairInfo.img" fit="fill" style="width:250px;height:250px"></el-image>

                    </el-popover>

                  </div>
                  <div class="info">
                    <p class="p1" :title="row.pairInfo.name">
                      {{row.pairInfo.name}}
                    </p>
                    <p class="p2" :title="row.pairInfo.speInfoStr">
                      {{row.pairInfo.speInfoStr}}
                    </p>
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="link" title="采购链接">
              <template #default="{row}">
                {{row.link}}
              </template>
            </vxe-column>
            <vxe-column field="edit" title="操作" v-if="supplierInfoEdit" align="center" width="120">
              <template #default="{row}">
                <span v-if="row.partnerType==2&&!row.link" @click="suppairOpen(row)" style="color:#1890FF;cursor: pointer;">配对 <br /></span>
                <span v-if="row.defaultFlag==0" @click="setDefault(row)" style="color:#1890FF;cursor: pointer;">设为默认<br /></span>
                <span v-if="row.partnerType==2&&row.link" @click="suppairOpen(row,'edit')" style="color:#1890FF;cursor: pointer;">更改配对<br /></span>
                <el-popconfirm v-if="row.partnerType==2&&row.link" @confirm="pairRemoveHandler(row)" title="确定解除配对吗？">
                  <template #reference>
                    <span style="color:#1890FF;cursor: pointer;">解除配对</span>
                  </template>
                </el-popconfirm>

              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="skuValue" title="规格" show-overflow>
      <template #default="{row}">
        <span>{{row.skuValue}}</span>
      </template>
    </vxe-column>
    <vxe-column field="purchaseOfferPrice" title="采购报价（CNY）"></vxe-column>
    <vxe-column field="supplierName" title="默认供应商"></vxe-column>
    <vxe-column field="purchasePrice" title="默认采购价（CNY）"></vxe-column>
    <vxe-column field="minBuyQuantity" title="起订量"></vxe-column>
    <vxe-column field="link" width="320px" title="采购链接">
      <template #default="{row}">
        <div v-if="row.partnerType==2&&row.link">{{row.link}}</div>
        <div v-if="row.partnerType!=2">{{row.link || row.webAddress}}</div>
      </template>

    </vxe-column>
  </vxe-table>
  <addSupplier v-if="addSupplierShow" @closeEvent="addSupplierClose" @returnGoods="addSpe" />
  <suppair @closeEvent="suppairShow = false" v-if="suppairShow" :goodsInfo="goodsInfo" @returnSup="returnSup" :pairInfo="pairInfo" />
  <delSupplier @closeEvent="delSipplierShow = false" v-if="delSipplierShow" :data="delData" :checkData="checkedList" />
</div>
</template>

<script>
import { inject, nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import addSupplier from './components/addSupplier.vue'
import suppair from './components/suppair.vue'
import { supplierInfo, supplierUpdate, supplierDefault, pairRemove } from '@/api/commodity.js'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import delSupplier from './components/delSupplier.vue'
export default {
  components: { addSupplier, suppair, delSupplier },
  setup() {
    const route = useRoute()
    const state = reactive({
      addSupplierShow: false,
      delSipplierShow: false,
      suppairShow: false,
      checked: false,
      indeterminate: false,
      data: [],
      vxeTable: null,
      checkedList: [],
      goodsInfo: {},
      checkedRow: {}, // 当前配对数据
      pairInfo: null, //回显
      delData: [],
      expend: false,
      tableFn: [],
      validRules: {
        purchasePrice: [
          { required: true, message: '请输入采购价' },
          {
            validator: (e) => {
              console.log(e.cellValue - e.row.purchaseOfferPrice > 3);
              if (e.cellValue - e.row.purchaseOfferPrice > 3) {
                return new Error('采购价不得高于采购报价3元')
              }
            }
          }
        ]
      }
    })
    let supplierInfoEdit = inject('supplierInfoEdit')

    onMounted(() => {
      searchList()
    })
    let supplierform = {
      1: '合作供应商',
      2: '1688',
      3: '淘宝',
      4: '拼多多',
    }

    function searchList() {
      supplierInfo({
        skuIdList: typeof route.query.skuIdList == 'object' ? route.query.skuIdList : route.query.skuIdList.split(",")
      }).then(res => {
        state.checked = false
        state.indeterminate = false
        state.checkedList = []
        res.data.forEach(item => {
          item.checked = false
          item.skuValue = JSON.parse(item.skuValue)
          if (typeof item.skuValue == 'object' && item.skuValue) {
            item.skuValue = item.skuValue.map(val => val.speVal).join('-')
          }
          item.supplierList.forEach(val => {
            // 为后台生成日志插入新属性
            if(val.defaultFlag == 1){
              item.partnerType = val.partnerType
            }
            val.matchType = null
            val.purchaseOfferPrice = item.purchaseOfferPrice
            val.oldPurchasePrice = val.purchasePrice // 更改前的默认报价
            val.oldMinBuyQuantity = val.minBuyQuantity // 更改前的起订量
            if (!val.pairInfo) return
            val.pairInfo = JSON.parse(val.pairInfo)
            if (val.pairInfo && val.pairInfo.speInfo ?.length && !val.pairInfo.speInfoStr) { // 无sepInfoStr属性，重新生成'
              val.pairInfo.speInfoStr = val.pairInfo.speInfo.map(v => v.speVal).join(',')
            }
            // 为后台生成日志插入新属性
            val.oldSepInfoStr = val.pairInfo ?.speInfoStr // 判断是否更改配对
          })
        })
        state.data = res.data
      })
    }

    watch(() => supplierInfoEdit.value, val => {
      state.checked = false
      state.indeterminate = false
      state.checkedList = []
    })

    function checkEvent(row) {
      if (row === 'all') {
        let arr = []
        state.data.forEach(item => {
          item.checked = state.checked
          arr.push(item)
        })
        state.checkedList = state.checked ? arr : []
      } else {
        state.checkedList.some(v => v.skuId == row.skuId) ? state.checkedList.splice(state.checkedList.findIndex(val => val.skuId == row.skuId), 1) : state.checkedList.push(row)
      }
      state.checked = state.checkedList.length == state.data.length
      state.indeterminate = state.checkedList.length > 0 && !state.checked
      console.log(state.checkedList, state.data);
    }

    function resetData() { // 还原数据
      // state.vxeTable.revertData(state.data)
      searchList()
    }

    function addSupplierOpen() { // 添加供应商弹窗打开
      if (!state.checkedList.length) return ElMessage.error('请选择商品！')
      state.addSupplierShow = true
    }

    function addSupplierClose() { // 添加供应商弹窗关闭
      state.addSupplierShow = false
    }

    function addSpe(obj) {
      let flag = true
      state.checkedList.forEach(item => {
        let index = state.data.findIndex(val => val.skuId == item.skuId)
        if (item.supplierList.some(val => val.partnerType == obj.partnerType && val.supplierName == obj.supplierName)) return
        flag = false
        obj.skuId = item.skuId
        obj.purchaseOfferPrice = item.purchaseOfferPrice
        item.supplierList.push({ ...obj })
        if (item.supplierList.length == 1) {
          item.supplierList[0].defaultFlag = 1
          item.supplierList[0].defaultSupplier = 1 // 0：默认 1：新增默认供应商
        }
        state.vxeTable.setRowExpand(state.data[index], false)
        setTimeout(() => {
          state.vxeTable.setRowExpand(state.data[index], true)
        }, 100)
      })
      flag ? ElMessage.error('供应商已存在SKU列表！') : false

    }

    function suppairOpen(row, status) {
      state.suppairShow = true
      state.goodsInfo = {
        mainImg: state.data.find(item => item.skuId == row.skuId).mainImg,
        skuCode: state.data.find(item => item.skuId == row.skuId).skuCode,
        skuValue: state.data.find(item => item.skuId == row.skuId).skuValue,
        thirdPlatformSupplierId: row.thirdPlatformSupplierId
      }
      state.checkedRow = row
      console.log(status);
      if (status) {

        state.pairInfo = {
          link: row.link,
          pairInfo: row.pairInfo
        }
      } else {
        state.pairInfo = null
      }
      console.log(state.pairInfo, '回显数据');
    }

    function returnSup(obj) {
      if(state.checkedRow.pairInfo){
        if(state.checkedRow.oldSepInfoStr!=obj.speInfoStr){
          state.checkedRow.matchType = 2
        }else{
          state.checkedRow.matchType = null
        }
      }else{
        state.checkedRow.matchType = 1
      }
      state.checkedRow.pairInfo = obj
      state.checkedRow.link = obj.link
      state.checkedRow.purchasePrice = obj.orderParam.price
      state.checkedRow.minBuyQuantity = obj.orderParam.beginAmount
    }

    function supplierUp() {
      // 校验数据
      let message = ''
      let index = state.data.findIndex(item => {
        let obj = item.supplierList.find(val => {
          if (val.purchasePrice <= 0 || val.purchasePrice - item.purchaseOfferPrice > 3) {
            message = '采购价为必填且不得高于采购报价3元'
          }
          return message
        })
        return obj
      })
      if (index != -1) {

        state.vxeTable.setRowExpand(state.data[index], false)
        setTimeout(() => {
          state.vxeTable.setRowExpand(state.data[index], true)
        }, 300);
        ElMessage.error(message)
        return false
      }

      let arr = []
      state.data.forEach(item => {
        item.supplierList.forEach(val => {
          // val.matchType = val.pairInfo ?.speInfoStr && !val.oldSepInfoStr ? 1 : val.pairInfo ?.speInfoStr != val.oldSepInfoStr ? 2 : 0 //0:默认 1：新增配对 2：修改配对
          if (val.pairInfo) {
            val.pairInfo = JSON.stringify(val.pairInfo)
          }
          val.purchasePriceModify = val.purchasePrice == val.oldPurchasePrice ? 0 : 1 // 0：默认 1：修改默认采购价
          val.minBuyQuantityModify = val.minBuyQuantity == val.oldMinBuyQuantity ? 0 : 1 // 0：默认 1：修改起订量

        })
        arr = [...arr, ...item.supplierList]
      })
      supplierUpdate({ goodsManageSupplierList: arr }).then(res => {
        searchList()
        supplierInfoEdit.value = false
      })
    }

    function setDefault(row) {
      let obj = { ...row }
      obj.defaultFlag = 1
      if (obj.purchasePrice <= 0 || obj.purchasePrice - obj.purchaseOfferPrice > 3) {
        return ElMessage.error('采购价为必填且不得高于采购报价3元')
      }
      supplierDefault(obj).then(res => {
        let fatherObj = state.data.find(item => item.skuId == row.skuId)
        fatherObj.supplierList.forEach(item => {
          item.defaultFlag = 0
          item.defaultSupplier = 0
        })
        row.defaultFlag = 1
        row.defaultSupplier = fatherObj.supplierName != row.supplierName ? 1 : 0 //判断是否修改了默认供应商
        row.new = false
        row.id = res.data.id
        fatherObj.supplierName = obj.supplierName
        if(obj.partnerType == 2){
          fatherObj.link = obj.link
        }else{
          fatherObj.link = obj.webAddress
        }
        fatherObj.purchasePrice = obj.purchasePrice 
        fatherObj.minBuyQuantity = obj.minBuyQuantity
        fatherObj.partnerType = obj.partnerType
        ElMessage.success('设置成功')
      })
    }

    function delSupplierOpen() { // 移除供应商
      if (!state.checkedList.length) return ElMessage.error('请选择商品！')
      let arr = []
      state.checkedList.forEach(item => {
        item.supplierList.forEach(v => {
          arr.some(val => val.supplierId == v.supplierId) || arr.push({
            supplierName: v.supplierName,
            partnerType: supplierform[v.partnerType],
            supplierId: v.supplierId
          })
        })
      })
      if (!arr.length) return ElMessage.error('所选商品没有可移除的供应商!')
      state.delData = arr
      state.delSipplierShow = true
    }

    watch(() => state.tableFn, val => {
      if (!val) return
      console.log(val);
      nextTick(async () => {
        val.data.forEach(item => {
          val.validate(item)
        })
      })
    })

    function pairRemoveHandler(row) {
      pairRemove({
        id: row.id
      }).then(res => {
        state.data.find(item=>item.skuId == row.skuId).link = null
        row.pairInfo = null
        row.link = null
      })

    }
    return {
      ...toRefs(state),
      checkEvent,
      supplierInfoEdit,
      resetData,
      addSupplierOpen,
      addSupplierClose,
      addSpe,
      suppairOpen,
      returnSup,
      supplierUp,
      setDefault,
      delSupplierOpen,
      supplierform,
      pairRemoveHandler
    }
  }
}
</script>

<style lang="scss" scoped>
.supplierIndo {
  background-color: #fff;
  padding: 24px;
}

.text-row {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-row2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep(.vxe-table--expanded) {

  .vxe-table--expand-btn {

    // font-size: 16px;
    &:hover {
      color: rgb(18, 173, 241);
    }
  }
}

::v-deep(.vxe-table--expand-label) {
  .skuspan {
    margin-left: 10px;
    line-height: 26px;

    .el-checkbox {
      margin-top: 6px;
    }
  }

  .skuspan>span {
    margin-left: 10px;
    position: relative;
    top: -2px;
  }
}

.switch {
  cursor: pointer;
  margin-left: 16px;

  &:hover {
    font-size: 18px;
    color: #1890FF;
  }
}

.switchcheck {
  font-size: 18px;
  color: #1890FF;
}

.operation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.checkBox {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;

  .check {
    position: absolute;
    left: 10px;
  }
}

.check-box {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 27px;

}

.check-box>p {
  display: flex;
  align-items: center;
}

::v-deep(.vxe-table--expanded) {
  position: absolute;
  left: 8px;
}

.row-bable-box {
  padding: 12px;
}

.supBox {
  display: flex;
  margin: 5px 0;

  .info {
    min-width: 180px;
    margin-left: 3px;
    font-size: 12px;

    .p1 {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .p2 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.tbody-check-box {
  display: flex;
}
</style>
