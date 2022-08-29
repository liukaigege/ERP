<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 10:01:13
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-15 15:12:38
-->
<template>
  <div class="orderTable">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      v-if="showPermission(orderTabType, 'pending') && mergeNum"
    >
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane :label="`可合并（${mergeNum[0].cnt || 0}）`" name="1"></el-tab-pane>
      <el-tab-pane :label="`已合并（${mergeNum[1].cnt || 0}）`" name="2"></el-tab-pane>
      <el-tab-pane :label="`已拆分（${mergeNum[2].cnt || 0}）`" name="3"></el-tab-pane>
    </el-tabs>


    <Eltable
      ref="tableRef"
      :checkboxType="1"
      :spanColumns="spanColumns"
      :isSpanColumns="isSpanColumns"
      :parentNode="'packageRels'"
      :tableData="tableData"
      :columns="columns"
      :border="true"
      checkedKey="packageId"
      fieldName="packageRels"
      @selectRowKeys="selectRowKeys"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :isMearg="meargeStatus"
      :mearge="meargeData"
      :meargeKey="meargeKey"
      :isDisable="true"
      :isRowSpanLogis="isRowSpanLogis"
      :isValign= "true"
    >
      <template v-slot:extraHeader="scope" >
        <ExtraHeader :scope="scope" />
      </template>

      <template v-slot:goodsDetail="scope" >
        <ProductionDet :scope="scope" />
      </template>

      <template v-slot:allGoodsDetail="scope" >
        <AllOrderDetail :scope="scope" />
      </template>

      <template v-slot:toBePaidGoodsDetail="scope" >
        <ProductionDetBK :scope="scope" />
      </template>

      <template v-slot:orderGoods="scope">
        <OrderGoods :scope="scope" />
      </template>

      <template v-slot:sendGoods="scope">
        <SendGoods :scope="scope" />
      </template>

      <template v-slot:orderNum="scope">
        <OrderNum :scope="scope" />
      </template>

      <template v-slot:amount="scope">
        <OrderAmount :scope="scope" />
      </template>

      <template v-slot:addressee="scope">
        <Addressee :scope="scope" />
      </template>

      <template v-slot:time="scope">
        <Date :scope="scope" />
      </template>

      <template v-slot:logistics="scope">
        <Logistics :scope="scope" />
      </template>

			<template v-slot:refundedMoney="scope">
				<RefundedMoney :scope="scope" />
			</template>

      <template v-slot:options="scope">
        <Options :scope="scope" :tableData="tableData" />
      </template>
    </Eltable>


<!--
    <component
      v-if="dialogVisible"
      :is="url"
      :dialogTitle="dialogTitle"
      :dialogVisible="dialogVisible"
      :width="width"
      :data="dialogQuery"
    /> -->
  </div>
</template>

