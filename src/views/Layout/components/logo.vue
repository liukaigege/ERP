<!--
 * @Descripttion: 
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-09 14:33:24
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-09 14:46:07
-->

<template>
  <transition :name="transitionName" mode="out-in">
    <img class="logoA" :src="logoA" v-if="!isCollapse">
    <img class="logoB" :src="logoB" v-else>
  </transition>
</template>


<script>
  import {toRefs, reactive} from 'vue'
  import logoA from '@/assets/image/logo/logo.png'
  import logoB from '@/assets/image/logo/logoB.png'
export default {
   props:{
    isCollapse:{
      type:Boolean,
      default:true
    }
   },
   setup(){
     const state = reactive({
       logoA : logoA,
       logoB :logoB,
       transitionName: "slide-left"
     }) 
     return{
       ...toRefs(state)
     }
   }

}
</script>

<style lang="scss" scoped>
.logoA{
  width: 180px;
  height: auto;
}
.logoB{
  width: 30px;
  height: auto;
}

</style>