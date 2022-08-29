<!--
 * @Descripttion: 弹框模板
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 21:19:14
-->

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
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="商品图片" name="0"></el-tab-pane>
				<el-tab-pane label="属性图片" name="1"></el-tab-pane>
			</el-tabs>

			<div class="imgBox">
				<div
					class="imgItem"
					v-if="imgList['1'].length == 0 && activeName == '1'"
				>
					<UploadImg
						ref="uploadImg"
						:data="[]"
						id="uploadImg"
						:isTrigger="false"
						:showFileList="false"
						:isCompress="true"
						:isNoFilieList="true"
						@getFileList="getImgList"
						@getCompressList="getCompressList"
						:maxSize="10"
					>
					</UploadImg>
				</div>
				<draggable
					v-model="imgList[activeName]"
					group="people"
					@start="drag = true"
					@end="dragEnd"
					item-key="id"
					class="draggable"
					:disabled="true"
				>
					<template #item="{ element, index }">
						<div style="display: flex">
							<div class="imgItem" v-if="index == 0 && activeName == '1'">
								<UploadImg
									ref="uploadImg"
									:data="[]"
									id="uploadImg"
									:isTrigger="false"
									:showFileList="false"
									:isCompress="true"
									:isNoFilieList="true"
									@getFileList="getImgList"
									@getCompressList="getCompressList"
									:maxSize="10"
								>
								</UploadImg>
							</div>

							<div
								:class="
									selectedList.indexOf(element.pictureId) !== -1
										? 'imgItemActive imgItem '
										: 'imgItem'
								"
								@click="selected(element)"
							>
								<img :src="element.url" alt="" srcset="" />
							</div>
						</div>
					</template>
				</draggable>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button type="primary"  @click="dialogHandOk"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, inject, onMounted } from 'vue'
import draggable from 'vuedraggable'
import UploadImg from '@/components/uploadImg/index.vue'
import skuItemHook from '../hooks/skuItem.js'
export default {
	props: {
		dialogTitle: {
			type: String,
			default: '选择图片'
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '40%'
		},
		activeName: {
			type: String,
			default: '0'
		},
		multiple: {
			type: Boolean,
			default: true
		}, // 多选
		skuQuery: {
			type: Object,
			default: null
		}
	},
	components: { draggable, UploadImg },
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const goodsImgRef = inject('goodsImgRef')
		const { createId } = skuItemHook()
		const data = reactive({
			imgList: {
				0: [],
				1: []
			},
			thumbnailList: {
				0: [],
				1: []
			},
			newList: {
				0: [],
				1: []
			},
			selectedList: []
		})

		const goodsImgs = inject('goodsImages')
		const attrImgs = inject('attrImages')
		console.log(goodsImgs,attrImgs);
		function handleClick() {}

		function dragEnd() {}

		const dialogHandOk = () => {
			pushNewImg()
			if (data.selectedList?.length > 0) {
				let imgArr = []
				data.imgList[props.activeName].map(item => {
					if (data.selectedList.indexOf(item.pictureId) !== -1)
						imgArr.push(item)
				})

				emit('selectImg', { query: props.skuQuery, url: imgArr, activeName:props.activeName})
				cancel()
			} else {
				proxy.$message.error('请选择图片')
			}
		}

		function getActiveList() {
			let { imgList, thumbnailList, newList } = data
			let activeName = props.activeName
			return {
				imgList: imgList[activeName],
				thumbnailList: thumbnailList[activeName],
				newList: newList[activeName]
			}
		}

		function getImgList(val) {
			let { imgList, newList } = getActiveList()
			if (val) {
				for (let i = 0; i < val.length; i++) {
					let item = val[i]
					let obj = {
						url: item.fileUrl,
						resolution: item.imgSize,
						thumbnailUrl: null, // 压缩图
						checked: false,
						pictureId: createId()
					}
					imgList.push(obj)
					newList.push(obj)
				}
			}
		} //获取图片列表

		function getCompressList(val) {
			let { imgList, thumbnailList } = getActiveList()
			val?.forEach(item => {
				thumbnailList.push(item)
			})
			setTimeout(() => {
				thumbnailUrl(imgList, thumbnailList)
			}, 500)
		} // 获取压缩图列表

		function thumbnailUrl(arr1, arr2) {
			arr1.forEach(item => {
				let x = arr2.find(v => {
					return checkName(item.url, v)
				})
				if (x && !item.thumbnailUrl) item.thumbnailUrl = x
			})
			function checkName(nameA, nameB, key = '-o') {
				if (getImgName(nameA) == getImgName(nameB) + key) return true
				return false
			}
		} // 填充压缩图

		function getImgName(path) {
			let filename
			if (path.indexOf('/') > 0) {
				//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
				filename = path.substring(path.lastIndexOf('/') + 1, path.length)
			} else {
				filename = path
			}
			return filename.split('.')[0]
		}

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
			pushNewImg()
		}

		function pushNewImg() {
			if (!goodsImgRef) return
			//如果商品图片组件不存在则不更新
			let { newList } = getActiveList()
			newList?.forEach(item => {
				item.resolution = item.resolution.width + 'x' + item.resolution.height
				goodsImgRef.value.attrImages.push(item)
				goodsImgRef.value.refList[2].setPreviewList()
			})
			data.newList = []
		}

		function selected(element) {
			if (data.selectedList?.indexOf(element.pictureId) !== -1) {
				let i = data.selectedList.findIndex(e => e === element.pictureId)
				data.selectedList.splice(i, 1)
			} else {
				if (!props.multiple && data.selectedList?.length > 0) {
					data.selectedList = []
				}
				data.selectedList.push(element.pictureId)
			}
		} // 选中图片

		function init() {
			goodsImgRef.value.getVal()
			const { attrImages, goodsImages } = goodsImgRef.value
			console.log(attrImages, goodsImages)
			data.imgList['0'] = JSON.parse(JSON.stringify(goodsImages))
			data.imgList['1'] = JSON.parse(JSON.stringify(attrImages))
		}

		onMounted(() => {
			if (attrImgs && goodsImgs) {
				data.imgList['0'] = goodsImgs
				data.imgList['1'] = attrImgs
				//已报价注入的图片
			} else {
				init()
			}
		})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			handleClick,
			dragEnd,
			getImgList,
			getCompressList,
			selected
		}
	}
}
</script>

<style lang="scss" scoped>
.draggable {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	max-height: 400px;
	overflow: auto;
}

.imgBox {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: 0px 14px;
	.imgItem {
		width: 110px;
		height: 110px;
		margin: 0 10px 10px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			width: auto;
			height: auto;
			max-width: 100px;
			max-height: 100px;
		}
	}
	.imgItemActive {
		box-sizing: border-box;
		border: 1px solid #1890ff;
	}
}

:deep(.el-upload--picture-card) {
	width: 110px;
	height: 110px;
}

:deep(.el-tabs__nav-wrap) {
	border-bottom: 1px solid #e8e8e8 !important;
}
:deep(.el-dialog__body) {
	padding: 0;
}
:deep(.el-tabs__nav-scroll) {
	padding: 0 10px;
}
</style>
