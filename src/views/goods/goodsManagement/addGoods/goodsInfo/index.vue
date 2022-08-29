<template>
	<div class="goodsInfo">
		<div class="tabs">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="基本信息" name="0">
					<BaseInfo
						style="backgroundcolor: #f9f9fb"
						@onLoad="loadRich"
						:ref="
							el => {
								refList[0] = el
							}
						"
						:type="type"
						:isEdit="isEdit"
						:query="basicInfoQuery"
						@changeCategory="changeCategory"
					/>
				</el-tab-pane>
				<el-tab-pane label="商品图片" name="1">
					<GoodsImg
						:ref="
							el => {
								refList[1] = el
							}
						"
						:query="imgQuery"
					/>
				</el-tab-pane>
				<el-tab-pane label="规格属性" name="2">
					<Sku
						:ref="
							el => {
								refList[2] = el
							}
						"
						:speList="speList"
						:query="speQuery"
						style="backgroundcolor: #fff; padding: 20px"
						:goodsInfo="groupGoodsInfo"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="btns flex-pagination page-fixed" v-if="!showCombineGoods">
			<el-button type="default"  @click="close">关闭</el-button>
			<el-button
				type="primary"

				@click="submit"
				:disabled="submitDisabled"
				>保存</el-button
			>
		</div>

		<div class="btns flex-pagination page-fixed" v-else>
			<el-button type="default"  @click="close">
				{{ showComBineBtn ? '取消组合' : '关闭' }}
			</el-button>
			<el-button
				type="primary"

				@click="submit"
				:disabled="submitDisabled"
			>
				{{ showComBineBtn ? '保存商品' : '确定' }}</el-button
			>
		</div>

		<perDilago
			v-if="dialogVisible"
			@cancel="() => (dialogVisible = false)"
			@ok="okPer"
		/>
	</div>
</template>

