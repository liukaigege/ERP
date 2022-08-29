<template>
	<div class="supply-container">
		<el-form :model="submitForm" ref="formRef" :rules="submitFormRules" label-width="120px">
			<el-card shadow="never" class="none-border-card">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">订单信息</div>
						<div>
							<el-button type="primary" @click="orderExportShow = true">导入订单</el-button>
							<el-button type="primary" @click="referenceDialogVisible = true">引用订单</el-button>
						</div>
					</div>
				</template>
				<div class="supply-card-body">
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="订单来源:" prop="orders.source">
							<el-cascader class="supply-input" v-model="orderSource" ref="sources" :options="sourceList" :props="sourceProps" @change="getChangeSource" filterable></el-cascader>
						</el-form-item>
						<el-form-item class="supply-form-item" label="订单类型:">
							<el-input class="supply-input" disabled v-model="typeOpts[submitForm.orders.type]"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="订单金额:" prop="orders.totalPrice">
							<el-input class="supply-input" type="text" v-model="submitForm.orders.totalPrice"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="交易号:" prop="orders.transcationId">
							<el-input class="supply-input" v-model="submitForm.orders.transcationId"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="支付方式:" prop="orders.paymentMethod">
							<el-cascader class="supply-input" v-model="submitForm.orders.paymentMethod" :options="paymethodsList" :props="payProps" :show-all-levels="false" @change="changePayMent"></el-cascader>
						</el-form-item>
						<el-form-item class="supply-form-item" label="付款时间:" prop="orders.paymentTime">
							<el-date-picker :disabledDate="date => new Date(date).getTime() > Date.now()" class="supply-input" v-model="submitForm.orders.paymentTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择付款时间"></el-date-picker>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="订单号:">
							<el-input class="supply-input" disabled v-model="submitForm.orders.orderId"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-card>
			<el-card class="mt-20 none-border-card" shadow="never">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">客户信息</div>
					</div>
				</template>
				<div class="supply-card-body">
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="客户姓:" prop="packageReceiveInfo.lastName" required>
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.lastName" placeholder="请输入客户姓[last name]"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="客户名:" prop="packageReceiveInfo.firstName" required>
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.firstName" placeholder="请输入客户名[first name]"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="邮箱:" prop="packageReceiveInfo.email" required>
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.email"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="联系电话:" prop="packageReceiveInfo.phone" required>
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.phone"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="邮编:" prop="packageReceiveInfo.postcode" required>
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.postcode"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="国家:" prop="packageReceiveInfo.countryEn" required>
							<el-select filterable class="supply-input" v-model="submitForm.packageReceiveInfo.countryEn" placeholder="请选择">
								<el-option v-for="(country, index) in countrySelections" :key="index" :label="country.countryEnName" :value="country.countryEnName">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="supply-form-item" label="州/省:" prop="packageReceiveInfo.state">
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.state"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="城市:" prop="packageReceiveInfo.city">
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.city"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="公司:" prop="packageReceiveInfo.company">
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.company"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="税号:" prop="packageReceiveInfo.taxNum">
							<el-input class="supply-input" v-model="submitForm.packageReceiveInfo.taxNum"></el-input>
						</el-form-item>
					</div>
					<div>
						<el-form-item class="supply-form-item" label="地址1:" prop="packageReceiveInfo.street1">
							<el-input v-model="submitForm.packageReceiveInfo.street1"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="地址2:" prop="packageReceiveInfo.street2">
							<el-input v-model="submitForm.packageReceiveInfo.street2"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-card>
			<el-card class="mt-20 none-border-card" shadow="never">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">商品信息</div>
						<div>
							扣库存：
							<el-switch v-model="submitForm.orders.deductFlag" :active-value="1" :inactive-value="0" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<el-button type="primary" @click="goodsDialogVisible = true">增加商品</el-button>
						</div>
					</div>
				</template>
				<el-table :data="submitForm.goodsUpdates" border>
					<el-table-column prop="mainImgUrl" label="主图" width="92px">
						<template #default="scope">
							<div style="position: relative">
								<el-popover placement="right-start" trigger="hover" width="auto">
									<el-image style="width: 200px; height: 200px" :src="scope.row.mainImgUrl" fit="contain"></el-image>
									<template #reference>
										<el-image style="width: 70px; height: 70px" :src="scope.row.mainImgUrl" fit="contain">
											<template #error>
												<div class="image-slot">
													<el-image style="width: 70px; height: 70px" fit="contain" :src="errorImage" />
												</div>
											</template>
										</el-image>
									</template>
								</el-popover>
								<div v-if="scope.row.giftFlag === 1" style="
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 1px 4px;
                    border-radius: 2px;
                    background: #1e93ff;
                    font-size: 12px;
                    color: #fff;
                  ">
									赠
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="skuCode" label="商品SKU"></el-table-column>
					<el-table-column prop="goodsQuantity" label="数量">
						<template #default="scope">
							<el-input-number v-model="scope.row.goodsQuantity" :min="1" :max="999" :precision="0" @blur="blurChangeNum(scope.row, 'goodsQuantity', 1)"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="skuValue" label="规格">
						<template #default="scope">
							<el-button @click="showCustomInfo(scope.row)" type="text" v-if="scope.row.customization === 1">定制
							</el-button>
							<template v-else>
								<div v-for="(obj, index) in scope.row.skuObj" :key="index">
									{{ obj.speEn || obj.spe}} ': ' {{obj.speValEn || obj.speVal }}
								</div>
							</template>
						</template>
					</el-table-column>
					<el-table-column prop="declareAmount" label="单品成本价（¥）">
						<template #default="scope">
							<el-input disabled v-model="scope.row.declareAmount"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="单品售价（$）">
						<template #default="scope">
							<el-input-number v-if="scope.row.giftFlag === 0" :precision="2" :min="0" :max="999999.99" @blur="blurChangeNum(scope.row, 'price', 0)" :controls="false" v-model="scope.row.price"></el-input-number>
							<el-input v-else v-model="scope.row.price" disabled></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="warehouseId" label="仓库">
						<template #default="scope">
							<el-select v-model="scope.row.warehouseId" placeholder="请选择">
								<el-option v-for="(ware, index) in wareHouseSelections" :key="index" :label="ware.name" :value="ware.id">
								</el-option>
							</el-select>
						</template>
					</el-table-column>

					<el-table-column label="操作">
						<template #default="scope">
							<el-button @click="setGiftFlag(scope.$index, 1)" type="text" v-if="scope.row.giftFlag === 0">设为赠品</el-button>
							<el-button @click="setGiftFlag(scope.$index, 0)" type="text" class="color-info" v-else>取消赠品</el-button>
							<el-button @click="removeGoodsUpdate(scope.$index)" type="text" class="color-danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card class="mt-20 none-border-card" shadow="never">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">备注</div>
					</div>
				</template>
				<el-input type="textarea" :maxlength="100" v-model="submitForm.orders.remark"></el-input>
			</el-card>
		</el-form>
		<div class="supply-submit-bar">
			<div>
				订单金额：{{
          submitForm.orders.totalPrice
            ? `USD ${parseFloat(submitForm.orders.totalPrice).toFixed(2)}`
            : ''
        }}
			</div>
			<div class="right-btns">
				<el-button type="default" @click="closeTab">取消</el-button>
				<el-button type="primary" @click="createOrder">创建</el-button>
			</div>
		</div>
		<custom-info v-if="dialogVisible" :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" width="40%" :data="dialogQuery" :needFormOptions="false" />
		<add-goods v-if="goodsDialogVisible" :isGift="true" @setData="setGoodsUpdates" />
		<reference-order-dialog v-if="referenceDialogVisible" @close="closeReferenceOrderDialog" @showCustomInfo="showCustomInfo"></reference-order-dialog>
	  <OrderExportList v-if="orderExportShow" @closeEvent="orderExportShow=false"/>
  </div>
