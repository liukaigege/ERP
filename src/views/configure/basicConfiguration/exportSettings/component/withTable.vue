<template>
  <div>
    <div class="btnBox">
      <el-button type="primary" @click="deleteRow(delarr)">批量删除</el-button>
      <el-button type="primary" @click=";(isShow = true), (dialogNum = 1)">新增模板</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="{
        background: 'rgb(250, 250, 250)',
        color: '#606266'
      }" @selection-change="handleSelectionChange" class="tableBox">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column prop="name" label="模板名称" width="150"></el-table-column>
      <el-table-column prop="type" label="模板类型" width="155" align="center">
        <template #default="{ row }"> {{ typeSelected(row.type) }} </template>
      </el-table-column>
      <el-table-column prop="nameCnStr" label="字段信息" width="1100px">

      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scoped">
          <div class="editmode">
            <a href="javascript:;" @click="
                ;(isShow = true),
                  (dialogNum = 2),
                  (temp.name = scoped.row.name),
                  (temp.id = scoped.row.id),
                  tempFilterSort(scoped.row, 1)
              ">编辑</a>
            <a href="javascript:;" @click="deleteRow(scoped.row)">删除</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex-pagination page-fixed">
      <div>
        <span @click="selectClick" :style="{
            backgroundColor: delarr.length ? 'rgb(64, 158, 255)' : '#fff',
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '1px solid #eee',
            textAlign: 'center',
            margin: '0 10px'
          }" class="el-icon-check"></span>
        <span :style="{ color: delarr.length ? 'rgb(64, 158, 255)' : 'unset' }">已选择{{ delarr.length }}条</span>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增模板和编辑模板 -->
    <Withdialog :dialogNum="dialogNum" @closeDialog="closeDialog" :temp="temp" :row="rowList" :itemlist="itemlist" :itemArrlist="itemArrlist" v-if="isShow" @getlist="getlist" />
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import Withdialog from './dialog.vue'
import {
  exportTemplateList,
  exportItem,
  exportDel
} from '@/api/order/orderProcessing'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { Withdialog },
  name: 'withTable',
  setup() {
    const state = reactive({
      tableData: [],
      temp: {
        id: '',
        list: [],
        name: '',
        sort: []
      },
      isShow: false,
      dialogNum: 1,
      itemlist: [],
      delid: [],
      delarr: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      itemArrlist: {},
      rowList: {}
    })

    onMounted(() => {
      getExportItem()
    })

    const handleSelectionChange = el => {
      state.delarr = [...el]
      console.log(el)
      console.log(state.delarr)
    }
    const closeDialog = () => {
      state.isShow = false
      state.dialogNum = 1
      state.temp = {}
    }

    const deleteRow = el => {
      let str = ''
      // 判断是否是数组？
      if (Array.isArray(el)) {
        el.forEach(item => {
          state.delid.push(item.id)
        })
        str = '批量'
      } else {
        state.delid.push(el.id)
        str = ''
      }
      // 判断是否选中
      if (state.delid.length == 0) {
        ElMessage.warning('请选择模板')
        return
      }
      // 询问是否删除
      ElMessageBox.confirm(`是否${str}删除`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        const data = { ids: state.delid.join(',') }

        exportDel(data)
          .then(res => {
            getlist()
            ElMessage.success(res.message)
            state.delarr = []
            state.delid = []
          })
          .catch(err => {
            state.delid = []
          })
      })
    }
    const tempFilterSort = (row, column) => {
      const { type, field } = row
      typeListSelected(type)
      let fieldList = [] // 已选中的英文集合
      field.split('|').forEach(item => {
        fieldList.push(...item.split(':')[1].split(','))
      })
      let sortList = []
      let fieldNameList = []
      field.split('|').forEach(item => {
        fieldNameList.push(item.split(':')[0])
      })
      fieldNameList.forEach(item => {
        const curList = state.itemlist.find(val => val.nameEn == item)
				// 按照已选类目排序
        curList.list.sort((a, b) => {
          return fieldList.indexOf(a.nameEn) - fieldList.indexOf(b.nameEn)
        })
        sortList.push(curList)
      })
      sortList.push(...state.itemlist.filter(item => !fieldNameList.includes(item.nameEn)))
      sortList.forEach(item => {
        item.list.forEach(val => {
          val.checkAll = fieldList.includes(val.nameEn)
        })
        let checkT = item.list.filter(v => v.checkAll)
        let checkF = item.list.filter(v => !v.checkAll)
        item.list = [...checkT, ...checkF]
        item.listAll = item.list.filter(v => v.checkAll).map(item => item.nameEn)
        item.checkAll = item.listAll.length == item.list.length
        item.indeterminate = !item.checkAll && Boolean(item.listAll.length)
      })
      state.itemlist = sortList
      state.rowList = row
    }
    // 过滤器
    const tempFilter = (row) => {
      let { type, field } = row
      typeListSelected(type)
      let itemList = []
      state.itemlist.forEach(item => {
        itemList.push(...item.list)
      })
      let fieldList = []
      field.split('|').forEach(item => {
        fieldList.push(...item.split(':')[1].split(','))
      })
      let nameCnList = []
      fieldList.forEach(item => {
        let cn = itemList.find(val => val.nameEn == item)?.nameCn
        if (cn) {
          nameCnList.push(cn)
        }

      })
      row.nameCnStr = nameCnList.join(',')
    }

    // 获取列表事件
    function getlist() {
      const data = {
        page: {
          pageNo: state.currentPage,
          pageSize: state.pageSize
        }
      }
      exportTemplateList(data).then(res => {
        state.tableData = res.data.dataList
        state.total = res.data.page.totalCount
        state.tableData.forEach(item => {
          tempFilter(item)
        })
      })
    }
    // 获取弹出框选项
    function getExportItem() {
      exportItem({ type: state.type }).then(res => {
        state.itemArrlist = ref(res.data)
        getlist()
      })
    }

    const handleSizeChange = e => {
      state.pageSize = e
      state.pageNo = 1
      getlist()
    }

    const handleCurrentChange = e => {
      state.currentPage = e
      getlist()
    }

    function selectClick() {
      if (state.tableData.length)
        document.querySelector('thead .el-checkbox').click()
    }

    const typeSelected = val => {
      // getExportItem(val)
      switch (val) {
        case 1:
          return '标准订单'
        case 2:
          return '商品开发已报价'
        case 3:
          return '商品管理'
        case 4:
          return '缺货采购'
        case 5:
          return '采购订单'
        case 6:
          return '采购对账'
        case 7:
          return '对账申请'
      }
    }
    const typeListSelected = val => {
      // getExportItem(val)
      const { order, goods, goodsManage, purchaseSuggest, purchaseOrdersCustomized, purchaseVerifyItem, purchaseVerifyApplyItem } = state.itemArrlist
      switch (val) {
        case 1:
          return (state.itemlist = order)
        case 2:
          return (state.itemlist = goods)
        case 3:
          return (state.itemlist = goodsManage)
        case 4:
          return (state.itemlist = purchaseSuggest)
        case 5:
          return (state.itemlist = purchaseOrdersCustomized)
        case 6:
          return (state.itemlist = purchaseVerifyItem)
        case 7:
          return (state.itemlist = purchaseVerifyApplyItem)
      }
    }
    return {
      ...toRefs(state),
      handleSelectionChange,
      closeDialog,
      deleteRow,
      tempFilter,
      handleSizeChange,
      handleCurrentChange,
      getlist,
      selectClick,
      typeSelected,
      tempFilterSort
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

:deep(.el-table__header-wrapper) {
  .el-table__header {
    border: 1px solid rgb(232, 232, 232);
    box-sizing: border-box;
    width: unset;
  }

  .cell {
    color: #000;
  }

  th:nth-child(n + 2) {
    text-align: center;
  }

  th {
    border-bottom: 0;
  }
}

:deep(.el-table__body) {
  .el-table_1_column_2 .cell {
    text-align: center;
  }
}

.editmode {
  display: flex;
  justify-content: space-between;

  a:last-child {
    color: #fd4c60;
  }

  a {
    color: #359eff;
    text-decoration: none;
  }
}

.el-icon-check {
  color: #fff;
}
</style>
