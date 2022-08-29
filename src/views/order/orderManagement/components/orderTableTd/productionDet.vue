<!--
 * @Descripttion: 商品信息
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 14:01:54
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 21:20:19
-->
<template>
	<div class="productionDet">

		<template v-for="(item, index) in list()" :key="index">

			<div
				:class="showBd(index, list()) ? 'goodsItem ' : 'goodsItem bd'"
			>
<!--				<div v-for="(a, b) in item.packageGoods || []" :key="b">-->
				<div>
					<el-row>
						<el-col :span="20">
							<div class="goodsBox" style="margin-bottom: 10px">
								<el-popover placement="right" :width="250" trigger="hover">
									<div>
										<goodsImg :data="proverData(item)" :remark="remark" />
									</div>
									<template #reference>
										<div
											class="goodsImg"
											@mouseenter="mouseenter(item.packageSkuId, true)"
											@mouseleave="mouseenter(item.packageSkuId, false)"
										>
<!--											<img :src="item.mainImg" alt="" srcset="" fit="contain" />-->
											<img :src="item.skuImg" alt="" srcset="" fit="contain"/>
											<div v-if="showNoMatch(item)" class="tag_no">未匹配</div>

											<div class="gift" v-if="item.giftFlag == 1">赠</div>
										</div>
									</template>
								</el-popover>
								<div class="goodsInfo">
									<el-tooltip placement="top">
										<template #content>
											<p style="cursor: pointer" v-copy="item.sku">复制</p>
										</template>
										<p class="infoTitle">
											<a :href='item.thirdUrl' target="_blank">{{ item.sku }}</a>
										</p>
									</el-tooltip>
									<p class="infoPrice">
										{{ scope.row.currency }} {{ item.price }}
									</p>

									<div v-if="getSkuValue(item.skuValue)?.length > 0">
										<div
											class="sku "
											v-for="(c, d) in getSkuValue(item.skuValue)"
											:key="d"
										>
											<p v-if="!c.speValmainImg">
												{{ c.spe + ':' }} {{ c.speVal }}
											</p>
											<p  v-else>
												{{ c.spe + ':' }}
												<el-popover
													placement="right"
													:width="240"
													trigger="hover"
												>
													<goodsImg :data="proverDatas(c.speValmainImg)" />
													<template #reference>
														<i class="el-icon-picture"></i>
													</template>
												</el-popover>
											</p>
										</div>
									</div>

									<el-button
										type="text"
										v-if="item.customization == 1"
										@click="showAbout(item.customization, item, scope.row)"
										>{{
											item.customization == 1 ? '定制' : '非定制'
										}}{{item.customization == 1 && item.taggedFlag == 1 ? '（普）' : ''}}</el-button
									>
								</div>
							</div>
						</el-col>

						<el-col class="infoRight_box" :span="4">
							<div class="infoRight">
								<p class="num">X{{ item.quantity }}</p>
								<div v-show="showStatus">
									<p class="type" v-if="showPur(item)">
										{{ pur(item) }}
									</p>
									<el-popover
									placement="right"
									:width="340"
									trigger="hover"
									v-if="showSendGoods(item) && getPoverGoods(item)?.length >0"
								>
									<div class='sendGoodsBox'>
										<div class='packGoodsItem' v-for='(i,index) in getPoverGoods(item)' :key='index'>
											<div class='goodsLeft'>
												<div class='goodsImg'>
													<img :src='i.mainImg' alt='' fit="contain">
												</div>
												<div class='goodsInfo'>
														<p>{{i.goodsSku  || i.skuCode}}</p>
													<div v-if="getSkuValue(i.skuValue)?.length > 0">
														<div
															class="sku "
															v-for="(c, d) in getSkuValue(i.skuValue)"
															:key="d"
														>
															<p v-if="!c.speValmainImg">
																{{ c.spe + ':' }} {{ c.speVal }}
															</p>
															<p  v-else>
																{{ c.spe + ':' }}
																<el-popover
																	placement="right"
																	:width="240"
																	trigger="hover"
																>
																	<goodsImg :data="proverDatas(c.speValmainImg)" />
																	<template #reference>
																		<i class="el-icon-picture"></i>
																	</template>
																</el-popover>
															</p>
														</div>
													</div>
													<p style='font-size: 12px'>CNY:{{i.purchasePrice || '-'}}</p>
													<p style='font-size: 12px' v-if='!item.packageSkuMatch'>
														<span>在仓库存:{{i.stockQuantity || '-'}}</span>
														<span style='margin-left: 15px'>到货:{{i.matchQuantity   || '-'}}</span>
													</p>
												</div>
											</div>

											<div class='goodsRight' style='width: 40px;text-align: right'>
											x {{i.goodsQuantity ||i.quantity}}
											</div>

										</div>

									</div>

									<template #reference>
										<el-button type='text' size='small'>发货商品</el-button>
									</template>
								</el-popover>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { onMounted, inject, computed, reactive, toRefs } from 'vue'
import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'
import optionsDisabled from '../../util/optionsDisabled.js'
import { contentBySku } from '@/api/order/orderManagement.js'

