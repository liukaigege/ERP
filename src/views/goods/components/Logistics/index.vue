<template>
	<div>
		<detail-info v-bind="{isEdit,isQuoted,info}"></detail-info>
		<!-- 商品信息 -->
		<goods-info v-bind="{isEdit,isQuoted,info,isSpecial: info.enableCustom ==1}"></goods-info>
		<!-- 物流信息 -->
		<freight-info v-bind="{isEdit,isQuoted,info,rate,isSpecial: info.enableCustom ==1}" ref='freightInfoRef'></freight-info>
		<!-- 报关信息 -->
		<declare-info v-bind="{isEdit,isQuoted,info,rate,isSpecial: info.enableCustom ==1}" ref="declareInfoRef"></declare-info>
		<erp-footer v-if="isQuoted && isEdit">
			<template #default>
				<div class="footer-content">
					<span>物流报价备注：</span>
					<el-input placeholder="请输入" v-model="info.remark" :maxlength="500" ></el-input>
					<el-button @click="cancel" >取消</el-button>
					<el-button @click="showModal = true"  v-if="info.operateStatus==0">拒绝报价</el-button>
					<el-button @click="showBackPurchase = true" >打回采购</el-button>
					<el-button type="primary" @click="commit" >提交报价</el-button>
				</div>
			</template>
		</erp-footer>
		<return-dialog v-if="showModal" :selections="[info.goodsId]" batchType="single" reasonType="logistic" @close="closeDialog"></return-dialog>
		<back-purchase v-if="showBackPurchase" :ids="[info.goodsId]" @close="closeDialog"></back-purchase>
	</div>
