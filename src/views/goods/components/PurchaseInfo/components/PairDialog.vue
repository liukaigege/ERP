<template>
	<el-dialog width="800px" v-model="show" title="商品配对" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialog(false)">
		<div class="pair-top-flex">
			<div class="pair-goods">
				<el-image class="pair-goods-image" :src="data.url" fit="contain"></el-image>
				<div class="pair-goods-info">
          <div class="top textOverflow">{{data.goodsName}}</div>
          <div class="mid textOverflow">{{data.skuId}}</div>
          <div class="last textOverflow">{{data.speLabel}}</div>
				</div>
			</div>
			<el-button v-if="pairGoods.length" class="pair-top-btn"  type="primary" @click="deletePairSkus">批量删除</el-button>
		</div>
    <el-checkbox v-if="pairGoods.length" class="mt-20" @change="changeSelectAll(selectAll)" v-model="selectAll">全选</el-checkbox>
		<div class="pair-goods-wrap">
			<div class="pair-goods border" v-for="(goods, index) in pairGoods" :key="index">
				<el-checkbox @change="changeSelectAll(null)" class="pair-goods-checkbox" v-model="goods.checked"></el-checkbox>
				<el-image class="pair-goods-image" :src="goods.mainImg" fit="contain"></el-image>
				<div class="pair-goods-info">
					<el-tooltip :content="goods.goodsName">
            <div class="top textOverflow">{{goods.goodsName}}</div>
          </el-tooltip>
					<el-tooltip :content="goods.sku">
            <div class="mid textOverflow">{{goods.sku}}</div>
          </el-tooltip>
          <el-tooltip :content="goods.speLabel">
            <div class="last textOverflow">{{goods.speLabel}}</div>
          </el-tooltip>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button  @click="closeDialog(false)" type="default">取消</el-button>
			<el-button  :disabled="!skuList.length" @click="saveModify" type="primary">保存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import { ref } from 'vue'
	import { getSkuPairs, modifySkuPairs } from '@/api/goods/quotation.js'
	import { ElMessage } from 'element-plus'

	export default {
		props: ['data'],
		emits: ['close'],
		setup(props, ctx) {
			const show = true
			const pairGoods = ref([])
			const skuList = ref([])
      const selectAll = ref(false)

			getSkuPairs({
				skuId: props.data.skuId
			}).then(r => {
				if (r && r.data && r.data.length) {
					r.data.map(go => {
						go.checked = false
						if (go.skuValue) {
							go.skuValues = JSON.parse(go.skuValue)
							go.speLabel = ''
							if (go.skuValues && go.skuValues.length) {
								go.skuValues.map((val, idx) => {
									go.speLabel += `${val.speVal}${idx < go.skuValues.length - 1 ? '-' : ''}`
								})
							} else {
								go.speLabel = '-'
							}
						}
						pairGoods.value.push(go)
					})
				}
			})

			function closeDialog(flag) {
				ctx.emit('close', flag)
			}

			function deletePairSkus() {
				const idx = pairGoods.value.findIndex(g => g.checked)
				if (idx === -1) {
					ElMessage.error({ message: '请先勾选' })
					return false
				}
				pairGoods.value.map(pg => {
					if (pg.checked) {
						skuList.value.push(pg.sku)
					}
				})
				for (let i = 0; i < pairGoods.value.length; i++) {
					if (pairGoods.value[i].checked) {
						pairGoods.value.splice(i, 1)
						i--
					}
				}

			}

      function changeSelectAll(flag) {
        if (typeof flag === 'boolean') {
          pairGoods.value.forEach(g => g.checked = flag)
        } else {
          selectAll.value =  pairGoods.value.every(g => g.checked)
        }
      }

			function saveModify() {
				modifySkuPairs({
					skuId: props.data.skuId,
                    goodsId: props.data.goodsId,
                    goodsName: props.data.goodsName,
					skuList: skuList.value
				}).then(_ => {
                    ElMessage.success({ message: '修改成功' })
                    setTimeout(_ => {
                        closeDialog(true)
                    }, 1000)
                })
			}

			return {
				show,
				pairGoods,
                skuList,
				closeDialog,
				deletePairSkus,
				saveModify,
        selectAll,
        changeSelectAll
			}
		}
	}
</script>

<style lang="scss" scoped>
.pair-top-flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px dashed #e9e9e9;
	.pair-top-btn {
		align-self: flex-end;
		margin-bottom: 10px;
	}
    .pair-goods {
        width: calc(100% - 100px);
        &-image {
            margin-left: 0;
        }
    }
}
.pair-goods-wrap {
	display: flex;
	flex-wrap: wrap;
    justify-content: space-between;
}
.pair-goods {
	display: flex;
	align-items: center;
	padding: 10px 0;
	&-checkbox {
		margin-left: 10px;
	}
	&-image {
		width: 60px;
		height: 60px;
        margin-left: 10px;
	}
	&-info {
        width: calc(100% - 100px);
		margin-left: 10px;
		height: 60px;
		flex-direction: column;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		font-size: 12px;
		color: rgb(0, 0, 0, 0.65);
		.top {
			color: #000;
		}
	}
	&.border {
        width: 48%;
		border: 1px solid #e9e9e9;
		margin-top: 20px;
	}
	&.border:nth-child(even) {
		margin-left: 20px;
	}
}
</style>