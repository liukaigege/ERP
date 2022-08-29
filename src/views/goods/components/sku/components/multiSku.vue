<template>
	<div class="multiSku">
		<div class="type">
			<div
				:class="language == 'en' ? 'formType active' : 'formType'"
				@click="changeLanguage('en')"
			>
				英文
			</div>
			<div
				:class="language == 'cn' ? 'formType active' : 'formType'"
				@click="changeLanguage('cn')"
			>
				中文
			</div>
		</div>
		<div class="mulitBox">
			<div class="skuList">
				<div class="skuItem" v-for="(item, index) in spesList" :key="index">
					<div class="skuItemLeft">
						规格参数：<span :title="languageVal(item)">{{
							languageVal(item)?.length > 5
								? languageVal(item)?.slice(0, 5) + '...'
								: languageVal(item)
						}}</span>
					</div>
					<div class="skuItemRight">
						<div class="left">参数可选值：</div>
						<div class="rightList">
							<div
								:class="
									selectedSpes.indexOf(a.frontId) !== -1
										? 'spe speActive'
										: 'spe'
								"
								v-for="(a, b) in item.speValues"
								:key="b"
								@click="selectSpe(a, item)"
							>
								{{ languageVal(a) }}
							</div>
							<!-- <div class="spe speActive">参数2</div> -->
						</div>
					</div>
				</div>
			</div>

				<div class="add" @click="showDradwer" v-if="!newspe">
					<i class="el-icon-plus"></i>
					设置规格参数
				</div>

			<div class="table">
				<div class="btns">
					<div
						class="btn"
						@click="editAll"
						v-if="routeOption.multi.editAllBtn && !isDisabled && !newspe"
					>
						批量修改
					</div>
					<!--					<el-button @click="validate">-->
					<!--						校验-->
					<!--					</el-button>-->
					<div
						class="btn"
						@click="switchAll(1, 'switchAll')"
						v-if="showMulitCloumns('switchAll') && !isDisabled"
					>
						批量开启
					</div>
					<div
						class="btn"
						@click="switchAll(0, 'switchAll')"
						v-if="showMulitCloumns('switchAll') && !isDisabled"
					>
						批量关闭
					</div>

					<div
						class="btn"
						@click="switchAll(1, 'publishStatus')"
						v-if="showMulitCloumns('publishStatus') && !isDisabled"
					>
						批量开启
					</div>
					<div
						class="btn"
						@click="switchAll(0, 'publishStatus')"
						v-if="showMulitCloumns('publishStatus') && !isDisabled"
					>
						批量关闭
					</div>
					<div
						class="btn blueColor"
						v-if="!isDisabled && showMulitCloumns('relation') && showCombineGoods "
						@click="batchAssociation"
					>
						批量关联
					</div>
				</div>

				<div class="tableBox">
					<vxe-table
						:checkbox-config=" newspe ? { checkMethod: checCheckboxkMethod } :{}"
						:data="tableData"
						ref="xtable"
						align="center"
						row-id="frontId"
						:row-config='{ height: 80 }'
						:scroll-y="{ gt: 0 }"
						max-height="400"
						:edit-rules="rules"
						:edit-config="{
							trigger: 'click',
							mode: 'row',
							showStatus: true
						}"
					>
						<vxe-column type="checkbox" width="60" v-if='!newspe'></vxe-column>
