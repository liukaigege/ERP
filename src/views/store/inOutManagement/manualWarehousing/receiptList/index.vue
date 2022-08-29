<!--
* @Descripttion: Vango ERP 待入库列表
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div><List :inOut="0"/></div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import List from '../../components/list.vue'
export default {
  components:{ List },
  setup() {
    const state = reactive({})
    return {
      ...toRefs(state)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>