import { useStore } from 'vuex'
export default {
	components: { goodsImg },
	props: {
		scope: {
			type: Object,
			default: null
		},
	},
	setup(props) {
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const store = useStore()
		const data = reactive({
			show: [],
			tableList: [],
			remark: null,
			showStatus:orderTable.value.showStatus
		})
		const parent = computed(() => props.scope.parentRow)
		const disabledFun = optionsDisabled()
		const proverData = (item, a) => {
			// console.log(a)
			return {
				goods: {
					// skuImg:a.mainImg || null
					skuImg: item.skuImg || null
				},
				// skugoods: {
				// 	goodsName: item.goodsName,
				// 	customsWeight: item.customsWeight,
				// 	customsAttribute: item.customsAttribute,
				// 	remark: item.remark,
				// 	purchaseLength: item.purchaseLength,
				// 	purchaseWidth: item.purchaseWidth,
				// 	purchaseHeight: item.purchaseHeight,
				// 	skuId: item.packageSkuId
				// }
			}
		}
		const proverDatas = val => {
			return {
				goods: {
					skuImg: val
				}
			}
		}

		const showAbout = (type, item, fa) => {
			if (type == 1) {
				orderTable.value.showDialog('CustomInfo', '定制信息', '40%', item)
			}
		}

		const showProve = (a, b) => {
			let bole = false
			data.show[a][b] ? (bole = true) : (bole = false)
			return bole
		}

		const getPoverGoods = (item)=>{
			if(item.packageSkuMatch) return [item.packageSkuMatch]
			return  item.packageGoods
 		}


		const list = () => {
			let x = props.scope.row.packageSkus?.filter(v=>v.isShow ==0)
			return x || []
			// return props.scope.row.packageSkus || []
		}

		const isDisabled = type => {
			return disabledFun[type](
				props.scope.row,
				parent.value,
				store.getters.orderType
			)
		}

		const pur = item => {
			let text = ''
			switch (item?.packageGoods[0]?.purchaseStatus) {
				case 0:
					text = '未采购'
					break
				case 1:
					text = '采购在途'
					break
				case 2:
					text = `到货 : ${item?.packageGoods[0]?.actualQuantity}`
			}
			return text
		}

		const getSkuValue = val => {
			if (val) {
				return JSON.parse(val) || []
			} else {
				return []
			}
		}

		const showPur = item => {
			const { orderType } = store.getters
			let bole = true
			let typeList = [1, 2, 3, 4, 5, 6, 7]
			if (typeList.indexOf(Number(orderType)) == -1) {
				bole = false
			} else if (props.scope.parentRow.deductFlag !== 1) bole = false
			return bole
		}

		const showNoMatch = item=>{
			const { orderType } = store.getters
			if(item.quantity <=0) return  false
		 	return (!item.packageGoods ||item.packageGoods.length == 0 ) && orderType == 1
		}

		const showSendGoods = item=>{
			const { orderType } = store.getters
			let bole = true
			let typeList = [1, 2, 3, 4, 5, 6, 7]
			if (typeList.indexOf(Number(orderType)) == -1) bole = false
			return bole
		}

		function showBd(index, row) {
			let bole = false
			if (
				index == row.length - 2 &&
				row[row.length - 1].packageGoods?.length == 0
			)
				bole = true
			if (index == row.length - 1) bole = true
			//  if(row.packageGoods?.length ==0) bole = true

			return bole
		}

		const mouseenter = (skuId, val) => {
			// if (!val) return (data.remark = null)
			// contentBySku({ skuId }).then(res => {
			// 	// console.log(res)
			// 	if (res.code == 200) {
			// 		data.remark = res.data
			// 	}
			// })
		}

		onMounted(() => {})
		return {
			...toRefs(data),
			proverData,
			showAbout,
			isDisabled,
			pur,
			getSkuValue,
			showPur,
			showSendGoods,
			showBd,
			list,
			proverDatas,
			mouseenter,
			showProve,
			showNoMatch,
			getPoverGoods
		}
	}
}
</script>

<style lang="scss" scoped>
.goodsItem {
	padding: 5px 0;
}
.bd {
	border-bottom: 1px solid #ebeef5;
}
.productionDet {
	padding: 6px 12px 6px 12px;
}
.goodsBox {
	display: flex;

	.goodsImg {
		min-width: 70px;
		height: 70px;
		position: relative;
		.gift {
			position: absolute;
			bottom: 0;
			right: 0;
			padding: 2px 3px;
			font-size: 12px;
			background: #fff1f0;
			border: 1px solid #ffa39e;
			color: #ff4d4f;
		}
		img {
			width: auto;
			height: auto;
			max-width: 70px;
			max-height: 70px;
		}

		.tag_no {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 2;
			padding: 2px 5px;
			background: #e6f7ff;
			border: 1px solid #91d5ff;
			font-size: 10px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #1890ff;
		}
	}
	.goodsInfo {
		margin-left: 15px;
		text-align: left;
		.infoTitle {
			font-size: 12px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.85);
		}
		.infoPrice {
			font-size: 12px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.65);
			margin-top: 5px;
		}
	}
}
.infoRight_box {
	display: flex;
	justify-content: flex-end;
}
.infoRight {
	text-align: right;
	.num {
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin-top: 5px;
	}
	.type {
		font-size: 10px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		margin-top: 5px;
	}
}

.sku {
	margin-top: 2px;
	p {
		font-size: 12px;
		color: #9e9e9e;
		i {
			font-size: 14px;
		}
	}
}

.sendGoodsBox{
	width:320px;
	min-height: 100px;
	overflow-y: scroll;
	padding: 5px;
}

.packGoodsItem{
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	.goodsLeft{
		display: flex;
		align-items: flex-start;
		.goodsInfo{
			margin-left: 10px;
		}
	}
	.goodsImg{
		min-width: 70px;
		height: 70px;
		img {
			width: auto;
			height: auto;
			max-width: 70px;
			max-height: 70px;
		}
	}
}


</style>
