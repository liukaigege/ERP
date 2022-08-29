<!--
 * @Descripttion: 配对1688信息
-->

<template>
	<div>
		<el-dialog
			title="建立1688配对关系"
			v-model="dialogVisible"
			width="40%"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div class="content">
				<div class="goodsHeader flex">
					<div class="headerImg">
						<el-image
							class="img"
							fit="contain"
							:src="query.pairInfo.img"
						></el-image>
					</div>
					<div class="headerInfo">
						<p class="skuCode">{{ query.pairInfo.name }}</p>
						<!--								<p class="skuValue">中文规格值</p>-->
					</div>
				</div>

				<div style="margin-top: 20px">
					<el-button type="text">1688商品信息</el-button>


					<el-tooltip placement="top">
						<template #content>
							<p style="cursor: pointer" v-copy="showUrl">复制</p>
						</template>
						<span style='margin-left: 20px'>{{showUrl?.length > 80 ? showUrl.slice(0,80)+'...' : showUrl}}</span>
					</el-tooltip>



				</div>

				<div class="ipt" v-if="showIpt">
					<el-input  v-model="url">
						<template #append>
							<el-button
								type="primary"

								@click="getGoods"
								:disabled="!url"
								>获取</el-button
							>
						</template>
					</el-input>
				</div>

				<div class="goods flex" v-else>
					<div class="goodsImg">
						<el-image class="img" fit="contain" :src="mainImg()"></el-image>
						<p style="margin-top:10px;">
							<el-button type="text" @click="setAgain(false)"
							>重新设置商品
							</el-button>
						</p>
						<p>
							<el-button type="text" @click="getAgain"
							>获取最新商品
						</el-button>
						</p>
					</div>

					<div class="goodsInfo">
						<div class="title">
							{{ goods?.goodsSpu?.goodsName }}
						</div>
						<div class="sku">
							<span v-for="(a,i) in spe" :key="i"> {{ a.key }}:{{ a.value.name }} </span>
						</div>

						<div
							class="spe flex"
							v-for="(item, index) in goods.goodsSku.skuProps"
							:key="index"
						>
							<div class="speName">{{ item.prop }}:</div>
							<div class="speList">
								<div
									class="speItem"
									v-for="(a, b) in item.value"
									:key="b"
									@click="selected(item.prop, a)"
									:class="
										selectedList[item.prop]?.name === a.name ? 'actived' : ''
									"
								>
									<el-image
										class="img"
										fit="contain"
										:src="a.imageUrl"
										v-if="a.imageUrl"
									>
										<template #error>
											<div class="failed">FAILED</div>
										</template>
									</el-image>
									<p v-else>{{ a.name }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button
						type="primary"

						@click="dialogHandOk"
						:disabled="submitDisabled()"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { reactive, toRefs, defineProps, defineEmits, computed } from 'vue'
import { getExternalGoods, getExternalGoodsNew } from '@/api/purchase/outOfStock.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
	query: Object
})

const emit = defineEmits(['cancel'])

const data = reactive({
	showIptAgain:false,// 是否重新配对
	showIpt: true,
	dialogVisible: true,
	url: null,
	showUrl:null,
	goods: {},
	selectedList: {}
})
const { showIpt, dialogVisible, url, goods, selectedList,showUrl } = toRefs(data)
if (props.query.url) {
	// 回显更改
	data.url = props.query.url
	getGoods()
}



function getGoods() {
	data.selectedList = {}
	if (data.url.indexOf('http') === -1) return ElMessage.error('请输入有效链接!')
	const param = {
		url: data.url
	}
	getExternalGoods(param)
		.then(res => {
			let speInfo = props.query.pairInfo.speInfo
			let thirdPlatformSupplierId = props.query.thirdPlatformSupplierId
			if (res.code === 200) {
				if (!res.data.shopInfo) return ElMessage.error('请输入有效链接!')
				if(thirdPlatformSupplierId && res.data.shopInfo.sellerUserId !== thirdPlatformSupplierId) return ElMessage.error('供应商不匹配,请更换链接!')
				data.showUrl = data.url
				data.showIpt = false
				data.goods = res.data
				const {goodsSku} = res.data
				goodsSku.skuProps.forEach(v=>{
					let item = speInfo?.find(i=>i.spe === v.prop)
					if(item && !data.showIptAgain){
						//如果重新设置的话,就要注意二次爬取的商品spe可能会重复
						data.selectedList[v.prop] = {
							name: item?.speVal
						}
					}else{
						data.selectedList[v.prop] = v?.value[0]
					}
				})
			}
			data.showIptAgain = false
		})

}

