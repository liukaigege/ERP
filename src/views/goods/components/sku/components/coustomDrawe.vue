<template>
	<div>
		<div class="skuItemBox">
			<div class="skuList">
				<div class="skuItem">
					<div class="itemHead">
						<div class="itemHeadLeft">
							配件:
							<el-switch
								v-model="isParts"
								@change="switchParts"
								:active-value="1"
								:inactive-value="0"
								:disabled="routeOption.disabled || isDisabled"
							></el-switch>
						</div>
						<div class="itemHeadRight" v-show="isParts == 1">
							<el-slider
								v-model="partsNum"
								@change="changeSlider"
								:min="1"
								:max="10"
								:format-tooltip="formatTooltip"
								:disabled="routeOption.disabled || isDisabled"
							></el-slider>
						</div>
					</div>

					<div class="itemBtn" v-show="isParts == 0">
						<div class="btnList">
							<div class="sku">
								<el-select
									v-model="commonSpeId"
									@change="changeSpe"
									:disabled="showCoutomDisabled('customType') || isDisabled"
									v-if="showCoutomCloumns('customType')"
								>
									<el-option label="不使用常用规格" :value="null"></el-option>
									<el-option
										:label="item.nameCn"
										:value="item.id"
										v-for="(item, index) in speList"
										:key="index"
									></el-option>
								</el-select>
							</div>
							<div
								class="btn"
								@click="add"
								v-if="routeOption.add && !isDisabled"
							>
								<i class="el-icon-plus"></i> 增加参数
							</div>
							<div
								class="btn"
								v-if="
									selectSpeValue.length > 0 &&
									commonSpeId &&
									routeOption.multi.add &&
									!isDisabled
								"
								@click="selectSpe"
							>
								常用属性
							</div>
						</div>
					</div>

					<div class="itemTable">
						<div class="tableHead">
							<div class="headTop">
								<el-row>
									<el-col :span="12" class="col"> 参数可选值 </el-col>
									<el-col :span="7" class="col"> 加价 ($) </el-col>
									<el-col :span="5" class="col"> 图片参数 </el-col>
								</el-row>
							</div>
							<div class="headBottom">
								<el-row>
									<el-col :span="12" class="colB">
										<div class="en">英文</div>
										<div class="cn" v-if="showCoutomCloumns('nameCn')">
											中文
										</div>
										<div class="cn" v-if="showCoutomCloumns('status')">
											状态
										</div>
									</el-col>
									<el-col :span="7" class="colB"> </el-col>
									<el-col :span="5" class="colB">
										<el-switch
											:disabled="showCoutomDisabled('url') || isDisabled"
											v-model="isShowImg[String(isParts)]"
											:active-value="1"
											:inactive-value="0"
										></el-switch>
									</el-col>
								</el-row>
							</div>
						</div>

						<div class="tableTr">
							<div class="trItemLeft">
								<draggable
									v-model="coustom[String(isParts)]"
									group="coustom"
									@start="val => leftDragStart(val)"
									@end="val => leftDragEnd(val, 'imgList', String(isParts))"
									item-key="id"
									:disabled="dragDisabled || isDisabled"
									handle=".drag"
								>
									<template #item="{ element, index }">
										<el-row
											@click="selectedRow(element, index)"
											:class="
												selectedRowIndex[String(isParts)].frontId ===
												element.frontId
													? 'activeBg'
													: ''
											"
										>
											<el-col :span="15" class="trCol">
												<div class="itemEn bdCol">
													<i
														class="vango-icon vango-erp-move drag"
														v-if="!showCoutomDisabled('dragItem')"
													></i>
													<div class="input">
														<el-input
															v-model="element.nameEn"
															placeholder=""
															:maxlength="100"
															:disabled="
																showCoutomDisabled('nameEn') || isDisabled
															"
														></el-input>
													</div>
												</div>
												<div class="itemCn bdCol">
													<div class="input">
														<el-input
															v-if="showCoutomCloumns('nameCn')"
															v-model="element.nameCn"
															:disabled="
																nameCnDisabled(element) ||
																showCoutomDisabled('nameEn') ||
																isDisabled
															"
															placeholder=""
															:maxlength="100"
														></el-input>

														<el-switch
															:active-value="1"
															:inactive-value="0"
															:disabled="isDisabled"
															v-if="showCoutomCloumns('status')"
															v-model="element.status"
														></el-switch>
													</div>
												</div>
											</el-col>
											<el-col :span="9" class="trCol bdCol">
												<div class="input">
													<el-input-number
														style="width: 120px"
														v-model="element.plusPrice"
														placeholder=""
														controls-position="right"
														:min="0"
														:max="999999.99"
														:disabled="
															showCoutomDisabled('plusPrice') || isDisabled
														"
														@blur="
															() => {
																!element.plusPrice
																	? (element.plusPrice = 0)
																	: ''
															}
														"
													></el-input-number>
												</div>
											</el-col>
										</el-row>
									</template>
								</draggable>
							</div>
							<div class="trItemRight">
								<draggable
									v-model="imgList[String(isParts)]"
									group="imgList"
									@start=""
									@end="dragEnd"
									item-key="id"
									class="dragImg"
									:disabled="dragDisabled"
								>
									<template #item="{ element, index }">
										<div
											:class="
												selectedRowIndex[String(isParts)].index == index
													? 'itemRightImg bdCol activeBg'
													: 'itemRightImg bdCol'
											"
											v-if="element.url"
										>
											<div class="imgItem">
												<img :src="element.url" alt="" />
												<div
													class="mask"
													v-if="!showCoutomDisabled('url') && !isDisabled"
												></div>
												<div
													class="icons"
													v-if="!showCoutomDisabled('url') && !isDisabled"
												>
													<i class="el-icon-delete" @click="delImg(index)"></i>
												</div>
											</div>
										</div>
									</template>
								</draggable>
								<div
									:class="
										selectedRowIndex[String(isParts)].index ==
										imgList[String(isParts)].length
											? 'itemRightImg bdCol activeBg'
											: 'itemRightImg bdCol'
									"
									v-if="showUploadImg"
								>
									<div
										class="selectImg"
										@click="showSelectImg"
										v-if="!showCoutomDisabled('url') && !isDisabled"
									>
										<i class="el-icon-plus"></i>
									</div>
								</div>
							</div>

							<div class="trItemClose">
								<div
									class="closeItem"
									v-for="(item, index) in coustom[String(isParts)]"
									:key="index"
								>
									<i
										class="el-icon-close delSku"
										@click="delSku(index)"
										v-if="routeOption.add && !isDisabled"
									></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- skuitem -->

		<div
			class="matchChild"
			v-if="selectedRowIndex[String(isParts)].frontId && childList?.length > 0"
		>
			<div class="matchLeft">
				<p>关联子规格</p>
				<el-checkbox
					label="全选"
					v-model="
						isCheckedAll[String(isParts)][
							selectedRowIndex[String(isParts)].frontId
						]
					"
					@change="selectedAll"
					:indeterminate="showIndeter()"
					:disabled="!routeOption.add"
				></el-checkbox>
			</div>

			<div class="matchRight">
				<el-checkbox-group
					v-model="
						selectedMactchList[String(isParts)][
							selectedRowIndex[String(isParts)].frontId
						]
					"
					@change="
						val =>
							getMatchChecked(val, selectedRowIndex[String(isParts)].frontId)
					"
				>
					<el-checkbox
						:label="item.frontId"
						v-for="(item, index) in childList"
						:key="index"
						:disabled="!routeOption.add"
						>{{ item.nameEn }}</el-checkbox
					>
				</el-checkbox-group>
			</div>
		</div>
		<!-- 关联子规格 -->

		<div
			:style="{
				position: 'fixed',
				right: 0,
				bottom: 0,
				width: '32%',
				borderTop: '1px solid #e9e9e9',
				padding: '10px 16px',
				background: '#fff',
				textAlign: 'right',
				zIndex: 999
			}"
		>
			<el-button :style="{ marginRight: '8px' }" @click="cancel">
				取消
			</el-button>
			<el-button type="primary" @click="submit"> 确定 </el-button>
		</div>
	</div>
