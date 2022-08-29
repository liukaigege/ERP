<!--
 * @Descripttion: 发货商品
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 14:01:54
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 21:07:49
-->
<template>
  <div class="productionDet">
      <div  :class="index == scope.row.packageSkus.length-1 ? 'goodsItem ' :'goodsItem bd'" v-for="(item,index) in  scope.row.packageSkus" :key="index">
        <div v-if="!item.packageSkuMatch">
          <div v-for="(a,b) in item.packageGoods" :key="b">
            <el-row>
              <el-col  :span="20">
                <div class="goodsBox">
                  <el-popover placement="right" :width="500" trigger="hover">
                    <goodsImg :data="proverData(item,a)" :remark ="remark" />
                    <template #reference>
                  <div class="goodsImg" v-if="a.mainImg"  @mouseenter="mouseenter(a.skuId,true)" @mouseleave="mouseenter(a.skuId,false)">
                    <img :src="a.mainImg" alt="" srcset="">
                    <!--	<img :src="item.skuImg" alt="" srcset=""> -->
                  </div>
                </template>

              </el-popover>

                  <div class="goodsInfo">
                      <p class="infoTitle" >{{a.skuCode}}</p>
                      <p class="infoPrice" v-if="a.purchasePrice">CNY {{a.purchasePrice}}</p>
                      <!-- <p class="infoPrice" v-if="a.stock">库存信息 {{a.stock}}</p> -->
                    <div v-if="getSkuValue(a.skuValue)?.length > 0">
                      <div
                        class="sku"
                        v-for="(c, d) in getSkuValue(a.skuValue)"
                        :key="d"
                      >
                        <p v-if="!c.speValmainImg">
                          {{ c.speEn + ':' }} {{ c.speValEn }}
                        </p>
                        <p v-else>
                          {{ c.speEn + ':' }}
                          <el-popover
                            placement="right"
                            :width="240"
                            trigger="hover"
                          >
                            <goodsImg :data="proverDatas(c.speValmainImg)" />
                            <template #reference>
                              <i class="el-icon-picture"></i>
                            </template>
                          </el-popover>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>



              </el-col>

              <el-col class="infoRight_box" :span="4" >

                <div class="infoRight">
                  <p class="num">X{{a.goodsQuantity}}</p>
                  <el-button v-permission="'orderManagement/matchGoodsAgain'"  v-if="a.checkStatus == 0 && b == item.packageGoods.length -1" :disabled="isDisabled('matching')" type="text" @click="matching(item)">重新匹配</el-button>
                  <div class='cancelMatch'>
                    <el-button  v-permission="'orderManagement/cancelMatch'"   v-if=" (a.checkStatus || a.checkStatus ==0) && b == item.packageGoods.length -1" :disabled="item.packageGoods[0]?.exportId > 0 &&
                          item.packageGoods[0]?.customization == 1" type="text" @click="cancelMatch(scope.row.packageSkus,index)">解除匹配</el-button>
  <!--									&& a.addType === 1   解除判断是否是手动还是自动0自动 1手动-->
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else>
          <el-row>
              <el-col  :span="20">
                <div class="goodsBox">
                  <el-popover placement="right" :width="500" trigger="hover">
                    <goodsImg :data="proverData(item,item.packageSkuMatch)" :remark ="remark" />
                    <template #reference>
                  <div class="goodsImg" v-if="item.packageSkuMatch.mainImg"  @mouseenter="mouseenter(item.packageSkuMatch?.skuId,true)" @mouseleave="mouseenter(item.packageSkuMatch?.skuId,false)">
                    <img :src="item.packageSkuMatch?.mainImg" alt="" srcset="">
                  </div>
                </template>

              </el-popover>

                  <div class="goodsInfo">
                      <p class="infoTitle" >{{item.packageSkuMatch.skuCode}}</p>
                      <p class="infoPrice" v-if="item.purchasePrice">CNY {{item.packageSkuMatch.purchasePrice}}</p>
                    <div v-if="getSkuValue(item.packageSkuMatch.skuValue)?.length > 0">
                      <div
                        class="sku"
                        v-for="(c, d) in getSkuValue(item.packageSkuMatch.skuValue)"
                        :key="d"
                      >
                        <p v-if="!c.speValmainImg">
                          {{ c.speEn + ':' }} {{ c.speValEn }}
                        </p>
                        <p v-else>
                          {{ c.speEn + ':' }}
                          <el-popover
                            placement="right"
                            :width="240"
                            trigger="hover"
                          >
                            <goodsImg :data="proverDatas(c.speValmainImg)" />
                            <template #reference>
                              <i class="el-icon-picture"></i>
                            </template>
                          </el-popover>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>



              </el-col>

              <el-col class="infoRight_box" :span="4" >

                <div class="infoRight">
                  <p class="num">X{{item.packageSkuMatch.quantity}}</p>
                    <el-popover placement="left-start" trigger="hover" width="auto" >
                      <SingleItem :quantity="item.packageSkuMatch.quantity" :list=" item.packageGoods" />
                      <template #reference>
                        <el-button type="text">查看单品</el-button>
                      </template>
                    </el-popover>
                  <div class='cancelMatch'>
                    <el-button v-permission="'orderManagement/matchGoodsAgain'" v-if="item.packageGoods[0]?.checkStatus == 0" :disabled="isDisabled('matching')" type="text" @click="matching(item)">重新匹配</el-button>
                  </div>
                  <el-button  v-permission="'orderManagement/cancelMatch'" v-if="(item.packageGoods[0]?.checkStatus || item.packageGoods[0]?.checkStatus ==0)" :disabled="item.packageGoods[0]?.exportId > 0 &&
                          item.packageGoods[0]?.customization == 1" type="text" @click="cancelMatch(scope.row.packageSkus,index)">解除匹配</el-button>

                </div>
              </el-col>
            </el-row>
        </div>

        <div v-if="!item.packageGoods ||item.packageGoods.length == 0" >
          <div class="matching">
            <el-button v-permission="'orderManagement/matchGoods'" :disabled="isDisabled('matching')" type="text" @click="matching(item)">匹配</el-button>

           </div>
        </div>
      </div>
  </div>
