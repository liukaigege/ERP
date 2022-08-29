<template>
	<!-- 关联商品弹窗 -->
	<el-dialog v-model="show" title="关联商品" width="60%" @close="closeDialog(false)">
		<div class="relation-dialog-container" v-if="list.length > 0" style="margin-top: -25px">
			<div class="table-container" v-for="goods in list" :key="goods.goodsId">
				<div class="table-title">
					<span>商品名称：</span>
					<el-tooltip :content="goods.nameCn || goods.nameEn">
						<span class="textOverflow">{{goods.nameCn || goods.nameEn}}</span>
					</el-tooltip>
					<span class="ml-10">商品编码：</span>
					<span>{{goods.goodsId}}</span>
				</div>
				<el-table class="mt-10" border :data="goods.alreadyOfferSkuList">
					<el-table-column prop="url" label="图片" width="120">
						<template #default="{ row }">
							<el-popover v-if="row.url" placement="right-start" trigger="hover" width="auto">
								<el-image style="width: 200px; height: 200px" :src="row.url" fit="contain"></el-image>
								<template #reference>
									<el-image class="ml-10" style="width: 70px; height: 70px" :src="row.url" fit="contain"></el-image>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="speLabel" label="规格"></el-table-column>
					<el-table-column prop="expectPrice" label="期望售价(USD)"></el-table-column>
					<el-table-column prop="suggestPrice" label="建议售价(USD)"></el-table-column>
					<el-table-column prop="weight" label="重量(g)"></el-table-column>
					<el-table-column prop="lwh" label="商品体积(cm³)">
						<template #default="{ row }">
							<span v-if="row.length || row.width || row.height">{{`${row.length}*${row.width}*${row.height}`}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="默认采购价(CNY)"></el-table-column>
					<el-table-column prop="attr" label="报关属性"></el-table-column>
					<el-table-column prop="coef" label="商品系数">
						<template #default="{ row }">
							<span v-if="info.way === 'detail'">{{ row.coef }}</span>
							<template v-else>
								<div class="flex-div">
									<el-checkbox v-model="row.selected" @change="changeRow($event,row)"></el-checkbox>
									<el-input-number class="small-input" :controls="false" v-if="row.selected" :precision="0" :min="1" :max="999" v-model="row.coef"></el-input-number>
								</div>
							</template>
						</template>
					</el-table-column>
				</el-table>
			</div>

		</div>
		<div class="relation-dialog-container" v-else>无关联商品信息</div>
		<template #footer>
			<div class="justify-end-div">
				<el-button @click="closeDialog(false)">关闭</el-button>
				<el-button v-if="info.way !== 'detail'" type="primary" @click="closeDialog(true)">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
	import { reactive, toRefs } from 'vue'
	import { getRelationGoods, updateRelations } from '@/api/goods/quotation.js'
	import { ElMessage } from 'element-plus'
	export default {
		emits: ['close'],
		props: {
			info: {
				type: Object,
				default: {
					way: 'detail', // 可选值：detail 查看关联 edit 修改关联 add 新增关联
					mainGoodsId: '', // 组合品商品编码 way 为 edit 和 detail 时必传
					mainSkuIds: [], // 组合品的某条skuId way 为 edit 和 detail 时必传
					childGoodsIdList: [], // 选中的需要关联的商品编码数组 way 为 add 时必传
					goodsSkuCombinationRelation: [], // 已关联数据
					childSkuIdList: null // 关联商品信息为关联组合品变体时传
				}
			}
		},
		setup(props, ctx) {
			const state = reactive({
				list: [],
				show: true,
			})
			const { mainGoodsId, childGoodsIdList, way, goodsSkuCombinationRelation, childSkuIdList,list } = props.info
      const mainSkuId = props.info.mainSkuIds?props.info.mainSkuIds[0]:''
			let form = way === 'add' ? { childGoodsIdList, mainGoodsId } : { mainGoodsId, mainSkuId }

			getRelationGoods(form).then(r => {
				state.list = typeof r.data === 'string' ? [] : r.data
				state.list.forEach(goods => {
					goods.alreadyOfferSkuList.forEach(sku => {
						sku.speLabel = sku.speValues?.map(spe => spe.nameCn || spe.nameEn).join('-') || '-'
						sku.enSpeLabel = sku.speValues?.map(s => s.nameEn || s.nameCn).join('-') || '-'
						if (goodsSkuCombinationRelation && goodsSkuCombinationRelation.length) {
							const index = goodsSkuCombinationRelation.findIndex(g => g.childId === sku.skuId)
							if (index !== -1) {
								sku.coef = goodsSkuCombinationRelation[index].coef
							}
						}
						sku.selected = sku.coef > 0
					})
					// 查看状态下 || 关联自身的情况 过滤没有系数的数据
					if (way === 'detail' || (goods.combineRelType !== 1 && way === 'edit')) {
						goods.alreadyOfferSkuList = goods.alreadyOfferSkuList.filter(s => s.selected)
					}
					// 过滤掉sku开关关闭的数据
					goods.alreadyOfferSkuList = goods.alreadyOfferSkuList.filter(o => o.skuSwitch === 1)
					// 关联商品为组合品变体时过滤数据
					if (childSkuIdList && childSkuIdList.length) {
						goods.alreadyOfferSkuList = goods.alreadyOfferSkuList.filter(o => childSkuIdList.includes(o.skuId))
					}
				})
				// 过滤掉没有关联sku的数据
				state.list = state.list.filter(g => g.alreadyOfferSkuList.length > 0)
			})

			function closeDialog(flag) {
				const arr = []
				let price = 0
				if (flag) {
					let count = 0
					let length = 0
					state.list.forEach(goods => {
						goods.alreadyOfferSkuList.forEach(sku => {
							length = length + 1
							if (sku.selected) {
								arr.push({
									goodsId: goods.goodsId,
									mainId: mainSkuId,
									childId: sku.skuId,
									coef: sku.coef,
									// 规格值在某些地方显示中文规格值 在某些地方显示英文规格值
									speLabel: sku.enSpeLabel,
									speCnLabel: sku.speLabel,
                  price: sku.price,
                  list
								})
								price += sku.coef * sku.price
							} else {
								count = count + 1
							}
						})
					})
					if (count === length) {
						ElMessage.error({ message: '至少选择一个sku添加系数' })
						return false
					}
					if (way === 'edit') {
						update(arr).then(_ => {
							ctx.emit('close', flag, arr, price)
						})
						return false
					}
					ctx.emit('close', flag, arr, price)
				}
				// flag 点击取消或者确认的标识 arr 关联数据 price 采购价
				ctx.emit('close', flag, arr, price)
			}

			function update(arr) {
				const submitForm = {
					goodsId: mainGoodsId,
					skuList: [],
					// 组合品变体 和 商品库商品标识
					type: state.list[0].combineRelType
				}
				submitForm.skuList.push({
					skuId: mainSkuId,
					goodsSkuCombinationRelation: arr
				})
				return new Promise((resolve, reject) => {
					updateRelations(submitForm).then(r => {
						ElMessage.success({ message: '修改关联成功' })
						resolve()
					})
				})

			}
      function changeRow(v,row) {
        if(v) row.coef = 1
      }
			return {
				...toRefs(state),
				closeDialog,
        changeRow
			}
		},
	}
</script>

<style lang="scss" scoped>
	.relation-dialog-container {
		height: 550px;
		padding-right: 5px;
		overflow-y: auto;
	}
	.justify-end-div {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.table-container {
		padding-top: 10px;
	}
	.table-title {
		display: flex;
		.textOverflow {
			max-width: 300px;
		}
	}
	.flex-div {
		display: flex;
		.small-input {
			width: 60px;
			margin-left: 10px;
		}
	}
</style>
