<!--
 * @Descripttion: 收件人信息
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:22:30
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-13 09:34:41
-->

<template>
  <div class="addressee">
     <div>[{{item.country}}] {{item.name}} </div>
     <div>{{item.email}}</div>
     <div>{{item.source}}：<a v-if='item.domain' target='_blank' :href='item.domain'>{{item.domain}}</a> </div>
     <div>买家指定：{{item.shippingsName ? item.shippingsName :'暂无'}}</div>
  </div>
</template>

<script>
  import {computed,onMounted} from 'vue'
  export default {
    props:{
      scope:{
        type:Object,
        default:null
      }
    },
    setup(props){
      const item  = computed(()=>props.scope.row)

      onMounted(()=>{

      })
      return {
        item
      }
    }
  }
</script>
<style lang="scss" scoped>
.addressee{
text-align: left;
font-size: 12px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: rgba(0, 0, 0, 0.65);
padding: 0px 10px;
div{
  margin-top: 3px;
}
}
</style>
