<!--
 * @Descripttion: "出入记录"的详情弹框页面
 * @version: 1.0
 * @Author: zhangzhifang
 * @Date: 2021-07-13 16:58:07
 * @LastEditors: zhangzhifang
 * @LastEditTime: 2021-07-15 09:54:12
-->
<template>
	<div class="headDetails">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!-- 出入记录 -->
			<el-tab-pane label="出入记录" name="first">
				<div class="headOut">
					<span>{{data.inOutRecord.type?'出库':'入库'}}单号:</span>
					<span style="margin-left: 5px">{{ data.serialNumber }}</span>
					<span style="margin-left: 16px">操作时间:</span>
					<span style="margin-left: 5px">{{ data.time }}</span>
					<div style="margin-left:15px">
						<span>供应商:</span>
						<span style="margin-left:5px">{{data.inOutRecord.supplierName||'-'}}</span>
					</div>
				</div>
				<!-- 第二部分 -->
				<div class="headProduct">
					<div class="productName">
						<div style="display:flex;">
							<div><span class="productFont">商品名称:</span> </div>
							<div class="goodsFonts" :title="data.inOutRecord.goodsName">
								<p>{{ data.inOutRecord.goodsName }}</p>
							</div>
						</div>
						<div style="margin-top: 5px">
							<div style="display:flex;">
								<div><span class="productFont">商品规格:</span></div>
								<div class="goodsFonts" :title="data.skuCn">
										{{ data.skuCn?data.skuCn:'-' }}
										<!-- 国码预留 -->
										<span v-if="data.codeVal" style="color:#2fbba6;margin-left:12px">
										国码：{{data.codeVal}}
										</span>
								
								</div>
							</div>
						</div>
						<div  style="padding:5px 0px 0px 5px;display:flex;" >
							<div class="goodsSKU">
								<span class="productFont">SKU ID:</span>
								<span class="goodsSKU" :title="data.inOutRecord.goodsSku">{{data.inOutRecord.goodsSku?data.inOutRecord.goodsSku:'-'}}</span>
							</div>
							<div class="goodsSKU">
								<span style="padding:5px 0px 0px 30px" class="productFont">SKU编码:</span>
								<span :title="data.inOutRecord.skuCode">{{ data.inOutRecord.skuCode?data.inOutRecord.skuCode:'-' }}</span>
							</div>
						</div>
						<p style="margin-top: 5px; margin-left: 28px">
							<span class="productFont">库位:</span><span>{{ data.inOutRecord.storageName }} </span>
						</p>
						<p style="margin-top: 5px; margin-left: 14px">
							<span class="productFont">货架位:</span><span>{{data.shelfGridName?data.areaName+data.shelfGridName:'空'}}</span>
						</p>
						<p style="margin-top: 5px; margin-left: 28px">
							<span class="productFont">类型:</span><span>{{ data.inOutRecord.type?'出库/'+data.inOutRecord.typeDetailMsg:'入库/'+data.inOutRecord.typeDetailMsg }}</span>
						</p>
					</div>
					<div class="productImg">
						<el-image style="width: 100px; height: 100px" :src="data.skuImage" fit="contain" />
					</div>
				</div>
				<!-- 第三部分详情 -->
				<div class="headTable">
					<div class="detailsTable"><span>详情:</span></div>
					<div style="margin-top: 16px; margin-left: 8px; width: 680px">
						<el-table :data="data.inOutRecord.list" border style="width: 100%" :header-cell-style="{
                background: '#FAFAFA',
                color: '#606266'
              }">
							<!-- <el-table-column
                label="原库存"
                align="center"
                width="80px"
                prop="originalStock"
              /> -->
							<el-table-column label="变动" align="center" width="150px" prop="numbers">
								<template #default="scope">
									<div>
										<p v-if="!data.inOutRecord.type " style="color: #ff4d4f">
											+{{ scope.row.numbers }}
										</p>
										<p v-else style="color: #52c41a">
											-{{ scope.row.numbers }}
										</p>
									</div>
								</template>
							</el-table-column>
							<!-- <el-table-column
                label="新库存"
                align="center"
                width="80px"
                prop="newStock"
              /> -->
							<el-table-column label="出/入库价(CNY)" align="center" prop="price">
								<template #default="scope">
									<div>{{scope.row.price?scope.row.price:'-'}}</div>
								</template>
							</el-table-column>
							<!-- <el-table-column
                label="入库价(CNY)"
                align="center"
                prop="inStoragePrice"
              >
               <template #default="scope">
                <div>-</div>
                 </template>
              </el-table-column>
              <el-table-column
                label="新单价(CNY)"
                align="center"
                prop="newPrice"
              >
               <template #default="scope">
                <div>-</div>
                 </template>
              </el-table-column> -->
							<el-table-column label="操作人" align="center" prop="operateUser" />
						</el-table>
					</div>
				</div>
				<!-- 第四部分 -->
				<div class="additional">
					<div class="additionalOne">
						<span>附加信息:</span>
					</div>
					<div class="additionalTwo">
						<span class="addBorder" v-for="item in data.inOutRecord.addional" :key="item">{{ item }}</span>

					</div>
				</div>
				<div class="additionalThree">
					<div class="storeInt">
						<span>{{data.inOutRecord.type?'出库':'入库'}}备注:</span>
					</div>
					<div class="additionalFour">{{ data.inOutRecord.remark }}</div>
				</div>
			</el-tab-pane>
			<!-- 收货质检 -->
			<el-tab-pane label="收货质检" name="second" v-if="!data.inOutRecord.type">
				<!-- 第一部分 -->
				<div class="headOut">
					<span>{{data.inOutRecord.type?'出库':'入库'}}单号:</span>
					<span style="margin-left: 5px">{{ data.serialNumber }}</span>
					<span style="margin-left: 16px">操作时间:</span>
					<span style="margin-left: 5px">{{ data.time }}</span>
				</div>
				<!-- 第二部分 -->
				<div class="headTable">
					<div class="detailsTables"><span>收货信息:</span></div>
					<div style="margin-top: 16px; margin-left: 8px; width: 680px">
						<el-table :data="
                data.receiveCheck.receiveInfo
                  ? data.receiveCheck.receiveInfo
                  : []
              " border style="width: 100%" :header-cell-style="{
                background: '#FAFAFA',
                color: '#606266'
              }">
							<el-table-column label="采购单号" align="center" width="140px" prop="purchaseNumber" />
							<el-table-column label="物流单号" align="center" width="140px" prop="trackNumber" />
							<el-table-column label="数量" align="center" width="80px" prop="num" />
							<el-table-column label="时间" align="center" prop="time">
							</el-table-column>
							<el-table-column label="收货员" align="center" prop="receiver" />
						</el-table>
					</div>
				</div>
				<!-- 第三部分 -->
				<div class="headTable">
					<div class="detailsTables"><span>质检信息:</span></div>
					<div style="margin-top: 16px; margin-left: 8px; width: 680px">
						<el-table :data="data.receiveCheck.checkInfo" border style="width: 100%" :header-cell-style="{
                background: '#FAFAFA',
                color: '#606266'
              }">
							<el-table-column label="需检数" align="center" width="80px" prop="needInspect" />
							<el-table-column label="合格数" align="center" width="80px" prop="qualified" />
							<el-table-column label="不合格数" align="center" width="80px" prop="unqualified" />
							<el-table-column label="质检结果" width="80px" align="center" prop="result">
							</el-table-column>
							<el-table-column label="时间" align="center" prop="time">
							</el-table-column>
							<el-table-column label="质检员" align="center" prop="inspector" />
						</el-table>
						<div style="display: flex; height: 80px">
							<!-- <span>质检备注:</span>
              <span style="border:1px solid #e8e8e8;width:100%"></span> -->
							<div class="cheackQulity remarks">质检备注:</div>
							<div style="width: 100%; border-top: 0; border-left: 0" class="cheackQulity">
								{{ data.receiveCheck.remark }}
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import { reactive, toRefs } from 'vue'
	import { onMounted } from 'vue'
	import {
		comeDetails, //出入记录详情查询
	} from '@/api/store.js'
	export default {
		props: {
			rowId: {
				type: String,
				default: String
			}
		},
		setup(props) {
			const rowId = props.rowId
			const state = reactive({
				activeName: 'first',
				data: {
					inOutRecord: {},
					receiveCheck: {}
				}
			})
			// 上方的tab切换
			const handleClick = (tab, event) => {
				// console.log(tab, event)
			}
			onMounted(() => {
				init()
			})
			//页面一进去时候渲染数据
			const init = () => {
				let params = {
					serialNumber: rowId
				}
				comeDetails(params).then(res => {
					if (res.code == 200) {
						if (res.data) {
							//处理规格值
							if (res.data.skuValue?.length) {
								res.data.skuCn = JSON.parse(res.data.skuValue).map(s => s.speVal).join('-')
							}
							res.data.inOutRecord.typeDetailMsg = res.data.inOutRecord.typeDetailMsg ? res.data.inOutRecord.typeDetailMsg : '-'
							state.data = res.data
						}

						console.log(state.data, 5555)
					}
				})
			}

			return { ...toRefs(state), handleClick, rowId }
		}
	}