<script>
import Eltable from '@/components/elTable/index.vue'
import AllOrderDetail from '@/views/order/orderManagement/components/orderTableTd/allOrderDetail.vue'
import ProductionDet from '@/views/order/orderManagement/components/orderTableTd/productionDet.vue'
import ProductionDetBK from '@/views/order/orderManagement/components/orderTableTd/productionDetBK.vue'
import ExtraHeader from '@/views/order/orderManagement/components/orderTableTd/extraHeader.vue'
import OrderNum from '@/views/order/orderManagement/components/orderTableTd/orderNum.vue'
import OrderAmount from '@/views/order/orderManagement/components/orderTableTd/orderAmount.vue'
import Addressee from '@/views/order/orderManagement/components/orderTableTd/addressee.vue'
import Date from '@/views/order/orderManagement/components/orderTableTd/date.vue'
import Logistics from '@/views/order/orderManagement/components/orderTableTd/logistics.vue'
import Options from '@/views/order/orderManagement/components/orderTableTd/options.vue'
import OrderGoods from '@/views/order/orderManagement/components/orderTableTd/orderGoods.vue'
import RefundedMoney from '@/views/order/orderManagement/components/orderTableTd/refundedMoney.vue'//退款金额
import SendGoods from '@/views/order/orderManagement/components/orderTableTd/sendGoods.vue'
import Shelve from '@/views/order/orderManagement/components/orderDialog/shelve.vue' // 搁置
import Remarks from '@/views/order/orderManagement/components/orderDialog/remarks.vue' // 备注
import changeLogistics from '@/views/order/orderManagement/components/orderDialog/logistics.vue' // 备注
import SplitOrder from '@/views/order/orderManagement/components/orderDialog/splitOrder.vue' //拆分订单
import MergeOrder from '@/views/order/orderManagement/components/orderDialog/mergeOrder.vue' //合并订单
import ImportOrder from '@/views/order/orderManagement/components/orderDialog/importOrder.vue' //合并订单
import MatchOrder from '@/views/order/orderManagement/components/orderDialog/matchOrder.vue' //合并订单
import CustomInfo from '@/views/order/orderManagement/components/orderDialog/customInfo.vue' //合并订单
import ImportDeliver from '@/views/order/orderManagement/components/orderDialog/importDeliver.vue' //导入发货
import ImportLogistic from '@/views/order/orderManagement/components/orderDialog/importLogistic.vue' //导入物流
import PrintInfo from '@/views/order/orderManagement/components/orderDialog/printInfo.vue' //导入物流
import NoMergeOrder from '@/views/order/orderManagement/components/orderDialog/noMergeOrder.vue' //取消合并订单
import ChangePayType from '@/views/order/orderManagement/components/orderDialog/changePayType.vue' //单个变更支付状态
import ChangeMorePay from '@/views/order/orderManagement/components/orderDialog/changeMorePay.vue' //批量编辑支付状态
import CancelSplitOrder from '@/views/order/orderManagement/components/orderDialog/cancelSplitOrder.vue'// 取消拆分选择物流
import AddGoodsDiloag from '@/views/order/orderManagement/components/orderDialog/addGoods.vue' //追加发货商品
import {getMergeFlagCnt} from '@/api/order/orderManagement.js'
import {
  reactive,
  toRefs,
  computed,
  ref,
  onMounted,
  getCurrentInstance,
  inject,
  watch
} from 'vue'
import orderOptions from '../util/options.js'
import { useStore } from 'vuex'
export default {
  components: {
    Eltable,
    ProductionDet,
    ProductionDetBK,
    ExtraHeader,
    OrderNum,
    OrderAmount,
    Addressee,
    Date,
    Logistics,
    Options,
    OrderGoods,
    SendGoods,
    Shelve,
		RefundedMoney,
    Remarks,
    changeLogistics,
    SplitOrder,
    MergeOrder,
    ImportOrder,
    MatchOrder,
    CustomInfo,
    ImportDeliver,
    ImportLogistic,
    PrintInfo,
    NoMergeOrder,
    ChangePayType,
    ChangeMorePay,
    CancelSplitOrder,
    AddGoodsDiloag,
    AllOrderDetail,
  },
  setup(props,{emit}) {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件

    const data = reactive({
      activeName: '0',
			showStatus:true,
      tableData: [],
      dialogVisible: false,
      dialogTitle: '提示',
      width: '30%',
      url: 'Shelve',
      dialogQuery:null,
      selectRows:[],
      mergeNum:null,
      loading:true,
      meargeStatus:false,// 是否合并包裹
      meargeData:null, // 合并包裹的参数
      meargeKey:null, // 合并字段
      isRowSpanLogis:true, // 包裹合并多订单物流方式
    })


    const orderTabType = computed(() => store.getters.orderTabType)
    const selectList = computed(()=>data.selectRows)
    const selectInfo = computed(() => {
      let arr = []
      data.tableData.forEach(item => {
        let bole = data.selectRows.includes(item.packageId)
        if (bole) arr.push(item)
      })
      return arr
    })
    const columns = computed(() => {
      const { orderTabType } = store.getters
      let list = orderOptions[orderTabType].tableTh
      let perList = []
      list.forEach(item=>{
        let key = `orderManagement/form/${item.key}`
        if(proxy.permissonList[key]) {
          perList.push(item)
        }
      })
			// console.log(proxy.permissonList,'perlist')
      return perList

    })
    const spanColumns = computed(() => {
      const { orderTabType } = store.getters
      if (orderOptions[orderTabType].isSpanColumns)
        return orderOptions[orderTabType].spanColumns
    }) // 合并单元格的字段
    const isSpanColumns = computed(() => {
      const { orderTabType } = store.getters
      return orderOptions[orderTabType].isSpanColumns
    }) // 是否开启合并单元格
    const tableRef = ref()
    const handleClick = e => {
      const { paneName } = e
      formOptions.value.resert(false)
      if(paneName !== 0){
        formOptions.value.form.start = ''
        formOptions.value.form.end = ''
        formOptions.value.daterange = []
      }
      formOptions.value.form.infoCodeFlag =
      paneName !== '0' ? Number(paneName) : ''
      let key = 'prefixId'
      if(paneName == 1)  key = 'infoCode'
      data.meargeKey = key
      formOptions.value.init(1).then(res=>{
        data.meargeData = getMerge(res,key)
      })

      /// 分页时要重新获取合并数据

      if(paneName == '1' || paneName == '3') {
        data.meargeStatus = true

      }else{
        data.meargeStatus = false
      }

      store.dispatch('orderManage/setMerageStatusByActions',paneName)

    } // 切换tab


    function getMergeData(res){
      let key = 'prefixId'
      if(data.activeName =='1') key ='infoCode'
         data.meargeData =  getMerge(res,key)
    } // 分页时获取合并数据




    const getMerge = (arr,key="infoCode")=>{
      let newObj = new Object()
      for(let i = 0; i<arr.length;i++){
        let infoCode = arr[i][key]
        if(!getObjectKey(infoCode)){
           newObj[infoCode] = new Object()
           newObj[infoCode].startIndex = i
           newObj[infoCode].rowSpan = arr[i].packageRels.length
           newObj[infoCode].packgeNum = 1
           newObj[infoCode].packageId = arr[i].packageId
        }else{
          newObj[infoCode].rowSpan += arr[i].packageRels.length
          newObj[infoCode].packgeNum += 1
        }

      }

      function getObjectKey(key){
        if(!newObj[key]) return false
        return true
      }
       return newObj
    }


    const rowSpan = () => {
      const arr = [
        {
          key: 'option', //键值名
          rowArr: [1, 2, 3]
        }
      ]
    }




    const showDialog = (val, title, width,query) => {
      // if (!isSelected()) return
      emit('showDialog',{val,title,width,query})


    }

    const selectRowKeys = (val)=>{

      if(val.length > 0){
        formOptions.value.checked = true
        formOptions.value.selectedLength = val.length
      }else{
        formOptions.value.checked = false
        formOptions.value.selectedLength = 0
      }
       data.selectRows = val
    }
    const getMergeNum = ()=>{
      getMergeFlagCnt().then(res=>{
        if(res.code == 200){
            data.mergeNum = res.data
        }
      })
    }

    onMounted(() => {
     //getMergeNum()
    // console.log(proxy.permissonList,'权限列表')
    })
    return {
      ...toRefs(data),
      handleClick,
      tableRef,
      orderTabType,
      columns,
      spanColumns,
      isSpanColumns,
      showDialog,
      selectRowKeys,
      getMergeNum,
      selectList,
      getMerge,
      getMergeData,
      selectInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.orderTable {
  padding: 20px 20px;
  background: white;
}
:deep(.el-loading-mask){
  z-index: 99!important;
}

</style>
