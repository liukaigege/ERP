<template>
  <div>
    <component :is="url" :goodsInfo="goodsInfo" :copyGoodsInfo="copyGoodsInfo" :editGoodsId="id" @cancel="cancel" @refresh="refresh"></component>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddGoodsInfo from '@/views/goods/goodsManagement/addGoods/goodsInfo/index.vue'
import { useStore } from 'vuex'
export default {
  name: 'AddGroupgoods',
  components: {
    AddGoodsInfo
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    let store = useStore()
    let state = reactive({
      url: 'AddGoodsInfo',
      goodsInfo: [],
      copyGoodsInfo: store.getters.copyGoodsInfo,
      id: route.query?.id,
    })

    let cancel = (status) => {
      router.push({
        path: '/goods/goodsManagement/setPrice',
      })
    }
    onMounted(() => {
      state.goodsInfo = store.getters.addGoodsInfo
    })

    return {
      ...toRefs(state),
      cancel
    }
  },
}
</script>
