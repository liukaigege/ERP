<!--
 * @Descripttion: 导入发货
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 10:58:26
-->

<template>
    <div class="importOrder">
        <el-dialog
            :title="dialogTitle"
            v-model="dialogVisible"
            :width="width"
            @close="close"
            :close-on-click-modal="false"
			:close-on-press-escape="false"
        >
            <div v-if="!runType">
                <el-tabs v-model="activeType" v-if="!runType">
                    <el-tab-pane class="tab" label="包裹号" name="1"></el-tab-pane>
                    <el-tab-pane class="tab" label="订单号" name="2"></el-tab-pane>
                </el-tabs>

                <UploadFile
                    ref="updFile"
                    :limit="1"
                    @success="getFileList"
                    :data="fileList"
                    :moduleName="'directDelivery'"
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

                    <p class="text">1、把「跟踪号」填写给对应的{{activeType == '1' ? '包裹号' : '订单号'}}</p>
                    <p class="text">
                        2、上传成功且库存充足的订单会自动移入到「待发货」
                    </p>
                    <p class="text">
                        3、上传成功库存不足的订单会自动移入到「待打单-缺货」
                    </p>
                    <p class="text red">注：是否扣库存未填写的默认为扣库存</p>
                    <p class="text red index">
                        是否优先分配库存未填写的默认为不优先
                    </p>
                </div>
            </div>

            <div v-if="runType">

               <div class="progress">
               数据校验 <el-progress :percentage="percentage" :format="format"></el-progress>
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
            </div>
            <p>{{msg}}</p>

            <template #footer>
                <span class="dialog-footer">
                    <el-button  @click="cancel">取 消</el-button>
                    <el-button
                        type="primary"

                        @click="dialogHandOk"
                        v-if="!runType"
                        :disabled="isDisabled"
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
import { delivery, runDelivery } from '@/api/order/orderManagement.js'
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
        // 获取的formOptions 组件
        let updFile = ref(null)
        const data = reactive({
            fileList: [],
            activeType: '1',
            successMsg: '',
            runType: false,
            isError:false,
            msg:'',
            uuid: '',
            timer: null,
            errorFile:'',
            percentage:0,
            isDisabled:false,
            templatePath:
                'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/import_deliver_template.xlsx'
        })

        const dialogHandOk = () => {
            if (!data.uuid) {
                proxy.$message.error('请上传文件')
                return
            }
            data.runType = true
            progress(data.uuid)
            const param = {
                type: parseInt(data.activeType),
                uuid: data.uuid
            }
            runDelivery(param)
                .then(res => {
                    if (res.code == 200) {
                      const a = JSON.parse(res.data)

                      if(a.url){
                        data.isError = true
                        data.errorFile = a.url
                      }else{
                        setTimeout(()=>{
                            cancel()
                        },1000)
                      }
                      data.msg = a.msg
                      data.percentage = 100

                      formOptions.value.init(1)
                      clearInterval(data.timer)

                    }

                })
                .catch(err => {

                    clearInterval(data.timer)
                })
        }

        const importSend = () => {
            if (!isSelected()) return
            const packageIds = orderTable.value.selectRows.join(',')
        } // 导入发货

        const close = () => {
            proxy.$parent.dialogVisible = false
            data.fileList = []
            data.successMsg = ''
            data.uuid = ''
            data.activeType = '1'
        }
        const cancel = () => {
            proxy.$parent.dialogVisible = false
            ;(data.fileList = []), (data.successMsg = '')
            data.uuid = ''
            data.activeType = '1'

        }

        const getFileList = val => {
            data.fileList = [val]
            data.successMsg = ''
            data.uuid = ''
            const { fileUrl } = val
            delivery({ fileUrl })
                .then(res => {
                    if (res.code == 200) {
                        const { msg, uuid,flag } = JSON.parse(res.data)
                        data.isDisabled = !flag
                        data.successMsg = msg
                        data.uuid = uuid
                    }else if (res.code == 200602) {
                        data.successMsg = JSON.parse(res.data).msg
                    }else{
											data.fileList = []
										}
                })
                .catch(err => {
                    data.fileList = []
                    updFile.value.upd.clearFiles()
                })
        }

        const changeActive = (tab, event) => {
            console.log(event)
        }

        const progress = uuid => {
            data.timer = setInterval(() => {
                progressInfo(uuid).then(res => {
                  const response = res.data
                  if (typeof response !== 'String') {
                    data.percentage= response.percent
                  }

                })
            }, 1000)
        }

        const again = () => {
            data.isError = false
            data.errorFile = ''
            data.runType = false
            data.fileList = []
            data.successMsg =''
            data.isDisabled = false
        }
        const format = (percentage) => (percentage === 100 ? '完成' : `${percentage}%`);
        onMounted(() => {
            console.log(updFile)
        })

        return {
            ...toRefs(data),
            dialogHandOk,
            cancel,
            close,
            getFileList,
            changeActive,
            again,
            updFile,
            format
        }
    }
}
</script>

<style lang="scss" scoped>
.importOrder {
    :deep(.el-tabs__item){
        font-size: 16px;
    }
    :deep(.el-dialog__body){
        padding-top: 10px;
    }
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
    .error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .success {
            color: #1890ff;
        }
        .error {
            color: #ff3b30;
        }
    }
}


</style>
