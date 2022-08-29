<!--
 * @Descripttion: 备注
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 14:48:34
-->

<template>
  <div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close">
      <div class="content">
        <UploadFile ref="updFile" :limit="1" @success="getFileList" :data="fileList" :moduleName="'logisticsChange'" accept=".xls, .xlsx">
          <template v-slot:download>
            <el-button type="text" style="margin-left: 20px" @click="downloadFile(templatePath)">下载模板</el-button>
          </template>
        </UploadFile>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="dialogHandOk" :loading="loading">确定导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, inject } from 'vue'
import UploadFile from '@/components/uploadFile/index.vue'
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
    },
    data: {
      type: Object,
      default: null
    },
  },
  setup(props, context) {
    let { proxy } = getCurrentInstance()
    let data = reactive({
      loading: false,
      fileList: []
    })

    let getFileList = () => {

    }

    let dialogHandOk = () => {
    }

    let close = () => {
      proxy.$parent.dialogVisible = false
    }
    let cancel = () => {
      proxy.$parent.dialogVisible = false
    }

    onMounted(() => {
    })
    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      getFileList
    }
  }
}
</script>


<style lang="scss" scoped>
</style>