<!--						单纯的通过newspe 去控制这块的勾选 newspe 也就是在待报价的变更类型里面用到了-->
						<vxe-column width="50" v-if="routeOption.multi.drag">
							<template #default>
								<span class="drag-btn">
									<i class="vango-icon vango-erp-move"></i>
								</span>
							</template>
						</vxe-column>

						<vxe-column
							field="sku"
							title="SKU编码"
							width="180"
							v-if="showMulitCloumns('skuCode')"
						>
							<template #default="{ row }">
								{{ row.sku }}
							</template>
						</vxe-column>
						<vxe-column
							field="url"
							title="图片"
							width="150"
							:showOverflow="false"
						>
							<template #default="{ row, rowIndex }">
								<div class="imgBox">
									<div>
										<div
											class="selectImg"
											@click="
												showMulitDisabled('url') ? '' : showSelectImg(row)
											"
											v-if="!row.url && !isDisabled && !showIsAddDisabled(row)"
										>
											<i class="el-icon-plus"></i>
										</div>
										<div class="imgItem" v-else>
											<img :src="row.url" alt="" />
											<div
												class="mask"
												v-if="
													!showMulitDisabled('url') &&
													!isDisabled &&
													!showIsAddDisabled(row)
												"
											></div>
											<div
												class="icons"
												v-if="
													!showMulitDisabled('url') &&
													!isDisabled &&
													!showIsAddDisabled(row)
												"
											>
												<i class="el-icon-delete" @click="delImg(rowIndex)"></i>
											</div>
										</div>
									</div>
									<div>
										<el-tag
											type="danger"

											effect="light"
											style="margin-left: 5px"
											v-if="row.isAdd == 1 && showMulitCloumns('isAdd')"
											>新</el-tag
										>
									</div>
								</div>
							</template>
						</vxe-column>

						<vxe-column field="speValues" title="规格">
							<template #default="{ row }">
								{{ changeSpe(row.speValues) }}
							</template>
						</vxe-column>

						<vxe-column
							field="combinGoods"
							title="关联商品"
							width="400"
							v-if="showMulitCloumns('relation') && showCombineGoods"
						>
							<template #default="{ row }">
								<div class="combineGoods" v-if="row.goodsSkuCombinationRelation?.length">
									<p
										v-for="(item, index) in row.goodsSkuCombinationRelation"
										:key="index"
									>
										{{ item.goodsId }}
										<span style="margin: 0 5px">{{ item.speLabel }}</span> x
										{{ item.coef }}
									</p>
								</div>
							</template>
						</vxe-column>

						<vxe-column
							field="skuSwitch"
							title="状态"
							width="120"
							v-if="showMulitCloumns('skuSwitch')"
						>
							<template #default="{ row }">
								<vxe-switch
									v-model="row.skuSwitch"
									:open-value="1"
									:close-value="0"
									:disabled="isDisabled"
								>
								</vxe-switch>
							</template>
						</vxe-column>

						<vxe-column
							field="skuSwitch"
							title="状态"
							width="100"
							v-if="showMulitCloumns('publishStatus')"
						>
							<template #default="{ row }">
								<vxe-switch
									v-model="row.publishStatus"
									:disabled="row.skuSwitch === 0 || isDisabled"
									:open-value="1"
									:close-value="0"
								>
								</vxe-switch>
							</template>
						</vxe-column>

						<vxe-column
							field="weight"
							title="重量（g）"
							v-if="showMulitCloumns('weight')"
							width="180"
						>
							<template #default="{ row }">
								{{ row.weight }}
							</template>
						</vxe-column>

						<vxe-column
							field="weight"
							title="体积（cm³）"
							width="180"
							v-if="showMulitCloumns('lwh')"
						>
							<template #default="{ row }">
								{{ row.lwh }}
							</template>
						</vxe-column>

						<vxe-column
							field="expectPrice"
							:title="getPriceTitle()"
							width="200"
							:edit-render="{name: '$input'}"
						>
							<template #edit="{ row }">
								<vxe-input
									type="float"
									:min="0.0"
									:max="999999.99"
									:step="1"
									v-model="row.expectPrice"
									:disabled="
										showMulitDisabled('expectPrice') ||
										isDisabled ||
										showIsAddDisabled(row)
									"
								>
								</vxe-input>
							</template>

							<template #default="{ row }">
								<vxe-input
									type="float"
									:min="0.0"
									:max="999999.99"
									:step="1"
									v-model="row.expectPrice"
									:disabled="
										showMulitDisabled('expectPrice') ||
										isDisabled ||
										showIsAddDisabled(row)
									"
								>
								</vxe-input>
							</template>
						</vxe-column>

						<vxe-column
							field="originalPrice"
							title="原价（USD）"
							width="150"
							:edit-render="{name: '$input'}"
							v-if="showMulitCloumns('originalPrice')"
						>
							<template #edit="{ row }">
								<vxe-input
									type="float"
									:min="0.0"
									:max="999999.99"
									:step="1"
									:disabled="isDisabled"
									v-model="row.originalPrice"
								>
								</vxe-input>
							</template>

							<template #default="{ row }">
								<vxe-input
									type="float"
									:min="0.0"
									:max="999999.99"
									:step="1"
									:disabled="isDisabled"
									v-model="row.originalPrice"
								>
								</vxe-input>
							</template>
						</vxe-column>

						<vxe-column
							field="costPrice"
							title="成本价（CNY）"
							width="150"
							:edit-render="{name: '$input'}"
							v-if="showMulitCloumns('costPrice') && !showCombineGoods"
						>
							<template #edit="{ row }">
								<vxe-input
									type="float"
									:min="0"
									:max="9999999.99"
									:step="1"
									v-model="row.costPrice"
									:disabled="
										showMulitDisabled('costPrice') ||
										isDisabled ||
										showIsAddDisabled(row)
									"
								>
								</vxe-input>
							</template>

							<template #default="{ row }">
								<vxe-input
									type="float"
									:min="0"
									:max="9999999.99"
									:step="1"
									v-model="row.costPrice"
									:disabled="
										showMulitDisabled('costPrice') ||
										isDisabled ||
										showIsAddDisabled(row)
									"
								>
								</vxe-input>
							</template>
						</vxe-column>

						<vxe-column
							field="relation"
							title="关联商品"
							width="150"
							v-if="showMulitCloumns('relation') && showCombineGoods"
						>
							<template #default="{ row }">
								<el-button
									type="text"

									@click="relation(row)"
									v-if="!isDisabled "
									:disabled="isDisabled  || testEditDisabled(row)"
								>
									{{
										row.goodsSkuCombinationRelation?.length > 0
											? '修改'
											: '关联'
									}}
								</el-button>
								<el-button
									type="text"

									@click="relation(row)"
									v-if="isDisabled"
								>
									查看
								</el-button>
							</template>
						</vxe-column>
					</vxe-table>
				</div>
			</div>
		</div>

		<MultiEditAll
			:show="dialogVisible"
			:query="editAllQuery"
			v-if="dialogVisible"
			@editAllEmit="editAllEmit"
			@selectImgEditAll="selectImgEditAll"
		/>

		<RelationDialog
			:info="relationInfo"
			v-if="showRelation"
			@close="closeRelation"
		/>
	</div>
