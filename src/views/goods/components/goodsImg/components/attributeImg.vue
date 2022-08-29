<template>
	<div class="productImg">
		<div class="btnList">
			<div class="btnListLeft">
				<el-checkbox
					v-model="isCheckedAll"
					@change="checkedAll"
					:disabled="isDisabled"
					:indeterminate="showIndeter('selectedList', 'imgList')"
				></el-checkbox>
				<el-button
					type="primary"

					class="marginRight"
					@click="deleteAll"
					:disabled="isDisabled"
					>批量删除</el-button
				>
			</div>

			<div class="btnListRight">
				<UploadImg
					ref="uploadImg"
					:data="[]"
					id="uploadImg"
					moduleName="spe"
					:addNameWithSize="true"
					:isTrigger="true"
					:showFileList="false"
					:isCompress="true"
					:isNoFilieList="true"
					@getFileList="getImgList"
					@getCompressList="getCompressList"
					:limit="30"
					:maxSize="10"
					v-if="!isDisabled"
					:notAcceptedType="notAcceptedType"
				>
					<template #trigger>
						<el-button type="primary"  @click="clearn"
							>上传图片</el-button
						>
					</template>
				</UploadImg>
				<el-button v-else :disabled="isDisabled" type="primary"
					>上传图片</el-button
				>
				<el-button
					type="primary"
					v-if="onlineImgShow"
					class="marginLeft"
					@click="dialogVisible = true"
					:disabled="isDisabled"
					>在线图片</el-button
				>
			</div>
		</div>

		<div class="imgsList">
			<draggable
				v-model="imgList"
				group="people"
				@start="drag = true"
				@end="dragEnd"
				item-key="id"
				class="draggable"
			>
				<template #item="{ element, index }">
					<div class="imgItem">
						<div class="img">
							<img :src="element.url" class="image" />
						</div>
						<div class="imgItemIbt">
							<div class="btLeft">
								<el-checkbox
									v-model="element.checked"
									@change="
										val => {
											element.checked = val
										}
									"
									:disabled="isDisabled"
								></el-checkbox
								><span>{{ element.resolution }}</span>
							</div>
							<div class="btCenter">
								<i class="el-icon-zoom-in" @click="preview(element, 'url')"></i>
							</div>
							<div class="btRight">
								<i
									class="el-icon-delete"
									@click="isDisabled ? '' : deleteItem(index)"
								></i>
							</div>
						</div>
					</div>
				</template>
			</draggable>
		</div>

		<div class="text">
			<p><i class="el-icon-warning-outline"></i> 说明</p>
			<p>1. 每张图片建议 800*800以上 像素</p>
			<p>2. 支持jpg / jpeg / png / gif，最大不超过10M</p>
		</div>

		<el-image-viewer
			v-if="showPreview"
			:url-list="previwList"
			:initial-index="previwIndex"
			@close="
				() => {
					showPreview = false
				}
			"
		/>
		<!-- 预览图片组件 -->
		<AddOnlioneImg
			:dialogVisible="dialogVisible"
			width="40%"
			@uploadOnline="getUploadOnline"
			dialogTitle="添加在线图片"
		/>
	</div>
</template>

