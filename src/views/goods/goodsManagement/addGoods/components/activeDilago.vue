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
			<div v-if="showContent">
				<div class="content" v-if="querys.checkType == 1">
					<p>
						<i
							class="el-icon-warning"
							style="color: #faad14; font-size: 14px"
						></i>
						激活商品来源重复，请勿重复激活。
					</p>
					<p v-if="querys.query.status === 99">
						由于当前账号无{{
							querys.query.categoryName
						}}品类权限，所以无法使用已激活商品
					</p>
					<p v-else>
						可复制商品编码在【商品开发-{{
							CopyStatus(querys.query.status)
						}}】中搜索查看该激活商品。
					</p>
				</div>

				<!-- 重复来源 -->

				<div class="content" v-if="querys.checkType == 2">
					<p>
						<i
							class="el-icon-warning"
							style="color: #faad14; font-size: 14px"
						></i>
						该商品
						<span v-for="(item, index) in querys.query" :key="index">
							{{ item.speName }}规格-{{ item.speValName }}参数,
						</span>
						未匹配常用规格，请先匹配常用规格后，再激活。
					</p>
				</div>

				<div class="content" v-if="querys.checkType == 3">
					<p>
						<i
							class="el-icon-warning"
							style="color: #faad14; font-size: 14px"
						></i>
						激活商品存在相似，是否继续激活？
					</p>
					<el-button type="text" @click="similarGoods"
						>查看相似商品 >></el-button
					>
				</div>
				<!-- 相似商品 -->

				<div class="content" v-if="querys.checkType == 4">
					<p>
						<i
							class="el-icon-warning"
							style="color: #faad14; font-size: 14px"
						></i>
						激活商品存在侵权，是否申请审核？
					</p>
					<el-button type="text" @click="tortDetail">查看侵权明细 >></el-button>
				</div>
				<!-- 侵权商品 -->

				<div class="content" v-if="querys.checkType == 5">
					<p>
						<i
							class="el-icon-warning"
							style="color: #faad14; font-size: 14px"
						></i>
						该商品SKU图片或期望售价未设置
					</p>
				</div>
			</div>
			<div v-if="!showContent">
				<div class="content" v-if="showType == 4">
					<p>申请审核成功，请等待审核结果。</p>
					<p>审核通过后，可直接在【商品开发-待申请】中查看。</p>
				</div>

				<div class="activeF" v-if="showType == 3">
					<el-form :model="form" ref="formRef" :rules="rules">
						<el-form-item label="查看范围：" prop="active">
							<el-select v-model="form.active" placeholder="">
								<el-option
									v-for="(item, index) in authTypeOptionsBK"
									:key="index"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<p style="margin: -10px 0 0 90px" class="tollitpText">
						报价成员及部门负责人可不受权限限制
					</p>
				</div>

				<div v-if="showType == 5">商品激活成功，是否继续【申请报价】？</div>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<!-- <el-button  @click="cancel" v-if="query.checkType == 3 && showContent"
            >取 消</el-button
          > -->
					<el-button @click="cancel">取 消</el-button>

					<el-button type="primary" v-debounce="setPer" v-if="showType == 3"
						>确定</el-button
					>
					<el-button
						type="primary"
						v-debounce="activeAgain"
						v-if="querys.checkType == 3 && showContent"
						>继续激活</el-button
					>
					<el-button
						type="primary"
						v-if="
							querys.checkType == 1 && showContent && querys.query.status !== 99
						"
						v-copy="querys.query.goodsId"
						>复制商品编码</el-button
					>

					<el-button
						type="primary"
						v-debounce="activate"
						v-if="querys.checkType == 4 && showContent"
						>申请审核</el-button
					>
					<el-button
						type="primary"
						v-debounce="goMatched"
						v-if="querys.checkType == 2 && showContent"
						>去匹配</el-button
					>
					<el-button
						type="primary"
						v-debounce="setPrice"
						v-if="showType == 5 && !showContent"
						>申请报价</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {
	reactive,
	toRefs,
	getCurrentInstance,
	ref,
	onMounted,
	computed
} from 'vue'
import { useRouter } from 'vue-router'
import {
	activateCheck,
	setPermission,
	applyOffer,
	goActivate
} from '@/api/goods/addGoods.js'
import { ElMessage } from 'element-plus'
import { authTypeOptionsBK } from '@/assets/js/staticData.js'
import { storage } from '@/utils/storage.js'
export default {
	props: {
		query: {
			type: Object,
			default: null
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '30%'
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const router = useRouter()
		const formRef = ref(null)
		const data = reactive({
			form: {
				active: 0
			},
			showContent: true,
			showType: null,
			querys: {}
		})
		const rules = {
			active: [{ required: true, message: '请选择权限范围', trigger: 'change' }]
		}

		const dialogTitle = computed(() => {
			const { checkType } = props.query
			let x = '验证重复'
			switch (checkType) {
				case 2:
					x = 'SKU编码未设置'
					break
				case 4:
					x = '验证侵权'
					break
				case 5:
					x = 'SKU图片或期望售价未设置'
					break
			}
			if (!data.showContent) {
				switch (data.showType) {
					case 4:
						x = '侵权待审'
					case 3:
						x = '设置权限'
					case 5:
						x = '激活商品'
				}
			}
			console.log(data.showContent, data.showType)
			return x
		})

		const dialogHandOk = () => {}

		const close = () => {
			cancel()
		}
		const cancel = () => {
			context.emit('cancel')
			// proxy.$parent.ActiveDilaogShow = false
		}

		function activate() {
			const { goodsId } = props.query
			activateCheck({ goodsId }).then(res => {
				if (res.code == 200) {
					data.showContent = false
					data.showType = 4
				}
			})
		}

		function tortDetail() {
			const { goodsId } = props.query
			router.push({ name: 'tortDetail', query: { goodsId } })
			cancel()
		}

		function similarGoods() {
			const { goodsId } = props.query
			const query = {
				query: props.query.query,
				goodsId,
				name: 'activationDialog'
			}
			storage.set('similarGoods', JSON.stringify(query))
			router.push({ name: 'similarGoods' })
			cancel()
		}

		function CopyStatus(val) {
			let x
			switch (val) {
				case 1:
					x = '待申请'
					break
				case 2:
					x = '待采购报价'
					break
				case 3:
					x = '采购打回'
					break
				case 4:
					x = '待物流报价'
					break
				case 5:
					x = '物流打回'
					break
				case 6:
					x = '已报价'
					break
				case 10:
					x = '搁置中'
					break
        case -1:
          x = '侵权商品管理'
          break
			}
			return x
		}

		// 1待申请 2待采购报价 3采购打回 4待物流报价 5物流打回 6已报价

		function setPer() {
			formRef.value.validate().then(res => {
				const param = {
					goodsIds: props.query.goodsId,
					authType: data.form.active,
					similarGoods: 0,
					goodsId: props.query.goodsId
				}
				setPermission(param).then(res => {
					if (res.code == 200) {
						proxy.$parent.search()
						// let authType
						// switch (data.form.active) {
						//   case 0:
						//     authType="全部可见"
						//     break;
						//     case 1:
						//     authType="仅部门成员可见"
						//     break;
						//     case 2:
						//     authType="仅自己可见"
						//     break;
						//   default:
						//     break;
						// }
						data.showType = 5
						//  const emitParam = {goodsIds:props.query.goodsId,authType}
						//  context.emit('setPerSuccess',emitParam)
						//  cancel()
					}
				})
			})
		}
		// 设置权限范围

		function setPrice() {
			const { goodsId } = props.query
			applyOffer({ goodsIds: goodsId }).then(res => {
				if (res.code == 200) {
					ElMessage.success('申请报价成功')
					cancel()
				}
			})
		} // 申请报价

		function success() {
			data.showContent = false
			data.showType = 3
		} // 激活第一道程序成功

		function goMatched() {
			context.emit('matching', props.query.goodsId)
			cancel()
		}

		function activeAgain() {
			const { goodsId } = props.query
			goActivate({ goodsId }).then(res => {
				if (res.code == 200) {
					if (res.data.failMsg) {
						data.querys.checkType = 4
						console.log(data.querys)
					} else {
						data.showType = 3
						data.showContent = false
					}
				}
			})

			// data.showType = 3 ;
			// data.showContent = false
		} //goActivate 存在相似继续激活

		onMounted(() => {
			data.querys = props.query
			if (props.query.status == 'success') {
				success()
			}
			console.log(data.querys)
		})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			rules,
			dialogTitle,
			activate,
			tortDetail,
			similarGoods,
			setPer,
			formRef,
			setPrice,
			goMatched,
			authTypeOptionsBK,
			CopyStatus,
			activeAgain
		}
	}
}
</script>

<style lang="scss" scoped>
.tollitpText {
	font-size: 12px;
	color: #9e9e9e;
}
</style>
