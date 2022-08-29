<template>
<div class="box">
  <erp-nav title="确认商品类型" :routeOpt="routeOpt" />
  <multiSku ref="mulitiSkuRef" :skus="form.skus" :spes="form.spes" :newspe="true"/>
  <newCoustom v-model="form.data" ref="newCoustomRef" class="newCoustom" :isCustom="true" />
  <erp-footer>
    <div class="flex-pagination">
      <div></div>
      <div>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </erp-footer>
</div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import newCoustom from '@/views/goods/components/sku/components/newCoustom.vue'
import { getPurchaseInfo,customUpdate } from '@/api/goods/quotation.js'
import multiSku from '@/views/goods/components/sku/components/multiSku.vue'
import { useRoute,useRouter } from 'vue-router'
import { onMounted, provide, reactive, toRefs } from 'vue'
import optionJson from '@/views/goods/components/sku/hooks/optionJson.js'
import ErpFooter from '@/components/erpFooter/index.vue'
import { ElMessage } from 'element-plus'
import {goodsDetail} from '@/api/goods/addGoods.js'
export default {
  components: { erpNav, newCoustom, multiSku,ErpFooter },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const routeOpt = { name: 'PurchaseQuote', query: route.query }
    const state = reactive({
      form: {
        skus:[],
        spes:[],
        data:{
          goodsCustomFittingList:[],
          goodsCustomTypeList:[]
        }
      },
      newCoustomRef: null,
      mulitiSkuRef: null,
      goodsImages:[],
      attrImages:[]
    })
    provide('isDisabled',false)
    provide('routeOption',optionJson.ConfirmNewSpe)
    provide('routeName','ConfirmNewSpe')
    provide('goodsImages',state.goodsImages)
    provide('attrImages',state.attrImages)
    onMounted(() => {
      getPurchaseInfo({
        goodsId: route.query.id
      }).then(res => {
        state.form.data = {
          goodsCustomFittingList: res.data.goodsCustomFittingList || [],
          enableCustom: res.data.enableCustom?0:1,
          goodsCustomTypeList: res.data.goodsCustomTypeList?.filter(item=>item.type).map(item=>item.type) || [],
          enableContainFitting: res.data.enableContainFitting || 0,
        }
        state.form.skus = res.data.commons.skus
        state.form.spes = res.data.commons.spes
      })
      goodsDetail({goodsId:route.query.id}).then(res=>{
          res.data.goodsImages.forEach(item=>{
            state.goodsImages.push(item)
          })
          res.data.attrImages.forEach(item=>{
            state.attrImages.push(item)
          })
      })
    })

    function submit(){
      state.newCoustomRef.validate().then(res=>{
        state.newCoustomRef.emitData()
         let data = JSON.parse(JSON.stringify(state.form.data))
          data.goodsCustomTypeList = data.goodsCustomTypeList.filter(item=>item).map(item=> { return {goodsId: route.query.id,type:item}})
          data.id = route.query.id
          data.goodsCustomFittingList.forEach(val=>{
          val.goodsId = route.query.id 
          val.offerStatus = 0
          val.enableCustomImage = null
          val.enableCustomText = null
          })
          if(data.enableCustom == 0){
            data.goodsCustomTypeList = []
            data.goodsCustomFittingList = []
          }
          data.pageType = 1
          customUpdate(data).then(res=>{
            ElMessage.success('商品类型更改完成')
            router.push(Object.assign(routeOpt,{params:{update:true}}))
          })
          
      }).catch(err=>{
       ElMessage.warning('请添加配件或将配件信息填写完整')
      })
    }

    function goBack(){
      router.push(routeOpt)
    }
    return {
      routeOpt,
      ...toRefs(state),
      submit,
      goBack
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 12px;
  background-color: #fff
}
.newCoustom{
  margin-top: 10px;
}
.flex-pagination{
  padding: unset;
  padding-right: 10px;
}
</style>
