<template>
  <el-affix :offset="109" class="affix">
    <div class="tabList">
      <div class="slotView">
        <slot name="tabSlot"></slot>
      </div>
      <a
        :class="ifShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        @click="clickEvent()"
      ></a>
    </div>
  </el-affix>
</template>

<script>
import { reactive, toRefs } from 'vue'
import $ from 'jquery'
export default {
  setup() {
    let state = reactive({
      ifShow: true
    })

    let clickEvent = () => {
      state.ifShow = !state.ifShow
      state.ifShow ? $('.slotView').slideDown() : $('.slotView').slideUp()
    }

    return {
      ...toRefs(state),
      clickEvent
    }
  }
}
</script>

<style lang="scss" scoped>
.affix {
  min-height: 10px !important ;
}
:deep(.el-affix--fixed) {
  height: 10px;
  width: 0px;
  top: 109px;
  z-index: 100;
}
.tabList {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #fff;
  .slotView {
    display: flex;
    font-size: 16px;
  }
  .el-icon-arrow-down,
  .el-icon-arrow-up {
    color: #1890ff;
    font-size: 18px;
    position: absolute;
    right: 62px;
  }
}
</style>