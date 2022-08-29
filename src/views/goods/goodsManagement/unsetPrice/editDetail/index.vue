<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-10-23 17:40:26
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-23 19:04:29
-->
<template>
  <div>
    <component :is="url" :editGoodsId="goodsId" :combineType="combineType" :type="type" @cancel="cancel" @refresh="refresh"></component>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddGoodsInfo from '@/views/goods/goodsManagement/addGoods/goodsInfo/index.vue'
export default {
  components: {
    AddGoodsInfo
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    let state = reactive({
      url: 'AddGoodsInfo',
      goodsId: route.query.goodsId,
      combineType: +route.query.combineType,
      type: route.query.type
    })
    
    let cancel = (status) => {
      router.push({
        path: '/goods/goodsManagement/unsetPrice',
        query: {
          isRefresh: status ? true : false
        }
      })
    }

    return {
      ...toRefs(state),
      cancel
    }
  },
}
</script>