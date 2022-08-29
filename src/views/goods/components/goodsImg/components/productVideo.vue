<template>
	<div class="productVideo">
		<div class="videoBox">
			<div class="boxLeft">视频:</div>

			<div class="video">
				<video
					v-if="video.videoUrl"
					:src="video.videoUrl"
					controls="controls"
				></video>
				<p v-if="!video.videoUrl">请上传视频</p>
			</div>

			<div class="btnList">
				<UploadFile
					moduleName="goods"
					moduleType="video"
					buttonText="上传视频"
					:showFileList="false"
					:accept="'.mp4'"
          :notAcceptedType="['mp4']"
					notAcceptTitle="视频格式不正确"
					:isShowProgress="false"
					@success="getVideoList"
          :maxSize="20"
					v-if="!isDisabled"
				>
					<template #trigger>
						<el-button type="primary" 
							>上传视频</el-button
						>
					</template>
				</UploadFile>
						<el-button v-else  :disabled="isDisabled" type="primary" 
							>上传视频</el-button
						>

				<!-- <div class="marginTop">
					<el-button type="primary"  @click="()=>dialogVisibleVideo = true" :disabled="isDisabled">嵌入视频</el-button>
				</div> -->
				<div class="marginTop">
					<el-button type="default"  @click="()=>video.videoUrl = null" :disabled="isDisabled">删除视频</el-button>
				</div>
				<div class="marginTop text">
					<p><i class="el-icon-warning-outline"></i> 说明</p>
					<p>1. 支持扩展名：.mp4</p>
					<p>2. 最大不超过20M</p>
				</div>
			</div>
		</div>
		<!-- 视频 -->

		<div class="videoBox marginTop">
			<div class="boxLeft">封面:</div>

			<div class="video">
        		<p v-if="!video.videoCover">请上传封面</p>
            <img :src="video.videoCover" alt="" @click="()=>showPreview = true">
      </div>

			<div class="btnList">
				<UploadCover
           ref="cover"
           id="uploadCover"
					 moduleName="cover"
					 :addNameWithSize="true"
						:multiple="false"
					:isTrigger="true"
					:showFileList="false"
					:isCompress="true"
						:isNoFilieList="true"
					@getFileList="getImgList"
          :maxSize="10"
					@getCompressList="getCompressList"
						v-if="!isDisabled"
				>
					<template #trigger>
						<el-button type="primary" 
							>上传图片</el-button
						>
					</template>
				</UploadCover>
					<el-button v-else type="primary"  :disabled="isDisabled"
							>上传图片</el-button
						>

				<div class="marginTop">
					<el-button type="primary"  @click="()=> dialogVisible= true" :disabled="isDisabled">在线图片</el-button>
				</div>
				<div class="marginTop">
					<el-button type="default"  @click="()=> {video.videoCover = null ;video.videoCoverCompress = null}" :disabled="isDisabled">删除图片</el-button>
				</div>
				<div class="marginTop text">
					<p><i class="el-icon-warning-outline"></i> 说明</p>
					<p>1. 支持jpg / jpeg / png / gif</p>
					<p>2. 最大不超过10M</p>
				</div>
			</div>
		</div>

			<AddOnlioneImg
				v-if="dialogVisible"
				:dialogVisible="dialogVisible"
				width="40%"
				@uploadOnline="getUploadOnlineImg"
				dialogTitle="添加在线图片"
				:multiple="false"
			/>

				<AddOnlioneVideo
					v-if="dialogVisibleVideo"
				:dialogVisible="dialogVisibleVideo"
				width="40%"
				@uploadOnline="getUploadOnlineVideo"
				dialogTitle="添加嵌入视频"
			/>


			<el-image-viewer
				v-if="showPreview"
				:url-list="[video.videoCover]"
				:initial-index="0"
				@close="
					() => {
						showPreview = false
					}
				"
			/>

	</div>
</template>

<script>
import { toRefs, reactive, getCurrentInstance,ref,onMounted,watch,inject  } from 'vue'
import AddOnlioneImg from '@/views/goods/components/goodsImg/components/addOnlioneImg.vue'
import UploadCover from '@/components/uploadImg/index.vue'
import UploadFile from '@/components/uploadFile/index.vue'
import AddOnlioneVideo from '@/views/goods/components/goodsImg/components/addOnlioneVideo.vue'
export default {
		props:{
			modelValue: Object,
	},
	components: { AddOnlioneImg, UploadCover, UploadFile,AddOnlioneVideo },
	setup(props,{emit}) {
		const { proxy } = getCurrentInstance()
    const cover = ref(null)
		const data = reactive({
			video:{
				videoCover:null,//封面
				videoCoverCompress:null,//封面压缩
				videoUrl:null, // 视频路径
			},
				dialogVisible:false,
				dialogVisibleVideo:false,
				showPreview:false,

		})
		const isDisabled = inject("isDisabled"); // 是否可编辑
		function getImgList(val) {
      if(val){
        data.video.videoCover = val[val.length-1].fileUrl
      }
      resertUpload()
		} //获取图片列表

		function getCompressList(val) {
			data.video.videoCoverCompress = val[0]
    } // 获取压缩图列表

    function resertUpload(params) {
        cover.value.resert()
    }

		function getVideoList(val) {
			if (val.fileUrl) {
				proxy.$message.success('视频上传成功')
				data.video.videoUrl = val.fileUrl
			}
		}

		function getUploadOnlineImg(val){
			if(val[0].url){
				data.video.videoCover = val[0].url
			 data.video.videoCoverCompress = val[0].thumbnailUrl
			}else{
								proxy.$message.error('无效链接')
					}

		}

		function getUploadOnlineVideo(val){
			if(val[0].url){
				data.video.videoUrl = val[0].url
			}else{
				proxy.$message.error('无效链接')
			}

		}

			watch(()=>props.modelValue,(a)=>{
				data.video = a
		})

			onMounted(() => {
				data.video = props.modelValue
			})



		function emitData(){
				emit('update:modelValue', data.video)
		} // 提交信息
		return {
			...toRefs(data),
			getImgList,
			getCompressList,
			getVideoList,
      cover,
			emitData,
			getUploadOnlineImg,
			getUploadOnlineVideo,
			isDisabled
		}
	}
}
</script>

<style lang="scss" scoped>
.videoBox {
	display: flex;
	align-items: center;
	.video {
		width: 504px;
		height: 247px;
		background: #eff4f7;
		margin: 0px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		video {
			width: 504px;
			height: 247px;
		}
    img{
      width: auto;
      height: auto;
      max-width: 504px;
      max-height: 247px;
    }
	}
	.text {
		p {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}

.boxLeft{
	   font-size: 14px;
    color:#606266
}

.marginTop {
	margin-top: 20px;
}
</style>
