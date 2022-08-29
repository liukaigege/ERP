<template>
	<div class="storageClass">
		<div class="headStorage">仓储</div>
		<div class="storageContent">
			<!-- 到货数量预测 -->
			<div class="countOne">
				<div style="padding:28px 20px 15px;fontSize:16px">到货数量预测</div>
				<div style="display:flex;">
					<!-- 预计今日 -->
					<div class="outPurchase" style="margin-left:20px">
						<div class="outPutchaseFont">
							<p style="margin-bottom:20px;font-weight: 550;color:#666">预计今日</p>
							<span style="fontSize:32px;color:#000" class="curserPoint" @click="jump('1')">{{today.packageQuantity}}</span>
							<span style="margin-left:5px;">箱</span>
						</div>
						<div class="contentClass">
							<div style="display: flex;align-items: center;">
								<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">sku种类:</p>
									<p class="font16Bold" @click="jump('1')">{{today.skuTypeQuantity}}</p>
								</div>

							</div>
							<div style="display: flex;align-items: center;margin-left:40px">
								<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">商品数量:</p>
									<p class="font16Bold" @click="jump('1')">{{today.goodsQuantity}}</p>
								</div>
							</div>
						</div>
					</div>
					<!-- 预计明日 -->
					<div class="outPurchase" style="margin-left:0px">
						<div class="outPutchaseFont">
							<p style="margin-bottom:20px;font-weight: 550;color:#666">预计明日</p>
							<span style="fontSize:32px;color:#000" class="curserPoint" @click="jump('4')">{{oneday.packageQuantity}}</span>
							<span style="margin-left:5px;">箱</span>
						</div>
						<div class="contentClass">
							<div style="display: flex;align-items: center;">
								<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">sku种类:</p>
									<p class="font16Bold" @click="jump('4')">{{oneday.skuTypeQuantity}}</p>
								</div>

							</div>
							<div style="display: flex;align-items: center;margin-left:40px">
								<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">商品数量:</p>
									<p class="font16Bold" @click="jump('4')">{{oneday.goodsQuantity}}</p>
								</div>
							</div>
						</div>
					</div>
					<!-- 预计3日内 -->
					<div class="outPurchase" style="margin-left:0">
						<div class="outPutchaseFont">
							<p style="margin-bottom:20px;font-weight: 550;color:#666">预计3日内</p>
							<span style="fontSize:32px;color:#000" class="curserPoint" @click="jump('2')">{{threeDays.packageQuantity}}</span>
							<span style="margin-left:5px;">箱</span>
						</div>
						<div class="contentClass">
							<div style="display: flex;align-items: center;">
								<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">sku种类:</p>
									<p class="font16Bold" @click="jump('2')">{{threeDays.skuTypeQuantity}}</p>
								</div>

							</div>
							<div style="display: flex;align-items: center;margin-left:40px">
								<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">商品数量:</p>
									<p class="font16Bold" @click="jump('2')">{{threeDays.goodsQuantity}}</p>
								</div>
							</div>
						</div>
					</div>
					<!-- 剩余到货 -->
					<div class="outPurchase" style="margin:0 20px 0 0">
						<div class="outPutchaseFont">
							<p style="margin-bottom:20px;font-weight:550;color:#666">剩余到货</p>
							<span style="fontSize:32px;color:#000" class="curserPoint" @click="jump('3')">{{remainArrive.packageQuantity}}</span>
							<span style="margin-left:5px">箱</span>
						</div>
						<div class="contentClass">
							<div style="display: flex;align-items: center;">
								<img src="../../../assets/image/编组(1).png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">sku种类:</p>
									<p class="font16Bold" @click="jump('3')">{{remainArrive.skuTypeQuantity}}</p>
								</div>

							</div>
							<div style="display: flex;align-items: center;margin-left:40px">
								<img src="../../../assets/image/编组20.png" style="width:23px;height:23px" alt="">
								<div style="margin-left:10px">
									<p style="color:#666">商品数量:</p>
									<p class="font16Bold " @click="jump('3')">{{remainArrive.goodsQuantity}}</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
			<!-- 采购单签收数量统计 -->
			<!-- <div class="countTwo">
				<div style="padding:28px 20px 15px;fontSize:16px">采购单签收数量统计</div>
				<div id="signQuantity-Echarts"></div>
			</div> -->
		</div>
	</div>
</template>

<script>
	import { getArrivalCount, getLogisticsSign } from '../api/api.js'
	import * as echarts from 'echarts'
	import { storage } from '@/utils/storage.js'
	import { useRouter } from 'vue-router'
	import { onMounted, reactive, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
	export default {
		setup() {
      const store = useStore()
			const router = useRouter()
			const state = reactive({
				today: {},//预计今日
				oneday: {},//预计明日
				threeDays: {},//3日内
				limitTag: [],//权限
				remainArrive: {}//剩余到货
			})
			//初始到货数量预测
			function queryArrivalCount() {
				getArrivalCount().then(res => {
					state.oneday = res.data.oneDay
					state.today = res.data.today
					state.threeDays = res.data.threeDays
					state.remainArrive = res.data.remainArrive
				})
			}
			//跳转路由
			function jump(val) {
				if (state.limitTag.includes('signedfor')) {
          store.commit('com/delHistory','signedfor')
					router.push({ name: 'signedfor', params: { timeControl: val } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryArrivalCount()
			})
			return {
				...toRefs(state),
        jump
			}
		}
	}
</script>

<style lang="scss" scoped>
.storageClass {
	margin-top: 24px;
  .curserPoint{
    cursor: pointer;
  }
	.font16Bold {
		font-size: 16px;
		font-weight: bold;
		margin-top: 5px;
    cursor: pointer;
	}
	.headStorage {
		padding: 28px 20px 15px;
		background: #fff;
		font-size: 16px;
		border-bottom: 1px solid #e6e6e6;
	}
	.storageContent {
		display: flex;
		// height: 374px;
		// margin-bottom: 20px;
		.contentClass {
			display: flex;
			justify-content: space-between;
			// align-items: center;
		}
		.countOne {
			width: 100%;
			background: #fff;
			padding-bottom: 20px;
			.outPurchase {
				width: 25%;
				padding: 40px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				margin: 0 15px;
				.outPutchaseFont {
					text-align: center;
					padding-bottom: 40px;
					font-size: 18px;
					color: #666;
				}
			}
		}
	}
}
</style>