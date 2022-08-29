<template>
<div>
  <el-dialog title="导入对账" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
    <files @success="fileSuccess" @remove="remove">
      <template v-slot:download>
        <el-button type="text" @click.stop="downloadFile(templatePath)">下载模板</el-button>
      </template>
    </files>
    <template #footer>
      <el-button  @click="close">取消</el-button>
      <el-button  type="primary" @click="submit">确定导入</el-button>
    </template>
  </el-dialog>
  <exportResult v-if="exportResultShow" @closeEvent="closeEvent" :percent="percent" :description="description"/>
  
</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import files from '@/components/uploadFile/index.vue'
import exportResult from './exportResult.vue'
import { logisImport } from '../api/api.js'
import { ElMessage } from 'element-plus'
import { getuuid } from '@/utils/tool.js'
import { progressInfo } from '@/api/basic.js'
export default {
  emits: ["closeEvent",'search'],
  components: { files, exportResult },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      templatePath: 'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/import_logistics_reconciliation_template.xlsx',
      exportResultShow: false,
      filePath: null,
      description: undefined,
      percent: 0
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      if (!state.filePath) return ElMessage.error('请上传文件')
      state.uuid = getuuid()
      logisImport({
        filePath: state.filePath,
        uuid: state.uuid
      }).then(res => {
        state.exportResultShow = true
        getProgress()
      })

    }

    function fileSuccess(e) {
      state.filePath = e.fileUrl
      console.log(state.filePath);
    }

    function downloadFile(path) {
      window.open(path,'_self')
    }

    function remove() {
      state.filePath = null
    }
    let time = null
    function getProgress() {
      time = setInterval(() => {
        progressInfo(state.uuid).then(res => {
          try {
            state.description = JSON.parse(res.data.description)
          } catch (error) {
            state.description = undefined
          }
          state.percent = res.data.percent
         if(res.data.percent == 100 || typeof res.data == 'string'){
           ctx.emit('search')
            clearInterval(time)
         }
        })
      }, 800);
    }

    function closeEvent(){
      state.exportResultShow = false
      state.description = {}
      state.percent = 0
      close()
      clearInterval(time)
    }
    return {
      ...toRefs(state),
      close,
      submit,
      fileSuccess,
      downloadFile,
      remove,
      closeEvent
    }
  }
}
</script>

<style>

</style>
