import { goodsList, goodsNum, getCategory, getRemarkTypes as remarkTypes, labelList } from '@/api/goods/quotedPrice.js'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus';
import { nextTick } from 'vue';
export default function(state, formRef, tableRef,deptIdsRef, route) {
  // 时间选择变化时的回调
  let changeDate = (value) => {
    state.form.start = value[0] ? value[0] + ' 00:00:00' : null
    state.form.end = value[1] ? value[1] + ' 23:59:59' : null
  }

  // 商品来源变化时的回调
  let changeSource = (value) => {
    if (value) {
      state.form.mode = value[0]
      value[1] ? state.form.source = value[1] : state.form.source = null
    } else {
      state.form.mode = null
      state.form.source = null
    }
  }

  let initFun = () => {
    state.selections = []
    state.selectRows = []
    state.selectedAll = false
    state.tableData.map(item => item.checked = false)
  }

  // 查询
  let searchEvent = () => {
    state.loading = true
    const data = formDataHandler()
   
    goodsList(data).then((res) => {
      if (res.code == 200) {
        let arr = []
        res.data.dataList.forEach((item, index) => {
          if (item.createTime) item.createTime = item.createTime.substr(0, 16)
          if (item.applyTime) item.applyTime = item.applyTime.substr(0, 16)
          if (item.refuseTime) item.refuseTime = item.refuseTime.substr(0, 16)
          if (item.layTime) item.layTime = item.layTime.substr(0, 16)
          if (item.purchaseTime) item.purchaseTime = item.purchaseTime.substr(0, 16)
          arr.push(deepCopy(item))
          arr.push(deepCopy(item))
        })
        state.tableData = arr
        state.totalCount = res.data.page.totalCount
        // 64800000 18小时 21600000 6小时 86400000 24小时
        state.purchaseOvers = res.data.dataList.filter(c => new Date(c.purchaseTime).getTime() - new Date(c.applyTime).getTime() >= 64800000).length
        state.logisticOvers = res.data.dataList.filter(d => new Date(d.logisticsTime).getTime() - new Date(d.purchaseTime).getTime() >= 21600000).length
        state.summaryOvers = res.data.dataList.filter(e => new Date(e.logisticsTime).getTime() - new Date(e.applyTime).getTime() >= 86400000).length
        initFun()
        tableRef.value.loadData(arr)
        // 从详情返回列表时滚动到之前点击的商品的位置
        // if (route.params.goodsId && arr.some(item => item.id == route.params.goodsId)) {
        //   nextTick(() => {
        //     let dom = document.querySelector('#goodsId_' + route.params.goodsId)
        //     dom.scrollIntoView({ block: 'center', inline: 'nearest' })
        //   })
        // }
      } else {
        tableRef.value.loadData([])
        state.tableData = []
        ElMessage.error(res.message)
      }
      tableRef.value.refreshColumn()
      state.loading = false
    }).catch(err => {
      tableRef.value.refreshColumn()
      state.loading = false
      tableRef.value.loadData([])
      state.tableData = []

    })
  }

  // 查询列表商品数量
  let getGoodsNum = (goodsStatus) => {
    let params = {
      goodsStatus
    }
    goodsNum(params).then(res => {
      if (res.code == 200) {
        if (goodsStatus == 1) {
          state.quotationSingleNum = res.data.quotationSingleNum
          state.quotationCombineNum = res.data.quotationCombineNum
        } else {
          state.noQuotedPendingNum = res.data.noQuotedPendingNum
          state.quotedRefuseNum = res.data.quotedRefuseNum
        }
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  let getcategoryId = (list) => {
    list.some(item => {
      if (item.child) getcategoryId(item.child)
      if (item.name == route.params.categoryName) {
        state.form.categoryId = item.id
        return true
      }
    })
  }

  // 查询带权限的品类列表
  let getCategoryEvent = () => {
    return new Promise((resolve, resject) => {
      getCategory().then(res => {
        if (res.code == 200) {
          state.categoryList = res.data
          state.categoryOptions = res.data  // 批量修改品类下品类枚举
          if (route && route.params?.categoryName) getcategoryId(res.data)
          resolve()
        } else {
          ElMessage.error(res.message)
        }
      })
    })
  }

  // 查询备注类型
  let getRemarkTypes = () => {
    let params = {
      useScope: '1'
    }
    remarkTypes(params).then(res => {
      if (res.code == 200) {
        let arr = []
        res.data.forEach(item => {
          let obj = {
            value: item.id,
            label: item.name,
            checked: false,
            word: item.word,
            color: item.color
          }
          arr.push(obj)
        })
        state.remakeOptions = arr
        console.log(arr)
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 勾选备注类型
  let changeRemake = () => {
    let arr = []
    state.remakeOptions.forEach(item => {
      if (item.checked) {
        arr.push(item.value)
      }
    })
    state.form.remarkTypeIds = arr.join(',')
  }

  // 重置
  let resetForm = (goodsStatus, bole = true) => {
    formRef.value.resetFields()
    if (goodsStatus == 6 || goodsStatus == 7) { // 已报价、搁置中
      if (state.remakeOptions) {
        state.remakeOptions.forEach(item => {
          item.checked = false
        })
        state.form.remarkTypeIds = ''
      }
    }
    state.form.mode = null
    state.form.source = null
    if (bole) searchEvent()
  }

  // 获取标签列表
  let getLabelList = () => {
    let params = {
      page: {
        pageNo: 1,
        pageSize: 500
      },
      status: 1
    }
    labelList(params).then(res => {
      if (res.code == 200) {
        state.labelList = res.data.dataList
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  function formDataHandler(){ // 特殊处理
    const data = deepCopy(state.form)

    if(data.combineType == 1) delete data.customsComplete // 单品不需要这个字段，组合品需要
    return data
  }
  return {
    changeDate,
    changeSource,
    searchEvent,
    resetForm,
    getGoodsNum,
    getCategoryEvent,
    getRemarkTypes,
    changeRemake,
    getLabelList
  }
}
