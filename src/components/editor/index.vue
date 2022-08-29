<template>
	<div class="editorBox">
		<editor id="tinymce" v-model="myContent" :init="init"></editor>
		<el-button type="text" class="clearBtn" :disabled="readonly" @click="clearEvent">一键清除</el-button>
		<div id="editor" style="display: none"></div>
	</div>
</template>

<script>
	import { reactive, toRefs, onMounted, watch, ref } from 'vue'
	import $ from 'jquery'
	import { ElMessage } from 'element-plus';
	import { createFileName } from '@/utils/tool.js'
	import { client } from './js/oss.js'
	import tinymce from 'tinymce/tinymce'
	import Editor from '@tinymce/tinymce-vue'
	import 'tinymce/themes/silver/theme'
	import 'tinymce/plugins/image'
	import '@/assets/js/formatpainter/plugin.js'
	import 'tinymce/plugins/media'
	import 'tinymce/plugins/link'
	import 'tinymce/plugins/code'
	import 'tinymce/plugins/table'
	import 'tinymce/plugins/preview'
	import 'tinymce/plugins/lists'
	import 'tinymce/plugins/wordcount'
	import '../../../public/static/ax_wordlimit/plugin.js'
	import 'tinymce/icons/default/icons.min.js'
	export default {
		props: {
			moduleName: { // 模块名
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: '',
				require: true
			},
			height: { // 编辑器的高度
				type: Number,
				default: 500
			},
			readonly: {
				type: Boolean,
				default: false
			}
		},
		emits: ['editChange'],
		setup(props, ctx) {
			let state = reactive({
				init: {
					language_url: '/static/langs/zh_CN.js',
					language: 'zh_CN',
					skin_url: '/static/skins/ui/oxide', // skin路径
					content_css: '/static/skins/content/default/content.css',
					height: props.height, // 编辑器高度
					branding: true, // 是否禁用“Powered by TinyMCE”
					menubar: true, // 顶部菜单栏显示
					plugins: 'link lists image media code table wordcount preview formatpainter ax_wordlimit',
					toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media preview | code removeformat formatpainter',
					resize: false,
					file_picker_types: 'media',
					media_alt_source: false,
					media_live_embeds: true,
					media_filter_html: false,
					images_upload_url: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'https://vango-erp-prod.oss-cn-beijing.aliyuncs.com/' : 'https://vango-erp-test.oss-cn-hangzhou.aliyuncs.com/',
					images_upload_handler: function (blobInfo, success, failure, progress) { // 图片上传OSS
						console.log(blobInfo, blobInfo.blob())
						let filename = blobInfo.filename()
						let index = filename.lastIndexOf('.')
						let suffix = filename.substring(index + 1, filename.length)
						const createName = new createFileName({
							moduleName: props.moduleName,
							type: 'image'
						}).createImportFileName()
						let imageFile = createName + '.' + suffix
						client.multipartUpload(imageFile, blobInfo.blob()).then((result) => {
							if (result.res.requestUrls) {
								success(result.res.requestUrls[0].split('?')[0])
							}
						})
					},
					file_picker_callback: function (callback, value, meta) { // 视频上传OSS
						if (meta.filetype == 'media') {
							let input = document.createElement('input')//创建一个隐藏的input
							input.setAttribute('type', 'file')
							input.setAttribute('accept', '.mp4')
							input.onchange = (e) => {
								let files = e.target.files
								let filename = files[0].name;//选取第一个文件
								console.log(e.target.files)
								let index = filename.lastIndexOf('.')
								let suffix = filename.substring(index + 1, filename.length)
								const createName = new createFileName({
									moduleName: props.moduleName,
									type: 'import'
								}).createImportFileName()
								let videoFile = createName + '.' + suffix
								client.multipartUpload(videoFile, files[0]).then((result) => {
									console.log(result)
									if (result.res.requestUrls) {
										callback(result.res.requestUrls[0].split('?')[0], { title: filename })
									}
								})
							}
							//触发点击
							input.click()
						}
					},
					ax_wordlimit_num: false,
					ax_wordlimit_callback: function (editor, txt, num) { // 字数限制
						ElMessage.error('当前字数：' + txt.length + '，限制字数：' + num)
					},
					init_instance_callback: function (editor) { // 默认显示字符数
						$(editor.getContainer()).find('button.tox-statusbar__wordcount').click()
					}
				},
				myContent: '',
				wordCount: 0 // 字符数
			})

			watch(() => state.myContent, (newVal, oldVal) => {
				ctx.emit('editChange', newVal)
			}, { deep: true })

      watch(() => props.readonly, (newVal) => {
        setTimeout(() => {
          if (newVal) {
            tinymce.editors['tinymce'].setMode('readonly');//开启只读模式
          } else {
            tinymce.editors['tinymce'].setMode('design');//开启编辑模式
          }
        }, 200)
      }, { deep: true, immediate: true })

			let clearEvent = () => state.myContent = '' // 一键清除

			onMounted(() => {
				tinymce.init({})
			})

			return {
				...toRefs(state),
				clearEvent
			}
		},
		components: {
			Editor
		}
	}
</script>

<style lang="scss" scoped>
	.editorBox {
		position: relative;
		.clearBtn {
			position: absolute;
			right: 10px;
			top: 0;
			z-index: 1;
			font-size: 14px;
			height: 40px;
		}
	}
</style>
