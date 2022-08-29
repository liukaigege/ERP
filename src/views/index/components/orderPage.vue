<template>
	<div class="headOrder">
		<div class="orderHead fontSize16" >
			订单
		</div>
		<div class="overView">
			<!-- 概览 -->
			<div class="headContent">
				<p class="fontSize16" >概览
          	<span>
						<el-tooltip effect="light" placement="right" raw-content content="<p>1.订单统计范围：只统计已付款订单；手工订单订单数量不做统计，商品数量需计算在内</p><p>2.本周时间周期为：上周六零点至本周五24点</p>">
							<i class="el-icon-question">
							</i>
						</el-tooltip>
					</span>
        </p>
				<div class="orderOverview">
					<div class="dayPurChaseContent">
						<div style="display:flex;align-items:center">
							<img src="../../../assets/image/编组4.png" style="width:22px;height:24px" alt="">
							<p class="dayFonts">今日新增</p>
						</div>
						<div class="lineClass"></div>
						<div class="dayoneClass">
							<p class="color666">订单数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(1)">{{orderOverview.todayAdd}}</p>
						</div>
						<div style="margin-left:15px">
							<p class="color666">商品数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(1)">{{orderOverview.todayAddGood}}</p>
						</div>
					</div>
					<div class="dayPurChaseContent" style="padding-top:22px">
						<div style="display:flex;align-items:center">
							<img src="../../../assets/image/编组4备份.png" style="width:22px;height:24px" alt="">
							<p class="dayFonts">昨日新增</p>
						</div>
						<div class="lineClass"></div>
						<div class="dayoneClass">
							<p class="color666">订单数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(2)">{{orderOverview.yesterdayAdd}}</p>
						</div>
						<div style="margin-left:15px">
							<p class="color666">商品数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(2)">{{orderOverview.yesterdayAddGood}}</p>
						</div>
					</div>
					<div class="dayPurChaseContent" style="padding-top:22px">
						<div style="display:flex;align-items:center">
							<img src="../../../assets/image/编组4备份2.png" style="width:22px;height:24px" alt="">
							<p class="dayFonts">本周新增</p>
						</div>
						<div class="lineClass"></div>
						<div class="dayoneClass">
							<p class="color666">订单数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(3)">{{orderOverview.threeDaysAdd}}</p>
						</div>
						<div style="margin-left:15px">
							<p class="color666">商品数</p>
							<p class="font16Bold margintop5" @click="jumpOrder(3)">{{orderOverview.threeDaysAddGood}}</p>
						</div>
					</div>
				</div>
			</div>
			<!-- 订单处理时效 -->
			<div class="headTreatmentAging">
				<p class="fontSize16">订单处理时效
					<span>
						<el-tooltip effect="light" placement="top" raw-content content="<p>0-6日内：0≤当前日期-付款日期≤6天订单</p><p>6-11日内：6＜当前日期-付款日期≤11天订单</p><p>11-20日内：11＜当前日期-付款日期≤20天订单</p><p>20日以上：当前日期-付款日期＞20天订单</p>">
							<i class="el-icon-question">
							</i>
						</el-tooltip>
					</span>
				</p>
				<p class="explainClass">
					<span>说明:</span>
					<span style="margin-left:10px">统计在X日内未发货订单数量</span>
				</p>
				<div class="TreatmentAgingContent">
					<p class="cursPoint" @click="jumpOrderTo(4,0)">0-6日内:
						<span>{{orderTimeLimit.inFiveDays}}</span>
					</p>
					<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#FCE300" :style="{width:(orderTimeLimit.inFiveDays/max)*100 +'%'}" :show-text="false" />
					<p class="margin14 cursPoint" @click="jumpOrderTo(5,0)">6-11日内:
						<span class="">{{orderTimeLimit.fiveDays}}</span>
					</p>
					<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#58DB56" :style="{width:(orderTimeLimit.fiveDays/max)*100 +'%'}" :show-text="false" />
					<p class="margin14 cursPoint" @click="jumpOrderTo(6,0)">11-20日内:
						<span class="cursPoint">{{orderTimeLimit.tenDays}}</span>
					</p>
					<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#1880E7" :style="{width:(orderTimeLimit.tenDays/max)*100 +'%'}" :show-text="false" />
					<p class="margin14 cursPoint" @click="jumpOrderTo(7,0)">20日以上:
						<span class="">{{orderTimeLimit.twentyDays}}</span>
					</p>
					<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#FE8F44" :style="{width:(orderTimeLimit.twentyDays/max)*100 +'%'}" :show-text="false" />
				</div>
			</div>
			<!-- 拦截饼图 -->
			<div class="interceptClass">
				<div style="margin-bottom:26px" class="fontSize16">包裹处理
           <span>
						<el-tooltip effect="light" placement="right" raw-content content="<p>只统计最近三个月的订单包裹数量（包含本月）：若多个订单合并包裹，且存在某个订单的</p><p>付款时间不在最近三个月内，则该包裹不纳入统计范围内</p>">
							<i class="el-icon-question">
							</i>
						</el-tooltip>
					</span>
        </div>
				<div class="interContent">
					<div id="delivery-Eharts"></div>

					<div style="flex:1;padding:0 20px 0;">
						<div style="padding:20px 0px 15px" class="fontSize16">拦截信息</div>
						<div class="dayPurchaseClass">
							<div class="dayPurChaseContent">
								<div class="dayFlex">
									<img src="../../../assets/image/编组5备份.png" style="width:23px;height:24px" alt="">
									<div class="dayFonts">今日新增拦截
										<p class="fontSize28" @click="jumpIntercept(true,null)">{{interceptInfo.todayIntercept}}</p>
									</div>
								</div>
								<div class="lineClass"></div>
								<div class="dayoneClass">
									<p style="color:#666;margin-bottom:5px">未扫描</p>
									<p class="font16Bold" @click="jumpIntercept(true,0)">{{interceptInfo.todayNotScan}}</p>
								</div>
								<div style="margin-left:15px;">
									<p style="color:#666;margin-bottom:5px">拦截成功</p>
									<p class="font16Bold" @click="jumpIntercept(true,1)">{{interceptInfo.todayInterceptSuc}}</p>
								</div>
							</div>
							<div class="dayPurChaseContent">
								<div class="dayFlex">
									<img src="../../../assets/image/编组5备份4.png" style="width:23px;height:24px" alt="">
									<div class="dayFonts">剩余未扫描
										<p class="fontSize28" @click="jumpIntercept(false,0)">{{interceptInfo.residueNotScan}}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>

			</div>
		</div>

	</div>
