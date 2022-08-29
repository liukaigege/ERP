<!--
 * @Descripttion: 'imgBanner 图片轮播'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-07 00:00:00
-->
<template>
  <div class="imgBanner">
    <el-image-viewer
      :url-list="list"
      :initial-index="previwIndex"
      @close="closeImgBanner"
    />
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  props: {
    list: {//图片数据
      type: Array,
      default: []
    },
    previwIndex: {//打开当前图片下标
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const state = reactive({
      data: props.list
    })
    function closeImgBanner() {
      context.emit('close', false)
    }
    return {
      ...toRefs(state),
      closeImgBanner
    }
  }
}
</script>
<style lang="scss" scoped>
</style>