function selected(prop, a) {
	data.selectedList[prop] = a
}

const spe = computed(() => {
	let keys = Object.keys(data.selectedList)
	let arr = keys?.map(item => {
		return { key: item, value: data.selectedList[item] }
	})
	let bole = arr?.some(v=> !v.value)
	if(bole) return []
	return arr || []
})

function setAgain(status = false){
	data.showIpt = true
	if(!status) data.url = null
	data.goods = null
	data.showUrl = null
	data.showIptAgain = true
}
function getAgain(){
	data.selectedList = {}
	if (data.url.indexOf('http') === -1) return ElMessage.error('请输入有效链接!')
	const param = {
		url: data.url
	}
	getExternalGoodsNew(param)
		.then(res => {
			setAgain(true)
			let speInfo = props.query.pairInfo.speInfo
			let thirdPlatformSupplierId = props.query.thirdPlatformSupplierId
			if (res.code === 200) {
				if (!res.data.shopInfo) return ElMessage.error('请输入有效链接!')
				if(thirdPlatformSupplierId && res.data.shopInfo.sellerUserId !== thirdPlatformSupplierId) return ElMessage.error('供应商不匹配,请更换链接!')
				data.showUrl = data.url
				data.showIpt = false
				data.goods = res.data
				const {goodsSku} = res.data
				goodsSku.skuProps.forEach(v=>{
					let item = speInfo?.find(i=>i.spe === v.prop)
					if(item && !data.showIptAgain){
						//如果重新设置的话,就要注意二次爬取的商品spe可能会重复
						data.selectedList[v.prop] = {
							name: item?.speVal
						}
					}else{
						data.selectedList[v.prop] = v?.value[0]
					}
				})
			}
			data.showIptAgain = false
		})
}


function mainImg() {
	let img = data.goods?.goodsSpu?.mainImg
	if (spe.value?.length > 1) {
		let x = getSelectedSku()
		if (x?.imageUrl) img = x.imageUrl
	} else if (spe.value?.length > 0) {
		if (spe.value[0].value.imageUrl) img = spe.value[0].value.imageUrl
	}
	return img
} // 获取主图

function getSelectedSku() {
	let sku = spe.value?.map(v => v.value.name)
	let skuItem = data.goods.goodsSku.skuInfoMap[sku.join('>')]
	if (skuItem && !skuItem['imageUrl'])
		skuItem.imageUrl = data.goods.goodsSpu.mainImg
	return skuItem
} // 获取选中的sku

function submitDisabled() {
	if(data.goods?.goodsSku?.skuProps?.length === 0) return  false
	if(!data.goods) return  true
	return (
		spe.value?.length < data.goods?.goodsSku?.skuProps?.length || spe.value?.length < 1
	)
}

// 按钮的disable 控制

function dialogHandOk() {
	const query = {
		data: data.goods,
		url: data.url,
		sku: getSelectedSku(),
		spe: spe.value,
	}

	data.dialogVisible = false
	emit('ok', query, 'MatchGoods')
	setTimeout(() => {
		emit('cancel')
	}, 500)
}

function close() {
	emit('cancel')
}

function cancel() {
	data.dialogVisible = false
}
</script>

<style lang="scss" scoped>
.flex {
	display: flex;
	align-items: flex-start;
}
.failed {
	font-size: 10px;
	background: rgb(245, 247, 250);
	height: 50px;
	width: 50px;
	line-height: 50px;
	text-align: center;
}
.goodsHeader {
	padding-bottom: 20px;
	border-bottom: 1px dashed #e9e9e9;
	.headerImg {
		.img {
			width: 60px;
			height: 60px;
		}
	}
	.headerInfo {
		margin-left: 10px;
		.skuCode {
			font-size: 12px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
		}
		.skuValue {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
		}
	}
}

.ipt {
	margin: 20px 0;
}
.goods {
	border: 1px solid #e8e8e8;
	padding: 15px;
	.goodsImg {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.img {
			width: 280px;
			height: 280px;
		}
	}

	.goodsInfo {
		margin-left: 20px;
		.title {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			margin-bottom: 20px;
		}
		.sku {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			margin-bottom: 20px;
			span {
				margin-right: 10px;
			}
		}

		.spe {
			.speName {
				min-width: 10%;
			}
			.speList {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-left: 10px;
			}
			.speItem {
				cursor: pointer;
				margin: 2px;
				padding: 2px;
				.img {
					width: 50px;
					height: 50px;
				}
			}
		}
	}
}

.actived {
	border: 1px solid #1890ff;
}

:deep(.el-input-group__append) {
	//background-color: #1890FF;
	//color: white;
}
</style>
