<template>
  <div>
    <erp-nav title="采购报价" :goBack="goBack" routeOpt="/goods/goodsManagement/quotation"></erp-nav>
    <div class="purchase-quote-tabs-box">
      <el-tabs v-model="activeName" class="purchase-quote-tabs">
        <el-tab-pane label="商品信息" name="GoodsInfo"></el-tab-pane>
        <el-tab-pane label="采购报价" name="PurchaseInfo"></el-tab-pane>
      </el-tabs>
      <div class="right-box">
				<el-button type="primary" :disabled="!prevGoodsId" @click="changeGoodsFn(prevGoodsId,-1)">上一个</el-button>
				<el-button type="primary" :disabled="!nextGoodsId" @click="changeGoodsFn(nextGoodsId,1)">下一个</el-button>
        <el-button :disabled="!isEdit" type="primary"  v-if="activeName === 'PurchaseInfo'" @click="save">保存</el-button>
      </div>
    </div>
    <div class="mt-50">
      <goods-info ref="goodsDescriptionRef" v-show="activeName === 'GoodsInfo'"></goods-info>
      <purchase-info ref="purchaseInfo" v-show="activeName === 'PurchaseInfo'" :isEdit="isEdit"></purchase-info>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed,ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ErpNav from '@/components/erpNav/index.vue'
import GoodsInfo from '../../components/goodsDescription/index.vue'
import PurchaseInfo from '../../components/PurchaseInfo/index.vue'
import { ElMessage } from "element-plus";

export default {
  name: 'PurchaseQuote',
  components: { ErpNav, GoodsInfo, PurchaseInfo },
  setup() {
    const route = useRoute()
		const goodsIdList = sessionStorage.getItem('goodsLIstPurchaseQuote') ? JSON.parse(sessionStorage.getItem('goodsLIstPurchaseQuote')) : null
		let router = useRouter()
    const state = reactive({
			goodsIdList,
			prevGoodsId:null,
			nextGoodsId:null,
      activeName: 'PurchaseInfo',
      purchaseInfo: null,
			goodsDescriptionRef:null,
      isEdit: !route.query.isedit || Number(route.query.isedit) === 1
    })
		changeGoodsFn(route.query.id,0)
		function changeGoodsFn(id,type){
			if(type === -1){
				queryObj(id,goodsIdList)
			}else if(type === 1){
				queryObj(id,goodsIdList)
			}else{
				// curr goods
				if(goodsIdList){
					goodsIdList.forEach((v,i)=>{
						if(v.id == id){
							if(i===0){
								state.prevGoodsId = null
								if(goodsIdList.length>1) state.nextGoodsId = goodsIdList[1].id
								else state.nextGoodsId = null
							}else if(i === goodsIdList.length - 1){
								state.nextGoodsId = null
								state.prevGoodsId = goodsIdList[i - 1].id
							}else {
								state.prevGoodsId = goodsIdList[i - 1].id
								state.nextGoodsId = goodsIdList[i + 1].id
							}
							return true
						}
					})
				}
			}
		}
		function queryObj(id,list){
				const row = list.filter(v=>v.id == id)[0]
				router.replace({
					path:router.currentRoute.value.path,
					query: {
						id,
						combine:route.query.combine
					}
				})
				changeGoodsFn(id,0)
				state.goodsDescriptionRef.initData(id)
				state.purchaseInfo.initData(id)
			}

    if (route.query.isedit) {
      state.isEdit = Number(route.query.isedit) === 1
    }

    let store = useStore()
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth)

    function save(flag = true) {
      state.purchaseInfo.submit(0, false).then(_ => {
        if (flag) ElMessage.success({ message: '保存完成' })
      }).catch(_ => {})
    }
    // 返回
    function goBack() {
      state.purchaseInfo.goBack()
    }

    return {
      ...toRefs(state),
      goBack,
      save,
			changeGoodsFn,
      sideBarWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-quote-tabs-box {
  position: fixed;
  top: 185px;
  z-index: 15;
  left: v-bind(sideBarWidth);
  right: 0;
  display: flex;
  .right-box {
    width: 550px;
    padding: 0 30px 5px 0;
    text-align: right;
    background: #fff;
  }
}
.purchase-quote-tabs {
  flex-grow: 1;
  background: #fff;
  ::v-deep(.el-tabs__nav-wrap) {
    padding: 0 40px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  ::v-deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}
.mt-50 {
  margin-top: 50px;
}
</style>
