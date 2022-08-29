<template>
  <div>
    <div class="pageView">
      <el-form :inline="true">
        <el-form-item label="导入文件:">
          <div v-show="ifShow" class="upload-box">
            <UploadFile accept=".xls,.xlsx" @beforeUpload="beforeUpload" @success="success" @remove="removeFile" :button-text="fileUrl ? '重新选择导入文件' : '选择导入文件'" ref="uploadRef"></UploadFile>
            <el-button type="primary" class="submit" :loading="loading" :disabled="!fileUrl" @click="submit" :style="{ 'left': fileUrl ? '158px' : '130px' }">确定</el-button>
          </div>
          <div v-show="!ifShow">
            <el-progress :percentage="percentage" v-if="![0, 100].includes(percentage)" class="my-progress"></el-progress>
            <el-button @click="closeEvent">关闭</el-button>
          </div>
        </el-form-item>
        <el-form-item label="特殊入库:">
          <div class="instore-box">
            <el-input v-model="text" :rows="2" type="text" placeholder="请输入"  clearable />
            <el-button @click="importEvent" type="primary" :disabled="text == ''" :loading="loading2" class="closeBtn">确认入库</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="pageView" style="margin-top: 30px">
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="tableLoading">
        <vxe-column title="创建时间" field="createTime"></vxe-column>
        <vxe-column title="创建人" field="createByName"></vxe-column>
        <vxe-column title="总行数" field="rows"></vxe-column>
        <vxe-column title="文件地址">
          <template #default="{ row }">
            <el-tooltip placement="top" :offset="10">
              <template #content>
                <a style="color: #fff" v-copy="row.url">复制</a>
              </template>
              <a :href="row.url" class="textOverflow_2" :title="row.url" target >{{row.url}}</a>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column title="PDF地址" field="localUrl">
          <template #default="{ row }">
            <el-tooltip placement="top" :offset="10">
              <template #content>
                <a style="color: #fff" v-copy="row.localUrl">复制</a>
              </template>
              <a :href="row.localUrl" class="textOverflow_2" :title="row.localUrl" target="_blank">{{row.localUrl}}</a>
            </el-tooltip>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <ErpPage :total="purchaseTotalCount" :pageSizes="[10, 20, 300, 500, 1000]" @updateData="updateDataPurchase" />
  </div>
</template>

<script setup>
  import { onMounted, reactive, toRefs, ref } from "vue";
  import UploadFile from "@/components/uploadFile/index.vue";
  import { importInventoryData, pageQueryList, writeInventoryData } from '@/api/store.js'
  import { ElMessage } from 'element-plus'
  import ErpPage from '@/components/erpPage/index.vue'
  import { basicProgress } from '@/api/purchase/purchase.js'
  let state = reactive({
    fileUrl: '',
    loading: false,
    loading2: false,
    tableData: [],
    tableLoading: false,
    tableOptions: {
      border: true,
      autoResize: true,
      keepSource: true,
      align: 'center',
      highlightHoverRow: true,
      scrollY: { enabled: false },
    },
    purchaseTotalCount: 0,
    form: {
      page: {
        pageNo: 1,
        pageSize: 10
      }
    },
    percentage: 0,
    ifShow: true,
    timer: null,
    text: ''
  })

  let uploadRef = ref(null)

  function getTableData () {
    state.tableLoading = true
    pageQueryList(state.form).then(res => {
      state.tableLoading = false
      if (res.code == 200) {
        state.tableData = res.data.dataList
        state.purchaseTotalCount = res.data.page.totalCount
      }
    }).catch(() => {
      state.tableLoading = false
    })
  }
  function updateDataPurchase (page) {
    state.form.page = page
    getTableData()
  }

  function beforeUpload () {
    const arr = file.name.split('.')
    const fileType = arr[arr.length - 1]
    if (fileType !== 'xls' && fileType !== 'xlsx') {
      ElMessage.error({ message: '请上传符合格式要求(xls,xlsx)的文件' })
      return false
    }
  }

  function success (value) {
    state.fileUrl = value.fileUrl
  }

  function removeFile () {
    state.fileUrl = ''
  }

  function getBasicProgress (uuid) {
    basicProgress({ uuid }).then(res =>{
      if (res.code == 200) {
        state.percentage = res.data.percent
        if (res.data.percent == 100) {
          state.loading = false
          clearInterval(state.timer)
          window.open(res.data.url)
          getTableData()
          state.ifShow = true
          uploadRef.value.clearFiles()
          state.fileUrl = ''
          ElMessage.success({ message: '导入成功！', type: 'success' })
        }
      } else {
        state.loading = false
        clearInterval(state.timer)
        ElMessage.error(res.message)
      }
    }).catch(err => {
      state.loading = false
      clearInterval(state.timer)
    })
  }

  function submit () {
    state.loading = true
    state.ifShow = false
    importInventoryData({ fileUrl: state.fileUrl }).then(res => {
      state.loading = false
      if (res.code == 200) {
        state.timer = setInterval(() => {
          getBasicProgress(JSON.parse(res.data).uuid)
        }, 500)
      }
    }).catch(() => {
      state.loading = false
      state.ifShow = true
    })
  }

  function closeEvent () {
    state.ifShow = true
    state.percentage = 0
    clearInterval(state.timer)
  }

  function importEvent () {
    state.loading2 = true
    writeInventoryData({ skuIdStr: state.text }).then(res => {
      state.loading2 = false
      if (res.code == 200) {
        window.open(res.data)
        ElMessage.success({ message: '入库成功！', type: 'success' })
        state.text = ''
        getTableData()
      } else {
        ElMessage.error(res.message)
      }
    }).catch(() => {
      state.loading2 = false
    })
  }

  onMounted(() => {
    getTableData()
  })

  const { fileUrl, loading, loading2, tableData, tableLoading, tableOptions, purchaseTotalCount, form, percentage, ifShow, text } = toRefs(state)
</script>

<style lang="scss">
  .pageView{
    .el-form{
      display: flex;
      align-items: flex-start;
    }
    .el-form-item{
      margin-bottom: 0;
      .upload-progress-box{
        margin-bottom: 10px
      }
      .upload-box{
        position: relative;
        .submit {
          position: absolute;
          top: 1.2px;
        }
      }
      .instore-box{
        display: flex;
        .closeBtn{
          margin-left: 16px;
        }
      }
    }
    .my-progress{
      width: 200px;
      margin: 10px 0;
    }
    .el-input {
      margin-bottom: 15px;
    }
  }
</style>