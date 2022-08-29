<template>
  <el-backtop @click="backToTop" :right="10" :bottom="100" />
</template>

<script>
export default {
  setup() {
    function backToTop() {
      const elements = document.querySelectorAll('.vxe-table--body-wrapper.body--wrapper')
      const elements2 = document.querySelectorAll('.el-table--scrollable-y .el-table__body-wrapper')
      // 滚动页面所有vxe-table回到顶部
      if (elements && elements.length) {
        elements.forEach(el => {
          el.scrollTop = 0
        })
      }
      // 滚动页面所有el-table回到顶部
      if (elements2 && elements2.length) {
        elements2.forEach(el => {
          el.scrollTop = 0
        })
      }
    }

    return {
      backToTop
    }
  }
}
</script>

<style lang="scss">
// 加大回到顶部按钮的z-index
.el-backtop {
  z-index: 1005;
}
</style>