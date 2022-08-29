<!--
 * @Descripttion: 'exportCSV.vue'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="exportOrderView" v-if="exportShow">
    <el-dialog
      title="导出店铺"
      v-model="exportShow"
      width="1098px"
      :close-on-click-modal="closeModal"
      :before-close="closeExportView"
    >
      <ExportTable :list="list" @getTableData="getTableData" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"  @click="exportFn"
            >导 出</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, toRaw } from 'vue'
import ExportTable from '@/components/exportTable/index.vue'
export default {
  components: { ExportTable },
  setup() {
    const state = reactive({
      closeModal: false,
      exportShow: true,
      list: [
        {
          title: '基本信息',
          checkAll: false,
          children: [
            {
              title: '店铺名称',
              checked: false
            },
            {
              title: '店铺ID',
              checked: false
            },
            {
              title: '所属平台',
              checked: false
            },
            {
              title: '后台域名',
              checked: false
            },
            {
              title: '使用者',
              checked: false
            },
            {
              title: '使用者使时间',
              checked: false
            },
            {
              title: '使用者停时间',
              checked: false
            },
            {
              title: '订单总额(美元)',
              checked: false
            },
            {
              title: '发货仓库',
              checked: false
            },
            {
              title: '店铺状态',
              checked: false
            },
            {
              title: '开店时间',
              checked: false
            },
            {
              title: '订单总额(美元)',
              checked: false
            }
          ]
        },
        {
          title: '开支信息',
          checkAll: false,
          children: [
            {
              title: '域名',
              checked: false
            },
            {
              title: '域名有效期',
              checked: false
            },
            {
              title: '域名更改/续费时间',
              checked: false
            },
            {
              title: '域名费用',
              checked: false
            },
            {
              title: '平台套餐',
              checked: false
            },
            {
              title: '套餐有效期',
              checked: false
            },
            {
              title: '插件购买/续费时间',
              checked: false
            },
            {
              title: '订单总额(美元)',
              checked: false
            },
            {
              title: '发货仓库',
              checked: false
            },
            {
              title: '店铺状态',
              checked: false
            },
            {
              title: '开店时间',
              checked: false
            },
            {
              title: 'PayPal停使用时间',
              checked: false
            },
            {
              title: 'Alipay使用时间',
              checked: false
            },
            {
              title: 'Payssion手续费',
              checked: false
            },
            {
              title: 'Alipay手续费',
              checked: false
            },
            {
              title: 'Payssion停用时间',
              checked: false
            }
          ]
        }
      ],
      exportData:{
          searchData:{},
          tableList:[]
      }
    })
    function closeExportView() {
      state.exportShow = false
    }

    function getTableData(data) {
      console.log('获取表格数据', toRaw(data))
      state.exportData.tableList = data
    }

    function exportFn(){}
    return {
      ...toRefs(state),
      closeExportView,
      getTableData,
      exportFn
    }
  }
}
</script>
<style lang="scss" scoped>
</style>