<template>
<div class="addStoreBox">
  <div class="box">
    <!-- 基本信息 -->
    <StoreInfo :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <!-- 域名开支 -->
    <DomainExpenses :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <!-- 平台开支 -->
    <PlatformExpenses :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <!-- 差价开支 -->
    <UnitExpenses :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <!-- 收款方式 -->
    <PaymentMethod :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <!-- 税务设置 -->
    <TaxSettings :is_Submit="submitSwich" @submitStatus="submitStatus" :isResetShop="isResetShop" />
    <div class="flex-pagination page-fixed">
      <div></div>
      <div>
        <el-button  @click="resetShop">取消</el-button>
        <el-button type="primary"  @click="submit">确定</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import StoreInfo from './components/StoreInfo.vue'
import DomainExpenses from './components/DomainExpenses.vue'
import PlatformExpenses from './components/PlatformExpenses.vue'
import UnitExpenses from './components/UnitExpenses.vue'
import PaymentMethod from './components/PaymentMethod.vue'
import TaxSettings from './components/TaxSettings.vue'
import { reactive, toRefs, watch } from 'vue'
import { shopOpenShop } from '@/api/goods/shop.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'addStore',
  components: { StoreInfo, DomainExpenses, PlatformExpenses, UnitExpenses, PaymentMethod, TaxSettings },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      submitSwich: false,
      isResetShop: false,
      data: {
        storeInfo: '', // 基本信息
        domain: '', // 域名
        platform: '', //平台
        payment: '', // 支付
        unit: '', // 插件
        tax: '', // 税务
      }
    })

    function submit() {
      state.data = {
        storeInfo: '', // 基本信息
        domain: '', // 域名
        platform: '', //平台
        payment: '', // 支付
        unit: '', // 插件
        tax: '', // 税务
      }
      state.submitSwich = true
      setTimeout(() => {
        state.submitSwich = false
      }, 200);
    }

    function submitStatus(key, data) {
      // 判断当前所有表单是否可以提交

      state.data[key] = data
      let flag = true
      for (let i in state.data) {
        if (!state.data[i]) {
          flag = false
        }
      }
      if (flag) {
        let obj = {
          ...state.data.storeInfo,
          shopDomain: state.data.domain,
          shopPlatter: state.data.platform,
          shopPlugin: state.data.unit,
          creditCard: state.data.payment.creditCard,
          paypal: state.data.payment.paypal,
          location: state.data.payment.location,
          ...state.data.tax
        }
        shopOpenShop(obj).then(res => {
          ElMessage.success('店铺开通成功')
          setTimeout(() => {
            const routerHistory = store.state.com.routerHistory
            const item = routerHistory.find(r => r.path === route.path)
            store.commit('com/delRouterHistory', item)
            router.push({
              name: 'storeManagement'
            })
          }, 500)
        })

      }

    }

    function resetShop() {
      ElMessageBox.confirm(
        '确定取消创建店铺?',
        '取消创建店铺', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
        }
      ).then(res => {
        state.isResetShop = true
        setTimeout(() => state.isResetShop = false, 100)
      })
    }

    return {
      ...toRefs(state),
      submit,
      submitStatus,
      resetShop,
    }
  }
}
</script>

<style lang="scss" scoped>
.addStoreBox {
  ::v-deep(.box) {
    padding-bottom: 45px;

    .el-card {
      border: unset;
    }

    .flex-form-item {
      display: flex;
      justify-content: space-between;
      padding: 0 180px;
    }

    .card-header {
      font-size: 16px;
    }

    .w310 {
      width: 310px;
    }

    .w204 {
      width: 204px;
    }

    .w98 {
      width: 98px;
      margin-left: 8px;
      text-align: center;
    }

    .box-card {
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
    }

    .float-right {
      position: absolute;
      right: -190px;
      font-size: 16px;
      color: #fd4c60;
    }
  }
}
</style>
