<template>
	<div class="headSupplierManagement">
		<div class="headSupplierClass">供应商管理</div>
		<div class="supplierContent">
			<!-- 概览 -->
			<div class="overView">
				<div style="padding:38px 0 26px;fontSize:16px">概览</div>
				<div class="totalClass">
					<div style="display:flex;align-items: center;line-height: 28px;">
						<p>供应商总数：
						</p>
						<p class="fontSize28" style="cursor: pointer;" @click="jumpSupplier('cooperation',0)">{{supplierTotal.allSupplierTotalCount}}</p>
					</div>

					<div class="pressClass">
						<div>
							<p class="curPoint" @click="jumpSupplier('cooperation',0)">合作供应商：{{supplierTotal.cooperateSupplierTotalCount}}</p>
							<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#828CF9" :style="{width:(supplierTotal.cooperateSupplierTotalCount/max)*100 +'%'}" :show-text="false" />
							<p class="margin26 curPoint" @click="jumpSupplier('1688',0)">1688：{{supplierTotal.supplier1688TotalCount}}</p>
							<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#F9B867" :style="{width:(supplierTotal.supplier1688TotalCount/max)*100 +'%'}" :show-text="false" />
							<p class="margin26 curPoint" @click="jumpSupplier('tb',0)">淘宝：{{supplierTotal.taobaoSupplierTotalCount}}</p>
							<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#75DEC5" :style="{width:(supplierTotal.taobaoSupplierTotalCount/max)*100 +'%'}" :show-text="false" />
							<p class="margin26 curPoint" @click="jumpSupplier('pdd',0)">拼多多：{{supplierTotal.pinduoduoSupplierTotalCount}}</p>
							<el-progress class="margin8" :stroke-width="12" :percentage="100" color="#FE8F44" :style="{width:(supplierTotal.pinduoduoSupplierTotalCount/max)*100 +'%'}" :show-text="false" />
						</div>
						<div class="lineClass"></div>
						<div class="headAdd">
							<p class="addDayClass" style="margin:0">
								<img src="../../../assets/image/编组19备份3.png" style="width:32px;height:32px" alt="">
								<span class="fontSize16">今日净增长：</span>
								<span class="fontSize28">{{supplierTotal.allSupplierAddCount}}</span>
							</p>
							<p class="addDayClass">
								<img src="../../../assets/image/编组19备份4.png" style="width:32px;height:32px" alt="">
								<span class="fontSize16">昨日净增长：</span>
								<span class="fontSize28">{{supplierTotal.yesterdaySupplierAddCount}}</span>
							</p>
							<p class="addDayClass">
								<img src="../../../assets/image/编组19备份2.png" style="width:32px;height:32px" alt="">
								<span class="fontSize16">近3日净增长：</span>
								<span class="fontSize28" style="">{{supplierTotal.threedaySupplierAddCount}}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<!-- 供应商使用率 -->
			<div class="utilizationClass">
				<div style="padding:28px 0 14px;fontSize:16px">
					供应商采购占比
          	<span>
						<el-tooltip effect="light" placement="right" raw-content content="<p>采购数量计算规则：</p><p>普通商品：缺货采购+备货采购审核通过的商品总数（待到货采购数量+已完成已入库数量）</p><p>定制品：缺货采购+备货采购审核通过的商品总数（待到货采购数量+已完成已入库数量）</p>">
							<i class="el-icon-question">
							</i>
						</el-tooltip>
					</span>
					<p style="margin-top:5px;color:#666;fontSize:12px">统计时间：近7天</p>
				</div>
				<!-- 图表 -->
				<div class="contentEcharts">
					<div id="supplier-echarts"></div>
				</div>
			</div>
			<!-- 供应商采购数量 -->
			<div class="purchaseCount">
				<div style="padding:28px 0 14px;fontSize:16px">
					供应商采购数量TOP5
					<p style="margin-top:5px;color:#666;fontSize:12px">统计时间：近7天</p>
				</div>
				<div class="pageTable">
					<el-table :data="dataList">
						<el-table-column label="供应商名称" show-overflow-tooltip width='180' prop="supplierName" align="center" />
						<el-table-column label="类型" prop="supplierType" align="center" />
						<el-table-column label="采购数量" prop="supplierCount" align="center" />
						<el-table-column label="供应商商品品类" show-overflow-tooltip prop="supplierGoodsType" align="center" />
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getSupplierManagement } from '../api/api.js'
	import { onMounted, reactive, toRefs } from 'vue'
	import * as echarts from 'echarts'
  import { storage } from '@/utils/storage.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
	export default {
		setup() {
      const store = useStore()
			const router = useRouter()
			const state = reactive({
				supplierTotal: {},//供应商总数
				max: null,
				supplieDataPie: [],
				limitTag: [],//权限标识
				dataList: []//表格数据
			})
			//初始进入界面
			function query() {
				getSupplierManagement().then(res => {
					let obj = {
						'合作供应商': res.data.cooperateSupplierTotalCount,
						'淘宝': res.data.taobaoSupplierTotalCount,
						'1688': res.data.supplier1688TotalCount,
						'拼多多': res.data.pinduoduoSupplierTotalCount,
					}
					state.supplierTotal = res.data
					state.supplieDataPie = res.data.supplierType ? res.data.supplierType : []
					state.dataList = res.data.supplierCountTop5
					var arr = Object.values(obj)
					state.max = Math.max(...arr)
					// console.log(obj,'obj',state.max);
					supplierEcharts()
				})
			}
			//供应商采购占比图表
			function supplierEcharts() {
				echarts.init(document.getElementById('supplier-echarts')).dispose()
				let myChart = echarts.init(document.getElementById('supplier-echarts'))
          //跳转带参数
				myChart.on('click', function (params) {
					if (state.limitTag.includes('PurchaseOrders')) {
            store.commit('com/delHistory','PurchaseOrders')
						router.push({ name: 'PurchaseOrders', params: { supplierType: params.name,timeStart_timeEnd:4,isSupplier:1,status: null,isIndex:1,timeType: 3} })
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
							radius: '50%',
							center: ["50%", "48%"],
							label: {
								formatter: '{b}:\n{d}%',
								// position:'inner'
							},
							// color: ['#FF4D00', '#FCE300', '#58DB56'],
							data: state.supplieDataPie,
							labelLine: {
								show: true,
								length: 5, // 延展线条的长度
							},
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
			onMounted(() => {
				let list = storage.get('ERP_USERINFO')
				list.menus.forEach(item => {
					if (item.componentName) state.limitTag.push(item.componentName)
				})
				query()

			})
      //供应商进度条跳转
      function jumpSupplier(type,date){
        	if (state.limitTag.includes('PurchaseSMSupplier')) {
            store.commit('com/delHistory','PurchaseSMSupplier')
						router.push({ name: 'PurchaseSMSupplier', params:{ activeName: type,startTime_endTime:date,isIndex:1} })
					} else {
						ElMessage.error('无跳转权限')
					}
      }
			return {
				...toRefs(state),
        jumpSupplier
			}
		}

	}
</script>

<style lang="scss" scoped>
.headSupplierManagement {
	margin-top: 24px;
    :deep(.el-icon-question:before) {
				color: #fe8f44;
			}
  .curPoint{
    cursor: pointer;
  }
	.fontSize16 {
		font-size: 16px;
		font-weight: bold;
		margin-left: 15px;
    // cursor: pointer;
	}
	.fontSize28 {
		font-size: 28px;
		font-weight: bold;
	}
	.margin8 {
		margin-top: 8px;
	}
	.margin26 {
		margin-top: 26px;
	}
	.headSupplierClass {
		padding: 16px 20px;
		background: #fff;
		font-size: 16px;
		border-bottom: 1px solid #e6e6e6;
	}
	.supplierContent {
		display: flex;
		height: 463px;
		.overView {
			width: 32%;
			background: #fff;
			padding: 0px 20px;
			padding-bottom: 20px;
			.totalClass {
				padding: 30px 20px 25px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				.pressClass {
					padding-top: 40px;
					display: flex;
					.lineClass {
						// width: 40%;
						height: 190px;
						margin-top: 23px;
						padding: 18px 40px 0 22px;
						border-right: 1px solid #e6e6e6;
					}
					.headAdd {
						padding-left: 45px;
						margin-top: 18px;
						width: 60%;
						// padding-left: 20px;
						.addDayClass {
							display: flex;
							align-items: center;
							margin-top: 42px;
						}
					}
				}
			}
		}
		.utilizationClass {
			width: 26%;
			// padding-left: 20px;
			padding: 0 15px 0 20px;
			// margin-ri: 15px;
			background: #fff;
			margin-left: 15px;
			.contentEcharts {
				height: 358px;
				margin-bottom: 20px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				#supplier-echarts {
					// width: 380px;
					height: 350px;
					margin: 0 auto;
				}
			}
		}
		.purchaseCount {
			width: 44%;
			background: #fff;
			flex-grow: 1; /*填满剩余空间*/
			padding: 0 20px;
			padding-left: 0;
			.pageTable {
				height: 359px;
				padding: 15px 20px;
				background: #fff;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				:deep(.el-table .el-table__cell) {
					padding: 15px 0;
				}
			}
		}
	}
}
</style>