</template>

<script>
  import {inject, reactive, toRefs, computed,onMounted} from 'vue'
  import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'
  import optionsDisabled from '../../util/optionsDisabled.js'
  import { useStore } from 'vuex'
  import {contentBySku,relieveGoodsBases} from '@/api/order/orderManagement.js'
	import {confirm} from '../../../../../utils/tool'
	import {ElMessage} from 'element-plus'
  import SingleItem from '@/views/order/orderManagement/orderDetail/components/singleItem.vue'
	export default {
  components:{goodsImg, SingleItem},
   props:{
     scope:{
       type:Object,
       default:null
     },
     packageStatus:{
       type:Number,
       default:0
     }
   },
   setup(props){
    const orderTable = inject('orderTable')
    // 获取的orderTable 组件
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
    const store = useStore()
    const parent = computed(()=>props.scope.parentRow)
    const disabledFun = optionsDisabled()

    const data = reactive({
      tableList:[],
      show:[],
      remark:null
     })

     const matching = (item)=>{
        orderTable.value.showDialog('MatchOrder','匹配商品','40%',{query:item})
     } // 匹配商品

		 const cancelMatch = (item,index)=>{
				console.log(item)
			 confirm('确定解除当前发货商品的配对关系?',_=>{
				 const {packageSkuId, sku} = item[index]
				 relieveGoodsBases({packageSkuId,sku,status:0}).then(res=>{
					  if(res.code === 200){
							ElMessage.success('成功解除!')
							formOptions.value.init()
						}
				 })
			 })
		 } // 解除匹配

     const proverData = (item,a)=>{
      return {
        goods:{
          skuImg:a.mainImg
					// skuImg:item.skuImg
        },
        skugoods:{
          goodsName:a.goodsName,
          customsWeight:a.customsWeight,
          customsAttribute:a.customsAttribute,
          remark:a.remark,
          purchaseLength:a.purchaseLength,
          purchaseWidth:a.purchaseWidth,
          purchaseHeight:a.purchaseHeight,
          skuId:a.skuId
        }
      }
  }

  const isDisabled = type=>{

    return disabledFun[type](props.scope.row,parent.value,store.getters.orderType)
}

    const mouseenter =(skuId,val) =>{
    if(!val) return data.remark = null
      contentBySku({skuId}).then(res=>{
          // console.log(res)
          if(res.code == 200){
             data.remark = res.data
          }
        })
  }
		 const getSkuValue = val => {
			 if (val) {
				 return JSON.parse(val) || []
			 } else {
				 return []
			 }
		 }


    onMounted(()=>{
      data.tableList = props.scope.row.packageSkus

    })

     return {
       ...toRefs(data),
       matching,
			 cancelMatch,
       proverData,
       isDisabled,
       mouseenter,
			 getSkuValue
     }
   }
 }

</script>

<style lang="scss" scoped>
  .goodsItem{
    padding: 5px 0;
    width: 100%;
  }
  .bd{
    border-bottom: 1px solid #ebeef5;
  }
 .productionDet{
   padding: 6px 12px 0 12px;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
  .matching{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 77px;
  }
 }
   .goodsBox{
     display: flex;
     min-height: 77px;
     .goodsImg{
        min-width: 70px;
        height: 70px;
        img{
          width: auto;
          height: auto;
          max-width: 70px;
          max-height: 70px;
        }
       position: relative;
       .tag_no{
         position: absolute;
         right: 0;
         bottom: 0;
         z-index: 2;
         padding: 2px 5px;
         background: #E6F7FF;
          border: 1px solid #91D5FF;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890FF;
       }
     }
     .goodsInfo{
       margin-left: 15px;
       text-align: left;
       .infoTitle{
         font-size: 12px;
         font-family: PingFangSC-Medium, PingFang SC;
         font-weight: bold;
         color: rgba(0, 0, 0, 0.85);
       }
       .infoPrice{
         font-size: 12px;
         font-family: PingFangSC-Medium, PingFang SC;
         font-weight: 500;
         color: rgba(0, 0, 0, 0.65);
         margin-top: 5px;
       }
			 .sku{
				 font-size: 12px;
				 font-family: PingFangSC-Medium, PingFang SC;
				 font-weight: 500;
				 color: rgba(0, 0, 0, 0.65);
				 margin-bottom: 2px;
			 }
     }
   }
   .infoRight_box{
     display: flex;
     justify-content: flex-end;
   }
   .infoRight{
     text-align: right;
     .num{
       font-size: 12px;
       font-family: PingFangSC-Medium, PingFang SC;
       font-weight: 500;
       color: rgba(0, 0, 0, 0.65);
       margin-top: 15px;
     }
     .type{
       font-size: 10px;
       font-family: PingFangSC-Regular, PingFang SC;
       font-weight: 400;
       color: rgba(0, 0, 0, 0.45);
       margin-top: 5px;
     }
   }

	 :deep(.cancelMatch .el-button){
		 padding: 0 !important;
		 min-height: 20px;
	 }

</style>
