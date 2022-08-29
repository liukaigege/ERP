<template>
	<div>
		<ErpNav title="商品详情" routeOpt='/goods/goodsManagement/setPrice' :goBack="goBack" />
    <div class="tabBox">
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane label="商品信息" name="0"></el-tab-pane>
        <el-tab-pane label="采购信息" name="1"></el-tab-pane>
        <el-tab-pane label="物流信息" name="2"></el-tab-pane>
        <el-tab-pane label="备注信息" name="3"></el-tab-pane>
        <el-tab-pane label="日志" name="4"></el-tab-pane>
      </el-tabs>
      <div class="btnBox" v-if="$route.name !== 'QuotationCombine'">
				<el-button type="primary" :disabled="!prevGoodsId" @click="changeGoodsFn(prevGoodsId,-1)">上一个</el-button>
				<el-button type="primary" :disabled="!nextGoodsId" @click="changeGoodsFn(nextGoodsId,1)">下一个</el-button>
        <!-- <el-button type="primary"  v-if="tabIndex !== '4' && !isEdit" @click="btnEvent" :disabled="!editable || $route.query.combine==1">{{btnType}}</el-button> -->
        <el-button type="primary"  @click="btnEvent" v-permission="'setPrice/goodsInfoEdit'" :disabled="!editable || $route.query.combine==1 || $route.query.sourceRoute=='purchaseOrder'" v-if="tabIndex == 0 && !isEdit">编辑商品</el-button>
        <el-button type="primary"  @click="btnEvent" v-permission="'setPrice/purchaseInfoEdit'" :disabled="$route.query.combine==1" v-if="tabIndex == 1 && !isEdit">编辑采购</el-button>
        <el-button type="primary"  @click="openFullRelationDialog" v-permission="'setPrice/openFullRelationDialog'" :disabled="$route.query.combine==1" v-if="combineType === 2 && tabIndex == 1 && !isEdit">关联商品系数</el-button>
        <el-button type="primary"  @click="btnEvent" v-permission="'setPrice/logisticsEdit'" :disabled="$route.query.combine==1 || $route.query.sourceRoute=='purchaseOrder'" v-if="tabIndex == 2 && !isEdit">编辑物流</el-button>
        <el-button type="primary"  @click="btnEvent" v-permission="'setPrice/remarkInfoEdit'" :disabled="$route.query.combine==1 || $route.query.sourceRoute=='purchaseOrder'" v-if="tabIndex == 3 && !isEdit">添加备注</el-button>
        <span style="margin-left:15px;" v-if="isEdit && tabIndex !== '3' && tabIndex !== '4'">
          <el-button type="primary"  @click="saveEvent">保存</el-button>
          <el-button  @click="cancelEvent">取消编辑</el-button>
        </span>
      </div>
    </div>
    <div style="margin-top:60px;">
      <!-- <component :is="viewModal" :isEdit='isEdit' :type="1" ref="componentRef" @isChange="isChange"></component> -->
      <GoodsDescription v-show="viewModal == 'GoodsDescription'" :isEdit='isEdit'  :type='1' ref="componentRef_01" @isChange="isChange" />
      <PurchaseInfo v-show="viewModal == 'PurchaseInfo'" :isEdit='isEdit' :type='1' ref="componentRef_02" @isChange="isChange" />
      <Logistics v-show="viewModal == 'Logistics'" :isEdit='isEdit' :type='1' ref="componentRef_03" @isChange="isChange" />
      <RemarkMessage v-show="viewModal == 'RemarkMessage'" :isEdit='isEdit' :type='1' ref="componentRef_04" />
      <LogsList v-show="viewModal == 'LogsList'" :isEdit='isEdit' :type='1' ref="componentRef_05"/>
    </div>
    <AddRemark @cancel="addRemarkFn" v-if="addRemarkShow" :goodsId="goodsId" />
	</div>
</template>

<script>
	import { ref, reactive, toRefs, onMounted, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import ErpNav from '@/components/erpNav/index.vue'
  import GoodsDescription from '@/views/goods/components/goodsDescription/index.vue'//商品信息
  import PurchaseInfo from '@/views/goods/components/PurchaseInfo/index.vue'//采购信息
  import Logistics from '@/views/goods/components/Logistics/index.vue' // 物流信息
  import LogsList from '@/views/goods/components/logsList/index.vue'
  import RemarkMessage from '@/views/goods/components/remarkMessage/index.vue'//备注信息
  import AddRemark from '@/views/goods/components/remarkMessage/components/addRemark.vue'//新增备注
  import Handle from './composables/handle.js'
	export default {
    name: 'setPriceDetail',
    components: {
			ErpNav,
      GoodsDescription,
      LogsList,
      RemarkMessage,
      AddRemark,
      Logistics,
      PurchaseInfo
		},
		setup() {
			let route = useRoute()
			let router = useRouter()
			const goodsIdList = sessionStorage.getItem('goodsLIstStr') ? JSON.parse(sessionStorage.getItem('goodsLIstStr')) : null
      let state = reactive({
				goodsIdList,
				prevGoodsId:null,
				nextGoodsId:null,
        viewModal: 'GoodsDescription',
        tabIndex: '0',
        addRemarkShow: false,
        isEditGoodsInfo: false, // 商品信息的编辑状态
        isEditPurchase: false, // 采购信息的编辑状态
        isEditLogistics: false, // 物流信息的编辑状态
        isEdit: false, // 当前tab项的编辑状态
        changeGoodsInfo: false,
        changePurchase: false, // 数据是否发生变化
        changeLogistics: false,
        goodsId: route.query.id,
        data: null, //商品详情数据
        editable: true,
        operateStatus: Number(route.query.operateStatus),
        combineType: Number(route.query.combineType) // 是否组合品
      })
      let componentRef_01 = ref(null)
      let componentRef_02 = ref(null)
      let componentRef_03 = ref(null)
      let componentRef_04 = ref(null)
			let componentRef_05 = ref(null)
      let handle = Handle(state, componentRef_01, componentRef_02, componentRef_03, componentRef_04, router, route)
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
						operateStatus: row.operateStatus,
						combineType: row.combineType,
						combination: row.combination
					}
				})
				state.goodsId = id
				state.operateStatus = row.operateStatus - 0
				state.combineType = row.combineType - 0
				changeGoodsFn(id,0)
				componentRef_01.value.initData(id)
				componentRef_02.value.initData(id)
				componentRef_03.value.initData(id)
				componentRef_04.value.getRemarkList(id)
				componentRef_05.value.initFn(id)
			}

      let btnType = computed(() => {
        switch (state.tabIndex) {
          case '0':
            return '编辑商品'
          case '1':
            return '编辑采购'
          case '2':
            return '编辑物流'
          case '3':
            return '添加备注'
        }
      })

      onMounted(() => {
        componentRef_01.value.getGoodsDetail()
      })

      return {
        ...toRefs(state),
        componentRef_01,
        componentRef_02,
        componentRef_03,
        componentRef_04,
				componentRef_05,
        btnType,
				changeGoodsFn,
        ...handle
      }
		},
	}
</script>

<style lang="scss" scoped>
  .tabBox{
    position: fixed;
    width: calc(100% - var(--sideBarWidth));
    right: 0;
    top: 187px;
    background-color: #fff;
    padding: 0 25px;
    z-index: 66;
    :deep(.el-tabs__header){
      margin-bottom: 0;
    }
    .btnBox{
      position: absolute;
      right: 25px;
      top: 0;
    }
    :deep(.el-tabs__nav-wrap::after){
      height: 0 !important;
    }
  }
  .m-110{
    margin-top: 110px;
  }
</style>