</template>

<script>
	import errorImage from '@/assets/image/zwt_bg.png'
	import { toRefs, reactive, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { assignTool } from 'tool'
	import {
		countryCode,
		getSourceDomains,
		paymethods,
		createOrderApi
	} from '@/api/order/orderManagement.js'
	import CustomInfo from '@/views/order/orderManagement/components/orderDialog/customInfo.vue'
	import AddGoods from './reissueGifts/components/addGoods.vue'
	import ReferenceOrderDialog from './components/ReferenceOrderDialog.vue'
  import OrderExportList from './components/orderExportList.vue'
	import { ElMessage } from 'element-plus'

	export default {
		components: {
			CustomInfo,
			AddGoods,
			ReferenceOrderDialog,
      OrderExportList
		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const data = reactive({
				orderSource: null,
				submitForm: {
					orders: {
						domain: null, // 域名
						source: null, // 订单来源
						tempDomain: null, // 临时域名
						type: 1,
						totalPrice: null, // 订单金额
						transcationId: null, // 交易号
						paymentType: null, // 支付类别
						paymentMethod: null, // 支付方式
						paymentTime: null, // 付款时间
						remark: null, // 备注
						orderId: null, //订单ID
						deductFlag: 1//是否扣库存
					},
					packageReceiveInfo: {
						name: null, // 客户姓名
						firstName: null, // 客户姓
						lastName: null, // 客户名
						email: null, // 客户邮箱
						phone: null, // 联系电话
						postcode: null, // 邮编
						countryCn: null, // 国家中文名称
						countryEn: null, // 国家英文名称
						state: null, // 省/州
						city: null, // 城市
						company: null, // 公司
						taxNum: null, // 税号
						street1: null, // 地址1
						street2: null // 地址2
					},
					goodsUpdates: []
				},
				typeOpts: {
					1: '手工订单',
					0: '用户创建'
				},
				// 订单来源相关
				sources: null,
				sourceList: [],
				sourceProps: {
					children: 'tempDomains',
					leaf: 'value'
				},
				// 支付方式相关
				paymethodsList: [],
				payProps: {
					expandTrigger: 'hover',
					value: 'paymentType',
					label: 'paymentType',
					children: 'paymentMethods',
					checkStrictly: true
				},
				// 国家选择器
				countrySelections: [],
				wareHouseSelections: [
					{
						name: '万众智谷仓库',
						id: 1
					}
				],
				submitFormRules: {
					orders: {
						totalPrice: [
							{ required: true, message: '请输入订单金额' },
							{
								pattern: /^(?!0\d)\d{1,6}(\.\d{1,2})?$/,
								message: '请输入正确的订单金额'
							}
						], // 订单金额
						paymentMethod: [{ required: true, message: '请选择支付方式' }], // 支付方式
						paymentTime: [
							{ required: true, message: '请选择付款时间' },
							{
								validator(rule, value, callback) {
									value && new Date(value).getTime() > Date.now()
										? callback(new Error('付款时间必须早于当前时间'))
										: callback()
								}
							}
						], // 付款时间
						source: [{ required: true, message: '请选择订单来源' }],
						transcationId: [
							{
								required: false,
								message: '交易号码最多30个字符，支持字母、数字、-、_组合',
								pattern: /^[A-Za-z0-9_\-]{0,30}$/
							}
						]
					},
					packageReceiveInfo: {
						// name: [{ required: true, message: '请输入客户姓名' }, { min: 1, max: 60, message: '最多60个字符' }],
						firstName: [
							{ required: true, message: '请输入客户名' },
							{ min: 1, max: 60, message: '最多60个字符' }
						],
						lastName: [
							{ required: true, message: '请输入客户姓' },
							{ min: 1, max: 60, message: '最多60个字符' }
						],
						taxNum: [
							{
								pattern: /^[A-Za-z0-9]{0,30}$/,
								message: '请输入字母加数字组合，最多30个字'
							}
						],
						company: [{ max: 200, message: '最多输入200个字符' }],
						email: [
							{ required: true, message: '请输入客户邮箱' },
							{ min: 1, max: 100, message: '最多100个字符' }
						],
						phone: [
							{ required: true, message: '请输入联系电话' },
							{ min: 1, max: 60, message: '最多60个字符' }
						],
						postcode: [
							{ required: true, message: '请输入邮编' },
							{ min: 1, max: 40, message: '最多40个字符' }
						],
						state: [
							{ required: false, min: 0, max: 60, message: '最多60个字符' }
						],
						city: [
							{ required: false, min: 0, max: 200, message: '最多200个字符' }
						],
						countryEn: [{ required: true, message: '请选择国家' }],
						street1: [
							{
								required: true,
								validator: (rule, value, callback) => {
									if (value) {
										callback()
										data.formRef.clearValidate('packageReceiveInfo.street2')
									} else {
										if (data.submitForm.packageReceiveInfo.street2) {
											callback()
										} else {
											callback(new Error(rule.message))
										}
									}
								},
								message: '请输入地址1'
							},
							{ max: 300, message: '最多只能输入300个字符' }
						],
						street2: [
							{
								validator: (rule, value, callback) => {
									if (value) {
										callback()
										data.formRef.clearValidate('packageReceiveInfo.street1')
									} else {
										if (data.submitForm.packageReceiveInfo.street1) {
											callback()
										} else {
											callback(new Error(rule.message))
										}
									}
								},
								message: '请输入地址2'
							},
							{ max: 300, message: '最多只能输入300个字符' }
						]
					}
				},
				formRef: null,
				errorImage,
				dialogVisible: false,
				dialogTitle: '定制信息',
				dialogQuery: null,
				goodsDialogVisible: false,
				referenceDialogVisible: false,
        //新需求订单导入
        orderExportShow:false,
			})
			const store = useStore()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)

			function getSource() {
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
			}

			function getPayMethond() {
				paymethods().then(res => {
					if (res.code === 200) {
						res.data.forEach(item => {
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
			} // 获取支付方式

			function getCountrys() {
				countryCode().then(r => {
					data.countrySelections = r.data
				})
			}
			// 获取国家选择器
			getCountrys()
			// 获取订单来源
			getSource()
			// 获取支付方式
			getPayMethond()

			function changePayMent(val) { }

			function getChangeSource(val) {
				if (val) {
					const { pathLabels } = data.sources.getCheckedNodes()[0]
					data.submitForm.orders.source = pathLabels[0] ? pathLabels[0] : ''
					data.submitForm.orders.domain = pathLabels[2] ? pathLabels[2] : ''
					data.submitForm.orders.tempDomain = pathLabels[1] ? pathLabels[1] : ''
				} else {
					data.submitForm.orders.source = ''
					data.submitForm.orders.domain = ''
					data.submitForm.orders.tempDomain = ''
				}
			} // 获取订单来源

			function createOrder() {
				data.formRef.validate((val, errors) => {
					if (val) {
						const form = JSON.parse(JSON.stringify(data.submitForm))
						if (Array.isArray(form.orders.paymentMethod)) {
							let obj = {
								其他: '0',
								location: '1',
								'credit card': '2',
								paypal: '3'
							}
							form.orders.paymentType = obj[form.orders.paymentMethod[0]]
							form.orders.paymentMethod = form.orders.paymentMethod[1] ?? null
						}
						// 提交时处理中英文国家名称保持统一
						data.countrySelections.map(country => {
							if (country.countryEnName === form.packageReceiveInfo.countryEn) {
								form.packageReceiveInfo.countryCn = country.countryName
							}
						})
						form.packageReceiveInfo.name =
							form.packageReceiveInfo.firstName +
							' ' +
							form.packageReceiveInfo.lastName
						if (!form.goodsUpdates.length) {
							ElMessage.error({ message: '请添加商品' })
							return false
						}
						form.goodsUpdates.map(it => {
							delete it.skuObj
							if (it.skuValueEn) it.skuValue = it.skuValueEn
							it.price = Number(it.price)
						})
						const index = form.goodsUpdates.findIndex(
							it => it.giftFlag === 0 && it.price !== 0 && !it.price
						)
						if (index !== -1) {
							ElMessage.info({
								message: '非赠品的单品售价必填，请检查填写后重新提交'
							})
							return false
						}
						form.orders.totalPrice = Number(form.orders.totalPrice)
						console.log(form)
						createOrderApi(form).then(r => {
							ElMessage.success({ message: '订单创建成功' })
							setTimeout(_ => {
								closeTab()
								router.push({
									name: 'OrderManagement',
									params: {
										status: 1
									}
								})
							}, 1000)
						})
					} else {
						let keyArrs = Object.keys(errors)
						keyArrs = keyArrs.filter(
							key =>
								errors[key] !== null &&
								typeof errors[key] !== 'string' &&
								errors[key] instanceof Array
						)
						const street1Idx = keyArrs.indexOf('packageReceiveInfo.street1')
						const street2Idx = keyArrs.indexOf('packageReceiveInfo.street2')
						if (street1Idx !== -1 && street1Idx !== -1) {
							data.formRef.clearValidate('packageReceiveInfo.street2')
							keyArrs.splice(street2Idx, 1)
						}
						const key = keyArrs[0]
						ElMessage.warning({ message: errors[key][0].message })
					}
				})
			}

			function closeTab() {
				const routerHistory = store.state.com.routerHistory
				const item = routerHistory.find(r => r.path === route.path)
				store.commit('com/delRouterHistory', item)
				const subRoutes = item.meta.subRoutes
				if (item.path === route.path || subRoutes.indexOf(route.path) !== -1) {
					if (routerHistory.length > 0) {
						router.replace(routerHistory[routerHistory.length - 1].path)
					} else {
						router.replace('/index')
					}
				}
			}

			function showCustomInfo(row) {
				data.dialogQuery = { packageSkuId: row.packageSkuId }
				data.dialogVisible = true
			}

			function setGoodsUpdates(goods) {
				if (goods) {
					goods.map(item => {
						const find = data.submitForm.goodsUpdates.find(
							g => g.skuId === item.skuId
						)
						if (!find) {
							item.giftFlag = item.isGift ? 1 : 0
							item.price = 0
							item.skuObj = JSON.parse(item.skuValueEn)
							delete item.isGift
							delete item.goodsNumber
							delete item.stdCount
							data.submitForm.goodsUpdates.push(item)
						} else {
							find.goodsQuantity = find.goodsQuantity + item.goodsQuantity
						}
					})
				}
				data.goodsDialogVisible = false
			}

			function setGiftFlag(index, val) {
				data.submitForm.goodsUpdates[index].giftFlag = val
				data.submitForm.goodsUpdates[index].price = null
			}

			function removeGoodsUpdate(index) {
				data.submitForm.goodsUpdates.splice(index, 1)
			}

			function blurChangeNum(row, key, num) {
				if (row[key] === undefined) {
					row[key] = num
				}
			}

			function closeReferenceOrderDialog(flag, row) {
				if (row?.orderId) row.orderId += '_S1'
				if (flag) {
					data.orderSource = row.orderSource
					data.submitForm.orders = assignTool(data.submitForm.orders, row)
					data.submitForm.orders.deductFlag = 1
					data.submitForm.orders.type = 1
					data.submitForm.packageReceiveInfo = assignTool(
						data.submitForm.packageReceiveInfo,
						row
					)
					data.submitForm.goodsUpdates =
						row.goodsUpdates?.map(v => {
							if (row.packageGoodsDetailsVOs.some(val => val.id === v.id))
								v = {
									...row.packageGoodsDetailsVOs?.filter(
										val => val.id === v.id
									)[0],
									...v
								}
							return v
						}) || []
					// 引用订单数据赋值完成后，级连选择器不会自动进行数据校验，手动触发一下
					data.formRef.validateField(['orders.source', 'orders.paymentMethod'])
					ElMessage.success({ message: '包裹引用成功' })
				}
				data.referenceDialogVisible = false
			}

			return {
				...toRefs(data),
				createOrder,
				showCustomInfo,
				getChangeSource,
				changePayMent,
				blurChangeNum,
				setGoodsUpdates,
				setGiftFlag,
				removeGoodsUpdate,
				sideBarWidth,
				closeTab,
				closeReferenceOrderDialog
			}
		}
	}
</script>

<style lang="scss" scoped>
.supply-container {
	position: relative;
	padding-bottom: 80px;

	.supply-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.supply-card-title {
			font-size: 16px;
			font-weight: bold;
		}
	}

	.supply-input {
		width: 280px;
	}

	.supply-card-body {
		padding: 0 200px;

		.supply-card-flex {
			display: flex;
			justify-content: space-between;
		}
	}
}

.supply-submit-bar {
	position: fixed;
	padding: 10px 20px;
	z-index: 999;
	left: v-bind(sideBarWidth);
	bottom: 0;
	width: calc(100% - v-bind(sideBarWidth));
	display: flex;
	justify-content: space-between;
	background: #fff;
	align-items: center;
}
.supply-header {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 20px;
	font-size: 20px;
	margin-bottom: 20px;
	.header-title {
		margin-left: 10px;
	}
}
</style>
