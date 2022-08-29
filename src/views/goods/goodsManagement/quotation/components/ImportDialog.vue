<template>
  <el-dialog v-model="show" :title="`导入${type === 'purchase' ? '采购' : '物流'}信息`" width="800px" @close="closeDialog(false)" :close-on-click-modal="false" :close-on-press-escape="false">
    <template v-if="!secondStep">
      <upload-file accept=".xls,.xlsx" :before-upload="beforeUpload" @success="uploadSuccess" @remove="removeFile" :disabled="disabledUpload" class="flex-div" moduleName="puhTemplate" :button-text="fileUrl ? '重新选择导入文件' : '选择导入文件'" tip="">
      </upload-file>
      <div class="mt-10" v-if="type === 'purchase'">导入文件内的商品会覆盖采购报价的列表内同一商品的采购信息，包括重量、长、宽、高、默认采购价和采购链接</div>
      <div class="mt-10" v-else>导入文件内的商品会覆盖物流报价列表内同一商品的运费信息和报关信息</div>
      <div class="mt-10 color-danger">导入的商品ID请勿修改，否则导入失败</div>
    </template>
    <template v-else>
      <el-progress class="mt-20" :percentage="percentage"></el-progress>
      <div class="mt-10" v-if="description">状态：<span class="color-success">{{description}}</span></div>
      <div class="mt-10" v-if="msg">处理详情：总共{{nums.total}}条，<span class="color-success">成功{{nums.success}}条</span>，<span class="color-danger">失败{{nums.error}}条</span></div>
      <el-table v-if="tableData" class="mt-10" :data="tableData" border :max-height="400">
        <el-table-column align="center" prop="skuId" label="SKUID"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称" width="400px"></el-table-column>
        <el-table-column align="center" prop="reason" label="失败原因"></el-table-column>
      </el-table>
    </template>
    <template #footer>
      <div class="justify-end-div">
        <el-button v-if="!secondStep"  @click="closeDialog(false)">取消</el-button>
        <el-button v-if="secondStep"  @click="closeDialog(true)">关闭</el-button>
        <el-button v-if="!secondStep"  :disabled="disabledButton" type="primary" @click="importFile">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import UploadFile from '@/components/uploadFile/index.vue'
import { purchaseImport, logisticsImport } from '@/api/goods/quotation.js'
import { progressInfo } from '@/api/basic.js'
import { ElMessage } from 'element-plus'

export default {
  props: ['type'],
  emits: ['close'],
  components: { UploadFile },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      fileUrl: null,
      disabledUpload: false,
      disabledButton: true,
      secondStep: false,
      uuid: null,
      progressTimer: null,
      percentage: 0,
      description: null,
      msg: null,
      tableData: null,
      nums: {
        error: 0,
        success: 0,
        total: 0
      }
    })

    function beforeUpload(file) {
      const arr = file.name.split('.')
      const fileType = arr[arr.length - 1]
      if (fileType !== 'xls' && fileType !== 'xlsx') {
        proxy.$message.error({ message: '请上传符合格式要求(xls,xlsx)的文件' })
        return false
      }
      state.disabledUpload = true
      state.disabledButton = true
    }

    function uploadSuccess(e) {
      state.fileUrl = e.fileUrl
      state.disabledUpload = false
      state.disabledButton = false
    }

    function removeFile(e) {
      state.fileUrl = null
      state.disabledButton = true
    }

    function closeDialog(refresh) {
      ctx.emit('close', refresh)
    }

    function createUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }

    function importFile() {
      state.secondStep = true
      state.uuid = createUUID()
      const { fileUrl, uuid } = state
      state.progressTimer = setInterval(_ => {
        getProgress(uuid)
      }, 800)
      const fun = props.type === 'purchase' ? purchaseImport : logisticsImport
      fun({ fileUrl, uuid }).then(r => {
        state.percentage = 100
        state.description = '已完成'
        state.msg = r.data.msg
        state.nums = Object.assign(state.nums, r.data)
        state.tableData = r.data.data
      }).catch(e => {
     
        state.secondStep = false
        state.fileUrl = null
        state.percentage = 0
        state.description = null
        state.msg = null
        state.tableData = null
      }).finally(_ => {
        state.progressTimer && clearInterval(state.progressTimer)
      })
    }

    function getProgress(uuid) {
      progressInfo(uuid).then(r => {
        const response = r.data
        if (typeof response !== 'String') {
          state.percentage = response.percent
        }
      })
    }

    return {
      ...toRefs(state),
      beforeUpload,
      uploadSuccess,
      removeFile,
      closeDialog,
      importFile
    }
  },
}
</script>