<template>
	<div class="supply-container">
		<el-affix :offset="110">
			<div class="supply-header">
				<i @click="back()" class="el-icon-arrow-left"></i>
				<div class="header-title">补发包裹</div>
			</div>
		</el-affix>
		<el-form :model="submitForm" ref="formRef" :rules="submitFormRules" label-width="120px">
			<el-card shadow="never" class="none-border-card">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">订单信息</div>
					</div>
				</template>
				<div class="supply-card-body">
					<!-- <div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="订单号:">
							<el-input class="supply-input" disabled  v-model="orderInfo.orderId"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="包裹号:">
							<el-input class="supply-input" disabled  v-model="orderInfo.packageId"></el-input>
						</el-form-item>
					</div> -->
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="店铺:">
							<el-input class="supply-input" disabled  v-model="orderInfo.store"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="订单类型:">
							<el-input class="supply-input" disabled  v-model="orderInfo.type"></el-input>
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
						<el-form-item class="supply-form-item" label="客户姓名:" prop="name" required>
							<el-input class="supply-input"  v-model="submitForm.name"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="邮箱:" prop="email" required>
							<el-input class="supply-input" disabled  v-model="submitForm.email"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="联系电话:" prop="phone" required>
							<el-input class="supply-input"  v-model="submitForm.phone"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="邮编:" prop="postcode" required>
							<el-input class="supply-input"  v-model="submitForm.postcode"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="国家:" prop="countryEn" required>
							<el-select  filterable class="supply-input" v-model="submitForm.countryEn" placeholder="请选择">
								<el-option v-for="(country, index) in countrySelections" :key="index" :label="country.countryEnName" :value="country.countryEnName">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="supply-form-item" label="省/州:" prop="state">
							<el-input class="supply-input"  v-model="submitForm.state"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="城市:" prop="city">
							<el-input class="supply-input"  v-model="submitForm.city"></el-input>
						</el-form-item>
					</div>
					<div class="supply-card-flex">
						<el-form-item class="supply-form-item" label="公司:" prop="company">
							<el-input class="supply-input"  v-model="submitForm.company"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="税号:" prop="taxNum">
							<el-input class="supply-input"  v-model="submitForm.taxNum"></el-input>
						</el-form-item>
					</div>
					<div>
						<el-form-item class="supply-form-item" label="地址1:" prop="street1">
							<el-input  v-model="submitForm.street1"></el-input>
						</el-form-item>
						<el-form-item class="supply-form-item" label="地址2:" prop="street2">
							<el-input  v-model="submitForm.street2"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-card>
			<el-card class="mt-20 none-border-card" shadow="never">
				<template #header>
					<div class="supply-card-header">
						<div class="supply-card-title">补发商品</div>
						<div>
							<span class="mr-10">扣库存：</span>
							<el-switch v-model="submitForm.deductFlag" :active-value="1" :inactive-value="0"></el-switch>
						</div>
					</div>
				</template>
				<el-table :data="packageSkus" border>
					<el-table-column prop="skuImg" label="主图" width="92px">
						<template #default="scope">
							<el-popover placement="right-start" trigger="hover" width="auto">

								<el-image style="width: 200px; height: 200px" :src="scope.row.skuImg" fit="contain"></el-image>
								<template #reference>

									<el-image style="width: 70px; height: 70px" :src="scope.row.skuImg" fit="contain">
										<template #error>
											<div class="image-slot">
												<el-image style="width: 70px; height: 70px" fit="contain" :src="errorImage" />
											</div>
										</template>
									</el-image>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="sku" label="商品SKU"></el-table-column>
					<el-table-column prop="skuValue" label="规格">
						<template #default="scope">
							<el-button @click="showCustomInfo(scope.row)" type="text" v-if="scope.row.customization === 1">定制
							</el-button>
							<div v-else>
                <div v-for="(spe, index) in scope.row.skuValue" :key="index">{{spe.spe}}：{{spe.speVal}}</div>
              </div>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="price" label="单品成本价（￥）">
					  <template #default="scope">
						<el-input disabled v-model="scope.row.price"></el-input>
					  </template>
					</el-table-column> -->
					<el-table-column prop="price" label="单品售价（$）">
						<template #default="scope">
							<el-input disabled v-model="scope.row.price"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="ware" label="仓库">
						<template #default="scope">
							<el-select v-model="scope.row.ware" placeholder="请选择">
								<el-option v-for="(ware, index) in wareHouseSelections" :key="index" :label="ware.name" :value="ware.id">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="quantity" label="数量">
						<template #default="scope">
							<el-input-number v-model="scope.row.number" :min="0" :max="scope.row.quantity"></el-input-number>
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
				<el-input type="textarea" v-model="submitForm.remark"></el-input>
			</el-card>
		</el-form>
		<div class="supply-submit-bar">
			<!-- <div class="left-price">订单成本：{{orderInfo.totalPrice}} CNY</div> -->
			<div></div>
			<div class="right-btns">
				<!-- TODO：返回上一页面有bug，需要关闭当前标签页面 -->
				<el-button  @click="back()">取消</el-button>
				<el-button  type="primary" @click="saveSupply">保存</el-button>
			</div>
		</div>
		<custom-info v-if="dialogVisible" :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" width="40%" :data="dialogQuery" :needFormOptions="false" />
	</div>
