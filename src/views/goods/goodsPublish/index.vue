<!--
 * @Descripttion: 'commodityPublication 商品刊登'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-07 00:00:00
-->
<template>
  <div class="goodsPublish">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品列表" name="0">
          <template #label>
            <el-badge is-dot :hidden="changeRed">商品列表</el-badge>
          </template>
          <GoodsList
            v-if="goodsList"
            @changeRedPoint="changeRedPoint"
            ref="goodsListRef"
          />
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label>
            <el-badge is-dot :hidden="layRed">搁置列表</el-badge>
          </template>
          <PendingList
            v-if="pendingList"
            @changeRedPoint="changeRedPoint"
            ref="pendingListRef"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  onMounted,
  onBeforeMount,
  onActivated,
  onDeactivated,
  nextTick,
  ref
} from 'vue'
import GoodsList from './components/goodsList'
import PendingList from './components/pendingList'
import { cleanRedPoint, redPoint } from '@/api/goods/goodsPublish.js'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: { GoodsList, PendingList },
  name: 'commodityPublication',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      activeName: '0',
      changeRed: true,
      layRed: true,
      goodsList: true,
      pendingList: false,
      type: route.query.type
    })
    const pendingListRef = ref()
    const goodsListRef = ref()
    const handleClick = (tab, event) => {
      state.pendingList = true
    }
    onMounted(() => {
      init()
    })
    onBeforeMount(() => {
      if (state.type == 'layList') {
        state.pendingList = true
        state.activeName = '1'
      }
    })
    const changeRedPoint = () => {
      init()
    }
    function init() {
      redPoint().then(res => {
        if (res.code == 200) {
          state.changeRed = res.data.changeRed == 0
          state.layRed = res.data.layRed == 0
        } else {
          ElMessage.error({ message: res.message })
        }
      })
    }
    let scrollTop = 0
    onActivated(() => {
      state.pendingList
        ? pendingListRef.value.initHook()
        : goodsListRef.value.initHook()
      nextTick(() => {
        document.documentElement.scrollTop = scrollTop
      })
    })
    onDeactivated(() => {
      scrollTop = document.documentElement.scrollTop
    })
    return {
      ...toRefs(state),
      handleClick,
      goodsListRef,
      pendingListRef,
      changeRedPoint
    }
  }
}
</script>
<style lang="scss" scoped>
.goodsPublish {
  .tab .el-tabs {
    padding: 0 !important;
    background: #fff;
  }
  :deep(.el-tabs__item) {
    padding-left: 24px !important;
  }
  :deep(.el-badge__content.is-fixed.is-dot) {
    top: 5px;
    background-color: #ff0000;
  }
}
</style>
