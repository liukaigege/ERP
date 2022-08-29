<!--
 * @Descripttion: 导入更换物流
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 10:58:29
-->

<template>
	<div class="importOrder">
		<el-dialog
			:title="dialogTitle"
			v-model="dialogVisible"
			:width="width"
			@close="close"
		>
			<div v-if="!runType">
				<UploadFile
					ref="updFile"
					:limit="1"
					@success="getFileList"
					:data="fileList"
					:moduleName="'logisticsChange'"
					accept=".xls,.xlsx"
				>
					<template v-slot:download>
						<el-button
							type="text"
							style="margin-left: 20px"
							@click="downloadFile(templatePath)"
							>下载模板</el-button
						>
					</template>
				</UploadFile>
        <p>{{ successMsg }}</p>
				<div class="info">
					<p class="infoTitle">
						<i class="el-icon-warning-outline"></i> 功能说明
					</p>

					<p class="text">
						1、把「新物流方式」、「新运单号」填写给对应的包裹号
					</p>
					<p class="text">
						2、
						上传成功的新物流方式和运单号会在更换物流管理中生成新待发货包裹
					</p>
				</div>
			</div>

			<div v-if="runType">
				<div class="progress">
					数据校验
					<el-progress
						:percentage="percentage"
						:format="format"
					></el-progress>
				</div>

				<div class="error" v-if="isError">
					<span class="error">导入失败！</span>
				
					<el-button
						type="text"
						style="margin-left: 20px"
						@click="downloadFile(errorFile)"
						>下载文档</el-button
					>
				</div>
				<span class="error" v-if="!isError">{{importMsg}}</span>
			</div>

			<p>{{ msg }}</p>

			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button
						type="primary"
						
						@click="dialogHandOk"
						v-if="!runType"
						>确 定</el-button
					>

					<el-button
						type="primary"
						
						@click="again"
						v-if="runType"
						>重新上传</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import UploadFile from '@/components/uploadFile/index.vue'
import {
	reactive,
	toRefs,
	getCurrentInstance,
	inject,
	ref,
	onMounted
} from 'vue'

import {
	deliveredUpload,
	deliveredImport
} from '@/api/order/orderManagement.js'
import { progressInfo } from '@/api/basic.js'
export default {
	components: { UploadFile },
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
		}
	},
	setup(props, context) {
    const { proxy } = getCurrentInstance()
    const formOptions = inject('formOptions')
		let updFile = ref(null)
		const data = reactive({
			fileList: [],
			activeType: '1',
			successMsg: '',
			runType: false,
			isError: false,
			msg: '',
			uuid: '',
			timer: null,
			errorFile: '',
			percentage: 0,
			importMsg:null,
			templatePath:
				'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/logistics_change_template.xlsx'
		})

		const dialogHandOk = () => {
			if (!data.uuid) {
				proxy.$message.error('请上传文件')
				return
			}
			data.runType = true
			progress(data.uuid)
      deliveredImport({uuid:data.uuid}).then(res=>{
          if(res.code ==200){
            if(res.data.code !== 1){
              data.isError = true
              data.errorFile = res.data.msg
            }else{
							data.importMsg = res.data.msg
							setTimeout(()=>{
								cancel()
						},1000)
						}
            data.percentage = 100
            formOptions.value.init(1)
            clearInterval(data.timer)
          }
      }).catch(err=>{
       
        clearInterval(data.timer)
      })
		}

		const close = () => {
			proxy.$parent.dialogVisible = false
		}
		const cancel = () => {
			proxy.$parent.dialogVisible = false
		}

		const progress = uuid => {
			data.timer = setInterval(() => {
				progressInfo(uuid).then(res => {
					const response = res.data
					if (typeof response !== 'String') {
						data.percentage = response.percent
					}
				})
			}, 1000)
		}

		const getFileList = val => {
			data.fileList = [val]
			data.successMsg = ''
			data.uuid = ''
			const { fileUrl } = val
			deliveredUpload({ path: fileUrl })
				.then(res => {
					if (res.code == 200) {
						data.successMsg = res.data.msg
						data.uuid = res.data.uuid
					}
				})
				.catch(err => {
					console.log(err)
					data.fileList = []
					updFile.value.upd.clearFiles()
				
				})
		}
    const format = (percentage) => (percentage === 100 ? '完成' : `${percentage}%`);
    const again = () => {
			data.isError = false
			data.errorFile = ''
      data.runType = false
      data.fileList = []
      data.successMsg =''
			data.uuid = ''
			updFile.value.upd.clearFiles()
  }
		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			getFileList,
			updFile,
      format,
      again
		}
	}
}
</script>

<style lang="scss" scoped>
.importOrder {
	.infoTitle {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		margin: 20px 0 5px 0;
	}
	.text {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 5px;
	}
	.red {
		color: #ff3b30;
	}
	.index {
		text-indent: 23px;
	}
}
</style>
