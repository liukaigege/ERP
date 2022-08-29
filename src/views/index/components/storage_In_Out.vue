<template>
	<div class="headInStorage">
		<!-- 采购单签收数量统计 -->
		<div class="countTwo">
			<div style="padding:28px 20px 16px;fontSize:16px">采购单签收数量统计</div>
			<div id="signQuantity-Echarts"></div>
		</div>
		<!-- 入库数量 -->
		<div class="InStorageOne">
			<div class="titileClass">入库数量统计</div>
			<div id="inStorage-Echarts"></div>
		</div>
		<!-- 出库数量 -->
		<div class="InStorageTwo">
			<div class="titileClass">出库数量统计</div>
			<div id="outStorage-Echarts"></div>
		</div>
	</div>
</template>
<script>
	import * as echarts from 'echarts'
	import { getInStock, getOutStock, getLogisticsSign } from '../api/api.js'
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
	export default {
		setup() {
      const store = useStore()
      const router = useRouter()
			const state = reactive({
				//   入库数量统计
				inStoreDate: [],//日期
				scanCodeInStockCount: [],//扫码入库
				defectiveInStockCount: [],//次品入库
				handInStockCount: [],//手动入库
				extraInStockCount: [],//多发入库
				//出库数量统计
				outStoreDate: [],//出库图表日期
				saleOutStockCount: [],//销售出库
				faultyOutStockCount: [],//报损出库
				returnOutStockCount: [],//采购退货
				extraOutStockCount: [],//多发出库
				extraReturnOutStockCount: [],//多发退货
				handOutStockCount: [],//手动出库
				signQuantityDate: [],//采购签收数量日期保存
				signQuantityCount: [],//采购签收数量数量保存
				limitTag: [],//权限标识
			})
			//初始入库数量统计表
			function queryInStock() {
				getInStock().then(res => {
					res.data.inStockCountList?.forEach(item => {
						state.inStoreDate.push(item.date)
						state.scanCodeInStockCount.push(item.scanCodeInStockCount)
						state.defectiveInStockCount.push(item.defectiveInStockCount)
						state.handInStockCount.push(item.handInStockCount)
						state.extraInStockCount.push(item.extraInStockCount)
					})
					initInstorage()
				})
			}
			//入库数量统计图表
			function initInstorage() {
				echarts.init(document.getElementById('inStorage-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('inStorage-Echarts'))
        //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('Come')) {
            store.commit('com/delHistory','Come')
						router.push({ name: 'Come', params: { dateType: params.name,type:0,isRefresh:1} })
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						bottom:5,
						left: 'center',
						itemHeight: 8,
						itemWidth: 8,
						itemGap: 15,
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '10%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							axisLabel: { interval: 0, rotate: 20 },
							data: state.inStoreDate
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [

						{
							name: '扫码入库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#F6BD16'//颜色
							},
							data: state.scanCodeInStockCount
						},
						{
							name: '次品入库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#E9E41C'//颜色
							},
							data: state.defectiveInStockCount
						},
						{
							name: '手动入库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#28D11F'//颜色
							},
							data: state.handInStockCount
						},
						{
							name: '多发入库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#1880E7'//颜色
							},
							data: state.extraInStockCount
						},
					]
				})
			}
			//初始出库数量统计表
			function queryOutStock() {
				getOutStock().then(res => {
					res.data.outStockCountList?.forEach(item => {
						state.outStoreDate.push(item.date)
						state.saleOutStockCount.push(item.saleOutStockCount)
						state.faultyOutStockCount.push(item.faultyOutStockCount)
						state.returnOutStockCount.push(item.returnOutStockCount)
						state.extraOutStockCount.push(item.extraOutStockCount)
						state.extraReturnOutStockCount.push(item.extraReturnOutStockCount)
						state.handOutStockCount.push(item.handOutStockCount)

					})
					initOutStorage()
				})
			}
			//出库数量统计
			function initOutStorage() {
				echarts.init(document.getElementById('outStorage-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('outStorage-Echarts'))
        //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('Come')) {
            store.commit('com/delHistory','Come')
						router.push({ name: 'Come', params: { dateType: params.name,type:1,isRefresh:1} })
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						bottom: 5,
						left: 'center',
						itemHeight: 8,
						itemWidth: 8,
						itemGap: 15,
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '10%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							axisLabel: { interval: 0, rotate: 20 },
							data: state.outStoreDate
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '销售出库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#F6BD16'//颜色
							},
							data: state.saleOutStockCount
						},
						{
							name: '报损出库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#FF4D00'//颜色
							},
							data: state.faultyOutStockCount
						},
						{
							name: '采购退货',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#28D11F'//颜色
							},
							data: state.returnOutStockCount
						},
						{
							name: '多发出库',
							type: 'bar',
							stack: 'Ad',
							data: state.extraOutStockCount
						},
						{
							name: '多发退货',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#A300FF'//颜色
							},
							data: state.extraReturnOutStockCount
						},
						{
							name: '手动出库',
							type: 'bar',
							stack: 'Ad',
							itemStyle: {
								color: '#1880E7'//颜色
							},
							data: state.handOutStockCount
						},
					]
				})
			}
			//采购签收数量统计接口
			function queryLogistics() {
				getLogisticsSign().then(res => {
					res.data.purchaseOrderSignList?.forEach(item => {
						state.signQuantityDate.push(item.date)
						state.signQuantityCount.push(item.signCount)
					})
					initSignQuantityEchars()
				})
			}
			//图表
			function initSignQuantityEchars() {
				echarts.init(document.getElementById('signQuantity-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('signQuantity-Echarts'))
        //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('signRecord')) {
            store.commit('com/delHistory','signRecord')
						router.push({ name: 'signRecord', params: { dateType: params.name} })
					} else {
						ElMessage.error('无跳转权限')
					}
				})
				myChart.setOption({
					tooltip: {
						trigger: 'axis',

					},
					xAxis: {
						type: 'category',
						axisLabel: { interval: 0, rotate: 20 },
						data: state.signQuantityDate
					},
					yAxis: {
						type: 'value'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '8%',
						containLabel: true
					},
					series: [
						{
							itemStyle: {
								color: '#65B0FB'
							},
							data: state.signQuantityCount,
							type: 'bar'
						}
					]
				})
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				queryInStock()
				queryOutStock()
				queryLogistics()
			})
			return {
				...toRefs(state)
			}
		}
	}
</script>

<style lang="scss" scoped>
.headInStorage {
	margin-top: 15px;
	display: flex;
	.titileClass {
		padding: 8px 0 16px 0;
		font-size: 16px;
	}
	.countTwo {
		width: 33%;
		margin-right: 15px;
		background: #fff;
		padding: 0 20px;
		#signQuantity-Echarts {
			height: 328px;
			margin: 0 auto;
		}
	}
	.InStorageOne {
		width: 33%;
		background: #fff;
		padding: 20px;
    padding-bottom: 0;
		#inStorage-Echarts {
			height: 338px;
			// box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			// border-radius: 10px;
		}
	}
	.InStorageTwo {
		width: 33%;
		margin-left: 15px;
		background: #fff;
		padding: 20px;
    padding-bottom: 0;
		#outStorage-Echarts {
			height: 338px;
			// box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
			// border-radius: 10px;
		}
	}
}
</style>