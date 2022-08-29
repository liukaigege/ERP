<template>
	<div class="headDelivery">
		<div class="delieveryContent">
			<el-form :model="form" :inline="true" @keydown.enter='search'>
				<el-form-item label="时间范围:">
					<el-select style="width: 140px" v-model="form.timeType">
						<el-option label="扫描时间" value="0"></el-option>
						<el-option label="发货时间" value="1"></el-option>
					</el-select>
				</el-form-item>
				<!-- //时间 -->
				<el-form-item>
					<el-date-picker v-model="form.creatTime" type="daterange" style="width: 280px; margin-left: 16px;" range-separator="至" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="onchanges">

					</el-date-picker>
				</el-form-item>
				<el-form-item label="发往国家:" style="margin-left: 16px;">
					<el-select style="width: 140px" v-model="form.country" clearable @clear="form.country='全部'">
						<el-option v-for="item in sendCountry" :key="item.countryName" :label="item.countryName" :value="item.countryName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="物流方式:" style="margin-left: 16px">
					<el-cascader v-model="form.logistics" :props="{label:'name',children:'billWays',checkStrictly: true,expandTrigger: 'hover'}" :options="transport" clearable @change="cascaderChange" style="width:140px"></el-cascader>
				</el-form-item>
				<el-form-item label="打单员:">
         <el-select style="width:140px" v-model="form.printBy" clearable @clear="form.printBy=''">
          <el-option  label="全部" value="" ></el-option>
          <el-option v-for="item in printUser" :key="item.id" :label="item.name" :value="item.id" ></el-option>
         </el-select>
				</el-form-item>
				<el-form-item label="发货员:" style="margin-left: 16px">
					<el-select style="width: 140px" v-model="form.deliveryBy" clearable @clear="form.deliveryBy=''">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in deliveryBys" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="扫描包裹类型:" style="margin-left: 16px">
					<el-select style="width: 140px" v-model="form.sysOrder" clearable @clear="form.sysOrder='0'">
						<el-option label="全部" value="0"></el-option>
						<el-option label="系统订单" value="1"></el-option>
						<el-option label="店小秘订单" value="2"></el-option>
					</el-select>
				</el-form-item>
				<!-- <br /> -->
				<!-- 搜索内容 -->
				<el-form-item label="搜索内容:">
					<el-select style="width: 140px" v-model="form.searchContentTypeId">
						<el-option label="订单号" value="0"></el-option>
						<el-option label="包裹号" value="1"></el-option>
						<el-option label="运单号" value="2"></el-option>
					</el-select>
					<el-input clearable placeholder="请输入要检索的内容多条可用逗号或空格隔开" style="width: 330px; margin-left: 16px" v-model="form.searchContent"></el-input>
				</el-form-item>
				<el-form-item label=" ">
					<el-button type="primary" @click="search">查询</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 导出按钮 -->
		<div class="diliveryButton">
			<el-button type="primary" @click="exported"> 导出 </el-button>
		</div>
		<!-- 表格部分 -->
		<div class="diliveryTable" v-loading="loading">
			<el-table style="width: 100%" :data="data" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="包裹号/订单号" width="220" align="left">
					<template #default="scope">
						<el-tooltip placement="right">
							<template #content>
								<a v-copy="scope.row.packageId" style="">复制</a>
							</template>
							<div>{{ scope.row.packageId }}</div>
						</el-tooltip>
						<el-tooltip placement="right">
							<template #content>
								<a v-copy="scope.row.orderId" style="">复制</a>
							</template>
							<div>{{ scope.row.orderId }}</div>
						</el-tooltip>

					</template>
				</el-table-column>
				<el-table-column label="物流方式/运单号" width="220" align="left">
					<template #default="scope">
						<div>{{ scope.row.logistics }}
							<span v-if="scope.row.lgtcLine">-</span>
							{{ scope.row.lgtcLine }}{{scope.row.trackType?' - 手工':''}}
						</div>
						<el-tooltip placement="top">
							<template #content>
								<a v-copy="scope.row.trackNumber" style="">复制</a>
							</template>
							<div style="color: #1890ff">{{ scope.row.trackNumber }}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="发货商品件数" width="120" align="center" prop="goodsCount" />
				<el-table-column label="发往国家" width="100" align="center" prop="country" />
				<el-table-column label="重量（g）" width="80" align="center" prop="weight" />
        <el-table-column label="打单员" width="100" align="center" prop="printUserName" />
				<el-table-column label="扫描员" width="100" align="center" prop="createUserName" />
				<el-table-column label="扫描时间" width="90" align="center" prop="createTime" />
				<el-table-column label="发货仓库" width="120" align="center" prop="warehouseName">
					<template #default="scope">
						<div>{{scope.row.warehouseName?scope.row.warehouseName:'万众智谷仓'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="发货员" width="100" align="center" prop="deliveryUserName" />
				<el-table-column label="发货时间" width="90" align="center" prop="deliveryTime" />
				<el-table-column label="备注" align="center" >
					<template #default="scope">
						<div class="contentClass">
							<div class="inputClass">
								<el-input :title="scope.row.remark" maxlength="50" class="inputFont" style="width: 90%; position: relative;" v-model="scope.row.remark" :disabled="scope.row.remarkDisabled" />
								<a class="eidtClass" @click="edit(scope.row)">{{
                  scope.row.remarkDisabled ? '编辑' : '保存'
                }}</a>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div class="flex-pagination page-fixed">
			<div>
				<el-checkbox v-model="checkedList">已选择<span style="color: #1890ff">{{ selectOptions ? selectOptions.length : 0 }}条</span></el-checkbox>
			</div>
			<div>
				<el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
				</el-pagination>
			</div>
		</div>
		<!-- 导出的弹框 -->
		<Exported v-if="exportedDialog" @close="close" @inits="inits" :form="form" :selectOptions="selectOptions" />
	</div>
</template>

<script>
	import moment from 'moment'
	import { reactive, toRefs } from 'vue'
	import Exported from '@/views/order/orderProcessing/delivery/components/exported.vue'
	import { copy } from '@/directives/erpToolsDirective'
	import {
		getDelivery, //// 列表查询
		updateRemarks, // U31.更新发货备注
		getRceivers, //收货员列表
    getPrintUser,//打单员
	} from '@/api/order/orderProcessing.js'
	import { countryCode, channelWithManual } from '@/api/order/orderManagement.js'
	import { onMounted } from 'vue'
	import { ElMessage } from 'element-plus'
	import { resetForm } from '@/utils/tool.js'
	export default {
		name: 'Delivery',
		components: {
			Exported
		},
		directives: { copy },
		setup(props, { attrs, emit }) {
			const state = reactive({
				loading: true,
				selectOptions: [], //选择的数据存储
				deliveryBys: [],
				checkedList: false,
				exportedDialog: false,
				paginationTotal: 0, //分页总数据条数
				paginationArr: [10, 20, 30, 40, 100], //分页每页选择条数默认数据
				form: {
					creatTime: [],
					timeType: '1',
					startDate: '',
					endDate: '',
					country: '全部',
					logistics: [''], //物流方式
					lgtcLine: '',
					deliveryBy: '',
					searchContentTypeId: '',
					searchContent: '',
					sysOrder: '0',
          printBy:'',
				},
        printUser:[],
				page: {
					pageSize: 10, //分页
					pageNo: 1 //分页
				},
				sendCountry: [],
				transport: [], //物流方式
				data: []
			})
			// 1.表格里的输入框点击事件
			const edit = (val) => {
				// val.remarkDisabled=false
				if (val.remarkDisabled) {
					val.remarkDisabled = false
				} else {
					val.remarkDisabled = true
					let params = {
						id: val.id,
						remark: val.remark
					}
					updateRemarks(params).then(res => {
						if (res.code == 200) {
							//  ElMessage.success(res.message)
						}
					})
				}

			}
			//2.点击导出按钮显示弹框
			const exported = () => {
				console.log(111);
				state.exportedDialog = true
				console.log(state.exportedDialog);
			}
			//3.导出的关闭事件
			const close = () => {
				state.exportedDialog = false
			}
			//导出完成后刷新页面
			const inits = () => {
				init()
			}
			//4.分页
			const handleSizeChange = val => {
				state.page.pageSize = val
				state.page.pageNo = 1
				init()
			}
			const handleCurrentChange = val => {
				state.page.pageNo = val
				init()
			}
			//5.表格的选择事件
			const handleSelectionChange = e => {
				// 勾选复选框事件
				state.selectOptions = []
				e.forEach(item => {
					state.selectOptions.push(item.id)
				})
				console.log(state.selectOptions, 'state.selectOptions');
				state.checkedList = state.selectOptions && state.selectOptions.length ? true : false
			}
			//6.一进来时候初始事件
			const init = () => {
				state.loading = true
				let {
					timeType,
					deliveryBy,
					searchContentTypeId,
					searchContent,
					sysOrder,
          printBy
				} = state.form,
					params = {
						timeType,
						deliveryBy,
						searchContentTypeId,
						searchContent,
						sysOrder,
            printBy
					};
				params.page = state.page
				params.country = state.form.country == '全部' ? '' : state.form.country
				params.logistics = state.form.logistics.length ? state.form.logistics[0] : '' // 物流方式
				params.lgtcLine = state.form.logistics.length ? state.form.logistics[1] : '' // 物流专线
				params.startDate = state.form.startDate
				params.endDate = state.form.endDate
				getDelivery(params).then(res => {
					if (res.code == 200) {
						state.loading = false
						state.data = res.data.dataList
						state.paginationTotal = res.data.page.totalCount
						state.data.forEach((item => {
							item.remarkDisabled = true
						}))

					}
				})
			}

			//7. onMounted加载
			onMounted(() => {
				state.form.creatTime = [moment().endOf('day')
					.subtract(0, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')
				],
					state.form.startDate = moment().endOf('day')
						.subtract(0, 'days').format('YYYY-MM-DD 00:00:00'),
					state.form.endDate = moment().format('YYYY-MM-DD 23:59:59')

				init()
			})
			//8.点击查询时候事件
			const search = () => {
				init()
			}
			//9.收货员列表
			getRceivers().then(res => {
				if (res.code == 200) {
					console.log(res)
					state.deliveryBys = res.data.list
				}
			})
      //打单员列表
      getPrintUser().then(res=>{
        state.printUser = res.data
        console.log(res,'res');
      })
			//9.发往国家相关
			countryCode().then(res => {
				state.sendCountry = [{ countryName: '全部' }, ...res.data]
			})
			//物流方式
			channelWithManual().then(res => {
				console.log(res);
				state.transport = [{ name: '全部', value: '' }, { name: '其他', value: 'other' }, ...res.data]
			})
			//发往国家
			const cascaderChange = e => {
				if (!e) {
					state.form.logistics = ['']
				}
			}
			//重置按钮
			const reset = () => {
				let restForm = {
					creatTime: [moment().endOf('day')
						.subtract(0, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')
					],
					timeType: '1',
					startDate: moment().endOf('day')
						.subtract(0, 'days').format('YYYY-MM-DD 00:00:00'),
					endDate: moment().format('YYYY-MM-DD 23:59:59'),
					country: '全部',
					logistics: [''], //物流方式
					lgtcLine: '',
					deliveryBy: '',
					searchContentTypeId: '',
					searchContent: '',
					sysOrder: '0',
          printBy:''
				}

				resetForm(state.form, restForm)
				init()
			}
			const onchanges = (e) => {
				console.log(e);
				state.form.startDate = e ? e[0] + ' 00:00:00' : ''
				state.form.endDate = e ? e[1] + ' 23:59:59' : ''
			}
			return {
				...toRefs(state),
				edit,
				close,
				exported,
				handleSizeChange,
				handleCurrentChange,
				handleSelectionChange,
				init,
				inits,
				search,
				cascaderChange,
				reset,
				onchanges
			}
		}
	}
</script>

<style lang="scss" scoped>
.headDelivery {
	padding-bottom: 60px;
	.inputFont {
		overflow: hidden;
		white-space: nowrap; //表示不换
		text-overflow: ellipsis; //加省略号;
	}

	.delieveryContent {
		background: #fff;
		padding: 20px 30px;
		padding-bottom: 1px;
		:deep(.el-form--inline .el-form-item) {
			margin-right: 0;
		}
		:deep(.el-input--suffix .el-input__inner) {
			height: 32px;
		}

		:deep(.el-input__inner) {
			height: 32px;
		}

		:deep(.el-input) {
			line-height: 32px;
		}

		:deep(.el-button) {
			height: 31px;
		}

		:deep(.el-range-editor--small .el-range-separator) {
			width: 38px;
		}
	}

	.diliveryButton {
		text-align: right;
		padding: 20px 0;
	}

	.diliveryTable {
		background-color: #ffffff;
		border-radius: 2px 2px 2px 0px;
		padding: 20px 25px;
		// margin-top: 30px;
		:deep(table) {
			tbody {
				font-size: 12px;
			}
		}

		:deep(.el-input__inner) {
			height: 32px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			padding-right: 50px;
		}

		// :deep(.el-input__inner){
		//     border-right:0

		// }
		:deep(.el-input-group__append, .el-input-group__prepend) {
			background-color: #fff;
		}

		.eidtClass {
			color: #1890ff;
			position: absolute;
			margin-left: -38px;
			// right: 50px;
			line-height: 32px;
		}

		.contentClass {
			position: relative;
		}
	}
}
a {
	color: #fff;
}
</style>
