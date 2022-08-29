<template>
  <div>
    <ProductionDet :scope="scope" v-if="show([1,2,3,4,5,6,7,8,-1,-2,-3,-4,10])"/>
    <ProductionDetBK  :scope="scope" v-if="show([9])"/>

    <div  v-if="show([0])">

      <ProductionDet :scope="scope" v-if="showD()"/>
      <OrderGoods v-else :scope="scope"/>
    </div>
  </div>
</template>

<script>
import ProductionDet from '@/views/order/orderManagement/components/orderTableTd/productionDet.vue'
import ProductionDetBK from '@/views/order/orderManagement/components/orderTableTd/productionDetBK.vue'
import OrderGoods from '@/views/order/orderManagement/components/orderTableTd/orderGoods.vue'
export default{
    components:{ProductionDet,ProductionDetBK,OrderGoods},
   props: {
    scope: {
      type: Object,
      default: null
    }
  },
  setup(props) {

    function show(val){
      if(val.indexOf(props.scope.parentRow.packageStatus) !==-1) return true
      return false
    }


    function showD(){
       const {packageSkus} = props.scope.row
       let bole =  packageSkus.every(item=>item.packageGoods?.length > 0)
        return bole
    } // 显示待审核


    return {
      show,
      showD
    }
  }
}

</script>