</template>
<script>
	import { reactive, ref, toRefs, watch, nextTick } from "vue";
	import { fmtSku } from './composables/fmtSku'
	import DeclareInfo from './components/DeclareInfo.vue'
	import FreightInfo from './components/FreightInfo.vue'
	import GoodsInfo from './components/GoodsInfo.vue'
	import DetailInfo from './components/DetailInfo.vue'
	import { useRoute, useRouter } from 'vue-router';
	import { logisticsInfo } from '@/api/goods/logistics'
	import erpFooter from '@/components/erpFooter/index.vue'
	import { logisticsUpdate } from '@/api/goods/logistics'
	import ReturnDialog from '../PurchaseInfo/components/ReturnDialog.vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { getExchangeRataListPage } from '@/api/financial.js'
	import { validateGoodsStatus } from '@/api/goods/quotation.js'
	import BackPurchase from './components/BackPurchase.vue'
  import {debounce} from '@/directives/erpToolsDirective'
	export default {
		components: { DeclareInfo, FreightInfo, GoodsInfo, DetailInfo, erpFooter, ReturnDialog, BackPurchase },
		props: {
			isQuoted: Boolean,
			isEdit: Boolean,
		},
    directives: {debounce},
		setup(props, ctx) {
			const route = useRoute()
			const router = useRouter()
			let goodsId = route.query.id
			let state = reactive({
				showModal: false,
				showBackPurchase: false,
				info: {
					attr: '',
					skus: []
				}
			})
			let freightInfoRef = ref(null)
			let declareInfoRef = ref(null)
			let isInit = true
			let obj = { baseCurrency: "USD", originalCurrency: "CN", page: { pageNo: 1, pageSize: 100 } }
			let rate = ref('')
			// 初始化数据
			initData()
			let isChange = false
			watch(() => state.info, () => {
				if (!isInit) ctx.emit('isChange', true), isChange = true
			}, { deep: true })
			function validate() {
				return new Promise((res, rej) => {
					Promise.all([
						freightInfoRef.value.tableRef.validate(true),
						declareInfoRef.value.tableRef.validate(true)
					]).then(v => {
						if (v.every(item => !item)) res()
						else rej()
					}).catch(err => rej(err))
				})
			}
			function initData(id=null) {
				Promise.all([getExchangeRataListPage(obj), logisticsInfo({ goodsId:id||goodsId })]).then(res => {
					rate.value = res[0].data.dataList[0].rate // 获取美元汇率，用于计算建议售价
					res[1].data.skus = fmtSku(res[1].data, props.isQuoted)
					state.info = res[1].data
					nextTick(() => {
						isInit = false // 除去第一次赋值
					})
				})
			}
			function go() {
				router.push({
					name: 'Quotation',
					params: {
						goodsStatus: 4
					}
				})
			}

			function closeDialog(v) {
				if (v) go()
				setTimeout(() => {
					state.showModal = false
					state.showBackPurchase = false
				}, 400)
			}
			function commit() {
				freightInfoRef.value.reset()
				nextTick(() => {
					let flag = state.info.skus.every(item => item.lgtSwitch != 1)
					if (flag) {
						if (state.info.operateStatus != 0) {
							ElMessageBox({
								title: "提示",
								message: '【变更品类申请报价】的商品至少开启一个商品SKU报价开关！',
								type: 'warning'
							})
						} else {
							ElMessageBox({
								title: "提示",
								message: '当前商品报价状态已被全部关闭，默认为拒绝报价，请执行【拒绝报价】操作',
								type: 'warning'
							})
						}
					} else {
						validate().then(() => {
							ElMessageBox.confirm("确认提交物流报价？", { title: "提示" }).then(() => {
								logisticsUpdate(Object.assign({ type: 1 }, state.info)).then((res) => {
									go()
								}).catch(err => {
									if (err.code == 261011) {
										isQuoted()
									}
								})
							})
						})
					}
				})
			}
			function isQuoted() {
				ElMessageBox.alert('该商品已被其他用户已完成物流报价流程！', "提示", {
					confirmButtonText: '确认并退出',
					showClose: false,
					type: 'warning',
					callback: () => {
						go()
					},
				})
			}
			function saveAct(type) {
				freightInfoRef.value.reset()
				return new Promise((res, rej) => {
					logisticsUpdate(Object.assign({ type }, state.info)).then((data) => {
						ElMessage({
							message: '保存成功',
							type: 'success',
						})
						initData()
						res()
						isInit = true
						ctx.emit('isChange', false)
						isChange = false

					}).catch(err => {
						if (err.code == 261011) {
							isQuoted()
						}
						rej(err)
					})
				})
			}
			function save(type) {  // 0 待报价保存，1提交 ，2已报价保存
				if (type == 2) {
					return new Promise((res, rej) => {
						validate().then(_ => {
							saveAct(type).then(()=> res()).catch(()=> rej())
						}).catch(()=> rej())
					})
				} else {
					return saveAct(type)
				}
			}
			function cancel() {
				validateGoodsStatus({ goodsIdList: [goodsId], type: 2 }).then(res => { // 校验是否已经申请报价完成
					if (res.data.result) {
						if (isChange) {
							ElMessageBox.confirm("确认终止当前报价流程？", {
								confirmButtonText: '保存并退出',
								cancelButtonText: '直接退出',
								distinguishCancelAndClose: true,
								type: 'warning',
							}).then(() => {
								save(0).then(() => {
									go()
								})
							}).catch((e) => {
								if (e == 'cancel') go()
							})
						} else {
							go()
						}
					} else {
						ElMessageBox.confirm('该商品已被其他用户已完成物流报价流程！', '提示', {
							confirmButtonText: '确认并退出',
							closeOnClickModal: false,
							closeOnPressEscape: false,
							showCancelButton: false,
							showClose: false
						}).then(_ => {
							go()
						})
					}
				})

			}
			return {
				...toRefs(state),
				freightInfoRef,
				declareInfoRef,
				commit,
				cancel,
				save,
				closeDialog,
				rate,
				initData,
			}
		}
	}
</script>
<style lang="scss" scoped>
	.logistics-box {
		background: #fff;
		:deep(.title) {
			height: 55px;
			line-height: 55px;
			padding: 0 30px;
			border-bottom: 1px solid #e9e9e9;
		}
		:deep(.content) {
			padding: 15px 30px 15px;
		}
		::v-deep(.item-form) {
			.el-form-item + .el-form-item {
				margin-left: 20px;
			}
		}
		:deep(.required) {
			color: #fd4c60;
		}
	}
	.footer-content {
		text-align: right;
		padding-right: 25px;
		:deep(.el-input) {
			width: 530px;
		}
		:deep(.el-button) {
			margin-left: 15px;
		}
	}
	.logistics-box + .logistics-box {
		margin-top: 20px;
	}
</style>
