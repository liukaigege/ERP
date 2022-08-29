<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-13 14:57:13
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-13 17:45:17
-->

<template>
	<el-upload
		class="upload-demo"
		ref="upd"
		:style="style"
		action=""
		:file-list="fileList"
		:on-exceed="exceed"
		:on-remove="remove"
		:on-success="success"
		:on-error="error"
		:on-progress="progress"
		:on-change="change"
    :before-upload="beforeUpload"
		v-bind="$attrs"
		:http-request="uploadFile"

	>
		<i class="el-icon-upload" v-if="$attrs.drag && !$attrs.custom"></i>
		<div class="el-upload__text" v-if="$attrs.drag && !$attrs.custom">
			将文件拖到此处，或<em>点击上传</em>
		</div>
		<template #trigger>
			<el-button
				:size="buttonSize"
				type="primary"
				v-if="!$attrs.drag && !$attrs.custom"
				>{{ buttonText }}</el-button
			>
			<slot name="trigger" v-if="$attrs.custom && !$attrs.drag"></slot>
			<!-- 下载组件 -->
			<slot name="download"></slot>
		</template>
		<template #tip>
			<slot name="tip" v-if="$attrs.custom && !$attrs.drag"></slot>
			<div class="el-upload__tip" v-if="!$attrs.custom && !$attrs.drag">
				{{ $attrs.tip }}
			</div>
		</template>
	</el-upload>
	<div :style="{ width: style.width }" v-if="isShowProgress" class="upload-progress-box">
		<el-progress
			v-show="showPercent"
			:text-inside="true"
			:stroke-width="14"
			:percentage="percentage"
			:status="progressStatus"
		></el-progress>
	</div>
</template>

<script>
import md5 from 'md5'
import {
	reactive,
	toRefs,
	ref,
	onMounted,
	getCurrentInstance,
	watch
} from 'vue'
import {createFileName} from '@/utils/tool.js'
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex'
import OSS from 'ali-oss'
export default {
	props: {
		buttonSize: {
			type: String,
			default: 'default'
		},
		style: {
			type: Object,
			default: {
				width: '300px'
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
		data: {
			type: Array,
			default: []
		},
    	notAcceptedType: {
			type: Array,
			default: ['xls','xlsx','vnd.ms-excel','vnd.openxmlformats-officedocument.spreadsheetml.sheet']
		},
		notAcceptTitle:{
			type: String,
			default: '文件格式不正确'
		},
		// 是否需要覆盖上传，默认为true
		coverPrev: {
			type: Boolean,
			default: true
		},
         maxSize: {
            type: Number,
            default: null
        }, //最大质量
		moduleName: {
			type: String,
			default: 'ERP_MODULE'
		},
		moduleType: {
			type: String,
			default: 'import'
		},
		isShowProgress:{
			type:Boolean,
			default:true
		}, // 是否显示进度条
	},
	setup(props, { emit }) {
		const { proxy, attrs } = getCurrentInstance()
		const store = useStore()
		const uploadBarket = store.getters.uploadBarket
		const data = reactive({
			progressStatus: 'success',
			percentage: 0,
			showPercent: false,
			fileList: []
		})

		const upd = ref(null)
		const change = (file, fileList) => {
			if (props.coverPrev && fileList.length > 1) {
				fileList.splice(0, 1)
			}
			emit('getFileList', getFileUrl(fileList))
			emit('change', fileList)
		}

       const beforeUpload = file => {

            // console.log(file)
            if (props.maxSize) {
                const isLt2M = file.size / 1024 / 1024 < props.maxSize
                if (!isLt2M) {
                    if (props.message) {
                        proxy.$message.error(
                            props.message
                        )
                    } else {
                        proxy.$message.error(
                            // file.name + `图片大小超出限制(${props.maxSize})，请修改后重新上传`
                            '视频大小超过20M'
                        )
                    }

                    return false
                }
            }

            let type = file.type.split('/')[1] // 文件后缀
						console.log(type,props.notAcceptedType)
            if(!props.notAcceptedType.includes(type)) {
                proxy.$message.error(
                    //  `文件类型(${type})不符合要求，请修改后重新上传`
                    props.notAcceptTitle
                )
                return false
            }
            return file
        }
		const exceed = () => {
			proxy.$message.warning(`最多上传${attrs.limit}个！`)
			emit('exceed')
		} // 文件数量超出

    const clearFiles = () => {
      upd.value.clearFiles()
    }

		const remove = (file, fileList) => {
			emit('remove', fileList)
			emit('getFileList', getFileUrl(fileList))
		}

		const success = (res, file, fileList) => {
			console.log('success')
			emit('success', getFileUrl(fileList))
		}
		const error = e => {
			emit('error', e)
		}

		const progress = e => {
			emit('progress', e)
		}

		const createOssClient = () => {
			return new Promise((resolve, reject) => {
				const client = new OSS(store.getters.datasign)
				resolve(client)
			})
		}
		const getFileUrl = data => {
			let arr = []
			data.forEach(item => {
				arr.push(item.response)
			})
			return arr
		}
		const uploadFile = option => {
			data.showPercent = true
			data.progressStatus = 'success'
			const { file } = option
			return new Promise((resolve, reject) => {
				const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
				const fileNameTxt = md5(file.uid) + md5(new Date().getTime())
				const fileName =
					new createFileName({
						moduleName: props.moduleName,
						type: props.moduleType
					}).createImportFileName() + extensionName // 文件名字（相对于根目录的路径 + 文件名）
				createOssClient()
					.then(client => {
						const files = option.file
						client
							.multipartUpload(fileName, files, {
								progress: function (p) {
									data.percentage = Math.round(p * 100)
								}
							})
							.then(res => {
								if (res.res.status == 200) {
									setTimeout(() => {
										;(data.showPercent = false),
											(data.percentage = 0)
									}, 1000)
									resolve({
										fileName: fileName,
										fileUrl: uploadBarket + fileName
									})
								} else {
									data.progressStatus = 'exception'
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
			change,
			uploadFile,
      beforeUpload,
      clearFiles
		}
	}
}
</script>

<style lang="scss" scoped>
.upload-progress-box {
	margin-top: 15px;
}
:deep(.el-dialog__body) {
	padding-top: 15px !important;
}
</style>
