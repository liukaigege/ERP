<template>
	<div>
		<erp-nav title="批量报价" :routeOpt="{name: 'Quotation',params:{goodsStatus: 4}}" :goBack="goBack"></erp-nav>
		<div class="steps-box">
			<el-steps :active="active" align-center>
				<el-step title="运费信息"></el-step>
				<el-step title="报关信息"></el-step>
			</el-steps>
		</div>
		<div class="box-warp">
			<keep-alive>
				<component :key="activeCom" :is="activeCom" :info='info' ref='comRef' :rate='rate' @del='del'></component>
			</keep-alive>
		</div>
		<div class="logistics-batch-footer">
			<div class="footer-box">
				<template v-if="active===1">
					<el-button  @click="cancel">取消</el-button>
					<el-button type="primary"  @click="nextStep">下一步</el-button>
				</template>
				<template v-else>
					<el-button  @click="preStep">上一步</el-button>
					<el-button  @click="cancel">取消</el-button>
					<el-button type="primary"  @click="save">保存并退出</el-button>
					<el-button type="primary"  v-debounce="commit">提交报价</el-button>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
	import { toRefs, computed, reactive, ref } from 'vue'
	import { useStore } from 'vuex'
	import { useRouter, useRoute } from "vue-router"
	import erpNav from '@/components/erpNav/index.vue'
	import freightInfo from './components/FreightInfo.vue'
	import declareInfo from './components/DeclareInfo.vue'
	import { logisticsBatchInfo, logisticsBatch } from "@/api/goods/logistics"
	import { fmtSku } from "@/views/goods/components/Logistics/composables/fmtSku"
	import { ElMessageBox } from 'element-plus'
	import { getExchangeRataListPage } from '@/api/financial.js'
  import { validateGoodsStatus } from '@/api/goods/quotation.js'
    import {debounce} from '@/directives/erpToolsDirective'
	export default {
		components: { erpNav, freightInfo, declareInfo },
    directives: {debounce},
		setup() {
			let state = reactive({
				info: [],
				activeCom: 'freightInfo',
				active: 1,
			})
			let goodsIds = useRoute().query.ids.split(',')
			let obj = { baseCurrency: "USD", originalCurrency: "CN", page: { pageNo: 1, pageSize: 100 } }
			let rate = ref('')
			Promise.all([getExchangeRataListPage(obj), logisticsBatchInfo({ goodsIds })]).then(res => {
				rate.value = res[0].data.dataList[0].rate // 获取美元汇率，用于计算建议售价
				state.info = res[1].data
				state.info.forEach(item => {
					item.skus = fmtSku(item, true)
				})
			})

			let store = useStore()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			let router = useRouter()
			let comRef = ref(null)
			async function nextStep() {
				let err = await comRef.value.validate().catch(err => err)
				if (!err) {
					state.active = 2
					state.activeCom = 'declareInfo'
				}
			}
			function del(index) {
				state.info = state.info.filter((item, i) => i !== index)
			}
			function preStep() {
				state.active = 1
				state.activeCom = 'freightInfo'
			}
			function cancel() {
        goBack()
			}
			function save() {
				logisticsBatch({ type: 0, goods: state.info }).then((res) => {
					if (res.code == 261011) {
						isQuoted()
					} else {
						router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
					}
				})
			}
			function goBack() {
				validateGoodsStatus({ goodsIdList: goodsIds, type: 2 }).then(res => { // 校验是否已经申请报价完成
					if (res.data.result) {
						ElMessageBox.confirm("确认终止当前报价流程？", {
							confirmButtonText: '确定',
							cancelButtonText: '停留',
							type: 'warning',
						}).then(() => {
							router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
						})
					} else {
						ElMessageBox.confirm('该商品已被其他用户已完成物流报价流程！', '提示', {
							confirmButtonText: '确认并退出',
							closeOnClickModal: false,
							closeOnPressEscape: false,
							showCancelButton: false,
							showClose: false
						}).then(_ => {
							router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
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
						router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
					},
				})
			}
			async function commit() {
				let err = await comRef.value.validate().catch(err => err)
				if (!err) {
					let indexs = [] // 收集 sku 报价开关 全是关闭的
					let flag = state.info.every((item, index) => {
						if (item.skus.every(sku => sku.lgtSwitch != 1)) {
							indexs.push(index)
							return true
						}
						return false
					})
					if (flag) {
						ElMessageBox({
							title: "提示",
							message: '批量报价至少开启一个商品SKU的报价开关！',
							type: 'warning'
						})
					} else {
						logisticsBatch({
							type: 1,
							goods: state.info.filter((item, index) => !indexs.includes(index)) // 移除sku 报价开关 全是关闭的
						}).then(() => {
							router.push({ name: 'Quotation', params: { goodsStatus: 4 } })
						}).catch(err => {
							if (err.code == 261011) {
								isQuoted()
							}
						})
					}
				}
			}
			return {
				...toRefs(state),
				sideBarWidth,
				nextStep,
				save,
				commit,
				preStep,
				cancel,
				comRef,
				del,
				goBack,
				rate
			}
		}
	}
</script>
<style lang="scss" scoped>
	.steps-box {
		margin: 0 -25px;
		background: #fff;
	}
	.box-warp {
		background: #fff;
		padding: 25px;
		margin: 25px 0;
	}
	.logistics-batch-footer {
		background: #fff;
		position: fixed;
		height: 52px;
		left: v-bind(sideBarWidth);
		right: 0;
		bottom: 0;
		transition: left 1s;
		text-align: right;
		z-index: 11;
		.footer-box {
			margin-right: 20px;
			line-height: 52px;
		}
	}
</style>
