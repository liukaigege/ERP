<template>
	<div class="skuContainer">
		<div class="skuInfo" v-if="showCombineGoods" style="padding: 10px">
			<el-card>
				<template #header> 组合商品规格信息 </template>
				<div class="skuInfoTable">
					<el-table :data="groupGoodsInfo" max-height="250">
						<el-table-column
							prop="nameEn"
							label="商品信息"
							width="500"
							align="center"
						>
							<template #default="scope">
								<div class="goodsInfo">
									<div class="image">
										<el-popover
											placement="right-start"
											trigger="hover"
											width="auto"
										>
											<el-image
												:src="scope.row?.mainImgUrl || scope.row?.mainImageUrl"
												style="width: 200px; height: 200px"
												fit="contain"
											></el-image>

											<template #reference>
												<el-image
													style="width: 67px; height: 67px"
													:src="
														scope.row?.mainImgUrl || scope.row?.mainImageUrl
													"
													fit="contain"
												></el-image>
											</template>
										</el-popover>
									</div>
									<div class="info">
										<p class="infoTitle" :title="scope.row.nameEn">
											{{ scope.row.nameEn }}
										</p>
										<p>{{ scope.row.id }}</p>
									</div>
								</div>
							</template>
						</el-table-column>

						<el-table-column
							prop="categoryName"
							label="品类"
							width="200"
							align="center"
						>
						</el-table-column>

						<el-table-column prop="nameEn" label="商品规格" align="center">
							<template #default="scope">
								<div
									style="
										display: flex;
										flex-direction: column;
										justify-content: flex-start;
									"
								>
									<div
										v-for="(item, index) in scope.row?.goodsSpeList ||
										scope.row?.goodsSpeVOList"
										:key="index"
									>
										{{ item.nameEn }}:
										<span
											v-for="(a, b) in item.speValues"
											style="margin-right: 10px"
											>{{ a.nameEn }}
										</span>
									</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-card>

			<div class="muliti">
				<div class="check">
					<!-- :disabled="isDisabled" -->
					<el-checkbox
						v-model="radio"
						:true-label="2"
						:false-label="1"
						label="启用多属性"
						@change="
							() => {
								radio === 2 ? (checked = true) : (checked = false)
							}
						"
						:disabled="isDisabled"
					></el-checkbox>
					<span>'启用多属性' 取消后，将不会推送多属性到库存SKU</span>
				</div>
				<div class="table">
					<el-table
						v-show="radio == 1"
						border
						style="margin: 20px 0; width: 70%"
						:data="relationSingle()"
					>
						<el-table-column
							prop="nameEn"
							label="图片"
							width="200"
							align="center"
						>
							<template #default="scope">
								<el-popover
									placement="right-start"
									trigger="hover"
									width="auto"
								>
									<el-image
										style="width: 200px; height: 200px"
										:src="scope.row.mainImg"
										fit="contain"
									></el-image>
									<template #reference>
										<el-image
											:src="scope.row.mainImg"
											style="width: 70px; height: 70px"
											fit="contain"
										></el-image>
									</template>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column prop="nameEn" label="商品名称" align="center">
						</el-table-column>
						<el-table-column
							prop="categoryName"
							label="商品品类"
							align="center"
						>
						</el-table-column>
						<el-table-column
							prop="combinGoods"
							label="已关联商品"
							align="center"
						>
							<template #default="scope">
								<p
									v-for="(item, index) in sku.goodsSkuCombinationRelation"
									:key="index"
								>
									{{ item.goodsId }}
									<span style="margin: 0 5px">{{ item.speLabel }}</span> x
									{{ item.coef }}
								</p>
							</template>
						</el-table-column>
						<el-table-column
							prop="option"
							label="关联商品"
							align="center"
							width="100"
						>
							<template #default="scope">
								<el-button type="text" @click="rela" v-if="!isDisabled">
									{{
										sku.goodsSkuCombinationRelation?.length > 0
											? '修改'
											: '关联'
									}}
								</el-button>
								<el-button type="text" @click="rela" v-if="isDisabled">
									查看
								</el-button>
							</template>
						</el-table-column>
					</el-table>

					<MultiSku
						ref="mulitiSkuRef"
						v-show="radio == 2"
						@showDradwer="showDradwer"
						@showSelectImg="showSelectImg"
						:skus="form.skus"
						:spes="form.spes"
						:goodsInfo="groupGoodsInfo"
					/>