</template>

<script>
	import * as echarts from 'echarts'
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import { getOrder } from '../api/api.js'
	import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	export default {
		setup() {
			const store = useStore()
			const router = useRouter()
			const state = reactive({
				max: null,
				orderOverview: {},//概览
				orderTimeLimit: {},//订单处理时效
				dataEcharts: [],//饼图数据
				limitTag: [],//权限标识
				interceptInfo: {}//拦截
			})
			//初始接口
			function query() {
				getOrder().then(res => {
					// state.data=res.data
					state.orderOverview = res.data.orderOverview
					state.orderTimeLimit = res.data.orderTimeLimit
					state.dataEcharts = res.data.pieChart
					state.interceptInfo = res.data.interceptInfo
					//求进度条的最大值基数
					let obj = res.data.orderTimeLimit
					var arr = Object.values(obj)
					state.max = Math.max(...arr)
					initEcharts()

				})
			}
			function initEcharts() {
				echarts.init(document.getElementById('delivery-Eharts')).dispose()
				let myChart = echarts.init(document.getElementById('delivery-Eharts'))
				//跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('OrderManagement')) {
						let status,
						tabType='allOrder';
						console.log('params.name',params.name)
						if (params.name === '已搁置') {
							status = 1
							tabType = 'shelve'
						} else if (params.name == '未发货-缺货中') {
							status = 2
							tabType = 'outStock'
						// } else if (params.name == '未发货-其他') {
						} else if (params.name == '已发货') {
							status = 4
							tabType = 'byTransportation'
						} else {
							status = 3
						}
						store.dispatch('orderManage/setTabTypeByActions', tabType)
						store.dispatch('orderManage/setOrderStatusByActions', '')
            store.commit('com/delHistory','OrderManagement')
						router.push({ name: 'OrderManagement', params: { status: 999, shipmentStatus: status ,timeType:'payTime',tabType} })
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						trigger: 'item'
					},
					legend: {
						bottom: 5,
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
							radius: '50%',
							center: ["50%", "45%"],
							label: {
								formatter: '{b}:\n{d}%'
							},
							data: state.dataEcharts,
							labelLine: {
								show: true,
								length: 5, // 延展线条的长度
							},
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)',
								}
							}
						}
					]
				})
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				query()
			})

      // function clearHistory(name) {
      //   store.commit('com/delHistory',name)
      // }
			//拦截发货跳转
			function jumpIntercept(type, val) {
				if (state.limitTag.includes('InterceptShipping')) {
          // clearHistory('InterceptShipping')
           store.commit('com/delHistory','InterceptShipping')
					router.push({ name: 'InterceptShipping', params: { data: JSON.stringify({ date: type, status: val }) } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			//概览
			function jumpOrder(date) {
				if (state.limitTag.includes('OrderManagement')) {
					store.dispatch('orderManage/setTabTypeByActions', 'allOrder')
					store.dispatch('orderManage/setOrderStatusByActions', '')
					router.push({ name: 'OrderManagement', params: { dateType: date, status: 999,timeType:'payTime',isShelve:1 ,tabType:'allOrder' } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
      //处理时效
			function jumpOrderTo(date, status) {
				if (state.limitTag.includes('OrderManagement')) {
					store.dispatch('orderManage/setTabTypeByActions', 'allOrder')
					store.dispatch('orderManage/setOrderStatusByActions', '')
          store.commit('com/delHistory','OrderManagement')
					router.push({ name: 'OrderManagement', params: { dateType: date, status: 999, shipmentStatus: status,timeType:'payTime',tabType:'allOrder'} })
				} else {
					ElMessage.error('无跳转权限')
				}
			}

			return {
				...toRefs(state),
				jumpIntercept,
				jumpOrder,
				jumpOrderTo
			}
		}

	}
</script>

<style lang="scss" scoped>
.headOrder {
	.cursPoint {
		cursor: pointer;
	}
  :deep(.el-icon-question:before) {
				color: #fe8f44;
			}
	.font16Bold {
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
	}
	.color666 {
		color: #666;
	}
	.fontSize16 {
		font-size: 16px;
		// cursor: pointer;

	}
	.fontSize28 {
		font-size: 28px;
		font-weight: bold;
		cursor: pointer;
	}
	.margin8 {
		margin-top: 8px;
	}
	.margin14 {
		margin-top: 25px;
	}
	.orderHead {
		padding: 16px 20px;
		background: #fff;
		border-bottom: 1px solid #e9e9e9;
	}
	.overView {
		// padding-top:18px;
		display: flex;
		// justify-content: space-between;
		height: 365px;
		.dayPurChaseContent {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20px;
			.dayFlex {
				display: flex;
				align-items: center;
			}
		}
		.dayFonts {
			font-weight: bold;
			margin-left: 15px;
		}
		.lineClass {
			height: 30px;
			border-right: 1px solid #e6e6e6;
			padding-left: 2px;
		}
		.headContent {
			width: 29%;
			background: #fff;
			padding: 38px 20px 20px;
		}
		.headTreatmentAging {
			width: 19%;
			background: #fff;
			padding: 20px;
			padding-top: 28px;
			margin-left: 15px;
			.explainClass {
				font-size: 12px;
				padding: 5px 0 14px;
				color: #666666;
			}

			.TreatmentAgingContent {
				padding: 15px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				// margin-bottom: 20px;
			}
		}
	}
	.orderOverview {
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		margin-top: 26px;
		margin-left: 0;
		padding: 8px 40px;
		.fongtClass {
			padding-top: 10px;
			font-size: 28px;
			font-weight: bold;
		}
	}
	.interceptClass {
		width: 50%;
		// margin-left: 15px;
		padding: 38px 20px 20px;
		background: #fff;
		flex-grow: 1; /*填满剩余空间*/
		margin-left: 15px;
		.interContent {
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			display: flex;
			.dayPurchaseClass {
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				// margin: 0 20px;
			}
		}
		#delivery-Eharts {
			width: 360px;
			height: 260px;
			background: #fff;
			flex: 1;
			margin: 0 auto;
		}
	}
}
</style>