</template>

<script>
import { toRefs, reactive, computed, onMounted, watch, inject } from 'vue'
import UploadImg from '@/components/uploadImg/index.vue'
import draggable from 'vuedraggable'
import skuItemHook from '../hooks/skuItem.js'
import optionFun from '../hooks/optionFun.js'

export default {
	components: { UploadImg, draggable },
	props: {
		query: {
			type: Object,
			default: null
		}
	},
	setup(props, { emit }) {
		const data = reactive({
			dragDisabled: false,
			commonSpeId: null,
			isParts: 0,
			partsNum: 4,
			coustom: {
				1: [], // 开启配件
				0: [] // 关闭配件
			}, // sku参数列表
			imgList: {
				1: [], // 开启配件
				0: [] // 关闭配件
			},
			isShowImg: {
				1: 0,
				0: 0
			}, // 是否显示img
			childList: [], // 子规格列表
			selectedMactchList: {
				1: {},
				0: {}
			}, // 关联的子规格数组
			isCheckedAll: {
				1: {},
				0: {}
			}, // 是否全选子规格
			selectedRowIndex: {
				1: { id: null, index: null },
				0: { id: null, index: null }
			}, // 选中的单元格下标
			speList: inject('speList'),
			selectSpeValue: []
		})
		const routeOption = inject('routeOption')
		const isDisabled = inject('isDisabled')
		const { showCoutomCloumns, showCoutomDisabled } = optionFun(routeOption)
		const {
			createId,
			confirm,
			leftDragEnd,
			leftDragStart,
			submitCoustom,
			cancel,
			changeSpe
		} = skuItemHook(data)

		const nameCnDisabled = element => {
			const { commonSpeValId } = element
			const { commonSpeId, isParts } = data
			if (commonSpeValId) return true
			if (isParts == 1) return true
			return false
		} // 中文输入框是否disabled

		const showUploadImg = computed(() => {
			const { imgList, coustom } = getPartsList()
			if (imgList.length == coustom.length) {
				return false
			}
			return true
		})

		function getPartsList() {
			let imgList = data.imgList[String(data.isParts)]
			let coustom = data.coustom[String(data.isParts)]
			let isShowImg = data.isShowImg[String(data.isParts)]
			let selectedMactchList = data.selectedMactchList[String(data.isParts)]
			let isCheckedAll = data.isCheckedAll[String(data.isParts)]
			let selectedRowIndex = data.selectedRowIndex[String(data.isParts)]
			return {
				imgList,
				coustom,
				isShowImg,
				selectedMactchList,
				isCheckedAll,
				selectedRowIndex
			}
		} // 获取配件是否开启的状态下的数据

		function dragEnd(params) {} // 拖拽结束

		function add() {
			const { coustom, selectedMactchList, isCheckedAll } = getPartsList()
			let frontId = createId()
			let obj = {
				frontId,
				nameEn: null,
				nameCn: null,
				plusPrice: null,
				url: null,
				childIds: [],
				commonSpeValId: null
			}
			selectedMactchList[frontId] = []
			isCheckedAll[frontId] = false
			coustom.push(obj)
		} // 新增参数

		function getImgList(val) {
			const { imgList, coustom } = getPartsList()
			if (imgList.length < coustom.length) {
				for (var i = 0; i < val.length; i++) {
					let item = val[i]
					let imgItem = {
						pictureId: item.pictureId,
						url: item.url,
						pictureType: 0
					}
					if (imgList.length < coustom.length) {
						imgList.push(imgItem)
					} else {
						return false
					}
				}
			}
		} // 获取上传的图片列表

		function delImg(index) {
			const { imgList } = getPartsList()
			confirm('确定删除当前图片?', () => {
				imgList.splice(index, 1)
			})
		} // 删除当前图片

		function delSku(index) {
			const { imgList, coustom } = getPartsList()
			confirm('确定删除当前规格参数?', () => {
				if (imgList[index]) imgList.splice(index, 1)
				coustom.splice(index, 1)
			})
		} // 删除sku参数

		function selectedRow(element, index) {
			const { selectedRowIndex } = getPartsList()
			selectedRowIndex.frontId = element.frontId
			selectedRowIndex.index = index
		} // 选中单元格

		function formatTooltip(val) {
			return parseInt(val)
		}

		function switchParts(val) {
			data.dragDisabled = val
		}

		function initCoustomF(num = parseInt(data.partsNum)) {
			if (num > 0) {
				for (var i = 0; i < num; i++) {
					let frontId = createId()
					let obj = {
						frontId,
						nameEn: null,
						nameCn: String(data.coustom['1'].length + 1),
						plusPrice: null,
						url: null,
						childIds: [],
						commonSpeValId: null
					}
					data.selectedMactchList['1'][frontId] = []
					data.isCheckedAll['1'][frontId] = false
					data.coustom['1'].push(obj)
				}
			}
		} // 初始化配件的数据

		function changeSlider(val) {
			const { imgList, coustom } = getPartsList()
			let step = Math.abs(parseInt(coustom?.length - val)) || 0
			let imgStep = Math.abs(parseInt(imgList?.length - val)) || 0
			if (step > 0) {
				if (coustom?.length > val) {
					coustom.splice(val, step)
				} else {
					initCoustomF(step)
				}
				if (imgList.length > val) {
					imgList.splice(val, imgStep)
				}
			}
		}

		function showSelectImg() {
			emit('showSelectImg', { type: 2, multiple: true })
		} // 打开图片选择框

		function submit() {
			const { imgList, coustom, isShowImg, selectedMactchList } = getPartsList()
			console.log('submitStart',imgList)

			const { isParts, showType, commonSpeId } = data
			submitCoustom({ imgList, coustom, isShowImg })
				.then(res => {
					coustom.forEach((item, index) => {
						// if(item.nameEn && !item.nameCn) item.nameCn = item.nameEn
						// if(!item.nameEn && item.nameCn) item.nameEn = item.nameCn
						item.childIds = selectedMactchList[item.frontId] || []
						item.url = imgList[index] ? imgList[index].url : null
						item.pictureId = imgList[index] ? imgList[index].pictureId : null
						item.pictureType = imgList[index] ? imgList[index].pictureType : 0
						console.log('test==>',imgList[index],index)
					})
					const emitQuery = {
						speValues: coustom,
						isPhoto: isShowImg,
						commonSpeId,
						isParts
					}
					emit('ok', { emitQuery, query: props.query })
				})
				.catch(err => {})
		} // 提交

		function getMatchChecked(val, frontId) {
			const { selectedMactchList, isCheckedAll } = getPartsList()
			isCheckedAll[frontId] =
				selectedMactchList[frontId].length == data.childList.length
		} // 获取 选中子规格的值

		function selectedAll(val) {
			const { selectedMactchList, selectedRowIndex } = getPartsList()
			if (val) {
				let arr = []
				data.childList.map(item => {
					console.log(item)
					arr.push(item.frontId)
				})
				selectedMactchList[selectedRowIndex.frontId] = [...arr]
			} else {
				selectedMactchList[selectedRowIndex.frontId] = []
			}
		} // 全选

		function showIndeter() {
			const { selectedMactchList, selectedRowIndex } = getPartsList()
			let list = selectedMactchList[selectedRowIndex.frontId]
			if (list?.length > 0 && list?.length < data.childList?.length) return true
			return false
		} // 控制全选的checkbox样式

		// watch(
		//   () => props.query,
		//   (a, b) => {
		//     const { childList, row } = a;
		//     console.log(childList,2)
		//      init(JSON.parse(JSON.stringify(childList)), JSON.parse(JSON.stringify(row)));
		//   },
		//   {
		//     deep: true,
		//   }
		// );

		function init(childList = [], row) {
			data.selectedRowIndex = {
				1: { id: null, index: null },
				0: { id: null, index: null }
			} // 选中的单元格下标
			if (childList) data.childList = childList
			if (row) {
				const { isParts, isPhoto, commonSpeId, speValues } = row
				data.isParts = isParts || 0
				data.isShowImg[isParts] = isPhoto
				data.commonSpeId = commonSpeId
				if (isParts) {
					data.partsNum = speValues.length
					data.dragDisabled = true
				}
				// if (!isParts) initCoustomF();
				getCoustom(speValues, isParts, isPhoto)
			}
			function getCoustom(speValues, isParts) {
				let url = []
				speValues.forEach(item => {
					if (item.childIds) {
						data.selectedMactchList[isParts][item.frontId] = item.childIds
						data.isCheckedAll[isParts][item.frontId] =
							item.childIds?.length == childList.length
					} else {
						data.isCheckedAll[isParts][item.frontId] = false
						data.selectedMactchList[isParts][item.frontId] = []
					}

					if (item.url) {
						let imgItem = {
							frontId: createId(),
							url: item.url,
							pictureType: 0,
							pictureId:item.pictureId || null
						}
						url.push(imgItem)
					}
				})
				data.imgList[isParts] = url
				data.coustom[isParts] = speValues
			}
		}

		function selectSpe() {
			const { imgList, coustom } = getPartsList()
			let spe = data.speList.find(v => v.id == data.commonSpeId)
			let slectSpeArr = []
			coustom.map(item => {
				if (item.commonSpeValId) slectSpeArr.push(item.commonSpeValId)
			})
			let query = {
				type: 'coustom',
				values: data.selectSpeValue,
				spe,
				slectSpeArr
			}
			emit('selectSpe', query)
		} // 选择常用规格

		function addSpe(speList) {
			const { imgList, coustom, selectedMactchList, isCheckedAll, isShowImg } =
				getPartsList()
			speList.map(item => {
				let index = coustom.findIndex(v => v.commonSpeValId == item.id)
				if (index !== -1) return
				let frontId = createId()
				let obj = {
					frontId,
					nameCn: item.valCn,
					nameEn: item.valEn,
					plusPrice: null,
					url: null,
					childIds: [],
					commonSpeValId: item.id
				}
				selectedMactchList[frontId] = []
				isCheckedAll[frontId] = false
				coustom.push(obj)
				// if(isShowImg == 0) return
				let imgItem = {
					frontId: createId(),
					url: item.mainImg,
					pictureId: createId(),
					pictureType: 1
				}
				imgList.push(imgItem)
			})
		}

		watch(
			() => props.query,
			a => {
				if (props.query) {
					const { childList, row } = props.query
					init(
						JSON.parse(JSON.stringify(childList)),
						JSON.parse(JSON.stringify(row))
					)
					if (data.commonSpeId) {
						data.speList.map(item => {
							if (item.id == data.commonSpeId)
								data.selectSpeValue = item.valueList
						})
					}
				}
			}
		)

		onMounted(() => {
			if (props.query) {
				const { childList, row } = props.query
				init(
					JSON.parse(JSON.stringify(childList)),
					JSON.parse(JSON.stringify(row))
				)
				const { isParts } = row
				if (!isParts) initCoustomF()
				if (data.commonSpeId) {
					data.speList.map(item => {
						if (item.id == data.commonSpeId)
							data.selectSpeValue = item.valueList
					})
				}
			}
		})

		return {
			...toRefs(data),
			dragEnd,
			add,
			getImgList,
			delImg,
			showUploadImg,
			delSku,
			formatTooltip,
			switchParts,
			nameCnDisabled,
			changeSlider,
			getMatchChecked,
			selectedAll,
			showIndeter,
			leftDragEnd,
			leftDragStart,
			submit,
			showSelectImg,
			selectedRow,
			cancel,
			changeSpe,
			selectSpe,
			addSpe,
			routeOption,
			showCoutomCloumns,
			showCoutomDisabled,
			isDisabled
		}
	}
}
</script>

