/**
 * composition-api 采购报价/物流报价页面表格及相关操作
 */
import { reactive, toRefs, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { getQuoteList, getRemarkDetail, purchaseExport, logisticsExport } from '@/api/goods/quotation.js'
import { sourceData, authTypeOptions } from '@/assets/js/staticData.js'
import { statusTransfer } from './static.js'
import { deepCopy } from '@/utils/tool.js'
import { erpElTable } from 'hooks'
import { ElMessage, ElMessageBox } from 'element-plus'
import { sessionStorage } from 'storage'

export default function quoteTableList(form, ctx) {
  const router = useRouter()
  const erpTableOpts = erpElTable(getQuoteList, form, {
    pagination: {
      pageSizes: [100, 200, 300, 500, 1000],
      pageSize: 100
    },
    dataFilter: data => {
      const arr = []
      data.forEach(each => {
        each.checked = false
        each.authTypeLabel = authTypeOptions.find(r => r.value === each.authType).label
        const parent = sourceData.find(e => e.value === each.mode)
        each.sourceLabel = parent?.label
        each.statusLabel = statusTransfer[each.status]
        if (each.source) {
          each.sourceLabel = parent?.label + '-' + each.source
        }
        arr.push(deepCopy(each))
        arr.push(deepCopy(each))
      })
      // 64800000 18小时 21600000 6小时 86400000 24小时
      if (form.goodsStatus === 2) {
        state.purchaseOvers = data.filter(a => Date.now() - new Date(a.applyTime).getTime() >= 64800000).length
        state.summaryOvers = data.filter(b => Date.now() - new Date(b.applyTime).getTime() >= 86400000).length
      }
      if (form.goodsStatus === 4) {
        state.purchaseOvers = data.filter(c => new Date(c.purchaseTime).getTime() - new Date(c.applyTime).getTime() >= 64800000).length
        state.logisticOvers = data.filter(d => Date.now() - new Date(d.purchaseTime).getTime() >= 21600000).length
        state.summaryOvers = data.filter(e => Date.now() - new Date(e.applyTime).getTime() >= 86400000).length
      }
      resetSomeState()
      return arr
    },
    callBack: data => {
      state.tableRef.loadData(data)
      state.tableRef.refreshColumn()
    }
  }) // hooks获取表格及分页数据和函数

  const state = reactive({
    returnDialogVisible: false, // 批量打回弹窗控制器
    selections: [], // 选中的id集合
    selectRows: [], // 选中的row集合
    selectedAll: false, // 是否全选
    batchIds: [], // 批量打回的id集合
    remarkDialogVisible: false, // 添加备注弹窗控制器
    remarkDetail: [], // 备注细节
    importDialogVisible: false, // 导入采购信息弹窗控制器
    purchaseOvers: 0, // 采购报价超时条数
    logisticOvers: 0, // 物流报价超时条数
    summaryOvers: 0, // 总超时条数
    showBackPurchase: false, // 批量打回采购控制器
    tableRef: null
  })

  function resetSomeState() {
    state.selections = []
    state.selectRows = []
    state.batchIds = []
    state.selectedAll = false
  }

  // 采购报价、物流报价 单条报价
  function singleQuote(name, id) {
		const str = JSON.stringify(erpTableOpts.tableData?.value.filter((v,i)=>i%2===0))
		window.sessionStorage.setItem('goodsLIstPurchaseQuote',str)
    const query = {
      combine: 1,
      id,
    }
    router.push({ name, query })
  }

  // 采购报价、物流报价 批量报价
  function batchQuote(name) {
    let queryIds = []
    queryIds = deepCopy(state.selections)
    const query = {}
    // 未选择
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择需要报价的商品' })
      return false
    }
    if (name === 'PurchaseBatch') {
      let count = 0 // 定制品数量
      let ncount = 0 // 普通商品数量
      state.selectRows.map(row => {
        if (row.enableCustom == 1) {
          count = count + 1
        } else {
          ncount = ncount + 1
        }
      })
      if (count > 0 && ncount > 0) {
        ElMessage.error({ message: '请选择相同类型的商品' })
        return false
      }
      query.type = count > 0 ? 1 : 0
    }

    // 最多保留勾选的前50个商品
    if (queryIds.length > 50) {
      queryIds.splice(50)
    }
    query.ids = queryIds.join(',')
    router.push({ name, query })
  }

  // 采购报价-合并商品
  function goCombine(name) {
    // 未选择
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择需要合并的商品' })
      return false
    }
    // 最多五个
    if (state.selections.length > 5) {
      ElMessage.error({ message: '最多五个商品同时合并' })
      return false
    }
    // 品类不同不能合并
    const categoryId = state.selectRows[0].categoryId
    const idx = state.selectRows.findIndex(row => row.categoryId !== categoryId)
    if (idx !== -1) {
      ElMessage.error({ message: '商品品类不同不能合并商品' })
      return false
    }
    // 包含定制品
    // const index = state.selectRows.findIndex(row => row.skuType === 3)
    // if (index !== -1) {
    //   ElMessage.error({ message: '定制品暂不支持合并商品' })
    //   return false
    // }
    // 申请新SKU、申新开启报价状态、变更品类申请报价三类商品不能被合并
    const arr = []
    state.selectRows.map(row => {
      if (row.offerStatus !== 0 && row.status === 6) {
        arr.push(row.id)
      }
    })
    if (arr.length > 0) {
      const str = arr.join('、')
      ElMessage.error({ message: `商品编码：${str}为已报价中申请新规格商品，不能被合并！` })
      return false
    }

    const query = {}
    query.ids = state.selections.join(',')
    sessionStorage.set('combine_goods', state.selectRows)
    router.push({ name, query })
  }

  // 关闭弹窗
  function closeDialog(refresh) {
    state.returnDialogVisible = false
    state.importDialogVisible = false
    state.showBackPurchase = false
    if (refresh) {
      erpTableOpts.search()
      ctx.emit('refresh')
    }
  }

  // 搜索方法
  function searchAndRefresh() {
    erpTableOpts.search()
    ctx.emit('refresh')
  }

  // 单选一行
  function selectRow(row) {
    if (row.checked) {
      if (state.selections.indexOf(row.id) === -1) {
        state.selections.push(row.id)
        state.selectRows.push(row)
      }
    } else {
      const index = state.selections.indexOf(row.id)
      state.selections.splice(index, 1)
      state.selectRows.splice(index, 1)
    }
    const length = erpTableOpts.tableData.value.length / 2
    state.selectedAll = state.selections.length === length
  }

  // 全选 全不选
  function selectAll(value) {
    erpTableOpts.tableData.value.map(row => {
      row.checked = value
      selectRow(row)
    })
  }

  // 采购报价表格合并单元格
  function colspanMethodP({ rowIndex, columnIndex }) {
    if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 10 }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    }
  }

  // 物流报价表格合并单元格
  function colspanMethodL({ rowIndex, columnIndex }) {
    if (rowIndex % 2 === 0) {
      if (columnIndex === 0) {
        return { rowspan: 1, colspan: 10 }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    }
  }

  // 批量打回
  function batchReject() {
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择商品' })
      return
    }
    // 过滤掉申请新SKU、申新开启报价状态、变更品类申请报价三类商品
    state.selectRows.map(row => {
      if (row.offerStatus === 0) {
        state.batchIds.push(row.id)
      }
    })
    // 如果全是则提示
    if (!state.batchIds.length) {
      ElMessage.error({ message: '申请新规格、打开报价、变更品类、变更类型申请报价的商品不能拒绝报价！' })
      return
    }
    state.returnDialogVisible = true
  }
  function batchRejectPurchase() {
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择商品' })
      return
    }
    state.batchIds = state.selectRows.map(item => item.id)
    // 如果全是则提示
    if (!state.batchIds.length) {
      ElMessage.error({ message: '修改采购信息申请物流报价的不能打回'})
      return
    }

    state.showBackPurchase = true
  }
  // 添加备注
  function openRemarkDialog() {
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择商品' })
      return
    }
    state.remarkDialogVisible = true
  }

  // 关闭添加备注的弹窗
  function closeRemarkDialog(refresh) {
    state.remarkDialogVisible = false
    if (refresh) {
      erpTableOpts.search()
      ctx.emit('refresh')
    }
  }

  // 查询备注列表
  let showRemarkDetail = (goodsId, typeId) => {
    let params = {
      goodsId,
      typeId
    }
    getRemarkDetail(params).then(res => {
      state.remarkDetail = res.data
    })
  }

  // 查看详情
  function openDetail(id, type) {
    router.push({ name: 'ApplyGoodsDetail', query: { id, type } })
  }

  // 导出商品
  function exportGoods(type) {
    if (!state.selections.length) {
      ElMessage.error({ message: '请先选择商品' })
      return
    }
    // if (type === 'purchase' && state.selectRows.findIndex(row => row.enableCustom !== 1) === -1) {
    //   ElMessage.error({ message: '暂时只支持普通商品导出' })
    //   return
    // }
    let goodsIdList = []
    // if (type === 'purchase') {
    //   state.selectRows.map(row => {
    //     if (row.enableCustom !== 1) {
    //       goodsIdList.push(row.id)
    //     }
    //   })
    // } else {
      goodsIdList = state.selectRows.map(row => row.id)
    // }
    const func = type === 'purchase' ? purchaseExport : logisticsExport
    func({
      goodsIdList
    }).then(r => {
      ElMessage.success({ message: '导出成功' })
      window.open(r.data.msg, '_blank')
    })
  }

  // 查看打回原因
  function showRefuseReason(reason) {
    ElMessageBox.alert(reason, '打回原因', {
      showCancelButton: false,
      showClose: false
    })
  }

  return {
    ...toRefs(state),
    ...erpTableOpts,
    singleQuote,
    batchQuote,
    closeDialog,
    selectAll,
    selectRow,
    colspanMethodP,
    colspanMethodL,
    batchReject,
    goCombine,
    openDetail,
    openRemarkDialog,
    closeRemarkDialog,
    showRemarkDetail,
    searchAndRefresh,
    exportGoods,
    showRefuseReason,
    batchRejectPurchase
  }
}
