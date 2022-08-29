<template>
	<div class="logistics-quote-box">
		<erp-nav title="物流报价" :routeOpt="{name: 'Quotation',params:{goodsStatus: 4}}" :goBack="goBack"></erp-nav>
		<div class="logistics-quote-tabs-box">
			<el-tabs v-model="activeName" class="logistics-quote-tabs">
				<el-tab-pane label="商品信息" name="goodsDescription"></el-tab-pane>
				<el-tab-pane label="采购报价" name="Purchase"></el-tab-pane>
				<el-tab-pane label="物流报价" name="Logistics"></el-tab-pane>
			</el-tabs>
			<div class="right-box">
				<el-button type="primary" :disabled="!prevGoodsId" @click="changeGoodsFn(prevGoodsId,-1)">上一个</el-button>
				<el-button type="primary" :disabled="!nextGoodsId" @click="changeGoodsFn(nextGoodsId,1)">下一个</el-button>
				<el-button type="primary"  @click="save">保存</el-button>
			</div>
		</div>
		<div class="empty-box"></div>
		<goodsDescription ref="goodsDescriptionRef" v-if="activeName== 'goodsDescription'" />
		<Purchase ref="purchaseInfo" v-if="activeName== 'Purchase'" />
		<Logistics v-show="activeName== 'Logistics'" @isChange="isChange= $event" :isEdit="isEdit" isQuoted ref='comRef' />
	</div>
</template>
<script>
	import erpNav from '@/components/erpNav/index.vue'
	import Logistics from '../../components/Logistics/index.vue'
	import Purchase from '../../components/PurchaseInfo/index.vue'
	import goodsDescription from '../../components/goodsDescription/index.vue'
	import { reactive, toRefs, computed, ref } from 'vue'
	import { useRouter,useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import { ElMessageBox } from 'element-plus'
  import { validateGoodsStatus } from '@/api/goods/quotation.js'
	export default {
		components: { erpNav, Logistics, Purchase, goodsDescription },
		setup() {
			const goodsIdsList = sessionStorage.getItem('goodsLIstPurchaseQuote') ? JSON.parse(sessionStorage.getItem('goodsLIstPurchaseQuote')) : null
			console.log(goodsIdsList)
			let store = useStore()
			let router = useRouter()
      let route = useRoute()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
      let goodsId = route.query.id

			function go() {
				router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
			}
			function goBack() {
				validateGoodsStatus({ goodsIdList: [goodsId], type: 2 }).then(res => { // 校验是否已经申请报价完成
					if (res.data.result) {
						if (state.isChange) {
							ElMessageBox.confirm("确认终止当前报价流程？", {
								distinguishCancelAndClose: true,
								confirmButtonText: '保存并退出',
								cancelButtonText: '直接退出',
								type: 'warning',
							}).then(() => {
								comRef.value.save(0).then(() => {
									go()
								})
							}).catch((e) => {
								if (e == 'cancel') go()
							})
						} else {
							go()
						}
					} else {
						ElMessageBox.confirm('该商品已被其他用户已完成物流报价流程！', '提示', {
							confirmButtonText: '确认并退出',
							closeOnClickModal: false,
							closeOnPressEscape: false,
							showCancelButton: false,
							showClose: false
						}).then(_ => {
							router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
						})
					}
				})

			}
			let state = reactive({
				prevGoodsId:null,
				nextGoodsId:null,
				activeName: 'Logistics',
				isChange: false,
        isEdit: true,
				purchaseInfo: null,
				goodsDescriptionRef:null,
				goodsIdsList,
				comRef:null
			})
		function save() {
				return state.comRef.save(0)
			}
			changeGoodsFn(route.query.id,0)
		function changeGoodsFn(id,type){
			if(type === -1){
				queryObj(id,goodsIdsList)
			}else if(type === 1){
				queryObj(id,goodsIdsList)
			}else{
				// curr goods
				if(goodsIdsList){
					goodsIdsList.forEach((v,i)=>{
						if(v.id == id){
							if(i===0){
								state.prevGoodsId = null
								if(goodsIdsList.length>1) state.nextGoodsId = goodsIdsList[1].id
								else state.nextGoodsId = null
							}else if(i === goodsIdsList.length - 1){
								state.nextGoodsId = null
								state.prevGoodsId = goodsIdsList[i - 1].id
							}else {
								state.prevGoodsId = goodsIdsList[i - 1].id
								state.nextGoodsId = goodsIdsList[i + 1].id
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
				state.goodsDescriptionRef?.initData(id)
				state.purchaseInfo?.initData(id)
				state.comRef?.initData(id)
			}
      if(route.query.isedit ==0) state.isEdit = false
			return {
				...toRefs(state),
				sideBarWidth,
				changeGoodsFn,
				queryObj,
				save,
				goBack
			}
		}
	}
</script>
<style lang="scss" scoped>
	.logistics-quote-tabs-box {
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
	.empty-box {
		height: 50px;
		width: 100%;
	}
	.logistics-quote-tabs {
		flex-grow: 1;
		background: #fff;
		::v-deep(.el-tabs__nav-wrap) {
			padding: 0 40px;
		}
		::v-deep(.el-tabs__nav-wrap::after) {
			background-color: transparent;
		}
		::v-deep(.el-tabs__item) {
			font-size: 16px;
		}
		::v-deep(.el-tabs__header) {
			margin-bottom: 0;
		}
	}
</style>