<!--					<NewCoustom ref="newCustomRef" v-model="form.newCustom" v-show="radio == 2 "/>-->

				</div>
			</div>
		</div>
		<!--		新增已报价-->

		<div v-else>
			<div v-if="routeOption.showHead">
				<div class="header">
					<div>规格属性</div>
					<el-button
						type="text"
						v-if="radio !== 1 && checked && routeOption.add"
						:disabled="isDisabled"
						@click="go('/goods/ruleSettings/commonSpecifications/index')"
						>管理常用规格</el-button
					>
				</div>

				<div class="check" v-if="!routeOption.single">
					<!-- :disabled="isDisabled" -->
					<el-checkbox
						v-model="checked"
						label="启用多属性"
						:disabled="isDisabled"
					></el-checkbox>
					<span>'启用多属性' 取消后，将不会推送多属性到库存SKU</span>
				</div>

<!--				<div class="radio" v-if="showRadio">-->
<!--					<el-radio-group-->
<!--						v-model="radio"-->
<!--						:disabled="routeOption.disabled || isDisabled"-->
<!--					>-->
<!--						<el-radio :label="1" v-if="routeOption.single">单规格</el-radio>-->
<!--						<el-radio :label="2">普通多属性</el-radio>-->
<!--						<el-radio :label="3">定制属性</el-radio>-->
<!--					</el-radio-group>-->
<!--				</div>-->
			</div>
			<div class="table">
				<Single ref="signleRef" v-show="radio == 1" :skus="form.skus" />
				<MultiSku
					ref="mulitiSkuRef"
					v-show="radio == 2 && showRadio"
					@showDradwer="showDradwer"
					@showSelectImg="showSelectImg"
					:skus="form.skus"
					:spes="form.spes"
				/>
				<Coustom
					ref="coustomRef"
					v-show="radio == 3 && showRadio"
					@showDradwer="showDradwer"
					v-model="form.coustom"
					@delCoustom="delCoustom"
					@showRelationDialog="showRelationDialog"
				/>

				<template v-if="form.newCustom.enableCustom === 1">
					<CoustomInfo
						:goodsCustomFittingList = "form.newCustom.goodsCustomFittingList"
						:enableContainFitting='form.newCustom.enableContainFitting'
						:goodsCustomTypeList='form.newCustom.goodsCustomTypeList'
						v-if="routeName === 'goodsPublishDeatil'"
						style='margin-top: 50px'
					/>
				</template>

					<NewCoustom v-if="routeName !== 'goodsPublishDeatil'" ref="newCustomRef" v-model="form.newCustom" v-show="radio == 2 && showRadio"/>



			</div>


		</div>

		<el-drawer
			title="规格设置"
			v-model="drawer"
			v-if="drawer"
			size="32%"
			:show-close="true"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<AddSku
				ref="AddSkuRefs"
				:query="form.spes"
				@ok="addSkuOk"
				@cancel="cancel"
				@showSelectImg="showSelectImg"
				@selectSpe="selectSpe"
				v-show="showModule == 1"
			/>
			<CoustomDrawe
				ref="CoustomDraweRefs"
				@ok="addCoustomMainOk"
				@cancel="cancel"
				v-show="showModule == 2 && drawer"
				:query="drawerQuery"
				@showSelectImg="showSelectImg"
				@selectSpe="selectSpe"
			/>
			<CoustomChildDrawe
				ref="CoustomChildDraweefs"
				@ok="addCoustomChildOk"
				@cancel="cancel"
				v-show="showModule == 3 && drawer"
				:query="childDrawerQuery"
				@showSelectImg="showSelectImg"
				@selectSpe="selectSpe"
			/>
		</el-drawer>

		<SelectImg
			:dialogVisible="dialogVisible"
			:multiple="multiple"
			v-if="dialogVisible"
			:skuQuery="skuQuery"
			@selectImg="selectImg"
		/>

		<SpeDialog
			v-if="showSelectSpe"
			:dialogVisible="showSelectSpe"
			:query="selectSpeQuery"
			@selectSpeOk="selectSpeOk"
		/>
		<RelationDialog
			v-if="showRelation"
			:dialogVisible="showRelation"
			:query="relationQuery"
			@relationOk="relationOk"
		/>

		<RelationD :info="relationInfo" v-if="showRela" @close="closeRelation" />
	</div>
