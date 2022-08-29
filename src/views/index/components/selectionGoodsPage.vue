<template>
	<div class="headSelectionGoods" v-if="authPath('index_selectGood_Quoted:btn') || authPath('index_selectGood_Shelved:btn')">
		<div class="titileClass">选品</div>
		<div class="selectContent">
			<el-row :gutter="15">
				<el-col :span="5">
					<div class="spuClass">
						<div style="padding:28px 0 15px 0" class="fontClassSize">SPU</div>
						<div class="outPurchase">
							<div class="outPutchaseFont" v-if="authPath('index_selectGood_Quoted:btn')">
								<p style="margin-bottom:20px;font-weight: 550;">SPU总数</p>
								<p style="fontSize:32px;color:#000">{{spuOverview.spuCount}}</p>
							</div>
							<div class="contentClass">
								<div style="display: flex;align-items: center;" v-if="authPath('index_selectGood_Quoted:btn')">
									<img src="../../../assets/image/编组spu.png" alt="" style="width:23px;height:23px">
									<div style="margin-left:10px">
										<p style="color:#666">未搁置</p>
										<p class="font16Bold" @click="jumpshelved(1)">{{spuOverview.unshelvedCount}}</p>
									</div>

								</div>
								<div style="display: flex;align-items: center;margin-left:40px" v-if="authPath('index_selectGood_Shelved:btn')">
									<img src="../../../assets/image/编组spu1.png" alt="" style="width:23px;height:23px">
									<div style="margin-left:10px">
										<p style="color:#666">已搁置</p>
										<p class="font16Bold" @click="jumpshelved(0)">{{shelvedCount}}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="spuClass" style="padding-left:0" v-if="authPath('index_selectGood_Quoted:btn')">
						<div style="padding:28px 0 15px 0" class="fontClassSize">未搁置商品</div>
						<div class="dayPurchaseClass">
							<div class="dayPurChaseContent" style="padding-top:65px">
								<div style="display:flex;align-items:center">
									<img src="../../../assets/image/编组备份3.png" style="width:22px;height:24px" alt="">
									<p class="dayFonts">单品 </p>
								</div>
								<div class="lineClass"></div>
								<div class="dayoneClass">
									<p style="color:#666">定制品</p>
									<p class="font16Bold" @click="jumpSigle(1,1)">{{unshelvedGood.singleCustCount}}</p>
								</div>
								<div style="margin-left:15px">
									<p style="color:#666">普通商品</p>
									<p class="font16Bold" @click="jumpSigle(1,0)">{{unshelvedGood.singleNormalCount}}</p>
								</div>
							</div>
							<div class="dayPurChaseContent" style="padding-bottom:60px;padding-top:0;padding-right:93px">
								<div style="display:flex;align-items:center">
									<img src="../../../assets/image/编组31.png" style="width:22px;height:24px" alt="">
									<p class="dayFonts">组合品</p>
								</div>
								<div class="lineClass" style="margin-left:-10px"></div>
								<div class="dayoneClass" style="">
									<p style="color:#666">普通商品</p>
									<p class="font16Bold" @click="jumpSigle(2,0)">{{unshelvedGood.combineNormalCount}}</p>
								</div>
								<div>
									<p></p>
								</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="daydateGoods" v-if="authPath('index_selectGood_Quoted:btn')">
						<div style="padding:28px 0 15px 0" class="fontClassSize">今日新增商品数</div>
						<div class="addGoods">
							<!-- 图表 -->
							<div style="display:flex;margin-left:20px;align-items:center;padding-top:15px">
								<span>总数:</span>
								<span class="font28" style="margin-left:5px">{{sumCount}}</span>
							</div>
							<div id="addGoods-Echarts"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="daydateGoods" v-if="authPath('index_selectGood_Quoted:btn')">
						<div style="padding:28px 0 15px 0" class="fontClassSize">今日上品数</div>
						<div class="addGoods">
							<!-- 图表 -->
							<div style="display:flex;margin-left:20px;align-items:center;padding-top:15px">
								<span>总数:</span>
								<span class="font28" style="margin-left:5px">{{pricedSumCount}}</span>
							</div>
							<div id="TopGrade-Echarts"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="daydateGoods" v-if="authPath('index_selectGood_Quoted:btn')">
						<div style="padding:28px 0 15px 0" class="fontClassSize">今日上品数-品类分布图</div>
						<div class="addGoods">
							<!-- 图表 -->
							<div id="TopGradeCategory-Echarts"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import { getSelectGoods, getSelectGoodsShelved } from '../api/api.js'
	import * as echarts from 'echarts'
	import { onMounted, reactive, toRefs } from 'vue'
	import { authPath } from '@/utils/hooks.js'
	import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
	export default {
		setup() {
      const store = useStore()
			const router = useRouter()
			const state = reactive({
				addGoodsList: [],//今日新增商品
				TopGradeList: [],//上品数据
				spuOverview: {},//spu概览
				unshelvedGood: {},//未搁置商品
				sumCount: null,//今日新增商品数
				pricedSumCount: null,//今日上品总数
				categoryList: [],//品类的数据
				shelvedCount: '',//已搁置总数
				limitTag: [],//权限标识
			})
			//初始进入页面
			function query() {
				if (!authPath('index_selectGood_Quoted:btn')) return false
				getSelectGoods().then(res => {
					state.spuOverview = res.data.spuOverview
					state.unshelvedGood = res.data.unshelvedGood
					state.pricedSumCount = res.data.todayPricedGood.pricedSumCount//上品总数
					state.TopGradeList = res.data.todayPricedGood.list
					state.sumCount = res.data.todayIncreaseGood.sumCount//新增商品数
					state.addGoodsList = res.data.todayIncreaseGood.list
					state.categoryList = res.data.categoryDistributionList
					dayaddGoods()
					dayTopGrade()
					dayTopGradeCategory()
				})
			}
			//选品已搁置的接口
			function selectGoodsShelved() {
				if (!authPath('index_selectGood_Shelved:btn')) return
				getSelectGoodsShelved().then(res => {
					state.shelvedCount = res.data.data
				})
			}
			//今日新增商品数图表
			function dayaddGoods() {
				echarts.init(document.getElementById('addGoods-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('addGoods-Echarts'))
         //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('SetPrice')) {
            store.commit('com/delHistory','SetPrice')
						router.push({ name: 'SetPrice', params: { combineType: params.name=='单品'?1:2,timeType:8,start_end:1,isIndex:1} })
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
						bottom: 5,
						left: 'center',
						icon: 'circle',
						orient: 'vertical',
						itemHeight: 10,
						itemWidth: 10,
						formatter: function (name) {
							//用来格式化图例文本，支持字符串模板和回调函数两种形式。模板变量为图例名称 {name}
							let value;
							state.addGoodsList.forEach(item => {
								if (item.name == name) {
									value = item.value
								}

							})
							return `${name}：${value}`
						},
					},
					color: ['#73DEB3', '#FEA060'],
					series: [
						{
							// name: 'Access From',
							type: 'pie',
							radius: ['30%', '60%'],
							center: ["50%", "38%"],
							avoidLabelOverlap: false,
							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							data: state.addGoodsList
						}
					]
				})
			}
			//今日上品数
			function dayTopGrade() {
				echarts.init(document.getElementById('TopGrade-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('TopGrade-Echarts'))
          //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('SetPrice')) {
            store.commit('com/delHistory','SetPrice')
						router.push({ name: 'SetPrice', params:{ enableCustom: params.name=='定制品'?1:0,timeType:8,start_end:1,isIndex:1}})
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
						bottom: 5,
						left: 'center',
						icon: 'circle',
						orient: 'vertical',
						itemHeight: 10,
						itemWidth: 10,
						formatter: function (name) {
							let value;
							state.TopGradeList.forEach(item => {
								if (item.name == name) {
									value = item.value
								}

							})
							return `${name}：${value}`
						},
					},
					color: ['#FFCE12', '#1880E7'],
					series: [
						{
							// name: 'Access From',
							type: 'pie',
							radius: ['30%', '60%'],
							center: ["50%", "38%"],
							avoidLabelOverlap: false,
							label: {
								show: false
							},
							labelLine: {
								show: false
							},
							data: state.TopGradeList
						}
					]
				})
			}
			//品类分布图
			function dayTopGradeCategory() {
				echarts.init(document.getElementById('TopGradeCategory-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('TopGradeCategory-Echarts'))
           //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('SetPrice')) {
            store.commit('com/delHistory','SetPrice')
						router.push({ name: 'SetPrice', params: { categoryName: params.name,timeType:8,start_end:1,isIndex:1} })
					} else {
						ElMessage.error('无跳转权限')
					}
        })
				myChart.setOption({
					tooltip: {
						// show: true,
						trigger: 'item',
						// formatter: "{b} :{d}%"//显示百分比
					},
					legend: {
						type: 'scroll',
						selectedMode: true,//取消标题点击后事件-这里显示和隐藏指定项
						bottom: 10,
						left: 'center',
						icon: 'circle',
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 5,

					},
					label: {
						formatter: '{b}',
						position: 'inner'
					},

					series: [
						{
							type: 'pie',
							radius: ['30%', '60%'],
							center: ["50%", "40%"],
							// avoidLabelOverlap: false,
							avoidLabelOverlap: true, // 防止牵引线堆叠挤在一块
							labelLine: {
								show: true,
								length: 5, // 延展线条的长度
							},
							data: state.categoryList
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
				selectGoodsShelved()
			})
			//spu跳转
			function jumpshelved(val) {
				if (state.limitTag.includes(val ? 'SetPrice' : 'LayAside')) {
          store.commit('com/delHistory',val ? 'SetPrice' : 'LayAside')
					router.push({ name: val ? 'SetPrice' : 'LayAside' ,params:{isIndex:1}})
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			//单品组合品跳转
			function jumpSigle(type, enable) {
				if (state.limitTag.includes('SetPrice')) {
          store.commit('com/delHistory', 'SetPrice')
					router.push({ name:'SetPrice',params:{combineType:type,enableCustom:enable,isIndex:1}})
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			return {
				...toRefs(state),
				jumpshelved,
				jumpSigle
			}
		}
	}
</script>

<style lang="scss" scoped>
.headSelectionGoods {
	margin-top: 24px;
	.fontClassSize {
		font-size: 16px;
		color: #202020;
	}
	.font16Bold {
		font-size: 16px;
		font-weight: bold;
		padding-top: 5px;
		cursor: pointer;
	}
	.font28 {
		font-size: 28px;
		color: #1880e7;
	}
	.titileClass {
		padding: 16px 20px;
		background: #fff;
		border-bottom: 1px solid #e9e9e9;
		font-size: 16px;
	}
	.selectContent {
		background: #fff;
		height: 370px;
		padding: 0 20px;
		.spuClass {
			// padding: 0 0 20px 20px;
			.contentClass {
				display: flex;
				justify-content: space-between;
				// align-items: center;
			}
			.outPurchase {
				// padding: 40px;
				padding: 0 46px;
				padding-top: 50px;
				padding-bottom: 65px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				.outPutchaseFont {
					text-align: center;
					padding-bottom: 40px;
					font-size: 18px;
					color: #666;
				}
			}
		}
		.dayPurchaseClass {
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			// margin: 0 20px;
			.dayPurChaseContent {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 28px 28px 72px 28px;
			}
			.dayFonts {
				font-weight: bold;
				margin-left: 10px;
			}
			.lineClass {
				height: 30px;
				padding-left: 2px;
				border-right: 1px solid #e6e6e6;
				// border-left: 1px solid #e6e6e6;
				// padding-left: 30px;
			}
		}
		// 今日新增商品数
		.daydateGoods {
			background: #fff;
			.addGoods {
				// padding-left: 20px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				#addGoods-Echarts {
					width: 254px;
					height: 234px;
				}
			}
		}
		#TopGrade-Echarts {
			width: 254px;
			height: 234px;
		}
		#TopGradeCategory-Echarts {
			width: 360px;
			height: 286px;
			margin: 0 auto;
		}
	}
}
</style>