<style lang="scss" scoped>
.skuItemBox {
	border: 1px solid #e8e8e8;
	padding: 0 1.5% 20px 1.5%;
}

.itemHead {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 12px 26px;
	background: #fafafa;
	width: 103%;
	margin-left: -1.5%;
	i {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.45);
	}
	.itemHeadRight {
		width: 60%;
		margin-left: 30px;
	}
}

.itemForm {
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.itemFormLeft {
		width: 15%;
	}
	.itemFormRight {
		width: 85%;
	}
}

.type {
	display: flex;
	align-items: center;
	cursor: pointer;
	.formType {
		padding: 5.5px 20px;
		border: 1px solid #e8e8e8;
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

.itemBtn {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 20px;
	.btnList {
		width: 100%;
		display: flex;
		align-items: center;
		.sku {
			width: 40%;
			margin-right: 10px;
		}
		.btn {
			cursor: pointer;
			border: 1px solid #1890ff;
			color: #1890ff;
			padding: 5px 10px;
			margin-right: 12px;
		}
		.select {
			display: flex;
			align-items: center;
		}
	}
}

.itemTable {
	.tableHead {
		margin-top: 20px;
		background: #fafafa;
		border: 1px solid #e8e8e8;
		border-bottom: none;
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		text-align: center;
		.col {
			padding: 6px 0px 3px 0px;
		}

		.headBottom {
			.colB {
				justify-content: center;
				align-items: center;
				display: flex;
				font-size: 12px;
				padding: 2px 0;
				color: rgba(0, 0, 0, 0.85);
				.en {
					width: 60%;
				}
				.cn {
					width: 40%;
				}
			}
		}
	}

	.tableTr {
		display: flex;
		.trItemLeft {
			width: 80%;
		}
		.trItemRight {
			width: 15%;
			border-bottom: 1px solid #e8e8e8;
		}
	}
	.bdCol {
		border-bottom: 1px solid #e8e8e8;
		border-right: 1px solid #e8e8e8;
	}
	.trItemLeft {
		border-top: 1px solid #e8e8e8;
		border-left: 1px solid #e8e8e8;
		.input {
			width: 80%;
		}

		.trCol {
			justify-content: center;
			align-items: center;
			display: flex;
			font-size: 12px;
			color: rgba(0, 0, 0, 0.85);
			text-align: center;
			height: 70px;

			.itemEn {
				height: 70px;
				width: 60%;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
			.itemCn {
				height: 70px;
				width: 40%;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
		}
	}
	.trItemRight {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-top: 1px solid #e8e8e8;
		.itemRightImg {
			height: 70px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: none !important;
		}
	}
}

.dragImg {
	width: 100%;
}

.imgItem {
	position: relative;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
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

.trItemClose {
	display: flex;
	flex-direction: column;
	width: 5%;
	border-right: 1px solid #e8e8e8;
	border-bottom: 1px solid #e8e8e8;
	.closeItem {
		height: 70px;
		line-height: 70px;
		text-align: center;
		border-top: 1px solid #e8e8e8;
		border-left: 1px solid #e8e8e8;
	}
	.delSku {
	}
}

.matchChild {
	margin: 20px 0 50px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.matchLeft {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		p {
			color: #1890ff;
			margin-bottom: 5px;
		}
		width: 20%;
	}
	.matchRight {
		display: flex;
		flex-wrap: wrap;
		width: 80%;
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

.activeBg {
	background: #fafafa;
}

:deep(.el-upload--picture-card) {
	width: 60px;
	height: 60px;
}
:deep(.imgList .imgItem) {
	width: 60px;
	height: 60px;
	img {
		width: auto;
		height: auto;
		max-width: 60px;
		max-height: 60px;
	}
}
</style>
