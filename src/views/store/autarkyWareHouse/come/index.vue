<template>
	<div class="headCome">
		<div class="headContent">
			<div style="color:#606266;margin-bottom:13px">仓库名称:<span style="margin-left:16px">万众智谷仓库</span></div>
			<el-form :model="form" :inline="true" @keydown.enter='query'>
				<!-- <el-form-item label="仓库名称:" > -->
				<!-- <el-checkbox-group v-model="form.storageIds"> -->
				<!-- <el-checkbox label="0">全部</el-checkbox>
            <el-checkbox label="1">万众智谷仓库</el-checkbox> -->
				<!-- <div style="color:#606266">万众智谷仓库</div> -->
				<!-- </el-checkbox-group> -->
				<!-- </el-form-item> -->
				<el-form-item label="搜索内容:">
					<el-select v-model="form.searchContentTypeId" placeholder="请选择" style="width: 140px" clearable @change="searchContent">
						<el-option label="SKU ID" value="1"></el-option>
						<el-option label="商品SKU" value="9"></el-option>
						<el-option label="商品名称" value="2"></el-option>
						<el-option label="订单号" value="3"></el-option>
						<el-option label="包裹号" value="4"></el-option>
						<el-option label="运单号" value="5"></el-option>
						<el-option label="流水(单号)" value="6"></el-option>
						<el-option label="采购单号" value="7"></el-option>
						<el-option label="货架位" value="8"></el-option>
					</el-select>
					<el-input :placeholder="placeholderType" style="width: 350px; margin-left: 16px" v-model="form.searchContent" clearable></el-input>
				</el-form-item>
				<el-form-item label="商品品类:">
					<el-cascader :options="categoryData" clearable :props="{checkStrictly:true , value:'id' ,label:'name' ,children:'child'}" v-model="form.categoryId" @change="checkedCategory" />
				</el-form-item>
				<el-form-item label="仓库分区:">
					<el-select v-model="form.storeArea" placeholder="请选择" style="width: 140px" clearable>
						<el-option :label="item.name" :value="item.name" v-for="item in storeArea" :key="item.id"></el-option>

					</el-select>
				</el-form-item>
				<el-form-item label="类型:">
					<el-cascader v-model="form.typeDetail" :options="options" :props="{checkStrictly: true,expandTrigger: 'hover'}" @change="cascaderChange" style="width:140px" clearable></el-cascader>
				</el-form-item>
				<el-form-item label="操作人:">
					<el-select v-model="form.operateUserId" style=" width: 140px" placeholder="请选择" clearable>
						<el-option v-for="item in personList" :key="item.userId" :label="item.fullName" :value="item.userId"></el-option>
					</el-select>
					<span style="margin-left: 16px; color: #606266">创建时间:</span>
					<el-date-picker v-model="form.createTime" type="daterange" class="date-item" unlink-panels style="width: 280px; margin-left: 10px" range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="onchages">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="供应商">
					<el-cascader :options="supplierTree" style="width:350px" v-model="supplierId" clearable filterable collapse-tags :props="{ checkStrictly: true, expandTrigger: 'hover',label:'name',value:'id',children:'childs' }" @change="supplierChange">
					</el-cascader>

				</el-form-item>

				<el-form-item>
					<el-button style="margin-left: 10px" type="primary" @click="query">查询</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 按钮 -->
		<el-affix :offset="90">
			<div class="buttonClass">
				<el-button v-permission="'come-Details_Tag:btn'" type="primary" @click="WarehouseLabel">补打入库标签</el-button>
				<!-- <el-dropdown @command="handleCommand"> -->
				<el-button v-permission="'come-Details_export:btn'" type="primary" @click="handleOpenExprot"> 导出记录 </el-button>
				<!-- <template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="0">按勾选项导出</el-dropdown-item>
								<el-dropdown-item command="1">按当前页导出</el-dropdown-item> -->
				<!-- <el-dropdown-item>按全部页导出</el-dropdown-item> -->
				<!-- </el-dropdown-menu>
						</template>
					</el-dropdown> -->
			</div>
		</el-affix>
		<!-- 表格部分 -->
		<div class="pageViews" v-loading="loading">
			<Table :checkboxType="1" :tableData="data" fieldName="records" :columns="columns" :border="true" checkedKey="serialNumber" @selectRowKeys="selectRowKeys" ref="tableRef">
				<template v-slot:extraHeader="scoped">
					<div class="extraHeader" v-if="scoped.row.records">
						<div>
							{{ scoped.row.records[0].type ? '出库' : '入库' }}单号：{{
                scoped.row.serialNumber
              }}
						</div>
					</div>
				</template>
				<!-- 商品信息 -->
				<template v-slot:goodsDetail="scoped">
					<div class="goodsDetail">
						<el-popover placement="right-start" trigger="hover" width="auto" class="imgBox">
							<el-image style="width: 200px; height: 200px" :src="scoped.row.skuImage" fit="contain"></el-image>
							<template #reference>
								<el-image style="width: 70px; height: 70px;margin-left:16px;line-height:70px" :src="scoped.row.skuImage" fit="contain">
									<template #error>
										<div class="image-slot">
											<el-image style="width: 70px; height: 70px;margin-left:16px;line-height:70px" fit="contain" :src="img" />
										</div>
									</template>
								</el-image>

							</template>
						</el-popover>
						<div class="right">
							<el-tooltip placement="top">
								<template #content>
									<a v-copy="scoped.row.goodsName" style="">复制</a>
								</template>
								<div class="skuFont" :title="scoped.row.goodsName">
									<p>
										{{ scoped.row.goodsName }}
									</p>
								</div>
							</el-tooltip>
							<el-tooltip placement="top">
								<template #content>
									<a v-copy="scoped.row.skuValue" style="">复制</a>
								</template>
								<div :title="scoped.row.skuValue">
									<p>
										{{ scoped.row.skuValue }}
									</p>
								</div>
							</el-tooltip>
							<!-- 国码预留 -->
							<div v-if="scoped.row.codeVal" style="color:#2fbba6;font-size:12px">
										国码：{{scoped.row.codeVal}}
							</div>
							<el-tooltip placement="top">
								<template #content>
									<a v-copy="scoped.row.sku" style="">复制</a>
								</template>
								<div class="skus" :title="scoped.row.sku">
									<p>{{ scoped.row.sku }}</p>
								</div>
							</el-tooltip>
							<el-tooltip placement="top">
								<template #content>
									<a v-copy="scoped.row.skuCode" style="">复制</a>
								</template>
								<div class="skus" :title="scoped.row.skuCode">
									<p>{{ scoped.row.skuCode }}</p>
								</div>
							</el-tooltip>
							<a @click="productGoods(scoped.row.type, scoped.row.serialNumber)" v-if="scoped.row.customization">
								定制品
							</a>
						</div>
					</div>
				</template>
				<!-- 商品品类 -->
				<template v-slot:categoryName="scoped">
					<div class="categoryName categoryFont" :title="scoped.row.categoryName">
						{{scoped.row.categoryName}}
					</div>
				</template>
				<!-- //原库存 -->
				<!-- <template v-slot:originalStock="scoped">
					<div class="originalStock">{{ scoped.row.originalStock }}</div>
				</template> -->
				<!-- 变动 -->
				<template v-slot:numbers="scoped">
					<div>
						<p v-if="!scoped.row.type" style="color: #ff4d4f">
							+{{ scoped.row.numbers }}
						</p>
						<p v-else style="color: #52c41a">-{{ scoped.row.numbers }}</p>
					</div>
				</template>
				<!-- 新库存 -->
				<!-- <template v-slot:newStock="scoped">
					<div class="newHouse">{{ scoped.row.newStock }}</div>
				</template> -->
				<!-- 仓库 -->
				<template v-slot:warehouseName="scoped">
					<div class="wareHouse">{{ scoped.row.warehouseName }}</div>
					<div class="wareHouse">操作人:{{scoped.row.createUser}}</div>
				</template>
				<!-- 货架位 -->
				<template v-slot:store="scoped">
					<div class="store">{{scoped.row.shelfGridName}}</div>
					<div class="store">{{scoped.row.areaName}}</div>
				</template>
				<!-- 入库价 -->
				<template v-slot:price="scoped">
					<div class="price">{{scoped.row.price?scoped.row.price:'-'}}</div>
				</template>

				<!-- 类型 -->
				<template v-slot:type="scoped">
					<div class="type">
            <!-- <p v-if="scoped.row.type" >
              <span v-for="item in options[1].children" :key="item.value">
               {{item.value==scoped.row.typeDetail?'出库/'+item.label:''}}
              </span>
             </p>
             <p v-else>
               <span v-for="item in options[0].children" :key="item.value">
               {{item.value==scoped.row.typeDetail?'入库/'+item.label:''}}
              </span>
             </p> -->
						{{ scoped.row.type ? '出库/'+scoped.row.typeDetailMsg: '入库/'+scoped.row.typeDetailMsg }}
					</div>
				</template>
				<!-- 时间 -->
				<template v-slot:createTime="scoped">
					<div class="createTime">{{ scoped.row.createTime }}</div>
				</template>
				<template v-slot:operation="scoped">
					<div class="operation">
						<a @click="details(scoped.row.serialNumber)">详情</a>
					</div>
					<div class="operation" style="margin-top: 8px">
						<a v-permission="'come-Details_remark:btn'" @click="showRemarks(scoped.row.serialNumber, scoped.row.remark)">备注</a>
					</div>
				</template>
			</Table>
		</div>
		<!-- 分页器 -->
		<div class="flex-pagination page-fixed">
			<div>
				<!-- <el-checkbox v-model="checkedList">
					已选<span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
				</el-checkbox> -->
				已选<span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
			</div>
			<div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="paginationArr" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
				</el-pagination>
			</div>

		</div>
		<!-- 备注的弹框 -->
		<Remarks v-if="dialogRemarks" :remark="remark" @closeDialog="closeRemarks" @handOkRemarks="handOkRemark" />
		<!-- 定制品弹框 -->
		<el-dialog title="定制内容" v-model="dialogVisible" width="800px" :destroy-on-close="true" :close-on-click-modal="false">
			<ProductGoods :productType="productType" :productId="productId" :type="type" />
		</el-dialog>

		<!-- 详情的弹框 -->
		<div class="detailsModal">
			<el-dialog title="详情" v-model="dialogDetails" width="800px" :destroy-on-close="true" :close-on-click-modal="false">
				<Details :rowId="rowId" />
			</el-dialog>
		</div>
		<WarehouseLabel v-if="showWareHouse" :selectLable="selectLable" @closeLable="closeLable" />
		<!-- 导出弹框 -->
		<el-dialog title="导出记录" v-model="exportMsg" width="500px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialogExport">
			<el-radio v-model="command" label="0">导出当前勾选</el-radio>
			<el-radio v-model="command" label="2">导出当前查询</el-radio>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialogExport">取 消</el-button>
					<el-button type="primary" @click="handleCommand">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import img from '@/assets/image/zwt_bg.png'
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import moment from 'moment'
	import { ElMessage } from 'element-plus'
	import { resetForm } from '@/utils/tool.js'
	import Table from '@/components/elTable/index.vue' //引入表格部分的封装组件
	import { reactive, toRefs, ref, computed, onActivated } from 'vue'
	import WarehouseLabel from './components/warehouseLabel.vue'
	import ProductGoods from '@/views/store/autarkyWareHouse/come/components/productGoods.vue' //订制品弹框
	import Details from '@/views/store/autarkyWareHouse/come/components/details.vue' //订制品弹框
	import Remarks from '@/views/store/autarkyWareHouse/come/components/remarks.vue'
	import { nextTick, onMounted } from 'vue'
	import { getCategory } from '@/api/goods/quotedPrice.js'
	import { useStore } from 'vuex'
	import {
		getCome, //出入记录页面查询
		exportCome, //出入记录页面的导出
		comeRemark, //备注的接口
		comePerson,
	} from '@/api/store.js'
	import {
		getTree
	} from '@/api/purchase/outOfStock.js'
	import {
		getStoreArea, //仓库分区查询
	} from '@/api/store/warehouseSettings.js'
	import { useRoute } from 'vue-router'
	export default {
		name: 'Come',
		components: {
			ProductGoods, //定制品
			Table, //主列表的样式
			Details, //详情
			Remarks, //备注
			elSelectTree,
			WarehouseLabel
		},
		setup() {
			const route = useRoute()
			let tableRef = ref(null)
			let store = useStore()
			const state = reactive({
				showWareHouse: false,//三期打开打印标签弹框
				selectLable: [],//三期选择处理后全是入库的数据保存
				checkedList: false,
				loading: true,
				img,
				command: '0',
				exportMsg: false,//打开导出弹框
				personList: [], //操作人列表
				serialNumbersList: [],
				//分页
				current: 1, //当前页码
				size: 30, //一页多少条
				paginationTotal: 0, //分页总数据条数
				paginationArr: [30, 100, 300, 500], //分页每页选择条数默认数据
				selectGoodsId: [], // 当前勾选的商品id
				type: '',
				productType: '', //带到订制品页面数据
				productId: '', //带到订制品页面数据
				serialNumber: '', //带到备注页面的数据
				remark: '', //带到备注页面的数据
				rowId: '', //带到详情页面的id
				dialogVisible: false, //订制品的弹框
				dialogDetails: false, //详情的弹框
				dialogRemarks: false, //备注的弹框
				columns: [{
					title: '商品信息',
					key: 'goodsDetail',
					width: '400px',
					isSlot: true
				},
				{
					title: '商品品类',
					key: 'categoryName',
					width: '350px'
				},
				{
					title: '变动',
					key: 'numbers',
					width: '300px'
				},

				{
					title: '仓库',
					key: 'warehouseName',
					width: '300px'
				},
				{
					title: '货架位',
					key: 'store',
					width: '300px'
				},
				{
					title: '出/入库价(CNY)',
					key: 'price',
					width: '200px'
				},
				{
					title: '类型',
					key: 'type',
					width: '240px'
				},

				{
					title: '时间',
					key: 'createTime',
					width: '320px'
				},
				{
					title: '操作',
					key: 'operation',
					width: '200px'
				}
				],
				data: [{
					goodsList: []
				}],
				ifShowList: true,
				form: {
					startDate: '',
					endDate: '',
					operateUserId: '',
					storageIds: [1], //仓库名称
					storeArea: '',//新增的仓库分区
					searchContentTypeId: '',
					searchContent: '',
					createTime: [],
					storeType: '',
					typeDetail: [''],//三期新增的类型
					categoryId: '',//新增的品类权限,
					supplierId: '',
					partnerType: ''
				},
				show: false,
				cancelShow: false,
				dialogVisible: false,
				multipleSelection: [],
				storeArea: [],
				placeholderType: '请输入要检索的内容',
				options: [
					{ value: 0, label: '入库', children: [{ value: 1, label: '扫码入库' }, { value: 2, label: '次品入库' }, { value: 3, label: '手动入库' }, { value: 4, label: '多发入库' },{ value: 5, label: '盘盈入库' }] },
					{ value: 1, label: '出库', children: [{ value: -1, label: '销售出库' }, { value: -2, label: '报损出库' }, { value: -3, label: '采购退货' }, { value: -4, label: '多发出库' }, { value: -5, label: '多发退货' }, { value: -6, label: '手动出库' },{ value: -7, label: '盘亏出库' }] }
				],//三期新增的头部搜索内容数据
				categoryData: [],//新增头部搜索品类权限,
				supplierTree: [],
				supplierId: ''
			})
			onMounted(() => {
				getTree().then(res => {
					state.supplierTree = res.data
				})
				state.form.createTime = [
						moment()
							.endOf('day')
							.subtract(119, 'days')
							.format('YYYY-MM-DD HH:mm:ss'),
						moment().format('YYYY-MM-DD HH:mm:ss')
					]
					state.form.startDate = moment()
						.endOf('day')
						.subtract(119, 'days')
						.format('YYYY-MM-DD 00:00:00')
					state.form.endDate = moment().format('YYYY-MM-DD 23:59:59')
			})
			//仓库分区接口
			getStoreArea({ warehouseId: 1 }).then(res => {
				state.storeArea = res.data
				// state.form.storeArea = res.data[0].name
			})
			//商品品类
			getCategory().then(res => {
				state.categoryData = res.data
			})
			//出入记录页面一进去时候
			const init = () => {
				state.loading = true
				let {
					operateUserId,
					storageIds,
					searchContentTypeId,
					searchContent,
					categoryId,
					supplierId,
					partnerType
				} = state.form,
					params = {
						operateUserId,
						storageIds,
						searchContentTypeId,
						searchContent,
						categoryId,
						supplierId,
						partnerType
					};
				(params.startDate = state.form.startDate),
					params.areaName = state.form.storeArea//三期仓库分区字段
				//判断选择的搜索类型
				if (state.form.typeDetail?.length == 2) {
					params.type = state.form.typeDetail[0]
					params.typeDetail = state.form.typeDetail[1]
				} else if (state.form.typeDetail?.length == 1) {
					params.type = state.form.typeDetail[0]
					params.typeDetail = ''
				} else if (!state.form.typeDetail.length) {
					params.typeDetail = ''
					params.type = ''
				}
				(params.endDate = state.form.endDate),
					(params.page = {
						pageSize: state.size,
						pageNo: state.current
					})
				getCome(params).then(res => {
					if (res.code == 200) {
						state.loading = false
						if (res.data.dataList) {

							res.data.dataList.forEach(item => {
								item.records.forEach(v => {
									//处理sku规格状态
									// if(v.skuValue?.length){
									//   v.skuCn=JSON.parse(v.skuValue).map(s => s.speVal).join('-')
									// }
									//处理列表类型
									v.typeDetailMsg = v.typeDetailMsg ? v.typeDetailMsg : '-'
								})
							})
							state.data = res.data.dataList
							// console.log(state.data,'data');
							state.paginationTotal = res.data.page.totalCount
						}
						nextTick(() => {
							tableRef.value.initFun()
						})
					}
				})
			}
			//查询操作人信息
			comePerson().then(res => {
				if (res.code == 200) {
					state.personList = res.data.list
				}
			})
			//查询事件
			const query = () => {
				if (!state.form.createTime) {
					ElMessage.error('时间不能为空')
				} else {
					init()
				}
			}
			//小版本优化导出记录的改造
			//打开导出弹框
			function handleOpenExprot() {
				state.command = '0'
				state.exportMsg = true
			}
			//关闭导出弹框
			function closeDialogExport() {
				state.exportMsg = false
			}
			//点击导出记录确定按钮
			const handleCommand = () => {
				if (state.command === '0' && !state.selectGoodsId.length) {
					ElMessage.error('请先勾选记录！')
					// init()
					return
				}
				//选择查询条件导出
				let params;
				if (state.command === '2') {
					// state.serialNumbersList = []
					// state.data.forEach(item => {
					// 	state.serialNumbersList.push(item.serialNumber)
					// })
					params = Object.assign({}, state.form)
					params.areaName = state.form.storeArea//仓库分区字段
					//处理搜索类型
					if (state.form.typeDetail?.length == 2) {
						params.type = state.form.typeDetail[0]
						params.typeDetail = state.form.typeDetail[1]
					} else if (state.form.typeDetail?.length == 1) {
						params.type = state.form.typeDetail[0]
						params.typeDetail = ''
					} else if (!state.form.typeDetail.length) {
						params.typeDetail = ''
						params.type = ''
					}

				} else {
					params = {
						serialNumbers: state.selectGoodsId
					}
				}
				params.exportType = state.command
				exportCome(params)
					.then(res => {
						if (res.code == 200) {
							window.open(res.data.msg)
							// tableRef.value.handleCheckAllChange(false)
						}
						setTimeout(() => {
							closeDialogExport()
						}, 500)

					})
			}
			//定制弹框打开
			const productGoods = (type, id) => {
				console.log(type, id)
				state.productType = type + ''
				state.productId = id
				state.dialogVisible = true
			}
			//点击详情的弹框
			const details = id => {
				state.rowId = id
				state.dialogDetails = true
			}
			//点击备注的弹框
			const showRemarks = (serialNumber, remark) => {
				state.serialNumber = serialNumber
				state.remark = remark
				state.dialogRemarks = true
			}
			//关闭备注的弹框事件(子传父)
			const closeRemarks = () => {
				state.dialogRemarks = false
			}
			//备注页面的提交
			const handOkRemark = val => {
				state.dialogRemarks = false
				let params = {
					serialNumber: state.serialNumber,
					remark: val
				}
				comeRemark(params).then(res => {
					if (res.code == 200) {
						ElMessage.success('提交成功')
						init()
					} else {
						ElMessage.error(res.message)
					}
				})
			}
			//重置按钮
			const reset = () => {
				let restForm = {
					createTime: [
						moment()
							.endOf('day')
							.subtract(119, 'days')
							.format('YYYY-MM-DD HH:mm:ss'),
						moment().format('YYYY-MM-DD HH:mm:ss')
					],
					startDate: moment()
						.endOf('day')
						.subtract(119, 'days')
						.format('YYYY-MM-DD 00:00:00'),
					endDate: moment().format('YYYY-MM-DD 23:59:59')
				}
				state.supplierId = ''
				resetForm(state.form, restForm)
				init()
			}
			// 接收table组件勾选的goodsId Arr
			const selectRowKeys = value => {
				state.selectGoodsId = value
				state.checkedList = state.selectGoodsId && state.selectGoodsId.length ? true : false
			}
			// 分页
			const handleSizeChange = val => {
				state.size = val
				state.current = 1
				init()
			}
			const handleCurrentChange = val => {
				state.current = val
				init()
			}
			//页面一进去初始时间
			onActivated(() => {
        if(route.params.isRefresh==='1'){
          state.form={}
        }
      state.form.typeDetail=[Number(route.params.type)]
				if (route.params.dateType) {
					let date = route.params.dateType.replace(/\//ig, '-')
          state.form.createTime=[date,date]
					state.form.startDate = date + ' 00:00:00'
					state.form.endDate = date + ' 23:59:59'
				}
        console.log(state.form.createTime);
				init()
			})
			//下拉框选择清空搜索框
			const searchContent = (val) => {
				state.form.searchContent = ''
				if (val === '2' || val === '8') {
					state.placeholderType = '请输入要检索的内容'
				} else {
					state.placeholderType = '请输入要检索的内容多条可用逗号或者空格隔开'
				}
			}
			//时间选择
			const onchages = (e) => {
				state.form.startDate = e ? e[0] + ' 00:00:00' : ''
				state.form.endDate = e ? e[1] + ' 23:59:59' : ''
			}
			//新增的三期需求组
			//1.头部搜索的点击事件
			function cascaderChange(e) {
				console.log(state.form.typeDetail);
				if (!e) {
					state.form.typeDetail = ['']
				}
			}
			//2.补打入库标签点击按钮
			function WarehouseLabel() {
				if (!state.selectGoodsId.length) return ElMessage.warning('请选择入库商品')
				state.selectLable = []
				let flag = state.selectGoodsId.some(item => {
					return item.indexOf('IN') != -1
				})
				if (flag) {
					state.selectGoodsId.map(item => {
						if (item.indexOf('IN') != -1) {
							state.selectLable.push(item)
						}
					})
					state.showWareHouse = true
				} else {
					ElMessage.error('请选择入库商品')
				}
				console.log(state.selectLable, 'state.selectLable');
			}
			//子页面返回的关闭方法
			function closeLable() {
				state.showWareHouse = false
			}
			//头部搜索框新增的品类权限
			function checkedCategory(val) {
				if (val) {
					state.form.categoryId = val[val.length - 1]
				} else {
					state.form.categoryId = null
				}
			}

			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)

			function supplierChange(data) {
				let type = ['', '合作供应商', '1688', '淘宝', '拼多多']
				console.log(data);
				console.log(state.supplierTree.find(item => item.id == data[0]));
				if (data) {
					if (data.length == 1) {
						state.form.supplierId = ''
						state.form.partnerType = type.findIndex(item => item == state.supplierTree.find(item => item.id == data[0]).name)
					} else {
						state.form.supplierId = data[1]
						state.form.partnerType = type.findIndex(item => item == state.supplierTree.find(item => item.id == data[0]).name)
					}
				}
				else {
					state.form.supplierId = ''
					state.form.partnerType = ''
				}
			}
			return {
				...toRefs(state),
				productGoods, //订制品弹框
				details, //详情的弹框
				showRemarks,
				handleSizeChange, //分页
				handleCurrentChange, //分页
				query,
				reset, //重置密码
				closeRemarks,
				handleCommand, //导出
				handOkRemark, //备注弹框确定事件
				selectRowKeys,
				searchContent,
				tableRef,
				onchages,
				cascaderChange,
				WarehouseLabel,
				closeLable,
				checkedCategory,
				sideBarWidth,
				handleOpenExprot,
				closeDialogExport,
				supplierChange
			}
		}
	}
