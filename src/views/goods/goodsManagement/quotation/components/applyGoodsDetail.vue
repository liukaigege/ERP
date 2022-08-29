
<template>
  <div>
    <GoodsInfo type='layList' :combineType="combineType" :editGoodsId="goodsId" @cancel="cancelInfo" />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import GoodsInfo from '@/views/goods/goodsManagement/addGoods/goodsInfo/index.vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ApplyGoodsDetail',
  components: { GoodsInfo },
  setup() {
    const route = useRoute()
    const router = useRouter()
    let state = reactive({
      goodsId: route.query.id,
      combineType: Number(route.query.type) // 1 单品 2 组合品 Number类型
    })
    const cancelInfo = () => {
      state.goodsId = null
      state.combineType = null
      router.go(-1)
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