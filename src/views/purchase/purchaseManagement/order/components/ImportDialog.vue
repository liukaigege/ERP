<template>
  <el-dialog title="导入订货单" :close-on-click-modal="false" :close-on-press-escape="false" :width="600" v-model="showDialog" @close="closeDialog(false)">
    <el-form v-show="!showSecondStep">
      <el-form-item label="订货厂家:" required>
        <el-select filterable  v-model="selectId" placeholder="订货厂家">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <upload-file ref="uploadRef" accept=".xls,.xlsx" :before-upload="beforeUpload" @success="uploadSuccess" @remove="removeFile" :disabled="disabledUpload" class="flex-div" moduleName="purchase" button-text="上传订货单" tip="">
        <template #download>
          <el-button class="ml-20"  type="text" @click="downloadByUrl(tplUrl)">下载订货单模版</el-button>
        </template>
      </upload-file>
      <div v-if="message" class="mt-20" :class="message.split('$=')[0] === 'success' ? 'color-success' : 'color-danger'">
        {{ message.split('$=')[1] }}
      </div>
    </el-form>
    <div v-show="showSecondStep">
      <div class="mt-20">
        <div>表格上传</div>
        <el-progress class="mt-5" status="success" :percentage="100"></el-progress>
      </div>
      <div class="mt-20">
        <div>数据校验</div>
        <el-progress v-if="progressStatus" class="mt-5" :percentage="percentage" :status="progressStatus"></el-progress>
        <el-progress v-else class="mt-5" :percentage="percentage"></el-progress>
        <template v-if="errorExcelUrl">
          <div class="mt-10 flex-justify-space">
            <div :class="`color-${progressStatus}`">{{ description }}</div>
            <el-button type="text" @click="downloadByUrl(errorExcelUrl)">下载文档</el-button>
          </div>
          <div class="mt-10">{{ errorMsg }}</div>
        </template>
      </div>
    </div>
    <template #footer>
      <div class="justify-end-div" v-show="!showSecondStep">
        <el-button  @click="closeDialog(false)">取消</el-button>
        <el-button  :disabled="disabledButton" type="primary" @click="uploadSubmit">确认</el-button>
      </div>
      <div class="justify-end-div" v-show="showSecondStep">
        <el-button  @click="closeDialog(false)">取消</el-button>
        <el-button  type="primary" @click="upAgain">重新上传</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs, watch } from 'vue'
import { uploadImportOrder, importOrder } from '@/api/purchase/purchase.js'
import { progressInfo } from '@/api/basic.js'
import UploadFile from '@/components/uploadFile/index.vue'

export default {
  components: { UploadFile },
  emits: ['closeDialog'],
  props: {
    suppliers: { // 订货厂家
      type: Array,
      default: []
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    let progressTimer = null
    const uploadRef = ref(null)
    const data = reactive({
      showDialog: true,
      options: props.suppliers,
      selectId: null,
      path: null,
      uuid: null,
      message: null,
      disabledButton: false,
      disabledUpload: false,
      percentage: 0,
      description: null,
      progressStatus: null,
      showSecondStep: false,
      errorExcelUrl: null,
      errorMsg: null,
      tplUrl: 'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/orders_indent_template.xlsx'
    })

    const closeDialog = flag => {
      progressTimer && clearInterval(progressTimer)
      context.emit('closeDialog', flag)
    }

    const getProgress = uuid => {
      progressInfo(uuid).then(r => {
        const response = r.data
        if (typeof response !== 'String') {
          data.percentage = response.percent
          if (data.progressStatus !== null) {
            data.percentage = 100
          } else {
            if (response.percent === 100) {
              data.progressStatus = 'success'
              data.description = '导入成功'
            } else {
              data.progressStatus = null
              data.description = null
            }
          }

        }
      })
    }

    const beforeUpload = file => {
      // 取数组最后一个索引
      const arr = file.name.split('.')
      const fileType = arr[arr.length - 1]
      if (fileType !== 'xls' && fileType !== 'xlsx') {
        proxy.$message.error({ message: '请上传符合格式要求(xls,xlsx)的文件' })
        return false
      }
      data.disabledButton = true
      data.disabledUpload = true
      data.message = null
    }

    const uploadSuccess = e => {
      data.path = e.fileUrl
      uploadImportOrder({
        path: data.path
      }).then(r => {
        const response = r.data || {}
        data.uuid = response.uuid
        data.message = 'success$=上传成功：' + response.msg
        data.disabledButton = !response.result
      }).catch(e => {
        const msgStr = e.message || '上传失败，请稍后重试'
        const upd = uploadRef.value.$refs.upd
        data.message = 'fail$=上传失败：' + msgStr
        upd.clearFiles()
        data.disabledButton = false
      }).finally(_ => {
        data.disabledUpload = false
      })
    }

    const uploadSubmit = () => {
      if (!data.selectId) {
        proxy.$message.error({ message: '请选择厂家' })
        return
      }

      if (!data.path) {
        proxy.$message.error({ message: '请上传文件' })
        return
      }

      if (!data.uuid) {
        proxy.$message.error({ message: '请等待文件上传成功' })
        return
      }

      data.showSecondStep = true

      progressTimer = setInterval(_ => {
        getProgress(data.uuid)
      }, 800)

      importOrder({
        supplierId: data.selectId,
        uuid: data.uuid
      }).then(r => {
        const response = r.data
        if (response.result) {
          data.progressStatus = 'success'
          data.description = '导入成功'
          data.percentage = 100
          proxy.$message.success({ message: '导入订货单成功' })
          setTimeout(_ => {
            closeDialog(true)
          }, 500)
        } else {
          data.percentage = 100
          data.progressStatus = 'exception' // 失败
          data.description = '导入失败'
          data.errorExcelUrl = response.url
          data.errorMsg = response.msg
          proxy.$message.error({ message: '导入订货单失败' })
        }
      }).catch(e => {
        data.percentage = 100
        data.progressStatus = 'exception' // 失败
        data.description = '导入失败'

      }).finally(_ => {
        progressTimer && clearInterval(progressTimer)
        data.disabledButton = false
        data.disabledUpload = false
      })
    }

    const removeFile = e => {
      data.path = null
      data.uuid = null
      data.message = null
    }

    const upAgain = _ => {
      removeFile()
      data.description = null
      data.percentage = 0
      data.progressStatus = null
      data.errorExcelUrl = null
      data.errorMsg = null
      const upd = uploadRef.value.$refs.upd
      upd.clearFiles()
      data.showSecondStep = false
    }

    const downloadByUrl = url => {
      window.open(url, '_self')
    }

    return {
      ...toRefs(data),
      closeDialog,
      beforeUpload,
      uploadSuccess,
      uploadSubmit,
      removeFile,
      downloadByUrl,
      uploadRef,
      upAgain
    }
  }
}
</script>

<style lang="scss" scoped>
.justify-end-div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.flex-justify-space {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
}
</style>
