<!--
 * @Descripttion: 上传图片
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-21 10:15:33
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-13 17:22:33
-->

<template>
	<div class="container">
		<div v-if="showFileList" class="imgList">
			<div v-for="(item, index) in fileList" :key="index" class="imgItem">
				<img :src="item.url" alt="" srcset="" />
				<div class="mask"></div>
				<div class="icon">
					<i class="el-icon-delete" @click="del(item)"></i>
				</div>
			</div>
		</div>

		<div v-if="fileList.length < limit || isTrigger">
			<el-upload
				action=""
				:list-type="isTrigger ? '' : 'picture-card'"
				ref="upd"
				:drag="drag"
				:style="style"
				:multiple="multiple"
				:show-file-list="false"
				:accept="accept"
				:file-list="fileList"
				:limit="limit"
				:on-exceed="exceed"
				:on-remove="remove"
				:on-success="success"
				:on-error="error"
				:on-progress="progress"
				:on-change="change"
				:before-upload="beforeUpload"
				:before-remove="beforeRemove"
				:http-request="uploadFile"
			>
				<template #default>
					<slot name="trigger" v-if="isTrigger"></slot>
					<i
						class="el-icon-plus"
						v-show="!showPercent && !isTrigger"
						style="margin: 0"
					></i>
					<el-progress
						v-show="showPercent && !isTrigger"
						:indeterminate="true"
						:percentage="percent"
					></el-progress>
				</template>
			</el-upload>
		</div>
	</div>
</template>

