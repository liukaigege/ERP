<template>
	<div class="headShopLogists">
		<div class="contentShopLogists">
			<!-- 店铺 -->
			<div class="shopClass" v-if="authPath('index_shop:btn')">
				<div class="font16" style="padding:16px 20px;border-bottom:1px solid #e6e6e6;">店铺</div>
				<div style="display:flex;align-items:center; padding:20px 0 0 20px">
					<p class="font16" >店铺总数：</p>
					<p class="font28" style="color:#1880E7" @click="jumpShop(null)">{{Statistics.shopTotalCount}}</p>
					<p class="font16" style="margin-left:40px">正在使用：</p>
					<p class="font28" style="color:#07C160" @click="jumpShop(1)">{{Statistics.shopUseCount}}</p>
					<p class="font16" style="margin-left:40px;color:#666">已关闭：</p>
					<p class="font28" style="color:#666666" @click="jumpShop(0)">{{Statistics.shopCloseCount}}</p>
				</div>
				<!-- 图表 -->
				<div class="echartsLook">
					<div id="shop-Echarts"></div>
					<div class="netGrowth">
						<div style="textAlign:center;">
							<p class="font18">昨日净增长</p>
							<p style="padding:15px 0 40px 0" class="font32"> {{Statistics.todayShopAddCount}}</p>
						</div>
						<div class="netGowthFont" style="">
							<div>
								<p class="font20" style="color:#07C160" >+{{Statistics.todayShopOpenCount}}</p>
								<p style="margin-top:8px"><img src="../../../assets/image/路径2.png" alt=""></p>
							</div>
							<div style="margin-left:90px">
								<p class="font20" style="color:#FF4D00">-{{Statistics.todayShopCloseCount}}</p>
								<p style="margin-top:8px">
									<img src="../../../assets/image/路径备份13.png" alt="">
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 物流   -->
			<div class="logistics" v-if="authPath('index_logistics:btn')">
				<div class="font16" style="padding:16px 20px;border-bottom:1px solid #e6e6e6;">物流对账</div>
				<!-- 待审核 -->
				<div style="display:flex">
					<div>
						<p class="font16" style="padding:28px 0 15px 20px">待审核</p>
						<!-- 待审核图表 -->
						<div class="ToExamine">
							<div style="display:flex;padding:15px 0 0 20px;align-items:center">
								<p >总数：</p>
								<p class="font28" style="color:#1880E7" @click="jumpTotal">{{Approve.waitApproveCount}}</p>
							</div>
							<div id="ToExamine-Echarts"></div>
						</div>
					</div>
					<!-- 已审核 -->
					<div style=" flex-grow:1;padding-right:20px">
						<p class="font16" style="padding:28px 0 15px 0">已审核</p>
						<div class="dateClass">
							<div>
								<img src="../../../assets/image/编组备份7.png" style="width:33px;height:33px" alt="">
								<p style="margin-top:20px">今日审核</p>
								<p style="margin-top:10px;font-weight:bold" class="font28" @click="jumpLogist(1)">{{Approve.todayApproveCount}}</p>
							</div>
							<div>
								<img src="../../../assets/image/编组备份9.png" style="width:33px;height:33px" alt="">
								<p style="margin-top:20px">昨日审核</p>
								<p style="margin-top:10px;font-weight:bold" class="font28" @click="jumpLogist(2)">{{Approve.yesterdayApproveCount}}</p>
							</div>
							<div>
								<img src="../../../assets/image/编组备份10.png" style="width:33px;height:33px" alt="">
								<p style="margin-top:20px">近3日审核</p>
								<p style="margin-top:10px;font-weight:bold" class="font28" @click="jumpLogist(3)">{{Approve.threedayApproveCount}}</p>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
	import { getshop, getLogistics } from '../api/api.js'
	import { authPath } from '@/utils/hooks.js'
	import * as echarts from 'echarts'
	import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
	import { onMounted, reactive, toRefs } from 'vue'
	import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
	export default {
		setup() {
      const store = useStore()
			const router = useRouter()
			const state = reactive({
				LogisicsDataPie: [],//物流图表
				shopDataPie: [],//店铺的饼图
				Statistics: {},//店铺字段赋值
				Approve: {},//物流对账字段赋值
				limitTag: [],//权限标识
			})
			// 初始店铺接口
			function queryShop() {
				if (!authPath('index_shop:btn')) return
				getshop().then(res => {
					state.Statistics = res.data
					state.shopDataPie = res.data.rateArray
					initShopEchars()
				})
			}
			//初始物流对账接口
			function queryLogistic() {
				if (!authPath('index_logistics:btn')) return
				getLogistics().then(res => {
					state.Approve = res.data
					state.LogisicsDataPie = res.data.waitApproveImportInfo
					initToExamine()
				})
			}
			//店铺图表
			function initShopEchars() {
				echarts.init(document.getElementById('shop-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('shop-Echarts'))
				//跳转带参数
				myChart.on('click', function (params) {
					let type;
					if (params.name == '授权成功') {
						type = 1
					} else if (params.name == '未授权') {
						type = 0
					} else {
						type = 2
					}
					if (state.limitTag.includes('storeManagement')) {
            store.commit('com/delHistory','storeManagement')
						router.push({ name: 'storeManagement', params: { data:JSON.stringify({authorStatus: type })}})
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						trigger: 'item'
					},
					legend: {
						bottom: 20,
						left: 'center',
						icon: 'circle',
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 15,
					},
					series: [
						{
							// name: 'Access From',
							type: 'pie',
							radius: '60%',
							center: ["50%", "45%"],
							label: {
								formatter: '{b}:\n{d}%',
								// position:'inner'
							},
							color: ['#FF4D00', '#FCE300', '#58DB56'],
							data: state.shopDataPie,
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				})
			}
			//待审核图表
			function initToExamine() {
				echarts.init(document.getElementById('ToExamine-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('ToExamine-Echarts'))
				//跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('Reconciliation')) {
            store.commit('com/delHistory','Reconciliation')
						router.push({ name: 'Reconciliation', params: {data:JSON.stringify({status: params.name == '未导入' ? 0 : 1, tabsActive: 'beReviewed' })}})
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						// show: false,
						trigger: 'item'
					},
					legend: {
						selectedMode: true,//取消标题点击后事件-这里显示和隐藏指定项
						bottom: 10,
						left: 'center',
						icon: 'circle',
						orient: 'vertical',
						itemWidth: 10,
						itemHeight: 10,
						formatter: function (name) {
							//用来格式化图例文本，支持字符串模板和回调函数两种形式。模板变量为图例名称 {name}
							let value;
							state.LogisicsDataPie.forEach(item => {
								if (item.name == name) {
									value = item.value
								}

							})
							return `${name}：${value}`
						},
					},
					color: ['#B126FF', '#FEA060'],
					series: [
						{
							type: 'pie',
							radius: ['30%', '60%'],
							center: ["50%", "40%"],
							// hoverAnimation: false,
							avoidLabelOverlap: false,
							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							data: state.LogisicsDataPie
						}
					]
				})
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryShop()
				queryLogistic()
			})
			//跳转店铺
			function jumpShop(val) {
				if (state.limitTag.includes('storeManagement')) {
          store.commit('com/delHistory','storeManagement')
					router.push({ name: 'storeManagement', params: {data:JSON.stringify({shopStatus:val})}})
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			//跳转物流
			function jumpLogist(val) {
				if (state.limitTag.includes('Reconciliation')) {
          store.commit('com/delHistory','Reconciliation')
					router.push({ name: 'Reconciliation', params: {data:JSON.stringify({tabsActive: 'reviewed', timeType: 3, time: val })}})
				} else {
					ElMessage.error('无跳转权限')
				}
			}
      //物流图表总数
      function jumpTotal(){
        	if (state.limitTag.includes('Reconciliation')) {
          store.commit('com/delHistory','Reconciliation')
					router.push({ name: 'Reconciliation',params:{data:JSON.stringify({tabsActive: 'beReviewed'})}})
				} else {
					ElMessage.error('无跳转权限')
				}
      }
			return {
				...toRefs(state),
				jumpShop,
				jumpLogist,
        jumpTotal
			}
		}
	}
</script>

<style lang="scss" scoped>
.headShopLogists {
	margin-top: 24px;
	.font16 {
		font-size: 16px;
		cursor: pointer;
	}
	.font28 {
		font-size: 28px;
		cursor: pointer;
	}
	.font18 {
		font-size: 18px;
		color: #666;
		cursor: pointer;
	}
	.font32 {
		font-size: 32px;
		font-weight: bold;
	}
	.font20 {
		font-size: 20px;
		font-weight: bold;
    // cursor: pointer;
	}
	.contentShopLogists {
		display: flex;
		.shopClass {
			background: #fff;
			margin-right: 15px;
			width: 50%;
			.echartsLook {
				display: flex;
				position: relative;
				#shop-Echarts {
					width: 380px;
					height: 320px;
					margin-left: 20px;
				}
				.netGrowth {
					background: rgba(24, 128, 231, 0.05);
					padding: 30px 30px;
					height: 239px;
					position: absolute;
					right: 70px;
					top: 60px;
					box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
					border-radius: 10px;
				}
				.netGowthFont {
					text-align: center;
					display: flex;
				}
			}
		}
		.logistics {
			background: #fff;
			width: 50%;
			.ToExamine {
				margin: 0px 15px 20px 20px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				#ToExamine-Echarts {
					width: 254px;
					height: 257px;
				}
			}
			.dateClass {
				display: flex;
				justify-content: space-between;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				padding: 92px 60px;
				padding-bottom: 93px;
			}
		}
	}
}
</style>
