<template>
<el-dialog title="导入报关信息" v-model="show" width="800px" @close="close" :close-on-click-modal="false">
  <div v-if="!isSubmit">
    <uploadFile @success="getFileList" @remove="remove" />
    <p>导入文件内的商品会覆盖已报价列表内同一商品的报关信息</p><br />
    <p style="color:red">导入的商品ID请勿修改，否则导入失败</p>
  </div>
  <div v-else>
    <el-progress :percentage="progressData.percent" color="#67c23a" :stroke-width="12" />
    <div>
      <br>
      <p>状态：<span style="color:#67c23a">{{progressData.description || '正在处理'}}</span> </p>
      <br>
      <div v-if="isInfo">
        <p>处理详情：总共{{progressData.errorData?.successCount + progressData.errorData?.list?.length}}条，<span style="color:#67c23a">成功{{progressData.errorData?.successCount}}条</span> ，<span style="color:red">失败{{progressData.errorData?.list?.length}}条</span> </p>
        <el-table :data=" progressData.errorData?.list || []" max-height="450px">
          <el-table-column prop="skuId" label="SKUID" width="200px" align="center"></el-table-column>
          <el-table-column prop="goodsNameCn" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="error" label="失败原因" width="200px" align="center"></el-table-column>
        </el-table>

      </div>
    </div>
  </div>
  <template #footer>
    <el-button @click="close">{{isSubmit?"取消":"关闭"}}</el-button>
    <el-button type="primary" @click="submit" v-if="!isSubmit">确认</el-button>
  </template>
</el-dialog>
</template>

<script>
import uploadFile from '@/components/uploadFile/index.vue'
import { reactive, toRefs } from 'vue'
import { progressInfo } from '@/api/basic.js'
import { ElMessage } from 'element-plus'
import { goodsCustomsUpload, goodsCustomsSave } from '@/api/goods/quotedPrice.js'
export default {
  components: { uploadFile },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      fileUrl: null,
      isSubmit: false,
      uuid: null,
      progressData: {},
      isInfo: false
    })

    function close() {
      state.show = false
      setTimeout(() => {
        console.log(1111);
        ctx.emit('closeEvent')
        if (time) clearInterval(time)
      }, 500);
    }

    function submit() {
      if (!state.fileUrl) return ElMessage.error('请上传文件')
      upFile()
    }

    const getFileList = (file) => state.fileUrl = file.fileUrl

    function remove() {
      state.fileUrl = null
    }

    async function upFile() {
      // 等待接口
      const { data: { uuid } } = await goodsCustomsUpload({ fileUrl: state.fileUrl })
      goodsCustomsSave({ uuid }).then(res => {
        state.isSubmit = true
        timeLoop(uuid)
      })

    }

    let time = null

    function timeLoop(uuid) {
      time = setInterval(() => {
        progressInfo(uuid).then(res => {
          state.progressData = res.data
          if (state.progressData.errorCode != 0 || state.progressData.percent == 100) {
            state.isInfo = true
            clearInterval(time)
          }
        }).catch(err => {
          close()
        })
      }, 1000)
    }
    return {
      ...toRefs(state),
      close,
      submit,
      getFileList,
      remove
    }
  }
}
</script>

<style>

</style>
