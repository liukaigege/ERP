<!--
 * @Descripttion: 导入发货
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 15:31:33
-->

<template>
  <div class="importOrder">
      <el-dialog
          title="导入店小秘订单"
          v-model="dialogVisible"
          :width="width"
          @close="close"
          :close-on-click-modal="false"
		  :close-on-press-escape="false"
      >
          <div v-if="!runType">

              <UploadFile
                  ref="updFile"
                  @success="getFileList"
                  :data="fileList"
                  :before-upload="beforeUpload"
                  :moduleName="'dianxm'"
                  accept=".xls,.xlsx"
                  @remove="remove"
              >
                  <template v-slot:download>
                      <el-button
                          type="text"
                          style="margin-left: 20px"
                          @click="downloadFile(templatePath)"
                          > 下载模板</el-button
                      >
                  </template>
              </UploadFile>

              <p>{{ successMsg }}</p>

           
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
import { deliveryDXM,runDXM } from '@/api/order/orderProcessing.js'
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
          default: '40%'
      }
  },
  setup(props, context) {
      const { proxy } = getCurrentInstance()
    
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
          isDisabled:true,
          templatePath:
              'https://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/import_dxm_template.xlsx'
      })

         const beforeUpload = file => {
      let arr = file.name.split('.')
      const fileType = arr[arr.length - 1]
      if (fileType !== 'xls' && fileType !== 'xlsx') {
        ElMessage.warning({
          message: '请上传符合格式要求的后缀为xls或xlsx文件'
        })
        return false
      }
    }

      const dialogHandOk = () => {
          if (!data.uuid) {
              proxy.$message.error('请上传文件')
              return
          }
          data.runType = true
          progress(data.uuid)
          const param = {
              uuid: data.uuid
          }
          runDXM(param)
              .then(res => {
                  if (res.code == 200) {
                    console.log(JSON.parse(res.data))
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
                    proxy.$parent.init(1)
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
          setTimeout(()=>{
            proxy.$parent.showImport = false
          },500)
      }
      const cancel = () => {
          proxy.$parent.dialogVisible = false
          data.fileList = []
          data.successMsg = ''
          data.uuid = ''
          data.activeType = '1'
          setTimeout(()=>{
            proxy.$parent.showImport = false
          },500)
      }

      const getFileList = val => {
          data.fileList = [val]
          data.successMsg = ''
          data.uuid = ''
          const { fileUrl } = val
          deliveryDXM({ fileUrl })
              .then(res => {
                  if (res.code == 200) {
                      console.log(JSON.parse(res.data))
                      const { msg, uuid,flag } = JSON.parse(res.data)
                      data.isDisabled = !flag
                      data.successMsg = msg
                      data.uuid = uuid
                  }
                  if (res.code == 200602) {
                      console.log(JSON.parse(res.data))
                      data.successMsg = JSON.parse(res.data).msg
                  }
              })
              .catch(err => {
                  data.fileList = []
                  // updFile.value.upd.clearFiles()
                  
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
          data.isDisabled = true
          data.uuid = ''
          data.msg = ''
      }
      const format = (percentage) => (percentage === 100 ? '完成' : `${percentage}%`);
      onMounted(() => {
          console.log(updFile)
      })


      const remove = val =>{
          data.successMsg = ''
          data.fileList= []
          data.uuid = ''
          data.isDisabled = true
      }

      return {
          ...toRefs(data),
          dialogHandOk,
          cancel,
          close,
          getFileList,
          changeActive,
          again,
          updFile,
          format,
          beforeUpload,
          remove
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
