<!--
 * @Descripttion: 
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-14 14:19:05
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-14 15:00:03
-->

<template>
  <div class="container">
      <div class="box">
        <div class="left">
          <img src="../../../assets/image/404bg.png" alt="" srcset="">
        </div>
        <div class="right">
            <p class="title">404</p>
            <p class="text">{{title}}</p>
            <el-button type="primary" @click="backHome">返回首页</el-button>
        </div>
      </div>
  </div>
</template>


<script>
  import {useRouter,useRoute} from 'vue-router'
  import {onMounted,getCurrentInstance, toRefs, reactive} from 'vue'
  export default {
      setup(){
        const router = useRouter()
        const {proxy} = getCurrentInstance()
        const data = reactive({
          title : '抱歉，你没有访问该页面的权限'
        })
        const backHome = ()=>{
          router.replace({path:'/index'})
        }
        onMounted(()=>{
          if(proxy.routeParams.title){
            data.title = proxy.routeParams.title
          }
        })
        return {
          ...toRefs(data),
          backHome
        }
      }
  }  

</script>


<style lang="scss" scoped>
.container{
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img{
    width: 438px;
    height: 267px;
  }
  .box{
    display: flex;
    align-items: center;

  }
  .right{
    width: 438px;
    height: 267px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 120px;
    .title{
      font-size: 56px;
      font-family: '黑体';
      font-weight: 500;
      color: #000000;
      margin-bottom: 8px;
    }
    .text{
      font-size: 16px;
      font-weight: 400;
      color: #9e9e9e;
      font-family: '黑体';
      margin-bottom: 24px;
    }
  }

}
</style>