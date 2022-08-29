<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-08-03 14:33:53
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 16:05:56
-->

<template>
  <div class="box">
    <div class="img">
      <img v-if="goods" :src="goods.skuImg" alt="">
    </div>
    <div class="info" v-if="skugoods">
      <p> {{skugoods.goodsName}}</p>
      <p v-if="skugoods.customsWeight"> 重量:{{skugoods.customsWeight}}g</p>
       <p v-if="vloit()"> 体积:{{vloit()}}</p>
      <p> 属性:{{skugoods.customsAttribute || '暂无'}}</p>
      <p> 备注信息:{{remark|| '暂无'}}</p>
    </div>
  </div>
</template>


<script>
import { reactive, toRefs, onMounted, watch,onActivated} from 'vue'
import {contentBySku} from '@/api/order/orderManagement.js'
  export default {
    props:{
      data:{
        type:Object,
        default:null
      },
      remark:{
        type:String,
        default:null
      }
    },
    setup(props){
      const data = reactive({
        goods:null,
        skugoods:null
      })

    watch(()=>props.data,(a)=>{
      const {goods,skugoods} = a
      data.goods = goods
      if(skugoods){
        data.skugoods = skugoods
      }
    })

    const vloit = ()=>{
       const {purchaseLength,purchaseWidth,purchaseHeight} = data.skugoods
       if(!purchaseLength && !purchaseWidth && !purchaseHeight) return false
       let l = purchaseLength ? purchaseLength : '-'
       let w = purchaseWidth ? purchaseWidth : '-'
       let h = purchaseHeight ? purchaseHeight : '-'

       let volit =`${l}*${w}*${h}`
       return volit
    }

      onMounted(()=>{
        const {goods,skugoods} = props.data
        data.goods = goods
        if(skugoods){
          data.skugoods = skugoods
        //   const {skuId} = skugoods
        // contentBySku({skuId}).then(res=>{
        //   // console.log(res)
        //   if(res.code == 200){
        //      data.skugoods.remark = res.data
        //   }
        // })
        }


      })

      return {
        ...toRefs(data),
        vloit
      }
    }
  }

</script>

<style lang="scss" scoped>
  .box{
    display: flex;

    justify-content:center;
    .img{
       width: 200px;
       height: 200px;
       display: flex;
       align-items: center;
       justify-content: center;
       img{
        width: auto;
        height: auto;
        max-width: 200px;
        max-height: 200px;

       }
    }
    .info{
      width: 200px;
      margin-left: 36px;
        p{
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 16px;
        }
    }
  }
</style>
