<template>
<div class="remarksInfo">
  <el-table :data="data" border stripe>
    <el-table-column prop="content" label="内容" align="center">
      <template #default="{row}">
        <p class="text-row" :title="row.content">{{row.content}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="updateTime" label="更新时间" align="center" />
    <el-table-column prop="createTime" label="创建时间" align="center" />
    <el-table-column prop="createUserName" label="创建人" align="center" />
    <el-table-column prop="typeName" label="类型" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="{row}">
        <span style="padding:0 10px;color:#1890FF;cursor: pointer;" @click="editOpen(row)">编辑</span>
        <span style="padding:0 10px;color:#FD4C60;cursor: pointer;" @click="delRow(row.id)">删除</span>
      </template>
    </el-table-column>
  </el-table>
  <addRemarks :data="editRow" v-if="editShow" @closeEvent="editShow=false" @search="search" />
</div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { remarkList, remarkDel } from '@/api/commodity.js'
import { useRoute } from 'vue-router'
import addRemarks from './components/addRemarks.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { addRemarks },
  setup() {
    const route = useRoute()
    const state = reactive({
      data: [],
      editRow: null,
      editShow: false
    })

    onMounted(() => {
      search()
    })

    function search() {
      remarkList({ goodsId: route.query.goodsId }).then(res => {
        state.data = res.data
      })
    }

    function editOpen(row) {
      state.editRow = row
      state.editShow = true
    }

    function delRow(id) {
      ElMessageBox.confirm('是否删除这条备注', '删除备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(() => {
        remarkDel({ id }).then(res => {
          ElMessage.success('删除成功')
          search()
        })
      })
    }
    return {
      ...toRefs(state),
      editOpen,
      search,
      delRow
    }
  }
}
</script>

<style lang="scss" scoped>
.remarksInfo {
  background-color: #fff;
  padding: 24px;
}

.text-row {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
