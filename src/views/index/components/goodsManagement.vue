<template>
	<div class="headGoodsManagement" >
		<div class="contentFinancial">
			<!-- 商品管理模块 -->
			<div class="goodsManage">
				<div style="" class="headGoods">商品管理</div>
				<div class="contentGoods">
					<p class="font16">缺货商品数量排行榜
						<span> <img src="../../../assets/image/编组.png" alt=""></span>
					</p>
					<div class="imgClass">
						<!-- 占位符 -->
						<div v-if="listImg&&!listImg.length" class="imgListNone">
							<img src="../../../assets/image/RankingList2(1).png" style="width:160px;height:148px" alt="">
							<p style="textAlign:center;color:#666">暂无排行榜数据</p>
						</div>
						<div class="imgContent" v-for="(item,index) in listImg" :key="index">
							<div v-if="item.tag==='one'" style="display:flex">
								<img src="../../../assets/image/编组21.png" style="width:27px;height:24px" alt="">
							</div>
							<div v-if="item.tag==='two'" style="display:flex">
								<img src="../../../assets/image/编组15备份3.png" style="width:27px;height:24px" alt="">
							</div>
							<div v-if="item.tag==='three'" style="display:flex">
								<img src="../../../assets/image/编组15备份4.png" style="width:27px;height:24px" alt="">
							</div>
							<div v-if="!item.tag" style="fontSize:16px;fontWeight:bold;width:27px;height:24px;textAlign:center">{{index+1}}</div>
							<div style="margin-left:27px;display:flex;">
								<el-popover placement="left-start" trigger="hover" width="auto">
									<el-image style="width: 200px; height: 200px" :src="item.skuImage" fit="contain"></el-image>
									<template #reference>
										<el-image style="width: 60px; height: 60px;" :src="item.skuImage" fit="contain"></el-image>
									</template>
								</el-popover>
							</div>
							<div style="margin-left:15px" class="skuFont">
								<p>缺货数量：{{item.outOfStockCount}}
									<span style="margin-left:40px" :title="item.sumSaleCount">累计销量：{{item.sumSaleCount}}</span>
								</p>
								<el-tooltip placement="top">
									<template #content>
										<a v-copy="item.skuCode" style="color:#fff">复制</a>
									</template>
									<p :title="item.skuCode" style="margin-top:5px;color:#666">{{item.skuCode}}</p>
								</el-tooltip>
							</div>
							<div class="line"></div>
							<div style="display:flex;margin-left:45px;justify-content:space-between;">
								<div>
									<p class="color666">3日销量</p>
									<p class="font16Bold margin5">{{item.threeSale}}</p>
								</div>
								<div style="padding-left:40px">
									<p class="color666">7日销量</p>
									<p class="font16Bold margin5">{{item.sevenSale}}</p>
								</div>
								<div style="padding-left:40px">
									<p class="color666">15日销量</p>
									<p class="font16Bold margin5">{{item.fifteenSale}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
      <div style="width: 51%;"></div>
		</div>
	</div>
</template>

<script>
	import { getFinance, getGoodManage } from '../api/api.js'
	import * as echarts from 'echarts'
	import { authPath } from '@/utils/hooks.js'
	import { onMounted, reactive, toRefs } from 'vue'
	import { useRouter } from 'vue-router'
	import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
	import { useStore } from 'vuex'
	export default {
		setup() {
			const store = useStore()
			const router = useRouter()
			const state = reactive({
				waitApprove: {},//数据渲染
				data: [],
				limitTag: [],//权限
				listImg: []//商品管理
			})
		
			//商品管理接口
			function queryManage() {
				if (!authPath('index_goodManagement:btn')) return
				getGoodManage().then(res => {
					state.listImg = res.data.topTenOutOfStockList ? res.data.topTenOutOfStockList : []
					state.listImg.forEach((item, index) => {
						item.index = index + 1
						if (item.index === 1) {
							item.tag = 'one'
						} else if (item.index === 2) {
							item.tag = 'two'
						} else if (item.index === 3) {
							item.tag = 'three'
						}
					})
				})
			}
			
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryManage()
			})
			return {
				...toRefs(state),
			
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headGoodsManagement {
		margin-top: 24px;
		.font16 {
			font-size: 16px;
		}
		.cursPonit {
			cursor: pointer;
		}
		.font500 {
			font-weight: bold;
		}
		.color666 {
			color: #666;
		}
		.margin5 {
			margin-top: 5px;
		}
		.font16Bold {
			font-size: 16px;
			font-weight: bold;
		}
		.colorIN {
			color: #4acf48;
		}
		.colorOut {
			color: #ff4d00;
		}
		.font28 {
			font-size: 28px;
		}
		.contentFinancial {
			display: flex;
			.goodsManage {
				width: 50%;
				background: #fff;
				.headGoods {
					padding: 16px 20px;
					font-size: 16px;
					border-bottom: 1px solid #e6e6e6;
				}
				.contentGoods {
					padding: 28px 20px 20px;
					.imgClass {
						height: 421px;
						overflow: auto;
						padding: 20px;
						margin-top: 15px;
						box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
						border-radius: 10px;
						.imgListNone {
							width: 100%;
							height: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
						}
						.imgContent {
							display: flex;
							align-items: center;
							margin-bottom: 25px;
						}
						.line {
							height: 30px;
							padding-left: 35px;
							border-right: 1px solid #e6e6e6;
						}
						.skuFont {
							width: 256px;
							p {
								overflow: hidden;
								white-space: nowrap; //表示不换
								text-overflow: ellipsis; //加省略号;
							}
						}
					}
				}
			}
		}
	}
</style>
