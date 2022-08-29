<template>
    <div class="headAuth">
        <div class="authContent">
            <div class="headContent ">
                <img src="../../../../assets/image/dj.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('shoplazza')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize">
                <img src="../../../../assets/image/logo2.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('vshop')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize">
                 <img src="../../../../assets/image/shopify.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('shopify')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize">
                 <img src="../../../../assets/image/funpinpin.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('funpinpin')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize">
                 <img src="../../../../assets/image/shopLine.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('shopline')"> 去授权</el-button>
                </div>
            </div>
             <div class="headContent " >
                 <img src="../../../../assets/image/xshoppy.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('xshoppy')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize" >
                 <img src="../../../../assets/image/shopyy.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('shopyy')"> 去授权</el-button>
                </div>
            </div>
            <div class="headContent contentSize" >
                 <img src="../../../../assets/image/shopbase.png" alt="" srcset="">
                <div class="headButton">
                    <el-button size="small" type="primary" @click="shopifyAuthor('shopbase')"> 去授权</el-button>
                </div>
            </div>
        </div>
        <!-- 添加授权的shopify类型的弹框 -->
         <AddAuthorizationOne v-if="showAddOne" :routerType="routerType"/>
         <AddAuthorizationTwo v-if="showAddTwo" :routerType="routerType"/>
    </div>
</template>

<script>
import AddAuthorizationOne from './components/addAuthorizationOne'
import AddAuthorizationTwo from './components/addAuthorizationTwo'
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
export default {
    name: 'storeAuthorization',
    components:{
    AddAuthorizationOne,//弹框一
    AddAuthorizationTwo,//弹框二
    },
 setup(){
     const state=reactive({
        routerType:'',
        showAddOne:false,//弹框一
        showAddTwo:false,//弹框二
     })
     //1点击shopfiy时候的弹框事件
     function shopifyAuthor(val){
         state.routerType=val
         if(val=='shoplazza'||val=='shopify'){
             state.showAddOne=true
         }else{
            state.showAddTwo =true
         }

        console.log(state.routerType,'state.routerType');

     }
     return{
         ...toRefs(state),
         shopifyAuthor
     }
 }
}
</script>

<style lang="scss" scoped>
.headAuth {
    height: 100%;
  background: #fff;
  padding: 90px 60px;
    .authContent {
        height: 100%;
        display: grid;
        grid-template-columns: repeat(5,1fr);
        grid-row-gap:25px;
        grid-column-gap:15px;
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-between;
        // align-items: center;
        .headContent {
            position: relative;
            height: 100%;
            width: 280px;
            height: 280px;
            border-radius: 3px;
            text-align: center;
            border: 2px solid #E9EFF4;
            // margin-bottom: 30px;
            &:hover {
                background: #fff;
               box-shadow: 51px 38px 59px 0px rgba(0, 16, 34, 0.1);
                .headButton {
                    display: block;
                }

            }

        }
        .headContent img {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 240px;
        }

        :deep(.el-button) {
            height: 32px;
            width: 80px;
        }

        .headButton {
            position: absolute;
            bottom: 23px;
            left: 35%;
            display: none;
        }

        .contentSize {
            // margin-left: 25px;
        }
    }

}
</style>