</script>

<style lang="scss" scoped>
.pageViews {
	background: #fff;
	padding: 20px 24px;

	.flex {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
}

.btnList {
	text-align: right;
	margin: 24px 0;
}

.ifShow {
	color: #409eff;
}

.extraHeader {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 54px;
	background-color: #f5f7fa;
	font-size: 14px;
	padding: 0 20px;
}

.goodsDetail,
.outStoreType,
.date,
.operation,
.change,
.newHouse,
.wareHouse,
.categoryName,
.store,
.onPrice,
.price,
.outPrice,
.newPrice,
.variety {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.65);
}

.goodsDetail {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: rgba(0, 0, 0, 0.65);
	height: 100px;
	.right {
		margin-left: 16px;
		text-align: left;

		// display: flex;
		// flex-direction: column;
		// justify-content: space-between;
		a {
			color: #409eff;
		}
	}
}

.operation {
	a {
		margin-right: 10px;
		color: #409eff;
	}

	a:last-of-type {
		margin: 0;
	}
}
.categoryFont {
	margin-left: 10px;
	width: 300px;
	overflow: hidden;
	white-space: nowrap; //表示不换
	text-overflow: ellipsis; //加省略号;
}
.skuFont {
	width: 250px;
	// margin-top: 2px;
	// margin-bottom: 2px;
	font-weight: 600;
	p {
		overflow: hidden;
		white-space: nowrap; //表示不换
		text-overflow: ellipsis; //加省略号;
	}
}

