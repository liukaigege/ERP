import {
  list, // T01: 商品刊登列表
  categoryId, // 查询带权限品类下拉列表、
  publishShopSelect //刊登店铺下拉
} from '@/api/goods/goodsPublish.js'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus';
import { computed } from 'vue'
import { getRemarkTypes as remarkTypes } from '@/api/goods/quotedPrice.js'
import { remarkDetail } from '@/api/goods/quotedPrice'
export default function (state) {
  //初始化
  const init = () => {
    state.loading = true
    state.form.page = {}
    state.form.page.pageNo = state.current
    state.form.page.pageSize = state.size
    list(state.form)
      .then(res => {
        state.loading = false
        if (res.code == 200) {
          const arr = []
          state.checkOptions = []
          res.data.dataList.forEach(item => {
            state.checkOptions.push(item.id)
            item.isChecked = false
            arr.push(deepCopy(item))
            arr.push(deepCopy(item))
          })
          state.dataList = arr
          state.paginationTotal = res.data.page.totalCount
          state.selectGoodsId.length = 0
          state.checkedList = false
          state.isIndeterminate = false
        } else {
          ElMessage.error({ message: res.data })
        }
      })
  }

  // 获取品类选择信息
  const checkedDept = param => {
    if (param) {
      state.form.categoryId = param[param.length - 1]
    } else {
      state.form.categoryId = ''
    }
  }
  function publishShopSelects() {
    publishShopSelect()
      .then(res => {
        if (res.code == 200) {
          state.publishShop = res.data
        } else {
          ElMessage.error({ message: res.data })
        }
      })

  }

  // 时间控件
  const changeTime = value => {
    if (value) {
      state.form.start = value[0] ? value[0] + ' 00:00:00' : null
      state.form.end = value[1] ? value[1] + ' 23:59:59' : null
    } else {
      state.form.start = ''
      state.form.end = ''
    }

  }

  // 来源
  const changeSource = param => {
    if (!param) {
      state.form.mode = ''
      state.form.source = ''
      state.goodsSource = ''
    } else if (param.length > 1) {
      state.form.mode = param[0]
      state.form.source = param[1]
      state.goodsSource = param[1]
    } else if (param.length == 1) {
      state.form.mode = param[0]
      state.form.source = ''
      state.goodsSource = param[0]
    }
  }
  // 查询备注类型
  const getRemarkTypes = () => {
    let params = {
      useScope: '1'
    }
    remarkTypes(params)
      .then(res => {
        if (res.code == 200) {
          let arr = []
          res.data.forEach(item => {
            let obj = {
              color: item.color,
              value: item.id,
              label: item.name,
              checked: false,
              word: item.word
            }
            arr.push(obj)
          })
          state.remakeOptions = arr
        } else {
          ElMessage.error(res.message)
        }
      })

  }
  // // 勾选备注类型
  let changeRemake = () => {
    let arr = []
    state.remakeOptions.forEach(item => {
      if (item.checked) {
        arr.push(item.value)
      }
    })
    state.form.remarkTypeIds = arr.join(',')
  }

  // 品类
  function categoryIdList() {
    categoryId()
      .then(res => {
        if (res.code == 200) {
          state.categoryIdArr = res.data
        } else {
          ElMessage.error({ message: res.message })
        }
      })

  }

  // 排序
  const sort = sortName => {
    if (sortName === 'asc') {
      state.form.sortType = 'desc'
    } else {
      state.form.sortType = 'asc'
    }
    init()
  }
  const generateClass = sortName => {
    if (sortName === 'asc') {
      return 'el-icon-caret-top'
    } else {
      return 'el-icon-caret-bottom'
    }
  }
  const statusName = computed(() => val => {
    switch (val) {
      case 1:
        return '加入刊登'
      case 2:
        return '刊登成功'
      case 3:
        return '刊登失败'
      case 4:
        return '下架'
      case 5:
        return '上架'
    }
  })

  const shopPlatformWord = computed(() => val => {
    switch (val) {
      case 'vshop':
        return 'Vshop'
      case 'shoplazza':
        return '店匠'
      case 'shopify':
        return 'Shopify'
      case 'shopline':
        return 'ShopLine'
      case 'funpinpin':
        return 'FunPinPin'
      case 'xshoppy':
        return 'XShoppy'
      case 'shopyy':
        return 'Shopyy'
      case 'shopbase':
        return 'ShopBase'
    }
  })
  const mode = computed(() => val => {
    switch (val) {
      //0平台采集 1独立站采集 2手动 3导入',
      case 0:
        return '平台采集'
      case 1:
        return '独立站采集'
      case 2:
        return '手动添加'
      case 3:
        return '导入表格'
      case 4:
        return '复制'
    }
  })
  // 查询备注列表
  let showEvent = (goodsId, typeId) => {
    state.remarkDetail = []
    let params = {
      goodsId,
      typeId
    }
    remarkDetail(params).then(res => {
      if (res.code == 200) {
        state.remarkLists = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  // let remarkText = computed(() => {
  //   return (typeId) => {
  //     let obj = {}
  //     console.log(typeId, state.remakeOptions)
  //     state.remakeOptions.forEach(item => {
  //       if (typeId == item.value) {
  //         obj.word = item.word
  //         obj.color = item.color
  //         obj.type = item.label
  //       }
  //     })
  //     return obj
  //   }
  // })
  return {
    categoryIdList,
    changeRemake,
    init,
    getRemarkTypes,
    changeSource,
    changeTime,
    checkedDept,
    publishShopSelects,
    sort,
    generateClass,
    statusName,
    shopPlatformWord,
    mode,
    showEvent,
  }
}
