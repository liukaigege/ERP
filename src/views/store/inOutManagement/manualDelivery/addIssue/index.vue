<!--
* @Descripttion: Vango ERP  新建出库单
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
      <Add :inOut="1"  />
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import Add from '../../components/add.vue'
export default {
  components: { Add },
  setup() {
    const state = reactive({
    })

    return {
      ...toRefs(state)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>