<template>
	<div class="container">
		<div>
			<div v-permission="'outStock:btn:cancelRemark'" class="btns btnList" v-if="status === '1' && tabPosition ===2">
				<el-button type="primary" @click="cancelRemark(marksListDataSelect)">批量取消标记</el-button>
			</div>
			<div class="btns" v-else>
				<BtnCom :btnType="tabPosition === 1 ? 'outStockBtnOne' : 'outStockBtnTwo'" :status="status" class="btnList" @openDialog="openDialog" @next="next" @refreshList="emits('refreshList')" :selectedList="selectedList" :dataList="dataList" />
			</div>
		</div>

		<!--		按钮-->

		<div class="tables">
			<div class="tab">
				<el-radio-group v-model="tabPosition" style="margin-bottom: 15px" @change="changeType">
					<el-radio-button :label="1">正常采购 </el-radio-button>
					<el-radio-button :label="2" v-show="status === '1'">今日标记 </el-radio-button>
					<el-radio-button :label="0">搁置中</el-radio-button>
				</el-radio-group>
			</div>
			<div class="table" v-show="status === '1' && tabPosition ===2">
				<!-- 今日标记数据 -->
				<vxe-table border align="center" :loading= "loading"  ref="todayMark" :checkbox-config="{}" :data="marksListData" @checkbox-all="marksCheckboxAll" @checkbox-change="marksCheckboxChange">
					<vxe-column type="checkbox" width="50"></vxe-column>
					<vxe-column title="商品信息">
						<template #default="{ row }">
							<div class="goodsInfoContainer">
								<div class="goodsImageContainer">
									<el-popover placement="right-start" trigger="hover" width="auto">
										<el-image
											style="width: 200px; height: 200px"
											:src="row.mainImg"
											fit="contain"
										></el-image>
										<template #reference>
											<el-image
												class="ml-10"
												style="width: 70px; height: 70px"
												:src="row.mainImg"
												fit="contain"
											></el-image>
										</template>
									</el-popover>
								</div>
								<div class="goodsInfoContent" style="text-align:left;">
									<el-tooltip placement="top">
										<template #content>
											<p style="cursor: pointer" v-copy="row.skuCode">
												复制
											</p>
										</template>
										<p style="max-width:295px;" :title="row.skuCode" class="pClass">
												{{ row.skuCode }}
										</p>
									</el-tooltip>
									<p>&yen; {{(row.purchasePrice-0).toFixed(2) || '-'}}</p>
									<p v-if="row.skuValue">
										<span v-for="item in JSON.parse(row.skuValue)" :key="item.spe">{{item.spe}}：{{item.speVal}}&nbsp;&nbsp;</span>
									</p>
								</div>
							</div>
						</template>
					</vxe-column>
					<vxe-column field="orderId" title="订单号" width="180">
							<template #default="{row}">
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.orderId">复制</p>
                </template>
                <p>{{ row.orderId }} </p>
              </el-tooltip>
            </template>
					</vxe-column>
					<vxe-column field="payTime" title="付款时间" width="100">
					</vxe-column>
					<vxe-column field="goodsQuantity" title="数量" width="80">
					</vxe-column>
					<vxe-column field="categoryName" title="品类" width="180">
					</vxe-column>
					<vxe-column title="定制属性" align="center" width="300">
            <template #default="{row}">
              <el-popover placement="left-end" trigger="hover" width="auto">
                <div>
									<div class="customValueList" v-for="(v,i) in row.customValue" :key="i" >
										<p v-if="v.type == 'upload_img' || v.type == 'img_options' || v.type == 'img' || v.value?.indexOf('http://') != -1 || v.value?.indexOf('https://') != -1" >
											{{v.field}}：
											<el-popover placement="right-start" trigger="hover" width="auto">
												<el-image
													style="width: 200px; height: 200px"
													:src="v.value"
													fit="contain"
												></el-image>
												<template #reference>
													<el-icon style="font-size: 20px;position: relative;top: 3px;"><PictureFilled /></el-icon>
												</template>
											</el-popover>
										</p>
										<p v-else>{{v.field}}：{{v.value}}</p>
										&nbsp;&nbsp;
									</div>
								</div>
                <template #reference>
								<div class="customValueContainer">
									<div class="customValueList" v-for="(v,i) in row.customValue" :key="i" >
										<span v-if="v.type == 'upload_img' || v.type == 'img_options' || v.type == 'img' || v.value?.indexOf('http://') != -1 || v.value?.indexOf('https://') != -1" >
											{{v.field}}：
											<el-popover placement="right-start" trigger="hover" width="auto">
												<el-image
													style="width: 200px; height: 200px"
													:src="v.value"
													fit="contain"
												></el-image>
												<template #reference>
													<el-icon style="font-size: 20px;position: relative;top: 3px;"><PictureFilled /></el-icon>
												</template>
											</el-popover>
										</span>
										<span v-else>{{v.field}}：{{v.value}}</span>
										&nbsp;&nbsp;
									</div>
								</div>
                </template>
              </el-popover>
            </template>
          </vxe-column>
					<vxe-column title="操作人" width="100">
						<template #default="{ row }">
							<p>{{ row.createUserName || '-' }}</p>
							<p>{{ row.createTime || '-' }}</p>
						</template>
					</vxe-column>
					<vxe-column title="操作" width="120">
						<template #default="{ row }">
							<p><el-button type="text" @click="queryInfomationFn(row)">查看定制信息</el-button></p>
							<p v-permission="'outStock:btn:cancelRemark'"><el-button type="text" @click="cancelRemark([row])">取消标记</el-button></p>
						</template>
					</vxe-column>
				</vxe-table>
			</div>
			<div class="table" v-show="!(status === '1' && tabPosition ===2)">
				<vxe-table border align="center" :loading= "loading"  ref="xTable1" :checkbox-config="{}" @checkbox-all="checkboxAll" @checkbox-change="checkboxChange" :treeConfig="{ children: 'skuList', indent: 0, expandAll: true }" :scroll-y="{ enabled: false}" :span-method="colSpanMethod" :cell-style="cellStyle">
					<vxe-column type="checkbox" width="50"></vxe-column>
					<vxe-column field="goodsId" width="340">
						<template #header>
							<p>商品信息</p>
							<p>【采购报价/上次采购价/平均采购价】</p>
						</template>
						<template #default="{ row }">
							<div v-if="row.skuList" class="header">
								<div class="headerInfo goDetail textOverflow" :title="row.goodsName" @click="goDetail(row.goodsId)">
									<el-tooltip placement="top" :offset="10">
										<template #content>
											<span style="color: #fff" v-copy="row.goodsId">复制</span>
										</template>
										<span>【{{ row?.goodsId }}】</span>
									</el-tooltip>
                  <el-tooltip placement="top" :offset="10">
										<template #content>
											<span style="color: #fff" v-copy="row.goodsName">复制</span>
										</template>
										<span>【{{ row?.goodsName }}】</span>
									</el-tooltip>
								</div>
								<div>
                  <el-popover placement="top" :width="800" trigger="hover" v-for="(item, index) in row.remarkList" :key="index" @after-enter="getRemarkDetail(row.goodsId, item.id)">
                    <el-table :data="remarkInfo" :header-cell-style="{ background: '#F5F7FA', color: '#000', 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" fit>
                      <el-table-column min-width="300" property="remark" label="内容"></el-table-column>
                      <el-table-column width="170" property="createTime" label="时间"></el-table-column>
                      <el-table-column width="90" property="remarkTypeName" label="类型"></el-table-column>
                      <el-table-column width="80" property="createUserName" label="操作人"></el-table-column>
                      <el-table-column prop="options" label="操作" align="center" >
                        <template #default="scope">
                          <div class="options">
                            <el-button type="text"  @click='v => editSpuRemark(row, scope.row)' :disabled='showOptions(scope.row)'>编辑</el-button>
                            <el-button type="text"  style="color:red; margin-left: 0" @click="del(scope.row)" :disabled='showOptions(scope.row)'>删除</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <template #reference>
                      <el-tag class="tag" :key="index" :color="item.color" style="color: white">{{ item.word }}</el-tag>
                    </template>
                  </el-popover>
                </div>
								<div class="headerInfo right">
									<span>SKU种类： {{ row?.skuList?.length || 0 }} </span><span> 商品总数：{{ getTypeNum(row) }}</span>
									<span v-if="status === '1'">
										&nbsp;&nbsp;&nbsp;
										<el-button
											v-permission="'outStock:btn:queryOrderInfo'"
											@click="queryOrderDetail(row)"
											type="text"
											>查看订单信息</el-button
										>
									</span>
								</div>
							</div>
							<div class="goods" v-else>
								<el-popover placement="right-start" trigger="hover" width="auto">
									<el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
									<template #reference>
										<el-image style="width: 67px; height: 67px" :src="row.mainImg" fit="contain"></el-image>
									</template>
								</el-popover>

								<div class="goodsInfo" style="line-height: 18px;">
								<div class="infoName" :title="row.skuCode">
									{{ row.skuCode }}
									</div>

									<div class="skus over">
										<p :title='getRowSku(row.skuValue)'> {{getRowSku(row.skuValue)}}</p>
									</div>
									<!-- 国码预留 -->
									<div v-if="row.codeVal" style="color:#2fbba6;font-size:12px">
										国码：{{row.codeVal}}
									</div>
									<div class="infoSku over" :title="'['+changePrice(row.purchasePrice)+'/'+	changePrice(row.lastPurchasePrice)+'/'+ changePrice(row.avgPurchasePrice)+ ']' ">
										<p> [{{ changePrice(row.purchasePrice) }}/{{
											 changePrice(row.lastPurchasePrice)
										 }}/{{ changePrice(row.avgPurchasePrice) }}]</p>
									</div>
									<div class="infoSku">
										{{ row.warehouseName }}
										<div v-for="(item, index) in row.remarkAggregationList" :key="index">
											<el-popover placement="top-start" trigger="hover" :width="800">
												<RemarkItem :query="{ item }" @refresh="changeType" @editRemark="v => editRemark(row, v)" />
												<template #reference>
													<el-tag class="tag" :key="index" :color="item.color" style="color: white">{{ item.word }}</el-tag>
												</template>
											</el-popover>
										</div>
									</div>
								</div>
							</div>
						</template>
					</vxe-column>

					<vxe-column field="supplierId" title="供应商" width="200">
						<template #default="{ row }">
							<div class="supplier">
								<p v-if="row.supplierName" :title='row.supplierName'>{{ row.supplierName?.length >10 ? row.supplierName.slice(0,10)+'...' : row.supplierName }}</p>
								<p v-if="!row.supplierName">无供应商</p>
								<el-button v-if="!row.supplierName" type="text" @click="setSuplierFun(row)" v-permission="'outStock:btn:supplier'">
									设置供应商
								</el-button>
								<p>
									<a class="a" :href="row.partnerType === 2 ? row.storeHomePage : null" target="_blank">{{ row.partnerTypeName }}</a>
								</p>



								<el-popover v-if="testPairInfo(row)" placement="right-start" trigger="hover" width="auto">
									<div class="pairInfo">
										<div class="img">
											<el-image :src="jsonData(row.pairInfo).img" style="width: 200px; height: 200px" fit="contain"></el-image>
										</div>

										<div class="info">
											<p class="title">{{ jsonData(row.pairInfo).name }}</p>
											<p class="sku">
												<span v-for="a in jsonData(row.pairInfo).speInfo" :key="a.spe">{{ a.spe ? a.spe + ':' : '' }}{{ a.speVal }}
												</span>
											</p>
											<p class="price">
												￥{{ jsonData(row.pairInfo).price || '-' }}
											</p>
										</div>
									</div>

									<template #reference>
										<el-button type="text" @click="match(row)" v-permission="'outStock:btn:supplier'">1688商品信息
										</el-button>
									</template>
								</el-popover>
								<el-button type="text" @click="match(row)" v-if="!row.pairInfo && row.partnerType === 2" v-permission="'outStock:btn:supplier'">未配对
								</el-button>
								<!-- <el-button type="text" @click="match(row)" v-permission="'outStock:btn:supplier'" v-else-if="row.pairInfo && row.partnerType === 2">未配对
								</el-button> -->
							</div>
						</template>
					</vxe-column>

					<vxe-colgroup title="基础数据">
						<vxe-column field="stockInWarehouse" title="在仓库存" width="90">
							<template #default="{ row }">
								<span>{{ row.stockInWarehouse }}</span>
							</template>
						</vxe-column>
						<vxe-column field="stockOnPassage" title="在途库存" width="90">
							<template #default="{ row }">
								<span class="a" v-if="status === '1'">{{ row.stockOnPassage }}</span>
								<el-popover v-else placement="right-start" trigger="hover" width="auto">
									<div style="width: 120px">
										<div class="normalItem">
											<div class="item" style="width: 120px">
												<span>多发</span>
												<span>({{ row.addStockOnPassage }})</span>
											</div>
											<div class="item" style="width: 120px">
												<span>备货 </span>
												<span>({{ row.planStockOnPassage }})</span>
											</div>
											<div class="item" style="width: 120px">
												<span>缺货 </span>
												<span>({{ row.outStockOnPassage }})</span>
											</div>
										</div>
									</div>
									<template #reference>
										<span class="a">{{ row.stockOnPassage }}</span>
									</template>
								</el-popover>
							</template>
						</vxe-column>
						<vxe-column field="normalQuantity" title="正常订单" width="90">
							<template #default="{ row }">
								<el-popover placement="right-start" trigger="hover" width="auto">
									<div style="width: 250px">
										<div class="normalOrder">
											正常订单({{ row.normalQuantity }})
										</div>
										<div class="normalItem pointer">
											<div class="item hover" @click="goOrder(999, row, status)">
												<span>全部订单 </span>
												<span>({{
														row.pendingProcessQuantity +
														row.waybillApplyQuantity +
														row.waybillSuccessQuantity +
														row.waybillFailQuantity +
														row.pendingOrderQuantity +
														row.inStockGoodsQuantity +
														row.pendingDeliverGoodsQuantity
													}})</span>
											</div>
											<div class="item hover" @click="goOrder(1, row, status)">
												<span>待处理 </span>
												<span>({{ row.pendingProcessQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(2, row, status)">
												<span>运单号申请中 </span>
												<span>({{ row.waybillApplyQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(4, row, status)">
												<span>运单号申请成功 </span>
												<span>({{ row.waybillSuccessQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(3, row, status)">
												<span>运单号申请失败 </span>
												<span>({{ row.waybillFailQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(6, row, status)">
												<span>待打单-缺货</span>
												<span>({{ row.pendingOrderQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(5, row, status)">
												<span>待打单-有货</span>
												<span>({{ row.inStockGoodsQuantity }})</span>
											</div>
											<div class="item hover" @click="goOrder(7, row, status)">
												<span>待发货</span>
												<span>({{ row.pendingDeliverGoodsQuantity }})</span>
											</div>
										</div>
									</div>
									<template #reference>
										<span class="a">{{ row.normalQuantity }}</span>
									</template>
								</el-popover>
							</template>
						</vxe-column>
						<vxe-column field="shelveQuantity" title="搁置订单" width="90">
							<template #default="{ row }">
								<span style="color: #1e93ff; cursor: pointer" @click="goOrder(10, row, status)">{{ row.shelveQuantity }}</span>
							</template>
						</vxe-column>
					</vxe-colgroup>

					<vxe-colgroup title="销量">
						<vxe-column field="threeTotalSales" title="3/7/15/30 " width="120">
							<template #default="{ row }">
								<span :style="row.threeTotalSales > 30 ? 'color:red' : ''">{{ row.threeTotalSales || '-' }}/</span>
								<span :style="row.sevenTotalSales > 30 ? 'color:red' : ''">{{ row.sevenTotalSales || '-' }}/</span>
								<span :style="row.fifteenTotalSales > 30 ? 'color:red' : ''">
									{{ row.fifteenTotalSales || '-' }}/</span>
								<span :style="row.thirtyTotalSales > 30 ? 'color:red' : ''">
									{{ row.thirtyTotalSales || '-' }}</span>
							</template>
						</vxe-column>
						<vxe-column field="sevenAverageSales" title="7日均销 " width="100">
							<template #default="{ row }">
								<span :style="row.sevenAverageSales > 30 ? 'color:red' : ''">{{
										row.sevenAverageSales || '-'
									}}</span>
							</template>
						</vxe-column>
					</vxe-colgroup>

					<vxe-colgroup title="建议采购" v-if="tabPosition == 1">
						<vxe-column field="suggestQuantity" title="采购数量" min-width="100">
							<template #default="{ row }">
								<div>
									<p :style="row.suggestQuantity > 30 ? 'color :red' : ''">
										{{ row.suggestQuantity }}
									</p>
									<vxe-input v-if="status != '1'" type="number" v-model="row.editPurNum" :max="row.suggestQuantity" :min="1" align="center" @blur="v => (!v.value ? (row.editPurNum = 1) : '')"></vxe-input>
								</div>
							</template>
						</vxe-column>
					</vxe-colgroup>

					<vxe-column v-else field="suggestQuantity" title="建议采购" width="100">
						<template #default="{ row }">
							<p :style="row.suggestQuantity > 30 ? 'color :red' : ''">
								{{ row.suggestQuantity }}
							</p>
						</template>
					</vxe-column>

					<vxe-column field="offerPurchaseUserName " title="报价人" width="80">
						<template #default="{ row }">
							{{ row.offerPurchaseUserName || '-' }}
						</template>
					</vxe-column>

					<vxe-column field="purchaseUserName" title="采购员" width="80">
						<template #default="{ row }">
							{{ row.purchaseUserName || '-' }}
						</template>
					</vxe-column>

					<vxe-column field="options" title="操作" min-width="120px">
						<template #default="{ row }">
							<div class="options" v-if="tabPosition == 1">
								<el-button type="text" @click="addPlan(row)" :disabled="!row.supplierId" v-permission="'outStock:btn:batch:addPurchasePlan'">加入采购计划
								</el-button>
								<el-button type="text" @click="setShelve(row)" v-permission="'outStock:btn:batch:shelve'">移入搁置
								</el-button>
								<el-button type="text" @click="setSuplierFun(row)" v-permission="'outStock:btn:supplier'">
									{{ row.supplierId ? '更换供应商' : '设置供应商' }}
								</el-button>
							</div>
							<div v-else>
								<p :title="row.statusDesc">
									{{
										row.statusDesc?.length > 10
											? row.statusDesc.slice(0, 10) + '...'
											: row.statusDesc
									}}
								</p>
								<el-button type="text" @click="removeSh(row)" v-permission="'outStockShelve:btn:reductionAll'">还原
								</el-button>
							</div>
						</template>
					</vxe-column>
				</vxe-table>
			</div>
		</div>
		<!--		table-->


		<ErpFooter v-if="status === '1' && tabPosition ===2">
			<div class="footer">
				<div class="left-box">
					<div>已选{{marksListDataSelect.length}}条</div>
					<div style="margin-left: 35px" v-permission="'outStock:btn:cancelRemark'">
						<el-button type="primary" @click="cancelRemark(marksListDataSelect)">批量取消标记</el-button>
					</div>
				</div>
				<div class="right-box">
          <el-pagination :total="marksListTotal" :current-page="pages.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,30,50,100,200]" layout="total, sizes, prev, pager, next, jumper" :page-size ="pages.pageSize"></el-pagination>
        </div>
			</div>
		</ErpFooter>
		<ErpFooter v-else>
			<div class="footer">
				<div class="left-box" v-if="tabPosition === 1">
					<div>已选{{ selectedList?.length || 0 }}条</div>
					<div style="margin-left: 35px">
						<el-button @click="setShelve()" v-permission="'outStock:btn:batch:shelve'">移入搁置</el-button>
						<el-button type="primary" @click="setPlan" v-permission="'outStock:btn:batch:addPurchasePlan'">加入采购计划
						</el-button>
						<el-button type="primary" @click="createPurOrder" v-permission="'outStock:btn:createPurOrder'">生成采购单
						</el-button>
						<el-button  type="primary" @click="setSuplierAll" v-permission="'outStock:btn:supplier'">
							设置供应商
						</el-button>
						<el-button v-permission="'outStock:btn:remarkNor'" type="primary" @click="remarkList" v-if="status === '1'">
							标记普货
						</el-button>
					</div>
				</div>
				<div class="left-box" v-if="tabPosition === 0">
					<div>已选{{ selectedList?.length || 0 }}条</div>
				</div>
				<div class="right-box">
          <el-pagination :total="total" :current-page="page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20,30,50,100,200]" layout="total, sizes, prev, pager, next, jumper" :page-size ="page.pageSize"></el-pagination>
        </div>
			</div>
		</ErpFooter>

		<div v-if="queryShow">
			<QueryCustom :data="queryData" @queryBack="queryCallBack"></QueryCustom>
		</div>
		<component :is="comp[componentUrl]" :data="queryData" v-if="dialogVisible" @cancel="dialogVisible = false" :status="status" @ok="comOk" :query="comQuery" />
	</div>
</template>

<script setup>
	import { ElMessage ,ElMessageBox} from 'element-plus'
	import BtnCom from './btnsCom.vue'
	import MatchGoods from '../../components/matchGoods.vue'
	import QueryCustom from '../dialog/queryCustom.vue'
	import Shelve from '../dialog/shelve.vue'
	import Remark from '../dialog/remarks.vue'
  import SpuRemark from '../dialog/spuRemark.vue'
	import ExportOrder from '../dialog/exportOrder.vue'
	import SetSuplier from '../dialog/setSuplier.vue'
	import RemarkItem from '../components/remarkItem'
	import ErpFooter from '@/components/erpFooter/index.vue'
	import { addOrUpdate, direct, taggedList } from '@/api/purchase/outOfStock.js'
	import { tagged } from '../../customOder/composables/api'
	import { goodsCheck } from '@/api/goods/rules.js'
	import { confirm } from '../../../../../utils/tool'
  import { getRemarkList, delRemark } from '@/api/order/orderManagement.js'
  import { storage } from '@/utils/storage'
	import {useRoute} from 'vue-router'
	import { cancelBatch } from '@/views/purchase/purchaseManagement/customOder/composables/api'
	import { PictureFilled } from '@element-plus/icons-vue'
	import {
		pairMatch,
		removeShelve,
		changePrice,
		testPairInfo
	} from '../hooks/hooks'
	import {
		onMounted,
		reactive,
		toRefs,
		ref,
		nextTick,
		defineProps,
		defineEmits,
		watch,
		defineExpose,
		computed,
		onActivated
	} from 'vue'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { deepCopy } from '../../../../../utils/tool'
const route = useRoute()
	const comp = {
		MatchGoods,
		Shelve,
		Remark,
		ExportOrder,
		SetSuplier,
    SpuRemark,
		QueryCustom
	}
	const router = useRouter()
	const store = useStore()
	const props = defineProps({
		dataList: Array,
		total: Number,
    loading: Boolean,
    page: Object,
    searchParams: Object,
		status:{
			type:String,
			default:'0' // 0普通商品 1定制商品
		},
		searchMarks:Object,
		tabPositions:{
			type:Number,
			default:1
		}
	})
	const emits = defineEmits(['emitSelected', 'refresh', 'detail', 'refreshList','remarkType'])
	const data = reactive({
    pageSize: 20,
		tabPosition: props.tabPositions,
		dialogVisible: false,
		tableList: [],
		tableCheckdAll: false,
		componentUrl: null,
		comQuery: null, // 组件传参
		selectedList: [], //选中项
    remarkInfo: [],
		marksListData:[],
		marksListDataSelect:[],
		pages: {
			pageNo: 1,
			pageSize: 20
		},
		marksListTotal:0,
		queryShow:false,
		queryData:null
	})

	// query custom order detail
	function queryOrderDetail(row){
		let idList = []
		let skuIdList = []
		row.skuList.forEach(v=>{
			idList = [...idList,...v.idList]
			skuIdList.push(v.skuId)
		})
		// tabPosition
		router.push({
      // name: 'CustomOder',
			path: '/purchase/purchaseManagement/customOder/index',
      query: {
        id: row.goodsId,
				type:1,
				tabPosition:data.tabPosition,
				idList:idList.join(','),
				skuIdList:skuIdList.join(',')
      }
    })
	}

	// query goods infomation dialog callBack
	function queryCallBack(val){
		console.log(val)
		data.queryShow = false
		if(val) getTodayMarkList()
	}

	// query goods infomation dialog
	function queryInfomationFn(val){
		data.queryData = val
		data.queryShow = true
	}



	function cancelRemark(list){
		if(!list.length) return ElMessage.error('请勾选SKU!')
		ElMessageBox.confirm('确认取消标记？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
				"close-on-click-modal":false,
				"close-on-press-escape":false
      })
        .then(() => {
          const ids = list.map(v=>v.id)
					cancelBatch({list:ids})
						.then(res=>{
							if(res.code == 200){
								ElMessage.success({ message: '取消标记成功' })
								getTodayMarkList()
							}else{
								ElMessage.warning({ message: res.message })
							}
						})
        })
        .catch(() => {})

	}
	// const todayMark = ref(null)

	function marksCheckboxAll(){
		data.marksListDataSelect = todayMark.value.getCheckboxRecords(true)
	}

	function marksCheckboxChange(){
		data.marksListDataSelect = todayMark.value.getCheckboxRecords(true)
	}



	const {
		tabPosition,
		dialogVisible,
		tableList,
		componentUrl,
		comQuery,
		selectedList,
		tableCheckdAll,
    pageSize,
    remarkInfo,
		marksListData,
		pages,
		marksListTotal,
		queryShow,
		queryData,
		marksListDataSelect
	} = toRefs(data)
	const xTable1 = ref(null)
	const todayMark = ref(null)
// render marks list data in page todayMark
	function getTodayMarkList(val){
		// 获取 今日标记 列表数据
		const param = val ? val : {...props.searchMarks,page:data.pages}
		taggedList(param)
		 .then(res=>{
			 store.dispatch('purchaseSearch/setCustomRemarkFormActions', props.searchMarks)
			//  subOptions
			 res.data.dataList.forEach(v=>{
				 let arr = []
				 const customValue = v.customValue ? JSON.parse(v.customValue) : []
				 customValue.forEach(val=>{
					 arr.push(val)
					 if(val.subOptions) arr = [...arr,...val.subOptions]
				 })
					v.customValue = arr
			 })
			 data.marksListData = res.data.dataList
			 todayMark.value.reloadData(res.data.dataList)
			 data.marksListTotal = res.data.page.totalCount
			 changeTypeFn(4,param)
		 })
	}
	let matchInfo = null // 配对id
	defineExpose({
		tabPosition,
		xTable1,
		selectedList,
		refresh,
		clearSelected,
		getTodayMarkList,
		todayMark,
	})
	watch(
		() => props.dataList,
		a => {
			if(props.status !== '1' || data.tabPosition !==2){
				xTable1.value.reloadData(props.dataList)
			}
		},
	)


	const tableIndeter = computed(() => {
		let checkedList = props.dataList.filter(v => {
			return v.type === 'ch' && v.checked
		})
		let chList = props.dataList.filter(v => v.type === 'ch')
		if (checkedList.length > 0 && checkedList.length < chList.length) {
			return true
		} else {
			return false
		}
	})
	function handleSizeChange(v) {
    props.page.pageSize = v
		refresh()
	}
	function handleCurrentChange(v) {
    props.page.pageNo = v
		refresh()
	}
	function jsonData(info) {
		if (info) return JSON.parse(info)
		return Object
	} // 格式化pairInfo

	function colSpanMethod({ row, $columnIndex }) {
		if (row.skuList?.length) {
			if ($columnIndex == 0) {
				return { rowspan: 1, colspan: 1 }
			} else if ($columnIndex == 1) {
				return { rowspan: 1, colspan: 12 }
			} else {
				return { rowspan: 0, colspan: 0 }
			}
		} // 合并单元格方法
	}
	function cellStyle({ row, column }) {
		if (row.skuList) return { backgroundColor: '#FAFAFA' }
	} //单元格样式

	function load() {
		const $table = xTable1.value
		if ($table) {
			$table.loadData(props.dataList)
		}
	}

	function getTypeNum(row) {
		let num = 0
		if (row?.skuList) {
			row.skuList.map(item => {
				if (item.suggestQuantity) num += item.suggestQuantity || 0
			})
		}
		return num
	} // 获取种类数量

	function checkboxAll() {
		let rows = xTable1.value.getCheckboxRecords(true)
		data.selectedList = rows.filter(item => item.type == 'ch')
	}
	function checkboxChange() {
		let rows = xTable1.value.getCheckboxRecords(true)
		data.selectedList = rows.filter(item => item.type == 'ch')
	}
	function handleChecked(row, val) {
		let list = props.dataList
		let selectedList = data.selectedList || [] // 选中的数组
		if (row.type === 'fa') {
			props.dataList.forEach(v => {
				if (v.type === 'ch' && v.parentId && v.parentId === row.id) {
					v.checked = val
					if (val) {
						selectedList.push(v)
					} else {
						let ind = selectedList.findIndex(i => i.id === v.id)
						if (ind !== -1) selectedList.splice(ind, 1)
					}
				}
			})
		} else {
			if (val) {
				selectedList.push(row)
			} else {
				let ind = selectedList.findIndex(v => v.id === row.id)
				if (ind !== -1) selectedList.splice(ind, 1)
			}

			let faIndex = list.findIndex(v => {
				if (v.type === 'fa') {
					return v.skuList.some(x => x.id === row.id)
				}
			})

			if (faIndex !== -1) {
				// 要找到和他关联的子集收集起来,判断是不是全部checked 为true
				let checkedList = props.dataList.filter(v => {
					return v.parentId === list[faIndex].id && v.type === 'ch' && v.checked
				})
				if (
					checkedList?.length > 0 &&
					checkedList?.length < list[faIndex].skuList.length
				) {
					props.dataList[faIndex].indeterminate = true
					props.dataList[faIndex].checked = false
				} else if (checkedList?.length === list[faIndex].skuList.length) {
					props.dataList[faIndex].indeterminate = false
					props.dataList[faIndex].checked = true
				} else {
					props.dataList[faIndex].indeterminate = false
					props.dataList[faIndex].checked = false
				}
			}
		}
		data.selectedList = selectedList
		data.tableCheckdAll = isCheckedAll()
		emits('emitSelected', selectedList)

	} // 选中当前数据

	function isCheckedAll() {
		let chList = props.dataList.filter(v => v.type === 'ch')
		return data.selectedList.length === chList.length
	} // 判断是否需要全选

	function handleCheckedAll(val) {
		let selectedList = [] // 选中的数组
		props.dataList.forEach(v => {
			if (v.type === 'ch' || v.type === 'fa') {
				v.checked = val
			}
			if (v.type === 'ch') {
				if (val) {
					selectedList.push(v)
				} else {
					let ind = selectedList.findIndex(i => i.id === v.id)
					if (ind !== -1) selectedList.splice(ind, 1)
				}
			}
		})
		data.selectedList = selectedList
		// data.tableCheckdAll = isCheckedAll()
		emits('emitSelected', selectedList)
	} // 是否全选当前数据


	function goOrder(status = null, row, attribute = 0) {
		// attribute = 0 普货 / attribute = 1 定制
		let tabType = 'pending'
		switch (status) {
			case 999:
				tabType = 'allOrder'
				status = 999  // 2022.3.1 从空改回 999
				break
			case 2:
				tabType = 'applying'
				break
			case 3:
				tabType = 'fail'
				break
			case 4:
				tabType = 'success'
				break
			case 6:
				tabType = 'outStock'
				break
			case 10:
				tabType = 'shelve'
				break
			case 5:
				tabType = 'inStock'
				break
			case 7:
				tabType = 'toBeDelivered'
				break
		}
		// store.dispatch('orderManage/clearStateByActions')
		store.dispatch('orderManage/setTabTypeByActions', tabType)
		store.dispatch('orderManage/setOrderStatusByActions', status === 999 ? '' : status)
		router.push({
			name: 'OrderManagement',
			params: { status, skuId: row.skuId, tabType, attribute }
		})
	} // 跳往订单
	function changeTypeFn(type,param){
		// type 1.普货正常， 2.普货搁置， 3.定制正常， 4.定制今日标记， 5.定制搁置
		switch(type){
		case 1:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setNormalFormActions', param)
				break;
		case 2:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 0)
			store.dispatch('purchaseSearch/setNormalShelveFormActions', param)
				break;
		case 3:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setCustomFormActions', param)
				break;
		case 4:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 2)
			store.dispatch('purchaseSearch/setCustomRemarkFormActions', param)
				break;
		case 5:
			store.dispatch('purchaseSearch/setPageStatusActions', '1')
			store.dispatch('purchaseSearch/setTabStatusActions', 0)
			store.dispatch('purchaseSearch/setCustomShelveFormActions', param)
				break;
		default:
			store.dispatch('purchaseSearch/setPageStatusActions', '0')
			store.dispatch('purchaseSearch/setTabStatusActions', 1)
			store.dispatch('purchaseSearch/setNormalFormActions', param)
				break;
	}
	}

	function editRemark(row, v) {
		data.componentUrl = 'Remark'
		data.comQuery = { selectedList: [row], editItem: v }
		data.dialogVisible = true
	} // 编辑备注

  function editSpuRemark(row, v) {
		data.componentUrl = 'SpuRemark'
		data.comQuery = { selectedList: [row], editItem: v }
		data.dialogVisible = true
  }

  function del(row) {
    delRemark({id: row.id}).then(res => {
      if (res.code === 200) refresh()
    })
  }



	function next(val = {}) {
		const { type } = val
		if (type === 'createPurOrder') {
			return emits('detail', { data: val.data, type: 0 })
		} // 生成采购订单
		refresh()
	} //

	function addPlan(row) {
		if(props.status == 1) {
			router.push({
				path: '/purchase/purchaseManagement/customOder/index',
				query: {
					id: row.goodsId,
					type:2,
					tabPosition:data.tabPosition,
					idList:row.idList.join(','),
					skuIdList:row.skuId
				}
			})
			return false
		}
		const {
			editPurNum,
			skuId,
			parentId,
			pairInfo,
			warehouseId,
			supplierId,
			id,
			link,
			partnerType,
			thirdPlatformSupplierId,
			purchasePrice,
			lastPurchasePrice
		} = row

		let prices = null
		if (pairInfo) {
			const { price, sellerUserId } = JSON.parse(pairInfo)
			if (sellerUserId === thirdPlatformSupplierId && price) {
				prices = String(price)
			} else {
				prices = String(lastPurchasePrice || purchasePrice)
			}
		} else {
			prices = String(lastPurchasePrice || purchasePrice)
		}

		const query = {
			type: 1,
			supplierId: null,
			warehouseId: null,
			skuCode: null,
			goodsId: null,
			goodsName: null,
			supplierName: null,
			customizationType:props.status - 0
		}
		const skuList = [
			{
				link: partnerType === 2 ? link : null,
				type: 1,
				skuId,
				quantity: Number(editPurNum),
				price: prices,
				pairInfo: testPairInfo(row) ? pairInfo : null,
				warehouseId,
				supplierId,
				suggestId: id,
				customization:props.status - 0
			}
		]
		addOrUpdate({ query, skuList })
			.then(res => {
				if (res.code == 200) {
					refresh()
				}
			})
			.catch(err => {
				emits('refreshList')
			})
	} // 加入采购计划

	function setPlan() {
		if (data.selectedList.length == 0) return ElMessage.error('请勾选SKU!')
		let list = data.selectedList.filter(v => v.supplierId)
		const skuIdList = []
		if (list.length == 0) {
			return ElMessage.error('请设置供应商!')
		}
		const query = {
			type: 1,
			supplierId: null,
			warehouseId: null,
			skuCode: null,
			goodsId: null,
			goodsName: null,
			supplierName: null,
			customizationType:props.status - 0
		}
		let skuList = []
		list.forEach(v => {
			const {
				editPurNum,
				skuId,
				parentId,
				pairInfo,
				price,
				warehouseId,
				supplierId,
				id,
				thirdPlatformSupplierId,
				purchasePrice,
				lastPurchasePrice,
				partnerType,
				link
			} = v
			skuIdList.push(skuId)
			let prices = null
			if (pairInfo) {
				const { price, sellerUserId } = JSON.parse(pairInfo)
				if (sellerUserId === thirdPlatformSupplierId && price) {
					prices = String(price)
				} else {
					prices = String(lastPurchasePrice || purchasePrice)
				}
			} else {
				prices = String(lastPurchasePrice || purchasePrice)
			}
			if(v.idList&&v.idList.length)
			  v.idList.forEach(val=>{

					skuList.push({
						id,
						link: partnerType === 2 ? link : null,
						type: 1,
						skuId,
						quantity: Number(editPurNum),
						price: prices,
						pairInfo: testPairInfo(v) ? pairInfo : null,
						warehouseId,
						supplierId,
						suggestId: val,
						qtyOperateType:2,
						productId:v.productId
					})
				})
			else
				skuList.push({
					link: partnerType === 2 ? link : null,
					type: 1,
					skuId,
					quantity: Number(editPurNum),
					price: prices,
					pairInfo: testPairInfo(v) ? pairInfo : null,
					warehouseId,
					supplierId,
					suggestId: id,
					qtyOperateType:2,
					productId:v.productId
				})
		})
		//定制品类型（0：普通，1：定制）
		if(props.status == 1) {
			let goodsList = []
			let idList = []
			data.selectedList.forEach(v=>{
				if(v.supplierName){
					goodsList.push(v.goodsId)
					idList = [...idList,...v.idList]
				}
			})
			if(idList.length === 0) return ElMessage.error('请设置供应商!')
			router.push({
				// name: 'CustomOder',
				path: '/purchase/purchaseManagement/customOder/index',
				query: {
					id: goodsList.join(','),
					type:2,
					tabPosition:data.tabPosition,
					idList:idList.join(','),
					skuIdList:skuIdList.join(',')
				}
			})
			return false
		}
		addOrUpdate({ query, skuList})
			.then(res => {
				if (res.code == 200) {
					refresh()
				}
			})
			.catch(err => {
				emits('refreshList')
			})
	} //批量加入采购计划\

	function refresh(pageNo ,pageSize) {
		emits('refresh')
		clearSelected()
	}

	function clearSelected() {
		data.selectedList = []
		data.tableCheckdAll = false
	}

	function createPurOrder() {
		if (data.selectedList.length == 0) {
			return ElMessage.error('请勾选SKU!')
		}
		let newList = data.selectedList.filter(v => v.supplierId)
		if (newList?.length == 0) return ElMessage.error('请设置供应商')

		//定制品类型（0：普通，1：定制）
		if(props.status == 1) {
			let goodsList = []
			let idList = []
			let skuIdList = []
			data.selectedList.forEach(v=>{
				if(v.supplierName){
					goodsList.push(v.goodsId)
					skuIdList.push(v.skuId)
					idList = [...idList,...v.idList]
				}
			})
			if(idList.length === 0) return ElMessage.error('请设置供应商!')
			router.push({
				// name: 'CustomOder',
				path: '/purchase/purchaseManagement/customOder/index',
				query: {
					id: goodsList.join(','),
					type:3,
					tabPosition:data.tabPosition,
					idList:idList.join(','),
					skuIdList:skuIdList.join(',')
				}
			})
			return false
		}
		let renderOrderList = newList.map(v => {
			return {
				suggestId: v.id,
				quantity: v.editPurNum || v.quantity // 备货采购是quantity ,采购建议和购物车是editNum
			}
		})
		let skuList = []
		newList.forEach(v => {
			if(v.idList&&v.idList.length)
				v.idList.forEach(val=>{
					skuList.push({
						id: val,
						quantity: v.editPurNum || v.quantity,
						purchasePrice: createEditPrice(
							v.lastPurchasePrice,
							v.purchasePrice,
							v.pairInfo,
							v.partnerType,
							v.thirdPlatformSupplierId
						)
					})
				})
			else
				skuList.push({
					id: v.id,
					quantity: v.editPurNum || v.quantity,
					purchasePrice: createEditPrice(
						v.lastPurchasePrice,
						v.purchasePrice,
						v.pairInfo,
						v.partnerType,
						v.thirdPlatformSupplierId
					)
				})
		})
		// 备货采购数量

		direct({ skuList }).then(res => {
			if (res.code == 200) {
				return emits('detail', {
					data: res.data,
					type: 0,
					param: renderOrderList
				})
			}
		})




		function createEditPrice(lPrice, price, pairInfo, type, thirdId) {
			// let p = lPrice || price
			let p = lPrice != null ? Number(lPrice) : Number(price)
			if (type !== 2) return String(p) // 不是1688的就不用考虑配对商品价格
			if (
				pairInfo &&
				thirdId === JSON.parse(pairInfo).sellerUserId &&
				JSON.parse(pairInfo)?.price
			)
				return String(JSON.parse(pairInfo)?.price)
			// 备货有配对商品的时候用配对的单价
			if (lPrice > price + 3) p = price + 3
			return String(p)
		}
	} // 批量生成 采购订单

	function setSuplierFun(row) {
		data.comQuery = {
			selectedList: [row],
			type: 1,
			supplierId:
				row.partnerType || row.supplierId
					? [row.partnerType, row.supplierId]
					: null
		}
		data.dialogVisible = true
		data.componentUrl = 'SetSuplier'
	} // 更换供应商

	function setSuplierAll(){
		if (data.selectedList?.length === 0) {
			ElMessage.error('请勾选SKU')
			return
		}
		// if (data.selectedList.filter(v => v.supplierId).length == 0)return ElMessage.error('请设置供应商!')

		openDialog({type: 'SetSuplier', list:data.selectedList})
	} // 批量设置供应商


	function setShelve(row) {
		if (!row && data.selectedList.length == 0) {
			return ElMessage.error('请勾选SKU!')
		}
		data.comQuery = { selectedList: row ? [row] : data.selectedList }
		data.dialogVisible = true
		data.componentUrl = 'Shelve'
	} // 移入搁置

	function getRowSku(val) {
		let text = ''
		val.forEach(a => {
			text += (a.spe ? a.spe + ':' : '') + a.speVal + ' '
		})
		return text
	}

	function match(row) {
		matchInfo = row
		const { mainImg, skuCode, link, pairInfo, thirdPlatformSupplierId } = row
		let speInfo
		if (pairInfo) {
			speInfo = JSON.parse(pairInfo).speInfo
		}

		data.comQuery = {
			pairInfo: {
				img: mainImg,
				name: skuCode,
				speInfo: testPairInfo(row) ? speInfo : null
			},
			url: testPairInfo(row) ? link : null,
			thirdPlatformSupplierId
		}

		console.log(data.comQuery)
		data.dialogVisible = true
		data.componentUrl = 'MatchGoods'
	} // 配对商品

	function cancelMatch(row) {
		confirm(
			'确定解除该商品的配对关系?',
			_ => {
				const param = {
					id: row.id,
					link: null,
					pairInfo: null
				}
				pairMatch(
					param,
					res => {
						refresh()
					},
					0
				)
			},
			_ => { console.log(_) }
		)
	} // 解除配对

	function openDialog(val) {
		const { type, list } = val
		data.dialogVisible = true
		data.componentUrl = type
		data.comQuery = { selectedList: list, searchParams: props.searchParams, type: 1, customization:props.status - 0 }
	} // 打开弹框

	function comOk(v, type) {
		if (type && type === 'MatchGoods') {
			const { sku, spe, url } = v
			const { id, supplierId, suggestQuantity } = matchInfo
			let price = ''
			if (v.data.orderParam.skuParam.skuPriceType == 'skuPrice') {
				price = sku.price || sku.discountPrice
			} else {
				//根据采购数量 确定单价
				v.data.orderParam.skuParam.skuRangePrices.some(item => {
					price = item.price
					return true
				})
			}
			let pairInfo = {
				img: sku?.imageUrl || v.data.goodsSpu.mainImg,
				name: v.data.goodsSpu.goodsName,
				offerId: v.data.goodsSpu.goodsNum,
				specId: sku?.specId || null,
				price: price,
				sellerUserId: v.data.shopInfo.sellerUserId,
				speInfo: spe.map(item => {
					return {
						spe: item.key,
						speVal: item.value.name
					}
				})
			}
			let param = null
			if(matchInfo.idList&&matchInfo.idList.length){
				param = {
					modifyList:[],
					customizationType:props.status - 0//定制品类型（0：普通，1：定制）
				}
				matchInfo.idList.forEach(v=>{
					param.modifyList.push({
						id:v,
						link: url,
						pairInfo: JSON.stringify(pairInfo),
						customizationType:props.status - 0//定制品类型（0：普通，1：定制）
					})
				})
			}else{
				param = {
					id,
					link: url,
					pairInfo: JSON.stringify(pairInfo),
					customizationType:props.status - 0//定制品类型（0：普通，1：定制）
				}
			}
			pairMatch(
				param,
				res => {
					matchInfo = null
					data.dialogVisible = false
					refresh()
				},
				(type = 0)
			)
			return
		} //配对商品
		refresh()
	}

	function removeSh(row) {
		const { id, skuId } = row
		let param = {
			idList: row.idList&&row.idList.length?row.idList:[id],
			status: 1,
			statusDesc: null,
			skuIdList:[skuId],
			customization:props.status - 0//定制品类型（0：普通，1：定制）
		}
		removeShelve(param, res => {
			ElMessage.success(res.message)
			emits('refresh')
		})
	} // 移出搁置

	function goDetail(goodsIds) {
		goodsCheck({ goodsId: goodsIds }).then(res => {
			if (res.code === 200) {
				const { goodsId, flag, msg, layFlag } = res.data
				if (flag) {
					if (layFlag === 0) {
						router.push({
							path: '/goods/goodsManagement/setPrice/detail',
							query: {
								id: goodsId,
								sourceRoute: 'purchaseOrder'
							}
						})
					} else {
						router.push({
							path: '/goods/goodsManagement/layAside/detail',
							query: {
								id: goodsId
							}
						})
					}
				} else {
					ElMessage.error(msg)
				}
			}
		})
		// router.push({
		// 	path: '/goods/goodsManagement/setPrice/detail',
		// 	query: {
		// 		id: goodsIds,
		// 	}
		// })
	}

	function changeType(val) {
		// store.dispatch('purchaseSearch/setTabStatusActions', val)
		data.marksListDataSelect = []
		emits('remarkType', val)
		// if(val == 2) {
		// 	getTodayMarkList()
		// }else{
		// 	refresh()
		// }
	} // 切换状态

  function getRemarkDetail(goodsId, remarkTypeId) {
    getRemarkList({ goodsId, remarkTypeId,customization:props.status - 0 }).then(res => {
			if (res.code == 200) {
				data.remarkInfo = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
  }

  function showOptions(row){
    return storage.get('ERP_USERINFO')?.fullName !== row.createUserName
  } // 是否开启编辑

	// goods been marked
    function remarkList() {
      if (!data.selectedList.length)
        return ElMessage.error('请勾选SKU!')
				let goodsList = []
				let idList = []
				let skuIdList = []
				data.selectedList.forEach(v=>{
					goodsList.push(v.goodsId)
					skuIdList.push(v.skuId)
					idList = [...idList,...v.idList]
				})
				router.push({
					path: '/purchase/purchaseManagement/customOder/index',
					query: {
						id: goodsList.join(','),
						type:4,
						tabPosition:data.tabPosition,
						idList:idList.join(','),
						skuIdList:skuIdList.join(',')
					}
				})
    }
	function renderCustomInfo(list = []){
			let str = ''
			list.forEach(v=>str+=`${v.field}:${v.value}`)
			return str
		}

	onMounted(() => {
		nextTick(() => { })
	})
</script>

<style scoped lang="scss">
.customValueContainer{
	text-align: left;
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	width: 200px;
  margin: 0 auto;
	.customValueList{
		text-align: center;
	}
}
	.header {
    position: relative;
		display: flex;
		align-items: center;
    justify-content: flex-start;
		.headerInfo {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
		}
		.goDetail {
      max-width: 610px;
      margin-right: 20px;
			cursor: pointer;
			color: #1e93ff;
		}
    .right{
      position: absolute;
      right: 20px;
    }
	}

	.btnList {
		margin: 20px 0;
	}
	.tables {
		background: white;
		padding: 15px;
	}
	.option .vxe-cell {
		padding: 0;
	}

	.a {
		color: #f7b500;
		text-decoration: underline;
	}

	.goods {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		.goodsImg {
			width: 60px;
			height: 60px;
			background: #9e9e9e;
			.img {
				width: 60px;
				height: 60px;
			}
		}
		.goodsInfo {
			text-align: left;
			width: 75%;
			.infoName {
				font-size: 12px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				width: 250px;
				overflow: hidden; /**隐藏超出的内容**/
        white-space: nowrap;
        text-overflow: ellipsis;
			}
			.tag {
				margin-left: 10px;
			}

			.infoSku {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.65);
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			}
			.skus {
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.65);
			}
			.over {
				width: 240px;
				p {
					overflow: hidden; /**隐藏超出的内容**/
					white-space: nowrap;
					-o-text-overflow: ellipsis;
					text-overflow: ellipsis;
				}
			}
		}
	}

	//商品

	.pairInfo {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		.info {
			width: 300px;
			margin-left: 20px;

			.title {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
			}

			.sku {
				margin: 10px 0;
				color: rgba(0, 0, 0, 0.45);

				span {
					margin: 5px 10px 5px 0;
				}
			}

			.price {
				margin-top: 20px;
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #fd4c60;
			}
		}
	}

	.footer {
		display: flex;
		justify-content: space-between;
    align-items: center;
    height: 100%;
		padding: 0 20px;
    .left-box {
      display: flex;
		  align-items: center;
    }
    .right-box {
      flex-grow: 1;
    }
	}

	.normalOrder {
		height: 45px;
		background: #fafafa;
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
		border-radius: 2px 2px 0px 0px;
		text-align: center;
		line-height: 45px;
		font-weight: 500;
	}
	.pointer {
		cursor: pointer;
	}
	.normalItem {
		.item {
			margin: 20px auto;
			width: 180px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.65);
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.hover:hover {
			color: #1e93ff;
		}
	}

	.supplier {
		p {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
			margin-top: 5px;
		}
	}
	//供应商

	.options {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	// 操作

	:deep(.vxe-table--render-default .vxe-body--column.col--ellipsis > .vxe-cell) {
		max-height: 300px;
	}

	:deep(.vxe-table--render-default .vxe-tree-cell) {
		padding: 0;
	}

	:deep(.vxe-cell--tree-node) {
		padding: 0 !important;
	}

	:deep(.el-tag) {
		margin-left: 2px !important;
	}
	.goodsInfoContainer{
		display: flex;
		justify-content: flex-start;
		.goodsImageContainer{
			width: 100px;
			height: 100px;
		}
		.goodsInfoContent{
			box-sizing: border-box;
			padding-left: 20px;
		}
	}
	.pClass{
		white-space: nowrap;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
	}
</style>