</template>

<script>
import {
	toRefs,
	reactive,
	ref,
	getCurrentInstance,
	onMounted,
	watch,
	provide,
	computed,
	inject
} from 'vue'
import { useRoute } from 'vue-router'
import RelationD from '@/views/components/RelationDialog.vue'
import MultiSku from '@/views/goods/components/sku/components/multiSku.vue'
import Coustom from '@/views/goods/components/sku/components/coustom.vue'
import AddSku from '@/views/goods/components/sku/components/addSku.vue'
import CoustomDrawe from '@/views/goods/components/sku/components/coustomDrawe.vue'
import CoustomChildDrawe from '@/views/goods/components/sku/components/coustomChildDrawe.vue'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import SpeDialog from '@/views/goods/components/sku/components/speDialog.vue'
import RelationDialog from './components/relationDialog.vue'
import Single from '@/views/goods/components/sku/components/single.vue'
import coustom from './hooks/coustom'
import NewCoustom from '@/views/goods/components/sku/components/newCoustom.vue'
import CoustomInfo from '@/views/goods/components/goodsDescription/components/coustomInfo.vue'
import optionJson from './hooks/optionJson'
import { deepCopy } from '@/utils/tool.js'

export default {
	props: {
		query: {
			type: Object,
			default: null
		},
		speList: {
			type: Array,
			default: []
		},
		goodsInfo: {
			type: Array,
			default: []
		} // 选中的组合商品信息
	},
	components: {
		MultiSku,
		Coustom,
		SpeDialog,
		RelationDialog,
		AddSku,
		CoustomDrawe,
		CoustomChildDrawe,
		SelectImg,
		Single,
		RelationD,
		NewCoustom,
		CoustomInfo
	},
	setup(props) {
		const { proxy } = getCurrentInstance()
		const isDisabled = inject('isDisabled')
		const baseRef = inject('baseRef')
		const imgRef = inject('goodsImgRef')
		const showCombineGoods = inject('showCombineGoods')
		const data = reactive({
			groupGoodsInfo: [], // 选中的组合品商品信息
			editGoodsId: null,
			relationInfo: null,
			showRela: false,
			sku: {
				id: null,
				goodsSkuCombinationRelation: []
			}, //已报价关联商品的单规格
			checked: true,
			radio: 2,
			drawer: false,
			showModule: null,
			form: {
				spes: null,
				skus: [],
				coustom: [],
				newCustom: {
					goodsCustomFittingList: [],
					enableCustom: 0,
					goodsCustomTypeList: [],
					enableContainFitting: 0
				}
			},
			dialogVisible: false,
			showSelectSpe: false,
			showRelation: false,
			skuQuery: null,
			multiple: true,
			drawerQuery: null,
			childDrawerQuery: null,
			selectSpeQuery: [],
			relationQuery: []
		})
		const routeName = inject('routeName')
		const speProps = computed(() => props.speList)
		const routeOption = optionJson[routeName]

		const showRadio = computed(() => {
			const { single } = routeOption
			if (single) return true
			return data.checked
		})
		watch(
			() => props.goodsInfo,
			a => {
				if (!props.query) data.groupGoodsInfo = a
			}
		)

		provide('speList', speProps)
		provide('routeOption', routeOption)

		const signleRef = ref(null)
		//单规格的ref
		const AddSkuRefs = ref(null)
		// 新增多规格的refs
		const CoustomDraweRefs = ref(null)
		//定制主规格
		const CoustomChildDraweefs = ref(null)
		//定制子规格

		const mulitiSkuRef = ref(null)
		const coustomRef = ref(null)
		const newCustomRef = ref(null)
		function addSkuOk(val) {
			const sku = deepCopy(val.sku)
			const spes = deepCopy(val.spes)
			console.log(spes, sku, '==>addSkuok')
			data.form.spes = spes
			let x = data.form.skus || []
			data.form.skus = comparisonSku(createSku(sku), deepCopy(x))
			cancel()
		} // 新增多规格结束

		function createSku(arr) {
			let newA = []
			arr.map(item => {
				let obj = {
					frontId: createSKUId(item),
					sku: null, //商品sku编码
					url: null, //图片链接
					originalPrice: null, //原价（USD）
					expectPrice: null, // 期望售价
					costPrice: null, //成本价
					skuSwitch: 1, //是否可用
					puhSwitch: 1, //采购报价开关
					lgtSwitch: 1, // 物流报价开关
					codeVal: null, //错码尺码
					weight: null, //重量
					lwh: null, //长宽高 *隔开
					length: null, //长
					width: null, // 宽
					height: null, // 高
					speValues: item
				}
				newA.push(obj)
			})
			return newA
			function createSKUId(x) {
				let id = 0
				x.map(item => {
					id += item.frontId
				})
				return id
			}
		} // 生成多规格sku
		//
		function relationSingle() {
			const { nameEn } = baseRef.value.form
			const { goodsImages } = imgRef.value.getVal()
			return [
				{
					nameEn: nameEn,
					mainImg: goodsImages[0]?.url,
					categoryName: baseRef.value.categoryName
				}
			]
		}

		// const relationSingle = computed(()=>{
		// 	const { nameEn } = baseRef.value.form
		// 	const { goodsImages } = imgRef.value
		// 	console.log(goodsImages)
		// 	return [
		// 		{
		// 			nameEn: nameEn,
		// 			mainImg: goodsImages[0]?.url,
		// 			categoryName: baseRef.value.categoryName
		// 		}
		// 	]
		// })

		function rela() {
			const { goodsSkuCombinationRelation, id } = data.sku
			let way = isDisabled ? 'detail' : id ? 'edit' : 'add'
			const query = {
				way,
				goodsSkuCombinationRelation:
					goodsSkuCombinationRelation?.length > 0
						? goodsSkuCombinationRelation
						: [],
				mainGoodsId: data.editGoodsId,
				mainSkuId: id,
				childGoodsIdList: data.groupGoodsInfo.map(v => v.id)
			}
			console.log(query)
			data.relationInfo = query
			data.showRela = true
		}

		function closeRelation(flag, arr, price) {
			console.log(arr, '==>关联商品')
			data.showRela = false
			if (flag) data.sku.goodsSkuCombinationRelation = arr
		}

		function comparisonSku(newSkus, oldSkus) {
			let nameList = ['goodsPublishDeatil']
			let arr = []
			newSkus?.forEach(a => {
				let x = oldSkus?.find(v => v.frontId == a.frontId)
				if (x && oldSkus?.length > 0) {
					x.speValues = a.speValues
					arr.push(x)
				} else {
					if (nameList.indexOf(routeName) == -1) arr.push(a)
				}
			})
			return arr
		} // 生成sku时比较新旧sku 保留未修改的旧数据

		function showDradwer(val, query) {
			if (val) {
				// console.log(val)
				data.showModule = val
				data.drawer = true
			}
			if (query) {
				val == 2 ? (data.drawerQuery = query) : (data.childDrawerQuery = query)
				// data.drawerQuery = query;
			}
		} // 打开抽屉

		function showRelationDialog(val) {
			data.showRelation = true
			data.relationQuery = val
		} // 打开匹配关联弹窗

		function relationOk(val) {
			console.log(data.form.coustom)
			data.form.coustom?.forEach(item => {
				if (item.normsType == 0) {
					const { bole, i } = findFa(item)
					if (bole) {
						item.speValues.forEach(a => {
							let z = findChild(a, i)
							if (z.bole) {
								a.childIds.push(z.selectedChildId)
								a.childIds = [...new Set(a.childIds)]
							} else {
								console.log(a.childIds, val[i].child)
								// a.childIds?.findIndex(v=>v.frontId == val[index])
								val[i].child?.forEach(item => {
									let y = a.childIds?.findIndex(v => v == item.selectedChildId)
									if (y !== -1) a.childIds.splice(y, 1)
								})
							}
						})
					}
				}
			})

			function findFa(item) {
				let bole = false
				for (let i = 0; i < val.length; i++) {
					if (val[i].fa.frontId == item.frontId) {
						return { bole: true, i }
					}
				}
				return { bole }
			}
			function findChild(item, index) {
				// console.log(item,val[index])
				let x = val[index].child.find(
					v => v.frontId == item.frontId && v.active
				)
				if (x) {
					return {
						bole: true,
						selectedChildId: x.selectedChildId
					}
				} else {
					return {
						bole: false
					}
				}
			}
		} // 子规格关联父规格

		function showSelectImg(val) {
			if (val) {
				data.skuQuery = val
				data.multiple = val.multiple
				data.dialogVisible = true
			}
		} // 打开选择图片弹窗

		function selectSpe(val) {
			data.selectSpeQuery = val
			data.showSelectSpe = true
		} // 选择常用规格

		function selectSpeOk(val) {
			const { query, selectList } = val
			const { type, index } = query
			if (type == 'muliti') {
				let r = AddSkuRefs.value.skuRefs[index - 1]

				r.addSpe(selectList)
			} // 多规格设置
			if (type == 'coustom') {
				CoustomDraweRefs.value.addSpe(selectList)
			} // 多规格设置
			if (type == 'coustomChild') {
				CoustomChildDraweefs.value.addSpe(selectList)
			} // 多规格设置
		}

		function selectImg(val) {
			const { query, url } = val
			if (query.type == 0) {
				data.form.skus.forEach(item => {
					if (query.ids?.indexOf(item.frontId) !== -1) {
						item.url = url[0].url
						item.pictureId = url[0].pictureId
						item.pictureType = 0
					}
				}) // 多规格列表
			} else if (query.type == 1) {
				let r = AddSkuRefs.value.skuRefs[query.index - 1]
				r.getImgList(url) // 新增图片
			} else if (query.type == 2) {
				CoustomDraweRefs.value.getImgList(url)
			} // 定制规格主规格
			else if (query.type == 3) {
				CoustomChildDraweefs.value.getImgList(url)
			} // 定制规格子规格
		} // 选择图片的emit

		function addCoustomMainOk(val) {
			const { emitQuery, query } = val
			const { index } = query
			const { speValues, isPhoto, commonSpeId, isParts } = emitQuery
			console.log('emitQuery', val)
			data.form.coustom[index].speValues = speValues
			data.form.coustom[index].isPhoto = isPhoto
			data.form.coustom[index].commonSpeId = commonSpeId
			data.form.coustom[index].isParts = isParts
			cancel()
		} // 配置定制规格

		function addCoustomChildOk(val) {
			const { emitQuery, query } = val
			const { index } = query
			const { speValues, isPhoto, commonSpeId } = emitQuery
			data.form.coustom[index].speValues = speValues
			data.form.coustom[index].isPhoto = isPhoto
			data.form.coustom[index].commonSpeId = commonSpeId
			cancel()
		} // 配置定制子规格

		function cancel() {
			data.showModule = null
			data.drawer = false
		} // 关闭弹窗

		function validate() {
			if(newCustomRef.value) newCustomRef.value.emitData()
				const { checked, radio, form } = data
			const { spes, skus, coustom, newCustom } = form
			let skuType = checked ? radio : 1
			// coustom.forEach(item => {
			// 	// if (item.nameEn && !item.nameCn) item.nameCn = item.nameEn
			// 	// if (item.nameCn && !item.nameEn) item.nameEn = item.nameCn
			// })

			const {
				goodsCustomTypeList,
				goodsCustomFittingList,
				enableContainFitting,
				enableCustom
			} = newCustom

			let success = {
				type: 'Spes',
				spesInfo: {
					commonAttr: { spes, skus },
					// custAttr: coustom,
					goodsCustomFittingList,
					enableContainFitting,
					enableCustom,
					goodsCustomTypeList:
						goodsCustomTypeList?.map(v => {
							return {
								goodsId: data.editGoodsId,
								type: v
							}
						}) || [],
					skuType
				},
				checked,
				radio
			}

			return new Promise((reslove, reject) => {
				if (showCombineGoods) {
					let error = { type: 'Spes', status: 1, message: null }
					if (radio == 1) {
						if (data.sku.goodsSkuCombinationRelation?.length === 0) {
							error.message = '该商品单规格未被组合品关联!'
							return reject(error)
						}
						success.sku = data.sku
						// 单规格但是未关联
						reslove(success)
					}
				} // 已报价
				if (radio == 2) {
					// 多规格的校验
					if (!checked) return reslove(success)
					//  若是没有启用规格则直接resolve 成功并返回状态码
					let error = { type: 'Spes', status: 1, message: '请补充规格信息' }
					if (skus.length == 0) {
						error.message = '多规格参数不能为空!'
						reject(error)
					} else {
						mulitiSkuRef.value.xtable.validate(true).then(res => {
								if (res) {
									reject(error)
								} else {
									if(newCustomRef.value){
										newCustomRef.value.validate().then(res=>{
											reslove(success)
										}).catch(error=>{
											reject({ type: 'Spes', status: 2, message: error })
										})
									}else{
										reslove(success)
									}
								}
							})
							.catch(err => {
								reject(error)
							})
						setTimeout(() => {
							mulitiSkuRef.value.xtable.clearValidate()
						}, 2000)
					}


				//	定制规格重构

				} else if (radio == 3) {
					if (!checked) return reslove(success)
					// 定制规格的校验
					let error = { type: 'Spes', status: 2, message: '请补充规格信息!' }
					if (coustom.length == 0) {
						error.message = '定制规格参数不能为空!'
						reject(error)
					} else if (coustom.length == 1 && coustom[0].normsType == 1) {
						error.message = '未设置商品主规格!'
						reject(error)
					} else {
						coustomRef.value.xtable
							.validate(true)
							.then(res => {
								if (res) {
									reject(error)
								} else {
									reslove(success)
								}
							})
							.catch(err => {
								reject(error)
							})
						setTimeout(() => {
							coustomRef.value.xtable.clearValidate()
						}, 2000)
					}
				} else if (radio == 1 && !showCombineGoods) {
					let error = { type: 'Spes', status: 0, message: '请补充规格信息' }
					signleRef.value.xtable
						.validate(true)
						.then(res => {
							if (res) {
								reject(error)
							} else {
								reslove(success)
							}
						})
						.catch(err => {
							reject(error)
						})
					setTimeout(() => {
						signleRef.value.xtable.clearValidate()
					}, 2000)
				} // 单规格
			})
		} // 规格属性的提交校验

		function cancelReturnVal() {
			return new Promise((reslove, reject) => {
				const { checked, radio, form } = data
				reslove({
					info: { checked, radio, form },
					type: 'sku'
				})
			})
		} // 退出时给最新的数据

		function delCoustom(index) {
			data.form.coustom.splice(index, 1)
		} // 删除定制规格项

		watch(
			() => props.query,
			a => {
				showInfo()
			}
		)

		function showInfo() {
			if (!props.query) return
			let {
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
			} = props.query
			if (sku) {
				const { goodsSkuCombinationRelation, id } = sku
				data.sku.goodsSkuCombinationRelation = goodsSkuCombinationRelation
				data.sku.id = id
			}
			data.editGoodsId = editGoodsId
			if (goodsRelation) {
				data.groupGoodsInfo = goodsRelation?.map(v => {
					return {
						categoryId: v.categoryId,
						categoryName: v.categoryName,
						goodsSpeList: v.goodsSpeVOList,
						id: v.relationId,
						mainImgUrl: v.mainImageUrl,
						nameEn: v.nameEn,
						relationId: v.relationId
					}
				})
			} // 组合品商品信息
			if (!skuType) return (data.checked = false)
			if (!routeOption.single && skuType == 1) return (data.checked = false)
			data.checked = true
			data.radio = skuType
			spes = changeName(spes, 'speValues')
			skus = changeName(skus, 'speValues')
			data.form = {
				spes,
				skus,
				coustom: custAttr || [],
				newCustom: {
					enableCustom,
					goodsCustomTypeList: goodsCustomTypeList?.map(v => v.type) || [],
					enableContainFitting,
					goodsCustomFittingList:goodsCustomFittingList || []
				}
			}

			function changeName(arr, key) {
				arr?.forEach(item => {
					// if (!item.nameEn && item.nameCn) item.nameEn = item.nameCn
					// if (!item.nameCn && item.nameEn) item.nameCn = item.nameEn
					if (item[key]) item[key] = changeName(item[key])
				})
				return arr
			}

			// data.form.coustom = custAttr
		} // 回显

		onMounted(() => {
			if (!props.query) data.groupGoodsInfo = props.goodsInfo || []
			if (showCombineGoods) {
				{
					data.radio = 1
					data.checked = false
				}
			}
		})

		return {
			...toRefs(data),
			addSkuOk,
			showDradwer,
			showSelectImg,
			selectImg,
			AddSkuRefs,
			CoustomDraweRefs,
			CoustomChildDraweefs,
			mulitiSkuRef,
			coustomRef,
			addCoustomMainOk,
			addCoustomChildOk,
			cancel,
			validate,
			delCoustom,
			selectSpe,
			selectSpeOk,
			routeName,
			showRadio,
			routeOption,
			signleRef,
			showRelationDialog,
			relationOk,
			cancelReturnVal,
			isDisabled,
			relationSingle,
			closeRelation,
			rela,
			showCombineGoods,
			newCustomRef
		}
	}
}
</script>

