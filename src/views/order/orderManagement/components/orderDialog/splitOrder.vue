<!--
 * @Descripttion: 拆分订单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 10:11:19
-->

<template>
	<div>
		<el-dialog
			:title="dialogTitle"
			v-model="dialogVisible"
			:width="width"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div class="splitOrder">
				<p class="title">
					选择要作为新订单的SKU、数量及对应发货商品信息：
				</p>
				<div class="table">
					<el-table
						:data="tableData"
						style="width: 100%"
						@selection-change="handleSelectionChange"
					>
						<!-- <el-table-column type="selection" width="55"> </el-table-column> -->
						<el-table-column
							prop="packageSkuId"
							label="商品信息"
							min-width="350"
						>
							<template #default="scope">
								<div v-if=" list(scope.row).length >0">
									<el-row v-for="(a,b) in list(scope.row)" :key="b" >
									<el-col :span="20">
										<div class="goodsBox">
											<el-popover
												placement="right"
												:width="240"
												trigger="hover"
											>
												<goodsImg
													:data="
														proverData(a.mainImg)
													"
												/>
												<template #reference>
													<div class="goodsImg">
														<img
															:src="
																a.mainImg
															"
															alt=""
															srcset=""
														/>
														<div
															v-if="
																!scope.row
																	.packageGoods
															"
															class="'tag_no'"
														>
															未匹配
														</div>
													</div>
												</template>
											</el-popover>

											<div class="goodsInfo">
												<p class="infoTitle">
													{{a.skuCode }}
												</p>
												<p class="infoPrice">
													USD {{  scope.row.price }}
												</p>
												<!-- <p class="infoPrice">
													{{ a.skuCode }}
												</p> -->
											 <div v-if="getSkuValue(a.skuValue)?.length>0">
												 	<div class="sku" v-for="(item,index) in getSkuValue(a.skuValue)" :key="index">
													<p v-if="!item.speValmainImg"> {{item.spe}}:{{item.speVal}}</p>
													<p v-else> {{item.spe}} :
													 <el-popover placement="right" :width="240" trigger="hover">
														 <goodsImg :data="proverData(item.speValmainImg)" />
														 <template #reference>
														<i class="el-icon-picture"></i>
													 </template>
												 </el-popover>
													 </p>
											</div>
											 </div>

												<p

													v-if="
														scope.row
															.customization == 1
													"
													class="custom"
													>{{
														scope.row
															.customization == 1
															? '定制'
															: '非定制'
													}}</p>
											</div>


										</div>
									</el-col>

									<el-col class="infoRight_box" :span="4">
										<div class="infoRight">
											<p class="num">
												X{{ a.quantity||  a.goodsQuantity }}
											</p>
										</div>
									</el-col>
								</el-row>

								</div>
							</template>
						</el-table-column>

						<el-table-column
							prop="quantity"
							label="拆分"
							min-width="80"
						>
							<template #default="scope">
								<div class="split">
									<el-checkbox
										v-model="scope.row.checked"
										@change="
											() => {
												!scope.row.checked
													? (scope.row.splitNum = 1)
													: ''
											}
										"
									></el-checkbox>
								</div>
							</template>
						</el-table-column>

						<el-table-column
							prop="quantity"
							label="拆分数量"
							width="120"
						>
							<template #default="scope">
								<div class="splitNum" v-if="scope.row.checked">
									<el-input-number
										style="width: 100px"

										controls-position="right"
										v-model="scope.row.splitNum"
										:min="1"
										:max="scope.row.quantity"
										:step="1"
										step-strictly
										placeholder="拆分数量"
										@blur="
											event =>
												event.target.value
													? (scope.row.splitNum =
															event.target.value)
													: (scope.row.splitNum = 1)
										"
									></el-input-number>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<div class="bottom">
					<p>注: </p>
					<p>1、拆分的子订单成本利润会自动统计到主订单中</p>
					<p>2、主订单可继续拆分，子订单不可多次拆分</p>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button
						type="primary"

						@click="dialogHandOk"
						:disabled="isDisable"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import SendGoods from '@/views/order/orderManagement/components/orderTableTd/sendGoods.vue'
import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'

