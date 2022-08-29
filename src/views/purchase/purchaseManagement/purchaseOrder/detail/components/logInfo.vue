<template>
  <div class="page">
    <div class="headBox">操作日志</div>
    <div class="contentBox">
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="loading" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column field="content" title="操作内容">
          <template #default="{ row }">
            <div>{{row.content || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="userName" title="操作人">
          <template #default="{ row }">
            <div>{{row.userName || '-'}}</div>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="操作时间">
          <template #default="{ row }">
            <div>{{row.createTime || '-'}}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <ErpPage :total="total" type="static" @updateData="updateData" />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { sysLogList } from '@/api/purchase/purchase.js'
import ErpPage from '@/components/erpPage/index.vue'
import { useRoute } from 'vue-router'
  let route = useRoute()
  let state = reactive({
    tableData: [],
    loading: false,
    form: {
      logType: 3,
      purchaseOrderNumber: route.query.purchaseOrderNumber,
      page: {
        pageNo: 1,
        pageSize: 10
      }
    },
    total: 0
  })
  let tableOptions = {
    border: 'inner',
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true
  }
  let getSysLogList = () => {
    state.loading = true
    sysLogList(state.form).then(res => {
      state.loading = false
      if (res.code == 200) {
        state.tableData = res.data.dataList
        state.total = res.data.page.totalCount
      } else {
        ElMessage.error(res.message)
      }
    }).catch(err => {
      state.loading = false
     
    })
  }
  let updateData = (page) => {
    state.form.page = page
    getSysLogList()
  }
  onMounted(() => {
    getSysLogList()
  })
  let { tableData, loading, total } = toRefs(state)
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