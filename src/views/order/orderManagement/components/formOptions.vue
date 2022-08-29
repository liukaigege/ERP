<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-14 18:13:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 20:00:52
-->

<template>
	<div class="formOptions">
		<el-form
			:model="form"
			:inline="true"
			class="demo-form-inline"

			:rules="rules"
			v-options:form="'timeFrame'"
			:disabled="disabled"
		>
			<el-form-item label="时间范围:">
				<el-select
					v-model="form.timeType"
					placeholder="选择时间范围"
					v-if="isShow('timeFrame')"
				>
					<el-option
						v-for="(item, index) in timeTypes"
						:key="index"
						:value="item.value"
						:label="item.label"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="date">
				<el-date-picker
					v-model="daterange"
					type="datetimerange"
					:default-time="defaultTime"
					range-separator="→"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD HH:mm:ss"
          unlink-panels
					@change="changeDate"
				/>
			</el-form-item>

			<el-form-item label="国家:" prop="country " v-if="isShow('country')">
				<el-select
					v-model="form.country"
					filterable
					placeholder="请选择"
					clearable
				>
					<el-option label="全部" value="" />
					<el-option
						v-for="country in countrys"
						:key="country.countryName"
						:label="country.countryName"
						:value="country.countryName"
					/>
				</el-select>
			</el-form-item>

			<el-form-item
				label="订单来源:"
				prop="source"
				v-if="isShow('orderSource')"
			>
				<el-cascader
					ref="sources"
					v-model="source"
					:options="sourceList"
					:props="sourceProps"
					@change="getChangeSource"
					clearable
					filterable
				></el-cascader>
			</el-form-item>

			<el-form-item
				label="归属部门:"
				prop="deptIds"
				v-if="isShow('department')"
			>
				<el-cascader
					:props="deptProps"
					ref="deptIdsRef"
					v-model="form.deptIds"
					:options="platformList"
					clearable
					collapse-tags
					@change="getDepIds"
				>
				</el-cascader>
			</el-form-item>

			<el-form-item
				label="物流方式:"
				prop="platform"
				v-if="isShow('logistics')"
			>
				<el-cascader
					ref="logistRef"
					:options="logisticList"
					placeholder="请选择物流方式"
					:props="caProps"
					@change="selectedLogis"
					v-model="logist"
					style="width: 300px"
					clearable
				>
				</el-cascader>
			</el-form-item>

			<el-form-item label="订单类型:" prop="type" v-if="isShow('orderType')">
				<el-select v-model="form.type" placeholder="请选择" clearable>
					<!-- <el-option label="全部" value /> -->
					<el-option label="客户订单" :value="0" />
					<el-option label="手工订单" :value="1" />
					<!-- <el-option label="补发包裹" :value="2" />
					<el-option label="补发赠品" :value="3" /> -->
				</el-select>
			</el-form-item>

			<el-form-item
				label="包裹类型:"
				prop="packageType"
				v-if="isShow('packgeType')"
			>
				<el-select v-model="form.packageType" placeholder="全部" multiple  clearable>
					<el-option label="单品单数" :value="1" />
					<el-option label="单品多数" :value="2" />
					<el-option label="多品混包" :value="3" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="支付方式:"
				prop="paymentMethod"
				v-if="isShow('payMethond')"
			>
				<el-cascader
					v-model="form.paymentMethod"
					:options="paymethodsList"
					:props="payProps"
					:show-all-levels="false"
					@change="val => changePayMent(val)"
					clearable
				></el-cascader>
			</el-form-item>
			<el-form-item
				label="商品类型:"
				prop="goodAttribute"
				v-if="isShow('goodAttribute')&&form.orderStatus==8"
			>
				<el-select v-model="form.goodAttribute" placeholder="全部" clearable>
					<el-option label="原品" :value="1" />
					<el-option label="相似品" :value="2" />
					<el-option label="替代品" :value="3" />
				</el-select>
			</el-form-item>


			<el-form-item label="商品属性:" prop="cod" v-if="isShow('goodsAttr')" style='width: 330px'>
				<!-- 1定制商品 2带电商品 3带磁商品 4液体商品 5含粉末商品 6侵权商品 7有赠品 8普通商品 9定制(普)商品 -->
				<el-select v-model="form.attribute" placeholder="请选择" clearable >
					<el-option label="全部" value="" />
					<el-option label="定制商品" value="1" />
					<el-option label="普通商品" value="8" />
					<el-option label="定制(普)商品" value="9" />
					<el-option label="带电商品" value="2" />
					<el-option label="带磁商品" value="3" />
					<el-option label="液体商品" value="4" />
					<el-option label="含粉末商品" value="5" />
					<el-option label="侵权商品" value="6" />
					<el-option label="赠品" value="7" />
				</el-select>
			</el-form-item>

			<el-form-item label="商品品类:" prop="categoryId">
				<el-cascader v-model="form.categoryId" :options="categoryList" :props="categoryProps" style="width: 140px" clearable></el-cascader>
			</el-form-item>

		 <el-form-item label="是否退款:" prop="cod" v-if="isShow('refund')" style='width: 330px'>
				<el-select v-model="form.refundFlag" placeholder="请选择" clearable >
					<el-option label="全部" value="" />
					<el-option label="是" value="0" />
					<el-option label="否" value="1" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="订单状态:"
				prop="orderStatus"
				v-if="isShow('orderStatus')"
			>

				<el-select v-model="form.orderStatus" placeholder="请选择" clearable multiple>
					<el-option label="待审核" :value="0" />
					<el-option label="待处理" :value="1" />
					<el-option label="运单号申请中" :value="2" />
					<el-option label="运单号申请失败" :value="3" />
					<el-option label="运单号申请成功" :value="4" />
					<el-option label="待打单(有货)" :value="5" />
					<el-option label="待打单(缺货)" :value="6" />
					<el-option label="待发货" :value="7" />
					<el-option label="已发货" :value="8" />
					<el-option label="未付款" :value="9" />
					<el-option label="已退款" :value="10" />
					<el-option label="更换待处理" :value="-1"  v-if="orderStatus !==11 && orderStatus !=='' " />
					<el-option label="更换待打单" :value="-2"  v-if="orderStatus !==11 && orderStatus !=='' " />
					<el-option label="更换待发货" :value="-3"  v-if="orderStatus !==11 && orderStatus !=='' " />
					<el-option label="更换已交运成功" :value="-4"  v-if="orderStatus !==11 && orderStatus !=='' " />
				</el-select>
			</el-form-item>


						<el-form-item
							label="是否搁置:"
							prop="layFlag"
							v-if="isShow('shelve')"
						>
							<el-select v-model="form.layFlag" placeholder="请选择" clearable>
								<el-option label="是" :value="1" />
								<el-option label="否" :value="0" />
							</el-select>
						</el-form-item>

			<el-form-item
				label="订单支付状态:"
				prop="paymentStatus"
				v-if="isShow('paymentStatus')"
			>
				<el-select v-model="form.paymentStatus" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="待支付" :value="'unpaid'" />
					<el-option label="支付失败" :value="'pay_fail'" />
					<el-option label="取消订单" :value="'voided'" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="订单金额:"
				prop="minPriceUsd"
				v-if="isShow('orderPrice')"
			>
				<div class="priceUsd">
					<el-input v-model="form.minPriceUsd" placeholder="请输入" clearable />
					<div class="arrow">→</div>
					<el-input v-model="form.maxPriceUsd" placeholder="请输入" clearable />
				</div>
			</el-form-item>

			<el-form-item
				label="商品数量:"
				prop="minGoodsCount"
				v-if="isShow('goodsNum')"
			>
				<div class="priceUsd">
					<el-input
						v-model="form.minGoodsCount"
						placeholder="请输入"
						clearable
					/>
					<div class="arrow">→</div>
					<el-input
						v-model="form.maxGoodsCount"
						placeholder="请输入"
						clearable
					/>
				</div>
			</el-form-item>

			<el-form-item
				label="库存分配:"
				prop="priorityFlag"
				v-if="isShow('priorityFlag')"
			>
				<el-select v-model="form.priorityFlag" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="优先分配库存" :value="1" />
					<el-option label="正常分配库存" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="库存状态:"
				prop="deductFlag"
				v-if="isShow('deductFlag')"
			>
				<el-select v-model="form.deductFlag" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="扣库存" :value="1" />
					<el-option label="不扣库存" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="申请状态:"
				prop="orderStatus"
				v-if="isShowOrderStatus"
			>
				<el-select v-model="form.applyStatus" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="申请中" :value="2" />
					<el-option label="申请成功" :value="1" />
					<el-option label="申请失败" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="处理状态:"
				prop="forbidFlag"
				v-if="isShow('forbidFlag')"
			>
				<el-select v-model="form.forbidFlag" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="禁止处理" :value="1" />
					<el-option label="正常处理" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item label="匹配状态:" prop="match" v-if="isShow('match')">
				<el-select v-model="form.match" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="已匹配" :value="1" />
					<el-option label="未匹配" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item label="采购状态:" prop="purchaseStatus"  v-if="isShow('purchaseStatus')">
				<el-select v-model="form.purchaseStatus" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="未采购" :value="0" />
					<el-option label="采购在途" :value="1" />
					<el-option label="到货" :value="2" />
				</el-select>
			</el-form-item>

			<el-form-item label="打单状态:" prop="printFlag" v-if="isShowPrintFlag">
				<el-select v-model="form.printFlag" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="打单" :value="1" />
					<el-option label="补打单" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item label="快速物流:" prop="rapidLogisticsFlag">
				<el-select v-model="form.rapidLogisticsFlag" placeholder="请选择" clearable>
					<el-option label="全部" value="" />
					<el-option label="是" :value="1" />
					<el-option label="否" :value="0" />
				</el-select>
			</el-form-item>

			<el-form-item
				label="搜索内容:"
				prop="searchText"
				v-if="isShow('searchText')"
			>
				<div class="searchTxt">
					<!-- slot="prepend" -->
					<el-select
						v-model="form.searchType"
						placeholder="请选择"
						clearable
					>
						<el-option
							v-for="item in searchTypes"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
					<el-input
						v-model="form.searchText"
						clearable
						:placeholder="form.searchType === 'transcationId' ?'请输入要检索的内容多条可用逗号隔开':'请输入要检索的内容多条可用逗号或空格隔开'"
						class="input-with-select searchTxt"
					>
					</el-input>
				</div>
			</el-form-item>
			<div class="form_btn" v-if="isShow('packgeForm')">
				<el-form-item label="包裹形式:" prop="packageForms">
					<el-checkbox-group
						v-model="packageForms"
						@change="changePackgeFormId"
					>
						<el-checkbox
							v-for="item in [{
								id:1,
								name:'补发包裹'
							},{
								id:2,
								name:'补发赠品'
							},{
								id:3,
								name:'拆分包裹'
							},{
								id:4,
								name:'合并包裹'
							}]"
							:key="item.id"
							:label="item.id"
							>{{ item.name }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
			</div>
			<div class="form_btn" v-if="isShow('remark')">
				<el-form-item label="备注:" prop="remarkTypeId">
					<el-checkbox-group
						v-model="remarkTypeId"
						@change="changeRemarkTypeId"
					>
						<el-checkbox
							v-for="item in remarkNames"
							:key="item.id"
							:label="item.id"
							>{{ item.name }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<div class="btnL">
						<el-button type="primary" @click="init(1)">查 询</el-button>
						<el-button @click="resert">重 置</el-button>
					</div>
				</el-form-item>
			</div>
		</el-form>

		<div class="page">
			<div>
				<el-checkbox
					v-model="checked"
					:indeterminate="showIndeter()"
					@change="changeAll"
				></el-checkbox>
				已选 <span style="color: #1890ff">{{ selectedLength }}</span> 条
			</div>
			<div>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="form.page.pageNo"
					:page-sizes="[100, 200, 300, 500, 1000]"
					:page-size="form.page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import {
	computed,
	reactive,
	toRefs,
	onMounted,
	getCurrentInstance,
	ref,
	watch,
	inject,
	nextTick
} from 'vue'
import { useStore } from 'vuex'
import {
	countryCode,
	getSourceDomains,
	remarkTypeNames,
	orderList,
	paymethods,
	channelWithManual,
	getRemarkTypes
} from '@/api/order/orderManagement.js'
import moment from 'moment'
import orderOptions from '@/views/order/orderManagement/util/options.js'
import { resetForm, changeNull } from '@/utils/tool.js'
import { getDepartmentList } from '@/api/user.js'
import { getCategory} from '@/api/goods/quotedPrice.js'
import { ElMessage } from 'element-plus'
import { deepCopy } from '../../../../utils/tool'
export default {
	props:{
		defaultData:{
			type:Object,
			default:null
		}
	},
	setup(props, context) {
		const store = useStore()
		const sources = ref(null) // 订单来源
		const logistRef = ref(null) // 物流方式
		const deptIdsRef = ref(null) // 部门
		const { proxy } = getCurrentInstance()
		const orderStatus = computed(() => store.getters.orderType)
		console.log('orderStatus=',orderStatus.value)
		const orderTabTypeName = computed(() => store.getters.orderTabType)
		const orderTable = inject('orderTable')
		// 获取的orderTable 组件
		const tabHeader = inject('tabHeader')
		// 获取的tabHeader 组件

		const sortRef = inject('sortRef')
		// sort 组件

		const checkedSelect = computed(() => orderTable.value.selectRows)
		const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
		const data = reactive({
			defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 1, 1, 23, 59, 59)],
			categoryList:[],//品类数组
			categoryProps:{
				value: 'id',
				label: 'name',
				children: 'child',
				emitPath: false,
				checkStrictly: true
			},
			daterange: [],
			logist: null,
			form: {
				// start: moment()
				// 	.endOf('day')
				// 	.subtract(30, 'days')
				// 	.format('YYYY-MM-DD HH:mm:ss'),
				// //开始时间
				// end: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
				start:null,
				end:null,
				timeType: 'orderTime', //时间类型
				purchaseStatus:null,//采购状态
				country: '', //国家
				categoryId:null,// 品类id
				packageType: '', //包裹类型 1:单品单数,2: 单品多数,3: 多品多数
				logistics: '', //物流方式
				lgtcLine: '', //物流专线
				source: '', //订单来源
				tempDomain: '', // 临时域名
				deptIds: [], // 歸屬部分
				platform: '', //归属部门
				paymentType: '', // 支付类别
				domain: '', //订单域名
				orderStatus: [1], //包裹状态 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、7待发货、8已发货、99未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功
				paymentMethod: '', //支付方式
				minPriceUsd: '', //订单金额，最小值
				maxPriceUsd: '', //订单金额，最大值
				minGoodsCount: '', //商品数量，最小值
				maxGoodsCount: '', //	商品数量，最大值
				searchText: '', //检索框内容， 多个用英文逗号隔开
				searchType: 'packageId', //检索：orderId订单号,packageId包裹号,trackNumber运单号（以上支持多个精确检索）skuId skuId查询 packageSku产品SKU,goodsSku商品SKU,name收件人名称,email收件人邮箱(支持单个模糊检索)，goodsName商品中文名名称，spuName产品名称（店铺）
				priorityFlag: '', //库存分配：0不优先，1优先
				deductFlag: '', //库存状态：1扣库存订单，0不扣库存订单
				forbidFlag: '', //	处理状态：1禁止处理，0不禁止处理
				remarkTypeId: '', //备注类型Id,多个用英文逗号隔开，String 类型
				packageForms:'',//包裹形式Id,多个用英文逗号隔开，String 类型
				paymentStatus: '', // 订单支付状态
				// shelve:null, // 是否搁置
				sortType: 'asc',
				sortName: 'o.create_time',
				layFlag: null,
				shelve:null, // 是否搁置
				type: null, //订单类型
				attribute: '', //商品属性
				applyStatus: '', // 申请状态
				printFlag: '', //打单状态 0 补打单 1 打单
				rapidLogisticsFlag:'',//是否快速物流 0否 1是
				match: '', // 是否匹配
				refundFlag:'',//是否退款
				page: {
					pageSize: 100,
					pageNo: 1
				},
				infoCodeFlag: null, //合并 1 可合并、2 已合并、3 已拆分 查询标识
				goodAttribute:'',//商品类型 1原品、2相似品、3替代品
			},
			countrys: [], // 国家
			paymethodsList: [], // 支付方式
			searchTypes: [
				{
					label: '订单号',
					value: 'orderId'
				},
				{
					label: '包裹号',
					value: 'packageId'
				},
				{
					label: '运单号',
					value: 'trackNumber'
				},
				{
					label: '原运单号',
					value: 'oldTrackNumber'
				},
				{
					label: '交易号',
					value: 'transcationId'
				},
				{
					label: '商品SKU',
					value: 'goodsSku'
				},
				{
					label: '平台SKU',
					value: 'packageSku'
				},
				{
					label: '收件人名称',
					value: 'name'
				},
				{
					label: '收件人邮箱',
					value: 'email'
				},
				{
					label: '商品中文名称',
					value: 'goodsName'
				},
				{
					label: '产品名称（店铺）',
					value: 'spuName'
				},
				// {
				// 	label: '平台订单号',
				// 	value: 'transcationId'
				// },
				{
					label: '第三方订单号',
					value: 'thrId'
				},
				{
					label: 'skuId',
					value: 'skuId'
				},{
					label: '买家指定',
					value: 'shippingsMethod'
				}
			],
			remarkTypeId: [], //备注
			packageForms:[],
			remarkNames: [],
			sourceList: [], // 订单来源
			source: [], //
			sourceProps: {
				children: 'tempDomains',
				checkStrictly: true,
				leaf: 'value',
				value: 'label',
				label: 'label',
				// expandTrigger:'hover'
			},

			total: 0,
			checked: false,
			selectedLength: 0,
			isIndeterminate: true,
			deptIds: [],
			platformList: [],
			logisticList: [], //物流方式
			caProps: {
				value: 'value',
				label: 'name',
				children: 'billWays'
			},
			deptProps:{
				emitPath: true,
				multiple: true,
				value: 'deptId',
				label: 'deptName',
				children: 'children',
			},
			payProps: {
				expandTrigger: 'hover',
				value: 'paymentType',
				label: 'paymentType',
				children: 'paymentMethods',
				checkStrictly: true
			}
		})
		const tabType = computed(() => store.getters.orderTabType)
		const intiTime = computed(() => store.getters.initTimeStemab)
		const initPageClear = computed(() => store.getters.initPageClear)

		const timeTypes = computed(() => {
			const { orderStatus, orderTabType, isChangeLogist, changeLogisticType } =
				store.getters
			const list = [
				{
					label: '下单时间',
					value: 'orderTime'
				},
				{
					label: '付款时间',
					value: 'payTime'
				},
				{
					label: '打单时间',
					value: 'printTime'
				},
				{
					label: '发货时间',
					value: 'deliveryTime'
				},

				{
					label: '搁置时间',
					value: 'shelveTime'
				},
				{
					label: '退款时间',
					value: 'lastRefundTime'
				},
			]

			let timeType
			let switchList = [
				'toBeReviewed',
				'pending',
				'applying',
				'fail',
				'success',
				'inStock',
				'outStock'
			]
			let switchListAll = ['allOrder', 'byTransportation', 'shelve']
			let changeLogistList = ['pending', 'waitPrint']
			if (switchList?.indexOf(orderTabType) !== -1) {
				timeType = [list[0], list[1]]
			}

			if (orderTabType == 'toBeDelivered') {
				timeType = [list[0], list[1], list[2]]
			} // 待发货

			if (orderTabType == 'toBePaid') {
				timeType = [list[0], list[1]]
			} // 未付款
			if (orderTabType == 'refunded') {
				timeType = [list[0], list[1], list[2],list[3],list[5]]
			} // 未付款

			if (switchListAll?.indexOf(orderTabType) !== -1) {
				timeType = list
			}

			if (isChangeLogist) {
				if (changeLogistList?.indexOf(changeLogisticType) !== -1) {
					timeType = [list[0], list[1]]
				}
				if (changeLogisticType == 'toBeDelivered') {
					timeType = [list[0], list[1], list[2]]
				}
				if (changeLogisticType == 'orderSuccess') {
					timeType = [list[0], list[1], list[2],list[3],list[4]]
				}
			}

			return timeType
		}) // 获取时间范围的下拉列表


		// watch(intiTime, (a, b) => {
		//     init()
		// })
		// watch(initPageClear, (a, b) => {
		//     init(1)
		// })
		const showIndeter = () => {
			if (
				data.selectedLength > 0 &&
				data.selectedLength < orderTable.value.tableData.length
			)
				return true
			return false
		}

		const changeAll = val => {
			console.log(val)
			if (val) {
				orderTable.value.tableRef.handleCheckAllChange(val)
			} else {
				orderTable.value.tableRef.handleCheckAllChange(val)
				store.dispatch('com/removeSelectRowKeysActions')
				nextTick(() => {
					orderTable.value.tableRef.initFun()
					data.selectedLength = 0
					data.checked = false
					orderTable.value.selectRows = []
				})
			}
		} // 全选

		const checkCount = (rule, value, callback) => {
			const reg = /^\+?[1-9][0-9]*$/
			if (
				data.form.minGoodsCount > 999999 ||
				data.form.maxGoodsCount > 999999
			) {
				callback(new Error('最大商品数量为999999'))
			} else {
				if (data.form.minGoodsCount && data.form.maxGoodsCount) {
					if (+data.form.maxGoodsCount >= +data.form.minGoodsCount) {
						if (
							reg.test(data.form.minGoodsCount) &&
							reg.test(data.form.maxGoodsCount)
						) {
							callback()
						} else {
							callback(new Error('商品数量为正整数'))
						}
					} else {
						callback(new Error('请输入正确的商品数量范围'))
					}
				} else if (data.form.minGoodsCount && !data.form.maxGoodsCount) {
					if (reg.test(data.form.minGoodsCount)) {
						callback()
					} else {
						callback(new Error('商品数量为数正整数'))
					}
				} else if (!data.form.minGoodsCount && data.form.maxGoodsCount) {
					if (reg.test(data.form.maxGoodsCount)) {
						callback()
					} else {
						callback(new Error('商品数量为数正整数'))
					}
				} else {
					callback()
				}
			}
		}

		const checkPrice = (rule, value, callback) => {
			const reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
			if (
				data.form.minPriceUsd > 999999.99 ||
				data.form.maxPriceUsd > 999999.99
			) {
				callback(new Error('最大金额为999999.99'))
			} else {
				if (data.form.minPriceUsd && data.form.maxPriceUsd) {
					if (+data.form.maxPriceUsd >= +data.form.minPriceUsd) {
						if (
							reg.test(data.form.minPriceUsd) &&
							reg.test(data.form.maxPriceUsd)
						) {
							callback()
						} else {
							callback(new Error('金额为数字，最多保留两位小数'))
						}
					} else {
						callback(new Error('请输入正确的金额范围'))
					}
				} else if (data.form.minPriceUsd && !data.form.maxPriceUsd) {
					if (reg.test(data.form.minPriceUsd)) {
						callback()
					} else {
						callback(new Error('金额为数字，最多保留两位小数'))
					}
				} else if (!data.form.minPriceUsd && data.form.maxPriceUsd) {
					if (reg.test(data.form.maxPriceUsd)) {
						callback()
					} else {
						callback(new Error('金额为数字，最多保留两位小数'))
					}
				} else {
					callback()
				}
			}
		}

		const checkSearchText = (rule, value, callback) => {
			const { searchText, searchType } = data.form
			const length =
				searchText?.split(',')?.length || searchText?.split('，')?.length || 0
			if (length > 1000) callback(new Error('最多一千条'))
		}
		const rules = ref({
			minPriceUsd: [{ validator: checkPrice, trigger: 'change' }],
			minGoodsCount: [{ validator: checkCount, trigger: 'change' }],
			searchText: [{ validator: checkSearchText, trigger: 'change' }]
		}) //表单验证

		const resert = (isInit = true) => {
			let start = moment()
				.endOf('day')
				.subtract(30, 'days')
				.format('YYYY-MM-DD 00: 00 :00')
			//开始时间
			let end = moment().format('YYYY-MM-DD HH:mm:ss') // 结束时间
			let Status = orderStatus.value === 11 || !orderStatus.value ? [] : [orderStatus.value] // 当为搁置的时 status 就是null
			// orderStatus.value == 11 是搁置
			console.log(Status,orderStatus.value,'重置状态')
			data.logist = []
			data.source = []
			data.remarkTypeId = []
			data.packageForms = []
			if(orderStatus.value === 10){
				sortRef.value.sortType = 'desc'
				sortRef.value.sortName = 'o.last_refund_time'
				// 退款页面
			}else{
				sortRef.value.sortType = 'asc'
				sortRef.value.sortName = 'o.create_time'
			}
			let orderType = store.getters.orderTabType
			let dateList = ['allOrder','byTransportation']
			if (dateList?.indexOf(orderType) ==-1) {
				data.daterange = []
			} else {
				data.daterange = [
					moment().endOf('day').subtract(30, 'days').format('YYYY-MM-DD 00: 00: 00'),
					moment().format('YYYY-MM-DD HH:mm:ss')
				]
			}
			const form = {
				start: orderStatus.value === '' || orderStatus.value === 8 ? start : null, // 只有已发货和全部订单默认查询时间范围
				end: orderStatus.value === '' || orderStatus.value === 8? end : null,
				page: {
					pageSize: 100,
					pageNo: 1
				},
				orderStatus: Status,
				layFlag: orderStatus.value == 11 ? 1 : null,
				sortType: 'asc',
				sortName: 'o.create_time',
				searchType: 'packageId',
				timeType: 'orderTime'
			}
			console.log(form)

			// function testShowDate(){
			// 			if(orderStatus.value === '' || orderStatus.value === 8) return true
			//
			// } // 检测是否需要展示时间范围

			resetForm(data.form, form)
			if (!isInit) return
			init()
		} // 重置form表单

		const getPlatList = () => {
			getDepartmentList().then(res => {
				data.platformList = clearChildren(res.data)
			})

			function clearChildren(arr){
				arr.forEach(item=>{
					if(item.children?.length>0){
						clearChildren(item.children)
					}else{
						item.children = null
					}
				})
				return arr
			}
		}

		const changeDate = date => {
			if (date) {
				data.form.start = date[0]
				data.form.end = date[1]
			} else {
				data.form.start = data.form.end = null
			}
		} // 选择下单时间

		const changeRemarkTypeId = val => {
			if (val.length) {
				data.form.remarkTypeId = val.join(',')
			} else {
				data.form.remarkTypeId = null
			}
		} // 勾选备注

		function changePackgeFormId(val){
			console.log(val)
			if (val.length) {
				data.form.packageForms = val
			} else {
				data.form.packageForms = null
			}
		}

		const getCountry = () => {
			countryCode().then(res => {
				if (res.code == 200) {
					data.countrys = res.data
				}
			})
		} // 获取国家列表
		const getSource = () => {
			getSourceDomains().then(res => {
				if (res.code == 200) {
					let arr = changeSource(res.data)
					data.sourceList = arr
				}
			})
			function changeSource(arr, type) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].tempDomains && arr[i].tempDomains.length > 0) {
						arr[i].tempDomains = changeSource(arr[i].tempDomains)
						arr[i].label = arr[i].source
						arr[i].value = arr[i].class
					} else if (
						arr[i].domains &&
						arr[i].domains.length > 0 &&
						type !== 1
					) {
						arr[i].tempDomains = changeThree(arr[i].domains)
						arr[i].label = arr[i].tempDomain
						arr[i].value = arr[i].class
					} else if (!arr[i].tempDomains && !arr[i].domains) {
						arr[i] = {
							label: arr[i],
							value: arr[i]
						}
					}
				}
				return arr

			}

			function changeThree(data) {
				for (let i = 0; i < data.length; i++) {
					data[i] = {
						label: data[i],
						value: data[i]
					}
				}
				return data
			}
		} // 获取订单来源

		const getRemark = () => {
			getRemarkTypes({ useScope: '0' }).then(res => {
				if (res.code == 200) {
					data.remarkNames = res.data
				}
			})
		} // 获取备注

		const getPayMethond = () => {
			paymethods().then(res => {
				if (res.code === 200) {
					res.data?.forEach(item => {
						let arr = []
						item.paymentMethods.forEach(it => {
							arr.push({
								paymentType: it
							})
						})
						item.paymentMethods = arr
					})

					data.paymethodsList = res.data
				}
			})
			function getLists(arr) {
				for (let i = 0; i < arr.length; i++) {
					let item = arr[i]
					if (item.paymentType && item.paymentMethods.length > 0) {
						item.value = item.paymentType
						item.label = item.paymentType
					} else {
						let obj = {
							label: item,
							value: item,
							paymentMethods: []
						}
						item = obj
					}
					if (item.paymentMethods && item.paymentMethods.length > 0) {
						item.paymentMethods = getLists(item.paymentMethods)
					}
				}

				return arr
			}
		} // 获取支付方式


		function getForm(){
			let form = deepCopy(data.form)
			if (form.deptIds?.length > 0) {
				form.deptIds = deptIdsRef.value.getCheckedNodes().map(v=>{
					return v.data.deptId
				})
			}
			return form
		}


		const init = (pageNo, scTop = false) => {
			if (pageNo) data.form.page.pageNo = pageNo
			let scrollTop = document.documentElement.scrollTop
			const { orderType } = store.getters
			return new Promise((resolve, reject) => {
				let form = deepCopy(data.form)
				// if(form.searchText && form.searchType ==='packageSku') form.searchText = form.searchText.replace(/\s*/g,"")
				if (form.deptIds?.length > 0) {
					form.deptIds = deptIdsRef.value.getCheckedNodes().map(v=>{
						return v.data.deptId
					})
				}
				if(form.orderStatus instanceof Array){
					form.orderStatus = form.orderStatus?.join(',')
				}else if(form.orderStatus || form.orderStatus === 0){
					form.orderStatus = String(form.orderStatus)
				}
				orderTable.value.loading = true
				//  let copyData = orderTable.value.tableData
				// orderTable.value.tableData =[]

				orderList(changeNull(form))
					.then(res => {
						if (res.code == 200) {
							orderTable.value.tableData = res.data.dataList
							store.dispatch('com/removeSelectRowKeysActions')
							// proxy.$message.success(res.message)
							// tabHeader.value.getStatusNum()
							data.total = res.data.page.totalCount
							if (orderType == 1) orderTable.value.getMergeNum() // 如果在已交运
							resolve(res.data.dataList)
							nextTick(() => {
								tabHeader.value.getStatusNum(true)
								// orderTable.value.tableRef.checkedArr = []
								const { boxStates } = orderTable.value.tableRef
								orderTable.value.tableRef.initFun()
								data.selectedLength = 0
								data.checked = false
								orderTable.value.selectRows = []
								orderTable.value.loading = false
								if (!scTop) {
									document.documentElement.scrollTop = scrollTop
								}
							})

						}
					})
					.catch(err => {
						orderTable.value.loading = false
						console.log(err)
						reject(err)
					})
			})
		}

		const handleSizeChange = val => {
			console.log(val)
			data.form.page.pageSize = val
			init().then(res => {
				if (orderTabTypeName.value == 'pending')
					orderTable.value.getMergeData(res)
			})
		}

		const handleCurrentChange = val => {
			data.form.page.pageNo = val
			init(val).then(res => {
				if (orderTabTypeName.value == 'pending')
					orderTable.value.getMergeData(res)
			})
		}

		const isShow = types => {
			const { orderTabType } = store.getters
			const list = orderOptions[orderTabType].form
			if (list?.indexOf(types) !== -1) {
				return true
			} else {
				return false
			}
		} // 是否显示form项

		const getChangeSource = val => {
			if (val) {
				const { pathLabels } = sources.value.getCheckedNodes()[0]
				console.log( pathLabels)
				data.form.source = pathLabels[0] ? pathLabels[0] : ''
				data.form.domain = pathLabels[2] ? pathLabels[2] : ''
				data.form.tempDomain = pathLabels[1] ? pathLabels[1] : ''
			} else {
				data.form.source = ''
				data.form.domain = ''
				data.form.tempDomain = ''
			}
		} // 获取订单来源

		const disabled = computed(() => {
			const { merageStatus, orderType } = store.getters
			// console.log(store.state.orderManage,'状态')
			return merageStatus !== '0' && orderType == 1

		}) //是否开启disabled

		const getList = () => {
			channelWithManual().then(res => {
				if (res.code == 200) {
					const whiteList = ['pending', 'shelve', 'allOrder']
					res.data.unshift({
						name: '其他',
						value: 'isOther',
						billWays: null
					})
					if (whiteList?.indexOf(orderTabTypeName.value) !== -1) {
						res.data.unshift({
							name: '未选择物流',
							value: '-1',
							billWays: null
						})
					}
					data.logisticList = res.data || []
				}
			})
		} // 获取物流方式列表

		const selectedLogis = val => {
			if (val) {
				data.form.logistics = val[0]
				data.form.lgtcLine = val[1]
			} else {
				data.form.logistics = null
				data.form.lgtcLine = null
			}
		} //选择物流方式

		const isShowOrderStatus = computed(() => {
			const { isChangeLogist, changeLogisticType } = store.getters
			if (isChangeLogist && changeLogisticType == 'pending') return true
			return false
		})

		const isShowPrintFlag = computed(() => {
			const { isChangeLogist, changeLogisticType } = store.getters
			return isChangeLogist
		})

		const changePayMent = val => {
			if (val) {
				data.form.paymentMethod = val[val.length - 1]
				data.form.paymentType = val[0]
			} else {
				data.form.paymentMethod = null
				data.form.paymentType = null
			}
		}

		const getDepIds = val => {
			console.log(val)
		}

		function getCategoryEvent(){
			getCategory().then(res => {
				if (res.code == 200) {
					data.categoryList = res.data
				} else {
					ElMessage.error(res.message)
				}
			})
		}

		onMounted(() => {

			if(orderStatus.value === 10){
				data.form.sortType = 'desc'
				data.form.sortName = 'o.last_refund_time'
				// 退款页面
			}else{
				data.form.sortType = 'asc'
				data.form.sortName = 'o.create_time'
			}
			getCountry()
			getSource()
			getRemark()
			getPayMethond()
			getPlatList()
			getCategoryEvent()
			getList() // 获取物流信息
			// init()

			nextTick(() => {
				let x = document.querySelectorAll('.el-popper ')
				x.forEach(item => {
					item.classList.add('popover')
				})
			})
		})
		return {
			...toRefs(data),
			rules,
			tabType,
			changeDate,
			changeRemarkTypeId,
			changePackgeFormId,
			checkPrice,
			checkCount,
			init,
			intiTime,
			isShow,
			handleSizeChange,
			handleCurrentChange,
			checkedSelect,
			showIndeter,
			resert,
			getChangeSource,
			disabled,
			sideBarWidth,
			selectedLogis,
			isShowOrderStatus,
			sources,
			logistRef,
			deptIdsRef,
			changePayMent,
			changeAll,
			timeTypes,
			isShowPrintFlag,
			getDepIds,
			getForm,
			orderStatus
		}
	}
}
</script>

