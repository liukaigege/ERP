<!--
 * @Descripttion: 商品信息
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 14:01:54
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-21 15:08:04
-->
<template>
  <div class="productionDet">
    <div :class="index == scope.row.packageSkus.length-1 ? 'goodsItem ' :'goodsItem bd'" v-for="(item, index) in scope.row.packageSkus" :key="index" >
      <el-row>
        <el-col :span="20">
          <div class="goodsBox">
            <el-popover placement="right" :width="240" trigger="hover"  >
              <goodsImg :data="proverData(item.skuImg)" />
              <template #reference>
                <div class="goodsImg">
                  <img :src="item.skuImg" alt="" srcset="" fit="contain"/>
                </div>
              </template>
            </el-popover>
            <div class="goodsInfo">
              <el-tooltip placement="top" >
                <template #content>
                  <p style="cursor:pointer"	v-copy="item.sku">复制</p>
                </template>
              <p class="infoTitle" >		<a :href='item.thirdUrl' target="_blank">{{ item.sku }}</a></p>
            </el-tooltip>
              <p class="infoPrice">{{scope.row.currency}} {{ item.price }}</p>

               <div class="sku" v-for="(a,b) in getSkuValue(item.skuValue)" :key="b">
                   <p v-if="!a.speValmainImg"> {{a.spe}}:{{a.speVal}}</p>
                   <p v-else> {{a.spe}} :
                    <el-popover placement="right" :width="240" trigger="hover">
                      <goodsImg :data="proverData(a.speValmainImg)" />
                      <template #reference>
                     <i class="el-icon-picture"></i>
                    </template>
                  </el-popover>
                    </p>
               </div>


              <el-button type="text" v-if="item.customization == 1" @click="showAbout(item.customization,item,scope.row)">{{
                item.customization == 1 ? '定制' : '非定制'
              }}</el-button>
            </div>
          </div>
        </el-col>

        <el-col class="infoRight_box" :span="4">
          <div class="infoRight" >
            <p class="num">X{{ item.quantity }}</p>
            <p class="type" v-if="showPur(item)">
              {{ pur(item) }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { onMounted,inject,computed  } from 'vue'
import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'
import optionsDisabled from '../../util/optionsDisabled.js'
import { useStore } from 'vuex'
export default {
  components: { goodsImg },
  props: {
    scope: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const orderTable = inject('orderTable')
    // 获取的orderTable 组件
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
    const store = useStore()
    const parent = computed(()=>props.scope.parentRow)
    const disabledFun = optionsDisabled()
    const proverData = item => {
      return {
        goods: {
          skuImg: item
        }
      }
    }

    const showAbout=(type,item,fa)=>{
      if(type ==1) {
        orderTable.value.showDialog('CustomInfo','定制信息','40%',item)
      }
    }


  const isDisabled = type=>{
    return disabledFun[type](props.scope.row,parent.value,store.getters.orderType)
}

    const pur = (item)=>{
			let text = ''
			const { purchaseStatus, actualQuantity } = item?.packageGoods[0]
			switch (purchaseStatus) {
				case 0:
					text = '未采购'
					break
				case 1:
					text = '采购在途'
					break
				case 2:
					text = `到货 : ${actualQuantity}`
			}
			return text
  }


  const  getSkuValue = val=>{
       if(val) return JSON.parse(val)
  }

  const showPur = item=>{
    const {orderType} = store.getters
    let bole = true
    let typeList=[1,2,3,4,5,6,7]

    if(typeList.indexOf(Number(orderType)) == -1 ){
        bole = false
    }else if(props.scope.parentRow.deductFlag !== 1)    bole = false
    return bole
  }


    onMounted(() => {})
    return {
      proverData,
      showAbout,
      isDisabled,
      pur,
      getSkuValue,
      showPur
    }
  }
}
</script>

<style lang="scss" scoped>
  .goodsItem{
    padding: 5px 0;
  }
  .bd{
    border-bottom: 1px solid #ebeef5;
  }
.productionDet {
  padding: 6px 12px 6px 12px;
}
.goodsBox {
  display: flex;

  .goodsImg {
    min-width: 70px;
    height: 70px;
    img {
      width: auto;
      height: auto;
      max-width: 70px;
      max-height: 70px;
    }
  }
  .goodsInfo {
    margin-left: 15px;
    text-align: left;
    .infoTitle {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .infoPrice {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
      margin-top: 5px;
    }
  }
}
.infoRight_box {
  display: flex;
  justify-content: flex-end;
}
.infoRight {
  text-align: right;
  .num {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);
    margin-top: 5px;
  }
  .type {
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    margin-top: 5px;
  }
}

.sku{
  margin-top: 2px;
  p{
    font-size: 12px;
    color: #9e9e9e;
    i{
      font-size: 14px;
    }
  }
}

</style>
