<template>
<div>
  <erpNav :title="title" :routeOpt="{name:'storeManagement'}" />
  <div class="container">
    <component :is="templateName" ref="templateRef" :backRoute="back" />
  </div>
  <div class="flex-pagination page-fixed">
    <div></div>
    <div>
      <el-button size="default" @click="back">取消</el-button>
      <el-button type="primary" size="default" @click="submit">确定</el-button>
    </div>
  </div>
</div>
</template>

<script>
batchPackageRenewal
import erpNav from '@/components/erpNav/index.vue'
import batchDomainRenewal from './components/batchDomainRenewal.vue'
import batchDomainChange from './components/batchDomainChange.vue'
import batchPackageRenewal from './components/batchPackageRenewal.vue'
import batchPackageChange from './components/batchPackageChange.vue'
import batchPluginRenewal from './components/batchPluginRenewal.vue'
import batchPluginChange from './components/batchPluginChange.vue'

import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, toRefs } from 'vue'
export default {
  name: 'batchEditShop',
  components: {
    erpNav,
    batchDomainRenewal,
    batchDomainChange,
    batchPackageRenewal,
    batchPackageChange,
    batchPluginRenewal,
    batchPluginChange
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      title: '',
      templateName: 'batchDomainRenewal',
      templateRef: null
    })
    onMounted(() => {
      let value = route.query.value.split(',')
      console.log(value);
      state.title = value[0]
      state.templateName = value[1]
    })

    function back() {
      router.push({
        name: 'storeManagement'
      })
    }

    function submit() {
      state.templateRef.submit()
    }
  
    return {
      ...toRefs(state),
      back,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 5px;
  margin-bottom: 60px;
  padding: 14px;
  background-color: #fff;
}
</style>
