<template>
	<div class="purchaseHeader" v-if="authPath('index_purchase_overView:btn') || authPath('index_purchase_dateList:btn')">
		<div class="headClass fontClassSize">
			采购
			<span>
				<el-tooltip effect="light" placement="right" raw-content content="<p>概览-缺货采购：缺货商品数量=正常订单数 - 在仓库存 - 在途库存</p><p>今日/昨日/本周采购：商品数量=待到货采购数量+已完成已入库数量</p><p>（本周时间周期为上周六零点至本周五24点）</p>">
					<i class="el-icon-question">
					</i>
				</el-tooltip>
			</span>
		</div>
    <!-- 普货 -->
		<div style="display:flex;">
			<!-- 第一部分 -->
			<div class="purchaseContent" v-if="authPath('index_purchase_overView:btn')">
				<p class="overViews fontClassSize">普通商品
				</p>
				<div class="outPurchase">
					<p class="outPutchaseFont" style="">当前缺货</p>
					<div class="contentClass">
						<div style="display: flex;align-items:center;">
							<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
							<div style="margin-left:10px">
								<p class="color666">sku种类:</p>
								<p style="margin-top:5px" class="font20Bold" @click="jumpOut('0')">{{purchaseOverview.stockoutSku}}</p>
							</div>
						</div>
						<div style="display: flex;align-items:center;margin-left:50px">
							<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
							<div style="margin-left:10px">
								<p class="color666">商品数量:</p>
								<p style="margin-top:5px" class="font20Bold" @click="jumpOut('0')">{{purchaseOverview.stockoutPro}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 第二部分 -->
			<div class="purchaseTwo" v-if="authPath('index_purchase_dateList:btn')">
				<!-- 今日采购 -->
				<div style="flex:1;">
					<div class="dayPurchase fontClassSize" style="padding-left:0">今日采购</div>
					<div class="dayPurchaseClass">
						<div class="dayPurChaseContent">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,1,0)">{{todayPurchase.todayStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,1,0)">{{todayPurchase.todayStockoutPro}}</p>
							</div>
						</div>
						<div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,1,0)">{{todayPurchase.todayStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,1,0)">{{todayPurchase.todayStockUpPro}}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- 昨日采购 -->
				<div style="flex:1;margin-left:30px">
					<div class="dayPurchase fontClassSize" style="padding-left:0">昨日采购</div>
					<div class="dayPurchaseClass" style="margin-left:0px">
						<div class="dayPurChaseContent">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,2,0)">{{yesPurchase.yesStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,2,0)">{{yesPurchase.yesStockoutPro}}</p>
							</div>
						</div>
						<div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,2,0)">{{yesPurchase.yesStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,2,0)">{{yesPurchase.yesStockUpPro}}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- 本周采购 -->
				<div style="flex:1;margin-left:30px">
					<div class="dayPurchase fontClassSize" style="padding-left:0">本周采购</div>
					<div class="dayPurchaseClass" style="margin-left:0px">
						<div class="dayPurChaseContent">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,7,0)">{{threePurchase.threeDaysStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,7,0)">{{threePurchase.threeDaysStockoutPro}}</p>
							</div>
						</div>
						<div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,7,0)">{{threePurchase.threeDaysStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,7,0)">{{threePurchase.threeDaysStockUpPro}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    <!-- 定制品 -->
    <div class="purcahaseCustomized" >
		<div style="display:flex;">
			<!-- 第一部分 -->
			<div class="purchaseContent" v-if="authPath('index_purchase_overView:btn')">
				<p class="overViews fontClassSize">定制品
				</p>
				<div class="outPurchase">
					<p class="outPutchaseFont" style="">当前缺货</p>
					<div class="contentClass">
						<div style="display: flex;align-items:center;">
							<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
							<div style="margin-left:10px">
								<p class="color666">sku种类:</p>
								<p style="margin-top:5px" class="font20Bold" @click="jumpOut('1')">{{customDataPurchaseOverview.stockoutSku}}</p>
							</div>
						</div>
						<div style="display: flex;align-items:center;margin-left:50px">
							<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
							<div style="margin-left:10px">
								<p class="color666">商品数量:</p>
								<p style="margin-top:5px" class="font20Bold" @click="jumpOut('1')">{{customDataPurchaseOverview.stockoutPro}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 第二部分 -->
			<div class="purchaseTwo" v-if="authPath('index_purchase_dateList:btn')">
				<!-- 今日采购 -->
				<div style="flex:1;">
					<div class="dayPurchase fontClassSize" style="padding-left:0">今日采购</div>
					<div class="dayPurchaseClass">
						<div class="dayPurChaseContent customzidClass">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,1,1)">{{customDataTodayPurchase.todayStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,1,1)">{{customDataTodayPurchase.todayStockoutPro}}</p>
							</div>
						</div>
						<!-- <div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,1,1)">{{customDataTodayPurchase.todayStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,1,1)">{{customDataTodayPurchase.todayStockUpPro}}</p>
							</div>
						</div> -->
					</div>
				</div>
				<!-- 昨日采购 -->
				<div style="flex:1;margin-left:30px">
					<div class="dayPurchase fontClassSize" style="padding-left:0">昨日采购</div>
					<div class="dayPurchaseClass" style="margin-left:0px">
						<div class="dayPurChaseContent customzidClass">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,2,1)">{{customDataYesPurchase.yesStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,2,1)">{{customDataYesPurchase.yesStockoutPro}}</p>
							</div>
						</div>
						<!-- <div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,2,1)">{{customDataYesPurchase.yesStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,2,1)">{{customDataYesPurchase.yesStockUpPro}}</p>
							</div>
						</div> -->
					</div>
				</div>
				<!-- 本周采购 -->
				<div style="flex:1;margin-left:30px">
					<div class="dayPurchase fontClassSize" style="padding-left:0">本周采购</div>
					<div class="dayPurchaseClass" style="margin-left:0px">
						<div class="dayPurChaseContent customzidClass">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组5备份5.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">缺货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,7,1)">{{customDataThreePurchase.threeDaysStockoutSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(1,7,1)">{{customDataThreePurchase.threeDaysStockoutPro}}</p>
							</div>
						</div>
						<!-- <div class="dayPurChaseContent" style="padding-top:18px">
							<div style="display:flex;align-items:center">
								<img src="../../../assets/image/编组6备份.png" style="width:22px;height:24px" alt="">
								<p class="dayFonts">备货采购</p>
							</div>
							<div class="lineClass"></div>
							<div class="dayoneClass">
								<p class="color666">sku种类</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,7,1)">{{customDataThreePurchase.threeDaysStockUpSku}}</p>
							</div>
							<div style="margin-left:15px">
								<p class="color666">商品数量</p>
								<p class="font16Bold margintop5" @click="jumpDate(2,7,1)">{{customDataThreePurchase.threeDaysStockUpPro}}</p>
							</div>
						</div> -->
					</div>
				</div>
			</div>
		</div>

	</div>
	</div>
</template>

<script>
	import { onMounted, reactive, toRefs } from 'vue-demi'
	import { getPurchase } from '../api/api.js'
	import { authPath } from '@/utils/hooks.js'
	import { ElMessage } from 'element-plus'
	import { storage } from '@/utils/storage.js'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	export default {
		setup() {
			const store = useStore()
			const router = useRouter()
			const state = reactive({
				purchaseOverview: {},//概览
				todayPurchase: {},//今日采购
				yesPurchase: {},//昨日采购
				threePurchase: {},//三日采购
        //定制品
        customDataPurchaseOverview:{},//当前缺货
        customDataTodayPurchase: {},//今日采购
				customDataYesPurchase: {},//昨日采购
				customDataThreePurchase: {},//三日采购
				limitTag: [],//权限
			})
			//接口
			function queryPurchase() {
				if (!authPath('index_purchase_overView:btn') && !authPath('index_purchase_dateList:btn')) return
				getPurchase().then(res => {
					state.purchaseOverview = res.data.normalData.purchaseOverview
					state.todayPurchase = res.data.normalData.todayPurchase
					state.yesPurchase = res.data.normalData.yesPurchase
					state.threePurchase = res.data.normalData.threePurchase
          // 定制品
          state.customDataPurchaseOverview = res.data.customData.purchaseOverview
					state.customDataTodayPurchase = res.data.customData.todayPurchase
					state.customDataYesPurchase = res.data.customData.yesPurchase
					state.customDataThreePurchase = res.data.customData.threePurchase
				})
			}
			//跳转到缺货采购
			function jumpOut(type) {
				if (state.limitTag.includes('outOfStock')) {
					store.commit('com/delHistory', 'outOfStock')
					router.push({ name: 'outOfStock', params: { isRefresh: 1, isCustom:type} })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			//跳转日期
			function jumpDate(type, date,customization) {
				if (state.limitTag.includes('PurchaseOrders')) {
					store.commit('com/delHistory', 'PurchaseOrders')
					router.push({ name: 'PurchaseOrders', params: { timeType: 3, timeStart_timeEnd: date, type: type, status: null, isIndex: 1, isSupplier: 1 ,customization:customization} })
				} else {
					ElMessage.error('无跳转权限')
				}

			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryPurchase()
			})
			return {
				...toRefs(state),
				jumpOut,
				jumpDate
			}
		}
	}
</script>

<style lang="scss" scoped>
.purchaseHeader {
	margin-top: 24px;
  .purcahaseCustomized{
    margin-top: 16px;
    .customzidClass{
      padding: 74px 28px !important;
    }
  }
	.margintop5 {
		margin-top: 5px;
	}
	:deep(.el-icon-question:before) {
		color: #fe8f44;
	}
	.fontClassSize {
		font-size: 16px;
		color: #202020;
		// cursor: pointer;
	}
	.font16Bold {
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
	}
	.color666 {
		color: #666;
	}
	.font20Bold {
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
	}
	.headClass {
		padding: 16px 20px;
		background: #fff;
		border-bottom: 1px solid #e6e6e6;
	}
	.purchaseContent {
		width: 29%;
		height: 276px;
		margin-right: 15px;
		background: #fff;
		.overViews {
			padding: 28px 20px 15px;
			background: #fff;
		}
		.contentClass {
			display: flex;
			justify-content: space-between;
			// align-items: flex-end;
		}
		.outPurchase {
			// width: 90%;
			padding: 40px 60px;
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			margin: 0 20px;
			.outPutchaseFont {
				text-align: center;
				padding-bottom: 40px;
				font-size: 18px;
				color: #666;
			}
		}
	}
	.purchaseTwo {
		width: 70%;
		display: flex;
		height: 276px;
		background: #fff;
		// margin-left: 15px;
		padding: 0 20px;
		// flex-grow: 1; /*填满剩余空间*/
		.dayPurchase {
			padding: 28px 20px 15px;
		}
		.dayPurchaseClass {
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			// margin: 0 20px;
			.dayPurChaseContent {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 28px;
			}
			.dayFonts {
				font-weight: bold;
				margin-left: 10px;
			}
			.lineClass {
				height: 30px;
				border-right: 1px solid #e6e6e6;
				padding-left: 2px;

				// padding-left: 30px;
			}
		}
	}
}
</style>