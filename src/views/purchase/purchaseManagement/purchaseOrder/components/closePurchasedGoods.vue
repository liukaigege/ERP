<template>
	<el-dialog title="关闭采购商品" v-model="show" width="550px" @close="close" :close-on-click-modal="false" :destroy-on-close="true">
		<div class="info">
			<el-form :model="form" :label-width="100">
				<el-form-item label="商品数量:">
					<span>{{quality}}</span>
					<span style="margin-left:50px">
						采购金额:
					</span>
					<span style="margin-left:10px">¥{{amount}}</span>
				</el-form-item>
				<el-form-item label="退款金额:">
					<el-input-number style="width:150px" v-model="form.closeAmount" :min="0" :max="9999999.99" :controls="false" :precision="2"></el-input-number>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input type="textarea" style="width:350px" v-model="form.closeRemark" show-word-limit maxlength="30" />
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="show = false">取 消</el-button>
				<el-button type="primary" @click="ok">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { computed, onMounted, reactive, toRefs } from 'vue'
	import { useRouter } from 'vue-router'
	import { closePurchaseItemOrderRel, saveClosePurchaseItemOrderRel } from '@/api/purchase/order'
import { ElMessage } from 'element-plus'
	export default {
		emits: ['closeEvent'],
		// props: ['info'],
		props: {
			info: { // 模块名
				type: Object,
				default: () => { }
			},
			selectList: {
				type: Array,
				default: []
			},
			typeClose: {
				type: String
			},
			purchaseOrderNumber: {
				type: String
			}
		},
		setup(props, ctx) {
			const router = useRouter()
			const state = reactive({
				show: true,
				form: {
					closeAmount: null,
					closeRemark: ''
				},
				amount: null,
				quality: null
			})
			onMounted(() => {
				let ids = []
				ids = props.selectList.map(item => item.id)
				closePurchaseItemOrderRel({ ids }).then(res => {
					state.amount = res.data.amount
					// state.form.closeAmount = res.data.amount
					state.quality = res.data.quality
				})
			})
			//确定
			function ok() {
				let params = {};
				//  params.ids=[]
				let ids = [], productIds = [];
				ids = props.selectList.map(item => item.id)
				productIds = props.selectList.map(item => item.productId)
				params = {
					ids: ids,
					productIds: productIds,
					purchaseOrderNumber: props.purchaseOrderNumber
				}
				params.closeAmount = state.form.closeAmount-0
				params.closeRemark = state.form.closeRemark
				console.log(params, 'params');
				saveClosePurchaseItemOrderRel(params).then(res => {
					if (props.typeClose == 'single') {
            ElMessage.success('操作成功')
						ctx.emit('closeEvent', true)
						console.log('single');
					} else {
            ElMessage.success('操作成功')
						ctx.emit('closeEvent', false)
						router.push({ name: 'PurchaseOrders' })
						console.log('batch');
					}
				})
			}
			function close() {
				state.show = false
				setTimeout(() => {
					ctx.emit('closeEvent', false)
				}, 500)
			}
			return {
				...toRefs(state),
				close,
				ok,
			}
		}
	}
</script>

<style lang="scss" scoped>
.info {
}
</style>
