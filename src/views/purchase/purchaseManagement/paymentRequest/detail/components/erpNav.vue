<template>
  <div class="erp-nav">
    <div class="nav-title-box">
      <i class="el-icon-arrow-left" @click="goBack" v-if="goBack"></i>
      <i class="el-icon-arrow-left" @click="go" v-else></i>
      <div class="nav-title">{{ title }}</div>
    </div>

    <div class="step-warp">
      <el-steps :active="active" align-center>
        <el-step title="申请付款"></el-step>
        <el-step title="财务审批"></el-step>
        <el-step title="完成付款"></el-step>
      </el-steps>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    routeOpt: {
      type: [String, Object]
    },
    combineType: {
      type: String
    },
    goBack: {
      // 自定义返回按钮操作，传入函数
      type: Function,
      required: false
    }
  },
  setup(props) {
    let store = useStore()
    let router = useRouter()
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const state = reactive({
      active: 0
    })
    function go() {
      router.push(props.routeOpt)
    }
    onMounted(() => {
      switch (Number(props.combineType)) {
        case (0, 1):
          state.active = 1
          break
        case 2:
          state.active = 2
          break
        case 3:
          state.active = 3
          break
      }
    })
    return {
      ...toRefs(state),
      go,
      sideBarWidth
    }
  }
}
</script>
<style lang="scss" scoped>
.erp-empty-box {
  margin-top: -23px;
  height: 75px;
}
.erp-nav {
  background: #fff;
  position: fixed;
  left: v-bind(sideBarWidth);
  right: 0;
  top: 111px;
  transition: left 1s;
  border-top: 1px solid #e8e8e8;
  z-index: 15;
  .nav-title-box {
    height: 75px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .nav-title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    flex-grow: 1;
    padding-right: 40px;
  }
  .el-icon-arrow-left {
    cursor: pointer;
    font-size: 20px;
  }
}
</style>