.skus {
	width: 250px;
	margin-bottom: 2px;
	p {
		overflow: hidden;
		white-space: nowrap; //表示不换
		text-overflow: ellipsis; //加省略号;
	}
}

.numberAdd {
	color: #52c41a;

	p {
		color: #ff4d4f;
	}
}

.numberMinus {
	color: #52c41a;
}

.detailList {
	width: 100%;
	display: flex;
	flex-wrap: wrap;

	.item {
		display: flex;
		width: calc((100% - 48px) / 4);
		height: 110px;
		border: 1px solid #eee;
		padding: 12px;
		margin-right: 16px;
		margin-bottom: 10px;

		.right {
			flex: 1;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.45);
			margin-left: 16px;
			overflow: hidden;

			div {
				margin-bottom: 4px;
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.item:nth-of-type(4) {
		margin-right: 0;
	}
}

// .tableView table tbody .checkboxTd {
//   background-color: #fff;
// }
.headCome {
	padding-bottom: 60px;
	.detailsModal {
		:deep(.el-dialog__body) {
			padding-top: 10px;
		}
	}

	.headContent {
		background: #fff;
		padding: 15px 30px;
		padding-bottom: 1px;
	}
	.headContent {
		:deep(.el-input--suffix .el-input__inner) {
			height: 32px;
		}
		// :deep(.el-form-item) {
		// 	margin-bottom: 13px;
		// }
		:deep(.el-input) {
			line-height: 32px;
		}

		:deep(.el-range-editor--small .el-range-separator) {
			width: 38px;
		}
	}

	:deep(.el-input__inner) {
		height: 32px;
	}

	/* 表格样式 */

	/* 按钮 */
	.buttonClass {
		display: flex;
		justify-content: space-between;
		margin: 24px 0;
	}
	//增加固钉样式
	.el-affix {
		width: calc(100% - v-bind(sideBarWidth) - 50) !important;
	}
}

a {
	color: #fff;
}
</style>
