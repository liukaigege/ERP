<template>
  <el-dialog title="导入盘点结果" v-model="dialogVisible" custom-class="import-inventory" width="560px" @close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-form>
      <el-form-item v-if="!runType" class="no-bottom-item">
        <UploadFile ref="updFile" :data="fileList" @success="getFileList" :before-upload="beforeUpload" :moduleName="'dianxm'" accept=".xls,.xlsx" @remove="remove">
        </UploadFile>
      </el-form-item>
      <el-form-item v-if="runType" class="no-bottom-item">
        <el-progress :percentage="percentage" status="success" text-inside :stroke-width="20" style="width:100%"></el-progress>
        <div class="import-message">
          <div class="import-message-detail">
            处理详情：处理总数：{{size}} &nbsp;&nbsp;导入成功：<span style="color:#1890ff" class="success">{{success}}</span>&nbsp;&nbsp;导入失败：<span style="color:#ff3b30" class="error">{{fail}}</span>
          </div>
          <el-button type="text" v-if="fail>0" style="margin-left: 20px" @click="downloadFile(errorFile)">导出失败列表</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="!runType" @click="cancel">取 消</el-button>
        <el-button v-if="!runType" type="primary" @click="dialogHandOk">确定导入</el-button>
        <el-button v-if="runType" type="primary" @click="cancel(true)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/uploadFile/index.vue'
import {
  reactive,
  toRefs,
  ref
} from 'vue'
import { ElMessage } from 'element-plus'
import { getuuid } from '@/utils/tool.js'
import { importInventoryList } from '../composables/api.js'
import { progressInfo } from '@/api/basic.js'
export default {
  components: { UploadFile },
  emits: ['closeEvent'],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    inventoryCheckNumber: {
      type: [String, Number],
      default: 1
    }
  },
  setup(props, ctx) {
    let updFile = ref(null)
    const data = reactive({
      fileList: [],
      runType: false,
      uuid: getuuid(),
      filePath: '',
      errorFile: '',
      percentage: 0,
      size: 0,// 处理条数
      success: 0, // 成功条数
      fail: 0, // 失败条数
    })

    const beforeUpload = file => {
      let arr = file.name.split('.')
      const fileType = arr[arr.length - 1]
      if (fileType !== 'xls' && fileType !== 'xlsx') return ElMessage.warning('请上传符合格式要求的后缀为xls或xlsx文件')
    }

    const dialogHandOk = () => {
      const { uuid, filePath, fileList } = data
      if (!fileList.length) return ElMessage.error('请上传文件')
      const param = {
        uuid,
        filePath,
        inventoryCheckNumber: props.inventoryCheckNumber
      }
      importInventoryList(param)
        .then(res => {
          if (res.code == 200) {
            data.runType = true
            getProgress()
            // const resultData = res.data
            // data.fail = resultData.fail
            // data.success = resultData.success
            // data.size = resultData.size
            // data.errorFile = resultData.url
          }
        })
    }

    const cancel = (refresh = false) => {
      data.fileList = []
      data.filePath = null
      data.activeType = 1
      setTimeout(() => {
        ctx.emit('closeEvent', refresh)
      }, 500)
    }

    const getFileList = val => {
      data.fileList = [val]
      data.filePath = val.fileUrl
    }
  let result;
    let time = null
    function getProgress() {
      time = setInterval(() => {
        progressInfo(data.uuid).then(res => {
          data.percentage = res.data.percent
           const resultData = JSON.parse(res.data.description)
            data.fail = resultData.fail
            data.success = resultData.success
            data.size = resultData.size
            data.errorFile = resultData.url
          if (res.data.percent == 100 || typeof res.data == 'string') {
            clearInterval(time)
          }
        })
      }, 800)
    }

    const remove = val => {
      data.fileList = []
      data.filePath = null
    }
    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      getFileList,
      updFile,
      beforeUpload,
      remove
    }
  }
}
</script>

<style lang="scss" scoped>
.import-inventory {
  ::v-deep(.el-tabs__item) {
    font-size: 16px;
  }
  ::v-deep(.el-dialog__body) {
    padding: 10px 20px;
  }

  .no-bottom-item {
    margin-bottom: 0;
  }
  .red {
    color: #ff3b30;
  }
  .index {
    text-indent: 23px;
  }
  .import-message {
    display: flex;
  }
  .import-message-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