<style lang="scss" scoped>
.formOptions {
	background: white;
	padding: 25px 30px 0 30px;
	position: relative;
	.page {
		position: fixed;
		bottom: 0;
		left: v-bind(sideBarWidth);
		width: calc(100% - v-bind(sideBarWidth));
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		z-index: 999;
		padding: 10px 10px;
		box-shadow: 10px 10px 5px #888888;
	}
	:deep(.el-pagination) {
		margin-top: 0;
	}
}
.priceUsd {
	width: 224px;
	:deep(.el-input) {
		float: left;
		width: 100px;
		.el-input__inner {
			width: 100px;
			padding-left: 8px;
		}
	}
	.arrow {
		width: 24px;
		height: 32px;

		text-align: center;
		color: #ccc;
		float: left;
	}
}
.searchTxt {
	display: flex;
	align-items: center;
	.input-with-select {
		margin-left: 10px;
	}
}
.form_btn {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	:deep(.el-form-item) {
		margin-bottom: 10px;
	}
	:deep(.el-form-item__content) {
		display: flex !important;
		line-height: 0;
		align-items: center;
	}
}
:deep(.el-form-item--small.el-form-item) {
	min-height: 35px;
}
.searchTxt {
	width: 500px;
}
.btnL {
	min-width: 160px;
}

.popover {
	z-index: 99 !important;
}
:deep(.el-date-editor .el-range-separator) {
	width: 6% !important;
}
</style>