</template>

<script>
import {
	toRefs,
	reactive,
	onMounted,
	ref,
	watch,
	getCurrentInstance,
	inject,
	computed,
	nextTick
} from 'vue'
import coustomHook from '../hooks/coustom.js'
import optionFun from '../hooks/optionFun.js'
import RelationDialog from '../../../../components/RelationDialog'
import MultiEditAll from '@/views/goods/components/sku/components/multiEditAll.vue'
import { ElMessage } from 'element-plus'
export default {
	components: { MultiEditAll, RelationDialog },
	props: {
		skus: {
			type: Array,
			default: []
		},
		spes: {
			type: Array,
			default: []
		},
		goodsInfo: {
			type: Array,
			default: []
		},
		skuList:{
			type: Array,
			default: [1]
		},
		newspe:{
			type:Boolean,
			default:false
		}
	},
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const data = reactive({
			showRelationGoods:false,
			groupGoodsInfo: [],
			language: 'en',
			tableData: [],
			spesList: [],
			// rules: {},
			showRelation: false,
			relationInfo: null,
			editAllQuery: null,
			dialogVisible: false,
			selectedSpes: [],
			relationItem: null,
			selSkus: {} //去重选中的sku
		})
		const { rowDrop } = coustomHook(data)
		const isDisabled = inject('isDisabled')
		const routeOption = inject('routeOption')
		const routeName = inject('routeName')
		console.log('props.skus',props.skus,props.skuList)
		props.skus.forEach(v=>{
			if(v.isAdd==0&&!v.goodsSkuCombinationRelation&&props.skuList.filter(val=>val.frontId==v.frontId)[0]?.goodsSkuCombinationRelation){
				props.skuList.filter(val=>val.frontId==v.frontId)[0]?.goodsSkuCombinationRelation.forEach(item=>{
					item.speLabel = item.goodsSpeValList.map(spe => spe.nameEn).join('-')
				})
				v.goodsSkuCombinationRelation = props.skuList.filter(val=>val.frontId==v.frontId)[0]?.goodsSkuCombinationRelation
			}
		})
		const showCombineGoods = inject('showCombineGoods') || props.skuList?.some(v => v.goodsSkuCombinationRelation)
		const combineRelType = inject('combineRelType') || null // 1: 关联商品池商品 2: 关联自身
		const { showMulitCloumns, showMulitDisabled } = optionFun(routeOption)
		const xtable = ref(null)

		const requiredUrl = ({ row }) => {
			if (!row.url) return new Error('请上传图片')
		}

		const testRelation = ({ row }) => {
			if (!row.goodsSkuCombinationRelation) return new Error('请关联商品!')
		}

		const rules = computed(() => {
			let rule = {
				expectPrice: [
					{
						required: true,
						message: `请输入${getPriceTitle()}`,
						trigger: 'blur'
					}
				],
				url: [{ validator: requiredUrl, trigger: 'blur' }],
				relation: [
					{
						validator: testRelation,
						trigger: 'blur'
					}
				]
			}
			// if(routeName === 'goodsPublishDeatil'){
			// 	rule = {
			// 		expectPrice:[
			// 			{ required: true, message: `请输入${getPriceTitle()}`},
			// 		],
			// 		url:[
			// 			{validator:requiredUrl },
			// 		]
			// 	}
			// }
			// if(routeName == 'addGoods'){
			// 	rule = {
			// 		expectPrice:[
			// 			{ required: true, message: `请输入期望售价`},
			// 		],
			//
			// 	}
			// }
			return rule
		})

		function relation(row) {
			data.relationItem = row
			const { goodsSkuCombinationRelation, id, goodsId } = row
			let way = isDisabled ? 'detail' : id ? 'edit' : 'add'
			const query = {
				way,
				goodsSkuCombinationRelation:
					goodsSkuCombinationRelation?.length > 0
						? goodsSkuCombinationRelation
						: [],
				mainGoodsId: goodsId || null,
				mainSkuId: id || null,
				childGoodsIdList: data.groupGoodsInfo.map(v => v.id)
			}
			if(combineRelType && combineRelType.value === 2){
				let arr =	props.skus.filter(v=>v.goodsSkuCombinationRelation && v.goodsSkuCombinationRelation?.length >0)
				let childSkuIdList = []
				arr.forEach(v=>{
					v.goodsSkuCombinationRelation.forEach(item=>{
						if(item.childId ===item.mainId) childSkuIdList.push(item.childId)
					})
				})
				query.childSkuIdList = childSkuIdList
			} // 关联自身

			data.relationInfo = query
			data.showRelation = true
		} // g关联

		function closeRelation(flag, arr, price) {
			data.showRelation = false
      if(arr.some(v=>v.list)){
        // 批量关联
        if(flag) props.skus.forEach(v=>{
          if(arr.some(val=>val.list.some(item=>item==v.frontId) == true)) v.goodsSkuCombinationRelation = arr.filter(v=>v.coef)
        })
      }else{
        // 单条关联
        if (flag) {
          props.skus.forEach(v => {
            if (v.frontId === data.relationItem.frontId) {
              v.goodsSkuCombinationRelation = arr.filter(v=>v.coef)
            }
          })
        }
      }
		} // 关闭relation

		function changeLanguage(val) {
			data.language = val
		} // 切换语言

		function showDradwer() {
			emit('showDradwer', 1)
		}

		watch(
			() => props.skus,
			(a, b) => {
				data.tableData = a
				data.selSkus = {}
			},
			{ deep: true }
		)

		watch(
			() => props.spes,
			(a, b) => {
				data.spesList = a
				data.selSkus = {}
			}
		)

		watch(
			() => props.goodsInfo,
			(a, b) => {
				data.groupGoodsInfo = a
			},
			{ deep: true }
		)

		function changeSpe(spes) {
			if (spes?.length == 1)
				return data.language == 'cn' ? spes[0].nameCn : spes[0].nameEn
			let spe = ''
			spes?.map((item, index) => {
				if (item.nameCn && !item.nameEn) item.nameEn = item.nameCn
				if (item.nameEn && !item.nameCn) item.nameCn = item.nameEn
				let x = data.language == 'cn' ? item.nameCn : item.nameEn
				spe += x + (index == spes.length - 1 ? '' : '-')
			})
			return spe
		}

		function languageVal(v) {
			return data.language == 'cn' ? v.nameCn : v.nameEn
		}

		function selectImgEditAll(val) {
			emit('selectImgEditAll', val)
		}

		function showSelectImg(row) {
			console.log(row)
			emit('showSelectImg', { ids: [row.frontId], type: 0, multiple: false })
		} // 打开图片选择框

		function editAll() {
			const selected = xtable.value.getCheckboxRecords()
			if (selected.length == 0) {
				proxy.$message.error('请选择SKU')
				return
			}
			let ids = []
			selected.forEach(item => {
				ids.push(item.frontId)
			})
			data.editAllQuery = {
				ids
			}
			data.dialogVisible = true
		}

		function editAllEmit(val) {
			const selected = xtable.value.getCheckboxRecords()
			data.tableData.forEach(item => {
				let z = selected?.find(v => v.frontId === item.frontId)
				if (z) {
					for (let x in val) {
						if (val[x].switch) {
							if (x === 'url') {
								item[x] = val[x].value.url
								item.pictureId = val[x].value.pictureId
							} else if (x === 'expectPrice') {
								let y = String(val[x].value).indexOf('.')
								if (y == -1) {
									item[x] = val[x].value + '.00'
								} else {
									item[x] = val[x].value
								}
							} else {
								item[x] = val[x].value
							}
						}
					}
				}
			})
		}

		function switchAll(val, key) {
			const selected = xtable.value.getCheckboxRecords()
			if (selected.length == 0) {
				proxy.$message.error('请选择SKU')
				return
			}
			data.tableData.map(item => {
				let a = selected?.find(v => v.frontId === item.frontId)
				if (key === 'publishStatus' && a) {
					if (a?.skuSwitch !== 0) item[key] = val
				} else if (a) {
					item[key] = val
				}
			})
		} // 批量开启./关闭

		function delImg(index) {
			data.tableData[index].url = ''
			data.tableData[index].pictureId = null
		} // 删除单个图片

		function selectSpe(a, fa) {
			let selectedRows = []
			// console.log(a,fa)
			if (!data.selSkus[fa.frontId]) {
				data.selSkus[fa.frontId] = []
			}
			let aIndex = data.selSkus[fa.frontId].findIndex(v => v === a.frontId)
			if (aIndex === -1) {
				data.selSkus[fa.frontId].push(a.frontId)
			} else {
				data.selSkus[fa.frontId].splice(aIndex, 1)
			}
			let selSkusLen =  0
			// 获取当前选中的sku 的种类数量
			console.log(data.selSkus)
			for (let i in data.selSkus){
				if(data.selSkus[i]?.length >0) {
					selSkusLen += 1
					selectedRows = selectedRows.concat(data.selSkus[i])
				}
			}
			if (selSkusLen > 1) {
				selectRowMore(selectedRows)
			}else{
				selectRowSingle(selectedRows)
			}
			function selectRowSingle(speIds) {
				// console.log(speIds)
				data.tableData.forEach(item => {
					let ids = item.speValues.map(v=> v.frontId)
					const bole = ids.findIndex(id => speIds.includes(id)) !== -1
					xtable.value.setCheckboxRow(item,bole)
				})
			} // 选中一个spe 的情况

			function selectRowMore(speIds){
					let skus = createSku(Object.values(data.selSkus))
					data.tableData.forEach(item=>{
						let ids = item.speValues.map(v=> v.frontId)
						const bole = skus.some(v => {
							return v.every(i => ids.includes(i))
						})
						xtable.value.setCheckboxRow(item,bole)
					})
			} // 选中多个spe
			data.selectedSpes = selectedRows
		} // 选中spe

		function createSku(x) {
			let list = []
			x.map(item => {
				list.push(item)
			})

			function calcDescartes(array) {
				if (array.length < 2) {
					return array[0]?.map(item => {
						return [item]
					}) || []
				}
				return array?.reduce((total, currentValue) => {
					let res = [];
					total?.forEach(t => {
						currentValue.forEach(cv => {
							if (t instanceof Array) // 或者使用 Array.isArray(t)
								res.push([...t, cv]);
							else
								res.push([t, cv]);
						})
					})
					return res;
				})
			}


			return calcDescartes(list)


		} // 通过笛卡尔积生成sku



		function validate() {
			xtable.value
				.validate(true)
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					console.log(err)
				})
			setTimeout(() => {
				xtable.value.clearValidate()
			}, 2000)
		} // 校验table

		function checCheckboxkMethod(row) {
			let bole = true
			if (routeOption.multi.columns.indexOf('isAdd') !== -1) {
				row.row.isAdd !== 0 ? (bole = true) : (bole = false)
			}

			return bole
		} //禁止选中

		function showIsAddDisabled(row) {
			let bole = false
			if (showMulitCloumns('isAdd') && row.isAdd == 0) bole = true
			return bole
		}

		function getPriceTitle() {
			// 售价（USD）
			let list = ['addGoods', 'detNewSpes']
			if (list.indexOf(routeName) !== -1) return '期望售价（USD）'
			return '售价（USD）'
		}

		function testEditDisabled(row){
			// (showMulitDisabled('relation')
			// 	&& 	row.goodsSkuCombinationRelation?.length > 0)
			// || !(row.isAdd == 1 && showMulitCloumns('isAdd'))
			const {isAdd,goodsSkuCombinationRelation}  = row
			if(!showMulitCloumns('relation')) return true
			if(showMulitCloumns('isAdd') ){
				 // 确认新规格页面
				if( isAdd == 1){
					return  false
				}else	if(goodsSkuCombinationRelation?.length > 0){
					return true
				}

			}
			return false
		} // 控制关联按钮是否可编辑

		function batchAssociation(){
			// 批量关联
			const selected = xtable.value.getCheckboxRecords()
			if(selected?.length){
        const ids = selected?.map(v=>v.frontId)
        const query = {
          way:'add',
          goodsSkuCombinationRelation:[],
          mainGoodsId: selected[0].goodsId || null,
          mainSkuId: null,
          childGoodsIdList: data.groupGoodsInfo?.map(v => v.id),
          list:ids
        }
        if(combineRelType && combineRelType.value === 2){
          let arr =	props.skus.filter(v=>v.goodsSkuCombinationRelation && v.goodsSkuCombinationRelation?.length >0)
          let childSkuIdList = []
          arr.forEach(v=>{
            v.goodsSkuCombinationRelation.forEach(item=>{
              if(item.childId ===item.mainId) childSkuIdList.push(item.childId)
            })
          })
          query.childSkuIdList = childSkuIdList
        } // 关联自身
        data.relationInfo = query
        data.showRelation = true
			}else{
				ElMessage.warning({ message: '请选择SKU' })
			}
		}


		onMounted(() => {
			data.tableData = props.skus
			data.spesList = props.spes
			data.selSkus = {}

			if (routeOption.multi.drag) {
				rowDrop(xtable, '.drag-btn')
			}
		})

		return {
			...toRefs(data),
			batchAssociation,
			changeLanguage,
			xtable,
			showDradwer,
			changeSpe,
			languageVal,
			showSelectImg,
			delImg,
			editAll,
			editAllEmit,
			switchAll,
			selectSpe,
			routeOption,
			showMulitCloumns,
			showMulitDisabled,
			checCheckboxkMethod,
			getPriceTitle,
			isDisabled,
			showIsAddDisabled,
			rules,
			selectImgEditAll,
			validate,
			relation,
			closeRelation,
			showCombineGoods,
			testEditDisabled
		}
	}
}
</script>

