<!--
 * @Descripttion: 定制信息
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 15:00:00
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
			<div class="container">
				<div class="goods" v-if="info">
					<el-row>
						<el-col :span="12">
							<div class="info">
								<div class="img">
									<el-popover placement="right-start" trigger="hover" width="auto">
										<el-image
											style="width: 200px; height: 200px"
											:src="info.skuImg"
											fit="contain"
										></el-image>
										<template #reference>
											<el-image
												class="ml-10"
												style="width: 80px; height: 80px"
												:src="info.skuImg"
												fit="contain"
											></el-image>
										</template>
									</el-popover>
								</div>
								<div class="detail">
									<p class="detail_title">
										{{ info.sku }}
									</p>
									<p class="detail_price">
										USD {{ info.price }}
									</p>
									<p class="detail_txt" v-if="info.customsWeight">
										重量：{{ info.customsWeight }}g
									</p>
                  	<p class="detail_txt" v-if="info.purchaseLength">
										体积：{{ info.purchaseLength }}*{{info.purchaseWidth}}*{{info.purchaseHeight}}
									</p>
								</div>
							</div>
						</el-col>

						<el-col class="num" :span="1"> x{{info.quantity}} </el-col>
						<el-col :span="9">
							<div class="info_right">
								<p class="right_txt">
									定制时间:{{ info.purchaseTime }}
								</p>
								<p class="right_txt">
									到货时间:{{ info.deliveryTime }}
								</p>
								<p class="right_txt">
									周期 :{{ info.arrivalInterval }}
								</p>
								<p class="right_txt">
									供应商:{{ info.supplierName }}
								</p>
							</div>
						</el-col>
					</el-row>
				</div>

				<div class="tableHeader" v-if="info">
					<span class="header_title">定制内容</span>
					<el-button type="text" @click="change" v-if="showEdit && !info.itemOrderRelId">{{
						edit ? '保存' : '编辑'
					}}</el-button>
				</div>

				<div class="table">
					<el-table
						:data="tableData"
						style="width: 100%"
						:header-cell-style="{
							background: '#F5F7FA',
							color: '#000',
							'text-align': 'center'
						}"
						:cell-style="{ 'text-align': 'center' }"
					>
						<el-table-column prop="field" label="规格名称">
							<template #default="scope">
								<el-input
									v-if="edit && scope.row.add"
									v-model="scope.row.field"
									placeholder=""
									maxlength="100"
								></el-input>
								<p v-else>{{ scope.row.field }}</p>
							</template>
						</el-table-column>
						<el-table-column
							prop="value"
							label="规格值"
							className="my-cell"
						>
							<template #default="scope">
								<div
									class="value"
									v-if="scope.row.type == 'text_options'"
								>
									<p v-if="!edit">{{ scope.row.value }}</p>
									<el-input
										v-model="scope.row.value"
										placeholder=""
										maxlength="100"
										v-else
									></el-input>
									<el-popconfirm
										v-if="scope.row.add"
										@confirm="del(scope)"
										title="确定删除当前规格吗？"
									>
										<template #reference>
											<i class="el-icon-close"></i>
										</template>
									</el-popconfirm>
								</div>
								<div v-else>
									<div class="imgBox" v-if="!edit">
										<el-popover placement="right-start" trigger="hover" width="auto">
											<el-image
												style="width: 200px; height: 200px"
												:src="scope.row.value"
												fit="contain"
											></el-image>
											<template #reference>
												<el-image
													class="ml-10"
													style="width: 80px; height: 80px"
													:src="scope.row.value"
													fit="contain"
												></el-image>
											</template>
										</el-popover>
									</div>

									<div class="value" v-else>
										<UploadImg
											:limit="1"
											:data="imgData(scope.row.value)"
											:moduleName="'customization'"
											:isCompress="true"
											@getFileUrl="
												val =>
													getFile(
														scope.row.field,
														val
													)
											"
											@getFileList="val=>getFileList(scope.row.field,val)"
										/>
										<el-popconfirm
											v-if="scope.row.add"
											@confirm="del(scope)"
											title="确定删除当前规格吗？"
										>
											<template #reference>
												<i class="el-icon-close"></i>
											</template>
										</el-popconfirm>
									</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<div style="margin-top: 20px" v-if="edit">
						<el-dropdown @command="handleCommand">
							<el-button type="primary" >
								<i class="el-icon-plus"></i>增加定制信息
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="img_options"
										>图片信息</el-dropdown-item
									>
									<el-dropdown-item command="text_options"
										>文本信息</el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	getCurrentInstance,
	onMounted,
	watch,
	nextTick,
	inject,
	computed
} from 'vue'
import {
	getCustomValues,
	updateCustomValues
} from '@/api/order/orderManagement.js'
import UploadImg from '@/components/uploadImg/index.vue'
import { useStore } from 'vuex'
export default {
	components: { UploadImg },
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
		},
		// 是否需要formOptions
		needFormOptions: {
			type: Boolean,
			default: true
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		// 获取的formOptions 组件
		const store = useStore()
		const data = reactive({
			info: null,
			tableData: [],
			edit: false
		})

		const dialogHandOk = () => {}

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
			if (props.needFormOptions) {
				nextTick(() => {
					const formOptions = inject('formOptions')
					formOptions.value.init()
				})
			}

		}

		const showEdit = computed(() => {
			const {orderTabType} = store.getters
			let whiteList = ['shelve','toBePaid']
			if (data.info.exportId > 0 || whiteList.indexOf(orderTabType) !== -1 || props.data.taggedFlag == 1) return false
			return true
		})

		const change = () => {
			if (data.edit) {
				let arr = data.tableData
				for (let i = 0; i < arr.length; i++) {
					if (!arr[i].field) {
						proxy.$message.error('请输入规格名称!')
						return
					}
					if (!arr[i].value) {
						proxy.$message.error('请输入规格值!')
						return
					}
					delete arr[i].add
				}
				const param = {
					id: data.info.id,
					customValue: JSON.stringify(arr)
				}
				submit(param)
			} else {
				data.edit = true
			}
		} //编辑或者保存

		const submit = param => {
			updateCustomValues(param)
				.then(res => {
					if (res.code == 200) {
						data.tableData.forEach(item => (item.add = false))
						data.edit = false

					}
				})

		}

		const getInfo = skuId => {
			getCustomValues({ skuId }).then(res => {
				if (res.code == 200) {
					data.info = res.data
					console.log(JSON.parse(res.data.customValue))
					let arr = JSON.parse(res.data.customValue)
					arr.forEach((item, index) => {
						item.add = false
						item.index = index
					})
					data.tableData = arr
				}
			})
		}

		const imgData = val => {
			if (val) {
				return [
					{
						name: val,
						url: val
					}
				]
			} else {
				return []
			}
		}

		const getFile = (field, val) => {

			data.tableData.forEach(item => {
				if (item.field == field) {
					item.value = val[0].fileUrl
				}
			})
		}
		const getFileList = (field, val) =>{
			data.tableData.forEach(item => {
				if (item.field == field) {
					if(val.length == 0) return item.value = ''
					item.value = val[0].fileUrl
				}
			})
		}

		const del = scope => {
			data.tableData.splice(scope.$index, 1)
		}

		const handleCommand = val => {
			let obj = {
				field: '',
				type: val,
				value: '',
				add: true,
				index: data.tableData.length
			}
			data.tableData.push(obj)
		}

		watch(
			() => props.data,
			a => {
				console.log(props.data)
				getInfo(a.packageSkuId)
			}
		)

		onMounted(() => {
			getInfo(props.data.packageSkuId)
		})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			change,
			imgData,
			getFile,
			handleCommand,
			showEdit,
			del,
			getFileList
		}
	}
}
</script>

