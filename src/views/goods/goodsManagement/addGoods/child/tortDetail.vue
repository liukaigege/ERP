<template>
  <div class="container">
      <Infring :id="id" v-if="id" @callBack="callBack" />
  </div>

</template>


<script>
import {toRefs,reactive,onMounted,h} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import Infring from '@/views/goods/goodsManagement/infringingDetail/index.vue'
import {activateCheck} from '@/api/goods/addGoods.js'
import { ElMessageBox} from 'element-plus'

export default {
    components:{Infring},
    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const  data = reactive({
        id:null
      })

      function  callBack(val){
        console.log(val)
         val ? apply() : back()
      }

      function  apply(){
        const goodsId =  route.query.goodsId
          activateCheck({goodsId}).then(res=>{
              if(res.code == 200){
                ElMessageBox({
               title: '申请成功',
               message: h('p', null, [
                h('p', null, '申请审核成功，请等待审核结果。'),
                h('p', null, `审核通过后，可直接在【商品开发-待申请】中查看。`),
              ]),
               showCancelButton: true,
               showConfirmButton:false,
              cancelButtonText: '取消',
              closeOnPressEscape	:false,
              closeOnClickModal:false
             }).then((a)=>{
                 back()
             }).catch(()=>{
                back()
             })
              }

          })
      }


    function back(){
      router.go(-1)
    }
      onMounted(() => {
        data.id = Number( route.query.goodsId) || null
        console.log(data.id)
      })


      return{
        ...toRefs(data),
        callBack
      }
    }

}
</script>

<style lang="scss" scoped>

</style>
