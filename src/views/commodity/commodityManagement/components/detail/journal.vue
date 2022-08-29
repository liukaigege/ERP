<template>
<div class="journal">
  <el-table :data="data" border stripe>
    <el-table-column prop="content" label="操作内容" align="center"></el-table-column>
    <el-table-column prop="userName" label="操作人" align="center"></el-table-column>
    <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
  </el-table>

</div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { getOperationLog } from '@/api/user.js'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const state = reactive({
      data: []
    })
    onMounted(() => {
      getOperationLog({
        page: {
          pageNo: 1,
          pageSize: 9999
        },
        goodsId: route.query.goodsId
      }).then(res=>{
        state.data = res.data.dataList
      })
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>
.journal {
  padding: 24px;
  background-color: #fff;
}
</style>
