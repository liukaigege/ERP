<template>
  <el-affix :offset="109" class="affix">
    <div class="tabList">
      <div class="slotView">
        <slot name="tabSlot"></slot>
      </div>
      <a :class="ifShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="clickEvent()"></a>
    </div>
  </el-affix>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import $ from 'jquery'
export default {
  setup() {
    let state = reactive({
      ifShow: true
    })
    let store = useStore()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)

    let clickEvent = () => {
      state.ifShow = !state.ifShow
      state.ifShow ? $('.slotView').slideDown() : $('.slotView').slideUp()
    }

    return {
      ...toRefs(state),
      clickEvent,
      sideBarWidth
    }
  },
}
</script>

<style lang="scss" scoped>
  .affix{
    width: calc(100% - v-bind(sideBarWidth) - 50) !important;
    min-height: 10px !important;
  }
  .tabList{
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 24px;
    background-color: #fff;
    .slotView{
      width: 100%;
      display: flex;
    }
    .el-icon-arrow-down, .el-icon-arrow-up{
      color: #1890FF;
      font-size: 18px;
      position: absolute;
      right: 36px;
    }
  }
</style>