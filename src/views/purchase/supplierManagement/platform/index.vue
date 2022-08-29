<template>
  <div class="platform-index">
    <div class="platform-index-top">
      <div class="title">平台</div>
      <div class="info">
        <div @click="platformType = 1" class="platform-item" :class="platformType === 1 ? 'active' : ''">
          <img class="platform-icon" src="@/assets/image/platform/1688.png" alt="">
          <img class="right-icon" src="@/assets/image/platform/right.png" alt="">
        </div>
      </div>
    </div>
    <div class="platform-index-btn">
      <el-button v-permission="'platform:btn:add'"  type="primary" @click="showAddDialog = true">添加授权</el-button>
    </div>
    <div class="platform-index-table">
      <el-table border :data="tableData">
        <el-table-column align="center" label="账号名称" prop="accountName" min-width="300"></el-table-column>
        <!-- <el-table-column align="center" label="1688ID" prop="appKey"></el-table-column> -->
        <el-table-column align="center" label="操作" width="100">
          <template #default="{ row }">
            <el-button v-permission="'platform:btn:delete'" type="text" class="color-danger" @click="deleteAccount(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-dialog v-if="showAddDialog" :type="platformType" @close="closeDialog"></add-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAccountList, del } from '@/api/purchase/platform.js'
import AddDialog from './components/AddDialog.vue'

export default {
  components: { AddDialog },
  setup() {
    const state = reactive({
      tableData: [],
      showAddDialog: false,
      platformType: 1
    })

    function search() {
      getAccountList().then(r => {
        state.tableData = r.data
      })
    }

    search()

    function deleteAccount(id) {
      ElMessageBox.confirm('确认删除此账号吗？').then(_ => {
        // 调用接口删除并刷新列表
        del({ id }).then(_ => {
          ElMessage.success({ message: '删除成功' })
          search()
        })
      })
    }

    function closeDialog(refresh) {
      state.showAddDialog = false
      if (refresh) {
        search()
      }
    }

    return {
      ...toRefs(state),
      deleteAccount,
      closeDialog
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-index-top {
  background: #fff;
  border-radius: 2px;
  .title {
    font-size: 16px;
    padding: 15px 30px;
    border-bottom: 1px solid #e9e9e9;
  }
  .info {
    display: flex;
    padding: 15px 30px;
    .platform-item {
      width: 160px;
      height: 46px;
      border: 1px solid #e9e9e9;
      border-radius: 2px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .platform-icon {
        width: 62px;
        height: 22px;
      }
      .right-icon {
        position: absolute;
        display: none;
        width: 37px;
        height: 37px;
        right: 0;
        bottom: 0;
      }
      &.active {
        border-color: #1890ff;
        .right-icon {
          display: block;
        }
      }
    }
    .platform-item + .platform-item {
      margin-left: 20px;
    }
  }
}
.platform-index-table {
  background: #fff;
  margin: 15px 0;
}
.platform-index-btn {
  margin: 15px 0;
  text-align: right;
}
</style>