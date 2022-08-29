<!--
 * @Descripttion: 'modification 批量修改=>图片'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
 * 已修改弃用此方法
-->

<template>
  <el-dialog
    title="批量修改"
    v-model="showUploadImg"
    width="480px"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="clearfix">
      <span class="fl">图片修改：</span>
      <div class="fl ml">
        <UploadImg
          ref="uploadImgRef"
          :data="[]"
          :limit="1"
          tip="请选择图片"
          @getFileList="getImg"
          @getCompressList="getCompressList"
          :isCompress="true"
        />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button
          
          type="primary"
          @click="clickBtn({ imgUrl, thumbnailUrl }, true)"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import UploadImg from '@/components/uploadImg/index.vue'

import { ElMessage } from 'element-plus'
export default {
  components: { UploadImg },
  emits: ['change', 'cancel'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const state = reactive({
      imgUrl: null,
      thumbnailUrl: null,
      showUploadImg: true
    })
    let uploadImgRef = ref(null)

    function getImg(data) {
      if (data && data.length) state.imgUrl = data[0].fileUrl
    }
    function getCompressList(data) {
      if (data && data.length) state.thumbnailUrl = data[0]
    }
    function clickBtn(val, status) {
      if (status && !state.imgUrl)
        return ElMessage.warning({ message: '请上传图片' })
      val.resolution = null
      context.emit('changeBack', val)
    }
    function close() {
      context.emit('cancel', false)
    }
    function reLoadImage() {
      setTimeout(() => uploadImgRef.value.resert(), 1000)
    }
    reLoadImage()
    onMounted(() => {})

    return {
      ...toRefs(state),
      getImg,
      clickBtn,
      getCompressList,
      close,
      uploadImgRef,
      reLoadImage
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 0 !important;
}
.ml {
  margin-left: 20px;
}
.imgContainer {
}
</style>