<style lang="scss" scoped>
.goods {
	padding: 8px 16px;
	border: 1px solid #e8e8e8;
}
.info {
	display: flex;
	align-items: center;

	.img {
		min-width: 80px;
		height: 80px;
		text-align: center;
		img{
			width: auto;
			height: auto;
			max-width: 80px;
			max-height: 80px;
		}
	}
	.detail {
		margin-left: 10px;
		.detail_title {
			font-size: 14px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.85);
		}
		.detail_price {
			font-size: 12px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.65);
		}
		.detail_txt {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.45);
		}
		p {
			margin-bottom: 5px;
		}
	}
}
.num {
	display: flex;
	align-items: center;
	justify-content: center;
}
.info_right {
	padding-left: 20px;
	.right_txt {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		margin-bottom: 5px;
	}
}

.tableHeader {
	margin: 15px 0 10px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.header_title {
		font-size: 16px;
		font-family: PingFangSC-Regular, PingFang SC;

		color: rgba(0, 0, 0, 0.85);
	}
}

.imgBox {
	width: 90px;
	height: 90px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: auto;
		height: auto;
		max-width: 90px;
		max-height: 90px;
	}
}
.value {
	display: flex;
	align-items: center;
	i {
		margin-left: 10px;
		font-size: 20px;
	}
}
</style>
