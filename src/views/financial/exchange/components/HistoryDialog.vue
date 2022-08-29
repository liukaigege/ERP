<template>
  <el-dialog :title="`${originalCurrency}->${baseCurrency}历史记录`" v-model="showDialog" @close="closeDialog">
    <el-table :data="tableData" border :height="600">
      <el-table-column label="时间段">
        <template #default="scope">
          {{ scope.row.createTime }} ->
          {{ scope.row.endTime ? scope.row.endTime : moment().format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="当时汇率"></el-table-column>
    </el-table>
    <div class="flex-pagination">
      <div></div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
import { getExchangeHistory } from '@/api/financial.js'
import { erpElTable } from 'hooks'

export default {
  emits: ['closeDialog'],
  props: {
    show: { // 显示控制
      type: Boolean,
      default: false
    },
    exchange: { // 表格数据
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const showDialog = ref(props.show)
    const originalCurrency = props.exchange.split('$+')[0]
    const baseCurrency = props.exchange.split('$+')[1]

    const erpElTableOpts = erpElTable(getExchangeHistory, {
      originalCurrency,
      baseCurrency
    }, {
      pagination: {
        pageSizes: [5, 10, 20],
        pageSize: 5
      }
    })

    const closeDialog = () => {
      showDialog.value = false
      context.emit('closeDialog')
    }


    return {
      showDialog,
      closeDialog,
      ...erpElTableOpts,
      originalCurrency,
      baseCurrency,
      moment
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