</script>
<style scoped lang="scss">
.headDetails {
	:deep(.el-tabs__item) {
		font-size: 16px;
	}
	.headOut {
		font-size: 16px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
		line-height: 40px;
		border-bottom: 1px dashed #eeeeee;
	}
	.headProduct {
		padding: 15px 0 16px 0px;
		position: relative;
		border-bottom: 1px dashed #eeeeee;
	}
	.headDetails .headProduct {
		display: flex;
	}
	.productImg {
		position: absolute;
		right: 10px;
		top: 15%;
	}
	.productFont {
		font-weight: 600;
		margin-right: 5px;
	}
	.headTable {
		display: flex;
	}
	.detailsTable {
		margin-left: 30px;
		margin-top: 16px;
		font-weight: 600;
	}
	.detailsTables {
		margin-left: 10px;
		margin-top: 16px;
		font-weight: 500;
	}
	.additional {
		display: flex;
		margin-top: 25px;
	}
	.additionalOne {
		margin-left: 2px;
		font-weight: 600;
	}
	.storeInt {
		margin-top: 25px;
		font-weight: 600;
		margin-left: 2px;
	}
	.additionalTwo {
		width: 680px;
		height: 80px;
		line-height: 20px;
		background: #fafafa;
		/* text-align: center; */
		margin-left: 10px;
		border: 1px solid #e8e8e8;
		// display: flex;
		// grid-template-columns: repeat(4, 1fr);
	}
	.addBorder {
		/* border-right: 1px solid #e8e8e8; */
		margin-left: 10px;
	}
	.additionalThree {
		display: flex;
	}
	.additionalFour {
		width: 680px;
		height: 79px;
		background: #ffffff;
		border-radius: 2px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		margin-left: 10px;
		margin-top: 25px;
	}
	.cheackQulity {
		// text-align: center;
		// line-height: 50px;
		height: 80px;
		border: 1px solid #e8e8e8;
	}
	.remarks {
		width: 92px;
		border-top: 0;
		line-height: 80px;
		font-weight: 600;
		background: #fafafa;
		text-align: center;
	}
	.goodsFonts {
		width: 500px;
		p {
			overflow: hidden; /*内容超出后隐藏*/
			text-overflow: ellipsis; /*超出内容显示为省略号*/
			white-space: nowrap; /*文本不进行换行*/
		}
	}
	.goodsSKU {
		width: 250px;
		overflow: hidden; /*内容超出后隐藏*/
		text-overflow: ellipsis; /*超出内容显示为省略号*/
		white-space: nowrap; /*文本不进行换行*/
	}
}
</style>
