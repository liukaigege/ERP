<template>
  <div class="quotation-page-container">
    <affix-tab>
      <template #tabSlot>
        <el-button v-permission="'purchaseTab:btn'" @click="changeActiveType('purchase')" :class="[activeType === 'purchase' ? 'active' : '', 'switch-tab-item']">
          <div>采购报价</div>
          <div class="tab-num">({{ purchaseNum }})</div>
        </el-button>
        <el-button v-permission="'logisticsTab:btn'" @click="changeActiveType('logistics')" :class="[activeType === 'logistics' ? 'active' : '', 'switch-tab-item']">
          <div>物流报价</div>
          <div class="tab-num">({{ logisticsNum }})</div>
        </el-button>
        <el-button v-permission="'applyTab:btn'" @click="changeActiveType('applyUser')" :class="[activeType === 'applyUser' ? 'active' : '', 'switch-tab-item']">
          <div>申请人</div>
        </el-button>
      </template>
    </affix-tab>
    <div class="mt-20">
      <!-- 采购报价 -->
      <Purchase ref="children" @refresh="getListNum" v-if="activeType === 'purchase'" />
      <!-- 物流报价 -->
      <Logistics ref="children" @refresh="getListNum" v-if="activeType === 'logistics'" />
       <!-- 申请人 -->
      <Apply ref="children" v-if="activeType === 'applyUser'" />
    </div>
  </div>
</template>
<script>
import { onActivated, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store/index.js'
import AffixTab from '@/components/affixTab/index.vue'
import Purchase from './components/purchase.vue'
import Apply from './components/apply.vue'
import Logistics from './components/logistics.vue'
import { quoteListNums } from '@/api/goods/quotation.js'
export default {
  name: 'Quotation',
  components: { AffixTab, Purchase, Logistics, Apply },
  setup() {
    // 权限相关
    const route = useRoute()
    const { authPath } = store.getters
    const state = reactive({
      activeType: null,
      purchaseNum: 0,
      logisticsNum: 0,
      children: null
    })
    setDefaultActiveType()

    function setDefaultActiveType() {
      if (authPath['purchaseTab:btn'] && authPath['logisticsTab:btn']) {
        setPlActiveType()
        return false
      }
      if (authPath['purchaseTab:btn']) {
        state.activeType = 'purchase'
        return false
      }
      if (authPath['logisticsTab:btn']) {
        state.activeType = 'logistics'
        return false
      }
      if (authPath['applyTab:btn']) {
        state.activeType = 'applyUser'
        return false
      }
    }

    function setPlActiveType() {
      if (route.params.goodsStatus === '4') {
        state.activeType = 'logistics'
      } else {
        state.activeType = 'purchase'
      }
    }

    function getListNum() {
      quoteListNums({
        goodsStatus: 2,
      }).then(r => {
        state.purchaseNum = r.data.purchaseNum || 0
        state.logisticsNum = r.data.logisticsNum || 0
      })
    }

    function changeActiveType(type) {
      state.activeType = type
    }

    onActivated(_ => {
      getListNum()
      state.children.search()
    })

    return {
      ...toRefs(state),
      changeActiveType,
      getListNum
    }
  }
}
</script>

<style lang="scss" scoped>
.quotation-page-container {
  padding-bottom: 50px;
}
.switch-tab-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .tab-num {
    color: #ef5644;
    margin-top: 10px;
  }
  &.active {
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;
    .tab-num {
      color: #fff;
    }
  }
}
.switch-tab-item + .switch-tab-item {
  margin-left: 10px;
}
</style>