<style lang="scss" scoped>
.skuContainer {
	padding: 0 !important;
	padding-bottom: 20px !important;
	background: white;
}
.header {
	font-size: 16px;
	border-bottom: 1px solid #e9e9e9;
	display: flex;
	justify-content: center;
	justify-content: space-between;
	align-items: center;
	padding: 0 25px;
	height: 50px;
	div {
		line-height: 50px;
	}
}
.check {
	margin-top: 20px;
	padding: 0 25px;
	span {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #ff3b30;
		margin-left: 22px;
	}
}
.table {
	margin-top: 24px;
	padding: 0 25px;
}

.radio {
	margin-top: 20px;
	padding: 0 25px;
}

:deep(.el-drawer) {
	padding: 15px;
}
:deep(.el-drawer) {
	overflow-y: scroll;
}

:deep(#el-drawer__title) {
	margin-bottom: 0 !important;
}

.goodsInfo {
	display: flex;
	align-items: flex-start;
	.info {
		margin-left: 10px;
		text-align: left;
		.infoTitle {
			display: -webkit-box; /**对象作为伸缩盒子模型展示**/
			-webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
			-webkit-line-clamp: 2; /**显示的行数**/
			overflow: hidden; /**隐藏超出的内容**/
		}
	}
}
</style>