<script>
import { ElMessage } from 'element-plus';
import {
	reactive,
	toRefs,
	ref,
	provide,
	computed,
	onMounted,
	getCurrentInstance,
	onActivated,
	nextTick,
	watch
} from 'vue'
import { useRoute } from 'vue-router'
import GoodsImg from '@/views/goods/components/goodsImg/index.vue'
import Sku from '@/views/goods/components/sku/index.vue'
import BaseInfo from '@/views/goods/components/basicInfo/index.vue'
import PerDilago from '../components/perDilago'
import { add, info, update, speList } from '@/api/goods/addGoods.js'
import optionJson from '@/views/goods/components/sku/hooks/optionJson.js'
import skuItemHook from '@/views/goods/components/sku/hooks/skuItem.js'
import { isObjectValueEqual, deepCopy } from '@/utils/tool.js'
export default {
	components: { GoodsImg, Sku, BaseInfo, PerDilago },
	props: {
		editGoodsId: {
			type: String,
			default: null
		},
		combineType: {
			type: Number,
			default: 1 // 1 单品 2 组合品
		},
		goTab: {
			type: String,
			default: null
		},
		type: {
			type: String,
			default: null
		},
		goodsInfo: {
			type: Array,
			default: []
		},
		copyGoodsInfo: {
			type: Object,
			default: null
		}
	},
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const { confirm } = skuItemHook()
		const route = useRoute()
		const data = reactive({
			activeName: '0',
			goodsImgInfo: null,
			refList: [],
			imgQuery: null, // 图片回显参数
			speQuery: null,
			basicInfoQuery: null, //基本信息回显
			speList: [],
			mode: 2,
			stauts: null,
			oldDetail: null,
			dialogVisible: false,
			param: null,
			groupGoodsInfo: []
		})
		// 注入图片信息 \
		const baseRef = computed(() => data.refList[0])
		const imgRef = computed(() => data.refList[1])
		const skuRef = computed(() => data.refList[2])
		const routeName = computed(() => route.name)
		const isDisabled = computed(() => {
			let nameList = ['ApplyGoodsDetail']
			if (nameList.indexOf(routeName.value) !== -1) return true
			if (props.type && props.type == 'layList') return true
			return false
		})
		const routeOption = optionJson[routeName.value]
		const showCombineGoods = computed(() => {
			let nameWhiteList = ['AddGroupgoods']
			if (nameWhiteList.includes(routeName.value)) return true
			if (props.combineType === 2) return true
			return false
		}) // 是否显示组合品

		const showComBineBtn = computed(() => {
			let nameList = ['AddGroupgoods']
			return nameList.includes(routeName.value)
		})

		const isEdit = computed(() => {
			let nameList = ['ApplyGoodsDetail']
			if (nameList.indexOf(routeName.value) !== -1) return false
			if (props.type && props.type == 'layList') return false
			return true
		})

		provide('routeName', routeName.value)
		provide('isDisabled', isDisabled.value) // 是否全局不可编辑 true false
		provide('goodsImgRef', imgRef)
		provide('skuRef', skuRef)
		provide('baseRef', baseRef)
		provide('showCombineGoods', showCombineGoods.value) //是否显示组合品
		function handleClick(params) {
			if (params.paneName == '2') {
				const categoryId = data.refList[0].form.categoryId
				if (!categoryId) {
					ElMessage.error(
						'当前商品还未设置品类,请先设置商品品类再设置规格属性!'
					)
					setTimeout(() => {
						data.activeName = '0'
					}, 500)
				} else {
					getSpeList()
				}
			}
			skuRef.value.relationSingle()
		}


		function goTbaInit(type,categoryId){
			if (type == '2') {
				nextTick(()=>{
					getSpeList(categoryId)
				})
			}
		}


		function submitGroup() {
			data.dialogVisible = true
		} // 提交组合

		function okPer(active) {
			data.dialogVisible = false
			data.param['authType'] = active || 0
			sumitFun(data.param)
		}

		function submit() {
			const basicInfo = data.refList[0].validStatusEvent()

			if (!basicInfo) return (data.activeName = '0')
			let promiseList = []
			for (var i = 0; i < data.refList.length; i++) {
				let item = data.refList[i]
				if (i !== 0) {
					promiseList.push(item.validate())
				}
			}
			if (promiseList.length == 0) return
			Promise.all([...promiseList])
				.then(res => {
					submitForm(res, basicInfo)
				})
				.catch(err => {
					const { type, status, message } = err
					console.log(err)
					if (type == 'goodsImg') {
						data.activeName = '1'
						data.refList[1].activeTab = status
						if (message) ElMessage.error(message)
						return
					}
					if (type == 'Spes') {
						data.activeName = '2'
						ElMessage.error(message)
						return
					}
				})
		}

		function submitForm(promiseArray, basicInfo) {
			let param = deepCopy(basicInfo)
			promiseArray.forEach(item => {
				if (item.type == 'goodsImg') {
					for (let i in item.imgInfo) {
						param[i] = item.imgInfo[i]
					}
				}
				if (item.type == 'Spes') {
					const { skuType } = item.spesInfo
					for (let i in item.spesInfo) {
						if (!item.checked) {
							if (i == 'commonAttr') {
								param[i] = null
							} else if (i == 'custAttr') {
								param[i] = []
							} else {
								param[i] = null
							}
						} else if (item.radio == 2 && i == 'custAttr') {
							param[i] = []
						} else if (item.radio == 3 && i == 'commonAttr') {
							param[i] = {}
						} else {
							param[i] = item.spesInfo[i]
						}
					}
					if (data.status) param['status'] = data.status
					param['skuType'] = skuType

					if (showCombineGoods.value) {
						param['combineType'] = 2

						param['goodsCombinationRelation'] = data.groupGoodsInfo?.map(v => {
							return {
								relationId: v.relationId || v.id
							}
						})
						if (item.sku && item.radio === 1 && showCombineGoods.value) {
							param['commonAttr'] = {}
							param['commonAttr']['sku'] = item.sku
						}
					} // 新增已报价组合品
				}
			})

			param['mode'] = data.mode
			if (
				showCombineGoods.value &&
				!param['authType'] &&
				showComBineBtn.value
			) {
				data.param = param
				data.dialogVisible = true
				return
			} // 如果是新增组合品但是权限参数不存在的时候,打开弹框
			sumitFun(param)
		}

		function sumitFun(param) {
			const { editGoodsId } = props
			if (!editGoodsId) {
				routeOption.fun.add(param).then(res => {
					if (res.code == 200) {

						ElMessage.success(showComBineBtn.value
							? '保存成功,请在已报价-组合品查找商品'
							: '新增成功')
						cancel(true, false)
					}
				})
			} else {
				param['id'] = editGoodsId
				routeOption.fun.update(param).then(res => {
					if (res.code == 200) {
						ElMessage.success('修改成功')
						cancel(true, false)
					}
				})
			}
		}
		function cancel(refersh = false, isTest = true) {
			if (!isTest) return ca()
			let configTitle = showCombineGoods.value
				? showComBineBtn.value
					? '确认取消新增组合品?'
					: '确认取消编辑组合品?'
				: '商品内容有修改是否放弃修改?'
			cancelTest()
				.then(res => {
					ca()
				})
				.catch(err => {
					confirm(configTitle, () => {
						setTimeout(() => ca(), 500)
					})
				})

			function ca() {
				if (props.type === 'layList') {
					emit('cancel', 'layList')
				} else {
					emit('cancel', refersh)
				}
			}
		} // 关闭商品详情

		function close() {
			if (props.type === 'layList') {
				cancel(false, false)
			} else {
				cancel(false)
			}
		}

		function init(cb) {
			const { editGoodsId } = props
			if (!editGoodsId) return
			const param = {
				goodsId: editGoodsId
			}
			routeOption.fun.info(param).then(res => {
				const {
					attrImages,
					goodsImages,
					videoCover,
					videoCoverCompress,
					videoUrl,
					commonAttr,
					custAttr,
					skuType,
					id,
					collectionUrl,
					originalPrice,
					status,
					referenceUrls,
					nameCn,
					nameEn,
					categoryId,
					labels,
					source,
					expectPrice,
					costPrice,
					brief,
					descriptionCn,
					descriptionEn,
					mode,
					goodsRelation,
					copyStatus,
					enableCustom,
					goodsCustomTypeList,
					enableContainFitting,
					goodsCustomFittingList
				} = res.data
				cb({categoryId})
				if (status) data.status = status
				data.mode = mode
				data.basicInfoQuery = {
					collectionUrl,
					originalPrice,
					referenceUrls,
					nameCn,
					nameEn,
					categoryId,
					labels,
					source,
					expectPrice,
					costPrice,
					brief,
					descriptionCn,
					descriptionEn,
					mode,
					copyStatus
				}
				data.imgQuery = {
					attrImages: changeImgList(attrImages),
					goodsImages: changeImgList(goodsImages),
					videoCover,
					videoCoverCompress,
					videoUrl
				}
				var spes, skus, sku
				if (commonAttr) {
					spes = commonAttr.spes
					skus = commonAttr.skus || []
					sku = commonAttr?.sku
				}
				data.groupGoodsInfo = goodsRelation
				data.speQuery = {
					spes,
					skus,
					sku,
					custAttr,
					skuType,
					goodsRelation,
					editGoodsId,
					enableCustom,
					goodsCustomTypeList,
					enableContainFitting,
					goodsCustomFittingList
				}
			})

			function changeImgList(arr) {
				arr?.forEach(item => {
					item.checked = false
				})
				return arr
			}
		}

		function copyGoodsInfos() {
			if(!props.copyGoodsInfo?.id) return
			const { id } = props.copyGoodsInfo
			const param = {
				goodsId: id
			}
			routeOption.fun.info(param).then(res => {
				const {
					attrImages,
					goodsImages,
					videoCover,
					videoCoverCompress,
					videoUrl,
					copyStatus,
					collectionUrl,
					originalPrice,
					status,
					referenceUrls,
					nameCn,
					nameEn,
					categoryId,
					labels,
					source,
					expectPrice,
					costPrice,
					brief,
					descriptionCn,
					descriptionEn,
					mode
				} = res.data
				if (status) data.status = status
				data.mode = mode
				data.basicInfoQuery = {
					copyStatus,
					collectionUrl,
					originalPrice,
					referenceUrls,
					nameCn,
					nameEn,
					categoryId,
					labels,
					source,
					expectPrice,
					costPrice,
					brief,
					descriptionCn,
					descriptionEn,
					mode
				}
				data.imgQuery = {
					attrImages: changeImgList(attrImages),
					goodsImages: changeImgList(goodsImages),
					videoCover,
					videoCoverCompress,
					videoUrl
				}
			})

			function changeImgList(arr) {
				arr?.forEach(item => {
					item.goodsId = null
					item.id = null
					//图片的id 和goodsId 全部置为空,否则接口提交导致数据紊乱
					item.checked = false
				})
				return arr
			}
		} // 新增组合品的回显信息

		const submitDisabled = computed(() => {
			if (props.type && props.type == 'layList') return true
			return false
		})

		function changeCategory(val) {
			//  confirm('品类更改后，规格属性设置中使用的常用规格会被清除，需重新设置，确认更改吗？')
			console.log(val, '=>品类')
			// 如果有使用常用规格,则二次提醒

			console.log(data.refList[2].form)
			let { spes, coustom, skus } = data.refList[2].form
			const { checked, radio } = data.refList[2]
			if (testCommonSpeId()) {
				confirm(
					'品类更改后，规格属性设置中使用的常用规格会被清除，需重新设置，确认更改吗？',
					() => {
						spes = clearCommonSpeValId(spes, 'speValues')
						coustom = clearCommonSpeValId(coustom, 'speValues')
						skus = clearCommonSpeValId(skus, 'speValues')
						console.log(skus)
					},
					() => {
						data.refList[0].editCategory()
					}
				)
			}

			function testCommonSpeId() {
				if (!checked && radio !== 2) return false
				let bole
				let x = spes?.every(v => v.commonSpeId)
				bole = x
				return bole
			} // 校验是否存在常用规格id

			function clearCommonSpeValId(arr, child) {
				if (arr?.length > 0) {
					arr.forEach(item => {
						if (item.commonSpeValId) item.commonSpeValId = null
						if (item.commonSpeId) item.commonSpeId = null
						if (item.skuCode) item.skuCode = null
						if (child && item[child]?.length > 0)
							clearCommonSpeValId(item[child])
					})
				}
				return arr
			}
		} // 切换品类

		function loadRich(val) {
			// console.log(val)
			getCancelTestVal().then(res => {
				console.log(res, '渲染过后的')
				data.oldDetail = deepCopy(res)
			})
		} // 渲染富文本

		function getCancelTestVal() {
			return new Promise(reslove => {
				let promiseList = []
				for (var i = 0; i < data.refList.length; i++) {
					let item = data.refList[i]
					promiseList.push(item.cancelReturnVal())
				}
				Promise.all([...promiseList]).then(res => {
					reslove(res)
				})
			})
		} // 获取最新无需校验的数据

		function cancelTest() {
			return new Promise((reslove, reject) => {
				getCancelTestVal().then(res => {
					const x = isObjectValueEqual(res, data.oldDetail)
					console.log(x)
					if (x) {
						reslove()
					} else {
						reject()
					}
				})
			})
		} // 取消之前检查是否有过变更数据

		onActivated(() => {
			getSpeList()
		})

		function getSpeList(id) {
			const categoryId = data.refList[0].form.categoryId || id
			const param = {
				categoryId
			}
			speList(param).then(res => {
				if (res.code == 200) data.speList = res.data
			})
		}

		watch(
			() => props.goodsInfo,
			a => {
				data.groupGoodsInfo = a
			}
		)

		onMounted(() => {
			data.activeName = '0'
			init(value=>{
				if (props.goTab) {
					const {categoryId} = value
					data.activeName = props.goTab
					goTbaInit(props.goTab,categoryId)
				}
			})
			copyGoodsInfos()
			nextTick(() => {
				setTimeout(() => {
					getCancelTestVal().then(res => {
						data.oldDetail = deepCopy(res)
					})
				}, 500)

			})
		})

		return {
			...toRefs(data),
			handleClick,
			submit,
			changeCategory,
			cancel,
			isEdit,
			submitDisabled,
			loadRich,
			cancelTest,
			close,
			routeName,
			submitGroup,
			okPer,
			showCombineGoods,
			showComBineBtn
		}
	}
}
</script>

<style lang="scss" scoped>
.goodsInfo {
	cursor: pointer;
}
.tabs {
	margin-bottom: 60px;
}
:deep(.el-tabs__nav-scroll) {
	padding: 0 20px;
	background-color: #fff;
}

:deep(.el-tabs__header) {
	margin-bottom: 25px;
}

:deep(.el-tabs__nav-wrap::after) {
	height: 0;
}

.btns {
	justify-content: flex-end !important;
	padding-right: 25px;
}
:deep(.el-tabs__content) {
	overflow: visible;
}
</style>