import {
	reactive,
	toRefs,
	getCurrentInstance,
	onMounted,
	watch,
	inject,
	computed
} from 'vue'
import { splitPackages } from '@/api/order/orderManagement.js'
export default {
	components: { SendGoods, goodsImg },
	props: {
		dialog: {
			type: Object,
			default: null
		},
		dialogTitle: {
			type: String,
			default: '提示'
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '30%'
		},
		data: {
			type: Object,
			default: null
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const formOptions = inject('formOptions')
		// 获取的formOptions 组件
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const data = reactive({
			tableData: [
				{
					quantity: 1,
					packageSkuId: 123
				}
			],
			selected: [],
			packageId: null,
			timer: null
		})

		const handleSelectionChange = val => {
			data.selected = val
		}

		const isDisable = computed(() => {
			let bole = true
			let splitAll = []
			for (let i = 0; i < data.tableData.length; i++) {
				var item = data.tableData[i]
				if (item.checked) {
					if (item.splitNum == item.quantity) {
						splitAll.push(item)
					}
					bole = false
				}
			}
			if (splitAll.length == data.tableData.length) {
				return true
			}
			return bole
		})

		const list = item =>{
			if(item.packageSkuMatch ){
				return [item.packageSkuMatch] || []
			}else{
				return item.packageGoods || []
			}

		}

		const dialogHandOk = () => {
			//else if(data.selected.length == data.tableData.length){
			//proxy.$message.error('订单不可全部拆分!')
			//}

			if (data.timer) {
				clearTimeout(data.timer)
			}

			data.timer = setTimeout(() => {
				if (isDisable.value) {
					proxy.$message.error('请勾选需要拆分的商品,最少一个!')
				} else {
					let splitPackagesSkuDTOS = []
					for (let i = 0; i < data.tableData.length; i++) {
						let x = data.tableData[i]

						if (x.checked) {
							let obj = {
								packageId: data.packageId,
								packageSkuId: x.packageSkuId,
								nums:Number( x.splitNum),
								spuName:x.sku
							}

							splitPackagesSkuDTOS.push(obj)
						}
					}

					const splitPackagesDTO = {
						packageId: data.packageId,
						splitPackagesSkuDTOS
					}
					splitPackages(splitPackagesDTO)
						.then(res => {
							if (res.code == 200) {
								proxy.$message.success(res.message)
								formOptions.value.init()
								orderTable.value.getMergeNum()
								cancel()
							}
						})
						.catch(err => {

							formOptions.value.init()
							orderTable.value.getMergeNum()
						})
				}
			}, 1000)
		}

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
		}

		const proverData = item => {
      return {
        goods: {
          skuImg: item
        }
      }
    } //  图片放大

		const bulr = e => {
			console.log(e.target.value)
		}


		const  getSkuValue = val=>{
			if(val) return JSON.parse(val)
 }

		watch(
			() => props.data,
			(a, b) => {
				const { skus, packageId } = a

				data.packageId = packageId
				data.tableData = skus
			}
		)

		onMounted(() => {
			const { skus, packageId } = props.data
			data.packageId = packageId
			let arr = skus.filter(v=>v.packageGoods?.length !== 0)
			// if(index !==-1) skus.splice(index,1)
			data.tableData = arr
			console.log(skus,'splitOrder')
		})
		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			handleSelectionChange,
			proverData,
			isDisable,
			bulr,
			getSkuValue,
			list
		}
	}
}
</script>

<style lang="scss" scoped>
.splitOrder {
	.table {
		min-height: 40vh;
		overflow-y: scroll;
	}
	.bottom {
		padding-top: 15px;
		border-top: 2px dashed #e9e9e9;
		p {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ff3b30;
			line-height: 22px;
		}
	}
	.table::-webkit-scrollbar {
		width: 0 !important;
	}
	.title {
		margin-bottom: 24px;
		font-size: 16px;
		font-family: PingFangSC-Regular, PingFang SC;

		color: rgba(0, 0, 0, 0.85);
	}
}

.goodsBox {
	display: flex;
	align-items: center;
	.goodsImg {
		min-width: 70px;
		height: 70px;
		display: flex;
		align-items: center;
		img {
			width: auto;
			height: auto;
			max-width: 70px;
			max-height: 70px;
		}
		position: relative;
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
		margin-top: 15px;
	}
	.type {
		font-size: 10px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		margin-top: 5px;
	}
}
.sku{
  margin-top: 2px;
  p{
    font-size: 12px;
    color: #9e9e9e;
    i{
      font-size: 14px;
    }
  }
}
.custom{
	color: #1890FF;
}
</style>
