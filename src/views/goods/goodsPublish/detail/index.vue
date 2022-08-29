
<template>
  <div>
    <GoodsInfo :editGoodsId="goodsId" :type="type" @cancel="cancelInfo" />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import GoodsInfo from '@/views/goods/goodsManagement/addGoods/goodsInfo/index.vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'goodsPublishDeatil',
  components: { GoodsInfo },
  setup() {
    const route = useRoute()
    const router = useRouter()
    let state = reactive({
      goodsId: route.query.id,
      type: route.query.type
    })
    const cancelInfo = val => {
      state.goodsId = null
      router.push({
        path: '../index',
        query: {
          type: val
        }
      })
    }
    return {
      ...toRefs(state),
      cancelInfo
    }
  }
}
</script>

<style>
</style>