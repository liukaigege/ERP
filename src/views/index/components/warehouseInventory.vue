<template>
	<div class="headWarehouseInventory">
		<div class="headClass fontClassSize">在仓库存</div>
		<!-- 图表 -->
		<div class="warehouseContent">
			<div class="warhouseEcharts">
				<el-form :model="form" :inline="true">
					<el-form-item label="仓库名称:">
						<el-select v-model="form.warehoseId" style="width:225px">
							<el-option label="万众智谷仓库" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="ponit ponitY">
						</div>
						<span style="margin-left:6px">在仓库存：</span>
						<span class="font18Bold">{{inStockQuantity}}</span>
					</el-form-item>
					<el-form-item>
						<div class="ponit ponitB">
						</div>
						<span style="margin-left:6px">SKU种类：</span>
						<span class="font18Bold">{{skuTypeQuantity}}</span>
					</el-form-item>
				</el-form>
				<!-- 图表 -->
				<!-- 无数据时候 -->
				<div class="EchartsNone" v-if="categoryList&&!categoryList.length">
					<img src="../../../assets/image/TextTasks2.png" alt="">
					<p style="textAlign:center;color:#666">当前在仓库存为0</p>
				</div>
				<div id="category-Echarts" v-show="categoryList&&categoryList.length"></div>
			</div>
			<!-- 右边 -->
			<div class="warhoseRanking">
				<p style="margin-bottom:15px;fontSize:16px">在仓库存排行榜
					<span>
						<img src="../../../assets/image/编组.png" alt="">
					</span>
				</p>
				<div class="stockList">
					<div class="imgListNone" v-if="dataList&&!dataList.length">
						<img src="../../../assets/image/RankingList2(1).png" alt="">
						<p style="textAlign:center;color:#666">暂无排行榜数据</p>
					</div>
					<div class="stockImg" v-for="(item,index) in dataList" :key="item.id">
						<div v-if="item.tag==='one'" style="display:flex;">
							<img src="../../../assets/image/编组21.png" style="width:27px;height:24px" alt="">
						</div>
						<div v-if="item.tag==='two'" style="display:flex;">
							<img src="../../../assets/image/编组15备份3.png" style="width:27px;height:24px" alt="">
						</div>
						<div v-if="item.tag==='three'" style="display:flex;">
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
						<div style="margin-left:17px;" class="skuFont">
							<p>在仓库存：{{item.skuInStock}} <span style="margin-top:5px;margin-left:40px">占用库存：{{item.occupySkuInStock}}</span></p>
							<el-tooltip placement="top">
								<template #content>
									<a v-copy="item.skuCode" style="color:#fff">复制</a>
								</template>
								<p :title="item.skuCode" style="margin-top:5px;color:#666; cursor: pointer;" @click="jumpSku(item.skuCode)">{{item.skuCode}}</p>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getWarehouseStock } from '../api/api.js'
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import * as echarts from 'echarts'
	import { ElMessage } from 'element-plus'
	import { storage } from '@/utils/storage.js'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	export default {
		setup() {
			const store = useStore()
			const router = useRouter()
			const state = reactive({
				form: {
					warehoseId: '1',
				},
				inStockQuantity: '',
				skuTypeQuantity: '',
				//图表数据
				categoryList: [],
				categoryName: [],//品类名称
				categoryInStock: [],//品类值
				limitTag: [],//权限
				dataList: []//右侧TOP10
			})
			//初始进入页面
			function query() {
				getWarehouseStock({ wareHouseId: 1 }).then(res => {
					state.inStockQuantity = res.data.inStockQuantity
					state.skuTypeQuantity = res.data.skuTypeQuantity
					state.dataList = res.data.topTenStockList ? res.data.topTenStockList.filter(item => item.skuInStock) : []//top10
					state.dataList?.forEach((item, index) => {
						item.index = index + 1
						if (item.index === 1) {
							item.tag = 'one'
						} else if (item.index === 2) {
							item.tag = 'two'
						} else if (item.index === 3) {
							item.tag = 'three'
						}
					})
					//在仓库存赋值
					state.categoryList = res.data.categoryList ? res.data.categoryList : []
					state.categoryList?.forEach(item => {
						state.categoryName.push(item.categoryName)
						state.categoryInStock.push(item.categoryInStock)
					})
					nextTick(() => {
						initCategory()
					})

				})

			}
			//品类图表
			function initCategory() {
				echarts.init(document.getElementById('category-Echarts')).dispose()
				let myChart = echarts.init(document.getElementById('category-Echarts'))
				//跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('commodityManagement')) {
						let categoryId;
						state.categoryList.forEach(item => {
							if (item.categoryName == params.name) {
								categoryId = item.categoryId
							}
						})
						store.commit('com/delHistory', 'commodityManagement')
						router.push({ name: 'commodityManagement', params: { categoryId: categoryId } })
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
					// legend: {},
					grid: {
						left: '2%',
						right: '4%',
						bottom: '1%',
						top: '10%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: 'category',
						data: state.categoryName
					},
					series: [
						{
							name: '在仓库存',
							type: 'bar',
							itemStyle: {
								color: '#65B0FB'
							},
							data: state.categoryInStock
						},

					]
				})
			}
			//跳转
			function jumpSku(val) {
				if (state.limitTag.includes('commodityManagement')) {
					store.commit('com/delHistory', 'commodityManagement')
					router.push({ name: 'commodityManagement', params: { searchType: 4, searchContent: val } })
				} else {
					ElMessage.error('无跳转权限')
				}
			}
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				query()
			})
			return {
				...toRefs(state),
				jumpSku
			}
		}

	}
</script>

<style lang="scss" scoped>
	.headWarehouseInventory {
		margin-top: 24px;
		.fontClassSize {
			font-size: 16px;
			color: #202020;
		}
		.font18Bold {
			font-size: 18px;
			font-weight: bold;
		}
		.headClass {
			padding: 16px 20px;
			background: #fff;
			border-bottom: 1px solid #e6e6e6;
		}
		.warehouseContent {
			height: 505px;
			display: flex;
			// background: #fff;
			// padding: 28px 20px 33px;
			.warhouseEcharts {
				width: 70%;
				background: #fff;
				padding: 28px 20px 33px;
				position: relative;
				.EchartsNone {
					position: absolute;
					top: 37%;
					left: 40%;
				}
				.ponit {
					width: 10px;
					height: 10px;
					border-radius: 50%;
				}
				.ponitY {
					background: #e88e65;
					margin-left: 25px;
				}
				.ponitB {
					background: #50c8d9;
					margin-left: 25px;
				}
				#category-Echarts {
					width: 90%;
					height: 376px;
					margin: 0 auto;
				}
			}
			//列表
			.warhoseRanking {
				width: 20%;
				margin-left: 15px;
				background: #fff;
				padding: 28px 20px 33px;
				flex-grow: 1; /*填满剩余空间*/
				.stockList {
					height: 420px;
					padding: 20px 10px 20px 28px;
					box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
					border-radius: 10px;
					overflow: auto;
					position: relative;
					.imgListNone {
						//    margin: 0 auto;
						position: absolute;
						top: 29%;
						left: 30%;
					}
					.stockImg {
						display: flex;
						align-items: center;
						margin-bottom: 20px;
					}
					.skuFont {
						width: 250px;
						// font-size: 12px;
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
</style>