<style lang="scss" scoped>
.type {
	display: flex;
	align-items: center;
	cursor: pointer;
	.formType {
		padding: 5.5px 20px;
		border: 1px solid #e8e8e8;
		border-bottom: none;
	}
	.formSelect {
		margin-left: 10px;
		width: 180px;
	}
	.active {
		border: 1px solid #1890ff;
		color: #1890ff;
	}
}

.mulitBox {
	padding: 26px 30px;
	border-radius: 2px;
	border: 1px solid rgba(0, 0, 0, 0.15);
}
.skuList {
}
.skuItem {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	margin-bottom: 15px;
	.skuItemLeft {
		width: 10%;
		display: flex;
		align-items: center;
	}
	.skuItemRight {
		width: 90%;

		display: flex;

		justify-content: flex-start;
		.left {
			min-width: 100px;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
			display: flex;
			align-items: flex-start;
		}
		.rightList {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			position: relative;
    	top: -5px;
		}
		.spe {
			border-radius: 2px;
			border: 1px solid rgba(0, 0, 0, 0.15);
			padding: 5px 15px;
			font-size: 14px;
			// margin-right: 15px;
			color: rgba(0, 0, 0, 0.65);
			cursor: pointer;
			margin: 0px 15px 5px 0;
		}
		.speActive {
			background: #1890ff;
			border: 1px solid #1890ff;
			color: white;
		}
	}
}
.add {
	margin: 20px 0;
	width: 10%;
	padding: 5px 0;
	text-align: center;
	border-radius: 2px;
	border: 1px solid #1890ff;
	font-size: 14px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #1890ff;
	cursor: pointer;
}

