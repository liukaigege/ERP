<template>
	<div class="headFinancial" v-if="authPath('index_Finance:btn')||authPath('index_statement:btn')">
		<div class="font16 financialHead">财务审核</div>
		<div class="contentFinancial">
			<!-- 财务审核 -->
			<!-- 对账单审批 -->
			<div class="contetLeft" v-if="authPath('index_statement:btn')">
				<p style="padding:28px 0 0 20px" class="font16">对账单审批</p>
				<div style="display:flex" class="contentStyle">
					<!-- 待审核 -->
					<div>
						<p style="padding:20px 0 15px 20px" class="font16">待审核</p>
						<div class="ToExamine">
							<div style="display:flex;padding:17px 0 0 20px;align-items:center">
								<p>总数：</p>
								<p class="font28" style="color:#1880E7">{{statement.waitApproveCount}}</p>
							</div>
							<div id="Financial-Echarts"></div>
						</div>
					</div>
					<!-- 已审核 -->
					<div style="flex-grow: 1;padding-right:20px">
						<p class="font16" style="padding:20px 0 15px 0">已审核</p>
						<div class="ReviewedClass">
							<div class="dayPurchaseClass">
								<div class="dayPurChaseContent">
									<div style="display:flex; align-items: center;">
										<img src="../../../assets/image/编组备份7.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">今日审核
											<p class="font28 cursPonit" @click="jumpStatement(1,'')">{{statement.todayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass"></div>
									<div class="dayoneClass">
										<p class="colorIN">已对账</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(1,0)">{{statement.todayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(1,1)">{{statement.todayApprovepayCount}}</p>
									</div>
								</div>
								<div class="dayPurChaseContent">
									<div style="display:flex;align-items: center;">
										<img src="../../../assets/image/编组备份9.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">昨日审核
											<p class="font28 cursPonit" @click="jumpStatement(2,'')">{{statement.yesterdayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass"></div>
									<div class="dayoneClass">
										<p class="colorIN">已对账</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(2,0)">{{statement.yesterdayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(2,1)">{{statement.yesterdayApprovepayCount}}</p>
									</div>
								</div>
								<div class="dayPurChaseContent">
									<div style="display:flex;align-items: center;">
										<img src="../../../assets/image/编组备份10.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">近3日审核
											<p class="font28 cursPonit" @click="jumpStatement(3,'')">{{statement.threedayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass" style="padding:0"></div>
									<div class="dayoneClass">
										<p class="colorIN">已对账</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(3,0)">{{statement.threedayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jumpStatement(3,1)">{{statement.threedayApprovepayCount}}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 付款单审批 -->
			<div class="contetLeft" style="margin-right:0" v-if="authPath('index_Finance:btn')">
				<p style="padding:28px 0 0 20px" class="font16">付款单审批</p>
				<div style="display:flex" class="contentStyle">
					<!-- 待审核 -->
					<div>
						<p style="padding:20px 0 15px 20px" class="font16">待审核</p>
						<div class="ToExamine">
							<div style="display:flex;padding:17px 0 0 20px;align-items:center">
								<p>总数：</p>
								<p class="font28" style="color:#1880E7">{{waitApprove.waitApproveCount}}</p>
							</div>
							<div id="paymentApproval-Echarts"></div>
						</div>
					</div>
					<!-- 已审核 -->
					<div style="flex-grow: 1;padding-right:20px">
						<p class="font16" style="padding:20px 0 15px 0">已审核</p>
						<div class="ReviewedClass">
							<div class="dayPurchaseClass">
								<div class="dayPurChaseContent">
									<div style="display:flex; align-items: center;">
										<img src="../../../assets/image/编组备份7.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">今日审核
											<p class="font28 cursPonit" @click="jump(1)">{{waitApprove.todayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass"></div>
									<div class="dayoneClass">
										<p class="colorIN">已付款</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(2)">{{waitApprove.todayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(3)">{{waitApprove.todayApprovepayCount}}</p>
									</div>
								</div>
								<div class="dayPurChaseContent">
									<div style="display:flex;align-items: center;">
										<img src="../../../assets/image/编组备份9.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">昨日审核
											<p class="font28 cursPonit" @click="jump(4)">{{waitApprove.yesterdayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass"></div>
									<div class="dayoneClass">
										<p class="colorIN">已付款</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(5)">{{waitApprove.yesterdayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(6)">{{waitApprove.yesterdayApprovepayCount}}</p>
									</div>
								</div>
								<div class="dayPurChaseContent">
									<div style="display:flex;align-items: center;">
										<img src="../../../assets/image/编组备份10.png" style="width:24px;height:24px" alt="">
										<div class="dayFonts">近3日审核
											<p class="font28 cursPonit" @click="jump(7)">{{waitApprove.threedayApproveCount}}</p>
										</div>
									</div>
									<div class="lineClass" style="padding:0"></div>
									<div class="dayoneClass">
										<p class="colorIN">已付款</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(8)">{{waitApprove.threedayApprovenopayCount}}</p>
									</div>
									<div style="margin-left:15px">
										<p class="colorOut">已打回</p>
										<p class="font16Bold margin5 cursPonit" @click="jump(9)">{{waitApprove.threedayApprovepayCount}}</p>
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
				// 对账单
				statement: {},
				statementData: [],

			})
			// 初始进入页面-财务审核
			function queryFinancial() {
				const isPayment = authPath('index_Finance:btn')
				const isToExamine = authPath('index_statement:btn')
				if (!isPayment && !isToExamine) return
				getFinance().then(res => {
					// 付款单-
					state.waitApprove = res.data.paymentOrderData
					state.data = res.data.paymentOrderData.WaitApproveAddCount
					// 对账单
					state.statement = res.data.reconciliationAuditData
					state.statementData = res.data.reconciliationAuditData.WaitApproveAddCount
					isToExamine && initToExamine()
					isPayment && initPayment()
				})
			}
			//对账审批图表
			function initToExamine() {
				echarts.init(document.getElementById('Financial-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('Financial-Echarts'))
				myChart.on('click', function (params) {
					if (state.limitTag.includes('statementApproval')) {
						store.commit('com/delHistory', 'statementApproval')
						router.push({ name: 'statementApproval', params: { types: params.name == "历史新增" ? 'history' : 'today' } })
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
						// top:'20%',
						bottom: 0,
						left: 'center',
						icon: 'circle',
						orient: 'vertical',
						itemHeight: 10,
						itemWidth: 10,
						itemGap: 16,
						formatter: function (name) {
							//用来格式化图例文本，支持字符串模板和回调函数两种形式。模板变量为图例名称 {name}
							let value;
							state.statementData.forEach(item => {
								if (item.name == name) {
									value = item.value
								}

							})
							return `${name}：${value}`
						},
					},
					color: ['#71E06F', '#FEA060'],
					series: [
						{
							// name: 'Access From',
							type: 'pie',
							radius: ['35%', '55%'],
							center: ["50%", "48%"],
							avoidLabelOverlap: false,

							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							data: state.statementData
						}
					]
				})
			}
			//对账单跳转
			function jumpStatement(date, type) {
				if (state.limitTag.includes('statementApproval')) {
					store.commit('com/delHistory', 'statementApproval')
					router.push({ name: 'statementApproval', params: { timeType: 0, checkStatus: 2, startTime_endTime: date, checkResult: type } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			//付款审批图表
			function initPayment() {
				echarts.init(document.getElementById('paymentApproval-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('paymentApproval-Echarts'))
				myChart.on('click', function (params) {
					if (state.limitTag.includes('paymentApproval')) {
						store.commit('com/delHistory', 'paymentApproval')
						router.push({ name: 'paymentApproval', params: { id: params.name == "历史新增" ? 10 : 11 } })
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
						// top:'20%',
						bottom: 0,
						left: 'center',
						icon: 'circle',
						orient: 'vertical',
						itemHeight: 10,
						itemWidth: 10,
						itemGap: 16,
						formatter: function (name) {
							//用来格式化图例文本，支持字符串模板和回调函数两种形式。模板变量为图例名称 {name}
							let value;
							state.data.forEach(item => {
								if (item.name == name) {
									value = item.value
								}

							})
							return `${name}：${value}`
						},
					},
					color: ['#B126FF', '#FCE726'],
					series: [
						{
							// name: 'Access From',
							type: 'pie',
							radius: ['35%', '55%'],
							center: ["50%", "48%"],
							avoidLabelOverlap: false,

							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							data: state.data
						}
					]
				})
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryFinancial()

			})
			function jump(val) {//付款跳转
				if (state.limitTag.includes('paymentApproval')) {
					store.commit('com/delHistory', 'paymentApproval')
					router.push({ name: 'paymentApproval', params: { id: val } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			return {
				...toRefs(state),
				jump,
				jumpStatement
			}
		}
	}
</script>

<style lang="scss" scoped>
.headFinancial {
	margin-top: 24px;
	#Financial-Echarts {
		width: 340px;
		height: 350px;
		padding-bottom: 20px;
	}
	#paymentApproval-Echarts {
		width: 340px;
		height: 350px;
		padding-bottom: 20px;
	}
	.financialHead {
		padding: 16px 20px;
		background: #fff;
		border-bottom: 1px solid #e9e9e9;
	}
	.contentStyle {
		margin: 20px;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}
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
		.contetLeft {
			width: 50%;
			background: #fff;
			margin-right: 15px;
			.ToExamine {
				margin: 0px 15px 20px 20px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
			}
			.ReviewedClass {
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				// padding: 0px 20px 15px;
				padding-bottom: 15px;
				.dayPurchaseClass {
					.dayPurChaseContent {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 52px 40px 22px 28px;
					}
					.dayFonts {
						font-weight: bold;
						margin-left: 16px;
					}
					.lineClass {
						height: 30px;
						border-right: 1px solid #e6e6e6;
						padding-left: 6px;
						// border-left: 1px solid #e6e6e6;
						// padding-left: 60px;
					}
				}
			}
		}
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
