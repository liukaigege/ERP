<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="viewContainer">
    <el-tabs v-model="activeName" style="background-color: #fff">
      <el-tab-pane label="待审核" name="first"> </el-tab-pane>
      <el-tab-pane label="已审核" name="second"> </el-tab-pane>
    </el-tabs>
    <div class="tableContainer">
      <keep-alive :include="['WaitReview', 'Reviewed']" :exclude="[]">
        <component
          :is="activeName == 'first' ? 'WaitReview' : 'Reviewed'"
          :supplierListData="supplierListData"
          :applyListData="applyListData"
          :isCheckWaitReviewDetail="isCheckWaitReviewDetail"
          ref="listRef"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, ref, onActivated } from 'vue'
import Reviewed from './components/reviewed/index.vue'
import WaitReview from './components/waitReview/index.vue'
import ReviewedDetail from './components/detail/reviewedDetail.vue'
import WaitReviewDetail from './components/detail/waitReviewDetail.vue'
import { supplierList, applyList } from './composables/api'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/tool.js'
import { useRoute } from 'vue-router'
export default {
  name: 'paymentApproval',
  components: {
    Reviewed,
    WaitReview,
    ReviewedDetail,
    WaitReviewDetail
  },
  setup() {
    const route = useRoute()
    let fromIndex = 'first'
    if (route.params.id) fromIndex = route.params.id > 9 ? 'first' : 'second'
    const activeName = route.params.type || fromIndex
    const listRef = ref(null)

    const state = reactive({
      activeName,
      supplierListData: null, //供应商列表
      applyListData: null, //申请人列表
      isCheckWaitReviewDetail: false
    })

    onActivated(() => {
      if (route.params.status) listRef.value.checkExamineList()
			if (route.params.id) state.activeName = route.params.id > 9 ? 'first' : 'second'
    })

    // 获取供应商信息
    supplierList().then(res => {
      if (res.code == 200) {
        state.supplierListData = deepCopy(res.data)
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    // 申请人列表
    applyList().then(res => {
      if (res.code == 200) {
        state.applyListData = deepCopy(res.data)
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    return {
      ...toRefs(state),
      listRef,
    }
  }
}
</script>
<style lang='scss' scoped>
:deep(.el-tabs__nav) {
  box-sizing: border-box;
  padding: 0 20px;
}
.viewContainer {
  padding-bottom: 60px;
  position: relative;
  width: 100%;
  height: 100%;
}
.tableContainer {
  background-color: #fff;
}
</style>