.tableBox {
	margin: 20px 0;
}
.table {
	border-top: 1px dashed #e9e9e9;
	.btns {
		display: flex;
		align-items: center;
		margin-top: 20px;
		cursor: pointer;
		.btn {
			padding: 7px 20px;
			border: 1px solid #e8e8e8;
			margin-right: 15px;
			display: inline-block;
		}
		.blueColor {
			color: #1890FF;
			border-color: #1890FF;
		}
	}
}

.selectImg {
	background: rgba(0, 0, 0, 0.04);
	width: 60px;
	height: 60px;
	border: 1px solid #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;
}

.imgItem {
	position: relative;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;
	img {
		width: auto;
		height: auto;
		max-width: 60px;
		max-height: 60px;
	}
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		max-width: 110px;
		max-height: 110px;
		top: 0;
	}
	.icons {
		display: none;
		position: absolute;
		top: 35%;
		left: 50%;
		transform: translateX(-50%);
	}
}
.imgItem:hover {
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		transition: all 0.3s;
	}
	.icons {
		display: block;
		transition: all 0.3s;
		i {
			color: white;
			font-size: 18px;
		}
	}
}
.imgBox {
	display: flex;
	align-items: center;
	justify-content: center;
}

.combineGoods {
	max-height: 60px;
	overflow-y: scroll;
}
</style>
