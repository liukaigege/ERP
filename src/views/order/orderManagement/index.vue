<!--
 * @Descripttion: 标准订单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-14 15:30:50
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 09:56:22
-->

<template>
 <div class="orderC">
    <div class="orderContainer" >
      <TabHeader ref="tabHeader" :defaultData="defaultData" />
      <FormOptions ref="formOptions" :defaultData="defaultData" class="formOptions" />
      <Sort ref="sortRef" class="sort" />
      <OrderTable ref="orderTableRef" class="table" @showDialog= 'showDialog' />
    </div>




  <component
		v-if="dialogVisible"
		:is="url"
		:dialogTitle="dialogTitle"
		:dialogVisible="dialogVisible"
		:width="width"
		:data="dialogQuery"
	/>


</div>



</template>

<script>
import TabHeader from './components/tabHeader.vue'
import FormOptions from './components/formOptions.vue'
import Sort from './components/sort.vue'
import OrderTable from '@/views/order/orderManagement/components/orderTable.vue'
// import orderDetail from '@/views/order/orderManagement/orderDetail.vue'
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
import LogisticInfo from '@/views/order/orderManagement/components/orderDialog/logisticInfo.vue' // 物流信息
import AddGoodsDiloag from '@/views/order/orderManagement/components/orderDialog/addGoods.vue' //追加发货商品
import ReissuePrinted from  '@/views/order/orderManagement/components/orderDialog/reissuePrinted.vue' // 补打单原因
import refund from '@/views/order/orderManagement/components/refund.vue' // 退款
import { onMounted, provide, reactive, ref, nextTick, computed, watch, toRefs,onUnmounted,onActivated, } from 'vue'
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
import {orderIndexParmas} from './util/indexHooks.js'
export default {
  name:'OrderManagement',
  components: {
		TabHeader,
		FormOptions,
		Sort,
		OrderTable,
    AddGoodsDiloag,
    Shelve,
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
    LogisticInfo,
		ReissuePrinted,
    refund,
  },
  setup() {
		const store = useStore()
    const route = useRoute()
    const data = reactive({
      orderList: [],
      showCom:false,
      dialogVisible: false,
      dialogTitle: '提示',
      width: '30%',
      url: 'Shelve',
      dialogQuery:null,
			defaultData:route.params?route.params:null
    })


    const sortRef =ref()
    const orderTableRef = ref()
    const formOptions = ref()
    const tabHeader = ref()
    provide('orderTable',orderTableRef)
    provide('formOptions',formOptions)
    // 注入orderTable
    provide('tabHeader',tabHeader)
    //注入头部
    provide('sortRef',sortRef)
    //注入sort

    const showDialog = x =>{
      const {val,title,width,query} = x
      data.dialogVisible = true
      data.url = val
      if (title) data.dialogTitle = title
      if (width) data.width = width
      data.dialogQuery = query
    }

    const resertOrder = val =>{
      store.dispatch('orderManage/clearStateByActions')
      store.dispatch('orderManage/setTabTypeByActions', 'pending')
      store.dispatch('orderManage/setOrderStatusByActions', 1)
      formOptions.value.form.orderStatus = 1
			formOptions.value.form.start= null
			formOptions.value.form.end= null
    }
    onMounted(()=> {
      // resertOrder()
   })

    onActivated(()=>{
			/**
			 * status  98 批量修改报关信息
			 * status 97 批量修改收件人信息
			 * */

        const {status,skuId,tabType,dateType,shipmentStatus,timeType,isShelve,searchType,searchText,attribute } = route.params

				// attribute 1定制商品 2带电商品 3带磁商品 4液体商品 5含粉末商品 6侵权商品 7有赠品 8普通商品 9定制(普)商品
				if(attribute === '0') formOptions.value.form.attribute = '8'
				else if(attribute === '1') formOptions.value.form.attribute = '1'

				const searchTextWords = searchText == 'null' ? null : searchText
				const jumpInformation = localStorage.getItem('jumpInformation') ? JSON.parse(localStorage.getItem('jumpInformation')) : null
				localStorage.removeItem('jumpInformation')
				if(jumpInformation){
					orderTableRef.value.showStatus = false
					if(jumpInformation.status == 999){
						// 999 定义为全部订单
						store.dispatch('orderManage/setTabTypeByActions', 'allOrder')
						formOptions.value.form.searchType = jumpInformation.searchType || 'skuId'
						formOptions.value.form.searchText = jumpInformation.searchType =='orderId' ? jumpInformation.searchText : jumpInformation.skuId
						formOptions.value.form.orderStatus = null
						if(!dateType){
							formOptions.value.form.start= null
							formOptions.value.form.end= null

						}
						if(isShelve !== '1' && !shipmentStatus)formOptions.value.form.layFlag = 0
					}
				}
			// route.params { status：999,searchType: 'orderId', searchText : '',skuId:null,tabType:null,dateType:null,shipmentStatus:null,timeType:null,isShelve:null}
        if(!route.params.skuId && status === '1'){
          resertOrder()
					formOptions.value.init()
        }else if(status){
					if(dateType){
						if(Number(dateType) !==7 ){
							let daterange =	Number(dateType) === 3 ? 	formOptions.value.daterange = orderIndexParmas[Number(dateType)]() :	formOptions.value.daterange = orderIndexParmas[Number(dateType)]
							formOptions.value.form.start = daterange[0]
							formOptions.value.form.end= daterange[1]
							formOptions.value.daterange = daterange
						}else{
							Object.assign(formOptions.value.form,{homeOrdersDayUp:20,start:null,end:null})
						}

					}
					if(timeType){
						formOptions.value.form.timeType = timeType
					}

					if(status === '10'){
						formOptions.value.form.orderStatus = null
						formOptions.value.form.layFlag = 1
						formOptions.value.form.searchText = skuId
						formOptions.value.form.searchType = 'skuId'
						formOptions.value.form.start= null
						formOptions.value.form.end= null
						//搁置
					}else if(status ==='999'){ // 999 定义为全部订单
						store.dispatch('orderManage/setTabTypeByActions', 'allOrder')
						formOptions.value.form.searchType = searchType || 'skuId'
						formOptions.value.form.searchText = searchType =='orderId' ? searchTextWords : skuId
						formOptions.value.form.orderStatus = null
						if(!dateType){
							formOptions.value.form.start= null
							formOptions.value.form.end= null

						}
						if(isShelve !== '1' && !shipmentStatus)formOptions.value.form.layFlag = 0
					}else if(status =='98'|| status =='97'){
						// 批量修改报关信息 和批量修改收件人 就不做刷新
						return
					}
					else{
						formOptions.value.form.orderStatus = Number(route.params.status)
						formOptions.value.form.layFlag = 0
						formOptions.value.form.searchType = 'skuId'
						formOptions.value.form.searchText = skuId
						formOptions.value.form.start= null
						formOptions.value.form.end= null
					}


					if(tabType){
						store.dispatch('orderManage/setTabTypeByActions', tabType)
						store.dispatch('orderManage/setOrderStatusByActions', Number(status) === 999 ? '' :status)
					}

					let st = null ,layFlag = null
					if(shipmentStatus ){
						switch (shipmentStatus){
							case '0':
								st =[0,1,2,3,4,5,6,7]
								layFlag = 0
								break;
							case '1':
								layFlag = 1
								break;
							case '2' :
								st = [6]
								layFlag = 0
								break;
							case '3':
								st =[0,1,2,3,4,5,7]
								layFlag = 0
								break;
							case '4':
								st =[8]
								layFlag = 0
						}
						console.log(st,layFlag)
						if(shipmentStatus !=='0'){
							const d = orderIndexParmas[7]()
							Object.assign(formOptions.value.form,{start:d[0],end:d[1]})
							formOptions.value.daterange = d
						}
						Object.assign(formOptions.value.form,{orderStatus:st,layFlag})

					}

					formOptions.value.init()
				}
				else{
					// resertOrder()

					formOptions.value.init()
				}

    })





    onUnmounted(()=>{

			store.dispatch('orderManage/clearStateByActions')
			// store.dispatch('orderManage/setTabTypeByActions', 'pending')
			// store.dispatch('orderManage/setOrderStatusByActions', 1)
			// console.log('卸载',store.getters)
    }) // 卸载

    return {
      ...toRefs(data),
      sortRef,
      orderTableRef,
      formOptions,
      tabHeader,

      showDialog
    }
  }
}
</script>

<style lang="scss" scoped>
.orderContainer {
  .formOptions {
    margin-top: 24px;
  }
  .sort {
    margin: 15px 0;
  }
  .table{
    margin-bottom: 40px;
  }
}

</style>