<script>
import md5 from 'md5'
import { reactive, toRefs, getCurrentInstance, onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { createFileName } from '@/utils/tool.js'
import { useStore } from 'vuex'
import OSS from 'ali-oss'
export default {
	props: {
		recognitionId:{
			type:String,
			default: null
		},//识别 id
		showDelete: {
			type: Boolean,
			default: true
		}, //是否显示删除按钮

		style: {
			type: Object,
			default: {
				width: 'auto'
			}
		},
		buttonText: {
			type: String,
			default: '选择导入文件'
		},
		showDownloadTem: {
			type: Boolean,
			default: true
		}, // 是否支持下载模板
		template: {
			type: String,
			default: null
		}, // 模板地址
		drag: {
			type: Boolean,
			default: false
		}, // 是否支持拖拽上传
		multiple: {
			type: Boolean,
			default: true
		}, // 是否支持多选
		showFileList: {
			type: Boolean,
			default: true
		}, // 是否显示已上传文件列表
		accept: {
			type: String,
			default: '.jpg, .jpeg, .png, .gif, .webp, .jfif'
		}, //接受上传的文件类型
		limit: {
			type: Number,
			default: 9
		}, // 默认最大上传数
		custom: {
			type: Boolean,
			default: false
		}, // 是否使用自定义插槽控制样式
		tip: {
			type: String,
			default: '请选择上传文件'
		},
		data: {
			type: Array,
			default: []
		},
		moduleName: {
			type: String,
			default: 'ERP_MODULE'
		},
		isCompress: {
			type: Boolean,
			default: false
		}, // 是否开启压缩上传
		compressWidth: {
			type: Number,
			default: 200
		}, // 压缩的宽
		compressHeight: {
			type: Number,
			default: 200
		}, // 压缩的高,
		isTrigger: {
			type: Boolean,
			default: false
		}, //是否按钮上传
		maxSize: {
			type: Number,
			default: null
		}, //最大质量
		isNoFilieList: {
			type: Boolean,
			default: false
		}, // 是否不需要返回上传组件的fileList ,上传组件单纯只作用于上传图片
		addNameWithSize: {
			type: Boolean,
			default: false
		}, // 生成文件名时,是否需要在后缀加上文件的宽高尺寸
		message: {
			type: String,
			default: null
		},
		notAcceptedType: {
			// 不支持上传类型
			type: Array,
			default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']
		}
	},
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const uploadBarket = store.getters.uploadBarket
		const data = reactive({
			noFileList: [], // isNoFilieList 开启时用来暂存图片
			fileList: [],
			showPercent: false,
			percent: 0,
			imgType: null,
			imgWidth: 0,
			imgHeight: 0,
			compressFileList: [] //压缩图列表
		})
		const upd = ref(null)
		const handleRemove = file => {
			console.log(file)
		}

		const del = x => {
			let i = data.fileList.filter((item, index) => {
				if (item == x) return index
			})
			data.fileList.splice(i, 1)
			emit('getFileList', data.fileList)
			emit('del',data.fileList,props.recognitionId)
		}
		const change = (file, fileList) => {
			// console.log(updRef)
			emit('change', fileList,props.recognitionId)
		}

		const exceed = () => {
			proxy.$message.warning(`最多上传${props.limit}个！`)
			emit('exceed')
		} // 文件数量超出

		const remove = (file, fileList) => {
			data.fileList = fileList
			emit('remove', fileList)
			emit('getFileList', getFileUrl(fileList))
		}
		const success = (res, file, fileList) => {
			// console.log(data.fileList.push(res))
			emit('getFileUrl', getFileUrl(fileList))
			emit('getFileList', [res])
			emit('add',data.fileList,props.recognitionId)
			// 这里getFileList 的作用是作用于每次上传成功一张图片就emit出去一条
		}
		const error = e => {
			emit('error', e)
		}

		const progress = (event, file, fileList) => {
			emit('progress', e)
		}
		const beforeUpload = file => {
			console.log(file)
			// console.log(file)
			emit('beforeUpload', file)
			if (props.maxSize) {
				const isLt2M = file.size / 1024 / 1024 < props.maxSize
				if (!isLt2M) {
					if (props.message) {
						proxy.$message.error(props.message)
					} else {
						proxy.$message.error(
							// file.name + `图片大小超出限制(${props.maxSize})，请修改后重新上传`
							'图片大小超过10M'
						)
					}

					return false
				}
			}
			let type = file.type.split('/')[1] // 文件后缀
			if (!props.notAcceptedType.includes(type)) {
				proxy.$message.error(
					//  `文件类型(${type})不符合要求，请修改后重新上传`
					'图片格式不正确'
				)
				return false
			}
			return valWidthAndHeight(file)
		}
		const beforeRemove = e => {
			emit('beforeRemove', e)
		}
		const createOssClient = () => {
			return new Promise((resolve, reject) => {
				const client = new OSS(store.getters.datasign)
				resolve(client)
			})
		}
		const getFileUrl = val => {
			let arr = []
			const { isCompress } = props
			const { compressFileList } = data
			val.forEach(item => {
				arr.push(item.response)
			})
			// if (isCompress) {
			// 	// 如果压缩开启
			// 	val.forEach(item => {
			// 		let { fileName } = item.response
			// 		let splitName = fileName.split('.')[0]
			// 		console.log(selectImg(splitName))
			// 		if (selectImg(splitName)) {
			// 		item.response.compressImg = selectImg(splitName)
			// 		}
			// 		arr.push(item.response)
			// 	})
			// } else {

			// }

			return arr

			// function selectImg(name) {
			// 	return compressFileList.find(v => {
			//       let splitName = v.name.split('-c')[0]
			//       if (name === splitName) return v
			// 	})
			// }
		}
		const uploadFile = option => {
			const { file } = option

			return new Promise((resolve, reject) => {
				const extensionName = file.name.substr(file.name.lastIndexOf('.')) // 文件扩展名
				//		const fileNameTxt = md5(file.uid) + md5(new Date().getTime())
				const createName = new createFileName({
					moduleName: props.moduleName,
					type: 'image'
				}).createImportFileName()
				const fileName =
					createName +
					`${
						props.addNameWithSize ? '_' + file.width + '_' + file.height : ''
					}` +
					`${props.isCompress ? '-o' : ''}` +
					extensionName // 文件名字（相对于根目录的路径 + 文件名）

				createOssClient()
					.then(client => {
						const files = option.file
						client
							.multipartUpload(fileName, files, {
								progress: function (p, checkpoint) {
									// self.percent = Math.round(p * 100)
									// console.log(Math.round(p * 100), '进度条')
								}
							})
							.then(res => {
								if (res.res.status == 200) {
									const imgSize = {
										width: file.width,
										height: file.height
									}
									resolve({
										fileName: fileName,
										fileUrl: uploadBarket + fileName,
										imgSize
									})

									if (!props.isNoFilieList) {
										data.fileList.push({
											name: file.name,
											url: uploadBarket + fileName,
											imgSize
										})
									}

									// 当压缩关闭则return 出去
									if (!props.isCompress) return
									let width = props.compressWidth
										? props.compressWidth
										: file.width / 2
									let height = props.compressHeight
										? props.compressHeight
										: file.height / 2
									if (file.width && props.compressWidth) {
										width =
											file.width > props.compressWidth
												? props.compressWidth
												: file.width
									}
									const jpgResize = `image/resize,w_${width},h_${height},limit_0,m_lfit/format,jpg`
									const gifResize = `image/resize,w_${width},h_${height},limit_0,m_lfit/format,gif`
									const pngResize = `image/resize,w_${width},h_${height},limit_0,m_lfit/format,png`
									const imgType = {
										'image/png': {
											resize: pngResize,
											type: 'image/jpg',
											extensionName: '.jpg'
										},
										'image/jpeg': {
											resize: jpgResize,
											type: 'image/jpg',
											extensionName: '.jpg'
										},
										'image/gif': {
											resize: gifResize,
											type: 'image/jpg',
											extensionName: '.jpg'
										}
									}
									if (file.type !== 'image/x-icon') {
										// let formatName = createName +
										// 	`${props.addNameWithSize ? '_'+width+'_'+height :''}`+
										// 	extensionName
										let item = imgType[file.type] || imgType['image/jpeg']
										format(client, res.name, item, {
											createName,
											extensionName
										})
									}
								}
							})
					})
					.catch(e => {
						ElNotification({
							type: 'error',
							title: '错误提示',
							message: '上传失败'
						})
					})
			})
		}

		function valWidthAndHeight(file) {
			return new Promise((resolve, reject) => {
				const _URL = window.URL || window.webkitURL
				const image = new Image()
				image.src = _URL.createObjectURL(file)
				image.onload = function () {
					data.imgWidth = image.width
					data.imgHeight = image.height
					file.width = image.width
					file.height = image.height
					resolve(file)
				}
			}).then(
				file => {
					return file
				},
				() => {
					return Promise.resolve()
				}
			)
		} // 查宽高

		async function format(client, name, item, formatName) {
			try {
				const result = await client.signatureUrl(name, {
					expires: 3600,
					process: item.resize
				})
				getImageFileFromUrl(result, name, item.type, formatName)
			} catch (e) {
				console.log(e)
			}
		}

		async function getImageFileFromUrl(url, imageName, type, formatName) {
			// imageName一定要带上后缀
			await new Promise((resolve, reject) => {
				var blob = null
				var xhr = new XMLHttpRequest()
				xhr.open('GET', url)
				xhr.setRequestHeader('Accept', type)
				xhr.responseType = 'blob'
				xhr.onload = () => {
					blob = xhr.response
					const imgFile = new File([blob], imageName, { type: type })
					valWidthAndHeight(imgFile).then(res => {
						resolve(res)
					})
				}
				xhr.send()
			}).then(res => {
				const { extensionName, createName } = formatName
				let name =
					createName +
					`${props.addNameWithSize ? '_' + res.width + '_' + res.height : ''}` +
					extensionName
				createOssClient().then(client => {
					client.put(name, res).then(resData => {
						data.compressFileList.push(resData.url)
						emit('getCompressList', data.compressFileList)
						//压缩图列表
					})
				})
			})
		} // 将图片地址封装成file格式

		function resert() {
			upd.value.clearFiles()
			data.fileList = []
			data.compressFileList = []
		} // 清空

		onMounted(() => {
			data.fileList = props.data
		})
		return {
			...toRefs(data),
			upd,
			exceed,
			success,
			error,
			remove,
			progress,
			beforeUpload,
			beforeRemove,
			change,
			uploadFile,
			handleRemove,
			del,
			resert
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	align-items: center;
}

.imgList {
	display: flex;
	flex-wrap: wrap;

	.imgItem {
		position: relative;
		width: 110px;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;

		img {
			width: auto;
			height: auto;
			max-width: 110px;
			max-height: 110px;
		}

		.mask {
			position: absolute;
			width: 100%;
			height: 100%;
			max-width: 110px;
			max-height: 110px;
			top: 0;
		}

		.icon {
			display: none;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.imgItem:hover {
		.mask {
			background-color: rgba(0, 0, 0, 0.5);
			transition: all 0.3s;
		}

		.icon {
			display: block;
			transition: all 0.3s;

			i {
				color: white;
				font-size: 18px;
			}
		}
	}
}

.progress {
	margin: 0 auto;
}

:deep(.el-upload--picture-card) {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 110px;
	height: 110px;
}
</style>