<script>
import {
	toRefs,
	reactive,
	getCurrentInstance,
	watch,
	ref,
	onMounted,
	inject
} from 'vue'
import draggable from 'vuedraggable'
import AddOnlioneImg from '@/views/goods/components/goodsImg/components/addOnlioneImg.vue'
import UploadImg from '@/components/uploadImg/index.vue'
import goodsImgFun from '../hooks/productImg.js'
import { ElMessage } from 'element-plus'
export default {
	props: {
		onlineImgShow:{
			type:Boolean,
			default:true
		},
		modelValue: Array,
		notAcceptedType: {
			Type: Array,
			default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']
		}
	},
	components: { draggable, AddOnlioneImg, UploadImg },
	setup(props) {
		const uploadImg = ref(null)
		const data = reactive({
			isCheckedAll: false, // 全选
			dialogVisible: false, // 显示弹窗新增在线图片
			imgList: [],
			drag: false,
			showPreview: false,
			previwIndex: 0,
			previwList: [],
			selectedList: [],
			thumbnailList: [] // 压缩图列表
		})
		const {
			preview,
			dragEnd,
			checkedAll,
			showIndeter,
			getPreviwList,
			thumbnailUrl,
			emitData,
			confirm,
			createId,
			testPictureId,
			deleteAll,
			deleteItem
		} = goodsImgFun(data)

		const skuRef = inject('skuRef')
		const isDisabled = inject('isDisabled')
		function getImgList(val) {
			if (data.imgList.length >= 30) {
				ElMessage.error('最多可添加30张图片')
				return false
			}
			if (val) {
				setTimeout(() => {
					val.forEach(item => {
						let pictureId = createId()
						if (testPictureId(pictureId, data.imgList))
							pictureId = parseInt(createId() + new Date().getTime())
						//校验如果有pictureId 重复的话就重新生成
						let obj = {
							url: item.fileUrl,
							resolution: `${item.imgSize.width}x${item.imgSize.height}`,
							thumbnailUrl: null, // 压缩图
							checked: false,
							pictureId: pictureId
						}
						if (data.imgList.length < 30) {
							data.imgList.push(obj)
						}
					})
					getPreviwList(data.imgList, 'url')
				}, 100)
			}
		} //获取图片列表

		function getUploadOnline(arr) {
			if (data.imgList.length >= 30) {
				ElMessage.error('最多可添加30张图片')
				return false
			}
			let count = 0
			arr.forEach(item => {
				if (item.url && data.imgList.length < 30) {
					item.checked = false
					item.pictureId = createId()
					data.imgList.push(item)
					count++
				}
			})
			ElMessage.success({ message: `成功添加了${count}张图片` })
			getPreviwList(data.imgList, 'url')
		}



		function clearn(params) {
			resertUpload()
		}

		function resertUpload() {
			uploadImg.value.resert()
		}

		function getCompressList(val) {
			val?.forEach(item => {
				data.thumbnailList.push(item)
			})
			setTimeout(() => {
				thumbnailUrl(data.imgList, data.thumbnailList)
			}, 500)
		} // 获取压缩图列表

		function setPreviewList(){
			console.log(1)
			getPreviwList(data.imgList, 'url')
		}  // 设置预览照片

		watch(
			() => props.modelValue,
			a => {
				if (a) {
					data.imgList = a
					getPreviwList(data.imgList, 'url')
				}
			}
		)

		onMounted(() => {
			data.imgList = props.modelValue
			getPreviwList(data.imgList, 'url')
		})

		return {
			...toRefs(data),
			preview,
			deleteItem,
			dragEnd,
			deleteAll,
			checkedAll,
			showIndeter,
			getImgList,
			getCompressList,
			uploadImg,
			clearn,
			emitData,
			getUploadOnline,
			isDisabled,
			setPreviewList
		}
	}
}
</script>

<style lang="scss" scoped>
.productImg {
}

.btnList {
	display: flex;
	font-size: 12px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	align-items: center;
	justify-content: space-between;
	.marginLeft {
		margin-left: 15px;
	}
	.marginRight {
		margin-left: 15px;
	}
	.btnListLeft {
	}
	.btnListRight {
		display: flex;
		align-items: center;
	}
}

.imgsList {
	margin-top: 20px;
	max-height: 500px;
	overflow-y: scroll;

	.draggable {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.imgItem {
		width: 176px;
		height: auto;
		margin: 0 16px 16px 0;
		border: 1px solid #e9e9e9;
		.img {
			width: 100%;
			height: 180px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.image {
			width: auto;
			height: auto;
			max-width: 170px;
			max-height: 170px;
		}
	}
	.imgItemIbt {
		padding: 13px 13px;
		display: flex;
		align-items: center;
		width: 100%;
		background: #eff4f7;
		.btLeft {
			width: 60%;

			span {
				margin-left: 10px;
				font-size: 12px;
			}
		}
		.btCenter {
			border-left: 1px solid #e9e9e9;
			border-right: 1px solid #e9e9e9;
			width: 20%;
			text-align: center;
			color: rgba(0, 0, 0, 0.45);
		}
		.btRight {
			width: 20%;
			text-align: center;
			color: rgba(0, 0, 0, 0.45);
		}
	}
}
.text {
	margin-top: 20px;
	p {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}
}
</style>