</template>

<script>
	import errorImage from '@/assets/image/zwt_bg.png'
	import { toRefs, reactive, getCurrentInstance } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { getSupplyInfo, saveSupplyInfo } from '@/api/order/supply.js'
	import { countryCode } from '@/api/order/orderManagement.js'
	import CustomInfo from '@/views/order/orderManagement/components/orderDialog/customInfo.vue'

	export default {
		components: {
			CustomInfo
		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const packageId = route.query.packageId
			const { proxy } = getCurrentInstance()
			const data = reactive({
				packageId,
				// 订单信息
				orderInfo: {
					packageId,
					orderId: '',
					store: '',
					totalPrice: '',
					type: '补发包裹'
				},
				submitForm: {
					packageId,
					addressId: null, // 客户信息主键
					name: null, // 客户姓名
					email: null, // 客户邮箱
					phone: null, // 联系电话
					postcode: null, // 邮编
					countryCn: null, // 国家中文名称
					countryEn: null, // 国家英文名称
					state: null, // 省/州
					city: null, // 城市
					company: null, // 公司
					taxNum: null, // 税号
					street1: null,// 地址1
					street2: null, // 地址2
					deductFlag: null, // 是否扣库存 0不扣，1扣库存
					remark: null // 备注
				},
				packageSkus: [],
				countrySelections: [],
				wareHouseSelections: [
					{
						name: '万众智谷仓库',
						id: 1
					}
				],
				submitFormRules: {
					name: [{ required: true, message: '请输入客户姓名' }],
					email: [{ required: true, message: '请输入客户邮箱' }],
					phone: [{ required: true, message: '请输入联系电话' }],
					postcode: [{ required: true, message: '请输入邮编' }],
					countryCn: [{ required: true, message: '请选择国家' }],
					street1: [{
						validator: (rule, value, callback) => {
							data.formRef.clearValidate('street2')
							if ((data.submitForm.street2 && !value) || value) {
								callback()
							} else {
								callback(new Error('请输入收货地址'))
							}
						}
					}],
					street2: [{
						validator: (rule, value, callback) => {
							data.formRef.clearValidate('street1')
							if ((data.submitForm.street1 && !value) || value) {
								callback()
							} else {
								callback(new Error('请输入收货地址'))
							}
						}
					}]
				},
				formRef: null,
				errorImage,
				dialogVisible: false,
				dialogTitle: '定制信息',
				dialogQuery: null
			})

			const getCountrys = _ => {
				countryCode().then(r => {
					data.countrySelections = r.data
				})
			}
			getCountrys()

			const getInfo = _ => {
				getSupplyInfo({ packageId }).then(r => {
					const response = r.data
					const packageRels = response.packageRels
					data.orderInfo = Object.assign(data.orderInfo, {
						orderId: packageRels[0].orderId,
						store: `${packageRels[0].source}-${packageRels[0].domain}-${packageRels[0].tempDomain}`,
						totalPrice: packageRels[0].totalPrice
					})
					// 预填客户信息
					data.submitForm = Object.assign(data.submitForm, response)
					data.submitForm.deductFlag = 1 // 新包裹 默认扣库存
					delete data.submitForm.packageRels

					// 补发商品信息
					packageRels.map(p => {
						p.packageSkus.map(sku => {
              try {
                sku.skuValue = JSON.parse(sku.skuValue)
              } catch (error) {
                console.log('error=========', error)
              }
							sku.ware = 1
							// 最大值和输入值用两个属性区分开来
							sku.number = sku.quantity
							data.packageSkus.push(sku)
						})
					})
				})
			}
			getInfo()

			const saveSupply = _ => {
				data.formRef.validate(val => {
					if (val) {
						const saveReissuePackageDTO = JSON.parse(JSON.stringify(data.submitForm))
						// 提交时处理中英文国家名称保持统一
						data.countrySelections.map(country => {
							if (country.countryEnName === saveReissuePackageDTO.countryEn) {
								saveReissuePackageDTO.countryCn = country.countryName
							}
						})
						saveReissuePackageDTO.packageSkus = []
						const length = data.packageSkus.length
						let count = 0
						data.packageSkus.map(it => {
							if (!it.number || it.number === 0) {
								count += 1
							}
							saveReissuePackageDTO.packageSkus.push({
								packageSkuId: it.packageSkuId,
								quantity: it.number
							})
						})
						if (length === count) {
							proxy.$message.error({ message: '请输入商品数量' })
							return
						}
						saveSupplyInfo(saveReissuePackageDTO).then(r => {
							proxy.$message.success({ message: '保存成功' })
							router.push({ name: 'OrderManagement', params: { status: 1 } })
						})
					}
				})
			}

			const showCustomInfo = row => {
				data.dialogQuery = { packageSkuId: row.packageSkuId }
				data.dialogVisible = true
			}

			return {
				...toRefs(data),
				saveSupply,
				showCustomInfo,
				back: _ => {
					router.go(-1)
				}
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
	left: var(--sideBarWidth);
	bottom: 0;
	width: calc(100% - var(--sideBarWidth));
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
