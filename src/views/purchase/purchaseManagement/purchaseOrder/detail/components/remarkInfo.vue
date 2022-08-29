<template>
  <div class="page">
    <div class="headBox">
      <div>备注信息</div>
      <el-button type="text" @click="editRemark(0)" :disabled="['0', '1', '2'].includes(route.query.status)">+添加</el-button>
    </div>
    <div class="contentBox">
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="loading" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column field="内容" title="内容" width="350px">
          <template #default="{ row }">
            <div class="textOverflow_2 blue" :title="row.content">{{row.content}}</div>
          </template>
        </vxe-column>
        <vxe-column field="updateTime" title="更新时间"></vxe-column>
        <!-- <vxe-column field="updateByName" title="更新人"></vxe-column> -->
        <vxe-column field="createTime" title="创建时间"></vxe-column>
        <vxe-column field="createByName" title="创建人"></vxe-column>
        <vxe-column field="typeName" title="类型"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button type="text" @click="editRemark(1, row.id)" :disabled="userInfo.fullName !== row.createByName">编辑</el-button>
            <el-button type="text" class="del" @click="del(row.id)" :disabled="userInfo.fullName !== row.createByName">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <Remark v-if="ifShow" :type="type" :remarkId="remarkId" :orderIds="route.query.id" @closeEvent="closeEvent" />
  </div>
</template>

<script setup>
import { reactive, toRefs, shallowReactive, onMounted, computed } from 'vue'
import Remark from './remark.vue'
import { purchaseOrdersRemarks, deleteRemark } from '@/api/purchase/purchase.js'
import { _debounce } from '@/utils/tool.js'
import { useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from 'vuex'
  let store = useStore()
  let userInfo = computed(() => store.state.user.userInfo)
  console.log(userInfo.value)
  let route = useRoute()
  let state = reactive({
    tableData: [],
    loading: false,
    ifShow: false,
    type: 0,
    remarkId: null
  })
  let tableOptions = shallowReactive({
    border: 'inner',
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true
  })
  let editRemark = (type, id) => {
    state.ifShow = true
    state.type = type
    state.remarkId = id
  }
  let getRemarkList = () => {
    let { purchaseOrderNumber } = route.query
    state.loading = true
    purchaseOrdersRemarks({purchaseOrderNumber}).then(res => {
      state.loading = false
      if (res.code == 200) {
        state.tableData = res.data
      } else { 
        ElMessage.error(res.message)
      }
    }).catch(err => {
      state.loading = false
  
    })

  }
  let del = (id) => {
    ElMessageBox.confirm('确认删除此备注?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false
    }).then(() => {
      deleteRemark({ id }).then(res => {
        if (res.code == 200) {
          getRemarkList()
          ElMessage.success({ message: '操作成功！', type: 'success' })
        } else { 
          ElMessage.error(res.message)
        }
      })
    }).catch(() => {})
  }
  let closeEvent = (refresh) => {
    state.ifShow = false
    if (refresh) getRemarkList()
  }
  onMounted(() => {
    getRemarkList()
})
  let { tableData, loading, ifShow, type, remarkId } = toRefs(state)
</script>

<style lang="scss" scoped>
  .page{
    background-color: #fff;
    margin-bottom: 24px;
    border-radius: 2px;
    .headBox{
      padding: 0 24px;
      height: 55px;
      line-height: 55px;
      color: rgba(0,0,0,.85);
      font-size: 16px;
      border-bottom: 1px solid #E9E9E9;
      display: flex;
      justify-content: space-between
    }
    .contentBox{
      padding: 16px 24px;
      .del{
        color: #FD4C60;
      }
    }
  }
  .blue{
    color: #1890FF
  }
  
</style>