<!--
 * @Descripttion: 批量变更支付状态
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-21 17:08:01
-->

<template>
	<div>
		<el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" :close-on-click-modal="false" :destroy-on-close="true" @close="close">
			<div class="content" v-show="ifShow">
				<UploadFile ref="updFile" @success="getFileList" accept=".xls,.xlsx" :before-upload="beforeUpload" @remove="removeFile" moduleName="payMthChange">
					<template v-slot:download>
						<el-button type="text" style="margin-left: 20px" @click="downloadFile(templateUrl)">下载模板</el-button>
					</template>
				</UploadFile>
				<div style="margin: 10px 0">{{fileInfo.msg}}</div>
				<div>功能说明!</div>
				<div>1、把「支付方式」填写给对应的订单号</div>
				<div>2、上传成功的订单会自动移入到「待审核」</div>
			</div>
			<div v-show="!ifShow" style="width: 80%">
				<div style="margin-bottom: 5px">表格上传</div>
				<el-progress :percentage="100" :format="() => '完成'"></el-progress>
				<div style="margin: 20px 0 5px 0">数据校验</div>
				<el-progress :percentage="100" :indeterminate="indeterminate" :format="() => indeterminate ? '进行中' : '完成'"></el-progress>
				<div class="batchStatus" style="margin-top: 30px" v-if="verifyInfo.msg">
					<div v-if="!verifyInfo.status" style="color: red">导入失败！</div>
					<div v-if="verifyInfo.status" class="color: #66b1ff">导入成功！</div>
					<div style="margin-top: 20px">{{verifyInfo.msg}}</div>
					<el-button type="text" class="uploadBtn" @click="uploadText" :disabled="!errorText">下载文档</el-button>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer" v-show="ifShow">
					<el-button  @click="cancel">关 闭</el-button>
					<el-button type="primary"  @click="dialogHandOk" :disabled="!fileInfo.dataFlag">确 定</el-button>
				</span>
				<span class="dialog-footer" v-show="!ifShow">
					<el-button  @click="cancel">取 消</el-button>
					<el-button type="primary"  @click="uploadAgain">重新上传</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import { ref, reactive, toRefs, getCurrentInstance, nextTick, inject } from 'vue'
	import UploadFile from '@/components/uploadFile/index.vue'
	import { batchPaymentStatus, batchChangePayStatus } from '@/api/order/orderManagement'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			dialog: {
				type: Object,
				default: null
			},
			dialogTitle: {
				type: String,
				default: '提示'
			},
			dialogVisible: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '30%'
			},
			data: {
				type: Object,
				default: null
			}
		},
		setup(props, context) {
			let updFile = ref(null)
			const { proxy } = getCurrentInstance()
			const formOptions = inject('formOptions')
			let state = reactive({
				templateUrl: 'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/payment_status_template.xlsx',
				ifShow: true,
				fileInfo: {
					msg: '',
					uuid: null,
          dataFlag: true
				},
				verifyInfo: {
					status: true,
					msg: ''
				},
				indeterminate: true,
				timer: null,
				errorText: '',
			})

			let getFileList = (value) => {
				let { fileUrl } = value
				batchPaymentStatus({ fileUrl }).then(res => {
					if (res.code == 200) {
						state.fileInfo = JSON.parse(res.data)
					} else {
						updFile.value.upd.clearFiles()
            state.fileInfo = {
              msg: '',
              uuid: null,
              dataFlag: true
            }
						ElMessage.error(res.message)
					}
				}).catch((err) => {
					updFile.value.upd.clearFiles()
				
				})
			}

      // 上传前
      const beforeUpload = file => {
        state.fileInfo = {
          msg: '',
          uuid: null,
          dataFlag: true
        }
        let arr = file.name.split('.')
        const fileType = arr[arr.length - 1]
        if (fileType !== 'xls' && fileType !== 'xlsx') {
          ElMessage.error({ message: '请上传符合格式要求(xls,xlsx)的文件' })
          return false;
        }
      }

      // 删除文件
      let removeFile = (value) => {
        console.log(value)
        state.fileInfo = {
          msg: '',
          uuid: null,
          dataFlag: true
        }
      }

			const dialogHandOk = () => {
				if (!state.fileInfo.uuid) {
					ElMessage.error('请先上传文件！')
					return false;
				}
				state.ifShow = false
				state.timer = setInterval(() => {
					batchChangePayStatus({ uuid: state.fileInfo.uuid }).then(res => {
						if (res.code == 200) {
							if (res.data.fail == 0) {
								ElMessage.success({ message: '变更成功', type: 'success' })
								state.verifyInfo.status = true
								state.verifyInfo.msg = ''
								close()
							} else {
								ElMessage.error('变更失败')
								state.verifyInfo.status = false
								state.verifyInfo.msg = `共上传数据${res.data.total}条，其中有${res.data.fail}条错误数据，请点击下载查看，修改后，重新上传`
								state.errorText = res.data.msg
							}
						} else {
							ElMessage.error(res.message)
							state.verifyInfo.status = false
							state.verifyInfo.msg = ''
						}
						state.indeterminate = false
						clearInterval(state.timer)
					}).catch(err => {
					
						state.indeterminate = false
						state.verifyInfo.msg = ''
						clearInterval(state.timer)
					})
				}, 1000)
			}

			const close = () => {
				clearInterval(state.timer)
				formOptions.value.init(1)
				proxy.$parent.dialogVisible = false
			}
			const cancel = () => {
				clearInterval(state.timer)
				proxy.$parent.dialogVisible = false
			}
			let uploadAgain = () => {
				clearInterval(state.timer)
				state.ifShow = true
				state.indeterminate = true
				state.verifyInfo = {
					status: true,
					msg: ''
				}
				state.fileInfo = {
					msg: '',
					uuid: null
				}
				updFile.value.upd.clearFiles()
			}

			// 下载文档
			let uploadText = () => {
				window.open(state.errorText)
			}

			return {
				updFile,
				...toRefs(state),
				getFileList,
				dialogHandOk,
				cancel,
				close,
				uploadAgain,
				uploadText,
        beforeUpload,
        removeFile
			}
		},
		components: {
			UploadFile
		}
	}
</script>


<style lang="scss" scoped>
:deep(.el-dialog__body) {
	padding-top: 20px !important;
}
.batchStatus {
	position: relative;
	.uploadBtn {
		position: absolute;
		right: 0;
		top: -3px;
	}
}
</style>